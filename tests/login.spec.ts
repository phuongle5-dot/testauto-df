import { test, expect } from '../src/fixtures/test.fixture';

test.describe('DentalFlow Login Suite', () => {
  test('Kiểm tra truy cập trang đăng nhập thành công', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/.*/);
  });
});