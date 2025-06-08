'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface Event {
    id?: number;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
}

interface RegistrationFormProps {
    event?: Event | null ; // Make event optional for creation, include it for editing
    eventId?: number; // Keep eventId for the route, but it won't be used directly for form fields
}

export default function RegistrationForm({ event }: RegistrationFormProps) {
    const router = useRouter();

    // const awaitedEvent = await Promise.resolve(event)
    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');
    const [date, setDate] = useState(event?.date ? new Date(event.date).toISOString().substring(0, 16) : '');
    const [location, setLocation] = useState(event?.location || '');
    const [capacity, setCapacity] = useState(event?.capacity || 0);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
            console.log("event",event)
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setDate(new Date(event.date).toISOString().substring(0, 16));
            setLocation(event.location);
            setCapacity(event.capacity);
        }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const eventData = {
            title,
            description,
            date: new Date(date).toISOString(),
            location,
            capacity: Number(capacity),
        };

        try {
            const url = event?.id ? `/api/events/${event.id}` : '/api/events';
            const method = event?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to save event');
            }

            router.push('/events'); // Redirect to events list after save
        } catch (err: unknown) {
            setError((err as Error).message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{event ? `Edit Event: ${event.title}` : 'Create New Event'}</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date & Time</label>
                    <input
                        type="datetime-local"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                        type="number"
                        id="capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        required
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : event?.id ? 'Update Event' : 'Create Event'}
                </button>
            </form>
        </div>
    );
} 