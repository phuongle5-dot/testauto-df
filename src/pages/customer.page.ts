import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CustomerData } from '../data/models/customer.model';

export { CustomerData };

export class CustomerPage extends BasePage {
  readonly addNewCustomerButton: Locator;
  readonly nameInput: Locator;
  readonly dobInput: Locator;
  readonly phoneInput: Locator;
  readonly genderDropdown: Locator;
  readonly addressInput: Locator;
  readonly saveCustomerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewCustomerButton = page.getByRole('button', { name: 'Thêm mới khách hàng' });

    // Form thêm mới khách hàng
    this.nameInput = page.locator('#create-patient-records_name').getByRole('textbox');
    this.dobInput = page.locator('#create-patient-records_dob').getByRole('textbox', { name: 'dd-mm-yyyy' });
    this.phoneInput = page.locator('#create-patient-records_phone input.ant-input');
    this.genderDropdown = page.getByRole('combobox').filter({ hasText: 'Giới tính' }).locator('#create-patient-records_gender');
    this.addressInput = page.getByRole('textbox', { name: 'Địa chỉ' });
    this.saveCustomerButton = page.getByRole('button', { name: 'Lưu thông tin' });
  }

  /**
   * Điều hướng đến danh sách khách hàng qua sidebar menu
   */
  async navigateToCustomerList(): Promise<void> {
    await this.sidebar.navigateToCustomerManagement();
  }

  async openCreateModal(): Promise<void> {
    await this.addNewCustomerButton.click();
  }

  async createCustomer(data: CustomerData): Promise<void> {
    await this.nameInput.fill(data.fullName);
    await this.dobInput.fill(data.dob);
    await this.phoneInput.fill(data.phone);

    // Chọn giới tính
    await this.genderDropdown.click();
    await this.page.getByRole('option', { name: data.gender }).click();

    await this.addressInput.fill(data.address);
    await this.saveCustomerButton.click();
  }
}
