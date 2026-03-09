import type { Bike } from './bikes';
import type { Maintenance } from './maintenance';
import type { MaintenanceLog } from './maintenanceLog';

export type StoreState = {
  bikes: Bike[];
  maintenance: Maintenance[];
  maintenanceLog: MaintenanceLog[];
};

type AppState = {
  selectedBikeId: string | undefined;
  selectedBikeFound: Bike | undefined;
  currentMaintenanceItem: string | undefined;
  lastMaintenanceLog: string | undefined;
};

export const appState: AppState = {
  selectedBikeId: undefined,
  selectedBikeFound: undefined,
  currentMaintenanceItem: undefined,
  lastMaintenanceLog: undefined,
};
