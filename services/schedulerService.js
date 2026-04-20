/**
 * schedulerService.js
 * Agenda envios diários de conteúdo de estudo
 * Segunda a Sábado: manhã (07:00) e noite (21:00) — horário de Brasília
 */

const { enviarMensagem } = require('./whatsappService');
const { montarMensagemManha, montarMensagemNoite } = require('./studyService');

const NUMERO_RICARDO = process.env.STUDY_NUMERO || '5521986925971';

// Horários em UTC (Brasília = UTC-3)
// 07:00 BRT = 10:00 UTC
// 21:00 BRT = 00:00 UTC (meia-noite)
const HORA_MANHA_UTC = 10;
const HORA_NOITE_UTC = 0;

let schedulerAtivo = false;

/**
 * Verifica se hoje é dia útil de estudo (seg-sáb)
 */
function isDiaEstudo() {
  const dia = new Date().getUTCDay(); // 0=dom, 1=seg, ..., 6=sáb
  return dia >= 1 && dia <= 6; // segunda a sábado
}

/**
 * Verifica se é hora de enviar (manhã ou noite)
 * Retorna 'manha', 'noite' ou null
 */
function getTipoEnvio() {
  const hora = new Date().getUTCHours();
  const minuto = new Date().getUTCMinutes();

  if (hora === HORA_MANHA_UTC && minuto === 0) return 'manha';
  if (hora === HORA_NOITE_UTC && minuto === 0) return 'noite';
  return null;
}

/**
 * Inicia o scheduler — verifica a cada minuto
 */
function iniciarScheduler() {
  if (schedulerAtivo) return;
  schedulerAtivo = true;

  console.log('[Scheduler] Iniciado — envios seg-sáb às 07:00 e 21:00 (Brasília)');

  setInterval(async () => {
    if (!isDiaEstudo()) return;

    const tipo = getTipoEnvio();
    if (!tipo) return;

    try {
      const mensagem = tipo === 'manha'
        ? montarMensagemManha()
        : montarMensagemNoite();

      await enviarMensagem(NUMERO_RICARDO, mensagem);
      console.log(`[Scheduler] Mensagem de ${tipo} enviada para ${NUMERO_RICARDO}`);
    } catch (error) {
      console.error(`[Scheduler] Erro ao enviar mensagem de ${tipo}:`, error.message);
    }
  }, 60 * 1000); // verifica a cada 1 minuto
}

module.exports = { iniciarScheduler };
