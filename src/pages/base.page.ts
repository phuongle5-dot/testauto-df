import { type Page } from '@playwright/test';
import { SidebarComponent } from '../components/sidebar.component';

export abstract class BasePage {
  readonly sidebar: SidebarComponent;

  constructor(protected readonly page: Page) {
    this.sidebar = new SidebarComponent(page);
  }

  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
