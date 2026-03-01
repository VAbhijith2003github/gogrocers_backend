const { db } = require("../config/firebase");

// Mirrors: createuser.js
// Creates user doc in 'users' + empty cart doc in 'carts'
async function createUser(userid, userEmail, userName) {
  const userRef = db.collection("users").doc(userid);
  const cartRef = db.collection("carts").doc(userid);

  const [userSnap, cartSnap] = await Promise.all([userRef.get(), cartRef.get()]);

  if (!userSnap.exists) {
    await userRef.set({
      uid: userid,
      email: userEmail,
      name: userName,
      phonenumber: "NotSet",
      address: [],
    });
  }

  if (!cartSnap.exists) {
    await cartRef.set({ cart: [] });
  }
}

// Mirrors: getuser.js
async function getUser(userid) {
  const snap = await db.collection("users").doc(userid).get();
  if (!snap.exists) return null;
  return snap.data();
}

// Mirrors: updateuser.js
async function updateUser(userid, name, phonenumber) {
  const ref = db.collection("users").doc(userid);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("User not found");
  await ref.update({ ...snap.data(), name, phonenumber });
}

// Mirrors: setaddress.js — replace entire address array
async function setAddress(userid, addresses) {
  const ref = db.collection("users").doc(userid);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("User not found");
  await ref.update({ address: addresses });
}

// Mirrors: updateaddress.js — append one address
async function addAddress(userid, newAddress) {
  const ref = db.collection("users").doc(userid);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("User not found");
  const existing = snap.data().address || [];
  await ref.update({ address: [...existing, newAddress] });
}

module.exports = { createUser, getUser, updateUser, setAddress, addAddress };
