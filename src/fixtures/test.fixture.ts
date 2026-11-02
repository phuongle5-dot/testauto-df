import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { CustomerPage } from '../pages/customer.page';

type AppFixtures = {
  loginPage: LoginPage;
  customerPage: CustomerPage;
};

export const test = baseTest.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  customerPage: async ({ page }, use) => {
    await use(new CustomerPage(page));
  },
});

export { expect } from '@playwright/test';