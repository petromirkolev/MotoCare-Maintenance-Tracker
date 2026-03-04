import { newId, type Bike, type StoreState } from '../state/bikeStore';

function addBikeToGarage() {
  const make: string = (
    document.querySelector('#addBikeName') as HTMLInputElement
  ).value;
  const model: string = (
    document.querySelector('#addBikeModel') as HTMLInputElement
  ).value;
  const year: string = (
    document.querySelector('#addBikeYear') as HTMLInputElement
  ).value;
  const odo: string = (
    document.querySelector('#addBikeOdo') as HTMLInputElement
  ).value;

  const newBike: Bike = {
    id: newId(),
    make,
    model,
    year,
    odo,
  };

  console.log(newBike);

  // add bike
}

function editBike(): void {
  // edit bike
}

export { removeBikeFromGarage, addBikeToGarage, editBike };
