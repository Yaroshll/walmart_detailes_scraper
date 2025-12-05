export async function parseProduct(page, url) {
  // ===== BRAND =====
  const brand = await page
    .locator('a[data-dca-name="ItemBrandLink"]')
    .innerText()
    .catch(() => "");
    console.log(brand);

  // ===== TITLE =====
  const rawTitle = await page
    .locator("#main-title")
    .innerText()
    .catch(() => "");
  const formattedTitle = rawTitle.replace(brand, `${brand},`).trim();

  // ===== HANDLE =====
  const handle = rawTitle.replace(/\s+/g, "-").trim();
   console.log(handle);
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
/// ===== VARIANTS SECTION =====
const variants = [];

// wait for variant inputs
await page.waitForSelector('div[data-testid="variant-tile"] input');

// get all variant inputs
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

  // JS click bypass overlay
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      el.checked = true;
    }
  }, v.id);

  await page.waitForTimeout(1500);

  // get image
  const imageSrc = await page
    .locator('img[data-testid="hero-image"]')
    .getAttribute("src")
    .catch(() => "");

  // get price
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
