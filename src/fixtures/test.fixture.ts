/**
 * ==============================================================================
 * FILE: src/fixtures/test.fixture.ts
 * MỤC ĐÍCH: Khởi tạo Custom Fixture mở rộng từ `test` gốc của `@playwright/test`.
 * NGUYÊN LÝ THIẾT KẾ:
 * - Thay vì mỗi file test phải tự import và khởi tạo `new LoginPage(page)`, `new CustomerPage(page)`...,
 *   fixture này tự động khởi tạo và inject trực tiếp các Page Object vào tham số của test function.
 * - Giúp các file test gọn gàng, rõ ràng và giảm thiểu code trùng lặp.
 * ==============================================================================
 */

import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { CustomerPage } from '../pages/customer.page';
import { SidebarComponent } from '../components/sidebar.component';

/** Kiểu dữ liệu định nghĩa các Fixture được cung cấp cho bài test */
type AppFixtures = {
  loginPage: LoginPage;
  customerPage: CustomerPage;
  sidebar: SidebarComponent;
};

/**
 * Mở rộng test gốc với các Page Object đã được khởi tạo sẵn
 */
export const test = baseTest.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  customerPage: async ({ page }, use) => {
    await use(new CustomerPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
});

// Re-export lại expect để các file test chỉ cần import từ 1 nguồn duy nhất
export { expect } from '@playwright/test';
