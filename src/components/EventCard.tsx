import { format } from 'date-fns';
import Link from 'next/link';

interface EventCardProps {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    registrationCount: number;
    capacity: number;
}

export default function EventCard({
    id,
    title,
    description,
    date,
    location,
    registrationCount,
    capacity
}: EventCardProps) {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="py-3 px-4 text-gray-800 font-medium">{title}</td>
            <td className="py-3 px-4 text-gray-600 truncate">{description}</td>
            <td className="py-3 px-4 text-gray-600">{format(new Date(date), 'PPP p')}</td>
            <td className="py-3 px-4 text-gray-600">{location}</td>
            <td className="py-3 px-4 text-gray-600">
                <div className="flex items-center">
                    <span>{registrationCount} / {capacity}</span>
                    <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(registrationCount / capacity) * 100}%` }}
                        />
                    </div>
                </div>
            </td>
            <td className="py-3 px-4 text-right space-x-2">
                <Link
                    href={`/events/${id}/register`}
                    className="text-blue-600 hover:underline"
                >
                    Edit
                </Link>
                <Link
                    href={`/events/${id}`}
                    className="text-gray-600 hover:underline"
                >
                    View
                </Link>
            </td>
        </tr>
    );
} 