/**
 * ==============================================================================
 * FILE: playwright.config.ts
 * MỤC ĐÍCH: File cấu hình trung tâm (Heart) của framework Playwright Test.
 * - Tự động nạp biến môi trường từ file `.env` vào `process.env`.
 * - Thiết lập thư mục chứa bài test (`./tests`).
 * - Quản lý cấu hình chạy song song (Parallel), cơ chế thử lại (Retry), số lượng Worker.
 * - Cấu hình trình duyệt (Chromium, Firefox, WebKit), độ phân giải, Base URL.
 * - Quản lý việc ghi lại bằng chứng khi lỗi: Chụp ảnh (Screenshot), quay video, Trace file.
 * ==============================================================================
 */

import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Tự động nạp biến môi trường từ file .env (nếu có)
 * Sử dụng process.loadEnvFile (Node.js 20.6+) hoặc fallback tự đọc file thủ công
 */
const envFilePath = path.resolve(__dirname, '.env');
if (fs.existsSync(envFilePath)) {
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(envFilePath);
    } catch {
      // Bỏ qua nếu đã được nạp
    }
  } else {
    // Fallback cho môi trường Node cũ nếu chưa có process.loadEnvFile
    const envConfig = fs.readFileSync(envFilePath, 'utf8');
    for (const line of envConfig.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = values.join('=').trim();
        }
      }
    }
  }
}

/**
 * Cấu hình Playwright Test
 * Chi tiết: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Thư mục chứa các file test suite (*.spec.ts và *.setup.ts)
  testDir: './tests',

  // Cho phép chạy tất cả các test trong cùng 1 file một cách song song
  fullyParallel: true,

  // Ngăn chặn việc quên xóa `test.only` khi đẩy code lên môi trường CI
  forbidOnly: !!process.env.CI,

  // Tự động chạy lại test bị thất bại nếu đang trên CI (tối đa 2 lần để loại trừ flaky test)
  retries: process.env.CI ? 2 : 0,

  // Số lượng luồng worker chạy đồng thời: Trên CI dùng 1 worker để tránh quá tải tài nguyên
  workers: process.env.CI ? 1 : undefined,

  // Cấu hình báo cáo kết quả test: xuất ra danh sách dòng lệnh (list) và file HTML
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  // Cấu hình dùng chung cho mọi dự án và test case
  use: {
    // URL mặc định khi dùng page.goto('/')
    baseURL: process.env.BASE_URL || 'https://dentalflow20-test.ntq.solutions',

    // Thu thập trace chi tiết (DOM snapshot, timeline) ở lần retry đầu tiên khi có lỗi
    trace: 'on-first-retry',

    // Chỉ chụp ảnh màn hình khi test case bị thất bại
    screenshot: 'only-on-failure',

    // Giữ lại video ghi hình chỉ khi test case bị lỗi
    video: 'retain-on-failure',
  },

  // Danh sách các trình duyệt sẽ thực thi test
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
