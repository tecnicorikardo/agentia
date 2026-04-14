const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length) {
  // Produção (Railway): usa variáveis de ambiente
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Railway escapa \n como \\n — precisa restaurar
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Local: usa arquivo JSON de credenciais
    const credentialPath = path.join(
      __dirname, '..', 'agentai-5585e-firebase-adminsdk-fbsvc-9363b22edd.json'
    );
    admin.initializeApp({
      credential: admin.credential.cert(require(credentialPath)),
    });
  }
}

const db = admin.firestore();

module.exports = { db };
