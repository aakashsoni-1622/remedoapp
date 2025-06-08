import EventCard from '@/components/EventCard';
import Link from 'next/link';

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  registration_count: number;
  capacity: number;
};

async function getEvents(page = 1, search = '', location = '') {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(location && { location })
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?${queryParams}`, {
        cache: 'no-store'
    });
    return res.json();
}

export default async function EventsPage({
    searchParams
}: {
    searchParams: { page?: string; search?: string; location?: string }
}) {
    const params = await Promise.resolve(searchParams);
    const page = Number(params.page) || 1;
    const search = params.search || '';
    const location = params.location || '';
    const { events, pagination } = await getEvents(page, search, location);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Events</h1>
                <Link
                    href="/admin/events/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Create Event
                </Link>
            </div>

            <div className="mb-8">
                <form className="flex gap-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search events..."
                        defaultValue={search}
                        className="flex-1 px-4 py-2 border rounded"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Filter by location..."
                        defaultValue={location}
                        className="flex-1 px-4 py-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Filter
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event: Event) => (
                            <EventCard
                                key={event.id}
                                id={event.id}
                                title={event.title}
                                description={event.description}
                                date={event.date}
                                location={event.location}
                                registrationCount={event.registration_count}
                                capacity={event.capacity}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Link
                            key={pageNum}
                            href={`/events?page=${pageNum}${search ? `&search=${search}` : ''}${location ? `&location=${location}` : ''}`}
                            className={`px-4 py-2 rounded ${
                                pageNum === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {pageNum}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
} 