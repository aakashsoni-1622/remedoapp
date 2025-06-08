import { getEventById } from '@/lib/events';
import RegistrationForm from '@/app/events/[id]/RegistrationForm';

interface EventRegisterPageProps {
    params: { id: string };
}

export default async function EventRegisterPage({ params }: EventRegisterPageProps) {
    const eventId = await Promise.resolve(Number(params.id));
    let eventData = null;

    if (eventId) {
        try {
            const res = await getEventById(eventId);
            eventData = res;
        } catch (error) {
            console.error('Failed to fetch event data:', error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{eventData ? `Edit Event: ${eventData.title}` : 'Register for Event'}</h1>
            <RegistrationForm event={eventData} />
        </div>
    );
} 