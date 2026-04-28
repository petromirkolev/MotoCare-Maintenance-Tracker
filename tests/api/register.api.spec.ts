import { test } from '../fixtures/api-fixtures';
import { api } from '../utils/api-helpers';
import { messages } from '../../constants/messages';
import { expectApiError, expectApiSuccess } from '../utils/helpers';

test.describe('MMT API - Register', () => {
  test('Register with valid credentials returns 201', async ({
    request,
    validUserInput,
  }) => {
    const response = await api.registerUser(request, validUserInput);

    expectApiSuccess(response, 201, 'message', messages.AUTH_REG_OK);
  });

  test('Register with duplicate email returns 409', async ({
    request,
    validUserInput,
  }) => {
    await api.registerUser(request, validUserInput);

    const duplicateResponse = await api.registerUser(request, validUserInput);

    expectApiError(duplicateResponse, 409, 'error', messages.AUTH_USER_EXISTS);
  });

  test('Register with invalid email returns 400', async ({
    request,
    validUserInput,
    invalidUserInput,
  }) => {
    const response = await api.registerUser(request, {
      ...validUserInput,
      email: invalidUserInput.email,
    });

    expectApiError(response, 400, 'error', messages.AUTH_EMAIL_INVALID);
  });

  test('Register with missing email returns 400', async ({
    request,
    validUserInput,
  }) => {
    const response = await api.registerUser(request, {
      ...validUserInput,
      email: undefined,
    });

    expectApiError(response, 400, 'error', messages.AUTH_FIELDS_REQ);
  });

  test('Register with missing password returns 400', async ({
    request,
    validUserInput,
  }) => {
    const response = await api.registerUser(request, {
      ...validUserInput,
      password: undefined,
    });

    expectApiError(response, 400, 'error', messages.AUTH_FIELDS_REQ);
  });

  test('Register with short password returns 400', async ({
    request,
    validUserInput,
    invalidUserInput,
  }) => {
    const response = await api.registerUser(request, {
      ...validUserInput,
      password: invalidUserInput.shortPassword,
    });

    expectApiError(response, 400, 'error', messages.AUTH_PASS_SHORT);
  });

  test('Register with long password returns 400', async ({
    request,
    validUserInput,
    invalidUserInput,
  }) => {
    const response = await api.registerUser(request, {
      ...validUserInput,
      password: invalidUserInput.longPassword,
    });

    expectApiError(response, 400, 'error', messages.AUTH_PASS_LONG);
  });
});
