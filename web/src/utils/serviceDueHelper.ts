import { bikeStore } from '../state/bikeStore';

export function checkDueStatus(item: any, selectedBike: string, today: string) {
  if (item.bikeId !== selectedBike) return;
  if (!item.intervalDays || !item.date) return;

  const bike = bikeStore.getBike(selectedBike);
  if (!bike) return;

  const nextDate = new Date(item.date);
  nextDate.setDate(nextDate.getDate() + Number(item.intervalDays));

  const currentDate = new Date(today);

  const dueDays = (nextDate.getTime() - currentDate.getTime()) / 86400000;

  const dueKm =
    item.intervalKm && item.odo
      ? Number(item.odo) + Number(item.intervalKm)
      : null;

  const isOverdueByDate = dueDays < 0;
  const isOverdueByKm = dueKm !== null && Number(bike.odo) > dueKm;

  if (isOverdueByDate || isOverdueByKm) return;

  const isDueSoonByDate = dueDays >= 0 && dueDays <= 30;
  const isDueSoonByKm =
    dueKm !== null &&
    dueKm - Number(bike.odo) >= 0 &&
    dueKm - Number(bike.odo) <= 500;

  if (isDueSoonByDate || isDueSoonByKm) return item;
}
