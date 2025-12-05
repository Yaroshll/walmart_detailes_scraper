export async function extractBasicInfo(page) {
  const baseTitle = await page.textContent("h1[data-automation-id='product-title']");
  const handle = baseTitle
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .toLowerCase();

  let bodyHtml = "";
  try {
    bodyHtml = await page.$eval("#item-description", el => el.innerHTML.trim());
  } catch {}

  let baseImage = "";
  try {
    baseImage = await page.$eval("img.prod-hero-image", el => el.src);
  } catch {}

  let basePrice = "";
  try {
    basePrice = await page.textContent("span[data-automation-id='product-price']");
  } catch {}

  return { baseTitle, handle, bodyHtml, baseImage, basePrice };
}
