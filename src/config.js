const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const CHECK_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const FOCUS_STORE = "london masonville";

if (!DISCORD_WEBHOOK_URL) {
  throw new Error("DISCORD_WEBHOOK_URL is not defined in environment variables");
}

module.exports = {
  discordWebhookUrl: DISCORD_WEBHOOK_URL,
  checkIntervalMs: CHECK_INTERVAL_MS,
  focusStore: FOCUS_STORE,
};