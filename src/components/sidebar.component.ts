import { type Locator, type Page } from '@playwright/test';

export class SidebarComponent {
  readonly customerMenuLink: Locator;

  constructor(private readonly page: Page) {
    this.customerMenuLink = page.getByRole('link', { name: 'Quản lý khách hàng' });
  }

  async navigateToCustomerManagement(): Promise<void> {
    await this.customerMenuLink.click();
  }
}

