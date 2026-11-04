import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { CustomerPage } from '../pages/customer.page';
import { SidebarComponent } from '../components/sidebar.component';

type AppFixtures = {
  loginPage: LoginPage;
  customerPage: CustomerPage;
  sidebar: SidebarComponent;
};

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

export { expect } from '@playwright/test';
