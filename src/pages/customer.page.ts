/**
 * ==============================================================================
 * FILE: src/pages/customer.page.ts
 * MỤC ĐÍCH: Page Object đại diện cho màn hình Quản lý & Tạo mới Khách hàng của DentalFlow.
 * NGUYÊN LÝ THIẾT KẾ:
 * - Đóng gói toàn bộ Locators trên form nhập liệu thông tin khách hàng (họ tên, ngày sinh, sđt, giới tính, địa chỉ).
 * - Cung cấp các thao tác nghiệp vụ: Mở modal, điền form, lưu thông tin, tìm kiếm khách hàng, bắt lỗi validation.
 * ==============================================================================
 */

import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CustomerData } from '../data/models/customer.model';

export { CustomerData };

export class CustomerPage extends BasePage {
  /** Nút "Thêm mới khách hàng" trên trang danh sách */
  readonly addNewCustomerButton: Locator;

  /** Ô nhập Họ và tên khách hàng */
  readonly nameInput: Locator;

  /** Ô nhập Ngày sinh (định dạng dd-mm-yyyy) */
  readonly dobInput: Locator;

  /** Ô nhập Số điện thoại */
  readonly phoneInput: Locator;

  /** Dropdown lựa chọn Giới tính */
  readonly genderDropdown: Locator;

  /** Ô nhập Địa chỉ */
  readonly addressInput: Locator;

  /** Nút "Lưu thông tin" trên modal thêm khách hàng */
  readonly saveCustomerButton: Locator;

  /** Nút "Hủy" đóng modal thêm khách hàng */
  readonly cancelButton: Locator;

  /** Ô tìm kiếm khách hàng trên bảng danh sách */
  readonly searchInput: Locator;

  /** Bảng hiển thị danh sách khách hàng */
  readonly customerTable: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewCustomerButton = page.getByRole('button', { name: 'Thêm mới khách hàng' });

    // Form thêm mới khách hàng (Ant Design form)
    this.nameInput = page.locator('#create-patient-records_name').getByRole('textbox');
    this.dobInput = page.locator('#create-patient-records_dob').getByRole('textbox', { name: 'dd-mm-yyyy' });
    this.phoneInput = page.locator('#create-patient-records_phone input.ant-input');
    this.genderDropdown = page.getByRole('combobox').filter({ hasText: 'Giới tính' }).locator('#create-patient-records_gender');
    this.addressInput = page.getByRole('textbox', { name: 'Địa chỉ' });
    this.saveCustomerButton = page.getByRole('button', { name: 'Lưu thông tin' });
    this.cancelButton = page.getByRole('button', { name: 'Hủy' });

    // Tìm kiếm và bảng danh sách khách hàng
    this.searchInput = page.getByPlaceholder(/Tìm kiếm|Nhập tên, số điện thoại/i);
    this.customerTable = page.locator('.ant-table');
  }

  /**
   * Điều hướng đến danh sách khách hàng thông qua menu Sidebar
   */
  async navigateToCustomerList(): Promise<void> {
    await this.sidebar.navigateToCustomerManagement();
    await this.waitForPageLoaded();
  }

  /**
   * Mở modal thêm mới khách hàng
   */
  async openCreateModal(): Promise<void> {
    await this.addNewCustomerButton.click();
  }

  /**
   * Điền thông tin vào form khách hàng (chỉ điền các trường có dữ liệu)
   */
  async fillCustomerForm(data: Partial<CustomerData>): Promise<void> {
    if (data.fullName !== undefined) await this.nameInput.fill(data.fullName);
    if (data.dob !== undefined) await this.dobInput.fill(data.dob);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);

    if (data.gender !== undefined) {
      await this.genderDropdown.click();
      await this.page.getByRole('option', { name: data.gender }).click();
    }

    if (data.address !== undefined) await this.addressInput.fill(data.address);
  }

  /**
   * Nhấn nút Lưu thông tin khách hàng
   */
  async submitCreateCustomer(): Promise<void> {
    await this.saveCustomerButton.click();
  }

  /**
   * Quy trình tạo khách hàng trọn gói: Điền form và bấm Lưu
   */
  async createCustomer(data: CustomerData): Promise<void> {
    await this.fillCustomerForm(data);
    await this.submitCreateCustomer();
  }

  /**
   * Tìm kiếm khách hàng theo từ khóa (tên hoặc số điện thoại)
   */
  async searchCustomer(keyword: string): Promise<void> {
    if (await this.searchInput.isVisible()) {
      await this.searchInput.fill(keyword);
      await this.searchInput.press('Enter');
    }
  }

  /**
   * Lấy thông báo lỗi validation hiển thị dưới ô input trong form khách hàng
   */
  getFieldError(inputLocator: Locator): Locator {
    return inputLocator.locator('xpath=ancestor::div[contains(@class, "ant-form-item")]//div[contains(@class, "ant-form-item-explain-error")]');
  }
}
