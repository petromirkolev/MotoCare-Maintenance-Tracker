import type { Bike } from '../types/bikes';
import { getState, updateState, setState, newId } from './stateStorage';

export function readBikeForm(form: HTMLFormElement) {
  const fd = new FormData(form);

  const make = String(fd.get('make') ?? '').trim();
  const model = String(fd.get('model') ?? '').trim();

  const yearRaw = String(fd.get('year') ?? '').trim();
  const year = Number(yearRaw);

  const odoRaw = String(fd.get('odo') ?? '').trim();
  const odo = Number(odoRaw);

  if (!make) throw new Error('Make is required');
  if (!model) throw new Error('Model is required');
  if (!Number.isFinite(year)) throw new Error('Year must be a number');
  if (!Number.isFinite(odo)) throw new Error('Odometer must be a number');

  return { make, year, model, odo };
}

export const bikeStore = {
  getBikes(): Bike[] {
    return [...getState().bikes];
  },

  getBike(id: string): Bike | undefined {
    return getState().bikes.find((b) => b.id === id);
  },

  addBike(input: Omit<Bike, 'id'>): Bike {
    if (!input.make.trim()) throw new Error('Bike name required');
    if (!Number.isFinite(input.year) || input.year < 1900) {
      throw new Error('Invalid year');
    }
    if (!input.model.trim()) throw new Error('Bike model required');
    if (!Number.isFinite(input.odo) || input.odo < 0) {
      throw new Error('Invalid odometer');
    }

    const bike: Bike = {
      id: newId(),
      make: input.make.trim(),
      year: Math.floor(input.year),
      model: input.model.trim(),
      odo: Math.floor(input.odo),
    };

    updateState((prev) => ({
      ...prev,
      bikes: [bike, ...prev.bikes],
    }));

    return bike;
  },

  deleteBike(id: string | undefined) {
    if (!id) return;

    updateState((prev) => ({
      ...prev,
      bikes: prev.bikes.filter((b) => b.id !== id),
      maintenance: prev.maintenance.filter((m) => m.bikeId !== id),
      maintenanceLog: prev.maintenanceLog.filter((l) => l.bikeId !== id),
    }));
  },

  updateBike(id: string, patch: Partial<Omit<Bike, 'id'>>) {
    const current = getState().bikes.find((b) => b.id === id);
    if (!current) throw new Error('Bike not found');

    const next: Bike = {
      ...current,
      ...patch,
    };

    if (patch.odo !== undefined && patch.odo < current.odo) {
      throw new Error('Odometer cannot decrease');
    }

    next.make = next.make.trim();
    next.model = next.model.trim();
    next.year = Math.floor(next.year);
    next.odo = Math.floor(next.odo);

    updateState((prev) => ({
      ...prev,
      bikes: prev.bikes.map((b) => (b.id === id ? next : b)),
    }));
  },

  reset() {
    setState({ bikes: [], maintenance: [], maintenanceLog: [] });
  },
};
