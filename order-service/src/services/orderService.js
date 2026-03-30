const { db } = require("../config/firebase");
const axios = require("axios");
const { emitOrderPlaced } = require("../producers/orderProducer");

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || "http://localhost:3002";

// Mirrors: adduserorder.js
// Appends the order to onorder[] in the dedicated 'orders' collection, then resets the cart
async function addUserOrder(userid, order) {
  // Fetch user data (for email, name) from users collection
  const userRef = db.collection("users").doc(userid);
  const userSnap = await userRef.get();
  const userData = userSnap.exists ? userSnap.data() : {};

  // Read/write the order from the dedicated 'orders' collection
  const orderRef = db.collection("orders").doc(userid);
  const orderSnap = await orderRef.get();
  const existingData = orderSnap.exists ? orderSnap.data() : {};
  const updatedOrders = [...(existingData.onorder || []), order];

  await orderRef.set({
    ...existingData,
    onorder: updatedOrders,
    completed: existingData.completed || [],
  });

  console.log(`[order-service] Order added to 'orders' collection for user ${userid}`);

  // Reset the cart via HTTP call to cart-service
  try {
    await axios.delete(`${CART_SERVICE_URL}/api/cart/${userid}`);
    console.log(`[order-service] Cart reset successfully for user ${userid}`);
  } catch (err) {
    console.error(`[order-service] Failed to reset cart for user ${userid}:`, err.message);
  }

  // Emit Kafka event for email notification (Fire and forget)
  const orderEvent = {
    orderId: order.id,
    email: order.email || userData.email,
    customerName: order.customerName || userData.name || "Customer",
    items: order.items,
    total: order.total,
    address: order.address || userData.address || ""
  };

  emitOrderPlaced(orderEvent);

  return { success: true, orderId: order.id };
}

async function getOrder(userid) {
  const snap = await db.collection("orders").doc(userid).get();
  if (!snap.exists) return null;
  return snap.data();
}

// Moves order from onorder[] → completed[]
async function markOrderAsComplete(userid, order) {
  const ref = db.collection("orders").doc(userid);

  const snap1 = await ref.get();
  const data1 = snap1.exists ? snap1.data() : {};
  const updatedCompleted = [...(data1.completed || []), order];

  await ref.set({
    ...data1,
    onorder: data1.onorder || [],
    completed: updatedCompleted,
  });

  const snap2 = await ref.get();
  const data2 = snap2.data();
  const updatedOnOrder = (data2.onorder || []).filter(
    (item) => item.id !== order.id
  );

  await ref.set({
    ...data2,
    onorder: updatedOnOrder,
    completed: data2.completed || [],
  });
}

module.exports = { addUserOrder, getOrder, markOrderAsComplete };
