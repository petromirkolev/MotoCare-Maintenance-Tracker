import { test } from '../fixtures/api-fixtures';
import { api } from '../utils/api-helpers';
import { messages } from '../../constants/messages';
import { expectApiError, expectApiSuccess } from '../utils/helpers';

test.describe('MMT API - Login', () => {
  test('Login with valid credentials returns 200', async ({
    request,
    registeredUser,
  }) => {
    const loginResponse = await api.loginUser(request, registeredUser);

    expectApiSuccess(loginResponse, 200, 'message', messages.AUTH_LOGIN_OK);
  });

  test('Login with wrong password returns 401', async ({
    request,
    registeredUser,
    invalidUserInput,
  }) => {
    const loginResponse = await api.loginUser(request, {
      ...registeredUser,
      password: invalidUserInput.password,
    });

    expectApiError(loginResponse, 401, 'error', messages.AUTH_CRED_INVALID);
  });

  test('Login with non existing email returns 401', async ({
    request,
    registeredUser,
    invalidUserInput,
  }) => {
    const loginResponse = await api.loginUser(request, {
      ...registeredUser,
      email: invalidUserInput.email,
    });

    expectApiError(loginResponse, 401, 'error', messages.AUTH_CRED_INVALID);
  });

  test('Login with missing email returns 400', async ({
    request,
    registeredUser,
  }) => {
    const loginResponse = await api.loginUser(request, {
      ...registeredUser,
      email: undefined,
    });

    expectApiError(loginResponse, 400, 'error', messages.AUTH_FIELDS_REQ);
  });

  test('Login with missing password returns 400', async ({
    request,
    registeredUser,
  }) => {
    const loginResponse = await api.loginUser(request, {
      ...registeredUser,
      password: undefined,
    });

    expectApiError(loginResponse, 400, 'error', messages.AUTH_FIELDS_REQ);
  });
});
