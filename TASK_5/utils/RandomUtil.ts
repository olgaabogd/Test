import { } from "@playwright/test";

export class RandomUtil {
    static async selectRandomNumber(fullResponse) {
    const randomNumber = Math.floor(Math.random() * fullResponse.books.length);
    await console.log(randomNumber);
  }
}