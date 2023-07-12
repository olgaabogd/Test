import { Page, Locator } from "@playwright/test";

export class ActionPage {
  readonly page: Page;

  readonly actionAndTrending: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actionAndTrending = page.locator(
      '.saleitembrowser_FlavorLabel_Dhg57 Focusable:has-text("New & Trending")'
    );
  }

    // async clickNewandTrending() {
    //   await this.actionAndTrending.click();
    // }
}
