// @ts-check
import { test, expect } from "@playwright/test";

import { MainStorePage } from "../pages/mainStorePage";

test("steamTest", async ({ page }) => {
  const mainStorePage = new MainStorePage(page);

  await test.step("Open website", async () => {
    await mainStorePage.goto();
  });
});
