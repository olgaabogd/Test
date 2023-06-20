import { Page } from "@playwright/test";

export class ScreenshotUtil {
  static async makeScreenshot(page: Page) {
    await page.screenshot({ path: 'infoForTests/screenshot.png' })
  }
}
