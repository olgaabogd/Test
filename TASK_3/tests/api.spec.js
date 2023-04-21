// @ts-check
const { test, expect } = require('@playwright/test');

import * as credentials from '../infoForTests/credentials.json';

test ('Login', async ({page}) => {
  await page.goto('https://demoqa.com/login');
  await page.getByPlaceholder('UserName').fill(credentials.userName);
  await page.getByPlaceholder('Password').fill(credentials.password);
  await page.locator('#login').click();

  const locator = page.locator('.main-header');
  await expect(locator).toHaveText('Profile');

})

test ('cookies', async ({page}) => {
  await page.goto('https://demoqa.com/login');
  await page.getByPlaceholder('UserName').fill('Olga_Bogd');
  await page.getByPlaceholder('Password').fill('Olga123456789olga@');
  await page.locator('#login').click();

  await page.waitForURL('https://demoqa.com/profile');

  const cookies = await page.context().cookies();
  for (const cookie of cookies) {
    console.log(JSON.stringify(cookie))
  }
  await expect(cookies.find(c => c.name == 'userID').value).toBeTruthy();
  await expect(cookies.find(c => c.name == 'userName').value).toBeTruthy();
  await expect(cookies.find(c => c.name == 'expires').value).toBeTruthy();
  await expect(cookies.find(c => c.name == 'token').value).toBeTruthy();
})
