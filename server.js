require('dotenv').config();
console.log('[System] Iniciando aplicação Agentia...');

const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições em desenvolvimento/produção
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path === '/webhook') {
    console.log('[Webhook] Body recebido:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Rotas
app.use('/', routes);

// Endpoint de Debug para Railway
app.get('/debug-vars', (req, res) => {
  res.json({
    status: 'online',
    evolution_url: process.env.EVOLUTION_API_URL || 'não configurada',
    instance: process.env.EVOLUTION_INSTANCE || 'não configurada',
    has_groq_key: !!process.env.GROQ_API_KEY,
    has_firebase_project: !!process.env.FIREBASE_PROJECT_ID,
    timestamp: new Date().toISOString()
  });
});

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
  console.log(`📡 Instância: ${process.env.EVOLUTION_INSTANCE || 'não definida'}`);
  console.log(`🔗 URL API: ${process.env.EVOLUTION_API_URL || 'não definida'}`);
});

module.exports = app;

