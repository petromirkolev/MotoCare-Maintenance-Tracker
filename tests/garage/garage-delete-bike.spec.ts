import { test } from '../fixtures/garage-fixtures';

test.describe('Garage delete bike test suite', () => {
  test('Delete bike removes the selected bike', async ({
    loggedInUser,
    bikeInput,
    garagePage,
  }) => {
    await garagePage.addBike(bikeInput);
    await garagePage.expectBikeVisible(bikeInput.make);
    await garagePage.deleteBikeByName(bikeInput.make);
    await garagePage.expectBikeNotVisible(bikeInput.make);
  });

  test('Deleting one bike keeps the other bikes visible', async ({
    loggedInUser,
    bikeInput,
    garagePage,
  }) => {
    const bike1 = { ...bikeInput, make: 'Yamaha', model: 'Tracer 9' };
    const bike2 = { ...bikeInput, make: 'Honda', model: 'Rebel' };

    await garagePage.addBike(bike1);
    await garagePage.expectBikeVisible(bike1.make);

    await garagePage.addBike(bike2);
    await garagePage.expectBikeVisible(bike2.make);

    await garagePage.deleteBikeByName(bike1.make);

    await garagePage.expectBikeNotVisible(bike1.make);
    await garagePage.expectBikeVisible(bike2.make);
  });
});
