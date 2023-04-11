// @ts-nocheck
const { test, expect } = require('@playwright/test');


test('locator.fill', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  const locator = page.locator('#firstName');
  await locator.fill('Olga');
  await expect(locator).toHaveValue('Olga');
});


test('locator.check.radiobutton', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  const otherText = page.getByText('Other');
  await otherText.check(); 
  await expect(otherText).toBeChecked();
});


test('locator.check.checkbox', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  const locator = page.getByText('Music');
  await locator.click({force: true});
  await expect(locator).toBeChecked();
});

test('locator.selectOption', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');
  const locator = page.locator('#oldSelectMenu');
  await locator.selectOption('Blue');
  await expect(locator).toHaveValue('1');
});

test('locator.click', async ({ page }) => {
  await page.goto('https://demoqa.com/buttons');
  await page.getByText('Double Click Me').dblclick();
  const locator = page.getByText('You have done a double click');
  await expect(locator).toBeVisible();

});

test('locator.hover', async ({ page }) => {
  await page.goto('https://demoqa.com/menu#');
  const locator = page.locator('#nav li:has-text("Main Item 1")');
  await locator.hover();
  await expect(locator).toHaveCSS('background-color', 'rgb(0, 63, 32)');
});

test('locator.setInputFiles', async ({ page }) => {
  const testDoc = 'TASK_2/tests/testDoc.txt';
  await page.goto('https://demoqa.com/upload-download');
  await page.locator('#uploadFile').setInputFiles(testDoc);
  const locator = page.locator('#uploadedFilePath');
  await expect(locator).toHaveText('C:\\fakepath\\testDoc.txt');
});


test('locator.press', async ({ page }) => {
  await page.goto('https://demoqa.com/login');
  const locator = page.getByPlaceholder('UserName');
  await locator.press('Shift+A');
  await expect(locator).toHaveValue('A');
});

test('locator.drag&drop', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable');
  await page.locator('//*[@id="draggable"]').hover();
  await page.mouse.down();
  await page.locator('#simpleDropContainer #droppable').hover();
  await page.mouse.up();
  await expect (page.getByText('Dropped')).toBeVisible()
});
