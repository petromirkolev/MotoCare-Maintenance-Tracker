import { test, expect } from '@playwright/test';
import { GaragePage } from '../pages/garage-page';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';

function makeBike() {
  return {
    make: `Test Bike ${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    model: 'Tracer 9 GT',
    year: '2021',
    odometer: '1000',
  };
}

test.describe('Garage edit bike test suite', () => {
  let garagePage: GaragePage;
  const email = 'garage-seeded@example.com';
  const password = 'testingpass';

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const registerPage = new RegisterPage(page);

    await registerPage.gotoreg();
    await registerPage.register(email, password);
    await registerPage.expectSuccess('Registration successful');

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    garagePage = new GaragePage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);
    await loginPage.expectSuccess('Login success, opening garage...');
    await garagePage.expectLoaded();

    const bike = makeBike();

    await garagePage.fillAndSubmitBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);
  });

  test('Edit bike with valid data updates the bike', async ({ page }) => {
    const bikeName = await page.locator('.bikeCard__name').innerText();

    await garagePage.fillAndSubmitBikeEditForm({
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: '2022',
      odometer: '1100',
    });
    await expect(garagePage.garageGrid).toBeVisible();
    await expect(garagePage.editBikeScreen).not.toBeVisible();
    await garagePage.expectBikeVisible('Yamaha');
    await garagePage.expectBikeNotVisible(bikeName);
  });

  test('Cancel edit bike does not change bike data', async () => {});
});
