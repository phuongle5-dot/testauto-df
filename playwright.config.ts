import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Tự động nạp biến môi trường từ file .env (nếu có)
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
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Chạy test song song */
  fullyParallel: true,
  /* Chặn test.only trên CI */
  forbidOnly: !!process.env.CI,
  /* Retry khi chạy trên CI */
  retries: process.env.CI ? 2 : 0,
  /* Số worker chạy song song (1 worker trên CI để tránh nghẽn) */
  workers: process.env.CI ? 1 : undefined,
  /* Báo cáo kết quả */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  /* Cấu hình chung cho mọi projects */
  use: {
    baseURL: process.env.BASE_URL || 'https://dentalflow20-test.ntq.solutions',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Cấu hình các trình duyệt test */
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
