import { test } from '../fixtures/auth-fixtures';
import {
  invalidEmailInput,
  invalidPasswordInput,
  validInput,
} from '../utils/test-data';

test.describe('Login page test suite', () => {
  test('User can log in with registered credentials', async ({
    registeredUser,
    loginPage,
    garagePage,
  }) => {
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoginSuccess('Login success, opening garage...');
    await garagePage.expectGarageVisible();
  });

  test('Login fails with unregistered credentials', async ({ loginPage }) => {
    await loginPage.login('nonexistingemail@test.com', 'testingpass');
    await loginPage.expectLoginError('Invalid credentials');
  });

  test('Login with missing email', async ({ loginPage }) => {
    await loginPage.login('', 'testingpass');
    await loginPage.expectLoginError('Email is required');
  });

  test('Login with missing password', async ({ loginPage }) => {
    await loginPage.login('nonexistingemail@test.com', '');
    await loginPage.expectLoginError('Password is required');
  });

  test.describe('Invalid email', () => {
    for (const key of Object.keys(invalidEmailInput)) {
      const { value, testDescription } = invalidEmailInput[key];

      test(`Login fails with: ${testDescription}`, async ({ loginPage }) => {
        await loginPage.login(value, validInput.password);

        if (value === '    ' || value === '') {
          await loginPage.expectLoginError('Email is required');
        } else {
          await loginPage.expectLoginError('Invalid email format');
        }
      });
    }
  });

  test.describe('Invalid password', () => {
    for (const key of Object.keys(invalidPasswordInput)) {
      const { value, testDescription } = invalidPasswordInput[key];

      test(`Login fails with: ${testDescription}`, async ({ loginPage }) => {
        await loginPage.login('invalidpass@test.com', value);

        if (value === '    ' || value === '') {
          await loginPage.expectLoginError('Password is required');
        } else {
          await loginPage.expectLoginError('Invalid credentials');
        }
      });
    }
  });
});
