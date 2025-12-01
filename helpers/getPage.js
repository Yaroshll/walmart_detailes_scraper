import { chromium } from "playwright";

export async function getPage(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });

  return { browser, page };
}
