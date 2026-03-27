const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

if (!admin.apps.length) {
  let certConfig;
  if (process.env.FIREBASE_PRIVATE_KEY) {
    certConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
  } else {
    try {
      certConfig = require(path.join(__dirname, "../../serviceAccountKey.json"));
    } catch (e) {
      console.error(
        "\n❌ Firebase Credentials not found!\n" +
        "   Provide FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, and FIREBASE_CLIENT_EMAIL as Environment Variables,\n" +
        "   OR save serviceAccountKey.json in the service root.\n"
      );
      process.exit(1);
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(certConfig),
    projectId: process.env.FIREBASE_PROJECT_ID || certConfig.project_id || "gogrocers-2024",
  });
}

const db = admin.firestore();
module.exports = { db, admin };
