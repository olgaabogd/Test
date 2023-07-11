import { Page } from '@playwright/test'

export class ScreenshotUtil {
  static async MakeScreenshot(page: Page, filename) {
    await page.screenshot({ path: `infoForTests/${filename}.png` })
  }
}
