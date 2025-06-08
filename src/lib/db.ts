import Database from "better-sqlite3";
import { join } from "path";
import { readFileSync } from "fs";

const dbPath = join(process.cwd(), "events.db");
const db = new Database(dbPath);

// Initialize database with schema
const schema = readFileSync(join(process.cwd(), "sql", "schema.sql"), "utf-8");
db.exec(schema);

export default db;
