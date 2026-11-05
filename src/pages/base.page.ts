/**
 * ==============================================================================
 * FILE: src/pages/base.page.ts
 * MỤC ĐÍCH: Lớp trừu tượng cơ sở (Base Class) cho tất cả các Page Object trong dự án.
 * NGUYÊN LÝ THIẾT KẾ:
 * - Tất cả các trang cụ thể (`LoginPage`, `CustomerPage`...) đều kế thừa từ `BasePage`.
 * - Tự động tích hợp sẵn các thành phần chung như `SidebarComponent` và các hàm điều hướng, chờ tải trang.
 * ==============================================================================
 */

import { type Page } from '@playwright/test';
import { SidebarComponent } from '../components/sidebar.component';

export abstract class BasePage {
  /** Thành phần menu thanh bên trái dùng chung cho mọi trang */
  readonly sidebar: SidebarComponent;

  constructor(protected readonly page: Page) {
    this.sidebar = new SidebarComponent(page);
  }

  /**
   * Điều hướng trình duyệt đến một đường dẫn cụ thể
   * @param path Đường dẫn URL (mặc định là đường dẫn rỗng / base)
   */
  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Chờ cho đến khi toàn bộ cây DOM của trang web được nạp xong
   */
  async waitForPageLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
