export type Maintenance = {
  id: string;
  bikeId: string;
  name: string | undefined;
  date: string | null;
  odo: string | null;
  intervalKm: string | null;
  intervalDays: string | null;
};
