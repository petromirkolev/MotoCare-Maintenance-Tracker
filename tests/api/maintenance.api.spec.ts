import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { uniqueEmail, API_URL, PASSWORD, makeBike } from '../utils/test-data';

type LoginResponse = {
  message: string;
  user: {
    id: string;
  };
};

async function registerUser(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<void> {
  const response = await request.post(`${API_URL}/auth/register`, {
    data: {
      email,
      password,
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.message).toBe('User registered successfully');
}

async function loginUser(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<LoginResponse> {
  const response = await request.post(`${API_URL}/auth/login`, {
    data: {
      email,
      password,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.message).toBe('Login successful');

  return body as LoginResponse;
}

async function createBike(
  request: APIRequestContext,
  user_id: string,
  overrides: Partial<{
    make: string;
    model: string;
    year: number;
    odo: number;
  }> = {},
): Promise<APIResponse> {
  const bike = makeBike();
  const response = await request.post(`${API_URL}/bikes`, {
    data: {
      user_id,
      make: bike.make,
      model: bike.model,
      year: Number(bike.year),
      odo: Number(bike.odometer),
      ...overrides,
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.message).toBe('Bike created successfully');

  return response;
}

async function listFirstBike(
  request: APIRequestContext,
  user_id: string,
): Promise<any> {
  const response = await request.get(`${API_URL}/bikes?user_id=${user_id}`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  return body.bikes[0];
}

async function logMaintenance(
  request: APIRequestContext,
  bike_id: string,
  overrides: Partial<{
    bike_id: string;
    name: 'oil-change' | 'coolant-change';
    date: string;
    odo: number;
  }>,
) {
  const response = await request.post(`${API_URL}/maintenance/log`, {
    data: {
      bike_id,
      name: overrides.name,
      date: overrides.date,
      odo: overrides.odo,
    },
  });

  return response;
}

async function scheduleMaintenance(
  request: APIRequestContext,
  bike_id: string,
  overrides: Partial<{
    name: 'oil-change' | 'coolant-change';
    interval_km: number;
    interval_days: number;
  }>,
) {
  const response = await request.post(`${API_URL}/maintenance/schedule`, {
    data: {
      bike_id,
      name: overrides.name,
      interval_km: overrides.interval_km,
      interval_days: overrides.interval_days,
    },
  });

  return response;
}

async function getMaintenance(
  request: APIRequestContext,
  bike_id: string,
): Promise<APIResponse> {
  const response = await request.get(
    `${API_URL}/maintenance?bike_id=${bike_id}`,
  );

  return response;
}

test.describe('Maintenance API test suite', () => {
  let email: string;
  let user_id: string;
  let bike_id: string;

  test.beforeEach(async ({ request }) => {
    email = uniqueEmail('api-maintenance');
    await registerUser(request, email);
    const body = await loginUser(request, email);
    user_id = body.user.id;
  });

  test('Maintenance log with valid date/odo succeeds', async ({ request }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const logResponse = await logMaintenance(request, bike_id, {
      name: 'oil-change',
      date: '2026-03-16',
      odo: 500,
    });

    expect(logResponse.status()).toBe(201);

    const logBody = await logResponse.json();

    expect(logBody.message).toBe('Maintenance created successfully');

    const jobResponse = await getMaintenance(request, bike_id);

    expect(jobResponse.status()).toBe(200);

    const jobBody = await jobResponse.json();
    const maintenance = jobBody.maintenance[0];

    expect(jobBody.maintenance).toHaveLength(1);
    expect(maintenance.bike_id).toBe(bike_id);
    expect(maintenance.name).toBe('oil-change');
    expect(maintenance.date).toBe('2026-03-16');
    expect(maintenance.odo).toBe(500);
  });

  test('Maintenance log with negative odo is rejected', async ({ request }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const logResponse = await logMaintenance(request, bike_id, {
      name: 'oil-change',
      date: '2026-03-16',
      odo: -500,
    });

    expect(logResponse.status()).toBe(400);

    const upsertBody = await logResponse.json();

    expect(upsertBody.error).toBe('odo must be a non-negative integer');
  });

  test('Maintenance log for bike A does not affect bike B', async ({
    request,
  }) => {
    const bikeOneResponse = await createBike(request, user_id);
    const bikeOneBody = await bikeOneResponse.json();
    bike_id = bikeOneBody.bike.id;

    const bikeTwoResponse = await createBike(request, user_id);
    const bikeTwoBody = await bikeTwoResponse.json();
    const bike_id_2 = bikeTwoBody.bike.id;

    const logResponse = await logMaintenance(request, bike_id, {
      name: 'oil-change',
      date: '2026-03-16',
      odo: 1000,
    });

    expect(logResponse.status()).toBe(201);

    const logBody = await logResponse.json();

    expect(logBody.message).toBe('Maintenance created successfully');

    const bikeOneGetMaintenance = await getMaintenance(request, bike_id);

    expect(bikeOneGetMaintenance.status()).toBe(200);

    const bikeOneMaintenanceBody = await bikeOneGetMaintenance.json();

    const bikeOneMaintenance = bikeOneMaintenanceBody.maintenance[0];

    expect(bikeOneMaintenanceBody.maintenance).toHaveLength(1);
    expect(bikeOneMaintenance.bike_id).toBe(bike_id);
    expect(bikeOneMaintenance.name).toBe('oil-change');

    const bikeTwoGetMaintenance = await getMaintenance(request, bike_id_2);

    expect(bikeTwoGetMaintenance.status()).toBe(200);

    const bikeTwoMaintenanceBody = await bikeTwoGetMaintenance.json();
    const bikeTwoMaintenance = bikeTwoMaintenanceBody.maintenance[0];

    expect(bikeTwoMaintenanceBody.maintenance).toHaveLength(0);
  });

  test('Logging one maintenance item does not affect another item', async ({
    request,
  }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const oilResponse = await logMaintenance(request, bike_id, {
      name: 'oil-change',
      date: '2026-03-16',
      odo: 500,
    });

    expect(oilResponse.status()).toBe(201);

    const oilBody = await oilResponse.json();

    expect(oilBody.message).toBe('Maintenance created successfully');

    const coolantResponse = await logMaintenance(request, bike_id, {
      name: 'coolant-change',
      date: '2026-03-17',
      odo: 1000,
    });

    expect(coolantResponse.status()).toBe(201);

    const coolantBody = await coolantResponse.json();

    expect(coolantBody.message).toBe('Maintenance created successfully');

    const maintenanceResponse = await getMaintenance(request, bike_id);

    expect(maintenanceResponse.status()).toBe(200);

    const maintenanceBody = await maintenanceResponse.json();
    const coolantMaintenance = maintenanceBody.maintenance[0];
    const oilMaintenance = maintenanceBody.maintenance[1];

    expect(maintenanceBody.maintenance).toHaveLength(2);

    expect(oilMaintenance.bike_id).toBe(bike_id);
    expect(oilMaintenance.name).toBe('oil-change');
    expect(oilMaintenance.date).toBe('2026-03-16');
    expect(oilMaintenance.odo).toBe(500);

    expect(coolantMaintenance.bike_id).toBe(bike_id);
    expect(coolantMaintenance.name).toBe('coolant-change');
    expect(coolantMaintenance.date).toBe('2026-03-17');
    expect(coolantMaintenance.odo).toBe(1000);
  });

  test('Maintenance schedule with valid days/km succeeds', async ({
    request,
  }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const logResponse = await scheduleMaintenance(request, bike_id, {
      name: 'oil-change',
      interval_km: 1000,
      interval_days: 100,
    });

    expect(logResponse.status()).toBe(201);

    const logBody = await logResponse.json();

    expect(logBody.message).toBe('Maintenance scheduled successfully');

    const getResponse = await getMaintenance(request, bike_id);

    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();

    expect(getBody.maintenance).toHaveLength(1);
    expect(getBody.maintenance[0].bike_id).toBe(bike_id);
    expect(getBody.maintenance[0].name).toBe('oil-change');
    expect(getBody.maintenance[0].interval_km).toBe(1000);
    expect(getBody.maintenance[0].interval_days).toBe(100);
  });

  test('Maintenance schedule with missing days is rejected', async ({
    request,
  }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const logResponse = await scheduleMaintenance(request, bike_id, {
      name: 'oil-change',
      interval_km: 1000,
    });

    expect(logResponse.status()).toBe(400);

    const logBody = await logResponse.json();

    expect(logBody.error).toBe('interval_days is required');
  });

  test('Maintenance schedule with missing kilometers is rejected', async ({
    request,
  }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const logResponse = await scheduleMaintenance(request, bike_id, {
      name: 'oil-change',
      interval_days: 100,
    });

    expect(logResponse.status()).toBe(400);

    const logBody = await logResponse.json();

    expect(logBody.error).toBe('interval_km is required');
  });

  test('Maintenance schedule for bike A does not affect bike B', async ({
    request,
  }) => {
    const bike_1 = await createBike(request, user_id);
    const bike_1_body = await bike_1.json();
    const bike_1_id = bike_1_body.bike.id;

    const bike_2 = await createBike(request, user_id);
    const bike_2_body = await bike_2.json();
    const bike_2_id = bike_2_body.bike.id;

    const schedule_oil_service_bike_1 = await scheduleMaintenance(
      request,
      bike_id,
      {
        name: 'oil-change',
        interval_km: 1000,
        interval_days: 100,
      },
    );

    expect(schedule_oil_service_bike_1.status()).toBe(201);

    const oil_service_bike_1_body = await schedule_oil_service_bike_1.json();

    expect(oil_service_bike_1_body.message).toBe(
      'Maintenance scheduled successfully',
    );

    const schedule_coolant_service_bike_2 = await scheduleMaintenance(
      request,
      bike_2_id,
      { name: 'coolant-change', interval_km: 2000, interval_days: 200 },
    );

    expect(schedule_coolant_service_bike_2.status()).toBe(201);

    const coolant_service_bike_2_body =
      await schedule_coolant_service_bike_2.json();

    expect(coolant_service_bike_2_body.message).toBe(
      'Maintenance scheduled successfully',
    );

    const maintenance_bike_1 = await getMaintenance(request, bike_1_id);

    expect(maintenance_bike_1.status()).toBe(200);

    const bike_1_list_maintenance = await maintenance_bike_1.json();

    console.log(bike_1_list_maintenance);

    expect(bike_1_list_maintenance.maintenance).toHaveLength(1);

    const maintenance_bike_2 = await getMaintenance(request, bike_2_id);

    expect(maintenance_bike_2.status()).toBe(201);

    const bike_2_list_maintenance = await maintenance_bike_2.json();

    expect(bike_2_list_maintenance.maintenance).toHaveLength(0);
  });
});
