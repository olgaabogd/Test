import { Page } from '@playwright/test'

export class RandomUtil {
  static async GenerateRandomNumberForPagesAmount(min, max) {
    const randomNumberOfPages =
      Math.floor(Math.random() * (max - min + 1)) + min
    return randomNumberOfPages
  }

  static async SelectRandomBookNumber(fullResponse) {
    const rand = Math.floor(Math.random() * fullResponse.books.length)
    return rand
  }
}