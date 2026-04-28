import { v4 as uuidv4 } from 'uuid';
import { getAll, getOne, runQuery } from '../db-helpers';
import { BikeRow } from '../types/index';

export async function createBike(params: {
  user_id: string;
  make: string;
  model: string;
  year: number;
  odo: number;
}): Promise<string> {
  const id = uuidv4();
  await runQuery(
    `
      INSERT INTO bikes (id, user_id, make, model, year, odo, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      id,
      params.user_id,
      params.make,
      params.model,
      params.year,
      params.odo,
      new Date().toISOString(),
    ],
  );
  return id;
}

export async function findBikeById(id: string): Promise<BikeRow | undefined> {
  return getOne<BikeRow>('SELECT * FROM bikes WHERE id = $1', [id]);
}

export async function listBikesByUserId(user_id: string): Promise<BikeRow[]> {
  return getAll<BikeRow>(
    'SELECT * FROM bikes WHERE user_id = $1 ORDER BY created_at DESC',
    [user_id],
  );
}

export async function updateBike(params: {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  odo: number;
}): Promise<void> {
  await runQuery(
    `
      UPDATE bikes
      SET make = $1, model = $2, year = $3, odo = $4
      WHERE id = $5 AND user_id = $6
    `,
    [
      params.make,
      params.model,
      params.year,
      params.odo,
      params.id,
      params.user_id,
    ],
  );
}

export async function deleteBike(params: {
  id: string;
  user_id: string;
}): Promise<void> {
  await runQuery(
    `
      DELETE FROM bikes
      WHERE id = $1 AND user_id = $2
    `,
    [params.id, params.user_id],
  );
}
