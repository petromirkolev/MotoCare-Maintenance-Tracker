export const dom = {
  // top bar
  logout: document.querySelector<HTMLElement>('[data-testid="btn-logout"]'),
  userEmail: document.querySelector<HTMLElement>('[data-testid="user-email"]'),

  // buttons
  button: document.querySelector('.btn--primary'),

  // login screen inputs
  loginEmailInput: document.querySelector<HTMLInputElement>(
    '[data-testid="login-email"]',
  ),
  loginPassInput: document.querySelector<HTMLInputElement>(
    '[data-testid="login-password"]',
  ),

  // register screen inputs
  regEmailInput: document.querySelector<HTMLInputElement>(
    '[data-testid="register-email"]',
  ),
  regPassInput: document.querySelector<HTMLInputElement>(
    '[data-testid="register-password"]',
  ),
  regPassInput2: document.querySelector<HTMLInputElement>(
    '[data-testid="register-password2"]',
  ),
  registerFormBtn: document.querySelector<HTMLInputElement>(
    '[data-testid="btn-register-form"]',
  ),

  // screens
  nav: document.querySelector<HTMLElement>('[data-testid="topbar"]'),
  loginScreen: document.querySelector<HTMLElement>(
    '[data-testid="screen-login"]',
  ),
  registerScreen: document.querySelector<HTMLElement>(
    '[data-testid="screen-register"]',
  ),
  garageScreen: document.querySelector<HTMLElement>(
    '[data-testid="screen-garage"]',
  ),
  bikeScreen: document.querySelector<HTMLElement>(
    '[data-testid="screen-bike"]',
  ),
  addBikeScreen: document.querySelector<HTMLElement>(
    '[data-testid="screen-bike-add"]',
  ),
  editBikeScreen: document.querySelector<HTMLElement>(
    '[data-testid="screen-bike-edit"]',
  ),

  // garage screen
  garageEmpty: document.querySelector<HTMLElement>(
    '[data-testid="garage-empty"]',
  ),
  garageCount: document.querySelector<HTMLElement>(
    '[data-testid="garage-count"]',
  ),

  // bikes grid
  bikeGrid: document.querySelector<HTMLElement>('[data-testid="garage-grid"]'),
  noBikesYetGrid: document.querySelector<HTMLElement>(
    '[data-testid="garage-empty"]',
  ),

  // add bike form
  addBikeForm: document.querySelector<HTMLFormElement>(
    '[data-testid="add-bike-form"]',
  ),
  addHind: document.querySelector('[data-testid="add-hint"]'),

  // edit bike form
  editBikeForm: document.querySelector<HTMLElement>(
    '[data-testid="edit-bike-form"]',
  ),
  editBikeId: document.querySelector<HTMLInputElement>('#editBikeId'),
  editBikeMake: document.querySelector<HTMLInputElement>('#editBikeName'),
  editBikeYear: document.querySelector<HTMLInputElement>('#editBikeYear'),
  editBikeModel: document.querySelector<HTMLInputElement>('#editBikeModel'),
  editBikeOdo: document.querySelector<HTMLInputElement>('#editBikeOdo'),
  editBikeHint: document.querySelector<HTMLElement>(
    '[data-testid="edit-hint"]',
  ),

  // maintenance header
  maintenanceEditBtn: document.querySelector<HTMLButtonElement>(
    '[data-testid="btn-edit-bike"]',
  ),
  maintenanceDeleteBtn: document.querySelector<HTMLButtonElement>(
    '[data-testid="btn-delete-bike"]',
  ),
  maintenanceBikeName: document.querySelector<HTMLElement>(
    '[data-testid="bike-name"]',
  ),
  maintenanceBikeModel: document.querySelector<HTMLElement>(
    '[data-testid="bike-model"]',
  ),
  maintenanceBikeOdo: document.querySelector<HTMLElement>(
    '[data-testid="bike-odometer"]',
  ),
  maintenanceBikeEdit: document.querySelector<HTMLElement>(
    '[data-testid="btn-edit-bike"]',
  ),

  // maintenance modal
  maintenanceModal: document.querySelector<HTMLModElement>(
    '[data-testid="modal-log"]',
  ),
  maintenanceScheduleModal: document.querySelector<HTMLModElement>(
    '[data-testid="modal-schedule"]',
  ),

  // maintenance log service
  logServiceForm: document.querySelector<HTMLFormElement>(
    '[data-testid="log-form"]',
  ),
  scheduleServiceForm: document.querySelector<HTMLFormElement>(
    '[data-testid="schedule-form"]',
  ),

  // maintenance stats
  maintenanceOnTrack: document.querySelector('[data-testid="stat-ok-count"]'),
  maintenanceDueSoon: document.querySelector(
    '[data-testid="stat-dueSoon-count"]',
  ),
  maintenanceOverdue: document.querySelector(
    '[data-testid="stat-overdue-count"]',
  ),
  maintenanceHistory: document.querySelector('[data-testid="history-empty"]'),
};
