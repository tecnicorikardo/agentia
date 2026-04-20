/**
 * schedulerService.js
 * Envia um resumo de tópico a cada 1 hora, em ordem crescente.
 * Quando termina o último tópico, volta para o primeiro.
 * O índice atual é salvo no Firebase para sobreviver a restarts.
 */

const { enviarMensagem } = require('./whatsappService');
const { TOPICOS } = require('./studyService');
const { db } = require('../config/firebase');

const NUMERO_RICARDO = process.env.STUDY_NUMERO || '5521986925971';
const OWNER_UID = process.env.BLOQUINHO_OWNER_UID || 'avQGpnMx29ZO7NtdRjvUHLEGhAL2';

// Referência do estado do scheduler no Firebase
const estadoRef = () => db.collection('users').doc(OWNER_UID)
  .collection('agent_context').doc('study_scheduler');

/**
 * Busca o índice atual do tópico no Firebase
 */
async function getIndiceAtual() {
  try {
    const doc = await estadoRef().get();
    if (!doc.exists) return 0;
    return doc.data().indiceAtual || 0;
  } catch {
    return 0;
  }
}

/**
 * Salva o próximo índice no Firebase
 */
async function salvarProximoIndice(indice) {
  await estadoRef().set({
    indiceAtual: indice,
    ultimoEnvio: new Date().toISOString(),
  }, { merge: true });
}

/**
 * Monta a mensagem de resumo do tópico
 */
function montarResumo(topico, indice) {
  return `📚 *Tópico ${indice + 1}/${TOPICOS.length}: ${topico.titulo}*\n\n${topico.resumo}\n\n_Próximo tópico em 1 hora_ ⏰`;
}

let schedulerAtivo = false;

/**
 * Inicia o scheduler — envia um tópico a cada 1 hora
 */
function iniciarScheduler() {
  if (schedulerAtivo) return;
  schedulerAtivo = true;

  console.log('[Scheduler] Iniciado — 1 tópico por hora, ordem crescente, reinicia no fim');

  // Envia imediatamente ao iniciar (para não esperar 1h no primeiro boot)
  enviarProximoTopico();

  // Depois envia a cada 1 hora
  setInterval(enviarProximoTopico, 60 * 60 * 1000);
}

async function enviarProximoTopico() {
  try {
    const indice = await getIndiceAtual();
    const topico = TOPICOS[indice];

    const mensagem = montarResumo(topico, indice);
    await enviarMensagem(NUMERO_RICARDO, mensagem);
    console.log(`[Scheduler] Tópico ${indice + 1}/${TOPICOS.length} enviado: ${topico.titulo}`);

    // Avança para o próximo (volta ao 0 quando chegar no fim)
    const proximoIndice = (indice + 1) % TOPICOS.length;
    await salvarProximoIndice(proximoIndice);

    if (proximoIndice === 0) {
      console.log('[Scheduler] Ciclo completo! Voltando ao primeiro tópico.');
    }
  } catch (error) {
    console.error('[Scheduler] Erro ao enviar tópico:', error.message);
  }
}

module.exports = { iniciarScheduler };
