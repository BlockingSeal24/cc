const axios = require("axios");
const { discordWebhookUrl } = require("./config");
const { focusStore: specificStore } = require("./config");

// Discord notification function
const notifyViaDiscord = async (message) => {
  try {
    const payload = { content: message };
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
        //Sorting message by location name alphabetically instead of by IP Address distance
        //.sort((a, b) => a.location.localeCompare(b.location))
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

module.exports = {
    sendNotifications
};

