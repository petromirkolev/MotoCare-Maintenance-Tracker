import { bikeStore } from '../state/bike-store';
import type { Maintenance } from '../types/maintenance';

export function checkOverdueStatus(
  item: Maintenance,
  selectedBike: string,
  today: string,
) {
  if (item.bike_id !== selectedBike) return;

  const bike = bikeStore.getBike(selectedBike);
  if (!bike) return;

  let isOverdueByDate = false;
  let isOverdueByKm = false;

  if (item.interval_days && item.date) {
    const nextDate = new Date(item.date);
    nextDate.setDate(nextDate.getDate() + Number(item.interval_days));

    const currentDate = new Date(today);
    const dueDays = (nextDate.getTime() - currentDate.getTime()) / 86400000;

    isOverdueByDate = dueDays < 0;
  }

  if (item.interval_km) {
    const hasOdoBaseline = item.odo !== undefined && item.odo !== null;

    if (!hasOdoBaseline) {
      isOverdueByKm = true;
    } else {
      const dueKm = Number(item.odo) + Number(item.interval_km);
      isOverdueByKm = Number(bike.odo) > dueKm;
    }
  }

  if (isOverdueByDate || isOverdueByKm) return item;
}
