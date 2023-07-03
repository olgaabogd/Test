import { Locator, Page } from '@playwright/test'

export class BookStorePage {
  readonly page: Page

  readonly linksOnBooks: Locator

  readonly bookForPagesAmountCheck: Locator

  constructor(page) {
    this.page = page
    this.linksOnBooks = page.locator('.action-buttons')
  }

  async goToBookStorePage() {
    await this.page.goto('https://demoqa.com/books')
  }

  async clickBook() {
    await this.page.getByText('Learning JavaScript Design Patterns').click()
  }

  async findNumberOfPagesOnUI() {
    await this.page.locator('#pages-wrapper')
  }
}
