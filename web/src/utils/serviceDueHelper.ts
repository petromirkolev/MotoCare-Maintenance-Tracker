export function checkDueStatus(item: any, today: string) {
  if (!item.intervalDays || !item.date) return;

  const nextDate: any = new Date(item.date);
  nextDate.setDate(nextDate.getDate() + Number(item.intervalDays));
  const currentDate: any = new Date(today);
  const dueDays = (nextDate - currentDate) / 86400000;

  if (dueDays < 30) return item;
}
