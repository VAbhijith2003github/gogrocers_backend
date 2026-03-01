const { db } = require("../config/firebase");

async function getCart(userid) {
  const snap = await db.collection("carts").doc(userid).get();
  if (!snap.exists) return null;
  return snap.data();
}

async function updateCart(userid, cart) {
  const ref = db.collection("carts").doc(userid);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Cart not found");
  await ref.update({ ...snap.data(), cart });
}

async function resetCart(userid) {
  const ref = db.collection("carts").doc(userid);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Cart not found");
  await ref.update({ ...snap.data(), cart: [] });
}

module.exports = { getCart, updateCart, resetCart };
