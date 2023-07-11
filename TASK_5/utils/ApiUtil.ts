import { Page } from '@playwright/test'

export class ApiUtil {
  static async GetDetailsAboutUser(page: Page, userID: any, token: any) {
    return page.request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
