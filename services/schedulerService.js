/**
 * schedulerService.js
 * Envia 1 tópico por hora em ordem crescente com revisão + resumo + pergunta.
 * Estado salvo no Firebase para sobreviver a restarts.
 */

const { enviarMensagem } = require('./whatsappService');
const { TOPICOS, montarMensagemCompleta } = require('./studyService');
const { db } = require('../config/firebase');

const NUMERO_RICARDO = process.env.STUDY_NUMERO || '5521986925971';
const OWNER_UID = process.env.BLOQUINHO_OWNER_UID || 'avQGpnMx29ZO7NtdRjvUHLEGhAL2';

const estadoRef = () => db.collection('users').doc(OWNER_UID)
  .collection('agent_context').doc('study_scheduler');

async function getIndiceAtual() {
  try {
    const doc = await estadoRef().get();
    if (!doc.exists) return 0;
    return doc.data().indiceAtual || 0;
  } catch {
    return 0;
  }
}

async function salvarEstado(indice) {
  await estadoRef().set({
    indiceAtual: indice,
    ultimoEnvio: new Date().toISOString(),
  }, { merge: true });
}

let schedulerAtivo = false;

function iniciarScheduler() {
  if (schedulerAtivo) return;
  schedulerAtivo = true;
  console.log('[Scheduler] Iniciado — 1 tópico por hora com revisão + resumo + pergunta');

  // Envia imediatamente ao iniciar
  enviarProximoTopico();

  // Depois a cada 1 hora
  setInterval(enviarProximoTopico, 60 * 60 * 1000);
}

async function enviarProximoTopico() {
  try {
    const indice = await getIndiceAtual();
    const mensagem = montarMensagemCompleta(indice);

    await enviarMensagem(NUMERO_RICARDO, mensagem);
    console.log(`[Scheduler] Tópico ${indice + 1}/${TOPICOS.length} enviado: ${TOPICOS[indice].titulo}`);

    const proximoIndice = (indice + 1) % TOPICOS.length;
    await salvarEstado(proximoIndice);

    if (proximoIndice === 0) {
      console.log('[Scheduler] Ciclo completo! Voltando ao tópico 1.');
    }
  } catch (error) {
    console.error('[Scheduler] Erro:', error.message);
  }
}

module.exports = { iniciarScheduler };
