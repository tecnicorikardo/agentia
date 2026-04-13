const admin = require('firebase-admin');
const path = require('path');

// Caminho absoluto para o JSON de credenciais na raiz do projeto
// backend/config/firebase.js → ../../ = raiz do projeto (agentia/)
const credentialPath = path.join(__dirname, '..', '..', 'agentai-5585e-firebase-adminsdk-fbsvc-9363b22edd.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(credentialPath)),
  });
}

const db = admin.firestore();

module.exports = { db };
