import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register-page';
import {
  invalidEmailInput,
  invalidPasswordInput,
  validInput,
  uniqueEmail,
} from '../utils/test-data';

test.describe('Register page test suite', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.gotoreg();
  });

  test('User can register with valid credentials', async () => {
    const email = uniqueEmail();
    const password = validInput.password;

    await registerPage.register(email, password);

    await registerPage.expectSuccess('Registration successful!');
  });

  test('User cannot register with same valid credentials', async () => {
    const email = uniqueEmail();
    const password = validInput.password;

    await registerPage.register(email, password);

    await registerPage.expectSuccess('Registration successful!');

    await registerPage.clickCancel();
    await registerPage.gotoreg();

    await registerPage.register(email, password);
    await registerPage.expectError('User already exists');
  });

  test('User cannot register without credentials', async () => {
    await registerPage.submit();
    await registerPage.expectError('Email is required');
  });

  test('User cannot register without email', async () => {
    const password = validInput.password;

    await registerPage.register('', password);
    await registerPage.expectError('Email is required');
  });

  test('User cannot register without password', async () => {
    const email = uniqueEmail();

    await registerPage.register(email, '');

    await registerPage.expectError('Password is required');
  });

  test('User cannot register without confirm password', async () => {
    const email = uniqueEmail();

    await registerPage.fillEmail(email);
    await registerPage.fillPassword(validInput.password);
    await registerPage.fillConfirmPassword('');
    await registerPage.submit();
    await registerPage.expectError('Confirm password is required');
  });

  test('User cannot register with not matching passwords', async () => {
    const email = uniqueEmail();

    await registerPage.fillEmail(email);
    await registerPage.fillPassword(validInput.password);
    await registerPage.fillConfirmPassword('testingthepass');
    await registerPage.submit();
    await registerPage.expectError('Passwords do not match');
  });

  test('Cancel button loads login page', async () => {
    await registerPage.clickCancel();
    await expect(registerPage.registerButton).toBeVisible();
  });

  test.describe('Register with invalid email test suite', () => {
    for (const key of Object.keys(invalidEmailInput)) {
      const { value, testDescription } = invalidEmailInput[key];

      test(`Register with ${testDescription}`, async () => {
        await registerPage.register(value, validInput.password);

        if (value === '    ' || value === '') {
          await registerPage.expectError('Email is required');
        } else {
          await registerPage.expectError('Invalid email format');
        }
      });
    }
  });

  test.describe('Register with invalid password test suite', () => {
    for (const key of Object.keys(invalidPasswordInput)) {
      const { value, testDescription } = invalidPasswordInput[key];
      test(`Invalid password: ${testDescription}`, async () => {
        const email = uniqueEmail();

        await registerPage.register(email, value);

        if (value === '' || value === '    ') {
          await registerPage.expectError('Password is required');
        }

        if (value.length <= 4 && value.trim().length !== 0) {
          await registerPage.expectError(
            'Password must be 8 characters at minimum',
          );
        }

        if (value.length > 32 && value.trim().length !== 0) {
          await registerPage.expectError(
            'Password must be 32 characters at maximum',
          );
        }
      });
    }
  });
});
