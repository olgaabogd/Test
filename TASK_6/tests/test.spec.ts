// @ts-check
import { test, expect } from "@playwright/test";

import { MainStorePage } from "../pages/mainStorePage";
import { NewTrendingPage } from "../pages/new&TrendingPage";
import { AboutPage } from "../pages/aboutPage";
import { ActionPage } from "../pages/actionPage";
// import { DownloadUtil } from "../utils/downloadUtil";

test("steamTest", async ({ page }) => {
  const mainStorePage = new MainStorePage(page);
  const newTrendingPage = new NewTrendingPage(page);
  const aboutPage = new AboutPage(page);
  // const downloadSetupFile = new DownloadUtil(page);
  const actionPage = new ActionPage(page);

  // 1
  await test.step("Open Steam website", async () => {
    await mainStorePage.goto(); // open website
    await mainStorePage.waitForURLOfSteamWebsite(); // make sure that website has opened
  });

  // 2
  await test.step("Go to Categories -> Action", async () => {
    await mainStorePage.hoverOverCategories(); // hover mouse over 'Categories'
    await mainStorePage.clickCategoryNameInTheList("Action"); // select Action
    await mainStorePage.waitForURLForExactCategory(); // make sure that needed page has opened
  });
});
