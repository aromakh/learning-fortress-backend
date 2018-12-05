const admin = require("firebase-admin");
const servicePath = require("../key/learning-fortress-keys");

admin.initializeApp({
    credential: admin.credential.cert(servicePath.keys),
    databaseURL: 'https://learning-fortress.firebaseio.com'
});

module.exports = admin.firestore();
