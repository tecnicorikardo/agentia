/**
 * studyService.js
 * Agente de Estudo Inteligente — Suporte TI
 * 19 tópicos com 4 tipos de mensagem por dia
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

const TOPICOS = [
  {
    num: '01', titulo: 'Fundamentos e Manutenção de Hardware',
    conceitos: ['Arquitetura Von Neumann: programa armazenado, ciclo Busca→Decodifica→Executa', 'Hierarquia de memória: Cache L1/L2/L3 → RAM → SSD/HD', 'Manutenção preventiva (limpeza/térmica) vs corretiva (diagnóstico/troca)'],
    revisao: ['O que é o ciclo de instrução da CPU?', 'Por que a memória cache existe?', 'Qual a diferença entre manutenção preventiva e corretiva?'],
    teste: [
      { p: 'O que é a arquitetura de Von Neumann?', a: ['A) Modelo onde CPU e memória são separados fisicamente', 'B) Modelo onde instruções e dados coexistem na mesma memória ✅', 'C) Tipo de processador de alta performance'] },
      { p: 'Qual memória é mais rápida?', a: ['A) HD', 'B) RAM', 'C) Cache L1 ✅'] },
    ],
  },
  {
    num: '02', titulo: 'Introdução à Informática',
    conceitos: ['Ciclo de processamento: Entrada → Processamento → Saída', 'Hardware (físico) vs Software (lógico)', 'Tipos de computadores: desktop, notebook, servidor, embarcado'],
    revisao: ['Quais são as 3 etapas do ciclo de processamento?', 'Dê 2 exemplos de hardware e 2 de software.', 'Qual tipo de computador é usado em servidores web?'],
    teste: [
      { p: 'O ciclo de processamento é:', a: ['A) Ligar → Usar → Desligar', 'B) Entrada → Processamento → Saída ✅', 'C) Hardware → Software → Dados'] },
      { p: 'Um teclado é exemplo de:', a: ['A) Software', 'B) Hardware de entrada ✅', 'C) Sistema operacional'] },
    ],
  },
  {
    num: '03', titulo: 'Lógica Matemática',
    conceitos: ['Operadores: AND (ambos verdadeiros), OR (um verdadeiro), NOT (inverte)', 'Tabelas-verdade validam expressões booleanas', 'Big O: O(1) ideal, O(n) linear, O(n²) lento, O(2ⁿ) proibitivo'],
    revisao: ['Se A=V e B=F, qual o resultado de A AND B?', 'O que mede a notação Big O?', 'Quando um algoritmo O(2ⁿ) se torna problemático?'],
    teste: [
      { p: 'AND retorna verdadeiro quando:', a: ['A) Pelo menos um operando é verdadeiro', 'B) Ambos os operandos são verdadeiros ✅', 'C) Nenhum operando é verdadeiro'] },
      { p: 'Qual complexidade é a mais eficiente?', a: ['A) O(n²)', 'B) O(n)', 'C) O(1) ✅'] },
    ],
  },
  {
    num: '04', titulo: 'Redes de Computadores',
    conceitos: ['TCP/IP: 4 camadas (Interface, Internet, Transporte, Aplicação)', 'LAN (local) vs WAN (longa distância)', 'Roteador encaminha entre redes; Switch conecta na mesma rede; DNS resolve nomes'],
    revisao: ['Quais são as 4 camadas do modelo TCP/IP?', 'Qual a diferença entre roteador e switch?', 'O que faz o protocolo DNS?'],
    teste: [
      { p: 'O protocolo TCP garante:', a: ['A) Velocidade máxima de transmissão', 'B) Entrega confiável e ordenada dos dados ✅', 'C) Conexão sem fio'] },
      { p: 'LAN significa:', a: ['A) Long Area Network', 'B) Local Area Network ✅', 'C) Linked Access Node'] },
    ],
  },
  {
    num: '05', titulo: 'Sistemas Operacionais I',
    conceitos: ['SO gerencia hardware e software', 'Escalonamento: Round Robin (fatias iguais), SJF (mais curto primeiro)', 'Memória virtual + tabelas de páginas isolam processos'],
    revisao: ['Qual a função principal do sistema operacional?', 'Como funciona o algoritmo Round Robin?', 'O que é memória virtual?'],
    teste: [
      { p: 'O escalonamento Round Robin:', a: ['A) Prioriza processos mais longos', 'B) Dá fatias iguais de CPU para cada processo ✅', 'C) Executa apenas um processo por vez'] },
      { p: 'Memória virtual serve para:', a: ['A) Aumentar a velocidade do HD', 'B) Isolar processos e ampliar o espaço de endereçamento ✅', 'C) Substituir a memória cache'] },
    ],
  },
  {
    num: '06', titulo: 'Softwares Aplicativos',
    conceitos: ['Produtividade: Word, Excel, navegadores', 'ERP integra todos os departamentos da empresa', 'Software de prateleira (pronto) vs sob medida (personalizado)'],
    revisao: ['O que é um ERP e qual problema ele resolve?', 'Qual a vantagem do software sob medida?', 'Cite 3 exemplos de software de produtividade.'],
    teste: [
      { p: 'ERP significa:', a: ['A) Electronic Resource Program', 'B) Enterprise Resource Planning ✅', 'C) Extended Runtime Platform'] },
      { p: 'Software de prateleira é:', a: ['A) Desenvolvido sob medida para a empresa', 'B) Produto pronto para uso geral ✅', 'C) Software de código aberto'] },
    ],
  },
  {
    num: '07', titulo: 'Tópicos Especiais — IA e Cloud',
    conceitos: ['IaaS (servidores), PaaS (plataforma), SaaS (software) na nuvem', 'Responsabilidade compartilhada: provedor protege infraestrutura, cliente protege dados', 'IA: Machine Learning aprende com dados'],
    revisao: ['Qual a diferença entre IaaS, PaaS e SaaS?', 'O que é responsabilidade compartilhada na nuvem?', 'Dê um exemplo real de SaaS.'],
    teste: [
      { p: 'Gmail é um exemplo de:', a: ['A) IaaS', 'B) PaaS', 'C) SaaS ✅'] },
      { p: 'Na nuvem, quem protege os dados do cliente?', a: ['A) O provedor de nuvem', 'B) O próprio cliente ✅', 'C) O governo'] },
    ],
  },
  {
    num: '08', titulo: 'Elementos de Automação',
    conceitos: ['Sensores captam variáveis (temperatura, pressão, presença)', 'Atuadores executam ações físicas (motores, válvulas)', 'CLP processa lógica Ladder; SCADA supervisiona em tempo real'],
    revisao: ['Qual a função de um sensor em automação?', 'O que é um CLP?', 'Para que serve o sistema SCADA?'],
    teste: [
      { p: 'O CLP em automação industrial é:', a: ['A) Um tipo de sensor de temperatura', 'B) O controlador que processa a lógica do sistema ✅', 'C) Um atuador hidráulico'] },
      { p: 'SCADA serve para:', a: ['A) Programar CLPs', 'B) Supervisionar processos em tempo real ✅', 'C) Instalar sensores'] },
    ],
  },
  {
    num: '09', titulo: 'Engenharia de Software',
    conceitos: ['Manifesto Ágil: pessoas, software funcionando, colaboração, adaptação', 'Scrum: sprints + backlog; Kanban: fluxo contínuo', 'SOLID: S(responsabilidade única) O(aberto/fechado) L(Liskov) I(interfaces) D(inversão)'],
    revisao: ['O que prioriza o Manifesto Ágil?', 'Qual a diferença entre Scrum e Kanban?', 'O que significa o S do SOLID?'],
    teste: [
      { p: 'Scrum usa:', a: ['A) Fluxo contínuo sem iterações', 'B) Sprints com prazo fixo ✅', 'C) Apenas documentação'] },
      { p: 'O princípio S do SOLID significa:', a: ['A) Segurança do código', 'B) Single Responsibility — uma responsabilidade por classe ✅', 'C) Sincronização de dados'] },
    ],
  },
  {
    num: '10', titulo: 'Gerência de Projetos em TI',
    conceitos: ['Triângulo: Prazo ↔ Custo ↔ Escopo (mudar um afeta os outros)', 'Scrum: Planning → Daily → Review → Retrospectiva', 'CI/CD automatiza testes e deploy'],
    revisao: ['O que é o triângulo de restrições?', 'Quais são as 4 cerimônias do Scrum?', 'O que significa CI/CD?'],
    teste: [
      { p: 'Se aumentar o escopo sem mudar prazo/custo:', a: ['A) A qualidade melhora automaticamente', 'B) A qualidade tende a cair ✅', 'C) O projeto fica mais barato'] },
      { p: 'CI/CD significa:', a: ['A) Controle Interno e Controle de Dados', 'B) Integração Contínua e Entrega Contínua ✅', 'C) Código Integrado e Deploy'] },
    ],
  },
  {
    num: '11', titulo: 'Introdução à Eletrônica',
    conceitos: ['Lei de Ohm: V = R × I (Tensão = Resistência × Corrente)', 'Transistor: interruptor eletrônico, base dos processadores', 'Digital: opera com 0 e 1; portas lógicas feitas com transistores'],
    revisao: ['Qual a fórmula da Lei de Ohm?', 'O que faz um transistor em um circuito?', 'O que é eletrônica digital?'],
    teste: [
      { p: 'A Lei de Ohm é:', a: ['A) V = R + I', 'B) V = R × I ✅', 'C) V = R / I'] },
      { p: 'Transistores são usados para:', a: ['A) Armazenar dados permanentemente', 'B) Funcionar como interruptores eletrônicos ✅', 'C) Transmitir sinais de rádio'] },
    ],
  },
  {
    num: '12', titulo: 'Planejamento Estratégico e Empreendedorismo',
    conceitos: ['SWOT: Forças, Fraquezas (internas) + Oportunidades, Ameaças (externas)', 'Business Model Canvas: 9 blocos de como o negócio cria valor', 'Lean Startup: MVP → Construir → Medir → Aprender → Ajustar'],
    revisao: ['O que analisa a matriz SWOT?', 'O que é MVP na metodologia Lean Startup?', 'Para que serve o Business Model Canvas?'],
    teste: [
      { p: 'SWOT analisa:', a: ['A) Apenas fatores externos do mercado', 'B) Fatores internos e externos do negócio ✅', 'C) Apenas a concorrência'] },
      { p: 'MVP significa:', a: ['A) Modelo de Valor Permanente', 'B) Produto Mínimo Viável ✅', 'C) Máximo Valor Possível'] },
    ],
  },
  {
    num: '13', titulo: 'Segurança do Trabalho',
    conceitos: ['NR-17: adapta o trabalho às características do trabalhador', 'LER/DORT: lesões por esforço repetitivo — digitação excessiva, má postura', 'Pausas a cada 50 minutos; monitor na altura dos olhos a 50-70cm'],
    revisao: ['O que estabelece a NR-17?', 'O que é LER e quais suas causas?', 'Quais as recomendações ergonômicas para trabalho no computador?'],
    teste: [
      { p: 'A NR-17 trata de:', a: ['A) Segurança elétrica em data centers', 'B) Ergonomia e adaptação do trabalho ao trabalhador ✅', 'C) Normas de programação segura'] },
      { p: 'LER é causada principalmente por:', a: ['A) Exposição a radiação de monitores', 'B) Movimentos repetitivos e má postura ✅', 'C) Uso de equipamentos sem aterramento'] },
    ],
  },
  {
    num: '14', titulo: 'Sistemas Operacionais II',
    conceitos: ['Linux: Shell Script automatiza tarefas; chmod/chown controla permissões', 'Windows Server: Active Directory gerencia usuários; GPO aplica políticas em massa', 'Princípio do menor privilégio: cada usuário tem só o acesso necessário'],
    revisao: ['O que é o Active Directory?', 'Para que serve o Shell Script no Linux?', 'O que é o princípio do menor privilégio?'],
    teste: [
      { p: 'Active Directory serve para:', a: ['A) Gerenciar arquivos no Linux', 'B) Centralizar usuários, grupos e políticas no Windows Server ✅', 'C) Configurar redes Wi-Fi'] },
      { p: 'GPO significa:', a: ['A) General Protocol Object', 'B) Group Policy Object ✅', 'C) Global Permission Override'] },
    ],
  },
  {
    num: '15', titulo: 'PHP e Laravel',
    conceitos: ['PHP 8.x: tipagem forte, JIT Compiler para melhor performance', 'Laravel MVC: Rotas, Eloquent ORM, Artisan CLI, Middleware, Blade', 'Padrões PSR garantem compatibilidade entre projetos PHP'],
    revisao: ['O que é um ORM e como o Eloquent funciona?', 'Quais são os componentes principais do Laravel?', 'O que faz o Artisan no Laravel?'],
    teste: [
      { p: 'Eloquent ORM permite:', a: ['A) Criar interfaces gráficas', 'B) Manipular banco de dados usando objetos PHP ✅', 'C) Gerenciar servidores Linux'] },
      { p: 'MVC significa:', a: ['A) Model-View-Controller ✅', 'B) Module-Version-Code', 'C) Main-Variable-Class'] },
    ],
  },
  {
    num: '16', titulo: 'Design UX e Figma',
    conceitos: ['10 Heurísticas de Nielsen: visibilidade, controle, prevenção de erros, minimalismo...', 'Figma: prototipagem de alta fidelidade, Design System, colaboração em tempo real', 'Processo UX: Pesquisa → Wireframe → Protótipo → Teste → Implementação'],
    revisao: ['O que são as Heurísticas de Nielsen?', 'Para que serve a prototipagem antes do desenvolvimento?', 'O que é um Design System?'],
    teste: [
      { p: 'As Heurísticas de Nielsen são:', a: ['A) Regras de programação segura', 'B) Princípios para avaliar usabilidade de interfaces ✅', 'C) Métricas de performance de banco de dados'] },
      { p: 'Protótipo de alta fidelidade serve para:', a: ['A) Substituir o desenvolvimento', 'B) Testar a usabilidade antes de desenvolver ✅', 'C) Documentar o código'] },
    ],
  },
  {
    num: '17', titulo: 'Programação Web',
    conceitos: ['Frontend: HTML (estrutura), CSS (estilo), JavaScript (interatividade)', 'APIs RESTful: GET/POST/PUT/DELETE com JSON', 'Segurança: JWT (autenticação), OAuth2 (autorização), HTTPS (criptografia)'],
    revisao: ['Qual a função do HTML, CSS e JavaScript?', 'Quais os 4 métodos HTTP de uma API REST?', 'O que é JWT?'],
    teste: [
      { p: 'Para criar dados em uma API REST usa-se:', a: ['A) GET', 'B) POST ✅', 'C) DELETE'] },
      { p: 'JWT é usado para:', a: ['A) Estilizar páginas web', 'B) Autenticação stateless em APIs ✅', 'C) Criar banco de dados'] },
    ],
  },
  {
    num: '18', titulo: 'Banco de Dados',
    conceitos: ['ACID: Atomicidade, Consistência, Isolação, Durabilidade', 'Normalização: 1NF (grupos repetitivos), 2NF (dependências parciais), 3NF (transitivas)', 'NoSQL: escalabilidade horizontal, flexível (MongoDB, Firebase, Redis)'],
    revisao: ['O que significa cada letra do ACID?', 'O que a 1NF exige de uma tabela?', 'Quando usar NoSQL em vez de SQL?'],
    teste: [
      { p: 'Atomicidade no ACID significa:', a: ['A) Dados sempre válidos', 'B) A transação é tudo ou nada ✅', 'C) Transações isoladas entre si'] },
      { p: 'NoSQL é ideal para:', a: ['A) Dados altamente estruturados com muitas relações', 'B) Dados semiestruturados com alta escalabilidade ✅', 'C) Relatórios financeiros complexos'] },
    ],
  },
  {
    num: '19', titulo: 'Projeto Integrador',
    conceitos: ['Une todas as disciplinas: planejamento, banco, backend PHP, design Figma', 'Avalia: integração, qualidade do código (SOLID), usabilidade (Nielsen), documentação', 'Simula cenário real de mercado — escolha um problema real!'],
    revisao: ['Quais disciplinas são integradas no projeto?', 'O que é avaliado na apresentação?', 'Por que escolher um problema real para o projeto?'],
    teste: [
      { p: 'O Projeto Integrador avalia principalmente:', a: ['A) Velocidade de digitação', 'B) Integração prática de todas as disciplinas do curso ✅', 'C) Conhecimento de hardware apenas'] },
      { p: 'DER significa:', a: ['A) Diagrama de Estrutura de Rede', 'B) Diagrama Entidade-Relacionamento ✅', 'C) Documento de Especificação de Requisitos'] },
    ],
  },
];

/**
 * Gera mensagem de Conteúdo Novo (08:00)
 */
function gerarConteudoNovo(topico, diaNum) {
  const conceitos = topico.conceitos.map(c => `• ${c}`).join('\n');
  return `📚 *Estudo Suporte TI — Dia ${diaNum}*\n\n📘 *Tópico ${topico.num}/19 — ${topico.titulo}*\n\n${conceitos}\n\n💡 _Leia com atenção e tente explicar com suas palavras!_`;
}

/**
 * Gera mensagem de Revisão Ativa (10:00)
 */
function gerarRevisaoAtiva(topico, diaNum) {
  const perguntas = topico.revisao.map((p, i) => `${i + 1}. ${p}`).join('\n');
  return `📚 *Estudo Suporte TI — Dia ${diaNum}*\n\n🧠 *Revisão — Tópico ${topico.num}/19 — ${topico.titulo}*\n\n${perguntas}\n\n_Responda aqui para eu avaliar!_ 💪`;
}

/**
 * Gera mensagem de Mini Teste (14:00)
 */
function gerarMiniTeste(topico, diaNum) {
  const questoes = topico.teste.map((q, i) => {
    const alternativas = q.a.join('\n');
    return `*${i + 1}.* ${q.p}\n${alternativas}`;
  }).join('\n\n');
  return `📚 *Estudo Suporte TI — Dia ${diaNum}*\n\n⚡ *Mini Teste — Tópico ${topico.num}/19 — ${topico.titulo}*\n\n${questoes}\n\n_Responda com o número e a letra! Ex: 1-B, 2-A_`;
}

/**
 * Gera mensagem de Revisão Geral (20:00)
 */
function gerarRevisaoGeral(topicosHoje, diaNum) {
  const resumos = topicosHoje.map(t =>
    `📌 *Tópico ${t.num}* — ${t.titulo}\n${t.conceitos[0]}`
  ).join('\n\n');
  return `📚 *Estudo Suporte TI — Dia ${diaNum}*\n\n🔁 *Revisão Geral do Dia*\n\n${resumos}\n\n✅ _Parabéns pelo estudo de hoje! Amanhã tem mais._ 🚀`;
}

/**
 * Gera a mensagem correta baseada no tipo e tópicos do dia
 */
async function gerarMensagemEstudo(tipo, indicesTopicos, diaNum, ciclo) {
  const topicosHoje = indicesTopicos.map(i => TOPICOS[i % TOPICOS.length]);
  // Para conteúdo/revisão/teste usa o primeiro tópico do dia
  const topico = topicosHoje[0];

  switch (tipo) {
    case 'conteudo': return gerarConteudoNovo(topico, diaNum);
    case 'revisao':  return gerarRevisaoAtiva(topico, diaNum);
    case 'teste':    return gerarMiniTeste(topico, diaNum);
    case 'geral':    return gerarRevisaoGeral(topicosHoje, diaNum);
    default:         return gerarConteudoNovo(topico, diaNum);
  }
}

/**
 * Avalia resposta do usuário usando a IA
 */
async function avaliarResposta(historico, indiceTopico) {
  const topico = TOPICOS[indiceTopico % TOPICOS.length];
  const systemPrompt = `Você é um tutor de Suporte TI ajudando Ricardo a estudar.
Tópico atual: ${topico.num}/19 — ${topico.titulo}
Conceitos: ${topico.conceitos.join('; ')}

Avalie a resposta de Ricardo:
- Diga se está correto, parcialmente correto ou incorreto
- Complemente com o que faltou
- Seja encorajador e didático
- Máximo 5 linhas
- Português brasileiro`;

  return _gerarResposta(systemPrompt, historico);
}

function getTopicoPorIndice(i) { return TOPICOS[i % TOPICOS.length]; }

module.exports = { TOPICOS, gerarMensagemEstudo, avaliarResposta, getTopicoPorIndice };
