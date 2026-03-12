/* Module to manage screen visibility in the Motorcycle Maintenance Assistant app.
 * Provides a function to show a specific screen while hiding others, and manages the visibility of the navigation bar based on the current screen.
 */

import { dom } from '../dom/selectors';

export type Screen =
  | 'login'
  | 'register'
  | 'garage'
  | 'bike'
  | 'bikeAdd'
  | 'bikeEdit';

const SCREENS: Record<Screen, HTMLElement | null> = {
  login: dom.loginScreen,
  register: dom.registerScreen,
  garage: dom.garageScreen,
  bike: dom.bikeScreen,
  bikeAdd: dom.addBikeScreen,
  bikeEdit: dom.editBikeScreen,
};

function setHidden(el: HTMLElement | null, hidden: boolean) {
  if (!el) return;
  el.classList.toggle('is-hidden', hidden);
}

export function showScreen(screen: Screen) {
  (Object.keys(SCREENS) as Screen[]).forEach((key) => {
    setHidden(SCREENS[key], true);
  });

  setHidden(SCREENS[screen], false);

  const isAuth = screen === 'login' || screen === 'register';
  setHidden(dom.nav, isAuth);
}
