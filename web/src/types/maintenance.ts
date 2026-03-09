export type Maintenance = {
  id: string;
  bikeId: string;
  name: string | undefined;
  date: string | null;
  odo: string | null;
  nextOdo: string | null;
  nextDate: string | null;
};
