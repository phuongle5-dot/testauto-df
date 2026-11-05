/**
 * ==============================================================================
 * FILE: tests/auth.setup.ts
 * MỤC ĐÍCH: Setup Project chạy trước toàn bộ test suite để đăng nhập và lưu Storage State.
 * NGUYÊN LÝ HOẠT ĐỘNG:
 * - Thay vì mỗi kịch bản test (Khách hàng, Lịch hẹn, Bệnh án...) đều phải lặp lại bước đăng nhập giao diện,
 *   kịch bản này thực hiện đăng nhập 1 lần duy nhất và lưu cookies/local storage vào file `playwright/.auth/user.json`.
 * - Các test suite khác chỉ cần nạp lại file `user.json` là đã ở trạng thái đăng nhập, giúp tiết kiệm thời gian chạy test.
 * ==============================================================================
 */

import { test as setup, expect } from '../src/fixtures/test.fixture';
import { ENV } from '../src/constants/env.constant';
import * as path from 'path';

// Đường dẫn file lưu trữ cookies và session storage
const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

setup('Authenticate user session', async ({ loginPage, page }) => {
  // 1. Mở trang đăng nhập
  await loginPage.open();

  // 2. Thực hiện đăng nhập với thông tin tài khoản hợp lệ
  await loginPage.login(ENV.CLINIC_CODE, ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);

  // 3. Đảm bảo đã rời khỏi màn hình đăng nhập
  await expect(page).not.toHaveURL(/.*\/auth\/login.*/);

  // 4. Lưu trạng thái phiên làm việc (cookies, local storage) vào file json
  await page.context().storageState({ path: authFile });
});
