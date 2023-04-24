// @ts-check
const { test, expect } = require('@playwright/test');

import * as credentials from '../infoForTests/credentials.json';

test ('test1Cookies', async ({page}) => {
  await page.goto('https://demoqa.com/login');
  await page.getByPlaceholder('UserName').fill(credentials.userName);
  await page.getByPlaceholder('Password').fill(credentials.password);
  await page.locator('#login').click();
  const locator = page.locator('.main-header');
  await expect(locator).toHaveText('Profile');
  await page.waitForURL('https://demoqa.com/profile');

  const cookies = await page.context().cookies();
  for (const cookie of cookies) {
    console.log(JSON.stringify(cookie))
  }

  //check that cookies are not empty
  await expect(cookies.find(c => c.name == 'userID').value).toBeTruthy();
  await expect(cookies.find(c => c.name == 'userName').value).toBeTruthy();
  await expect(cookies.find(c => c.name == 'expires').value).toBeTruthy();
  await expect(cookies.find(c => c.name == 'token').value).toBeTruthy();

  //save variables
  const userID = cookies.find(c => c.name == 'userID').value;
  const token = cookies.find(c => c.name == 'token').value;
  
  // block images
  await page.route('**/*', (route) => {
        return route.request().resourceType() === 'image'
            ? route.abort()
            : route.continue()
  
  })
  
  //waiting to intercept a GET request 
  const responsePromise = page.waitForResponse('https://demoqa.com/BookStore/v1/Books');
  await page.locator('.text:text-is("Book Store")').click();
  await page.screenshot({path: 'TASK_3/infoForTests/screenshot.png'});

  const response = await responsePromise;
  const fullResponse = await response.json();
  expect (response.ok()); //check status 200
  const booksAmount = fullResponse.books.length
  await expect(page.locator(".action-buttons")).toHaveCount(booksAmount); //check that amount of books = UI amount of books

}); 
