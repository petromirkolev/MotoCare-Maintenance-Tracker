import { Page, Locator, expect } from '@playwright/test';

export class MaintenancePage {
  readonly page: Page;
  readonly maintenanceScreenButton: Locator;
  readonly maintenanceScreen: Locator;
  readonly maintenanceScheduleModal: Locator;
  readonly maintenanceLogModal: Locator;
  readonly oilServiceCard: Locator;
  readonly logOilService: Locator;
  readonly coolantServiceCard: Locator;
  readonly logCoolantService: Locator;
  readonly logIntervalDoneAt: Locator;
  readonly logIntervalOdo: Locator;
  readonly logSubmitButton: Locator;
  readonly logCancelButton: Locator;
  readonly logServiceMessage: Locator;
  readonly scheduleOilService: Locator;
  readonly scheduleCoolantService: Locator;
  readonly scheduleIntervalKm: Locator;
  readonly scheduleIntervalDays: Locator;
  readonly scheduleSubmitButton: Locator;
  readonly scheduleCancelButton: Locator;
  readonly scheduleServiceMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.maintenanceScreenButton = this.page.locator('.bikeCard__main');
    this.maintenanceScreen = this.page.getByTestId('screen-bike');
    this.maintenanceLogModal = this.page.getByTestId('modal-log');
    this.maintenanceScheduleModal = this.page.getByTestId('modal-schedule');
    this.oilServiceCard = this.page.getByTestId('task-card-oil');
    this.logOilService = this.page.locator(
      '[data-testid="task-card-oil"] [data-testid="btn-log-service-oil"]',
    );
    this.coolantServiceCard = this.page.getByTestId('task-card-coolant');
    this.logCoolantService = this.page.locator(
      '[data-testid="task-card-coolant"] [data-testid="btn-log-service-coolant"]',
    );
    this.logIntervalDoneAt = this.page.getByTestId('log-doneAt');
    this.logIntervalOdo = this.page.getByTestId('log-odo');
    this.logSubmitButton = this.page.getByTestId('log-submit');
    this.logCancelButton = this.page.getByTestId('log-cancel');
    this.logServiceMessage = this.page.getByTestId('log-hint');
    this.scheduleOilService = this.page.locator(
      '[data-testid="task-card-oil"] [data-testid="btn-task-calendar-oil"]',
    );
    this.scheduleCoolantService = this.page.locator(
      '[data-testid="task-card-coolant"] [data-testid="btn-task-calendar-coolant"]',
    );
    this.scheduleIntervalKm = this.page.getByTestId('schedule-interval-km');
    this.scheduleIntervalDays = this.page.getByTestId('schedule-interval-days');
    this.scheduleSubmitButton = this.page.getByTestId('schedule-submit');
    this.scheduleCancelButton = this.page.getByTestId('schedule-cancel');
    this.scheduleServiceMessage = this.page.getByTestId('schedule-hint');
  }

  async goto(): Promise<void> {
    await this.maintenanceScreenButton.click();
    await expect(this.maintenanceScreen).toBeVisible();
  }

  async openMaintenanceLogModal(service: string): Promise<void> {
    switch (service) {
      case 'oil-change':
        await this.logOilService.click();
        break;
      case 'coolant-change':
        await this.logCoolantService.click();
        break;
    }
  }

  async fillMaintenanceLog(doneAt: any, odo: any): Promise<void> {
    await this.logIntervalDoneAt.fill(doneAt);
    await this.logIntervalOdo.fill(odo);
  }

  async saveMaintenanceLog(): Promise<void> {
    await this.logSubmitButton.click();
  }

  async cancelMaintenanceLog(): Promise<void> {
    await this.logCancelButton.click();
  }

  async openMaintenanceScheduleModal(service: string): Promise<void> {
    switch (service) {
      case 'oil-change':
        await this.scheduleOilService.click();
        break;
      case 'coolant-change':
        await this.scheduleCoolantService.click();
        break;
    }
  }

  async fillMaintenanceSchedule(days: string, km: string): Promise<void> {
    await this.scheduleIntervalKm.fill(km);
    await this.scheduleIntervalDays.fill(days);
  }

  async saveMaintenanceSchedule(): Promise<void> {
    await this.scheduleSubmitButton.click();
  }

  async cancelMaintenanceSchedule(): Promise<void> {
    await this.scheduleCancelButton.click();
  }

  async expectScheduleError(message: string): Promise<void> {
    await expect(this.scheduleServiceMessage).toContainText(message);
  }

  async expectLogError(message: string): Promise<void> {
    await expect(this.logServiceMessage).toContainText(message);
  }
}
