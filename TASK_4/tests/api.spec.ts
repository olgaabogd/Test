// @ts-check
import { test, expect, chromium } from '@playwright/test'

import * as credentials from '../infoForTests/cred.json'

let responsePromise
let fullResponse
let token
let userID
let APIresponse
let randomNumberOfPages: string

test('testFullApi', async ({ request }) => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  // login
  await test.step(`Login`, async () => {
    await page.goto('https://demoqa.com/login')
    await page.getByPlaceholder('UserName').fill(credentials.userName)
    await page.getByPlaceholder('Password').fill(credentials.password)
    await page.locator('#login').click()

    const locator = page.locator('.main-header')
    await expect(locator).toHaveText('Profile')
    await page.waitForURL('https://demoqa.com/profile')
  })

  await test.step(`Check that cookies are not empty`, async () => {
    const cookies = await page.context().cookies()
    // checkin cookies

    cookies.forEach((cookie) => console.log(JSON.stringify(cookie)))
    // save variables
    userID = cookies.find((c) => c.name === 'userID').value
    token = cookies.find((c) => c.name === 'token').value

    // check that cookies are not empty
    await expect(cookies.find((c) => c.name === 'userID').value).toBeTruthy()
    await expect(cookies.find((c) => c.name === 'userName').value).toBeTruthy()
    await expect(cookies.find((c) => c.name === 'expires').value).toBeTruthy()
    await expect(cookies.find((c) => c.name === 'token').value).toBeTruthy()
  })

  // block images
  await test.step(`Block all the images`, async () => {
    await page.route('**/*', (route) => {
      return route.request().resourceType() === 'image'
        ? route.abort()
        : route.continue()
    })
  })

  // waiting to intercept a GET request
  await test.step(`Intercept GET request, make screenshot`, async () => {
    responsePromise = page.waitForResponse(
      'https://demoqa.com/BookStore/v1/Books'
    )
    await page.locator('.text:text-is("Book Store")').click()
    await page.screenshot({ path: 'infoForTests/screenshot.png' })
  })

  await test.step(`Check GET request`, async () => {
    const response = await responsePromise
    fullResponse = await response.json()
    expect(response.status()).toBe(200) // check status 200
    console.log(`Response status is ${response.status()}`)
    const booksAmount = fullResponse.books.length
    await expect(page.locator('.action-buttons')).toHaveCount(booksAmount) // check that amount of books = UI amount of books
  })

  // change the number of pages to a random number
  await test.step(`Change the number of pages to a random number `, async () => {
    randomNumberOfPages = (Math.random() * (1000 - 1) + 1).toString()
    await page.route(
      'https://demoqa.com/BookStore/v1/Book?ISBN=*',
      async (route) => {
        const response = await route.fetch()
        let body = await response.text() // почему-то не работает напрямую с JSON, только через текст. Не очень разобралась в этой части теста
        const searchBody = JSON.parse(body)

        body = body.replace(searchBody.pages, randomNumberOfPages)
        route.fulfill({
          response,
          body,
          headers: {
            ...response.headers(),
          },
        })
      }
    )
  })

  // click on a random book
  await test.step(`Click on a random book`, async () => {
    const rand = Math.floor(Math.random() * fullResponse.books.length)
    await page.locator('.action-buttons').nth(rand).click()
  })

  // check that the UI displays exactly the number that was specified earlier
  await test.step(`Check that the UI displays exactly the number that was specified earlier`, async () => {
    await expect(page.locator('#pages-wrapper #userName-value')).toHaveText(
      randomNumberOfPages
    )
  })

  // API request
  await test.step(`Add token`, async () => {
    APIresponse = await request.get(
      `https://demoqa.com/Account/v1/User/${userID}`,
      // add token
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  })

  // check response
  await test.step(`Check response`, async () => {
    const responseInfo = await APIresponse.json()
    expect(responseInfo.username).toBe(credentials.userName)
    expect(responseInfo.books).toEqual([])
    if (responseInfo.length > 0) {
      console.log('There are several books')
    } else {
      console.log('The number of books is 0')
    }
  })
})
