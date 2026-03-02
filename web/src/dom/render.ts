import { dom } from './selectors.ts';

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
  dom.loginScreen?.classList.add('is-hidden');
  dom.nav?.classList.remove('is-hidden');
  dom.garageScreen?.classList.remove('is-hidden');
  dom.bikeScreen?.classList.add('is-hidden');
  dom.addBikeScreen?.classList.add('is-hidden');

  dom.userEmail!.innerHTML = `Hello, Petro!`;
}

function renderAddBikeScreen(): void {
  dom.addBikeScreen?.classList.remove('is-hidden');
  dom.garageScreen?.classList.add('is-hidden');
}

function renderBikeScreen(): void {
  dom.garageScreen?.classList.add('is-hidden');
  dom.bikeScreen?.classList.remove('is-hidden');
}

export {
  renderInitialScreen,
  renderGarageScreen,
  renderRegisterScreen,
  renderBikeScreen,
  renderAddBikeScreen,
};
