interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  registrationCount: number;
  capacity: number;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
}

interface EventsResponse {
  events: Event[];
  pagination: Pagination;
}

export async function getEvents(
  page = 1,
  search = "",
  location = ""
): Promise<EventsResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(search && { search }),
    ...(location && { location }),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events?${queryParams}`,
    {
      cache: "no-store",
    }
  );

  console.log("res", res);
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export async function getEventById(id: number): Promise<{ event: Event }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  return res.json();
}
