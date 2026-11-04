import { test, expect } from '../src/fixtures/test.fixture';
import { createValidCustomerData } from '../src/data/mock/customer.data';
import { ENV } from '../src/constants/env.constant';

test.describe('DentalFlow - Quản lý khách hàng', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(ENV.CLINIC_CODE, ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
  });

  // Happy Path: Tạo khách hàng thành công với dữ liệu ngẫu nhiên hợp lệ
  test('TC01: Thêm mới hồ sơ khách hàng thành công', async ({ customerPage, page }) => {
    await customerPage.navigateToCustomerList();
    await customerPage.openCreateModal();

    const customerData = createValidCustomerData();
    await customerPage.createCustomer(customerData);

    // Web-first assertion: Kiểm tra chuyển sang bước kế hoạch điều trị hoặc màn hình thông tin KH
    await expect(page.getByRole('button', { name: 'Thêm kế hoạch điều trị' })).toBeVisible({ timeout: 15000 });
  });

  // Edge / Negative Case: Bỏ trống trường bắt buộc
  test('TC02: Không thể lưu khi bỏ trống họ tên khách hàng', async ({ customerPage }) => {
    await customerPage.navigateToCustomerList();
    await customerPage.openCreateModal();

    await customerPage.saveCustomerButton.click();

    // Form vẫn mở và nút lưu vẫn hiển thị (chưa submit thành công)
    await expect(customerPage.saveCustomerButton).toBeVisible();
  });
});
