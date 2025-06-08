-- Events table
CREATE TABLE
    IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        location TEXT,
        capacity INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- Registrations table
CREATE TABLE
    IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events (id)
    );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events (date);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations (event_id);

CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_events_timestamp AFTER
UPDATE ON events BEGIN
UPDATE events
SET
    updated_at = CURRENT_TIMESTAMP
WHERE
    id = NEW.id;

END;