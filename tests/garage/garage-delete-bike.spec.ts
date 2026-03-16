import { test } from '@playwright/test';
import { GaragePage } from '../pages/garage-page';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';
import { uniqueEmail, makeBike } from '../utils/test-data';

test.describe('Garage delete bike test suite', () => {
  let garagePage: GaragePage;
  let currentUser: { email: string; password: string };

  test.beforeEach(async ({ page }) => {
    currentUser = {
      email: uniqueEmail('garage'),
      password: 'testingpass',
    };

    const registerPage = new RegisterPage(page);
    await registerPage.gotoreg();
    await registerPage.register(currentUser.email, currentUser.password);
    await registerPage.expectSuccess('Registration successful');

    const loginPage = new LoginPage(page);
    garagePage = new GaragePage(page);

    await loginPage.goto();
    await loginPage.login(currentUser.email, currentUser.password);
    await loginPage.expectSuccess('Login success, opening garage...');
    await garagePage.expectGarageLoaded();
  });

  test('Delete bike removes the selected bike', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.deleteBikeByName(bike.make);

    await garagePage.expectBikeNotVisible(bike.make);
  });

  test('Deleting one bike keeps the other bikes visible', async () => {
    const bike = makeBike();
    const bike2 = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillAddBikeForm(bike2);
    await garagePage.expectBikeVisible(bike2.make);

    await garagePage.deleteBikeByName(bike.make);

    await garagePage.expectBikeNotVisible(bike.make);
    await garagePage.expectBikeVisible(bike2.make);
  });
});
