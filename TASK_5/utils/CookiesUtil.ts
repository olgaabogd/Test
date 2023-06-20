import {} from "@playwright/test";

export class CookiesUtil {
  static async getCookiesValues(page) {
    return await page.context().cookies();
  }

  static async getCookieValue(page, cookieName) {
    const cookies = await page.context().cookies();
    const userCookie = cookies.find((c) => c.name === cookieName);
    return userCookie ? userCookie.value : null;
  }
}
