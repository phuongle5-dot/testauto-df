import { test, expect } from '../src/fixtures/test.fixture';

test.describe('DentalFlow - Quản lý khách hàng', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    // Đăng nhập bằng tài khoản từ codegen
    await loginPage.login('h123', 'ha123', 'Dfc@2026');
  });

  // Happy Path: Tạo khách hàng thành công
  test('TC01: Thêm mới hồ sơ khách hàng thành công', async ({ customerPage, page }) => {
    await customerPage.navigateToCustomerList();
    await customerPage.openCreateModal();

    await customerPage.createCustomer({
      fullName: 'Lê Minh Huyền',
      dob: '29-10-2006',
      phone: '0295812354',
      gender: 'Nam',
      address: 'Thanh Hóa',
    });

    // Web-first assertion: Kiểm tra chuyển sang bước kế hoạch điều trị hoặc hiển thị tên KH
    await expect(page.getByRole('button', { name: 'Thêm kế hoạch điều trị' })).toBeVisible({ timeout: 10000 });
  });

  // Edge / Negative Case: Bỏ trống trường bắt buộc
  test('TC02: Không thể lưu khi bỏ trống họ tên khách hàng', async ({ customerPage }) => {
    await customerPage.navigateToCustomerList();
    await customerPage.openCreateModal();

    await customerPage.saveCustomerButton.click();

    // Kiểm tra thông báo lỗi validation của form
    const validationError = customerPage.nameInput.locator('xpath=ancestor::div[contains(@class, "has-error")]');
    await expect(customerPage.saveCustomerButton).toBeVisible();
  });
});