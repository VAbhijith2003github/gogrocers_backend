const { db } = require("../config/firebase");
const { resetCart } = require("./cartService");

// Mirrors: adduserorder.js
// Appends the order to onorder[], then resets the cart
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

  await resetCart(userid);
}

// Mirrors: getorder.js
async function getOrder(userid) {
  const snap = await db.collection("orders").doc(userid).get();
  if (!snap.exists) return null;
  return snap.data();
}

// Mirrors: markorderascomplete.js
// Moves order from onorder[] → completed[], then removes from onorder[]
async function markOrderAsComplete(userid, order) {
  const ref = db.collection("orders").doc(userid);

  // Step 1: append to completed
  const snap1 = await ref.get();
  const data1 = snap1.exists ? snap1.data() : {};
  const updatedCompleted = [...(data1.completed || []), order];

  await ref.set({
    ...data1,
    onorder: data1.onorder || [],
    completed: updatedCompleted,
  });

  // Step 2: remove from onorder
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
