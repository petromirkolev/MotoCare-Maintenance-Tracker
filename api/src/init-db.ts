import { runQuery } from './db-helpers';

export async function initDb(): Promise<void> {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS bikes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      odo INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS maintenance (
      id TEXT PRIMARY KEY,
      bike_id TEXT NOT NULL,
      name TEXT NOT NULL,
      date TEXT,
      odo INTEGER,
      interval_km INTEGER,
      interval_days INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY (bike_id) REFERENCES bikes(id)
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS maintenance_logs (
      id TEXT PRIMARY KEY,
      bike_id TEXT NOT NULL,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      odo INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (bike_id) REFERENCES bikes(id)
    )
  `);
}
