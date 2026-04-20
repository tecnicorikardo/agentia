const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

if (!admin.apps.length) {
  const jsonPath = path.join(__dirname, '..', 'bloquinhodigital-firebase-adminsdk-fbsvc-7b2bb8218f.json');
  const jsonExists = fs.existsSync(jsonPath);

  if (jsonExists) {
    // Local: usa o JSON diretamente
    admin.initializeApp({
      credential: admin.credential.cert(require(jsonPath)),
    });
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    // Produção (Railway): usa variáveis de ambiente
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    throw new Error('Firebase: nenhuma credencial encontrada. Configure o JSON local ou as variáveis FIREBASE_* no Railway.');
  }
}

const db = admin.firestore();

module.exports = { db };
