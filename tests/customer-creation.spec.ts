/**
 * ==============================================================================
 * FILE: tests/customer-creation.spec.ts
 * MỤC ĐÍCH: Bộ kiểm thử tự động (Test Suite) cho nghiệp vụ Thêm mới Khách hàng trên DentalFlow.
 * CÁC TEST CASES ĐƯỢC KIỂM THỬ:
 * - TC01: Thêm mới hồ sơ khách hàng thành công với dữ liệu hợp lệ ngẫu nhiên.
 * - TC02: Không thể lưu và báo lỗi validation khi bỏ trống Họ tên khách hàng.
 * - TC03: Không thể lưu và báo lỗi validation khi bỏ trống Số điện thoại.
 * - TC04: Đóng modal thêm mới khi người dùng nhấn nút Hủy.
 * ==============================================================================
 */

import { test, expect } from '../src/fixtures/test.fixture';
import { createValidCustomerData } from '../src/data/mock/customer.data';
import { ENV } from '../src/constants/env.constant';

test.describe('DentalFlow - Quản lý khách hàng Suite', () => {
  // Hook chạy trước mỗi bài test: Đăng nhập hệ thống và chuyển đến màn hình Quản lý khách hàng
  test.beforeEach(async ({ loginPage, customerPage }) => {
    await loginPage.open();
    await loginPage.login(ENV.CLINIC_CODE, ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
    await customerPage.navigateToCustomerList();
  });

  test('TC01: Thêm mới hồ sơ khách hàng thành công với dữ liệu hợp lệ', async ({ customerPage, page }) => {
    // 1. Mở modal tạo mới khách hàng
    await customerPage.openCreateModal();

    // 2. Chuẩn bị dữ liệu khách hàng ngẫu nhiên hợp lệ (tránh trùng SĐT)
    const customerData = createValidCustomerData();

    // 3. Điền form và bấm Lưu
    await customerPage.createCustomer(customerData);

    // 4. Xác nhận đã lưu thành công: Hệ thống chuyển sang bước "Thêm kế hoạch điều trị"
    await expect(page.getByRole('button', { name: 'Thêm kế hoạch điều trị' })).toBeVisible({ timeout: 15000 });
  });

  test('TC02: Không thể lưu khi bỏ trống họ tên khách hàng', async ({ customerPage }) => {
    await customerPage.openCreateModal();

    // Điền form nhưng cố tình bỏ trống trường Họ tên
    await customerPage.fillCustomerForm({
      phone: '0987654321',
      dob: '01-01-1990',
      gender: 'Nam',
    });
    await customerPage.submitCreateCustomer();

    // Kiểm tra trường Họ tên hiển thị thông báo lỗi validation bắt buộc nhập
    const nameError = customerPage.getFieldError(customerPage.nameInput);
    await expect(nameError).toBeVisible();
    await expect(customerPage.saveCustomerButton).toBeVisible();
  });

  test('TC03: Không thể lưu khi bỏ trống số điện thoại', async ({ customerPage }) => {
    await customerPage.openCreateModal();

    // Điền form nhưng cố tình bỏ trống Số điện thoại
    await customerPage.fillCustomerForm({
      fullName: 'Nguyễn Văn Test',
      dob: '01-01-1990',
      gender: 'Nam',
    });
    await customerPage.submitCreateCustomer();

    // Kiểm tra trường Số điện thoại hiển thị thông báo lỗi validation bắt buộc nhập
    const phoneError = customerPage.getFieldError(customerPage.phoneInput);
    await expect(phoneError).toBeVisible();
    await expect(customerPage.saveCustomerButton).toBeVisible();
  });

  test('TC04: Đóng form thêm mới khi nhấn nút Hủy', async ({ customerPage }) => {
    await customerPage.openCreateModal();
    await expect(customerPage.saveCustomerButton).toBeVisible();

    // Nhấn nút Hủy
    await customerPage.cancelButton.click();

    // Kiểm tra modal thêm mới đã được đóng lại hoàn toàn
    await expect(customerPage.saveCustomerButton).not.toBeVisible();
  });
});
