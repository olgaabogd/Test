import { Locator, Page } from '@playwright/test'
import * as credentials from '../infoForTests/cred.json'

export class LoginPage {
  readonly page: Page

  readonly userNameField: Locator

  readonly passwordField: Locator

  readonly loginButton: Locator

  readonly header: Locator

  constructor(page: Page) {
    this.page = page
    this.userNameField = page.getByPlaceholder('UserName')
    this.passwordField = page.getByPlaceholder('Password')
    this.loginButton = page.locator('#login')
    this.header = page.locator('.main-header')
  }

  async goToLoginPage() {
    await this.page.goto('https://demoqa.com/login')
  }

  async fillInFieldsInLoginForm() {
    await this.userNameField.fill(credentials.userName)
    await this.passwordField.fill(credentials.password)
  }

  async clickLoginButton() {
    await this.loginButton.click()
  }
}
