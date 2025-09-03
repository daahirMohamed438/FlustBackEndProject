const admin = require("firebase-admin");
require("dotenv").config(); // load .env variables
 
// Load the service account key JSON file
const serviceAccount = require("./flusteruserandowner-firebase-adminsdk-fbsvc-f98e6d20b9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flusteruserandowner.firebaseio.com", // optional for Realtime DB
});

module.exports = admin;

 

