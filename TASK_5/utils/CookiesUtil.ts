import {} from "@playwright/test";

export class CookiesUtil {
  static async getCookiesValues(page) {
    return await page.context().cookies();
  }
}
