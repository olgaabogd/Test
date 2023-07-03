import { Page } from '@playwright/test'

export class ApiUtil {
  static async GetDataAboutUser(page: Page, userID: any, token: any) {
    const responseAPI = await page.request.get(
      `https://demoqa.com/Account/v1/User/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return responseAPI
  }
}
