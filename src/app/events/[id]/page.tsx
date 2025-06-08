import { format } from 'date-fns';
import RegistrationForm from './RegistrationForm';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    registration_count: number;
    capacity: number;
}

async function getEvent(id: string): Promise<Event> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error('Failed to fetch event');
    }
    return res.json();
}

type PageProps = {
    params: {
        id: string;
    };
};

export default async function EventPage({ params }: PageProps) {
    const event = await Promise.resolve(getEvent(params.id));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="space-y-4">
                        <p className="text-gray-600">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-500">
                            <div>
                                <p className="font-semibold">Date & Time</p>
                                <p>{format(new Date(event.date), 'PPP p')}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Location</p>
                                <p>{event.location}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Capacity</p>
                                <p>{event.registration_count} / {event.capacity} registered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {event.registration_count < event.capacity && (
                    <RegistrationForm eventId={event.id} />
                )}
            </div>
        </div>
    );
} 