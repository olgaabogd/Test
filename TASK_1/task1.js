// @ts-check
const { test, expect } = require('@playwright/test');

test('byCSS', async ({ page }) => {
    await page.goto('https://www.onliner.by');
    await page.locator('.input.fast-search__input');

});

test('byXPATH', async ({ page }) => {
    await page.goto('https://www.onliner.by');
    await page.locator('//*[@id="fast-search"]/form/input[1]')
});

test('byPlaceholder', async ({ page }) => {
    await page.goto('https://www.onliner.by');
    await page.getByPlaceholder("Поиск в Каталоге.")
});

test('byAnotherLocator', async ({ page }) => {
    await page.goto('https://www.onliner.by');
    await page
    .getByRole('listitem')
    .filter({ has: page.getByText('Портативные зарядные устройства') })
});

test('byText', async ({ page }) => {
    await page.goto('https://www.onliner.by');
    await page
    // @ts-ignore
    .getByRole('project-navigation__sign')
    .filter({ hasText: ' Электрические зубные щетки и ирригаторы ' })
});

test('listOfAllElelements', async ({ page }) => {
    await page.goto('https://onliner.by/');
    await expect(
        page.locator('.project-navigation__sign'))
        .toHaveText([' Наушники и гарнитуры ', ' Умные часы и браслеты ', ' Фены ', 
        'Электрические зубные щетки и ирригаторы', 'Портативные зарядные устройства', 'Мыши', 
        'Мобильные телефоны', 'Массажеры и массажные кресла', 'Пылесосы'])
    });

test('oneELement', async ({ page }) => {
    await page.goto('https://onliner.by/');
    await page.locator('.project-navigation__sign').nth(1).click();
});


test('byTitle', async ({ page }) => {
        await page.goto('https://onliner.by/');
        await page.getByTitle('Onlíner');
    });

test('byLabel', async ({ page }) => {
        await page.goto('https://onliner.by/');
        await page.getByLabel('Password')
   });
