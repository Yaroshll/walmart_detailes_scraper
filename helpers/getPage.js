import { chromium } from "playwright";

export async function getPage(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  page.setDefaultNavigationTimeout(0);

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
  await page.waitForTimeout(2000);

  return { browser, page };
}
