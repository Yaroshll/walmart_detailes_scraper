import { parseProduct } from "./helpers/parseProduct.js";
import { saveToExcel } from "./helpers/saveToExcel.js";
import {
  launchBrowser,
  createBrowserContext,
  createPage,
} from "./helpers/browser.js";

const productUrls = [
  "https://www.walmart.com/ip/FEISEDY-Vintage-Square-Polarized-Mirrored-Pink-Sunglasses-for-Women-100-UV400-Outdoor-Driving-Fashion-Sunglasses-B2526/877502219?classType=VARIANT&athbdg=L1800&adsRedirect=true"
];

async function start() {
  const allRecords = [];

  for (const url of productUrls) {
    console.log("Scraping:", url);

    const browser = await launchBrowser();
    const context = await createBrowserContext(browser);
    const page = await createPage(context);

    await page.goto(url, { waitUntil: "networkidle" });

    const productVariants = await parseProduct(page, url);
    allRecords.push(...productVariants);

    await browser.close();
  }

  saveToExcel("products.xlsx", allRecords);
}

start();
