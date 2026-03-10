export const dom = {
  // top bar
  logout: document.querySelector<HTMLElement>('[data-testid="btn-logout"]'),
  userEmail: document.querySelector<HTMLElement>('[data-testid="user-email"]'),

  // buttons
  button: document.querySelector('.btn--primary'),

  // login screen inputs
  emailInput: document.querySelector<HTMLInputElement>(
    '[data-testid="login-email"]',
  ),
  passInput: document.querySelector<HTMLInputElement>(
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

  // edit bike form
  editBikeForm: document.querySelector<HTMLElement>(
    '[data-testid="edit-bike-form"]',
  ),
  editBikeId: document.querySelector<HTMLInputElement>('#editBikeId'),
  editMake: document.querySelector<HTMLInputElement>('#editBikeName'),
  editYear: document.querySelector<HTMLInputElement>('#editBikeYear'),
  editModel: document.querySelector<HTMLInputElement>('#editBikeModel'),
  editOdo: document.querySelector<HTMLInputElement>('#editBikeOdo'),
  editOdoHint: document.querySelector<HTMLElement>(
    '[data-testid="edit-odo-hint"]',
  ),

  // maintenance header
  maintenanceEditBtn: document.querySelector<HTMLButtonElement>(
    '[data-testid="btn-edit-bike"]',
  ),
  maintenanceDeleteBtn: document.querySelector<HTMLButtonElement>(
    '[data-testid="btn-delete-bike"]',
  ),
  bikeName: document.querySelector<HTMLElement>('[data-testid="bike-name"]'),
  bikeModel: document.querySelector<HTMLElement>('[data-testid="bike-model"]'),
  bikeOdo: document.querySelector<HTMLElement>('[data-testid="bike-odometer"]'),
  bikeEdit: document.querySelector<HTMLElement>(
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
  onTrack: document.querySelector('[data-testid="stat-ok-count"]'),
  dueSoon: document.querySelector('[data-testid="stat-dueSoon-count"]'),
  overdue: document.querySelector('[data-testid="stat-overdue-count"]'),
  history: document.querySelector('[data-testid="history-empty"]'),
};
