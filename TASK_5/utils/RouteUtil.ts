import { Page } from "@playwright/test";

export class RouteUtil {
  static async blockImages(page: Page) {
    await page.route("**/*", (route) => {
      return route.request().resourceType() === "image"
        ? route.abort()
        : route.continue();
    });
  }

  static async changeNumberOfPagesToRandom(randomNumberOfPages, page: Page) {
    randomNumberOfPages = (Math.random() * (1000 - 1) + 1).toString();
    await page.route(
      "https://demoqa.com/BookStore/v1/Book?ISBN=*",
      async (route) => {
        const response = await route.fetch();
        let body = await response.text();
        const searchBody = JSON.parse(body);

        body = body.replace(searchBody.pages, randomNumberOfPages);
        route.fulfill({
          response,
          body,
          headers: {
            ...response.headers(),
          },
        });
      }
    );
  }
}
