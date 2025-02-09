const { chromium } = require('playwright');
const axios = require('axios'); // For sending Discord notifications

// Discord Webhook URL
const discordWebhookUrl = "https://discord.com/api/webhooks/1336550685612839026/dLq1Xos3UpfV6rXb61MtnoMnW14A4MbdsAlFmQTLL4QyA1LnQ2-39TgT223RZ1Gqz7dp"; // Replace with your Discord webhook URL

// To track the previous stock state
let previousStockState = {};

const specificStore = "london masonville"; // Replace with your desired store name

const ccAvailabilityStore = async () => {
  // List of items you want to check
  const urls = [
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268151/asus-prime-geforce-rtx-5080-16gb-gddr7-prime-rtx5080-16g.html",
      "sku": "MSRP ASUS Prime"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268141/gigabyte-geforce-rtx-5080-windforce-oc-sff-16g-graphics-card-geforce-rtx-5080-windforce-oc-sff-16g.html",
      "sku": "MSRP Gigabyte Windforce OC"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268152/zotac-gaming-geforce-rtx-5080-solid-16gb-gddr7-zt-b50800d-10p.html",
      "sku": "MSRP ZOTAC Solid"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268148/msi-geforce-rtx-5080-16g-ventus-3x-oc-plus-rtx-5080-16g-ventus-3x-oc-plus.html",
      "sku": "$1,700 MSI Ventus"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268153/zotac-gaming-geforce-rtx-5080-solid-oc-16gb-gddr7-zt-b50800j-10p.html",
      "sku": "$1,700 ZOTAC Solic OC"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/267147/asus-prime-geforce-rtx-5080-16gb-gddr7-oc-edition-sff-prime-rtx5080-o16g.html",
      "sku": "$1,739 ASUS Prime OC"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268138/gigabyte-geforce-rtx-5080-gaming-oc-ai-gaming-graphics-card-gv-n5080gaming-oc-16gd.html",
      "sku": "$1,759 Gigabyte Gaming OC"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268147/msi-geforce-rtx-5080-16g-gaming-trio-oc-rtx-5080-16g-gaming-trio-oc.html",
      "sku": "$1,799 MSI Gaming Trio OC"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/267621/msi-geforce-rtx-5080-16g-vanguard-soc-launch-edition-rtx-5080-16g-vanguard-soc-launch-editio.html",
      "sku": "$1,849 MSI Vanguard Launch"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/267620/msi-geforce-rtx-5080-16g-suprim-soc-gddr7-16gb-rtx-5080-16g-suprim-soc.html",
      "sku": "$1,879 MSI Suprim OC"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268144/gigabyte-aorus-geforce-rtx-5080-master-16g-gddr7-gv-n5080aorus-m-16gd.html",
      "sku": "$1,899 Gigabyte Aorus Master"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/267619/msi-geforce-rtx-5080-16g-suprim-liquid-soc-gddr7-16gb-rtx-5080-16g-suprim-liquid-soc.html",
      "sku": "$1,949 MSI Suprim Liquid"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/267146/asus-tuf-gaming-geforce-rtx-5080-16gb-gddr7-oc-edition-tuf-rtx5080-o16g-gaming.html",
      "sku": "$1,959 Asus TUF Gaming"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268136/gigabyte-aorus-geforce-rtx-5080-xtreme-waterforce-aio-cooling-gv-n5080aorusx-w-16gd.html",
      "sku": "$2,049 Gigabyte Aorus AIO"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/267145/asus-rog-astral-geforce-rtx-5080-16gb-gddr7-oc-edition-quad-fan-force-rog-astral-rtx5080-o16g-gaming.html",
      "sku": "$2,179 ASUS Astral 4-Fan"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268191/gigabyte-geforce-rtx-5090-windforce-oc-32g-gddr7-graphics-card-gv-n5090wf3oc-32gd.html",
      "sku": "5090 MSRP Gigabyte Windforce OC"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268262/asus-tuf-gaming-geforce-rtx-5090-32gb-gddr7-tuf-rtx5090-32g-gaming.html",
      "sku": "5090 MSRP ASUS TUF Gaming"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268283/zotac-gaming-geforce-rtx-5090-solid-32gb-gddr7-zt-b50900d-10p.html",
      "sku": "5090 $3,100 ZOTAC Solid"
    },
    {
      "targetURL": "https://www.canadacomputers.com/en/powered-by-nvidia/268284/zotac-gaming-geforce-rtx-5090-solid-32gb-gddr7-zt-b50900j-10p.html",
      "sku": "5090 $3,300 ZOTAC Solid OC"
    },
  ];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const availableInStore = [];

  const SELECTORS = {
    outerDiv: '#checkothertores',
    regions: ['#collapseON', '#collapseBC', '#collapseQC'], // Add regions as needed
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

  const convertToString = (arr) => {
    return arr
      .map(({ sku, availability }) => {
        const skuLine = `${sku} :`;
        const availabilityLines = availability
          .sort((a, b) => a.location.localeCompare(b.location))
          .map(({ location, quantity }) => `- ${location.toLowerCase()} : ${quantity}`)
          .join("\n");
        return `${skuLine}\n${availabilityLines}`;
      })
      .join("\n\n");
  };

  const filteredResults = availableInStore.filter(item => item.availability.length > 0);

  const newStockAvailable = [];

  // Compare current stock status with the previous one
  filteredResults.forEach((item) => {
    const sku = item.sku;
    const currentAvailability = item.availability.length > 0;

    // Check if stock has changed from out of stock to in stock
    if (!previousStockState[sku] && currentAvailability) {
      // Stock has changed to in stock, send notification
      newStockAvailable.push(item);
    }

    // Update previous stock state for next time
    previousStockState[sku] = currentAvailability;
  });

  if (newStockAvailable.length > 0) {
    await sendNotifications(newStockAvailable); // Send notifications
  }

  return newStockAvailable;
};

// Discord notification function
const notifyViaDiscord = async (message) => {
  try {
    const payload = { content: message }; // Message content for Discord
    await axios.post(discordWebhookUrl, payload);
    console.log("Notification sent to Discord.");
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
};

// Send notifications with special handling for a specific store
const sendNotifications = async (availabilityData) => {
  for (const { sku, availability } of availabilityData) {
    const isSpecificStoreStocked = availability.some(
      (item) => item.location.toLowerCase() === specificStore && item.quantity > 0
    );

    const generalMessage = `${sku} stock update:\n` +
      availability
        .map(({ location, quantity }) => `- ${location}: ${quantity}`)
        .join("\n");

    if (isSpecificStoreStocked) {
      // Special message for specific store
      const specificStoreMessage = `🔥 **@everyone ${sku} is now available at ${specificStore.toUpperCase()}!** 🔥\n\n${generalMessage}`;
      await notifyViaDiscord(specificStoreMessage);
    } else {
      // General message for other updates
      const otherStoreMessage = `🛒 ${generalMessage}`;
      await notifyViaDiscord(otherStoreMessage);
    }
  }
};

async function runTasks() {
  try {
    console.log("------------- Running tasks ----------------");
    await Promise.all([ccAvailabilityStore()]);
    console.log("------------- End of batch ----------------");
  } catch (err) {
    console.error("An error occurred while running the script:", err);
  }
}

// Run the script once and repeat at intervals
const minutes = 2; // Set the interval time in minutes
runTasks();
setInterval(runTasks, minutes * 60 * 1000);
