import { Locator, Page } from '@playwright/test'

export class MainStorePage {
  readonly page: Page

  readonly categories: Locator

  readonly installSteamButton: Locator

  constructor(page: Page) {
    this.page = page
    this.categories = page.locator('.pulldown_desktop:has-text("Categories")')
     this.installSteamButton = page.getByText('Install Steam')
  }

  async goto() {
    await this.page.goto('https://store.steampowered.com/')
  }

  async waitForURLOfSteamWebsite() {
    await this.page.waitForURL('https://store.steampowered.com/')
  }

  async hoverOverCategories() {
    await this.categories.hover()
  }

  async clickCategoryNameInTheList(categoryName) {
    await this.page
      .locator('#genre_flyout')
      .getByRole('link', { name: categoryName, exact: true })
      .click()
  }

  async waitForURLForExactCategory() {
    await this.page.waitForURL(
      'https://store.steampowered.com/category/action/'
    )
  }

  async clickInstallSteam() {
    await this.installSteamButton.click()
  }
}
