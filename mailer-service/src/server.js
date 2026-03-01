require("dotenv").config();
const { runConsumer } = require("./consumers/orderConsumer");

// This service is a pure background consumer, no HTTP server needed.
// However, we can add a simple health check or just log its startup.

console.log("🚀 mailer-service starting...");

runConsumer().catch((err) => {
  console.error("Critical error in mailer-service:", err);
  process.exit(1);
});
