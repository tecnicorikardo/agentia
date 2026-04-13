Sempre salvar no github, https://github.com/tecnicorikardo/agentia



Você é um ENGENHEIRO DE SOFTWARE SÊNIOR especialista em sistemas de automação de vendas com IA.

Sua missão é CRIAR um sistema completo de "Agente de Vendas com IA" integrado ao WhatsApp, semelhante ao Dealism.

---

## 🎯 OBJETIVO DO PROJETO

Criar uma aplicação que:

* Recebe mensagens de clientes via WhatsApp
* Processa com IA (estilo vendedor)
* Responde automaticamente
* Conduz o cliente até o fechamento da venda

---

## 🏗️ STACK OBRIGATÓRIA

* Backend: Node.js (JavaScript puro ou com Express)
* Banco de dados: Firebase (Firestore)
* IA: API da OpenAI
* Integração WhatsApp: Evolution API (ou similar)

---

## 📦 FUNCIONALIDADES PRINCIPAIS

### 1. Integração com WhatsApp

* Criar endpoint webhook para receber mensagens
* Processar mensagens recebidas
* Enviar respostas automaticamente

---

### 2. Módulo de IA (cérebro)

* Criar função que envia mensagens para OpenAI
* Utilizar prompt de vendedor profissional
* Manter contexto da conversa (histórico no banco)

---

### 3. Gerenciamento de Conversas

* Salvar no Firebase:

  * ID do cliente
  * Histórico de mensagens
  * Status (interessado, negociando, fechado)
* Recuperar contexto antes de responder

---

### 4. Sistema de Vendas

* Detectar intenção do cliente:

  * Pergunta de preço
  * Interesse
  * Pedido
* Aplicar respostas estratégicas:

  * Upsell (sugerir combos)
  * Fechamento automático

---

### 5. Configuração de Produtos

Criar estrutura no Firebase:

* nome
* preço
* descrição
* categoria

---

### 6. Segurança e Controle

* Evitar spam de respostas
* Delay simulado (resposta mais humana)
* Tratamento de erros

---

## 🧠 LÓGICA DE FUNCIONAMENTO

1. Recebe mensagem do WhatsApp
2. Busca histórico do cliente no Firebase
3. Monta contexto + prompt de vendedor
4. Envia para OpenAI
5. Recebe resposta
6. Salva no banco
7. Envia resposta ao cliente

---

## 📁 ESTRUTURA DO PROJETO

/backend
/controllers
/services
/routes
/config
server.js

/services:

* openaiService.js
* whatsappService.js
* conversationService.js

---

## 🔌 ROTAS NECESSÁRIAS

* POST /webhook (receber mensagens)
* POST /send-message (envio manual)
* GET /conversations (listar conversas)

---

## 🧪 BOAS PRÁTICAS

* Código limpo e modular
* Separação de responsabilidades
* Uso de async/await
* Variáveis de ambiente (.env)

---

## 🚀 DIFERENCIAL (IMPORTANTE)

Implementar:

* Memória de conversa
* Respostas naturais (não robóticas)
* Estratégia de vendas automática

---

## 📌 ENTREGA ESPERADA

Gerar:

* Código completo do backend funcional
* Explicação de cada parte
* Instruções para rodar localmente

---

## ❗ IMPORTANTE

* Não simplifique demais
* Gere código real, funcional e organizado
* Pense como um sistema SaaS escalável

---

Sua resposta deve conter TODO o código necessário para rodar o sistema.

