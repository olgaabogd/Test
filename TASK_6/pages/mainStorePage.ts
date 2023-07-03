import { Page } from '@playwright/test'

export class MainStorePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto() {
    await this.page.goto('https://store.steampowered.com/')
  }
}
