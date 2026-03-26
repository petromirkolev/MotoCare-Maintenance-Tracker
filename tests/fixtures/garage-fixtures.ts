import { makeBike } from '../utils/test-data';
import { test as base, expect } from './auth-fixtures';

type GarageFixtures = {
  bikeInput: {
    make: string;
    model: string;
    year: string;
    odometer: string;
  };
};

export const test = base.extend<GarageFixtures>({
  bikeInput: async ({}, use) => {
    const bike = makeBike();
    await use(bike);
  },
});

export { expect };
