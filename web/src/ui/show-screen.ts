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
