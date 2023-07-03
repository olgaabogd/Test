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

let responsePromise
let responseInfo
let fullResponse
let token
let userID
let APIresponse
let randomNumberOfPages: string
let userName
let expires

test('testFullApi', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const profilePage = new ProfilePage(page)
  const bookStorePage = new BookStorePage(page)

  // login
  await test.step('Login', async () => {
    await loginPage.goto()
    await loginPage.fillInLoginFields()
    await loginPage.clickLoginButton()

    await expect(loginPage.header).toHaveText('Profile')

    await profilePage.waitForURL()
  })

  // check cookies
  await test.step('Check that cookies are not empty', async () => {
    const cookies = await CookiesUtil.GetCookiesValues(page)
    cookies.forEach((cookie) => console.log(JSON.stringify(cookie)))

    // save variables
    userID = await CookiesUtil.SaveUserID(page)
    token = await CookiesUtil.SaveToken(page)

    // check that cookies are not empty
    userID = await CookiesUtil.GetSpecificCookieValue(page, 'userID')
    expect(userID).toBeTruthy()
    userName = await CookiesUtil.GetSpecificCookieValue(page, 'userName')
    expect(userName).toBeTruthy()
    expires = await CookiesUtil.GetSpecificCookieValue(page, 'expires')
    expect(expires).toBeTruthy()
    token = await CookiesUtil.GetSpecificCookieValue(page, 'token')
    expect(token).toBeTruthy()

    // block images
    await test.step('Block all the images', async () => {
      await RouteUtil.BlockImages(page)
    })

    // waiting to intercept a GET request
    await test.step('Intercept GET request, make screenshot', async () => {
      responsePromise = page.waitForResponse(
        'https://demoqa.com/BookStore/v1/Books'
      )

      await profilePage.goTo()
      await profilePage.clickBookStoreButton()
    })

    await test.step('Check GET request', async () => {
      const response = await responsePromise
      fullResponse = await response.json()
      expect(response.status()).toBe(200) // check status 200
      await ScreenshotUtil.MakeScreenshot(page)

      const booksAmount = fullResponse.books.length
      await expect(bookStorePage.linksOnBooks).toHaveCount(booksAmount) // check that amount of books = UI amount of books
    })

    // change the number of pages to a random number
    await test.step(`Change the number of pages to a random number `, async () => {
      await RouteUtil.ChangeNumberOfPagesToRandom(randomNumberOfPages, page)
    })

    // click on a book
    await test.step(`Click on a book`, async () => {
      await bookStorePage.clickBook()

      // check that the UI displays exactly the number that was specified earlier
      await test.step(`Check that the UI displays exactly the number that was specified earlier`, async () => {
        const pagesNumber = await bookStorePage.findNumberOfPagesOnUI()
        expect(pagesNumber).toBe(randomNumberOfPages)
      })

      // API request
      await test.step(`Add token`, async () => {
        APIresponse = await ApiUtil.GetDataAboutUser(page, userID, token)
      })

      // check response
      await test.step(`Check response`, async () => {
        responseInfo = await APIresponse.json()
        expect(responseInfo.username).toBe(credentials.userName)
        expect(responseInfo.books).toEqual([])
      })
    })
  })
})
