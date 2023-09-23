import { Locator, Page } from '@playwright/test'

export class NewAndTrendingPage {
  readonly page: Page

  readonly installSteamButton: Locator

  constructor(page: Page) {
    this.page = page
    this.installSteamButton = page.getByText('Install Steam')
  }

  async waitForURLOfNewAndTrendingPage() {
    await this.page.waitForURL('https://store.steampowered.com/category/action/?flavor=contenthub_newandtrending')
  }

//   async clickInstallSteamButton() {
//     await this.installSteamButton.click()
//   }
}
