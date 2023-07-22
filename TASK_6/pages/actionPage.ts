import { Page, Locator } from "@playwright/test";

export class ActionPage {
  readonly page: Page;

  readonly actionAndTrending: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actionAndTrending = page.getByText("New & Trending"
    );
  }

    // async clickNewandTrending() {
    //   await this.actionAndTrending.click();
    // }
}
