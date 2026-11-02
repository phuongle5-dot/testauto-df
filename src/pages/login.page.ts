import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly clinicCodeInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // Locator semantic xác định chính xác theo nhãn có dấu *
    this.clinicCodeInput = page.getByRole('textbox', { name: 'Mã phòng khám *' });
    this.usernameInput = page.getByRole('textbox', { name: 'Tài khoản *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Mật khẩu *' });
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
  }

  async open(): Promise<void> {
    await this.navigateTo('/auth/login/%2F');
  }

  async login(clinicCode: string, username: string, password: string): Promise<void> {
    await this.clinicCodeInput.fill(clinicCode);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
      timeout: 15000,
    });
  }
}