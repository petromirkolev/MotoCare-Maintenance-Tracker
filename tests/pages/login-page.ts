import { Page, Locator, expect } from '@playwright/test';
import { ValidUserInput } from '../types/auth';

export class LoginPage {
  readonly page: Page;
  readonly loginScreen: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginScreen = this.page.getByTestId('screen-login');
    this.loginEmail = this.page.getByTestId('login-email');
    this.loginPassword = this.page.getByTestId('login-password');
    this.loginButton = this.page.getByTestId('btn-login');
    this.loginMessage = this.page.getByTestId('login-hint');
  }

  async gotologin(): Promise<void> {
    await this.page.goto('/');
  }

  async fillEmail(email: string): Promise<void> {
    await this.loginEmail.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.loginPassword.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(input: Partial<ValidUserInput>): Promise<void> {
    await this.gotologin();

    if (input.email !== undefined) await this.loginEmail.fill(input.email);
    if (input.password !== undefined)
      await this.loginPassword.fill(input.password);
    await this.loginButton.click();
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.loginMessage).toContainText(message);
    await expect(this.loginScreen).toBeVisible();
  }

  async expectLoginSuccess(message: string): Promise<void> {
    await expect(this.loginMessage).toContainText(message);
  }
}
