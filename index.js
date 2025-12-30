require("dotenv").config();
const { tracker } = require("./src/tracker");
const { sendNotifications } = require("./src/notifier");
const { checkIntervalMs } = require("./src/config");

async function runTasks() {
  try {
    console.log("------------- Running tasks ----------------");
    const availabilityData = await tracker();
    await sendNotifications(availabilityData);
    console.log("------------- End of batch ----------------");
  } catch (err) {
    console.error("An error occurred while running the script:", err);
  }
}

// Run the script once and repeat at intervals
runTasks();
setInterval(runTasks, checkIntervalMs);