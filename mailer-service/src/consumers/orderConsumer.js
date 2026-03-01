const kafka = require("../config/kafka");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const consumer = kafka.consumer({ groupId: "mailer-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "order.placed", fromBeginning: false });

  console.log("[Kafka] Mailer consumer listening for order.placed events...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const orderData = JSON.parse(message.value.toString());
        console.log(`[Kafka] Received order.placed event for order: ${orderData.orderId}`);

        // Data expected from order-service: { orderId, email, customerName, items, total, address }
        await sendOrderConfirmationEmail(
          orderData.email,
          orderData.customerName,
          {
            id: orderData.orderId,
            items: orderData.items,
            total: orderData.total,
            address: orderData.address
          }
        );
      } catch (err) {
        console.error("[Kafka] Error processing message:", err);
      }
    },
  });
}

module.exports = { runConsumer };
