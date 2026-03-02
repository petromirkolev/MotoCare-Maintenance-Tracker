import {
  renderAddBikeScreen,
  renderGarageScreen,
  renderInitialScreen,
  renderRegisterScreen,
} from '../dom/render';
import { dom } from '../dom/selectors';
import { addBikeToGarage } from './bike';

function bindEvents(): void {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const el = target.closest<HTMLElement>('[data-action]');

    if (!el) return;

    const action = el.dataset.action;
    console.log(action);

    if (!action) return;

    switch (action) {
      case 'auth.login':
      case 'nav.garage':
        renderGarageScreen();
        break;
      case 'nav.register':
        renderRegisterScreen();
        break;

      case 'auth.logout':
      case 'nav.login':
        renderInitialScreen();
        break;

      case 'nav.bikeAdd':
        renderAddBikeScreen();
        break;

      case 'bike.add.submit': {
        const make = (dom.make as HTMLInputElement).value.trim();
        const year = Number((dom.year as HTMLInputElement).value);
        const model = (dom.model as HTMLInputElement).value.trim();
        const odo = Number((dom.odo as HTMLInputElement).value);

        addBikeToGarage(make, year, model, odo);
        (dom.addBikeForm as HTMLFormElement).reset();
        renderGarageScreen();
        break;
      }
    }
  });
}

export { bindEvents };
