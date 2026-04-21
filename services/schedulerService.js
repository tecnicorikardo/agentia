/**
 * schedulerService.js
 * Agente de Estudo Inteligente — Suporte TI
 *
 * Cronograma diário (seg-sáb):
 *   08:00 BRT → Conteúdo Novo
 *   10:00 BRT → Revisão Ativa
 *   14:00 BRT → Mini Teste
 *   20:00 BRT → Revisão Geral
 *
 * Estratégia semanal:
 *   Dia 1 → Tópicos 01-05
 *   Dia 2 → Tópicos 06-09
 *   Dia 3 → Tópicos 10-12
 *   Dia 4 → Tópicos 13-15
 *   Dia 5 → Tópicos 16-18
 *   Dia 6 → Tópico 19
 *   Dia 7 → Revisão geral completa
 *
 * Ao terminar tópico 19, volta para tópico 01.
 */

const { enviarMensagem } = require('./whatsappService');
const { db } = require('../config/firebase');
const { gerarMensagemEstudo } = require('./studyService');

const NUMERO = process.env.STUDY_NUMERO || '5521986925971';
const OWNER_UID = process.env.BLOQUINHO_OWNER_UID || 'avQGpnMx29ZO7NtdRjvUHLEGhAL2';

// Horários de envio em UTC (BRT = UTC-3)
// 08:00 BRT = 11:00 UTC
// 10:00 BRT = 13:00 UTC
// 14:00 BRT = 17:00 UTC
// 20:00 BRT = 23:00 UTC
const HORARIOS = [
  { hora: 11, tipo: 'conteudo' },
  { hora: 13, tipo: 'revisao' },
  { hora: 17, tipo: 'teste' },
  { hora: 23, tipo: 'geral' },
];

// Tópicos por dia da semana (0=dom ignorado, 1=seg...6=sáb)
const TOPICOS_POR_DIA = {
  1: [0, 1, 2, 3, 4],       // seg: tópicos 01-05
  2: [5, 6, 7, 8],           // ter: tópicos 06-09
  3: [9, 10, 11],            // qua: tópicos 10-12
  4: [12, 13, 14],           // qui: tópicos 13-15
  5: [15, 16, 17],           // sex: tópicos 16-18
  6: [18],                   // sáb: tópico 19
};

const estadoRef = () => db.collection('users').doc(OWNER_UID)
  .collection('agent_context').doc('study_scheduler');

async function getEstado() {
  try {
    const doc = await estadoRef().get();
    if (!doc.exists) return { diaAtual: 1, ciclo: 1 };
    return doc.data();
  } catch {
    return { diaAtual: 1, ciclo: 1 };
  }
}

async function salvarEstado(estado) {
  await estadoRef().set({ ...estado, ultimoEnvio: new Date().toISOString() }, { merge: true });
}

function isDiaEstudo() {
  const dia = new Date().getUTCDay();
  return dia >= 1 && dia <= 6;
}

function getHorarioAtual() {
  const hora = new Date().getUTCHours();
  const minuto = new Date().getUTCMinutes();
  if (minuto !== 0) return null;
  return HORARIOS.find(h => h.hora === hora) || null;
}

let schedulerAtivo = false;

function iniciarScheduler() {
  if (schedulerAtivo) return;
  schedulerAtivo = true;
  console.log('[Scheduler] Agente de Estudo iniciado — seg-sáb 08h/10h/14h/20h BRT');

  setInterval(async () => {
    if (!isDiaEstudo()) return;
    const horario = getHorarioAtual();
    if (!horario) return;

    try {
      const estado = await getEstado();
      const diaSemana = new Date().getUTCDay();
      const topicosHoje = TOPICOS_POR_DIA[diaSemana] || [0];
      const diaNumero = Object.keys(TOPICOS_POR_DIA).indexOf(String(diaSemana)) + 1;

      const mensagem = await gerarMensagemEstudo(horario.tipo, topicosHoje, diaNumero, estado.ciclo || 1);
      await enviarMensagem(NUMERO, mensagem);
      console.log(`[Scheduler] Enviado: ${horario.tipo} | Dia ${diaNumero} | Tópicos: ${topicosHoje.map(i => i + 1).join(',')}`);

      // No último horário do sábado (tópico 19), reinicia o ciclo
      if (diaSemana === 6 && horario.tipo === 'geral') {
        await salvarEstado({ diaAtual: 1, ciclo: (estado.ciclo || 1) + 1 });
        console.log('[Scheduler] Ciclo semanal completo! Reiniciando na próxima segunda.');
      }
    } catch (error) {
      console.error('[Scheduler] Erro:', error.message);
    }
  }, 60 * 1000);
}

module.exports = { iniciarScheduler };
