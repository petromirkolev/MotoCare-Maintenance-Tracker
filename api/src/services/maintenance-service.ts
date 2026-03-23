import { v4 as uuidv4 } from 'uuid';
import { getAll, getOne, runQuery } from '../db-helpers';
import { MaintenanceRow } from '../types/maintenance';

export async function listMaintenanceByBikeId(
  bike_id: string,
): Promise<MaintenanceRow[]> {
  return getAll<MaintenanceRow>(
    'SELECT * FROM maintenance WHERE bike_id = $1 ORDER BY created_at DESC',
    [bike_id],
  );
}

export async function findMaintenanceByBikeAndName(
  bike_id: string,
  name: string,
): Promise<MaintenanceRow | undefined> {
  return getOne<MaintenanceRow>(
    'SELECT * FROM maintenance WHERE bike_id = $1 AND name = $2',
    [bike_id, name],
  );
}

export async function createMaintenance(params: {
  bike_id: string;
  name: string;
  date: string | null;
  odo: number | null;
  interval_km: number | null;
  interval_days: number | null;
}): Promise<void> {
  await runQuery(
    `
      INSERT INTO maintenance (
        id,
        bike_id,
        name,
        date,
        odo,
        interval_km,
        interval_days,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      uuidv4(),
      params.bike_id,
      params.name,
      params.date,
      params.odo,
      params.interval_km,
      params.interval_days,
      new Date().toISOString(),
    ],
  );
}

export async function updateMaintenance(params: {
  id: string;
  bike_id: string;
  name: string;
  date: string | null;
  odo: number | null;
  interval_km: number | null;
  interval_days: number | null;
}): Promise<void> {
  await runQuery(
    `
      UPDATE maintenance
      SET
        name = $1,
        date = $2,
        odo = $3,
        interval_km = $4,
        interval_days = $5
      WHERE id = $6 AND bike_id = $7
    `,
    [
      params.name,
      params.date,
      params.odo,
      params.interval_km,
      params.interval_days,
      params.id,
      params.bike_id,
    ],
  );
}
