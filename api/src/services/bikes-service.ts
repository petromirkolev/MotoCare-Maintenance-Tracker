import { v4 as uuidv4 } from 'uuid';
import { getAll, getOne, runQuery } from '../db-helpers';
import { BikeRow } from '../types/bike';

export async function createBike(params: {
  userId: string;
  make: string;
  model: string;
  year: number;
  odo: number;
}): Promise<void> {
  await runQuery(
    `
      INSERT INTO bikes (id, user_id, make, model, year, odo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      uuidv4(),
      params.userId,
      params.make,
      params.model,
      params.year,
      params.odo,
      new Date().toISOString(),
    ],
  );
}

export async function findBikeById(id: string): Promise<BikeRow | undefined> {
  return getOne<BikeRow>('SELECT * FROM bikes WHERE id = ?', [id]);
}

export async function listBikesByUserId(userId: string): Promise<BikeRow[]> {
  return getAll<BikeRow>(
    'SELECT * FROM bikes WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
  );
}
