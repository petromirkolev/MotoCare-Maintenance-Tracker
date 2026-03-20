import { bindEvents } from './ui/router';
import { render } from './dom/render';
import { getCurrentUser } from './state/auth-store';
import { initState } from './state/state-store';

await initState();

const user = getCurrentUser();

user ? render.garageScreen() : render.initialScreen();

bindEvents();
