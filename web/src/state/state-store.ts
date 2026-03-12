/* State store for the application */

import { fetchBikes } from '../api/bikes';
import { fetchMaintenanceByBikeId } from '../api/maintenance';
import { fetchMaintenanceLogsByBikeId } from '../api/maintenance-logs';
import type { StoreState } from '../types/state';

const STORAGE_KEY = 'motocare:v1:bikes';
const listeners = new Set<() => void>();
let state: StoreState = {
  bikes: [],
  maintenance: [],
  maintenanceLog: [],
};

async function initState(): Promise<void> {
  state = await loadState();
}

async function loadState(): Promise<StoreState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<StoreState>) : {};

    const bikes = await fetchBikes();

    return {
      bikes: Array.isArray(bikes) ? bikes : [],
      maintenance: Array.isArray(parsed.maintenance) ? parsed.maintenance : [],
      maintenanceLog: Array.isArray(parsed.maintenanceLog)
        ? parsed.maintenanceLog
        : [],
    };
  } catch {
    return { bikes: [], maintenance: [], maintenanceLog: [] };
  }
}

function getState(): StoreState {
  return state;
}

function setState(nextState: StoreState): void {
  state = nextState;
  notify();
}

function updateState(updater: (prev: StoreState) => StoreState): void {
  state = updater(state);
  notify();
}

function saveState(state: StoreState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function refreshBikes(): Promise<void> {
  const bikes = await fetchBikes();

  state = {
    ...state,
    bikes: Array.isArray(bikes) ? bikes : [],
  };
}

async function refreshMaintenance(bikeId: string): Promise<void> {
  const maintenance = await fetchMaintenanceByBikeId(bikeId);

  state = {
    ...state,
    maintenance: Array.isArray(maintenance) ? maintenance : [],
  };
}

async function refreshMaintenanceLogs(bikeId: string): Promise<void> {
  const maintenanceLog = await fetchMaintenanceLogsByBikeId(bikeId);

  state = {
    ...state,
    maintenanceLog: Array.isArray(maintenanceLog) ? maintenanceLog : [],
  };
}

function newId(): string {
  return String(Date.now());
}

function notify() {
  saveState(state);
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export {
  STORAGE_KEY,
  initState,
  listeners,
  newId,
  loadState,
  saveState,
  notify,
  subscribe,
  setState,
  getState,
  updateState,
  refreshBikes,
  refreshMaintenance,
  refreshMaintenanceLogs,
};
