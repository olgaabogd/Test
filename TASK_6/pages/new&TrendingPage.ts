import { Locator, Page } from '@playwright/test'

export class NewTrendingPage {
  readonly page: Page

  readonly installSteamButton: Locator

  constructor(page: Page) {
    this.page = page
    this.installSteamButton = page.getByText('Install Steam')
  }

  async clickInstallSteamButton() {
    await this.installSteamButton.click()
  }
}
