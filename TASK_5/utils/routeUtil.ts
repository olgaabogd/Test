import { Page } from '@playwright/test'

export class RouteUtil {
  static async BlockImages(page: Page) {
    await page.route('**/*', (route) => {
      return route.request().resourceType() === 'image'
        ? route.abort()
        : route.continue()
    })
  }

  static async ChangeNumberOfPages(page: Page, randomNumberOfPages: string) {
    await page.route(
      'https://demoqa.com/BookStore/v1/Book?ISBN=*',
      async (route) => {
        const response = await route.fetch()
        const body = await response.text()
        const booksBody = JSON.parse(body)
        const modifiedBody = body.replace(
          booksBody.pages,
          randomNumberOfPages.toString()
        )
        route.fulfill({
          response,
          body: modifiedBody,
          headers: { ...response.headers() },
        })
      }
    )
  }
}
