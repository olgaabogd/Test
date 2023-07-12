import { Locator, Page } from "@playwright/test";

export class AboutPage {
  readonly page: Page;

  readonly aboutSteam: Locator;

  constructor(page: Page) {
    this.page = page;
    this.aboutSteam = page.locator(".about_subtitle");
  }
}
