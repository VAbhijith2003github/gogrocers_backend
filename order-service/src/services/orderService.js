const { db } = require("../config/firebase");
const axios = require("axios");

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || "http://localhost:3002";

// Appends order to onorder[], then calls cart-service to reset cart
async function addUserOrder(userid, order) {
  const ref = db.collection("orders").doc(userid);
  const snap = await ref.get();
  const existing = snap.exists ? snap.data() : {};
  const updatedOrders = [...(existing.onorder || []), order];

  await ref.set({
    ...existing,
    onorder: updatedOrders,
    completed: existing.completed || [],
  });

  // Call cart-service over HTTP to reset cart (true microservice communication)
  await axios.delete(`${CART_SERVICE_URL}/api/cart/${userid}`);
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
