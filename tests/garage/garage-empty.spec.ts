import { expect, test } from '@playwright/test';
import { GaragePage } from '../pages/garage-page';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';
import { uniqueEmail, makeBike } from '../utils/test-data';

test.describe('Garage empty state test suite', () => {
  let garagePage: GaragePage;

  test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);

    garagePage = new GaragePage(page);

    const currentUser = {
      email: uniqueEmail('garage'),
      password: 'testingpass',
    };

    await registerPage.gotoreg();
    await registerPage.register(currentUser.email, currentUser.password);
    await registerPage.expectSuccess('Registration successful');

    await loginPage.goto();
    await loginPage.login(currentUser.email, currentUser.password);
    await loginPage.expectSuccess('Login success, opening garage...');
    await garagePage.expectGarageLoaded();
  });

  test('Garage shows empty state when no bikes are added', async ({ page }) => {
    await expect(page.locator('[data-testid="garage-empty"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="garage-empty"] .empty__title'),
    ).toHaveText('No motorcycles yet');
    await expect(
      page.locator('[data-testid="garage-empty"] .empty__sub'),
    ).toHaveText('Add your first bike to start tracking maintenance.');
  });

  test('Garage shows empty state when all bikes are deleted', async ({
    page,
  }) => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);
    await garagePage.deleteBikeByName(bike.make);
    await garagePage.expectBikeNotVisible(bike.make);

    await expect(page.locator('[data-testid="garage-empty"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="garage-empty"] .empty__title'),
    ).toHaveText('No motorcycles yet');
    await expect(
      page.locator('[data-testid="garage-empty"] .empty__sub'),
    ).toHaveText('Add your first bike to start tracking maintenance.');
  });
});
