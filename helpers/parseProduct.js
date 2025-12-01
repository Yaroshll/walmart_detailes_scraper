export async function parseProduct(page, url) {

  // ===== BRAND =====
  const brand = await page.locator('a[data-dca-name="ItemBrandLink"]').innerText().catch(() => "");

  // ===== TITLE =====
  const rawTitle = await page.locator('#main-title').innerText().catch(() => "");
  const formattedTitle = rawTitle.replace(brand, `${brand},`).trim();

  // ===== HANDLE =====
  const handle = rawTitle.replace(/\s+/g, "-").trim();

  // ===== DESCRIPTION BODY (HTML UL) =====
  let bodyHtml = "";
  if (await page.locator('#product-description-atf ul').count() > 0) {
    bodyHtml = `<ul>${await page.locator('#product-description-atf ul').innerHTML()}</ul>`;
  } else if (await page.locator('div[data-testid="ip-smart-summary-dom-purify"] ul').count() > 0) {
    bodyHtml = `<ul>${await page.locator('div[data-testid="ip-smart-summary-dom-purify"] ul').innerHTML()}</ul>`;
  }

  // ===== VARIANTS SECTION =====
  const variants = [];
  const optionName = await page.locator('.mid-gray.mb2 span.b').innerText()
    .then(t => t.replace(":", "").trim())
    .catch(() => "Option");

  const variantTiles = page.locator('div[data-testid="variant-tile"] label');
  const variantCount = await variantTiles.count();

  for (let i = 0; i < variantCount; i++) {
    const label = variantTiles.nth(i);

    // Read variant info: "selected, Pink, $11.49"
    const variantInfo = await label.locator('span').nth(1).innerText();
    const parts = variantInfo.split(",").map(s => s.trim());

    const isSelected = parts[0] === "selected";
    const optionValue = parts[1];
    const priceVal = parts[2].replace("$", "");

    if (!isSelected) {
      await label.click();
      await page.waitForTimeout(1200);
    }

    const imageSrc = await page.locator('img[data-testid="hero-image"]').getAttribute("src");

    variants.push({
      handle,
      brandName: brand,
      title: formattedTitle,
      bodyHtml,
      optionName,
      optionValue,
      priceInDollar: priceVal,
      imageSrc,
      url
    });
  }

  return variants;
}
