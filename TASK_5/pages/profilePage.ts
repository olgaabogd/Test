import { Locator, Page } from '@playwright/test'

export class ProfilePage {
  readonly page: Page

  readonly bookStoreButton: Locator

  constructor(page: Page) {
    this.page = page
    this.bookStoreButton = page.locator('.text:text-is("Book Store")')
  }

  async waitForProfilePageToLoad() {
    await this.page.waitForURL('https://demoqa.com/profile')
  }

  async goToProfilePage() {
    await this.page.goto('https://demoqa.com/profile')
  }

  async clickBookStoreButton() {
    await this.bookStoreButton.click()
  }
}
