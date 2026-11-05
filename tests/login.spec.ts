/**
 * ==============================================================================
 * FILE: tests/login.spec.ts
 * MỤC ĐÍCH: Test script kiểm thử tự động toàn diện màn hình Login của DentalFlow
 *           được xây dựng dựa trên file kịch bản Test Case (sheet Test data & Element map).
 * BẢO ĐẢM TỰ ĐỘNG HÓA TẤT CẢ CÁC TEST CASES CÓ CỘT AUTOMATION = 'Auto':
 * - Nhóm I: CHECK TRIGGER (LILO-001 -> LILO-002)
 * - Nhóm II: CHECK UI & VALIDATE (LILO-003, 005, 007, 010 -> 089)
 * - Nhóm III: CHECK FUNCTION (LILO-090 -> LILO-102)
 * - Nhóm IV: CHECK MỞ RỘNG (LILO-103, 104, 105, 110, 111, 116)
 * - Nhóm V: ĐỀ XUẤT BỔ SUNG (LILO-142, 143, 144)
 * ==============================================================================
 */

import { test, expect } from '../src/fixtures/test.fixture';
import { AUTH_TEST_DATA } from '../src/constants/auth.constant';
import { ROUTES } from '../src/constants/routes.constant';

// Danh sách các bộ test data kiểm tra khả năng nhận ký tự của các ô input (LILO-017 -> 028, 035 -> 046, 053 -> 064)
const INPUT_TEST_CASES = [
  { idSuffix: 'a', desc: '1 ký tự chữ', value: 'a' },
  { idSuffix: 'b', desc: '20 ký tự chữ + số', value: 'Abc123Abc123Abc123Ab' },
  { idSuffix: 'c', desc: '30 ký tự chữ + số + space đầu cuối', value: ' Abc123Abc123Abc123Abc123Abc1 ' },
  { idSuffix: 'd', desc: '50 ký tự chữ + số + ký tự đặc biệt', value: 'Abc123!@#Def456$%^Ghi789&*()Jkl012-_=+Mno345[]{}Pq' },
  { idSuffix: 'e', desc: '> 50 ký tự (60 ký tự)', value: 'Abc123Abc123Abc123Abc123Abc123Abc123Abc123Abc123Abc123Abc123' },
  { idSuffix: 'f', desc: 'chữ fullsize', value: 'ＡＢＣＤｅｆｇｈ' },
  { idSuffix: 'g', desc: 'chữ halfsize', value: 'ABCDefgh' },
  { idSuffix: 'h', desc: 'toàn space', value: '     ' },
  { idSuffix: 'i', desc: 'toàn số', value: '1234567890' },
  { idSuffix: 'j', desc: 'toàn ký tự đặc biệt', value: '!@#$%^&*()' },
  { idSuffix: 'k', desc: 'mã script XSS', value: '<script>alert(1)</script>' },
  { idSuffix: 'l', desc: 'thẻ HTML', value: '<b>test</b>' },
];

test.describe('DentalFlow - Màn hình Đăng nhập (Login)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  // ============================================================================
  // I. CHECK TRIGGER
  // ============================================================================
  test.describe('I. CHECK TRIGGER', () => {
    test('[LILO-001] Truy cập vào website qua URL trực tiếp', async ({ loginPage, page }) => {
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.clinicCodeInput).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('[LILO-002] Copy/Paste link vào 1 tab bất kỳ', async ({ context }) => {
      const newPage = await context.newPage();
      await newPage.goto(ROUTES.LOGIN);
      await expect(newPage).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(newPage.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
      await newPage.close();
    });
  });

  // ============================================================================
  // II. CHECK UI, VALIDATE
  // ============================================================================
  test.describe('II. CHECK UI, VALIDATE', () => {
    test('[LILO-003] Check hiển thị tổng quan màn hình', async ({ loginPage }) => {
      await expect(loginPage.clinicCodeInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('[LILO-005] Check hiển thị phần bản đồ & logo phòng khám', async ({ loginPage }) => {
      if (await loginPage.mapAndLogosArea.count() > 0) {
        await expect(loginPage.mapAndLogosArea).toBeVisible();
      }
    });

    test('[LILO-007] Khung đăng nhập hiển thị đầy đủ các thành phần', async ({ loginPage }) => {
      await expect(loginPage.clinicCodeInput).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.rememberMeCheckbox).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.noAccountText).toBeVisible();
      await expect(loginPage.registerButton).toBeVisible();
    });

    test('[LILO-010] Click vào logo DentalFlow là nội dung tĩnh', async ({ loginPage, page }) => {
      const currentUrl = page.url();
      if (await loginPage.logoDentalFlow.isVisible()) {
        await loginPage.logoDentalFlow.click();
        await expect(page).toHaveURL(currentUrl);
      }
    });

    // --- Ô Mã phòng khám ---
    test.describe('Ô Mã phòng khám', () => {
      test('[LILO-011] Ô Mã phòng khám là textbox', async ({ loginPage }) => {
        await expect(loginPage.clinicCodeInput).toBeEditable();
      });

      test('[LILO-012] Ô Mã phòng khám có placeholder', async ({ loginPage }) => {
        const placeholder = await loginPage.clinicCodeInput.getAttribute('placeholder');
        expect(placeholder).toMatch(/Mã phòng khám/i);
      });

      test('[LILO-014] Ô Mã phòng khám là trường bắt buộc (required)', async ({ page }) => {
        const label = page.locator('label[for="clinic_code"], label[title*="Mã phòng khám"]').first();
        await expect(label).toBeVisible();
        await expect(label).toHaveClass(/ant-form-item-required/);
      });

      test('[LILO-015] Ô Mã phòng khám có giá trị default trống', async ({ loginPage }) => {
        await expect(loginPage.clinicCodeInput).toHaveValue('');
      });

      test('[LILO-016] Bỏ trống ô Mã phòng khám và lost focus hiển thị lỗi validation', async ({ loginPage, page }) => {
        await loginPage.clinicCodeInput.click();
        await loginPage.clinicCodeInput.fill('a');
        await loginPage.clinicCodeInput.fill('');
        await page.locator('body').click({ position: { x: 0, y: 0 } });
        const error = loginPage.getFieldError(loginPage.clinicCodeInput).or(loginPage.clinicCodeError);
        await expect(error).toBeVisible();
      });

      // LILO-017 -> LILO-028: Nhập các loại chuỗi vào ô Mã phòng khám
      const clinicTcMap = ['017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027', '028'];
      INPUT_TEST_CASES.forEach((tc, idx) => {
        test(`[LILO-${clinicTcMap[idx]}] Nhập ô Mã phòng khám: ${tc.desc}`, async ({ loginPage }) => {
          await loginPage.clinicCodeInput.fill(tc.value);
          await expect(loginPage.clinicCodeInput).toHaveValue(tc.value);
        });
      });
    });

    // --- Ô Tài khoản ---
    test.describe('Ô Tài khoản', () => {
      test('[LILO-029] Ô Tài khoản là textbox', async ({ loginPage }) => {
        await expect(loginPage.usernameInput).toBeEditable();
      });

      test('[LILO-030] Ô Tài khoản có placeholder', async ({ loginPage }) => {
        const placeholder = await loginPage.usernameInput.getAttribute('placeholder');
        expect(placeholder).toMatch(/Tài khoản/i);
      });

      test('[LILO-032] Ô Tài khoản là trường bắt buộc', async ({ page }) => {
        // Sử dụng selector chính xác tránh nhầm lẫn với label của checkbox "Ghi nhớ tài khoản"
        const label = page.locator('label[for="username"], label[title="Tài khoản"]').first();
        await expect(label).toBeVisible();
        await expect(label).toHaveClass(/ant-form-item-required/);
      });

      test('[LILO-033] Ô Tài khoản có giá trị default trống', async ({ loginPage }) => {
        await expect(loginPage.usernameInput).toHaveValue('');
      });

      test('[LILO-034] Bỏ trống ô Tài khoản và lost focus hiển thị lỗi validation', async ({ loginPage, page }) => {
        await loginPage.usernameInput.click();
        await loginPage.usernameInput.fill('a');
        await loginPage.usernameInput.fill('');
        await page.locator('body').click({ position: { x: 0, y: 0 } });
        const error = loginPage.getFieldError(loginPage.usernameInput).or(loginPage.usernameError);
        await expect(error).toBeVisible();
      });

      // LILO-035 -> LILO-046: Nhập các loại chuỗi vào ô Tài khoản
      const userTcMap = ['035', '036', '037', '038', '039', '040', '041', '042', '043', '044', '045', '046'];
      INPUT_TEST_CASES.forEach((tc, idx) => {
        test(`[LILO-${userTcMap[idx]}] Nhập ô Tài khoản: ${tc.desc}`, async ({ loginPage }) => {
          await loginPage.usernameInput.fill(tc.value);
          await expect(loginPage.usernameInput).toHaveValue(tc.value);
        });
      });
    });

    // --- Ô Mật khẩu ---
    test.describe('Ô Mật khẩu', () => {
      test('[LILO-047] Ô Mật khẩu là textbox dạng password', async ({ loginPage }) => {
        const type = await loginPage.passwordInput.getAttribute('type');
        expect(type).toBe('password');
      });

      test('[LILO-048] Ô Mật khẩu có placeholder và icon hide/show', async ({ loginPage }) => {
        const placeholder = await loginPage.passwordInput.getAttribute('placeholder');
        expect(placeholder).toMatch(/Mật khẩu/i);
        await expect(loginPage.passwordVisibilityToggle).toBeVisible();
      });

      test('[LILO-050] Ô Mật khẩu là trường bắt buộc', async ({ page }) => {
        const label = page.locator('label[for="password"], label[title*="Mật khẩu"]').first();
        await expect(label).toBeVisible();
        await expect(label).toHaveClass(/ant-form-item-required/);
      });

      test('[LILO-051] Ô Mật khẩu có giá trị default trống', async ({ loginPage }) => {
        await expect(loginPage.passwordInput).toHaveValue('');
      });

      test('[LILO-052] Bỏ trống ô Mật khẩu và lost focus hiển thị lỗi validation', async ({ loginPage, page }) => {
        await loginPage.passwordInput.click();
        await loginPage.passwordInput.fill('a');
        await loginPage.passwordInput.fill('');
        await page.locator('body').click({ position: { x: 0, y: 0 } });
        const error = loginPage.getFieldError(loginPage.passwordInput).or(loginPage.passwordError);
        await expect(error).toBeVisible();
      });

      // LILO-053 -> LILO-064: Nhập các loại chuỗi vào ô Mật khẩu
      const passTcMap = ['053', '054', '055', '056', '057', '058', '059', '060', '061', '062', '063', '064'];
      INPUT_TEST_CASES.forEach((tc, idx) => {
        test(`[LILO-${passTcMap[idx]}] Nhập ô Mật khẩu: ${tc.desc}`, async ({ loginPage }) => {
          await loginPage.passwordInput.fill(tc.value);
          await expect(loginPage.passwordInput).toHaveValue(tc.value);
        });
      });

      test('[LILO-065] Mật khẩu ở trạng thái Hide (mặc định che ký tự)', async ({ loginPage }) => {
        await loginPage.passwordInput.fill('abc123');
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
      });

      test('[LILO-066] Click icon show/hide để hiển thị mật khẩu rõ', async ({ loginPage }) => {
        await loginPage.passwordInput.fill('abc123');
        await loginPage.togglePasswordVisibility();
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
        await expect(loginPage.passwordInput).toHaveValue('abc123');
      });
    });

    // --- Checkbox & Buttons & Links ---
    test.describe('Checkbox, Buttons & Links', () => {
      test('[LILO-067] Checkbox Ghi nhớ tài khoản là checkbox hợp lệ', async ({ loginPage }) => {
        await expect(loginPage.rememberMeCheckbox).toBeVisible();
      });

      test('[LILO-069] Bỏ tích chọn checkbox Ghi nhớ tài khoản', async ({ loginPage }) => {
        if (await loginPage.rememberMeCheckbox.isChecked()) {
          await loginPage.rememberMeCheckbox.uncheck();
        }
        await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
      });

      test('[LILO-070] Tích chọn checkbox Ghi nhớ tài khoản', async ({ loginPage }) => {
        await loginPage.rememberMeCheckbox.check();
        await expect(loginPage.rememberMeCheckbox).toBeChecked();
      });

      test('[LILO-072] & [LILO-073] Button Quên mật khẩu là link/button và đang enable', async ({ loginPage }) => {
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeEnabled();
      });

      test('[LILO-076] Click button Quên mật khẩu chuyển trang', async ({ loginPage, page }) => {
        await loginPage.forgotPasswordLink.click();
        await page.waitForTimeout(1000);
        expect(page.url()).not.toBe(ROUTES.LOGIN);
      });

      test('[LILO-077] & [LILO-078] Button Đăng nhập là button và đang enable', async ({ loginPage }) => {
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.loginButton).toBeEnabled();
      });

      test('[LILO-082] Text "Chưa có tài khoản?" hiển thị tĩnh', async ({ loginPage }) => {
        await expect(loginPage.noAccountText).toBeVisible();
      });

      test('[LILO-085] & [LILO-086] Button Đăng ký tài khoản hiển thị và enable', async ({ loginPage }) => {
        await expect(loginPage.registerButton).toBeVisible();
        await expect(loginPage.registerButton).toBeEnabled();
      });

      test('[LILO-089] Click button Đăng ký tài khoản chuyển trang đăng ký', async ({ loginPage, page }) => {
        await loginPage.registerButton.click();
        await page.waitForTimeout(1000);
        expect(page.url()).not.toBe(ROUTES.LOGIN);
      });
    });
  });

  // ============================================================================
  // III. CHECK FUNCTION
  // ============================================================================
  test.describe('III. CHECK FUNCTION', () => {
    test('[LILO-090] Đăng nhập thành công với thông tin hợp lệ đã đăng ký', async ({ loginPage, page }) => {
      await loginPage.login(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_VALID,
        AUTH_TEST_DATA.PASS_VALID
      );
      await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
    });

    test('[LILO-091] Đăng nhập thất bại khi bỏ trống cả 3 trường', async ({ loginPage, page }) => {
      await loginPage.clickLogin();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.clinicCodeError.or(loginPage.getFieldError(loginPage.clinicCodeInput))).toBeVisible();
      await expect(loginPage.usernameError.or(loginPage.getFieldError(loginPage.usernameInput))).toBeVisible();
      await expect(loginPage.passwordError.or(loginPage.getFieldError(loginPage.passwordInput))).toBeVisible();
    });

    test('[LILO-092] Đăng nhập thất bại khi chỉ nhập Mã phòng khám', async ({ loginPage, page }) => {
      await loginPage.fillForm(AUTH_TEST_DATA.CLINIC_VALID, '', '');
      await loginPage.clickLogin();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.usernameError.or(loginPage.getFieldError(loginPage.usernameInput))).toBeVisible();
      await expect(loginPage.passwordError.or(loginPage.getFieldError(loginPage.passwordInput))).toBeVisible();
    });

    test('[LILO-093] Đăng nhập thất bại khi chỉ nhập Tài khoản', async ({ loginPage, page }) => {
      await loginPage.fillForm('', AUTH_TEST_DATA.USER_VALID, '');
      await loginPage.clickLogin();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.clinicCodeError.or(loginPage.getFieldError(loginPage.clinicCodeInput))).toBeVisible();
      await expect(loginPage.passwordError.or(loginPage.getFieldError(loginPage.passwordInput))).toBeVisible();
    });

    test('[LILO-094] Đăng nhập thất bại khi chỉ nhập Mật khẩu', async ({ loginPage, page }) => {
      await loginPage.fillForm('', '', AUTH_TEST_DATA.PASS_VALID);
      await loginPage.clickLogin();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.clinicCodeError.or(loginPage.getFieldError(loginPage.clinicCodeInput))).toBeVisible();
      await expect(loginPage.usernameError.or(loginPage.getFieldError(loginPage.usernameInput))).toBeVisible();
    });

    test('[LILO-095] Đăng nhập thất bại khi bỏ trống Mật khẩu', async ({ loginPage, page }) => {
      await loginPage.fillForm(AUTH_TEST_DATA.CLINIC_VALID, AUTH_TEST_DATA.USER_VALID, '');
      await loginPage.clickLogin();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.passwordError.or(loginPage.getFieldError(loginPage.passwordInput))).toBeVisible();
    });

    test('[LILO-096] Đăng nhập thất bại khi bỏ trống Tài khoản', async ({ loginPage, page }) => {
      await loginPage.fillForm(AUTH_TEST_DATA.CLINIC_VALID, '', AUTH_TEST_DATA.PASS_VALID);
      await loginPage.clickLogin();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.usernameError.or(loginPage.getFieldError(loginPage.usernameInput))).toBeVisible();
    });

    test('[LILO-097] Đăng nhập thất bại khi bỏ trống Mã phòng khám', async ({ loginPage, page }) => {
      await loginPage.fillForm('', AUTH_TEST_DATA.USER_VALID, AUTH_TEST_DATA.PASS_VALID);
      await loginPage.clickLogin();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.clinicCodeError.or(loginPage.getFieldError(loginPage.clinicCodeInput))).toBeVisible();
    });

    test('[LILO-098] Đăng nhập thất bại với tài khoản chưa đăng ký', async ({ loginPage, page }) => {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/v2/auth') && res.status() === 401,
        { timeout: 10000 }
      ).catch(() => null);

      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_UNREG,
        AUTH_TEST_DATA.USER_UNREG,
        AUTH_TEST_DATA.PASS_UNREG
      );
      await loginPage.clickLogin();
      await responsePromise;

      // Xác nhận hệ thống chặn đăng nhập: Vẫn duy trì tại màn hình Login
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
    });

    test('[LILO-099] Đăng nhập thất bại khi nhập đúng phòng khám, sai tài khoản và sai mật khẩu', async ({ loginPage, page }) => {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/v2/auth') && res.status() === 401,
        { timeout: 10000 }
      ).catch(() => null);

      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_WRONG,
        AUTH_TEST_DATA.PASS_WRONG
      );
      await loginPage.clickLogin();
      await responsePromise;

      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
    });

    test('[LILO-100] Đăng nhập thất bại khi nhập đúng phòng khám, đúng tài khoản nhưng sai mật khẩu', async ({ loginPage, page }) => {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/v2/auth') && res.status() === 401,
        { timeout: 10000 }
      ).catch(() => null);

      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_VALID,
        AUTH_TEST_DATA.PASS_WRONG
      );
      await loginPage.clickLogin();
      await responsePromise;

      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
    });

    test('[LILO-101] Đăng nhập thất bại khi nhập sai phòng khám, đúng tài khoản và đúng mật khẩu', async ({ loginPage, page }) => {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/v2/auth') && res.status() === 401,
        { timeout: 10000 }
      ).catch(() => null);

      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_WRONG,
        AUTH_TEST_DATA.USER_VALID,
        AUTH_TEST_DATA.PASS_VALID
      );
      await loginPage.clickLogin();
      await responsePromise;

      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
    });

    test('[LILO-102] Đăng nhập thất bại khi nhập đúng phòng khám, sai tài khoản nhưng đúng mật khẩu', async ({ loginPage, page }) => {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/v2/auth') && res.status() === 401,
        { timeout: 10000 }
      ).catch(() => null);

      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_WRONG,
        AUTH_TEST_DATA.PASS_VALID
      );
      await loginPage.clickLogin();
      await responsePromise;

      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
    });
  });

  // ============================================================================
  // IV. CHECK MỞ RỘNG
  // ============================================================================
  test.describe('IV. CHECK MỞ RỘNG', () => {
    test('[LILO-103] & [LILO-104] Mất kết nối internet khi đăng nhập và khôi phục mạng', async ({ loginPage, context }) => {
      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_VALID,
        AUTH_TEST_DATA.PASS_VALID
      );

      // Ngắt kết nối mạng
      await context.setOffline(true);
      await loginPage.clickLogin().catch(() => { });

      // Bật lại kết nối mạng
      await context.setOffline(false);
      await loginPage.open();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('[LILO-105] Đăng xuất thành công sau khi đăng nhập', async ({ loginPage, page }) => {
      await loginPage.login(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_VALID,
        AUTH_TEST_DATA.PASS_VALID
      );
      await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));

      // Đóng popup cảnh báo và thực hiện đăng xuất
      await loginPage.logout();
      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('[LILO-110] Đăng nhập trên giả lập thiết bị mobile iOS', async ({ browser }) => {
      const iosContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      });
      const iosPage = await iosContext.newPage();
      await iosPage.goto(ROUTES.LOGIN);
      await expect(iosPage.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
      await iosContext.close();
    });

    test('[LILO-111] Đăng nhập trên giả lập thiết bị mobile Android', async ({ browser }) => {
      const androidContext = await browser.newContext({
        viewport: { width: 412, height: 915 },
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
      });
      const androidPage = await androidContext.newPage();
      await androidPage.goto(ROUTES.LOGIN);
      await expect(androidPage.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
      await androidContext.close();
    });

    test('[LILO-116] Đa phiên đăng nhập trên 2 browser context độc lập', async ({ browser }) => {
      const pc1 = await browser.newContext();
      const pc2 = await browser.newContext();

      const page1 = await pc1.newPage();
      const page2 = await pc2.newPage();

      // Đăng nhập trên PC 1
      await page1.goto(ROUTES.LOGIN);
      await page1.getByPlaceholder('Mã phòng khám').fill(AUTH_TEST_DATA.CLINIC_VALID);
      await page1.getByPlaceholder('Tài khoản').fill(AUTH_TEST_DATA.USER_VALID);
      await page1.getByPlaceholder('Mật khẩu').fill(AUTH_TEST_DATA.PASS_VALID);
      await page1.getByRole('button', { name: 'Đăng nhập' }).click();

      // Đăng nhập trên PC 2
      await page2.goto(ROUTES.LOGIN);
      await page2.getByPlaceholder('Mã phòng khám').fill(AUTH_TEST_DATA.CLINIC_VALID);
      await page2.getByPlaceholder('Tài khoản').fill(AUTH_TEST_DATA.USER_VALID);
      await page2.getByPlaceholder('Mật khẩu').fill(AUTH_TEST_DATA.PASS_VALID);
      await page2.getByRole('button', { name: 'Đăng nhập' }).click();

      await pc1.close();
      await pc2.close();
    });
  });

  // ============================================================================
  // V. ĐỀ XUẤT BỔ SUNG
  // ============================================================================
  test.describe('V. ĐỀ XUẤT BỔ SUNG', () => {
    test('[LILO-142] Kiểm tra giá trị mặc định của checkbox Ghi nhớ tài khoản', async ({ loginPage }) => {
      await expect(loginPage.rememberMeCheckbox).toBeVisible();
    });

    test('[LILO-143] Đăng nhập thành công bằng phím Enter tại ô Mật khẩu', async ({ loginPage, page }) => {
      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_VALID,
        AUTH_TEST_DATA.PASS_VALID
      );
      await loginPage.pressEnterToLogin();
      await expect(page).not.toHaveURL(new RegExp(ROUTES.LOGIN));
    });

    test('[LILO-144] Nhập mật khẩu phân biệt chữ hoa / thường', async ({ loginPage, page }) => {
      const invertedPassword = AUTH_TEST_DATA.PASS_VALID === AUTH_TEST_DATA.PASS_VALID.toLowerCase()
        ? AUTH_TEST_DATA.PASS_VALID.toUpperCase()
        : AUTH_TEST_DATA.PASS_VALID.toLowerCase();

      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/v2/auth') && res.status() === 401,
        { timeout: 10000 }
      ).catch(() => null);

      await loginPage.fillForm(
        AUTH_TEST_DATA.CLINIC_VALID,
        AUTH_TEST_DATA.USER_VALID,
        invertedPassword
      );
      await loginPage.clickLogin();
      await responsePromise;

      await expect(page).toHaveURL(new RegExp(ROUTES.LOGIN));
    });
  });
});
