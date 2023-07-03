import { Page } from '@playwright/test'

export class RouteUtil {
  static async BlockImages(page: Page) {
    await page.route('**/*', (route) => {
      return route.request().resourceType() === 'image'
        ? route.abort()
        : route.continue()
    })
  }

  static async ChangeNumberOfPagesToRandom(randomNumberOfPages, page: Page) {
    randomNumberOfPages = (Math.random() * (1000 - 1) + 1).toString()
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
