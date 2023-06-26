//@ts-check
import { test, expect, chromium } from "@playwright/test";
import * as credentials from "../infoForTests/cred.json";

import { LoginPage } from "../pages/loginPage";
import { ProfilePage } from "../pages/profilePage";
import { BookStorePage } from "../pages/bookStorePage";
import { RouteUtil } from "../utils/RouteUtil";
import { ScreenshotUtil } from "../utils/ScreenshotUtil";
import { RandomUtil } from "../utils/RandomUtil";
import { ApiUtil } from "../utils/ApiUtil";
import { CookiesUtil } from "../utils/CookiesUtil";
import { UserInfoUtil } from "../utils/UserInfoUtil";

let responsePromise;
let responseInfo;
let fullResponse;
let token;
let userID;
let APIresponse;
let randomNumberOfPages: string;
let userName;
let expires;

test("testFullApi", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);
  const bookStorePage = new BookStorePage(page);

  // login
  await test.step("Login", async () => {
    await loginPage.goto();
    await loginPage.fillInLoginFields();
    await loginPage.clickLoginButton();

    await expect(loginPage.header).toHaveText("Profile");

    await profilePage.waitForURL();
  });

  // checkin cookies
  await test.step("Check that cookies are not empty", async () => {
    const cookies = await CookiesUtil.getCookiesValues(page);
    cookies.forEach((cookie) => console.log(JSON.stringify(cookie)));

    // save variables
    userID = await UserInfoUtil.saveUserID(page);
    token = await UserInfoUtil.saveToken(page);

    // check that cookies are not empty
    userID = await CookiesUtil.getSpecificCookieValue(page, "userID");
    expect(userID).toBeTruthy();
    userName = await CookiesUtil.getSpecificCookieValue(page, "userName");
    expect(userName).toBeTruthy();
    expires = await CookiesUtil.getSpecificCookieValue(page, "expires");
    expect(expires).toBeTruthy();
    token = await CookiesUtil.getSpecificCookieValue(page, "token");
    expect(token).toBeTruthy();

    // block images
    await test.step("Block all the images", async () => {
      await RouteUtil.blockImages(page);
    });

    // waiting to intercept a GET request
    await test.step("Intercept GET request, make screenshot", async () => {
      responsePromise = page.waitForResponse(
        "https://demoqa.com/BookStore/v1/Books"
      );

      await profilePage.goTo();
      await profilePage.clickBookStoreButton();
      await ScreenshotUtil.makeScreenshot(page);
    });

    await test.step("Check GET request", async () => {
      const response = await responsePromise;
      fullResponse = await response.json();
      expect(response.status()).toBe(200); // check status 200
      console.log(`Response status is ${response.status()}`);

      const booksAmount = fullResponse.books.length;
      await expect(bookStorePage.linksOnBooks).toHaveCount(booksAmount); // check that amount of books = UI amount of books
    });

    // change the number of pages to a random number
    await test.step(`Change the number of pages to a random number `, async () => {
      await RouteUtil.changeNumberOfPagesToRandom(randomNumberOfPages, page);
    });

    // click on a random book
    await test.step(`Click on a random book`, async () => {
      await RandomUtil.selectRandomNumber(fullResponse);
      //  await bookStorePage.clickOnRandomBook(randomNumber);
    });

    // check that the UI displays exactly the number that was specified earlier
    await test.step(`Check that the UI displays exactly the number that was specified earlier`, async () => {
      const pagesNumber = await bookStorePage.findNumberOfPagesOnUI();
      expect(pagesNumber).toBe(randomNumberOfPages);
    });

    // API request
    await test.step(`Add token`, async () => {
      APIresponse = await ApiUtil.getDataAboutUser(page, userID, token);
    });

    //check response
    await test.step(`Check response`, async () => {
      responseInfo = await APIresponse.json();
      expect(responseInfo.username).toBe(credentials.userName);
      expect(responseInfo.books).toEqual([]);
    });
  });
});
