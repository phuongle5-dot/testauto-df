import { test, expect } from '../src/fixtures/test.fixture';
import { ENV } from '../src/constants/env.constant';

test.describe('DentalFlow - Authentication', () => {
  test('TC01: Kiểm tra hiển thị đầy đủ các trường tại màn hình đăng nhập', async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.clinicCodeInput).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC02: Đăng nhập thành công với thông tin hợp lệ', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(ENV.CLINIC_CODE, ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
    
    // Đảm bảo đã chuyển hướng rời khỏi trang login
    await expect(page).not.toHaveURL(/.*\/auth\/login.*/);
  });
});
