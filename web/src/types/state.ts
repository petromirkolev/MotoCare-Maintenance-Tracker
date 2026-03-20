import type { Bike } from './bikes';
import type { Maintenance } from './maintenance';
import type { MaintenanceLog } from './maintenance-log';

export type StoreState = {
  bikes: Bike[];
  maintenance: Maintenance[];
  maintenanceLog: MaintenanceLog[];
};

type AppState = {
  selectedBikeId: string | null;
  currentMaintenanceItem: string | null;
};

export const appState: AppState = {
  selectedBikeId: null,
  currentMaintenanceItem: null,
};
