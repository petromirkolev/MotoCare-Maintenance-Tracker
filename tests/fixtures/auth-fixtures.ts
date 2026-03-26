import { test as base, expect } from './base-fixtures';
import { uniqueEmail, validInput } from '../utils/test-data';

type AuthFixtures = {
  registeredUser: { email: string; password: string };
  loggedInUser: { email: string; password: string };
};

export const test = base.extend<AuthFixtures>({
  registeredUser: async ({ registerPage, loginPage }, use) => {
    const user = {
      email: uniqueEmail('register-test'),
      password: validInput.password,
    };

    await registerPage.register(user.email, user.password, user.password);
    await expect(loginPage.loginScreen).toBeVisible();
    await use(user);
  },

  loggedInUser: async ({ registerPage, loginPage, garagePage }, use) => {
    const user = {
      email: uniqueEmail('login-test'),
      password: validInput.password,
    };
    await registerPage.register(user.email, user.password, user.password);
    await expect(loginPage.loginScreen).toBeVisible();

    await loginPage.login(user.email, user.password);
    await garagePage.expectGarageVisible();

    await use(user);
  },
});

export { expect };
