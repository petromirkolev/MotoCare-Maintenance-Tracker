export const dom = {
  /** Navigation bar */
  logout: document.querySelector<HTMLElement>('[data-testid="btn-logout"]'),
  userEmail: document.querySelector<HTMLElement>('[data-testid="user-email"]'),

  /** Buttons */
  button: document.querySelector<HTMLButtonElement>('.btn--primary'),

  /** Login form */
  loginForm: document.querySelector<HTMLFormElement>(
    '[data-testid="login-form"]',
  ),
  loginHint: document.querySelector<HTMLElement>('[data-testid="login-hint"]'),

  /** Login screen inputs */
  loginEmailInput: document.querySelector<HTMLInputElement>(
    '[data-testid="login-email"]',
  ),
  loginPassInput: document.querySelector<HTMLInputElement>(
    '[data-testid="login-password"]',
  ),

  /** Register form */
  regForm: document.querySelector<HTMLFormElement>(
    '[data-testid="register-form"]',
  ),
  regHint: document.querySelector<HTMLElement>('[data-testid="reg-hint"]'),

  /** Register screen inputs */
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

  /** Screens */
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

  /** Garage screen */
  garageEmpty: document.querySelector<HTMLElement>(
    '[data-testid="garage-empty"]',
  ),
  garageCount: document.querySelector<HTMLElement>(
    '[data-testid="garage-count"]',
  ),

  /** Bikes grid */
  bikeGrid: document.querySelector<HTMLElement>('[data-testid="garage-grid"]'),
  noBikesYetGrid: document.querySelector<HTMLElement>(
    '[data-testid="garage-empty"]',
  ),

  /** Add bike form */
  addBikeForm: document.querySelector<HTMLFormElement>(
    '[data-testid="add-bike-form"]',
  ),
  addHint: document.querySelector('[data-testid="add-hint"]'),

  /** Edit bike form */
  editBikeForm: document.querySelector<HTMLElement>(
    '[data-testid="edit-bike-form"]',
  ),
  editBikeId: document.querySelector<HTMLInputElement>('#editBikeId'),
  editBikeMake: document.querySelector<HTMLInputElement>('#editBikeName'),
  editBikeYear: document.querySelector<HTMLInputElement>('#editBikeYear'),
  editBikeModel: document.querySelector<HTMLInputElement>('#editBikeModel'),
  editBikeOdo: document.querySelector<HTMLInputElement>('#editBikeOdo'),
  editBikeHint: document.querySelector<HTMLElement>(
    '[data-testid="edit-bike-hint"]',
  ),

  /** Maintenance header */
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
  maintenanceBikeEdit: document.querySelector<HTMLButtonElement>(
    '[data-testid="btn-edit-bike"]',
  ),

  /** Maintenance modal */
  maintenanceModal: document.querySelector<HTMLModElement>(
    '[data-testid="modal-log"]',
  ),
  maintenanceScheduleModal: document.querySelector<HTMLModElement>(
    '[data-testid="modal-schedule"]',
  ),

  /** Maintenance > Log service */
  logServiceForm: document.querySelector<HTMLFormElement>(
    '[data-testid="log-form"]',
  ),
  logServiceHint: document.querySelector<HTMLElement>(
    '[data-testid="log-hint"]',
  ),

  /** Maintenance > Schedule service */
  scheduleServiceForm: document.querySelector<HTMLFormElement>(
    '[data-testid="schedule-form"]',
  ),
  scheduleServiceHint: document.querySelector<HTMLElement>(
    '[data-testid="schedule-hint"]',
  ),

  /** Maintenance stats */
  maintenanceOnTrack: document.querySelector<HTMLElement>(
    '[data-testid="stat-ok-count"]',
  ),
  maintenanceDueSoon: document.querySelector<HTMLElement>(
    '[data-testid="stat-dueSoon-count"]',
  ),
  maintenanceOverdue: document.querySelector<HTMLElement>(
    '[data-testid="stat-overdue-count"]',
  ),
  maintenanceHistory: document.querySelector<HTMLElement>(
    '[data-testid="history-empty"]',
  ),
};
