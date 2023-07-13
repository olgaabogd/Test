import { Locator, Page } from '@playwright/test'

export class BookStorePage {
  readonly page: Page

  readonly linksOnBooks: Locator

  readonly numberOfPagesOnUI: Locator

  readonly infoLineInBookDetails: Locator

  constructor(page) {
    this.page = page
    this.linksOnBooks = page.locator('.action-buttons')
    this.numberOfPagesOnUI = page.locator('#pages-wrapper')
    this.infoLineInBookDetails = page.locator('#pages-wrapper > div.col-md-9.col-sm-12')
  }

  async goToBookStorePage() {
    await this.page.goto('https://demoqa.com/books')
  }

  async clickRandomBook(rand) {
    await this.linksOnBooks.nth(rand).click()
  }

  async waitForBookDetails() {
    await this.page.waitForSelector('.books-wrapper')
  }

  async checkUIPagesAmount() {
    const element = await this.infoLineInBookDetails;
    const value = await element.evaluate(el => el.textContent);
    return value;
  }


}

