# Registro de Alterações (ulterros.md)

---

## [PROBLEMA ATUAL] Envio de mensagem do 5971 para 5341 não está funcionando

### Situação
O número `5521986925971` (cliente) manda mensagem para `5521994655341` (Helô/bot).
O webhook recebe corretamente, a IA processa, mas **falha ao enviar a resposta** de volta.

### Erro atual
```
[WhatsApp] Erro ao enviar mensagem: timeout of 10000ms exceeded
```

### Causa identificada
O serviço `agentia` no Railway não consegue alcançar a Evolution API pela URL pública.
Comunicação entre serviços no Railway deve usar URL interna privada.

### Correção aplicada (aguardando redeploy)
Variável `EVOLUTION_API_URL` atualizada para URL interna:
```
EVOLUTION_API_URL=http://evolution-api.railway.internal:8080
```

### Status
⏳ Aguardando redeploy no Railway para confirmar

---

## [1] Sistema base criado

Criação do sistema completo de Agente de Vendas com IA:
- Backend Node.js + Express
- Firebase Firestore para histórico de conversas
- Groq (Llama 3.3 70B) como IA — gratuito
- Evolution API para integração WhatsApp
- Deploy no Railway

---

## [2] Configuração de credenciais Firebase

**Problema:** `MODULE_NOT_FOUND` ao carregar o JSON de credenciais do Firebase.

**Causa:** Path relativo incorreto no `backend/config/firebase.js`.

**Correção:** Uso de `path.join(__dirname, '..', '..', 'arquivo.json')` para resolver o caminho absoluto correto.

**Arquivo:** `backend/config/firebase.js`

---

## [3] Fix: Erro "Falha ao buscar conversas" no GET /conversations

**Problema:** `GET /conversations` retornava erro.

**Causa:** `.orderBy('atualizadoEm')` no Firestore exige índice composto não criado.

**Correção:** Removido `.orderBy()` da query. Ordenação feita em memória com `.sort()`.

**Arquivo:** `backend/services/conversationService.js`

---

## [4] Fix: Firebase UNAUTHENTICATED em produção (Railway)

**Problema:** `16 UNAUTHENTICATED` ao conectar ao Firestore no Railway.

**Causa:** `FIREBASE_PRIVATE_KEY` com quebras de linha mal formatadas no Railway.

**Correção:** Uso do Raw Editor do Railway para colar a chave com `\n` literais entre aspas duplas.

**Variável:** `FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`

---

## [5] Migração OpenAI → Groq

**Problema:** Chave OpenAI com cota esgotada (erro 429).

**Correção:** Migração para Groq (Llama 3.3 70B) — gratuito e sem billing.

**Arquivo:** `backend/services/openaiService.js`

**Dependência adicionada:** `groq-sdk`

---

## [6] Fix: Evolution API v1 — formato de payload

**Problema:** `400 Bad Request` ao enviar mensagem.

**Causa:** Evolution API v1 usa `{ textMessage: { text: mensagem } }` em vez de `{ text: mensagem }`.

**Correção:** Atualizado o payload de envio.

**Arquivo:** `backend/services/whatsappService.js`

---

## [7] Fix: Números @lid não enviáveis (Evolution API v1)

**Problema:** Clientes com WhatsApp Business geravam `remoteJid` com `@lid` — não enviável na v1.

**Causa:** Evolution API v1 não suporta `@lid`.

**Solução:** Migração para Evolution API v2 (suporta `@lid` nativamente).

---

## [8] Migração Evolution API v1 → v2

**Problema:** v1 não suporta `@lid` (WhatsApp Business).

**Correção:**
- Imagem Docker trocada para `evoapicloud/evolution-api:latest`
- PostgreSQL adicionado no Railway
- Variáveis atualizadas com `DATABASE_PROVIDER=postgresql`

**Variáveis adicionadas:**
```
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://postgres:...@postgres.railway.internal:5432/railway
```

---

## [9] Fix: Evolution API v2 — formato de envio

**Problema:** `400 Bad Request` ao enviar mensagem na v2.

**Causa:** v2 usa `{ text: mensagem }` direto (não `{ textMessage: { text } }`).

**Correção:** Atualizado payload de envio.

**Arquivo:** `services/whatsappService.js`

---

## [10] Fix: Webhook não chegava ao backend (v2)

**Problema:** Após migração para v2, nenhuma mensagem chegava ao backend.

**Causa:** Webhook não estava configurado na nova instância v2.

**Correção:** Reconfigurado via API:
```json
{
  "webhook": {
    "url": "https://agentia-production-8056.up.railway.app/webhook",
    "enabled": true,
    "events": ["MESSAGES_UPSERT"]
  }
}
```

---

## [11] Fix: Timeout ao enviar resposta (PROBLEMA ATUAL)

**Problema:** `timeout of 10000ms exceeded` ao tentar enviar resposta via Evolution API.

**Causa:** Serviços no Railway não se comunicam pela URL pública — precisam usar URL interna privada.

**Correção aplicada:**
```
EVOLUTION_API_KEY=8A551F35-FCFF-464D-93AB-FF4F709D023A
EVOLUTION_API_URL=http://evolution-api.railway.internal:8080
```

**Status:** ⏳ Aguardando confirmação após redeploy

---

## [12] Configuração da Helô (atendente da marmitaria)

**Arquivo:** `services/openaiService.js`

**Cardápio configurado:**
- Parmegiana: R$ 24,90
- Filé de frango empanado: R$ 21,90
- Macarrão penne com cheddar: R$ 23,90
- Açaí 300ml: R$ 11,00
- Sacolé gourmet (Nutella ou Chocolate): R$ 8,00
- Taxa de entrega: R$ 2,00

---

## [13] Consolidação de Estrutura e Diagnóstico Detalhado

**Situação:**logs ausentes no Railway e agente sem responder.

**Causa Identificada:**
1. Projeto duplicado (raiz vs `backend/`), causando confusão sobre qual código estava rodando.
2. Falta de logs detalhados dificultava saber onde a mensagem "sumia" entre o webhook e o envio.

**Correções Aplicadas:**
1. **Limpeza:** Pasta `backend/` removida. Agora apenas a raiz é usada.
2. **Logs de Sucesso:** Adicionados logs explícitos em cada etapa (Recebimento, Extração, IA, Envio).
3. **Endpoint de Debug:** Criado `/debug-vars` para validar variáveis de ambiente em tempo real.
4. **Resiliência:** Timeout de envio aumentado para 15s.

**Status:** 🚀 Pronto para teste. Envie uma mensagem e acompanhe os logs prefixados com `[WhatsApp]` ou `[Webhook]`.
