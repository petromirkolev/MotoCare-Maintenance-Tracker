import { Page, Locator, expect } from '@playwright/test';

export class GaragePage {
  readonly page: Page;
  readonly garageScreen: Locator;
  readonly garageGrid: Locator;
  readonly addBikeButton: Locator;
  readonly addBikeScreen: Locator;
  readonly addBikeMake: Locator;
  readonly addBikeModel: Locator;
  readonly addBikeYear: Locator;
  readonly addBikeOdo: Locator;
  readonly submitBikeButton: Locator;
  readonly addBikeMessage: Locator;
  readonly editBikeButton: Locator;
  readonly editBikeScreen: Locator;
  readonly editBikeMake: Locator;
  readonly editBikeModel: Locator;
  readonly editBikeYear: Locator;
  readonly editBikeOdo: Locator;
  readonly editBikeSaveButton: Locator;
  readonly editBikeCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.garageScreen = this.page.getByTestId('screen-garage');
    this.garageGrid = this.page.getByTestId('garage-grid');
    this.addBikeButton = this.page.getByTestId('btn-add-bike');
    this.addBikeScreen = this.page.getByTestId('screen-bike-add');
    this.addBikeMake = this.page.getByTestId('add-bike-name');
    this.addBikeModel = this.page.getByTestId('add-bike-model');
    this.addBikeYear = this.page.getByTestId('add-bike-year');
    this.addBikeOdo = this.page.getByTestId('add-bike-odometer');
    this.submitBikeButton = this.page.getByTestId('btn-add-bike-save');
    this.addBikeMessage = this.page.getByTestId('add-hint');
    this.editBikeButton = this.page.getByTestId(/bike-edit-/);
    this.editBikeScreen = this.page.getByTestId('screen-bike-edit');
    this.editBikeMake = this.page.getByTestId('edit-bike-name');
    this.editBikeModel = this.page.getByTestId('edit-bike-model');
    this.editBikeYear = this.page.getByTestId('edit-bike-year');
    this.editBikeOdo = this.page.getByTestId('edit-bike-odometer');
    this.editBikeSaveButton = this.page.getByTestId('btn-edit-bike-save');
    this.editBikeCancelButton = this.page.getByTestId('btn-edit-bike-cancel');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.garageScreen).toBeVisible();
  }

  async openAddBike(): Promise<void> {
    await this.addBikeButton.click();
    await expect(this.addBikeScreen).toBeVisible();
  }

  async openEditBike(): Promise<void> {
    await this.editBikeButton.click();
    await expect(this.editBikeScreen).toBeVisible();
  }

  async fillAndSubmitBikeForm({ make, model, year, odometer }): Promise<void> {
    await this.expectLoaded();
    await this.openAddBike();
    await this.addBikeMake.fill(make);
    await this.addBikeModel.fill(model);
    await this.addBikeYear.fill(year);
    await this.addBikeOdo.fill(odometer);
    await this.submitBike();
  }

  async fillAndSubmitBikeEditForm({
    make,
    model,
    year,
    odometer,
  }): Promise<void> {
    await this.editBikeButton.click();
    await this.editBikeMake.fill(make);
    await this.editBikeModel.fill(model);
    await this.editBikeYear.fill(year);
    await this.editBikeOdo.fill(odometer);
    await this.editBikeSaveButton.click();
  }

  async submitBike(): Promise<void> {
    await this.submitBikeButton.click();
  }

  async expectBikeVisible(name: string): Promise<void> {
    await expect(this.garageGrid).toContainText(name);
  }

  async expectBikeNotVisible(name: string): Promise<void> {
    await expect(this.garageGrid).not.toContainText(name);
  }

  async expectError(message: string): Promise<void> {
    await expect(this.addBikeMessage).toContainText(message);
  }

  async expectSuccess(message: string): Promise<void> {
    await expect(this.addBikeMessage).toContainText(message);
  }
}
