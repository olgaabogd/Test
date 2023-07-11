import { Page } from '@playwright/test'

export class CookiesUtil {
  static async GetSpecificCookieValue(page: Page, cookieName) {
    const cookies = await page.context().cookies()
    cookies.forEach((cookie) => console.log(JSON.stringify(cookie)))
    const userCookie = cookies.find((c) => c.name === cookieName)
    return userCookie ? userCookie.value : null
  }
}
