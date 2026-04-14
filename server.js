require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições em desenvolvimento
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/', routes);

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
  console.log(`📡 Webhook: POST http://localhost:${PORT}/webhook`);
  console.log(`💬 Conversas: GET http://localhost:${PORT}/conversations`);
});

module.exports = app;
