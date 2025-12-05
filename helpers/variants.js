export async function extractAllVariants(page, basic, url) {
  const variantGroups = await page.$$("[data-testid^='variant-group']");

  const results = [];

  for (let groupIndex = 0; groupIndex < variantGroups.length; groupIndex++) {
    const group = variantGroups[groupIndex];
    const optionName = await group.$eval("span.b", el => el.innerText.replace(":", "").trim()).catch(() => `Option${groupIndex + 1}`);

    const variantButtons = await group.$$("[data-testid='variant-tile-chip']");

    for (const btn of variantButtons) {
      try {
        await btn.click();           // click variant
        await page.waitForTimeout(1200);

        // Name / Value
        let optionValue = await btn.$eval("span.w_iUH7", el => el.innerText).catch(() => "N/A");

        // Out of stock check
        const outOfStock = optionValue.toLowerCase().includes("out of stock") ? "Out of Stock" : "In Stock";

        // Clean the optionValue from "selected," or extra text
        optionValue = optionValue.replace(/^selected,?\s*/i, "").split(",")[0].trim();

        // Price
        let price = await page.textContent("span[data-automation-id='product-price']").catch(() => "");
        price = price.replace("$", "").trim();

        // Image
        let imageSrc = await page.$eval("img.prod-hero-image", el => el.src).catch(() => basic.baseImage);

        results.push({
          handle: basic.handle,
          title: `${basic.baseTitle} - ${optionValue}`,
          bodyHtml: basic.bodyHtml,
          optionName,
          optionValue,
          priceInDollar: price,
          imageSrc,
          stockStatus: outOfStock,
          url
        });

      } catch (err) {
        console.log("Variant click failed:", err.message);
      }
    }
  }

  // If no variants found, return default
  if (results.length === 0) {
    results.push({
      handle: basic.handle,
      title: basic.baseTitle,
      bodyHtml: basic.bodyHtml,
      optionName: "",
      optionValue: "",
      priceInDollar: basic.basePrice,
      imageSrc: basic.baseImage,
      stockStatus: "In Stock",
      url
    });
  }

  return results;
}
