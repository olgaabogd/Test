import { Page } from '@playwright/test'

export class RouteUtil {
  static async BlockImages(page: Page) {
    await page.route('**/*', (route) => {
      return route.request().resourceType() === 'image'
        ? route.abort()
        : route.continue()
    })
  }

  static async GenerateRandomNumber(min, max) {
    const randomNumberOfPages =
      Math.floor(Math.random() * (max - min + 1)) + min
    console.log(randomNumberOfPages)
  }

  static async ChangeNumberOfPagesToRandom(randomNumberOfPages, page: Page) {
    await page.route(
      'https://demoqa.com/BookStore/v1/Book?ISBN=*',
      async (route) => {
        const response = await route.fetch()
        let body = await response.text()
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
  }
}
