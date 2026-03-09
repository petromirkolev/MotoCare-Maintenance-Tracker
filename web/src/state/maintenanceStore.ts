import type { Maintenance } from '../types/maintenance';
import { bikeStore, state, notify, saveState } from './bikeStore';

export function readMaintenanceLogForm(form: HTMLFormElement) {
  const fd = new FormData(form);

  const date = String(fd.get('doneAt') ?? '').trim();
  const odo = String(fd.get('odo') ?? '').trim();

  if (!date) throw new Error('Date is required');
  if (!odo) throw new Error('Odo is required');

  return { date, odo };
}

// function newId(): string {
//   return String(Date.now());
// }

function getMaintenanceForBike(
  bikeId: string | undefined,
): Maintenance | undefined {
  return state.maintenance.find((a: any) => a.bikeId === bikeId);
}

export const maintenanceStore = {
  addMaintenanceTask(input: Object, bikeId: string) {
    const selectedBike = bikeStore.getBike(bikeId);
    const maintenanceRecords = getMaintenanceForBike(bikeId);

    if (maintenanceRecords !== undefined) {
    } else {
      console.log('No maintenance records found.');
    }

    console.log(input);
    console.log(selectedBike);
    console.log(maintenanceRecords);

    // odo should not be less than actual odo
  },

  // updateMaintenanceTask(id, patch) {},

  // deleteMaintenanceTask(id) {},

  updateTaskInfo() {},

  updateRecentHistory() {},

  updateMaintenanceItemProgress() {},

  updateOverallProgress() {},

  schedule() {
    console.log('log scheduled');
  },
};
