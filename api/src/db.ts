import { Pool } from 'pg';
import { messages } from './constants/messages';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(messages.SYS_DB_URL_REQ);
}

export const db = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
