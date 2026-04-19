const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length) {
  // Produção (Railway): usa variáveis de ambiente do bloquinhodigital
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Local: usa JSON do bloquinhodigital
    const credentialPath = path.join(
      __dirname, '..', 'bloquinhodigital-firebase-adminsdk-fbsvc-7b2bb8218f.json'
    );
    admin.initializeApp({
      credential: admin.credential.cert(require(credentialPath)),
    });
  }
}

const db = admin.firestore();

module.exports = { db };
