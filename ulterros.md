# Registro de Alterações (ulterros.md)

## [2] Configuração de Credenciais Reais — Firebase e OpenAI

### Problema
O `backend/config/firebase.js` usava variáveis de ambiente para montar as credenciais do Firebase manualmente, o que causava erro de `MODULE_NOT_FOUND` ao tentar resolver o path do arquivo JSON de credenciais.

### Causa
O `path.resolve(__dirname, ...)` estava calculando o caminho errado porque `__dirname` aponta para `backend/config/`, e o JSON está na raiz do projeto (`agentia/`). A lógica de path relativo via `.env` também estava incorreta.

### Solução aplicada

**Arquivo:** `backend/config/firebase.js`

Substituído o uso de variáveis de ambiente individuais por carregamento direto do arquivo JSON de credenciais usando `path.join(__dirname, '..', '..', 'arquivo.json')` — dois níveis acima de `backend/config/` chegam à raiz do projeto.

**Arquivo:** `backend/.env`

Preenchido com:
- `OPENAI_API_KEY` — chave real da OpenAI
- `FIREBASE_CREDENTIAL_PATH` — path relativo ao JSON de credenciais
- `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE` — a preencher após subir a Evolution API

**Arquivo:** `.gitignore`

Adicionado na raiz do projeto para proteger arquivos sensíveis:
- `*.json` (exceto `package.json` e `package-lock.json`)
- `api.md`
- `backend/.env`

### Segurança
- Arquivos `api.md` e `agentai-5585e-firebase-adminsdk-fbsvc-9363b22edd.json` foram removidos do tracking do git (`git rm --cached`)
- Histórico limpo via `git reset --soft` para evitar que segredos fiquem em commits anteriores
- Push Protection do GitHub bloqueou corretamente o push com segredos — resolvido antes do push final

### Validação
```bash
# Testar conexão com Firebase (deve retornar "Firebase conectado com sucesso!")
cd backend
node -e "require('dotenv').config(); const { db } = require('./config/firebase'); db.collection('test').limit(1).get().then(() => console.log('Firebase conectado com sucesso!')).catch(e => console.error('Erro:', e.message))"
```

> Resultado esperado após ativar o Firestore: `Firebase conectado com sucesso!`
> Resultado atual: `PERMISSION_DENIED` — Firestore ainda não ativado no projeto Firebase

### Próximo passo obrigatório
Ativar o Firestore no projeto:
👉 https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=agentai-5585e
