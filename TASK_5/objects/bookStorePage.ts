import { Page } from "@playwright/test";

export class BookStorePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToBookStorePage() {
    await this.page.goto("https://demoqa.com/books");
  }

  async blockImages() {
    await this.page.route("**/*", (route) => {
      return route.request().resourceType() === "image"
        ? route.abort()
        : route.continue();
    });
  }

  async makeScreenshot() {
    await this.page.screenshot({ path: "infoForTests/screenshot.png" });
  }

  async changeNumberOfPagesToRandom(randomNumberOfPages) {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    await this.page.route(
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

  async clickOnRandomBook(fullResponse) {
    const rand = Math.floor(Math.random() * fullResponse.books.length);
    await this.page.locator(".action-buttons").nth(rand).click();
  }

  async checkSpecifiedNumberOfPagesOnUI() {
    await this.page.locator("#pages-wrapper         #userName-value");
  }
}
