import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../constants/routes.constant';
import { ENV } from '../constants/env.constant';

export class LoginPage extends BasePage {
  readonly clinicCodeInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.clinicCodeInput = page.getByRole('textbox', { name: 'Mã phòng khám *' });
    this.usernameInput = page.getByRole('textbox', { name: 'Tài khoản *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Mật khẩu *' });
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
  }

  async open(): Promise<void> {
    await this.navigateTo(ROUTES.LOGIN);
  }

  async login(
    clinicCode: string = ENV.CLINIC_CODE,
    username: string = ENV.ADMIN_USERNAME,
    password: string = ENV.ADMIN_PASSWORD
  ): Promise<void> {
    await this.clinicCodeInput.fill(clinicCode);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
      timeout: 15000,
    });
  }
}
