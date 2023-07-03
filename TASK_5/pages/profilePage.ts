import { Page } from '@playwright/test'

export class ProfilePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async waitForURL() {
    await this.page.waitForURL('https://demoqa.com/profile')
  }

  async goTo() {
    await this.page.goto('https://demoqa.com/profile')
  }

  async clickBookStoreButton() {
    await this.page.locator('.text:text-is("Book Store")').click()
  }
}
