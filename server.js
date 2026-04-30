require('dotenv').config();
console.log('[System] Iniciando aplicação Agentia...');

const express = require('express');
const routes = require('./routes');
const { registrarWebhook } = require('./services/telegramService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path === '/webhook') {
    console.log('[Webhook] Body recebido:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Versão do deploy
app.get('/version', (req, res) => {
  res.json({
    version: '3.0.0',
    platform: 'telegram',
    deployedAt: new Date().toISOString(),
  });
});

// Endpoint de Debug — apenas fora de produção
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug-vars', (req, res) => {
    res.json({
      status: 'online',
      has_telegram_token: !!process.env.TELEGRAM_BOT_TOKEN,
      telegram_chat_id: process.env.TELEGRAM_CHAT_ID || 'não configurado',
      has_groq_key: !!process.env.GROQ_API_KEY,
      has_firebase_project: !!process.env.FIREBASE_PROJECT_ID,
      timestamp: new Date().toISOString(),
    });
  });
}

// Rotas
app.use('/', routes);

// Inicia scheduler de estudo
const { iniciarScheduler } = require('./services/schedulerService');
iniciarScheduler();

// Registra webhook do Telegram automaticamente se a URL pública estiver configurada
const WEBHOOK_URL = process.env.WEBHOOK_URL;
if (WEBHOOK_URL) {
  registrarWebhook(`${WEBHOOK_URL}/webhook`);
} else {
  console.warn('[Telegram] WEBHOOK_URL não configurada — registre o webhook manualmente.');
}

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('[Server] Erro não tratado:', err.message);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Agentia rodando na porta ${PORT}`);
  console.log(`🤖 Plataforma: Telegram`);
  console.log(`📬 Chat ID destino: ${process.env.TELEGRAM_CHAT_ID || 'não configurado'}`);
});

module.exports = app;
