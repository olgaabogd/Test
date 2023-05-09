// @ts-check
const { test, expect } = require('@playwright/test');

import * as credentials from '../infoForTests/credentials.json';

test ('testFullApi', async ({page, request}) => {
//login
  await page.goto('https://demoqa.com/login');
  await page.getByPlaceholder('UserName').fill(credentials.userName);
  await page.getByPlaceholder('Password').fill(credentials.password);
  await page.locator('#login').click();
  
  const locator = page.locator('.main-header');
  await expect(locator).toHaveText('Profile');
  await page.waitForURL('https://demoqa.com/profile');

  const cookies = await page.context().cookies();
//checkin cookies
  for (const cookie of cookies) {
    console.log(JSON.stringify(cookie))
  }
  
//save variables
  const userID = cookies.find(c => c.name === 'userID').value;
  const token = cookies.find(c => c.name === 'token').value;

//check that cookies are not empty
  await expect(cookies.find(c => c.name === 'userID').value).toBeTruthy();
  await expect(cookies.find(c => c.name === 'userName').value).toBeTruthy();
  await expect(cookies.find(c => c.name === 'expires').value).toBeTruthy();
  await expect(cookies.find(c => c.name === 'token').value).toBeTruthy();

// block images
  await page.route('**/*', (route) => {
        return route.request().resourceType() === 'image'
            ? route.abort()
            : route.continue()
  
  })
  
  //waiting to intercept a GET request 
  const responsePromise = page.waitForResponse('https://demoqa.com/BookStore/v1/Books');
  await page.locator('.text:text-is("Book Store")').click();
  await page.screenshot({path: 'infoForTests/screenshot.png'});

  const response = await responsePromise;
  const fullResponse = await response.json();
  expect(response.status()).toBe(200); //check status 200
  console.log('Response status is ' + response.status()); 
  const booksAmount = fullResponse.books.length
  await expect(page.locator(".action-buttons")).toHaveCount(booksAmount); //check that amount of books = UI amount of books

//change the number of pages to a random number 
  const randomNumberOfPages = (Math.random() * (1000 - 1) + 1).toString();
  await page.route( "https://demoqa.com/BookStore/v1/Book?ISBN=*",
    async (route) => {
      const response = await route.fetch();
      let body = await response.text(); //почему-то не работает напрямую с JSON, только через текст. Не очень разобралась в этой части теста
      const searchBody = JSON.parse(body);

      body = body.replace(searchBody.pages, randomNumberOfPages);
      route.fulfill({
        response,
        body,
        headers: {
          ...response.headers(),
        },
      });
    }
  );

//click on a random book
  let rand = Math.floor(Math.random() * fullResponse.books.length);
  await page.locator(".action-buttons").nth(rand).click();

//check that the UI displays exactly the number that was specified earlier
  await expect(page.locator("#pages-wrapper #userName-value")).toHaveText(
    randomNumberOfPages
  );

//API request
  const APIresponse = await request.get(`https://demoqa.com/Account/v1/User/${userID}`,
//add token
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

// check response
  const responseInfo = await APIresponse.json();
  expect(responseInfo.username).toBe(credentials.userName);
  expect(responseInfo.books).toEqual([]);
  if(responseInfo.length > 0) {
    console.log('There are several books')
  } else {
      console.log('The number of books is 0')
  };
});