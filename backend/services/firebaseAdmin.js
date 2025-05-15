// Service pour initialiser Firebase Admin SDK
const admin = require("firebase-admin");

// Assurez-vous d'avoir téléchargé votre fichier de clé de service et nommé 'serviceAccountKey.json' à la racine du dossier backend
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://todolist-3a489-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();
module.exports = db;
