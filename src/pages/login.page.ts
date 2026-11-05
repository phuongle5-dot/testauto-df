/**
 * ==============================================================================
 * FILE: src/pages/login.page.ts
 * MỤC ĐÍCH: Page Object đại diện cho màn hình Đăng nhập (Authentication) của DentalFlow.
 * NGUYÊN LÝ THIẾT KẾ:
 * - Tập trung tất cả các Locators được map từ Sheet "Element map" của bộ Test Case.
 * - Cung cấp đầy đủ các phương thức hành động (Actions) tương tác với form đăng nhập,
 *   icon show/hide mật khẩu, checkbox ghi nhớ, link quên mật khẩu/đăng ký.
 * - Xử lý đóng nút 'x' của popup thông báo trước khi tìm nút Đăng xuất (LILO-105).
 * ==============================================================================
 */

import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../constants/routes.constant';
import { ENV } from '../constants/env.constant';
import { AUTH_TEST_DATA } from '../constants/auth.constant';

export class LoginPage extends BasePage {
  // --- 1. CÁC PHẦN TỬ GIAO DIỆN CHÍNH (UI Elements) ---
  /** Logo DentalFlow tại khung đăng nhập */
  readonly logoDentalFlow: Locator;

  /** Khu vực hiển thị bản đồ Việt Nam & logo các phòng khám */
  readonly mapAndLogosArea: Locator;

  /** Ô nhập Mã phòng khám */
  readonly clinicCodeInput: Locator;

  /** Ô nhập Tài khoản */
  readonly usernameInput: Locator;

  /** Ô nhập Mật khẩu */
  readonly passwordInput: Locator;

  /** Icon Hide / Show (con mắt) trong ô Mật khẩu */
  readonly passwordVisibilityToggle: Locator;

  /** Checkbox "Ghi nhớ tài khoản" */
  readonly rememberMeCheckbox: Locator;

  /** Nhãn (label) đi kèm của checkbox Ghi nhớ tài khoản */
  readonly rememberMeLabel: Locator;

  /** Nút / Link "Quên mật khẩu?" */
  readonly forgotPasswordLink: Locator;

  /** Nút bấm "Đăng nhập" */
  readonly loginButton: Locator;

  /** Đoạn text tĩnh "Chưa có tài khoản?" */
  readonly noAccountText: Locator;

  /** Nút / Link "Đăng ký tài khoản" */
  readonly registerButton: Locator;

  // --- 2. THÔNG BÁO LỖI (Error & Validation Locators) ---
  /** Thông báo lỗi bỏ trống Mã phòng khám */
  readonly clinicCodeError: Locator;

  /** Thông báo lỗi bỏ trống Tài khoản */
  readonly usernameError: Locator;

  /** Thông báo lỗi bỏ trống Mật khẩu */
  readonly passwordError: Locator;

  /** Thông báo lỗi hệ thống hiển thị dạng popup / toast alert (Ant Design) */
  readonly errorMessageToast: Locator;

  // --- 3. MENU TÀI KHOẢN & ĐĂNG XUẤT (Cho kịch bản LILO-105) ---
  /** Avatar / Icon / Tên người dùng tại menu tài khoản sau khi đã đăng nhập */
  readonly userAccountMenu: Locator;

  /** Nút "Đăng xuất" trong menu tài khoản */
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    // Header & Background
    this.logoDentalFlow = page.locator('img[alt*="logo" i], .login-logo, .auth-logo, img').first();
    this.mapAndLogosArea = page.locator('.login-bg, img[src*="map" i], .banner-container, .ant-col:has(img)').first();

    // Inputs: Hỗ trợ cả placeholder lẫn selector theo role để đảm bảo tương thích DOM thực tế
    this.clinicCodeInput = page.getByPlaceholder('Mã phòng khám').or(page.getByRole('textbox', { name: /Mã phòng khám/i }));
    this.usernameInput = page.getByPlaceholder('Tài khoản').or(page.getByRole('textbox', { name: /Tài khoản/i }));
    this.passwordInput = page.getByPlaceholder('Mật khẩu').or(page.locator('input[type="password"], input[type="text"][id*="password" i]')).first();

    // Password visibility toggle icon (Ant Design input password suffix)
    this.passwordVisibilityToggle = page.locator('.ant-input-password-icon, [aria-label*="eye" i], .anticon-eye, .anticon-eye-invisible').first();

    // Checkbox & Links
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: /ghi nhớ/i }).or(page.locator('input[type="checkbox"]')).first();
    this.rememberMeLabel = page.getByText(/Ghi nhớ tài khoản/i).first();
    this.forgotPasswordLink = page.getByRole('link', { name: /Quên mật khẩu/i }).or(page.getByText('Quên mật khẩu?')).first();
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
    this.noAccountText = page.getByText('Chưa có tài khoản?').first();
    this.registerButton = page.getByRole('link', { name: /Đăng ký tài khoản/i }).or(page.getByText('Đăng ký tài khoản')).first();

    // Validation messages
    this.clinicCodeError = page.getByText(AUTH_TEST_DATA.MESSAGES.CLINIC_REQUIRED).first();
    this.usernameError = page.getByText(AUTH_TEST_DATA.MESSAGES.USERNAME_REQUIRED).first();
    this.passwordError = page.getByText(AUTH_TEST_DATA.MESSAGES.PASSWORD_REQUIRED).first();

    // Toast thông báo lỗi hệ thống (Ant Design message / notification / alert)
    this.errorMessageToast = page.locator('.ant-message-notice, .ant-notification-notice, .ant-message-error, [role="alert"]').first();

    // Logout: Định vị trigger menu tài khoản trên thanh header
    this.userAccountMenu = page.locator('.ant-dropdown-trigger, .user-dropdown, .header-user, [class*="avatar"]')
      .or(page.getByText('Nguyễn Thị Thu Hà'))
      .or(page.getByText('ha123'))
      .first();

    // Nút "Đăng xuất" trong dropdown
    this.logoutButton = page.locator('.ant-dropdown, .ant-dropdown-menu')
      .getByText(/Đăng xuất/i)
      .or(page.getByRole('menuitem', { name: /Đăng xuất/i }))
      .or(page.getByText('Đăng xuất'))
      .first();
  }

  /**
   * Mở trực tiếp màn hình Đăng nhập và chờ trang tải xong
   */
  async open(): Promise<void> {
    await this.navigateTo(ROUTES.LOGIN);
    await this.waitForPageLoaded();
  }

  /**
   * Điền thông tin vào form đăng nhập (chỉ điền các trường có truyền giá trị)
   */
  async fillForm(clinicCode?: string, username?: string, password?: string): Promise<void> {
    if (clinicCode !== undefined) await this.clinicCodeInput.fill(clinicCode);
    if (username !== undefined) await this.usernameInput.fill(username);
    if (password !== undefined) await this.passwordInput.fill(password);
  }

  /**
   * Bấm vào nút Đăng nhập
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Đăng nhập bằng cách nhấn phím Enter tại ô Mật khẩu
   */
  async pressEnterToLogin(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  /**
   * Click icon con mắt để ẩn/hiện mật khẩu
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.passwordVisibilityToggle.click();
  }

  /**
   * Luồng đăng nhập hoàn chỉnh (điền form, submit và chờ điều hướng sang trang nội bộ)
   */
  async login(
    clinicCode: string = AUTH_TEST_DATA.CLINIC_VALID,
    username: string = AUTH_TEST_DATA.USER_VALID,
    password: string = AUTH_TEST_DATA.PASS_VALID
  ): Promise<void> {
    await this.fillForm(clinicCode, username, password);
    await this.clickLogin();
    // Chờ cho đến khi URL không còn chứa '/auth/login' (chứng tỏ đăng nhập thành công)
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
      timeout: 15000,
    });
  }

  /**
   * Đóng popup thông báo nếu xuất hiện:
   * Có thể click 1 trong 3 nút sau để đóng popup:
   * 1. Nút "Bỏ qua"
   * 2. Nút "Không hiển thị lại"
   * 3. Nút đóng 'x' (.ant-modal-close)
   * Nếu không có popup thì bỏ qua ngay để lập tức tìm menu Đăng xuất.
   */
  async dismissNotificationModalIfPresent(): Promise<void> {
    const modal = this.page.locator('.ant-modal, [role="dialog"], .ant-modal-content').first();

    // Định nghĩa 3 nút có thể dùng để đóng popup
    const candidateButtons = [
      this.page.getByRole('button', { name: 'Bỏ qua' }),
      this.page.getByRole('button', { name: 'Không hiển thị lại' }),
      this.page.locator('button.ant-modal-close, .ant-modal-close, .ant-modal-close-x, [aria-label="Close"]'),
    ];

    // Lặp qua để click 1 trong 3 nút nếu nhìn thấy
    for (const btn of candidateButtons) {
      try {
        const target = btn.first();
        if (await target.isVisible({ timeout: 1500 })) {
          await target.click();
          await modal.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
          break; // Đã đóng popup thành công
        }
      } catch {
        // Tiếp tục kiểm tra nút tiếp theo
      }
    }
  }

  /**
   * Thực hiện quy trình Đăng xuất khỏi hệ thống:
   * 1. Đóng popup thông báo nếu có (bằng 1 trong 3 nút: "Bỏ qua", "Không hiển thị lại", hoặc 'x').
   * 2. Nếu không có popup, tìm luôn menu tài khoản và click "Đăng xuất".
   */
  async logout(): Promise<void> {
    // Bước 1: Đóng popup nếu xuất hiện (click 1 trong 3 nút)
    await this.dismissNotificationModalIfPresent();
    await this.page.waitForTimeout(500);

    // Bước 2: Tìm trigger menu tài khoản trên thanh header
    const userMenu = this.page.locator('.ant-dropdown-trigger, .user-dropdown, .header-user, [class*="avatar"]')
      .or(this.page.getByText('Nguyễn Thị Thu Hà'))
      .or(this.page.getByText(AUTH_TEST_DATA.USER_VALID))
      .first();

    await userMenu.waitFor({ state: 'visible', timeout: 8000 });
    await userMenu.click();

    // Bước 3: Tìm và click nút "Đăng xuất" trong dropdown menu
    const logoutBtn = this.page.locator('.ant-dropdown, .ant-dropdown-menu, body')
      .getByRole('menuitem', { name: /Đăng xuất/i })
      .or(this.page.getByText('Đăng xuất'))
      .first();

    await logoutBtn.waitFor({ state: 'visible', timeout: 5000 });
    await logoutBtn.click();

    // Bước 4: Chờ hệ thống điều hướng về màn hình Đăng nhập
    await this.page.waitForURL((url) => url.pathname.includes('/auth/login'), {
      timeout: 10000,
    });
  }

  /**
   * Lấy thông báo lỗi validation hiển thị ngay dưới ô input cụ thể
   */
  getFieldError(inputLocator: Locator): Locator {
    return inputLocator.locator('xpath=ancestor::div[contains(@class, "ant-form-item")]//div[contains(@class, "ant-form-item-explain-error")]');
  }
}
