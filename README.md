# 🤖 Agentia — Agente de Vendas com IA no WhatsApp

Sistema de automação de vendas via WhatsApp com IA (Groq / Llama 3.3 70B) e Firebase.

---

## 🏗️ Stack

- **Backend:** Node.js + Express
- **Banco de dados:** Firebase Firestore
- **IA:** Groq (Llama 3.3 70B) — gratuito
- **WhatsApp:** Evolution API v2

---

## 📁 Estrutura

```
/
├── config/
│   └── firebase.js               # Inicialização do Firebase Admin
├── controllers/
│   ├── webhookController.js       # Processa mensagens recebidas
│   └── conversationController.js  # Listagem e envio manual
├── routes/
│   └── index.js                  # Definição das rotas
├── services/
│   ├── openaiService.js           # Integração com Groq (Llama 3.3)
│   ├── whatsappService.js         # Integração com Evolution API v2
│   ├── conversationService.js     # Gerenciamento de conversas no Firebase
│   └── produtoService.js          # Catálogo de produtos
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## 🚀 Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas chaves
```

### 3. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um projeto e ative o Firestore
3. Vá em **Configurações do Projeto → Contas de Serviço → Gerar nova chave privada**
4. Salve o JSON na raiz do projeto e atualize o path em `config/firebase.js`

### 4. Configurar Evolution API v2

1. Suba a Evolution API v2 (Docker ou Railway)
2. Crie uma instância e conecte ao WhatsApp via QR Code
3. Configure o webhook para apontar para `http://seu-servidor:3000/webhook` com evento `MESSAGES_UPSERT`

### 5. Seed de produtos (opcional)

```js
// Execute uma vez para popular o Firebase com produtos de exemplo
const { seedProdutos } = require('./services/produtoService');
seedProdutos();
```

### 6. Iniciar o servidor

```bash
npm run dev   # desenvolvimento com nodemon
npm start     # produção
```

---

## 🔌 Rotas

| Método | Rota             | Descrição                        |
|--------|------------------|----------------------------------|
| POST   | /webhook         | Recebe mensagens do WhatsApp     |
| POST   | /send-message    | Envio manual de mensagem         |
| GET    | /conversations   | Lista todas as conversas         |
| GET    | /health          | Health check do servidor         |
| GET    | /debug-vars      | Debug de variáveis (só em dev)   |

---

## 🧪 Testando

```bash
# Health check
curl http://localhost:3000/health

# Envio manual de mensagem
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" \
  -d '{"numero": "5511999999999", "mensagem": "Olá! Como posso ajudar?"}'

# Listar conversas
curl http://localhost:3000/conversations
```

---

## 🔒 Segurança

- Chaves de API via variáveis de ambiente (nunca no código)
- Arquivo de credenciais Firebase fora do controle de versão (`.gitignore`)
- Anti-spam com intervalo mínimo entre respostas
- Delay humanizado para evitar bloqueios do WhatsApp
- Histórico limitado a 20 mensagens (controle de custo de tokens)
- `/debug-vars` disponível apenas em `NODE_ENV !== production`

---

## 🚢 Deploy no Railway

1. Suba o projeto no Railway
2. Configure as variáveis de ambiente (sem o arquivo JSON — use as vars `FIREBASE_*`)
3. A variável `FIREBASE_PRIVATE_KEY` deve ser colada com `\n` literais no Raw Editor do Railway
4. Para comunicação interna entre serviços use a URL privada: `http://evolution-api.railway.internal:8080`
