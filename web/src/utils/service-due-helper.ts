/* Helper functions for checking the due status of maintenance items based on date and odometer readings. */

import { bikeStore } from '../state/bike-store';
import type { Maintenance } from '../types/maintenance';

export function checkDueStatus(
  item: Maintenance,
  selectedBike: string,
  today: string,
) {
  if (item.bike_id !== selectedBike) return;
  if (!item.date) return;

  const bike = bikeStore.getBike(selectedBike);
  if (!bike) return;

  let isDueSoonByDate = false;
  let isDueSoonByKm = false;
  let isOverdueByDate = false;
  let isOverdueByKm = false;

  if (item.interval_days) {
    const intervalDays = Number(item.interval_days);

    const nextDate = new Date(item.date);
    nextDate.setDate(nextDate.getDate() + intervalDays);

    const currentDate = new Date(today);
    const dueDays = (nextDate.getTime() - currentDate.getTime()) / 86400000;

    isOverdueByDate = dueDays < 0;

    isDueSoonByDate = dueDays >= 0 && dueDays <= 30 && dueDays < intervalDays;
  }

  if (item.interval_km) {
    const intervalKm = Number(item.interval_km);
    const dueKm = Number(item.odo) + intervalKm;
    const kmRemaining = dueKm - Number(bike.odo);

    isOverdueByKm = kmRemaining < 0;

    isDueSoonByKm =
      kmRemaining >= 0 && kmRemaining <= 500 && kmRemaining < intervalKm;
  }

  if (isOverdueByDate || isOverdueByKm) return;
  if (isDueSoonByDate || isDueSoonByKm) return item;
}
