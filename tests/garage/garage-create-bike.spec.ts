import { test } from '@playwright/test';
import { GaragePage } from '../pages/garage-page';
import { RegisterPage } from '../pages/register-page';
import { LoginPage } from '../pages/login-page';
import { uniqueEmail, makeBike } from '../utils/test-data';

test.describe('Garage page test suite', () => {
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

  test.describe('Create bike', () => {
    test('Create bike with valid data', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm(bike);
      await garagePage.expectBikeVisible(bike.make);
    });

    test('Create bike with missing make and valid other fields', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({ ...bike, make: '' });
      await garagePage.expectError('Make is required');
      await garagePage.expectBikeNotVisible(bike.make);
    });

    test('Create bike with missing model and valid other fields', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({
        ...bike,
        make: 'Yamaha',
        model: '',
      });
      await garagePage.expectError('Model is required');
      await garagePage.expectBikeNotVisible('Yamaha');
    });

    test('Create bike with missing year and valid other fields', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({
        ...bike,
        make: 'Yamaha',
        year: '',
      });
      await garagePage.expectError('Invalid year');
      await garagePage.expectBikeNotVisible('Yamaha');
    });

    test('Create bike with empty odo when odo is optional', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({
        ...bike,
        make: 'Yamaha',
        odometer: '',
      });
      await garagePage.expectBikeVisible('Yamaha');
    });

    test('Create bike with missing all fields', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({
        ...bike,
        make: '',
        model: '',
        year: '',
        odometer: '',
      });
      await garagePage.expectError('Make is required');
      await garagePage.expectBikeNotVisible(bike.make);
    });
  });

  test.describe('Create bike with invalid data', () => {
    test('Create bike with invalid year < 1900', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({ ...bike, year: '1899' });
      await garagePage.expectError('Invalid year');
      await garagePage.expectBikeNotVisible(bike.make);
    });

    test('Create bike with invalid year > 2100', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({ ...bike, year: '2101' });
      await garagePage.expectError('Invalid year');
      await garagePage.expectBikeNotVisible(bike.make);
    });

    test('Create bike with invalid odo < 0 km', async () => {
      const bike = makeBike();

      await garagePage.fillAddBikeForm({
        ...bike,
        odometer: '-100',
      });
      await garagePage.expectError('Invalid odo');
      await garagePage.expectBikeNotVisible(bike.make);
    });
  });
});
