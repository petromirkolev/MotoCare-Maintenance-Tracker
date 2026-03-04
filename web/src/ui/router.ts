import {
  renderAddBikeScreen,
  renderGarageScreen,
  renderInitialScreen,
  renderRegisterScreen,
} from '../dom/render';
import { dom } from '../dom/selectors';
import { bikeStore, readBikeForm } from '../state/bikeStore';

type Action =
  | 'auth.login'
  | 'auth.logout'
  | 'nav.login'
  | 'nav.register'
  | 'nav.garage'
  | 'nav.bikeAdd'
  | 'bike.open'
  | 'bike.edit.open'
  | 'bike.delete'
  | 'bike.add.submit'
  | 'bike.edit.submit';

function bindEvents(): void {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const el = target.closest<HTMLElement>('[data-action]');

    if (!el) return;

    const action = el.dataset.action as Action | undefined;
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
        const form = (dom.addBikeForm as HTMLFormElement) || null;
        const input = readBikeForm(form);
        bikeStore.addBike(input);
        form.reset();
        renderGarageScreen();
        break;
      }
    }
  });
}

export { bindEvents };
