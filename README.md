# Event Management System

A modern web application for managing and registering for events, built with Next.js and SQLite.

## Features

- View upcoming events with pagination
- View detailed event information
- Register for events
- Real-time capacity tracking
- Responsive design with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- SQLite (better-sqlite3)
- Tailwind CSS
- date-fns

## Prerequisites

- Node.js 18+ and npm

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd event-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and database configuration
- `/sql` - Database schema and migrations

## API Endpoints

### Events

- `GET /api/events` - List all events (paginated)
- `GET /api/events/[id]` - Get event details
- `POST /api/events/[id]/register` - Register for an event

## Development

### Database

The application uses SQLite with better-sqlite3 for data storage. The schema is automatically initialized when the application starts.

### Adding New Features

1. Create new API routes in `/src/app/api`
2. Add new pages in `/src/app`
3. Create reusable components in `/src/components`

## License

MIT
