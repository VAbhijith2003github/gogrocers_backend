const { db } = require("../config/firebase");
const admin = require("firebase-admin");

// Mirrors: createquery.js
// Groups queries under a document named by today's date (YYYY-MM-DD)
async function createQuery(userid, userEmail, query) {
  const today = new Date().toISOString().split("T")[0];
  const ref = db.collection("queries").doc(today);
  const snap = await ref.get();

  const queryEntry = {
    uid: userid,
    email: userEmail,
    query,
    timestamp: new Date(),
  };

  if (!snap.exists) {
    await ref.set({ queries: [queryEntry] });
  } else {
    await ref.update({
      queries: admin.firestore.FieldValue.arrayUnion(queryEntry),
    });
  }
}

module.exports = { createQuery };
