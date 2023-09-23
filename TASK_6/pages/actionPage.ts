import { Page, Locator } from "@playwright/test";

export class ActionPage {
  readonly page: Page;
  private readonly tabSelector: string;
  readonly NewAndTrending: Locator;

   
  constructor(page: Page) {
    this.page = page;
    this.tabSelector = "#SaleSection_13268";
    this.NewAndTrending = page.locator('div.saleitembrowser_SaleItemBrowserHeaderContainer__MBp9.Panel.Focusable > div > div:nth-child(2)')
   }

async scrollToNewAndTrending() {
  return new Promise<void>(async (resolve) => {
    await this.page.evaluate(async () => {
      const tab = document.querySelector('#SaleSection_13268');
      if (tab) {
        tab.scrollIntoView();
      }
    });
    resolve();
  })
}

async clickNewAndTrendingTab() {
    await this.page.waitForSelector(this.tabSelector);
    await this.NewAndTrending.click();
}

}
