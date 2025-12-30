const { chromium } = require('playwright');
const { wishlist: urls } = require('./wishlist');
const { statusChanged } = require('./state');

const tracker = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const availableInStore = [];

  const SELECTORS = {
    outerDiv: '#checkothertores',
    regions: ['#collapseON'], // Tracks Ontario stores availability
    item: '.row',
  };

  try {
    for (const { targetURL, sku } of urls) {
      console.log(`Parsing: ${targetURL}`);
      await page.goto(targetURL, { waitUntil: 'domcontentloaded' });

      const outerDivExists = await page.$(SELECTORS.outerDiv) !== null;
      if (!outerDivExists) {
        console.log(`No matches found on ${targetURL}`);
        continue;
      }

      console.log(`Outer div found: ${targetURL}`);
      const outerDiv = page.locator(SELECTORS.outerDiv);

      for (const region of SELECTORS.regions) {
        if (await outerDiv.locator(region).count() === 0) {
          console.log(`${region} not found inside the outer div.`);
          continue;
        }

        const items = await outerDiv.locator(region).locator(SELECTORS.item);
        const results = await items.evaluateAll((elements) =>
          elements
            .map((item) => {
              const spans = item.querySelectorAll(':scope > span');
              if (spans.length >= 2) {
                const location = spans[0]?.innerText.trim();
                const quantity = parseInt(spans[1]?.innerText.trim(), 10);
                return quantity > 0 ? { location, quantity } : null;
              }
              return null;
            })
            .filter((item) => item !== null)
        );

        availableInStore.push({ sku, availability: results });
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }

  console.log('Matching results:', availableInStore);

  const newStockAvailable = [];

  availableInStore.forEach((item) => {
    const sku = item.sku;
    const currentAvailability = item.availability.length > 0;

    // Check if stock has changed from out of stock to in stock
    if (statusChanged(sku, currentAvailability)) {
      // Stock has changed to in stock, send notification
      newStockAvailable.push(item);
    }
  });

  return newStockAvailable;
};

module.exports = {
  tracker
};