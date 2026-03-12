import { v4 as uuidv4 } from 'uuid';
import { getAll, getOne, runQuery } from '../db-helpers';
import { MaintenanceRow } from '../types/maintenance';

export async function listMaintenanceByBikeId(
  bikeId: string,
): Promise<MaintenanceRow[]> {
  return getAll<MaintenanceRow>(
    'SELECT * FROM maintenance WHERE bike_id = ? ORDER BY created_at DESC',
    [bikeId],
  );
}

export async function findMaintenanceByBikeAndName(
  bikeId: string,
  name: string,
): Promise<MaintenanceRow | undefined> {
  return getOne<MaintenanceRow>(
    'SELECT * FROM maintenance WHERE bike_id = ? AND name = ?',
    [bikeId, name],
  );
}

export async function createMaintenance(params: {
  bikeId: string;
  name: string;
  date: string | null;
  odo: number | null;
  intervalKm: number | null;
  intervalDays: number | null;
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      uuidv4(),
      params.bikeId,
      params.name,
      params.date,
      params.odo,
      params.intervalKm,
      params.intervalDays,
      new Date().toISOString(),
    ],
  );
}
