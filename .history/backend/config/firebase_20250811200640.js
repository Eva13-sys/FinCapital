var admin = require("firebase-admin");

var serviceAccount = require("../fincapital-374df-firebase-adminsdk-fbsvc-a00408d0c1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
