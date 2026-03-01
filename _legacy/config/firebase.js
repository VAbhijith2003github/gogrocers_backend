const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

if (!admin.apps.length) {
  let serviceAccount;
  try {
    serviceAccount = require(path.join(__dirname, "../../../serviceAccountKey.json"));
  } catch (e) {
    console.error(
      "\n❌ serviceAccountKey.json not found!\n" +
      "   Go to Firebase Console → Project Settings → Service Accounts\n" +
      "   → Generate new private key → save as serviceAccountKey.json\n"
    );
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || "gogrocers-2024",
  });
}

const db = admin.firestore();

module.exports = { db };
