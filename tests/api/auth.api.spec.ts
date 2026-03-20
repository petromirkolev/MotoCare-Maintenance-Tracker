import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { uniqueEmail, API_URL, PASSWORD } from '../utils/test-data';

async function registerUser(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<APIResponse> {
  const response = await request.post(`${API_URL}/auth/register`, {
    data: {
      email,
      password,
    },
  });

  return response;
}

async function loginUser(
  request: APIRequestContext,
  email: string,
  password = PASSWORD,
): Promise<APIResponse> {
  const loginResponse = await request.post(`${API_URL}/auth/login`, {
    data: {
      email,
      password,
    },
  });

  return loginResponse;
}

test.describe('Auth API test suite', () => {
  let email: string;

  test.beforeEach(async () => {
    email = uniqueEmail('api-auth');
  });

  test('Register with valid credentials succeeds', async ({ request }) => {
    const response = await registerUser(request, email, PASSWORD);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.message).toBe('User registered successfully');
  });

  test('Register with duplicate email is rejected', async ({ request }) => {
    await registerUser(request, email);

    const duplicateResponse = await registerUser(request, email, PASSWORD);

    expect(duplicateResponse.status()).toBe(409);

    const duplicateBody = await duplicateResponse.json();
    expect(duplicateBody.error).toBe('User already exists');
  });

  test('Register with invalid email is rejected', async ({ request }) => {
    const response = await registerUser(request, '##@abv.bg', PASSWORD);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Invalid email format');
  });

  test('Register with missing email is rejected', async ({ request }) => {
    const response = await registerUser(request, '', PASSWORD);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Email and password are required');
  });

  test('Register with missing password is rejected', async ({ request }) => {
    const response = await registerUser(request, email, '');

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Email and password are required');
  });

  test('Register with short password is rejected', async ({ request }) => {
    const response = await registerUser(request, email, 'test');

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Password must be at least 8 characters');
  });

  test('Register with long password is rejected', async ({ request }) => {
    const response = await registerUser(
      request,
      email,
      'testingthesuperlongpasswordtwotimestestingthesuperlongpasswordtwotimes',
    );

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Password must be 32 characters at most');
  });

  test('Login with valid credentials succeeds', async ({ request }) => {
    await registerUser(request, email, PASSWORD);

    const loginResponse = await loginUser(request, email, PASSWORD);

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    expect(loginBody.message).toBe('Login successful');
  });

  test('Login with wrong password is rejected', async ({ request }) => {
    await registerUser(request, email, PASSWORD);

    const loginResponse = await loginUser(request, email, 'testingpass123');

    expect(loginResponse.status()).toBe(401);

    const loginBody = await loginResponse.json();
    expect(loginBody.error).toBe('Invalid credentials');
  });

  test('Login with non existing email is rejected', async ({ request }) => {
    const loginResponse = await loginUser(request, 'test@gmail.com', PASSWORD);

    expect(loginResponse.status()).toBe(401);

    const loginBody = await loginResponse.json();
    expect(loginBody.error).toBe('Invalid credentials');
  });

  test('Login with missing email is rejected', async ({ request }) => {
    const loginResponse = await loginUser(request, '', PASSWORD);

    expect(loginResponse.status()).toBe(400);

    const loginBody = await loginResponse.json();
    expect(loginBody.error).toBe('Email and password are required');
  });

  test('Login with missing password is rejected', async ({ request }) => {
    const loginResponse = await loginUser(request, email, '');

    expect(loginResponse.status()).toBe(400);

    const loginBody = await loginResponse.json();
    expect(loginBody.error).toBe('Email and password are required');
  });
});
