const admin = require("firebase-admin");

// CHANGE: The path to your service account
const serviceAccount = require("./my-trello-faf5e-firebase-adminsdk-ddqoy-89837bd5a1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
