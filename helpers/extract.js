export async function extractBasicInfo(page) {
  // ===== TITLE =====
  const titleHandle = await page.waitForSelector('h1#main-title', { timeout: 15000 });
  const baseTitle = await titleHandle.textContent();
  const handle = baseTitle
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .toLowerCase();

  // ===== BODY HTML =====
  let bodyHtml = "";
  try {
    if ((await page.locator("#product-description-atf ul").count()) > 0) {
      bodyHtml = `<ul>${await page.locator("#product-description-atf ul").innerHTML()}</ul>`;
    } else if ((await page.locator('div[data-testid="ip-smart-summary-dom-purify"] ul').count()) > 0) {
      bodyHtml = `<ul>${await page.locator('div[data-testid="ip-smart-summary-dom-purify"] ul').innerHTML()}</ul>`;
    }
  } catch {}

  // ===== IMAGE =====
  let baseImage = "";
  try {
    baseImage = await page.locator('img[data-testid="hero-image"]').getAttribute("src");
  } catch {}

  // ===== PRICE =====
  let basePrice = "";
  try {
    basePrice = await page.locator('span[data-testid="price-display"] span').textContent();
    basePrice = basePrice.replace("$", "").trim();
  } catch {}

  return { baseTitle, handle, bodyHtml, baseImage, basePrice };
}
