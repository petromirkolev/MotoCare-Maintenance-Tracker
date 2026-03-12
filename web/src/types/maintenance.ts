/* Types related to maintenance records and schedules */

export type Maintenance = {
  id: string;
  bike_id: string;
  name: string;
  date: string | null;
  odo: number | null;
  interval_km: number | null;
  interval_days: number | null;
};

export type MaintenanceLogInput = {
  date: string | null;
  odo: number | null;
};

export type MaintenanceScheduleInput = {
  interval_days: string | null;
  interval_km: number | null;
};

export type MaintenanceDto = {
  id: string;
  bike_id: string;
  name: string;
  date: string | null;
  odo: number | null;
  interval_km: number | null;
  interval_days: number | null;
  created_at: string;
};

export type ListMaintenanceResponse = {
  maintenance: MaintenanceDto[];
};

export type UpsertMaintenanceResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};
