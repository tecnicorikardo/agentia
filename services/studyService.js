/**
 * studyService.js
 * Sistema de estudo com repetição espaçada, perguntas de fixação e flashcards
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

const TOPICOS = [
  {
    titulo: '💻 Fundamentos e Manutenção de Hardware',
    modulo: 'Módulo I',
    resumo: `O computador é regido pela arquitetura de Von Neumann, que introduziu o conceito de programa armazenado — instruções e dados coexistem na mesma memória.

🔄 *Ciclo de instrução:* Busca (fetch) → Decodificação → Execução
A CPU busca a instrução na memória, a Unidade de Controle interpreta, e a ULA executa.

🧠 *Hierarquia de memória:*
• Cache L1/L2/L3 → nanosegundos, reduz o Gargalo de Von Neumann
• RAM → memória principal, volátil
• SSD/HD → armazenamento persistente

🔧 *Manutenção:*
• Preventiva: limpeza e controle térmico
• Corretiva: diagnóstico e substituição de componentes`,
    pergunta: '❓ O que é o "Gargalo de Von Neumann" e como a memória cache resolve esse problema?',
    flashcards: [
      { p: 'O que faz a ULA?', r: 'Unidade Lógica e Aritmética — executa operações matemáticas e lógicas da CPU.' },
      { p: 'Qual a diferença entre RAM e Cache?', r: 'Cache é mais rápida e fica dentro/próxima da CPU. RAM é maior e mais lenta.' },
      { p: 'O que é manutenção preventiva?', r: 'Limpeza, controle térmico e verificações periódicas para evitar falhas.' },
    ],
  },
  {
    titulo: '🖥️ Introdução à Informática',
    modulo: 'Módulo I',
    resumo: `A alfabetização digital envolve entender como dados se transformam em informação útil.

📊 *Ciclo de processamento:*
Entrada → Processamento → Saída
Base de qualquer dispositivo, do microprocessador ao supercomputador.

⚖️ *Hardware vs Software:*
• Hardware: parte física (CPU, teclado, monitor)
• Software: parte lógica (SO, aplicativos)

🖥️ *Tipos de computadores:*
Desktops, notebooks, servidores, embarcados — cada um para uma necessidade diferente de custo, tamanho e desempenho.`,
    pergunta: '❓ Qual a diferença entre hardware e software? Dê um exemplo de cada.',
    flashcards: [
      { p: 'Quais são as 3 etapas do ciclo de processamento?', r: 'Entrada → Processamento → Saída.' },
      { p: 'O que é hardware?', r: 'Parte física do computador: CPU, memória, teclado, monitor.' },
      { p: 'O que é software?', r: 'Parte lógica: sistema operacional, aplicativos, drivers.' },
    ],
  },
  {
    titulo: '🧠 Lógica Matemática',
    modulo: 'Módulo I',
    resumo: `A lógica matemática é o alicerce do raciocínio computacional.

🔣 *Operadores lógicos:*
• AND: verdadeiro só se AMBOS forem verdadeiros
• OR: verdadeiro se PELO MENOS UM for verdadeiro
• NOT: inverte o valor lógico

📋 *Tabelas-verdade:* validam expressões booleanas e algoritmos de decisão.

⚡ *Complexidade Big O:*
• O(1) → constante, ideal
• O(n) → linear
• O(n²) → quadrático, lento
• O(2ⁿ) → exponencial, proibitivo`,
    pergunta: '❓ Se A=verdadeiro e B=falso, qual o resultado de: A AND B? A OR B? NOT A?',
    flashcards: [
      { p: 'O que significa O(1) em Big O?', r: 'Complexidade constante — o tempo não muda independente do tamanho dos dados.' },
      { p: 'AND retorna verdadeiro quando?', r: 'Somente quando AMBOS os operandos são verdadeiros.' },
      { p: 'Para que serve uma tabela-verdade?', r: 'Validar todas as combinações possíveis de uma expressão lógica.' },
    ],
  },
  {
    titulo: '🌐 Redes de Computadores',
    modulo: 'Módulo I',
    resumo: `Redes permitem que dispositivos se comuniquem e compartilhem recursos.

🔗 *Modelo TCP/IP (4 camadas):*
1. Interface de Rede → transmissão física
2. Internet → roteamento via IP
3. Transporte → TCP (confiável) ou UDP (rápido)
4. Aplicação → HTTP, DNS, FTP

🌍 *Tipos:* LAN (local) e WAN (longa distância)

🛠️ *Equipamentos:*
• Roteador: encaminha pacotes entre redes
• Switch: conecta dispositivos na mesma rede

📡 *DNS:* traduz nomes (google.com) em endereços IP`,
    pergunta: '❓ Qual a diferença entre TCP e UDP? Quando usar cada um?',
    flashcards: [
      { p: 'Quantas camadas tem o modelo TCP/IP?', r: '4 camadas: Interface de Rede, Internet, Transporte e Aplicação.' },
      { p: 'O que faz o DNS?', r: 'Traduz nomes de domínio (ex: google.com) em endereços IP.' },
      { p: 'Diferença entre roteador e switch?', r: 'Roteador conecta redes diferentes. Switch conecta dispositivos na mesma rede.' },
    ],
  },
  {
    titulo: '⚙️ Sistemas Operacionais I',
    modulo: 'Módulo I',
    resumo: `O SO é o intermediário entre hardware e programas.

🔄 *Escalonamento de processos:*
• Round Robin: cada processo recebe fatias iguais de tempo
• SJF (Shortest Job First): prioriza processos mais curtos

💾 *Gerenciamento de memória:*
• Memória virtual: cada processo tem seu próprio espaço
• Tabelas de páginas: isolam processos, evitando crashes em cascata

🚀 *Bootstrap:* rotina em ROM carrega o núcleo do SO para a RAM ao ligar o computador.`,
    pergunta: '❓ O que é escalonamento de processos e por que ele é necessário?',
    flashcards: [
      { p: 'O que é Round Robin?', r: 'Algoritmo de escalonamento que dá fatias iguais de CPU para cada processo.' },
      { p: 'O que é memória virtual?', r: 'Técnica que dá a cada processo seu próprio espaço de endereço, isolando-os.' },
      { p: 'O que é bootstrap?', r: 'Processo de inicialização que carrega o SO da memória persistente para a RAM.' },
    ],
  },
  {
    titulo: '📱 Softwares Aplicativos',
    modulo: 'Módulo I',
    resumo: `Softwares aplicativos entregam valor direto ao usuário final.

📋 *Categorias:*
• Produtividade: Word, Excel, navegadores
• Comunicação: e-mail, videoconferência
• ERP: integra todos os departamentos da empresa (RH, financeiro, estoque)
• Sistemas específicos: hospital, escola, loja

💡 *Software de prateleira vs sob medida:*
• Prateleira: pronto, mais barato, menos personalizado
• Sob medida: desenvolvido para a empresa, mais caro, mais adequado`,
    pergunta: '❓ O que é um ERP e qual problema ele resolve nas empresas?',
    flashcards: [
      { p: 'O que significa ERP?', r: 'Enterprise Resource Planning — sistema que integra todos os departamentos da empresa.' },
      { p: 'Qual a vantagem do software sob medida?', r: 'É desenvolvido especificamente para as necessidades da empresa, mais adequado.' },
      { p: 'Cite 3 exemplos de software de produtividade.', r: 'Word, Excel, Google Docs, PowerPoint, navegadores.' },
    ],
  },
  {
    titulo: '🔍 Tópicos Especiais — IA e Cloud',
    modulo: 'Módulo I',
    resumo: `A vanguarda tecnológica atual é definida por IA e Cloud Computing.

☁️ *Modelos de serviço Cloud:*
• IaaS: aluga servidores e rede (ex: AWS EC2)
• PaaS: ambiente de desenvolvimento pronto (ex: Heroku)
• SaaS: software via internet (ex: Gmail, Google Docs)

🔒 *Responsabilidade compartilhada:*
• Provedor: protege a infraestrutura física
• Cliente: protege seus dados e aplicações

🤖 *IA:* Machine Learning aprende com dados para fazer previsões e automações.`,
    pergunta: '❓ Qual a diferença entre IaaS, PaaS e SaaS? Dê um exemplo real de cada.',
    flashcards: [
      { p: 'O que é SaaS?', r: 'Software como Serviço — você usa o software pela internet sem instalar nada. Ex: Gmail.' },
      { p: 'O que é IaaS?', r: 'Infraestrutura como Serviço — aluga servidores virtuais na nuvem. Ex: AWS EC2.' },
      { p: 'O que é responsabilidade compartilhada na nuvem?', r: 'Provedor protege a infraestrutura; cliente protege seus dados e aplicações.' },
    ],
  },
  {
    titulo: '🤖 Elementos de Automação',
    modulo: 'Módulo II',
    resumo: `Automação reduz a intervenção humana em processos repetitivos ou perigosos.

🔌 *Componentes:*
• Sensores: captam variáveis (temperatura, pressão, presença)
• Atuadores: executam ações físicas (motores, válvulas)
• CLP: o "cérebro" do sistema, processa lógica Ladder

📊 *SCADA:* supervisão em tempo real de processos industriais à distância.

🔄 *Exemplo:* sensor detecta peça → CLP processa → atuador move o braço robótico`,
    pergunta: '❓ Qual a função do CLP em um sistema de automação industrial?',
    flashcards: [
      { p: 'O que é um sensor?', r: 'Dispositivo que capta variáveis do ambiente (temperatura, pressão, presença).' },
      { p: 'O que é CLP?', r: 'Controlador Lógico Programável — processa lógica e controla atuadores industriais.' },
      { p: 'O que é SCADA?', r: 'Sistema de supervisão e aquisição de dados em tempo real para processos industriais.' },
    ],
  },
  {
    titulo: '🧩 Engenharia de Software',
    modulo: 'Módulo II',
    resumo: `Engenharia de Software cria sistemas organizados, eficientes e sustentáveis.

📜 *Manifesto Ágil:* pessoas, software funcionando, colaboração e adaptação a mudanças.

🔄 *Frameworks:*
• Scrum: sprints de 1-4 semanas, backlog priorizado
• Kanban: fluxo contínuo, colunas (A fazer / Fazendo / Feito)

🏗️ *SOLID (5 princípios):*
• S: uma responsabilidade por classe
• O: aberto para extensão, fechado para modificação
• L: subclasses substituem a classe pai
• I: interfaces específicas
• D: dependa de abstrações`,
    pergunta: '❓ Explique o princípio S do SOLID com um exemplo prático.',
    flashcards: [
      { p: 'O que é Scrum?', r: 'Framework ágil com sprints curtos, backlog e reuniões diárias para desenvolvimento iterativo.' },
      { p: 'O que significa o S do SOLID?', r: 'Single Responsibility — cada classe deve ter apenas uma responsabilidade.' },
      { p: 'Diferença entre Scrum e Kanban?', r: 'Scrum usa sprints com prazo fixo. Kanban é fluxo contínuo sem iterações.' },
    ],
  },
  {
    titulo: '📊 Gerência de Projetos em TI',
    modulo: 'Módulo II',
    resumo: `Gerenciar projetos é equilibrar prazo, custo e escopo sem perder qualidade.

📐 *Triângulo de restrições:*
Prazo ↔ Custo ↔ Escopo — mudar um afeta os outros dois.

🔄 *Scrum na prática:*
Sprint Planning → Daily Scrum → Sprint Review → Retrospectiva

🚀 *CI/CD:* automatiza testes e deploy, garantindo que código novo não quebre o sistema.

👥 *Stakeholders:* todas as partes interessadas (cliente, equipe, gestores).`,
    pergunta: '❓ O que é o triângulo de restrições e como ele afeta as decisões de um projeto?',
    flashcards: [
      { p: 'O que é CI/CD?', r: 'Integração e Entrega Contínua — automatiza testes e deploy de código.' },
      { p: 'Quem são os stakeholders?', r: 'Todas as partes interessadas no projeto: cliente, equipe, gestores, usuários.' },
      { p: 'O que acontece se aumentar o escopo sem mudar prazo/custo?', r: 'A qualidade cai — é a lei do triângulo de restrições.' },
    ],
  },
  {
    titulo: '⚡ Introdução à Eletrônica',
    modulo: 'Módulo II',
    resumo: `A eletrônica é a base física de todo o hardware.

⚡ *Lei de Ohm:* V = R × I
• Tensão (V): "pressão" elétrica
• Corrente (I): fluxo de elétrons
• Resistência (R): oposição ao fluxo

🔬 *Semicondutores:*
• Transistor: interruptor eletrônico, base dos processadores
• Diodo: permite corrente em apenas uma direção

🔢 *Digital:* opera com 0 e 1. Portas lógicas (AND, OR, NOT) são feitas com transistores.`,
    pergunta: '❓ O que é um transistor e qual seu papel nos processadores modernos?',
    flashcards: [
      { p: 'Qual a fórmula da Lei de Ohm?', r: 'V = R × I (Tensão = Resistência × Corrente).' },
      { p: 'O que faz um transistor?', r: 'Funciona como interruptor eletrônico — base dos processadores e circuitos digitais.' },
      { p: 'O que é eletrônica digital?', r: 'Opera com apenas dois estados: 0 (desligado) e 1 (ligado).' },
    ],
  },
  {
    titulo: '🚀 Planejamento Estratégico e Empreendedorismo',
    modulo: 'Módulo II',
    resumo: `Sucesso tecnológico depende de alinhar inovação com estratégia de negócio.

🔍 *Análise SWOT:*
• Forças e Fraquezas (internas)
• Oportunidades e Ameaças (externas)

📋 *Business Model Canvas:* 9 blocos descrevem como o negócio cria e captura valor.

🚀 *Lean Startup:*
• MVP: versão mínima para testar a ideia
• Ciclo: Construir → Medir → Aprender → Ajustar`,
    pergunta: '❓ O que é MVP e por que ele é importante na metodologia Lean Startup?',
    flashcards: [
      { p: 'O que é SWOT?', r: 'Análise de Forças, Fraquezas, Oportunidades e Ameaças de um negócio.' },
      { p: 'O que é MVP?', r: 'Produto Mínimo Viável — versão básica para validar a ideia com o mínimo de investimento.' },
      { p: 'O que é Business Model Canvas?', r: '9 blocos que descrevem como um negócio cria, entrega e captura valor.' },
    ],
  },
  {
    titulo: '⚠️ Segurança do Trabalho',
    modulo: 'Módulo II',
    resumo: `A saúde do profissional de TI é protegida por normas de ergonomia.

📋 *NR-17:* adapta o trabalho às características físicas e psicológicas do trabalhador.

🖥️ *Ergonomia para TI:*
• Monitor na altura dos olhos, 50-70cm de distância
• Cadeira com apoio lombar, pés no chão
• Pausa a cada 50 minutos

⚠️ *LER/DORT:* lesões por esforço repetitivo — causadas por digitação excessiva e má postura.

🏠 *Home Office:* NR-17 se aplica também ao trabalho remoto.`,
    pergunta: '❓ O que é LER/DORT e quais as principais causas para profissionais de TI?',
    flashcards: [
      { p: 'O que é a NR-17?', r: 'Norma Regulamentadora de Ergonomia — define condições adequadas de trabalho.' },
      { p: 'O que é LER?', r: 'Lesão por Esforço Repetitivo — causada por movimentos repetitivos como digitação excessiva.' },
      { p: 'De quanto em quanto tempo fazer pausas?', r: 'A cada 50 minutos de trabalho contínuo no computador.' },
    ],
  },
  {
    titulo: '⚙️ Sistemas Operacionais II',
    modulo: 'Módulo II',
    resumo: `Administração profissional de servidores em produção.

🐧 *Linux:*
• Shell Script: automatiza tarefas (backups, relatórios)
• chmod/chown: controla permissões de arquivos
• systemctl: gerencia serviços do sistema

🪟 *Windows Server:*
• Active Directory: gerencia usuários e computadores da rede
• GPO: aplica configurações e restrições em massa

🔐 *Segurança:* princípio do menor privilégio — cada usuário tem só o acesso necessário.`,
    pergunta: '❓ O que é o Active Directory e qual problema ele resolve em empresas?',
    flashcards: [
      { p: 'O que é Active Directory?', r: 'Serviço do Windows Server que centraliza gerenciamento de usuários, grupos e políticas.' },
      { p: 'O que é GPO?', r: 'Group Policy Object — aplica configurações e restrições em massa nos computadores da rede.' },
      { p: 'O que é o princípio do menor privilégio?', r: 'Cada usuário recebe apenas o acesso mínimo necessário para sua função.' },
    ],
  },
  {
    titulo: '🐘 PHP e Laravel',
    modulo: 'Módulo III',
    resumo: `PHP é a linguagem backend mais usada na web.

🔧 *PHP 8.x:* tipagem forte, JIT Compiler para melhor performance.

🏗️ *Laravel — framework MVC:*
• Rotas: define URLs e controladores
• Eloquent ORM: manipula banco com objetos PHP
  Ex: User::where('ativo', true)->get()
• Artisan: CLI para gerar código e rodar migrations
• Middleware: filtra requisições (autenticação, logs)

📐 *Padrões PSR:* garantem que código PHP de diferentes projetos seja compatível.`,
    pergunta: '❓ O que é um ORM e qual a vantagem de usar o Eloquent do Laravel?',
    flashcards: [
      { p: 'O que é MVC?', r: 'Model-View-Controller — padrão que separa dados, interface e lógica de negócio.' },
      { p: 'O que é Eloquent ORM?', r: 'Camada do Laravel que permite manipular o banco de dados usando objetos PHP.' },
      { p: 'O que faz o Artisan?', r: 'CLI do Laravel para gerar código, rodar migrations, criar controllers, etc.' },
    ],
  },
  {
    titulo: '🎨 Design UX e Figma',
    modulo: 'Módulo III',
    resumo: `UX garante que o produto seja intuitivo e agradável de usar.

🎯 *10 Heurísticas de Nielsen (principais):*
1. Visibilidade do status do sistema
2. Correspondência com o mundo real
3. Controle e liberdade do usuário
4. Prevenção de erros
5. Design minimalista

🖌️ *Figma:*
• Prototipagem de alta fidelidade antes de desenvolver
• Componentes reutilizáveis (Design System)
• Colaboração em tempo real

🔄 *Processo UX:* Pesquisa → Wireframe → Protótipo → Teste → Implementação`,
    pergunta: '❓ Por que é importante testar a usabilidade antes de desenvolver o sistema?',
    flashcards: [
      { p: 'O que são as Heurísticas de Nielsen?', r: '10 princípios para avaliar a usabilidade de interfaces de usuário.' },
      { p: 'O que é prototipagem de alta fidelidade?', r: 'Protótipo visual detalhado que simula o produto final antes do desenvolvimento.' },
      { p: 'O que é Design System?', r: 'Biblioteca de componentes reutilizáveis que garante consistência visual no produto.' },
    ],
  },
  {
    titulo: '🌐 Programação Web',
    modulo: 'Módulo III',
    resumo: `Desenvolvimento web: frontend (o que o usuário vê) + backend (o que processa).

🏗️ *Frontend:*
• HTML: estrutura e conteúdo
• CSS: estilo e layout (Flexbox, Grid)
• JavaScript: interatividade

🔌 *APIs RESTful:*
• GET: buscar | POST: criar | PUT: atualizar | DELETE: remover
• Formato padrão: JSON

🔐 *Segurança:*
• JWT: autenticação stateless
• OAuth2: login com Google/Facebook
• HTTPS: criptografia na transmissão`,
    pergunta: '❓ O que é uma API RESTful e quais os 4 métodos HTTP principais?',
    flashcards: [
      { p: 'O que faz o HTML?', r: 'Define a estrutura e o conteúdo da página web.' },
      { p: 'O que é JWT?', r: 'JSON Web Token — token para autenticação stateless em APIs.' },
      { p: 'Qual método HTTP é usado para criar dados?', r: 'POST.' },
    ],
  },
  {
    titulo: '🗄️ Banco de Dados',
    modulo: 'Módulo III',
    resumo: `Bancos de dados organizam e garantem a integridade das informações.

🔒 *ACID:*
• Atomicidade: tudo ou nada
• Consistência: dados sempre válidos
• Isolação: transações não interferem entre si
• Durabilidade: dados persistem após falhas

📐 *Normalização:*
• 1NF: eliminar grupos repetitivos
• 2NF: eliminar dependências parciais
• 3NF: eliminar dependências transitivas

📦 *NoSQL:* escalabilidade horizontal, flexível para dados semiestruturados (MongoDB, Firebase).`,
    pergunta: '❓ O que significa ACID em banco de dados? Explique cada letra.',
    flashcards: [
      { p: 'O que é Atomicidade no ACID?', r: 'A transação é tudo ou nada — se falhar no meio, tudo é revertido.' },
      { p: 'O que a 1NF exige?', r: 'Eliminar grupos repetitivos e garantir que cada campo tenha valor atômico.' },
      { p: 'Diferença entre SQL e NoSQL?', r: 'SQL: relacional, estruturado, ACID. NoSQL: flexível, escalável horizontalmente.' },
    ],
  },
  {
    titulo: '🧪 Projeto Integrador',
    modulo: 'Módulo III',
    resumo: `O Projeto Integrador aplica tudo do curso em um cenário real.

📋 *Etapas:*
1. Planejamento (SWOT, Canvas)
2. Levantamento de requisitos
3. Modelagem do banco (DER, normalização)
4. Design no Figma (UX/UI)
5. Desenvolvimento PHP/Laravel + HTML/CSS/JS
6. Testes e deploy

🎯 *O que é avaliado:*
• Integração entre disciplinas
• Qualidade do código (SOLID, Clean Code)
• Usabilidade (Heurísticas de Nielsen)
• Documentação e apresentação

💡 Escolha um problema real que você conhece!`,
    pergunta: '❓ Quais disciplinas do curso são integradas no Projeto Integrador e como elas se conectam?',
    flashcards: [
      { p: 'O que é DER?', r: 'Diagrama Entidade-Relacionamento — representa visualmente a estrutura do banco de dados.' },
      { p: 'O que é Clean Code?', r: 'Conjunto de práticas para escrever código legível, simples e fácil de manter.' },
      { p: 'Por que escolher um problema real para o projeto?', r: 'Facilita o desenvolvimento, a apresentação e demonstra aplicação prática do conhecimento.' },
    ],
  },
];

/**
 * Retorna o tópico pelo índice
 */
function getTopicoPorIndice(indice) {
  return TOPICOS[indice % TOPICOS.length];
}

/**
 * Retorna o tópico do dia baseado na data atual (fallback)
 */
function getTopicoDoDia() {
  const hoje = new Date();
  const diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
  return TOPICOS[diaDoAno % TOPICOS.length];
}

/**
 * Monta mensagem completa: revisão anterior + resumo novo + pergunta
 */
function montarMensagemCompleta(indiceAtual) {
  const total = TOPICOS.length;
  const topico = TOPICOS[indiceAtual];
  const indicePrev = (indiceAtual - 1 + total) % total;
  const topicoPrev = TOPICOS[indicePrev];

  // Flashcard aleatório do tópico anterior para revisão
  const flashcards = topicoPrev.flashcards;
  const fc = flashcards[Math.floor(Math.random() * flashcards.length)];

  return `🔁 *Revisão rápida — ${topicoPrev.titulo}*\n❓ ${fc.p}\n✅ ${fc.r}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📚 *Tópico ${indiceAtual + 1}/${total} — ${topico.titulo}*\n${topico.modulo}\n\n` +
    `${topico.resumo}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `${topico.pergunta}\n\n_Responda aqui para eu avaliar!_ 💪`;
}

/**
 * Avalia a resposta de Ricardo usando a IA
 */
async function avaliarResposta(historico, indiceAtual) {
  const topico = TOPICOS[indiceAtual % TOPICOS.length];
  const systemPrompt = `Você é um tutor de TI ajudando Ricardo a estudar para o curso técnico.
Tópico atual: ${topico.titulo}
Resumo do tópico: ${topico.resumo}

Quando Ricardo responder a pergunta de fixação:
- Avalie se a resposta está correta, parcialmente correta ou incorreta
- Complemente com o que faltou de forma didática
- Seja encorajador — errar faz parte do aprendizado
- Máximo 6 linhas
- Use emojis com moderação
- Responda em português brasileiro`;

  return _gerarResposta(systemPrompt, historico);
}

module.exports = { TOPICOS, getTopicoPorIndice, getTopicoDoDia, montarMensagemCompleta, avaliarResposta };
