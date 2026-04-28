import { test } from '../fixtures/garage-fixtures';
import { messages } from '../../constants/messages';

test.describe('MMT - Garage create E2E', () => {
  test.describe('Valid data', () => {
    test('Create bike with valid data', async ({
      loggedInUser,
      validBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike(validBikeInput);
      await garagePage.expectBikeVisible(validBikeInput.make);
    });

    test('Create bike with missing make and valid other fields', async ({
      loggedInUser,
      validBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({ ...validBikeInput, make: undefined });
      await garagePage.expectError(messages.BIKE_MAKE_REQ);
      await garagePage.expectBikeNotVisible(validBikeInput.make);
    });

    test('Create bike with missing model and valid other fields', async ({
      loggedInUser,
      validBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({
        ...validBikeInput,
        model: undefined,
      });
      await garagePage.expectError(messages.BIKE_MODEL_REQ);
      await garagePage.expectBikeNotVisible(validBikeInput.make);
    });

    test('Create bike with missing year and valid other fields', async ({
      loggedInUser,
      validBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({
        ...validBikeInput,
        year: undefined,
      });
      await garagePage.expectError(messages.BIKE_YEAR_REQ);
      await garagePage.expectBikeNotVisible(validBikeInput.make);
    });

    test('Create bike with missing all fields', async ({
      loggedInUser,
      validBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({
        make: undefined,
        model: undefined,
        year: undefined,
        odo: undefined,
      });
      await garagePage.expectError(messages.BIKE_MAKE_REQ);
      await garagePage.expectBikeNotVisible(validBikeInput.make);
    });

    test('Create bike with empty odo when odo is optional', async ({
      loggedInUser,
      validBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({
        ...validBikeInput,
        odo: undefined,
      });
      await garagePage.expectBikeVisible(validBikeInput.make);
    });
  });

  test.describe('Invalid data', () => {
    test('Create bike with invalid year < 1900', async ({
      loggedInUser,
      validBikeInput,
      invalidBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({
        ...validBikeInput,
        year: invalidBikeInput.yearBelow,
      });
      await garagePage.expectError(messages.BIKE_YEAR_RANGE);
      await garagePage.expectBikeNotVisible(validBikeInput.make);
    });

    test('Create bike with invalid year > 2100', async ({
      loggedInUser,
      validBikeInput,
      invalidBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({
        ...validBikeInput,
        year: invalidBikeInput.yearAbove,
      });
      await garagePage.expectError(messages.BIKE_YEAR_RANGE);
      await garagePage.expectBikeNotVisible(validBikeInput.make);
    });

    test('Create bike with negative odometer', async ({
      loggedInUser,
      validBikeInput,
      invalidBikeInput,
      garagePage,
    }) => {
      await garagePage.addBike({
        ...validBikeInput,
        odo: invalidBikeInput.odo,
      });
      await garagePage.expectError(messages.BIKE_ODO_POS);
      await garagePage.expectBikeNotVisible(validBikeInput.make);
    });
  });
});
