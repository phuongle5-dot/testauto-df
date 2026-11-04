import { test as setup, expect } from '../src/fixtures/test.fixture';
import { ENV } from '../src/constants/env.constant';
import * as path from 'path';

const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

/**
 * Setup project: Thực hiện đăng nhập 1 lần duy nhất và lưu cookies/session vào file user.json.
 * Các test suite khác (như Customer, Appointment...) có thể tái sử dụng file này để bỏ qua bước đăng nhập UI.
 */
setup('Authenticate user session', async ({ loginPage, page }) => {
  await loginPage.open();
  await loginPage.login(ENV.CLINIC_CODE, ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
  await expect(page).not.toHaveURL(/.*\/auth\/login.*/);

  // Lưu trữ storage state
  await page.context().storageState({ path: authFile });
});

