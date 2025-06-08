import { NextResponse } from "next/server";
import db from "@/lib/db";

type SQLParam = string | number;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";

  try {
    let query = `
            SELECT e.*, 
                   COUNT(r.id) as registration_count
            FROM events e
            LEFT JOIN registrations r ON e.id = r.event_id
            WHERE e.date >= datetime('now')
        `;
    const params: SQLParam[] = [];

    if (search) {
      query += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (location) {
      query += ` AND e.location LIKE ?`;
      params.push(`%${location}%`);
    }

    query += `
            GROUP BY e.id
            ORDER BY e.date ASC
            LIMIT ? OFFSET ?
        `;
    params.push(limit, offset);

    const events = db.prepare(query).all(...params);

    // Get total count with filters
    let countQuery = `
            SELECT COUNT(*) as count
            FROM events e
            WHERE e.date >= datetime('now')
        `;
    const countParams: SQLParam[] = [];

    if (search) {
      countQuery += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (location) {
      countQuery += ` AND e.location LIKE ?`;
      countParams.push(`%${location}%`);
    }

    const total = db.prepare(countQuery).get(...countParams) as {
      count: number;
    };

    return NextResponse.json({
      events,
      pagination: {
        total: total.count,
        page,
        limit,
        totalPages: Math.ceil(total.count / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, date, location, capacity } = body;

    const result = db
      .prepare(
        `
            INSERT INTO events (title, description, date, location, capacity)
            VALUES (?, ?, ?, ?, ?)
        `
      )
      .run(title, description, date, location, capacity);

    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
