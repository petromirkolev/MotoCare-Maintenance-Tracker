import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { uniqueEmail, API_URL, PASSWORD } from '../utils/test-data';

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
  const response = await request.post(`${API_URL}/bikes`, {
    data: {
      user_id,
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: 2021,
      odo: 1000,
      ...overrides,
    },
  });

  return response;
}

async function updateBike(
  request: APIRequestContext,
  user_id: string,
  bike_id: string,
  overrides: Partial<{
    id: string;
    make: string;
    model: string;
    year: number;
    odo: number;
  }>,
): Promise<APIResponse> {
  const updateResponse = await request.put(`${API_URL}/bikes/${bike_id}`, {
    data: {
      id: bike_id,
      user_id,
      make: overrides.make,
      model: overrides.model,
      year: overrides.year,
      odo: overrides.odo,
    },
  });
  return updateResponse;
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

test.describe('Garage API test suite', () => {
  let email: string;
  let user_id: string;
  let bike_id: string;

  test.beforeEach(async ({ request }) => {
    email = uniqueEmail('api-garage');
    await registerUser(request, email);
    const body = await loginUser(request, email);
    user_id = body.user.id;
  });

  test('Create bike with valid data succeeds', async ({ request }) => {
    const response = await createBike(request, user_id);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.message).toBe('Bike created successfully');
  });

  test('Create bike with invalid year above maximum is rejected', async ({
    request,
  }) => {
    const response = await createBike(request, user_id, { year: 2101 });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Year must be an integer between 1900 and 2100');
  });

  test('Create bike with invalid year below minimum is rejected', async ({
    request,
  }) => {
    const response = await createBike(request, user_id, { year: 1899 });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Year must be an integer between 1900 and 2100');
  });

  test('Create bike with negative odometer is rejected', async ({
    request,
  }) => {
    const response = await createBike(request, user_id, { odo: -100 });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Odometer must be a non-negative integer');
  });

  test('Update bike with valid data succeeds', async ({ request }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const updateResponse = await updateBike(request, user_id, bike_id, {
      make: 'Honda',
      model: 'Rebel',
      odo: 1000,
      year: 2010,
    });

    expect(updateResponse.status()).toBe(200);

    const updateBody = await updateResponse.json();
    expect(updateBody.message).toBe('Bike updated successfully');

    const bike = await listFirstBike(request, user_id);
    expect(bike.make).toBe('Honda');
    expect(bike.model).toBe('Rebel');
  });

  test('Update bike with lower odometer is rejected', async ({ request }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const updateResponse = await updateBike(request, user_id, bike_id, {
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: 2021,
      odo: 900,
    });

    expect(updateResponse.status()).toBe(400);

    const updateBody = await updateResponse.json();
    expect(updateBody.error).toBe('Odometer cannot decrease');
  });

  test('Delete bike succeeds', async ({ request }) => {
    const bikeResponse = await createBike(request, user_id);
    const body = await bikeResponse.json();
    bike_id = body.bike.id;

    const deleteResponse = await request.delete(
      `${API_URL}/bikes/${bike_id}?user_id=${user_id}`,
    );

    expect(deleteResponse.status()).toBe(200);

    const deleteBody = await deleteResponse.json();
    expect(deleteBody.message).toBe('Bike deleted successfully');

    const bike = await listFirstBike(request, user_id);
    expect(bike).toBeUndefined();
  });
});
