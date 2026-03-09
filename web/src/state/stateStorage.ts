import type { StoreState } from '../types/state';

const STORAGE_KEY = 'motocare:v1:bikes';
const listeners = new Set<() => void>();
let state: StoreState = loadState();

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

function newId(): string {
  return String(Date.now());
}

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { bikes: [], maintenance: [], maintenanceLog: [] };
    }
    const parsed = JSON.parse(raw) as Partial<StoreState>;

    return {
      bikes: Array.isArray(parsed.bikes) ? parsed.bikes : [],
      maintenance: Array.isArray(parsed.maintenance) ? parsed.maintenance : [],
      maintenanceLog: Array.isArray(parsed.maintenanceLog)
        ? parsed.maintenanceLog
        : [],
    };
  } catch {
    return { bikes: [], maintenance: [], maintenanceLog: [] };
  }
}

function saveState(state: StoreState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  listeners,
  newId,
  loadState,
  saveState,
  notify,
  subscribe,
  setState,
  getState,
  updateState,
};
