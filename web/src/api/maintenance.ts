import type {
  MaintenanceDto,
  ListMaintenanceResponse,
  ErrorResponse,
  UpsertMaintenanceResponse,
} from '../types/maintenance';

const API_BASE_URL = 'http://localhost:3001';

export async function fetchMaintenanceByBikeId(
  bike_id: string,
): Promise<MaintenanceDto[]> {
  const response = await fetch(
    `${API_BASE_URL}/maintenance?bike_id=${encodeURIComponent(bike_id)}`,
  );

  const data = (await response.json()) as
    | ListMaintenanceResponse
    | ErrorResponse;

  if (!response.ok) {
    throw new Error(
      'error' in data ? data.error : 'Failed to fetch maintenance',
    );
  }

  return (data as ListMaintenanceResponse).maintenance;
}

export async function upsertMaintenanceApi(input: {
  bike_id: string;
  name: string;
  date: string | null;
  odo: number | null;
  interval_km: number | null;
  interval_days: number | null;
}): Promise<UpsertMaintenanceResponse> {
  const response = await fetch(`${API_BASE_URL}/maintenance/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as
    | UpsertMaintenanceResponse
    | ErrorResponse;

  if (!response.ok) {
    throw new Error(
      'error' in data ? data.error : 'Failed to upsert maintenance',
    );
  }

  return data as UpsertMaintenanceResponse;
}
