export async function parseProduct(page, url) {
  // ===== BRAND =====
  const brand = await page
    .locator('a[data-dca-name="ItemBrandLink"]')
    .innerText()
    .catch(() => "");

  // ===== TITLE =====
  const rawTitle = await page
    .locator("#main-title")
    .innerText()
    .catch(() => "");
  const formattedTitle = rawTitle.replace(brand, `${brand},`).trim();

  // ===== HANDLE =====
  const handle = rawTitle.replace(/\s+/g, "-").trim();

  // ===== DESCRIPTION BODY (HTML UL) =====
  let bodyHtml = "";
  if ((await page.locator("#product-description-atf ul").count()) > 0) {
    bodyHtml = `<ul>${await page
      .locator("#product-description-atf ul")
      .innerHTML()}</ul>`;
  } else if (
    (await page
      .locator('div[data-testid="ip-smart-summary-dom-purify"] ul')
      .count()) > 0
  ) {
    bodyHtml = `<ul>${await page
      .locator('div[data-testid="ip-smart-summary-dom-purify"] ul')
      .innerHTML()}</ul>`;
  }

  // ===== VARIANTS SECTION =====
// ========== VARIANTS NEW WAY — SAFE, FAST, 100% WORKS ==========
const variants = [];

// get all variant inputs (radio buttons)
const inputs = await page.$$eval(
  'div[data-testid="variant-tile"] input',
  els => els.map(e => ({ id: e.id, value: e.value }))
);

// get option name
const optionName = await page.locator('.mid-gray.mb2 span.b')
  .innerText()
  .then(t => t.replace(":", "").trim())
  .catch(() => "Option");

// loop through variants
for (const v of inputs) {
  
  // switch variant without clicking UI
  await page.evaluate((id) => {
    document.getElementById(id)?.click();
  }, v.id);

  await page.waitForTimeout(800);

  // collect image
  const imageSrc = await page.locator('img[data-testid="hero-image"]').getAttribute("src");

  // collect price
  let price = await page
    .locator('[data-testid="price-display"] span')
    .innerText()
    .catch(() => "");

  price = price.replace("$", "").trim();

  variants.push({
    handle,
    brandName: brand,
    title: formattedTitle,
    bodyHtml,
    optionName,
    optionValue: v.value,
    priceInDollar: price,
    imageSrc,
    url
  });
}


  return variants;
}
