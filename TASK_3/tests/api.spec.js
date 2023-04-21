// @ts-check
const { test, expect } = require('@playwright/test');

import * as credentials from '../infoForTests/credentials.json';

test ('Login', async ({page}) => {
  await page.goto('https://demoqa.com/login');
  await page.getByPlaceholder('UserName').fill(credentials.userName);
  await page.getByPlaceholder('Password').fill(credentials.password);
  await page.locator('#login').click();
})