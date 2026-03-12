/* Types related to maintenance logs and records */

export type MaintenanceLog = {
  id: string;
  bikeId: string;
  name: string;
  date: string | null;
  odo: number | null;
  intervalKm: number | null;
  intervalDays: number | null;
};
