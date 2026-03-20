import type {
  Maintenance,
  MaintenanceLogInput,
  MaintenanceScheduleInput,
} from '../types/maintenance';
import { getState } from './state-store';
import { appState } from '../types/state';
import { checkDueStatus } from '../utils/service-due-helper';
import { checkOverdueStatus } from '../utils/service-overdue-helper';
import { checkServiceItemsStatus } from '../utils/service-items-helper';
import { markDueTasks, markOverdueTasks } from '../utils/dom-helper';

export const maintenanceStore = {
  readMaintenanceLogForm(form: HTMLFormElement): MaintenanceLogInput {
    const fd = new FormData(form);

    const date: string = String(fd.get('doneAt') ?? '').trim();
    const odoRaw: string = String(fd.get('odo') ?? '').trim();
    const odo = Number(odoRaw);
    console.log(odo);

    if (!date) throw new Error('Date is required');
    if (odo === null || odo === undefined) throw new Error('Odo is required');

    return { date, odo };
  },

  readMaintenanceScheduleForm(form: HTMLFormElement): MaintenanceScheduleInput {
    const fd = new FormData(form);

    const interval_days: string = String(fd.get('interval_days') ?? '').trim();
    const interval_kmRaw: string = String(fd.get('interval_km') ?? '').trim();
    const interval_km = Number(interval_kmRaw);

    if (!interval_days) throw new Error('Interval days are required');
    if (!interval_km) throw new Error('Interval kilometers are required');

    return { interval_days, interval_km };
  },

  getMaintenanceTask(bikeId: string, name: string): Maintenance | undefined {
    return getState().maintenance.find(
      (a) => a.bike_id === bikeId && a.name === name,
    );
  },

  updateTaskInfo(bikeId: string) {
    document.querySelectorAll('.mcard').forEach((cardEl) => {
      const card = cardEl as HTMLElement;

      const taskName = card.dataset.name;
      if (!taskName) return;

      const lastVal = card.querySelector<HTMLElement>(
        '[data-field="last"] .metaVal',
      );
      const dueVal = card.querySelector<HTMLElement>(
        '[data-field="due"] .metaVal',
      );

      if (!lastVal || !dueVal) return;

      const task = this.getMaintenanceTask(bikeId, taskName);

      if (!task) {
        lastVal.textContent = 'Never logged';
        dueVal.textContent = 'Not scheduled yet';
        return;
      }

      const date = task.date ? new Date(task.date) : null;
      const formatted = date?.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      if (task.date && task.odo !== null) {
        lastVal.textContent = `${formatted} at ${task.odo} km.`;
      } else {
        lastVal.textContent = 'Never logged';
      }

      if (!task.date || task.odo === null) {
        if (task.interval_days && task.interval_km) {
          dueVal.textContent = `Every ${task.interval_days} days or ${task.interval_km} km.`;
        } else if (task.interval_days) {
          dueVal.textContent = `Every ${task.interval_days} days.`;
        } else if (task.interval_km) {
          dueVal.textContent = `Every ${task.interval_km} km.`;
        } else {
          dueVal.textContent = 'Not done yet';
        }
        return;
      }

      const dueParts: string[] = [];

      if (task.interval_days) {
        const nextDate = new Date(task.date);
        nextDate.setDate(nextDate.getDate() + Number(task.interval_days));

        const formattedDate = nextDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        dueParts.push(`${formattedDate}`);
      }

      if (task.interval_km) {
        dueParts.push(`at ${Number(task.interval_km) + Number(task.odo)} km`);
      }

      dueVal.textContent =
        dueParts.length > 0 ? dueParts.join(' or ') + '.' : 'Not done yet';
    });
  },

  updateOverallProgress(dom: any) {
    const items = getState();

    const selectedBike = appState.selectedBikeId;
    if (!selectedBike) return;

    const today = new Date().toISOString().slice(0, 10);
    const lastServicedItem = items.maintenanceLog.find(
      (item) => item.bike_id === selectedBike,
    );

    const totalServiceItems = items.maintenance.filter((item) =>
      checkServiceItemsStatus(item, selectedBike),
    );

    const totalDueItems = items.maintenance.filter((item) =>
      checkDueStatus(item, selectedBike, today),
    );

    const totalOverdueItems = items.maintenance.filter((item) =>
      checkOverdueStatus(item, selectedBike, today),
    );

    // Update "Recent History"
    if (lastServicedItem !== undefined) {
      dom.maintenanceHistory.querySelector('.empty__title').textContent =
        lastServicedItem.name
          ?.split('-')
          .map((a) => a.toUpperCase())
          .join(' ');

      const date = lastServicedItem.date
        ? new Date(lastServicedItem.date)
        : null;

      const formatted = date?.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      dom.maintenanceHistory.querySelector('.empty__sub').textContent =
        `Done on ${formatted} at ${lastServicedItem.odo} km.`;
    } else {
      dom.maintenanceHistory.querySelector('.empty__title').textContent =
        'No service history yet';
      dom.maintenanceHistory.querySelector('.empty__sub').textContent =
        'Log a service to start building your maintenance timeline.';
    }

    // Update Overdue / Due Soon / On Track
    dom.maintenanceOnTrack.textContent =
      totalServiceItems.length - totalOverdueItems.length;
    dom.maintenanceDueSoon.textContent = totalDueItems.length;
    dom.maintenanceOverdue.textContent = totalOverdueItems.length;

    markOverdueTasks(totalOverdueItems);
    markDueTasks(totalDueItems);
  },
};
