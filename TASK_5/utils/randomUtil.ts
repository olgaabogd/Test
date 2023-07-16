import {} from '@playwright/test'

export class RandomUtil {
  static async GenerateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
