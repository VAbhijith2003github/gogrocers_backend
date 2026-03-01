const kafka = require("../config/kafka");

const producer = kafka.producer();

async function emitOrderPlaced(orderData) {
  try {
    await producer.connect();
    await producer.send({
      topic: "order.placed",
      messages: [
        {
          value: JSON.stringify(orderData),
        },
      ],
    });
    console.log(`[Kafka] order.placed event emitted for order ${orderData.orderId}`);
  } catch (err) {
    console.error("[Kafka] Failed to emit order.placed event:", err);
  } finally {
    // Usually we keep the producer connection alive in a real app, 
    // but for simplicity in a serverless-style node app we can connect/disconnect 
    // or just leave it connected. 
    // await producer.disconnect(); 
  }
}

module.exports = { emitOrderPlaced, producer };
