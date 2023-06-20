import { Locator, Page } from "@playwright/test";
import { RandomUtil } from "../utils/RandomUtil";

export class BookStorePage {
  readonly page: Page;
  readonly linksOnBooks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linksOnBooks = page.locator(".action-buttons");
  }

  async goToBookStorePage() {
    await this.page.goto("https://demoqa.com/books");
  }

  async clickOnRandomBook(randomNumber) {
    await this.page.locator(".action-buttons").nth(randomNumber).click();
  }

  async findNumberOfPagesOnUI() {
    await this.page.locator("#pages-wrapper");
  }
}
