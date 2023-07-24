// @ts-check
import { test, expect } from '@playwright/test'
import * as credentials from '../infoForTests/cred.json'

import { LoginPage } from '../pages/loginPage'
import { ProfilePage } from '../pages/profilePage'
import { BookStorePage } from '../pages/bookStorePage'
import { RouteUtil } from '../utils/routeUtil'
import { ScreenshotUtil } from '../utils/screenshotUtil'
import { ApiUtil } from '../utils/apiUtil'
import { CookiesUtil } from '../utils/cookiesUtil'
import { RandomUtil } from '../utils/randomUtil'

let responsePromise
let token
let userID
let APIresponse
let randomNumberOfPages: string
let userName
let fullResponse

test('testFullApi', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const profilePage = new ProfilePage(page)
  const bookStorePage = new BookStorePage(page)

  // login
  await test.step('Login', async () => {
    await loginPage.goToLoginPage()
    await loginPage.fillInFieldsInLoginForm()
    await loginPage.clickLoginButton()

    await expect(loginPage.header).toHaveText('Profile')

    await profilePage.waitForProfilePageToLoad()
  })

  // check cookies
  await test.step('Check that cookies are not empty, save some of them ', async () => {
    userID = await CookiesUtil.GetSpecificCookieValue(page, 'userID')
    expect(userID).toBeTruthy()
    userName = await CookiesUtil.GetSpecificCookieValue(page, 'userName')
    expect(userName).toBeTruthy()
    const expires = await CookiesUtil.GetSpecificCookieValue(page, 'expires')
    expect(expires).toBeTruthy()
    token = await CookiesUtil.GetSpecificCookieValue(page, 'token')
    expect(token).toBeTruthy()
  })

  // block images
  await test.step('Block all the images', async () => {
    await RouteUtil.BlockImages(page)
  })

  // waiting to intercept a GET request
  await test.step('Intercept GET request, make screenshot', async () => {
    responsePromise = page.waitForResponse(
      'https://demoqa.com/BookStore/v1/Books'
    )

    await profilePage.goToProfilePage()
    await profilePage.clickBookStoreButton()
  })

  await test.step('Check GET request', async () => {
    const response = await responsePromise
    fullResponse = await response.json()
    expect(response.status()).toBe(200) // check status 200
    await ScreenshotUtil.MakeScreenshot(page, 'screenshot1')

    const booksAmount = fullResponse.books.length
    await expect(bookStorePage.linksOnBooks).toHaveCount(booksAmount) // check that amount of books = UI amount of books
  })

  // change the number of pages to a random number
  await test.step(`Change the number of pages to a random number `, async () => {
    randomNumberOfPages = await RandomUtil.GenerateRandomNumber(1, 1000)
    await RouteUtil.ChangeNumberOfPages(page, randomNumberOfPages)
  })

  // click on a book
  await test.step(`Click random book from the list`, async () => {
    const rand = await RandomUtil.GenerateRandomNumber(
      0,
      fullResponse.books.length
    )
    await bookStorePage.clickRandomBook(rand)
    await bookStorePage.waitForBookDetails()
  })

  // check that the UI displays exactly the number that was specified earlier
  await test.step(`Confirm that the UI displays exactly the number that was specified earlier`, async () => {
    await expect(bookStorePage.infoLineInBookDetails).toHaveText(
      randomNumberOfPages.toString()
    )
  })

  // API request
  await test.step(`Add token`, async () => {
    APIresponse = await ApiUtil.GetDetailsAboutUser(page, userID, token)
  })

  // check response
  await test.step(`Check response`, async () => {
    const responseInfo = await APIresponse.json()
    expect(responseInfo.username).toBe(credentials.userName)
    expect(responseInfo.books).toEqual([])
  })
})
