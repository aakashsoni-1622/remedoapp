import { NextResponse } from "next/server";
import db from "@/lib/db";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, context: Promise<RouteParams>) {
  try {
    const { params } = await context;
    const body = await request.json();
    const { name, email } = body;

    // Check if event exists and has capacity
    const event = db
      .prepare(
        `
                SELECT e.*, COUNT(r.id) as registration_count
                FROM events e
                LEFT JOIN registrations r ON e.id = r.event_id
                WHERE e.id = ?
                GROUP BY e.id
            `
      )
      .get(params.id) as
      | { registration_count: number; capacity: number }
      | undefined;

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.registration_count >= event.capacity) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    // Check if user is already registered
    const existingRegistration = db
      .prepare(
        `
                SELECT id FROM registrations
                WHERE event_id = ? AND email = ?
            `
      )
      .get(params.id, email);

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // Create registration
    const result = db
      .prepare(
        `
                INSERT INTO registrations (event_id, name, email)
                VALUES (?, ?, ?)
            `
      )
      .run(params.id, name, email);

    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}
