/**
 * studyService.js
 * Gerencia o conteúdo de estudo e monta as mensagens diárias
 * Conteúdo: Técnico em TI (tecnico.md + tecnico1.md)
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

// Tópicos extraídos dos dois arquivos de estudo
const TOPICOS = [
  { titulo: 'Arquitetura de Computadores', resumo: 'CPU, RAM, HD/SSD e placa-mãe. Ciclo: busca → decodifica → executa. Cache L1/L2/L3 reduz o gargalo de Von Neumann.' },
  { titulo: 'Lógica Matemática', resumo: 'Operadores AND, OR, NOT. Tabelas-verdade. Notação Big O mede eficiência: O(1) ideal, O(2^n) proibitivo.' },
  { titulo: 'Redes de Computadores', resumo: 'Modelo TCP/IP: 4 camadas. LAN vs WAN. Roteador encaminha pacotes. DNS resolve nomes. HTTP trafega web.' },
  { titulo: 'Sistemas Operacionais I', resumo: 'SO gerencia hardware e software. Escalonamento: Round Robin, SJF. Memória virtual com tabelas de páginas.' },
  { titulo: 'Segurança e Cloud', resumo: 'Cloud: IaaS, PaaS, SaaS. Responsabilidade compartilhada. Segurança: dados são do cliente, infraestrutura é do provedor.' },
  { titulo: 'Engenharia de Software', resumo: 'Manifesto Ágil: entrega incremental. Scrum e Kanban. Princípios SOLID. Clean Architecture. CI/CD automatiza deploy.' },
  { titulo: 'Gerência de Projetos', resumo: 'Restrições: prazo, custo, escopo. Scrum: sprints curtos. Kanban: fluxo contínuo. Stakeholders precisam de feedback rápido.' },
  { titulo: 'Banco de Dados', resumo: 'ACID: Atomicidade, Consistência, Isolação, Durabilidade. Normalização 1NF→5NF elimina redundâncias. NoSQL escala horizontalmente.' },
  { titulo: 'Programação Web', resumo: 'HTML estrutura, CSS estiliza, JS dinamiza. APIs RESTful usam HTTP + JSON. Segurança: JWT e OAuth2.' },
  { titulo: 'PHP e Laravel', resumo: 'PHP 8.x com tipagem forte. Laravel: autenticação, roteamento, Eloquent ORM. Padrões PSR garantem interoperabilidade.' },
  { titulo: 'Design UX e Figma', resumo: '10 Heurísticas de Nielsen. Figma para protótipos de alta fidelidade. Teste de usabilidade antes de desenvolver.' },
  { titulo: 'Eletrônica e Hardware', resumo: 'Tensão, corrente, resistência. Transistores e diodos controlam fluxo elétrico. Portas lógicas digitais: estados 0 e 1.' },
  { titulo: 'Automação Industrial', resumo: 'Sensores captam variáveis. Atuadores executam ações. CLP processa lógica Ladder. SCADA supervisiona em tempo real.' },
  { titulo: 'Empreendedorismo', resumo: 'SWOT analisa forças e ameaças. Business Model Canvas estrutura o negócio. Lean Startup: MVP → validar → ajustar.' },
  { titulo: 'Sistemas Operacionais II', resumo: 'Linux: Shell Script automatiza tarefas. Windows: Active Directory gerencia usuários e GPOs. Servidores exigem administração profissional.' },
  { titulo: 'Projeto Integrador', resumo: 'Une tudo: planejamento → banco de dados → backend PHP → design Figma. Simula cenário real de mercado.' },
];

// Perguntas de fixação por tópico
const PERGUNTAS = [
  'Qual é a função da memória cache e por que ela existe?',
  'Qual a diferença entre AND, OR e NOT? Dê um exemplo prático.',
  'O que é TCP/IP e como ele difere do modelo OSI?',
  'Como o sistema operacional gerencia múltiplos processos ao mesmo tempo?',
  'Qual a diferença entre IaaS, PaaS e SaaS? Dê um exemplo de cada.',
  'O que significa SOLID e por que é importante no desenvolvimento?',
  'Qual a diferença entre Scrum e Kanban? Quando usar cada um?',
  'O que é normalização de banco de dados e para que serve?',
  'O que é uma API RESTful e como ela funciona?',
  'Para que serve o Eloquent ORM no Laravel?',
  'O que são as 10 Heurísticas de Nielsen?',
  'Qual a diferença entre um transistor e uma porta lógica?',
  'O que é um CLP e onde ele é usado?',
  'O que é MVP na metodologia Lean Startup?',
  'O que é Active Directory e para que serve?',
  'O que é o Projeto Integrador e o que ele avalia?',
];

/**
 * Retorna o tópico do dia baseado na data atual
 */
function getTopicoDoDia() {
  const hoje = new Date();
  const diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
  return TOPICOS[diaDoAno % TOPICOS.length];
}

/**
 * Monta mensagem de MANHÃ — resumo + dica
 */
function montarMensagemManha() {
  const topico = getTopicoDoDia();
  return `🌅 *Bom dia, Ricardo!* Hora de estudar!\n\n📚 *Tópico de hoje: ${topico.titulo}*\n\n${topico.resumo}\n\n💡 *Dica:* Leia com atenção e tente explicar com suas próprias palavras antes de continuar o dia.`;
}

/**
 * Monta mensagem de NOITE — pergunta de fixação
 */
function montarMensagemNoite() {
  const topico = getTopicoDoDia();
  const hoje = new Date();
  const diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
  const pergunta = PERGUNTAS[diaDoAno % PERGUNTAS.length];

  return `🌙 *Boa noite, Ricardo!* Hora de fixar o conteúdo!\n\n📖 *Revisão: ${topico.titulo}*\n\n❓ *Pergunta do dia:*\n${pergunta}\n\n_Tente responder antes de consultar o material!_ 💪`;
}

/**
 * Gera resposta da IA para quando Ricardo responder a pergunta
 */
async function avaliarResposta(historico) {
  const topico = getTopicoDoDia();
  const systemPrompt = `Você é um tutor de TI que está ajudando Ricardo a estudar para o curso técnico.
O tópico de hoje é: ${topico.titulo}
Resumo: ${topico.resumo}

Quando Ricardo responder uma pergunta:
- Avalie se a resposta está correta ou incompleta
- Complemente com informações importantes que faltaram
- Seja encorajador e didático
- Respostas curtas e diretas (máximo 4 linhas)
- Use emojis com moderação`;

  return _gerarResposta(systemPrompt, historico);
}

module.exports = { montarMensagemManha, montarMensagemNoite, avaliarResposta, getTopicoDoDia };
