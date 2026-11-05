/**
 * ==============================================================================
 * FILE: src/components/sidebar.component.ts
 * MỤC ĐÍCH: Component Object mô hình hóa thanh điều hướng bên trái (Sidebar Menu) của hệ thống DentalFlow.
 * LỢI ÍCH:
 * - Tái sử dụng ở nhiều màn hình khác nhau (vì Sidebar luôn hiển thị xuyên suốt ứng dụng).
 * - Tập trung các locator và hành động click chuyển trang từ Menu vào một nơi.
 * ==============================================================================
 */

import { type Locator, type Page } from '@playwright/test';

export class SidebarComponent {
  /** Locator của liên kết "Quản lý khách hàng" trên thanh menu */
  readonly customerMenuLink: Locator;

  constructor(private readonly page: Page) {
    this.customerMenuLink = page.getByRole('link', { name: 'Quản lý khách hàng' });
  }

  /**
   * Bấm vào menu "Quản lý khách hàng" để chuyển đến trang danh sách khách hàng
   */
  async navigateToCustomerManagement(): Promise<void> {
    await this.customerMenuLink.click();
  }
}
