import { Locator, Page } from '@playwright/test'

export class BookStorePage {
  readonly page: Page

  readonly linksOnBooks: Locator

  constructor(page) {
    this.page = page
    this.linksOnBooks = page.locator('.action-buttons')
  }

  async goToBookStorePage() {
    await this.page.goto('https://demoqa.com/books')
  }

  async clickRandomBook(fullResponse) {
    const rand = Math.floor(Math.random() * fullResponse.books.length)
    await this.page.locator('.action-buttons').nth(rand).click()
  }

  async numberOfPagesLocator() {
    await this.page.locator('#pages-wrapper')
  }
}
