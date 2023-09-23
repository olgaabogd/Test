// @ts-check
import { test, expect } from "@playwright/test";

import { MainStorePage } from "../pages/mainStorePage";
import { ActionPage } from "../pages/actionPage";
import { NewAndTrendingPage } from "../pages/newAndTrendingPage";
import { DownloadUtil } from "../utils/downloadUtils";
import * as fs from 'fs';
import * as path from 'path';

test("steamTest", async ({ page }) => {
  const mainStorePage = new MainStorePage(page);
  const actionPage = new ActionPage(page);
  const newAndTrendingPage = new NewAndTrendingPage(page);
  const downloadUtil = new DownloadUtil(page)

  // 1 Go to https://store.steampowered.com/
  await test.step("Open Steam website", async () => {
    await mainStorePage.goto(); // open website
    await mainStorePage.waitForURLOfSteamWebsite(); // make sure that website has opened
  });

  // 2 Hover the mouse over Categories > click Action
  await test.step("Go to Categories -> Action", async () => {
    await mainStorePage.hoverOverCategories(); // hover mouse over 'Categories'
    await mainStorePage.clickCategoryNameInTheList("Action"); // select "Action"
    await mainStorePage.waitForURLForExactCategory(); // make sure that needed page has opened
  });

  //3 Open 'New&Trending' page
  await test.step("Go to Categories -> Action", async () => {
    await actionPage.scrollToNewAndTrending() //scroll to the block with 'New & Trending' tab
    await actionPage.clickNewAndTrendingTab() // open 'New & Trending' tab
    await newAndTrendingPage.waitForURLOfNewAndTrendingPage() // make sure that needed page has opened
    });

  //4 Select a game with the maximum discount or price (only on the first page)
  
  await test.step('Select game with maximum discount or price', async () => {
    await page.goto('https://store.steampowered.com/category/action/?flavor=contenthub_newandtrending');

  await page.waitForTimeout(3000)
  const currentPrice =
    'div.facetedbrowse_FacetedBrowseItems_NO-IP div.salepreviewwidgets_StoreSalePriceBox_Wh0L8'
  const currentDiscount =
    'div.facetedbrowse_FacetedBrowseItems_NO-IP div.salepreviewwidgets_StoreSaleDiscountBox_2fpFv'
  let gamesWithDiscount = await page.$$(currentDiscount)

   if (gamesWithDiscount.length > 0) {
      // There are games with discounts

     const gameDiscounts = await Promise.all(gamesWithDiscount.map(async (game) => {
     const discountText = await game.innerText();
     return parseInt(discountText.replace('-', '').replace('%', ''));
        })
      )
      const maxDiscount = Math.max(...gameDiscounts)
      const maxDiscountIndex = gameDiscounts.indexOf(maxDiscount)

      // Create selector for a selected game
     const parentElement = page.locator('.ImpressionTrackedElement', {
        hasText: `-${maxDiscount}%`,
      });
      const selectedGameLink = parentElement.getByRole('link').first();
      if (selectedGameLink) {
        // Click the link and wait it to load
        await selectedGameLink.click()
        await page.waitForTimeout(2000)
        
      } else {
        // Error processing
        console.log(JSON.stringify(selectedGameLink))
        console.log(JSON.stringify(gamesWithDiscount))
        console.log(JSON.stringify(maxDiscountIndex))
        console.error('Failed to click')
      }
    } else {
      // If there are no games with discounts, select the game with the maximum price
      const gamePrices = await page.$$eval(currentPrice, (elements) =>
        elements.map((element) => {
          const priceText = element.textContent
          if (priceText) {
            const price = parseFloat(
              priceText.replace(',', '.').replace('€', '')
            )
            return price
          }
          return 0
        })
      )

      const maxPriceIndex = gamePrices.indexOf(Math.max(...gamePrices))

      // Creating a selector for the game with the maximum price
      const maxPriceGameLinkSelector =
        "//div[contains(@class, 'StoreSalePriceWidgetContainer')]/div[contains(text(),'" +
        maxPriceIndex +
        "')]/ancestor::div[@class='ImpressionTrackedElement']//div[contains(@class, 'StoreSaleWidgetTitle')]/parent::a"

      // Find a link to the game with the maximum price
      const selectedMaxPriceGameLink = await page.$(maxPriceGameLinkSelector)

      if (selectedMaxPriceGameLink) {
        // Click the link 
        await selectedMaxPriceGameLink.click()
      } else {
        // Error processing
        console.error('Failed to find game element.')
      }
    }
  })

  //5





  

  //6 Click on the Install Steam link in the upper right corner
  await test.step('Download Setup file', async () => {
    await mainStorePage.clickInstallSteam()
  })

 // 7 Download Setup файл
  await test.step('Download Setup file', async () => {
    await downloadUtil.downloadSetupFile(page)
    await downloadUtil.checkDownloadedFile()

    
  });
  
  // 8 Переименовать скачанный файл – добавить к имени текущий timestamp()
  await test.step('Rename downloaded file', async () => {
    const path = require('path');
    const downloadPath =
      path.resolve(__dirname, '../userFiles')

    // await downloadUtil.renameDownloadedFile(downloadPath)
})

})
