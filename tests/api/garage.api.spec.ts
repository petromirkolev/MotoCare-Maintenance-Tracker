import { test, expect } from '../fixtures/api-fixtures';
import { api } from '../utils/api-helpers';
import { messages } from '../../constants/messages';
import {
  expectApiError,
  expectApiSuccess,
  expectBikeUpdateSuccess,
} from '../utils/helpers';

test.describe('MMT API - Garage', () => {
  test('Create bike with valid data returns 200', async ({
    request,
    loggedInUser,
    validBikeInput,
  }) => {
    const response = await api.createBike(
      request,
      loggedInUser.user_id,
      validBikeInput,
    );

    expectApiSuccess(response, 201, 'message', messages.BIKE_CREATE_OK);
  });

  test('Create bike with invalid year above maximum returns 400', async ({
    request,
    loggedInUser,
    validBikeInput,
    invalidBikeInput,
  }) => {
    const response = await api.createBike(request, loggedInUser.user_id, {
      ...validBikeInput,
      year: invalidBikeInput.yearAbove,
    });

    expectApiError(response, 400, 'error', messages.BIKE_YEAR_RANGE);
  });

  test('Create bike with invalid year below minimum returns 400', async ({
    request,
    loggedInUser,
    validBikeInput,
    invalidBikeInput,
  }) => {
    const response = await api.createBike(request, loggedInUser.user_id, {
      ...validBikeInput,
      year: invalidBikeInput.yearBelow,
    });

    expectApiError(response, 400, 'error', messages.BIKE_YEAR_RANGE);
  });

  test('Create bike with negative odometer returns 400', async ({
    request,
    loggedInUser,
    validBikeInput,
    invalidBikeInput,
  }) => {
    const response = await api.createBike(request, loggedInUser.user_id, {
      ...validBikeInput,
      odo: invalidBikeInput.odo,
    });

    expectApiError(response, 400, 'error', messages.BIKE_ODO_POS);
  });

  test('Update bike with valid data returns 200', async ({
    request,
    userWithOneBike,
    validBikeUpdateInput,
  }) => {
    const updateResponse = await api.updateBike(
      request,
      userWithOneBike.user_id,
      userWithOneBike.bike_id,
      validBikeUpdateInput,
    );

    expectApiSuccess(updateResponse, 200, 'message', messages.BIKE_UPDATE_OK);

    const bike = await api.listFirstBike(request, userWithOneBike.user_id);

    expectBikeUpdateSuccess(bike, validBikeUpdateInput);
  });

  test('Update bike with lower odometer returns 400', async ({
    request,
    userWithOneBike,
    validBikeUpdateInput,
  }) => {
    const updateResponse = await api.updateBike(
      request,
      userWithOneBike.user_id,
      userWithOneBike.bike_id,
      { ...validBikeUpdateInput, odo: validBikeUpdateInput.odo - 100 },
    );

    expectApiError(updateResponse, 400, 'error', messages.BIKE_ODO_DECR);
  });

  test('Delete bike returns 200', async ({ request, userWithOneBike }) => {
    const deleteResponse = await api.deleteBike(
      request,
      userWithOneBike.user_id,
      userWithOneBike.bike_id,
    );

    expectApiSuccess(deleteResponse, 200, 'message', messages.BIKE_DELETE_OK);

    const bike = await api.listFirstBike(request, userWithOneBike.user_id);

    expect(bike).toBeUndefined();
  });
});
