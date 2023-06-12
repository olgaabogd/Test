//@ts-check
import { test, expect, chromium } from "@playwright/test";
import * as credentials from "../infoForTests/cred.json";

import { LoginPage } from "../objects/loginPage";
import { ProfilePage } from "../objects/profilePage";
import { BookStorePage } from "../objects/bookStorePage";

let responsePromise;
let responseInfo;
let fullResponse;
let token;
let userID;
let APIresponse;
let randomNumberOfPages: string;

test("testFullApi", async ({ request }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);
  const bookStorePage = new BookStorePage(page);

  // login
  await test.step("Login", async () => {
    await loginPage.goto();
    await loginPage.fillInLoginFields();
    await loginPage.clickLoginButton();

    const locator = page.locator(".main-header");
    await expect(locator).toHaveText("Profile");

    await profilePage.waitForURL();
  });

  // checkin cookies
  await test.step("Check that cookies are not empty", async () => {
    const cookies = await profilePage.getCookiesValues();
    cookies.forEach((cookie) => console.log(JSON.stringify(cookie)));

    // save variables
    userID = await profilePage.saveUserID();
    token = await profilePage.saveToken();

    // check that cookies are not empty
    expect(cookies.find((c) => c.name === "userID").value).toBeTruthy();
    expect(cookies.find((c) => c.name === "userName").value).toBeTruthy();
    expect(cookies.find((c) => c.name === "expires").value).toBeTruthy();
    expect(cookies.find((c) => c.name === "token").value).toBeTruthy();
  });

  // block images
  await test.step("Block all the images", async () => {
    await bookStorePage.goToBookStorePage();
    await bookStorePage.blockImages();
  });

  // waiting to intercept a GET request
  await test.step("Intercept GET request, make screenshot", async () => {
    responsePromise = page.waitForResponse(
      "https://demoqa.com/BookStore/v1/Books"
    );

    await profilePage.goTo();
    await profilePage.clickBookStoreButton();
    await bookStorePage.makeScreenshot();
  });

  await test.step("Check GET request", async () => {
    const response = await responsePromise;
    fullResponse = await response.json();
    expect(response.status()).toBe(200); // check status 200
    console.log(`Response status is ${response.status()}`);

    const booksAmount = fullResponse.books.length;
    await expect(page.locator(".action-buttons")).toHaveCount(booksAmount); // check that amount of books = UI amount of books
  });

  // change the number of pages to a random number
  await test.step(`Change the number of pages to a random number `, async () => {
    await bookStorePage.changeNumberOfPagesToRandom(randomNumberOfPages);
  });

  // click on a random book
  await test.step(`Click on a random book`, async () => {
    await bookStorePage.clickOnRandomBook(fullResponse);
  });

  // check that the UI displays exactly the number that was specified earlier
  await test.step(`Check that the UI displays exactly the number that was specified earlier`, async () => {
    const pagesNumber = await bookStorePage.checkSpecifiedNumberOfPagesOnUI();
    expect(pagesNumber).toBe(randomNumberOfPages);
  });

  // API request
  await test.step(`Add token`, async () => {
    APIresponse = await profilePage.addToken(userID, token);
  });

  //check response
  await test.step(`Check response`, async () => {
    responseInfo = await APIresponse.json();
    expect(responseInfo.username).toBe(credentials.userName);
    expect(responseInfo.books).toEqual([]);
    if (responseInfo.length > 0) {
      console.log("There are several books");
    } else {
      console.log("The number of books is 0");
    }
  });
});
