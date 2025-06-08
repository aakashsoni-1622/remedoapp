import { NextResponse } from "next/server";
import db from "@/lib/db";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, context: Promise<RouteParams>) {
  try {
    const { params } = await context;
    const event = db
      .prepare(
        `
                SELECT e.*, 
                       COUNT(r.id) as registration_count
                FROM events e
                LEFT JOIN registrations r ON e.id = r.event_id
                WHERE e.id = ?
                GROUP BY e.id
            `
      )
      .get(params?.id) as
      | { registration_count: number; capacity: number }
      | undefined;

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: Promise<RouteParams>) {
  try {
    const { params } = await context;
    const body = await request.json();
    const { title, description, date, location, capacity } = body;

    const result = db
      .prepare(
        `
                UPDATE events
                SET title = ?, description = ?, date = ?, location = ?, capacity = ?
                WHERE id = ?
            `
      )
      .run(title, description, date, location, capacity, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
