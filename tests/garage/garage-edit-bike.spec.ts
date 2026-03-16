import { test, expect } from '@playwright/test';
import { GaragePage } from '../pages/garage-page';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';
import { uniqueEmail, makeBike } from '../utils/test-data';

test.describe('Garage edit bike test suite', () => {
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

  test('Edit bike with valid data updates the bike', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillEditBikeForm({
      make: 'Yamaha',
      model: 'Tracer 9GT',
      year: '2022',
      odometer: '1100',
    });

    await expect(garagePage.garageGrid).toBeVisible();
    await expect(garagePage.editBikeScreen).not.toBeVisible();
    await garagePage.expectBikeVisible('Yamaha');
    await garagePage.expectBikeNotVisible(bike.make);
  });

  test('Cancel edit bike does not change bike data', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.openEditBike();
    await garagePage.editBikeMake.fill('Yamaha');
    await garagePage.cancelEditBike();

    await expect(garagePage.garageGrid).toBeVisible();
    await expect(garagePage.editBikeScreen).not.toBeVisible();
    await garagePage.expectBikeVisible(bike.make);
    await garagePage.expectBikeNotVisible('Yamaha');
  });

  test('Edit bike with invalid year < 1900 renders an error message', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillEditBikeForm({ ...bike, year: '1899' });
    await garagePage.expectEditError('Invalid year');
    await garagePage.cancelEditBike();

    await expect(garagePage.garageGrid).toContainText(bike.year);
  });

  test('Edit bike with invalid year > 2100 renders an error message', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillEditBikeForm({ ...bike, year: '2101' });
    await garagePage.expectEditError('Invalid year');
    await garagePage.cancelEditBike();

    await expect(garagePage.garageGrid).toContainText(bike.year);
  });

  test('Edit bike with decreasing odo renders an error message', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillEditBikeForm({ ...bike, odometer: '800' });
    await garagePage.expectEditError('Odometer cannot decrease');
    await garagePage.cancelEditBike();

    await expect(garagePage.garageGrid).toContainText(bike.odometer);
  });

  test('Editing only model keeps other bike fields unchanged', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.openEditBike();
    await garagePage.editBikeModel.fill('Updated Model');
    await garagePage.editBikeSaveButton.click();

    await garagePage.expectBikeVisible(bike.make);
    await expect(garagePage.garageGrid).toContainText('Updated Model');
    await expect(garagePage.garageGrid).toContainText(bike.year);
    await expect(garagePage.garageGrid).toContainText(bike.odometer);
  });

  test('Edit bike with missing make', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillEditBikeForm({ ...bike, make: '' });
    await garagePage.expectEditError('Make is required');
    await garagePage.cancelEditBike();
    await garagePage.expectBikeVisible(bike.make);
  });

  test('Edit bike with missing model', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillEditBikeForm({ ...bike, model: '' });
    await garagePage.expectEditError('Model is required');
    await garagePage.cancelEditBike();
    await garagePage.expectBikeVisible(bike.make);
  });

  test('Edit bike with missing odo', async () => {
    const bike = makeBike();

    await garagePage.fillAddBikeForm(bike);
    await garagePage.expectBikeVisible(bike.make);

    await garagePage.fillEditBikeForm({ ...bike, odometer: '' });
    await garagePage.expectEditError('Odometer is required');
  });
});
