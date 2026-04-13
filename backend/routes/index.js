const express = require('express');
const router = express.Router();

const { receberMensagem } = require('../controllers/webhookController');
const { listar, enviarManual } = require('../controllers/conversationController');

// Webhook do WhatsApp (Evolution API envia mensagens aqui)
router.post('/webhook', receberMensagem);

// Envio manual de mensagem (uso administrativo)
router.post('/send-message', enviarManual);

// Listagem de conversas
router.get('/conversations', listar);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
