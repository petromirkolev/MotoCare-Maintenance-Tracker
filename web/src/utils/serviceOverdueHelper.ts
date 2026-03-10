import { bikeStore } from '../state/bikeStore';

export function checkOverdueStatus(
  item: any,
  selectedBike: string,
  today: string,
) {
  if (!item.intervalDays || !item.date) return;

  const bike = bikeStore.getBike(selectedBike);
  if (!bike) return;

  const nextDate: any = new Date(item.date);
  nextDate.setDate(nextDate.getDate() + Number(item.intervalDays));
  const currentDate: any = new Date(today);
  const dueDays = (nextDate - currentDate) / 86400000;

  const dueKm = Number(item.odo) + Number(item.intervalKm);

  if (dueDays < 0 || bike.odo > dueKm) return item;
}
