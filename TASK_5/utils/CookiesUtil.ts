import {} from '@playwright/test'

export class CookiesUtil {
  static async GetCookiesValues(page) {
    return page.context().cookies()
  }

  static async GetSpecificCookieValue(page, cookieName) {
    const cookies = await page.context().cookies()
    const userCookie = cookies.find((c) => c.name === cookieName)
    return userCookie ? userCookie.value : null
  }

  static async SaveUserID(page) {
    const cookies = await page.context().cookies()
    const userID = cookies.find((c) => c.name === 'userID')
    if (userID) {
      return userID.value
    }
    return null
  }

  static async SaveToken(page) {
    const cookies = await page.context().cookies()
    const token = cookies.find((c) => c.name === 'token')
    if (token) {
      return token.value
    }
    return null
  }
}
