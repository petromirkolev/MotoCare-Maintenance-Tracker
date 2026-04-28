import { v4 as uuidv4 } from 'uuid';
import { getAll, runQuery } from '../db-helpers';
import { MaintenanceLogRow } from '../types/index';

export async function listMaintenanceLogsByBikeId(
  bike_id: string,
): Promise<MaintenanceLogRow[]> {
  return getAll<MaintenanceLogRow>(
    'SELECT * FROM maintenance_logs WHERE bike_id = $1 ORDER BY date DESC, created_at DESC',
    [bike_id],
  );
}

export async function createMaintenanceLog(params: {
  bike_id: string;
  name: string;
  date: string;
  odo: number;
}): Promise<void> {
  await runQuery(
    `
      INSERT INTO maintenance_logs (
        id,
        bike_id,
        name,
        date,
        odo,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      uuidv4(),
      params.bike_id,
      params.name,
      params.date,
      params.odo,
      new Date().toISOString(),
    ],
  );
}
