// @ts-check
const { test, expect } = require('@playwright/test');

test ('Login', async ({page}) => {
  await page.goto('https://demoqa.com/login');
  await page.getByPlaceholder('UserName').fill('Olga_Bogd');
  await page.getByPlaceholder('Password').fill('Olga123456789olga@');
  await page.locator('#login').click();
})