import { launchBrowser, createBrowserContext, createPage } from "./helpers/browser.js";
import { extractBasicInfo } from "./helpers/extract.js";
import { extractAllVariants } from "./helpers/variants.js";
import { saveJSON, saveCSV } from "./helpers/save.js";

// Walmart product URL
const url = "https://www.walmart.com/ip/Casio-G-Shock-Women-s-Shock-Resistant-20-0Meter-Water-Resistant-Watch-Model-GMA-S140-4ACR/530317188";

const browser = await launchBrowser();
const context = await createBrowserContext(browser);
const page = await createPage(context);

// Navigate to product URL
await page.goto(url, { waitUntil: "load", timeout: 0 });

// Extract basic info
const basic = await extractBasicInfo(page);

// Extract all variants including Out of Stock
const allVariants = await extractAllVariants(page, basic, url);

console.log("📊 Variants collected:", allVariants.length);

// Save JSON & CSV
saveJSON(allVariants, "walmart_variants.json");
saveCSV(allVariants, "walmart_variants.csv");

await browser.close();
