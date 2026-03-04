import { dom } from './selectors';
import { bikeStore } from '../state/bikeStore';
import { createBikeCard } from '../ui/createBikeCard';
import { showScreen } from '../ui/showScreen';

function renderInitialScreen(): void {
  dom.loginScreen?.classList.remove('is-hidden');
  dom.nav?.classList.add('is-hidden');
  dom.garageScreen?.classList.add('is-hidden');
  dom.bikeScreen?.classList.add('is-hidden');
  dom.registerScreen?.classList.add('is-hidden');
}

function renderRegisterScreen(): void {
  dom.loginScreen?.classList.add('is-hidden');
  dom.nav?.classList.add('is-hidden');
  dom.registerScreen?.classList.remove('is-hidden');
  dom.garageScreen?.classList.add('is-hidden');
  dom.bikeScreen?.classList.add('is-hidden');
}

function renderGarageScreen(): void {
  (dom.bikeGrid as HTMLDivElement).innerHTML = '';

  showScreen('garage');

  dom.userEmail!.innerHTML = `Hello, Petro!`;

  const bikes = bikeStore.getBikes();

  if (bikes.length > 0) {
    (
      document.querySelector('[data-testid="garage-count"]') as HTMLElement
    ).textContent = `${bikes.length} motorcycles`;
    document
      .querySelector('[data-testid="garage-empty"]')
      ?.classList.remove('is-hidden');

    bikes.forEach((bike) => dom.bikeGrid?.appendChild(createBikeCard(bike)));
  } else {
    document
      .querySelector('[data-testid="garage-empty"]')
      ?.classList.add('is-hidden');
  }
}

function renderAddBikeScreen(): void {
  dom.addBikeScreen?.classList.remove('is-hidden');
  dom.garageScreen?.classList.add('is-hidden');
}

function renderBikeScreen(): void {
  dom.garageScreen?.classList.add('is-hidden');
  dom.bikeScreen?.classList.remove('is-hidden');
}

function renderBikesInGarage(): void {}

export {
  renderInitialScreen,
  renderGarageScreen,
  renderRegisterScreen,
  renderBikeScreen,
  renderAddBikeScreen,
};
