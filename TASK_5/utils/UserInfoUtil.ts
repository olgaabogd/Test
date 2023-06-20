import { Page } from "@playwright/test";

export class UserInfoUtil {
  static async saveUserID(page) {
    const cookies = await page.context().cookies();
    const userID = cookies.find((c) => c.name === "userID");
    if (userID) {
      return userID.value;
    } else {
      return null;
    }
  }

  static async saveToken(page) {
    const cookies = await page.context().cookies();
    const token = cookies.find((c) => c.name === "token");
    if (token) {
      return token.value;
    } else {
      return null;
    }
    //   static async saveUserData(page: Page, cookieName: string) {
    //     const cookies = await page.context().cookies();
    //     const cookie = cookies.find((c) => c.name === cookieName);
    //     return cookie ? cookie.value : null;
    //   }
  }
}
