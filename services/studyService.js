/**
 * studyService.js
 * Gerencia o conteúdo de estudo e monta as mensagens diárias
 * Conteúdo extraído de tecnico.md e tecnico1.md
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

const TOPICOS = [
  {
    titulo: '💻 Fundamentos e Manutenção de Hardware',
    modulo: 'Módulo I',
    resumo: `O computador é regido pela arquitetura de Von Neumann, que introduziu o conceito de programa armazenado — instruções e dados coexistem na mesma memória.

🔄 *Ciclo de instrução:* Busca (fetch) → Decodificação → Execução
A CPU busca a instrução na memória, a Unidade de Controle interpreta, e a ULA (Unidade Lógica e Aritmética) executa.

🧠 *Hierarquia de memória:*
• Cache L1/L2/L3 → acesso em nanosegundos, reduz o "Gargalo de Von Neumann"
• RAM → memória principal, volátil
• SSD/HD → armazenamento persistente

🔧 *Manutenção:*
• Preventiva: limpeza, controle térmico, preservação dos semicondutores
• Corretiva: diagnóstico preciso e substituição de componentes falhos

👉 Foco: entender o funcionamento interno + diagnosticar problemas de hardware`,
  },
  {
    titulo: '🖥️ Introdução à Informática',
    modulo: 'Módulo I',
    resumo: `A alfabetização digital vai além de usar programas — envolve entender como os dados se transformam em informação útil.

📊 *Ciclo de processamento:*
Entrada → Processamento → Saída
Esse ciclo é a base de qualquer dispositivo, do microprocessador ao supercomputador.

⚖️ *Hardware vs Software:*
• Hardware: parte física (CPU, teclado, monitor)
• Software: parte lógica (sistema operacional, aplicativos)

🖥️ *Tipos de computadores:*
Desktops, notebooks, servidores, embarcados — cada um com custo, tamanho e desempenho diferentes para cada necessidade.

👉 Foco: base conceitual para entender toda a área de TI`,
  },
  {
    titulo: '🧠 Lógica Matemática',
    modulo: 'Módulo I',
    resumo: `A lógica matemática é o alicerce do raciocínio computacional e da programação.

🔣 *Operadores lógicos:*
• AND (E): verdadeiro só se ambos forem verdadeiros
• OR (OU): verdadeiro se pelo menos um for verdadeiro
• NOT (NÃO): inverte o valor lógico

📋 *Tabelas-verdade:* validam expressões booleanas e algoritmos de decisão.

⚡ *Complexidade de algoritmos (Big O):*
• O(1) → constante, ideal
• O(n) → linear, cresce com os dados
• O(n²) → quadrático, lento para grandes volumes
• O(2ⁿ) → exponencial, proibitivo

👉 Foco: pensar como programador — não basta funcionar, precisa ser eficiente`,
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

🌍 *Tipos de rede:*
• LAN: rede local (casa, escritório)
• WAN: longa distância (internet)

🛠️ *Equipamentos:*
• Roteador: encaminha pacotes entre redes
• Switch: conecta dispositivos na mesma rede

📡 *Protocolos importantes:*
• DNS: traduz nomes (google.com) em IPs
• HTTP/HTTPS: tráfego web

👉 Foco: entender como a internet funciona na prática`,
  },
  {
    titulo: '⚙️ Sistemas Operacionais I',
    modulo: 'Módulo I',
    resumo: `O sistema operacional (SO) é o intermediário entre o hardware e os programas.

🔄 *Funções principais:*
• Escalonamento de processos: decide qual programa usa a CPU
  - Round Robin: cada processo recebe fatias iguais de tempo
  - SJF (Shortest Job First): prioriza processos mais curtos

💾 *Gerenciamento de memória:*
• Memória virtual: cada processo tem seu próprio espaço de endereço
• Tabelas de páginas: isolam processos, evitando que um crash derrube o sistema

🚀 *Bootstrap:* ao ligar o computador, uma rotina em ROM carrega o núcleo do SO para a RAM.

🖥️ *Exemplos:* Windows, Linux, macOS

👉 Foco: entender o que acontece "por baixo" quando você usa o computador`,
  },
  {
    titulo: '📱 Softwares Aplicativos',
    modulo: 'Módulo I',
    resumo: `Softwares aplicativos são as ferramentas que entregam valor direto ao usuário final.

📋 *Categorias principais:*
• Produtividade: Word, Excel, PowerPoint, navegadores
• Comunicação: e-mail, videoconferência
• Gestão empresarial: ERPs que integram RH, financeiro, estoque
• Sistemas específicos: softwares de hospital, escola, loja

🏢 *No ambiente corporativo:*
Sistemas ERP (Enterprise Resource Planning) integram todos os departamentos em uma única plataforma, eliminando retrabalho e melhorando a tomada de decisão.

💡 *Diferença entre software de prateleira e sob medida:*
• Prateleira: pronto, mais barato, menos personalizado
• Sob medida: desenvolvido para a empresa, mais caro, mais adequado

👉 Foco: produtividade e escolha da ferramenta certa para cada situação`,
  },
  {
    titulo: '🔍 Tópicos Especiais — IA e Cloud',
    modulo: 'Módulo I',
    resumo: `A vanguarda tecnológica atual é definida por IA e Computação em Nuvem.

☁️ *Cloud Computing — modelos de serviço:*
• IaaS (Infrastructure as a Service): aluga servidores e rede (ex: AWS EC2)
• PaaS (Platform as a Service): ambiente de desenvolvimento pronto (ex: Heroku)
• SaaS (Software as a Service): software via internet (ex: Google Docs, Gmail)

🔒 *Responsabilidade compartilhada na nuvem:*
• Provedor: protege a infraestrutura física
• Cliente: protege seus dados e aplicações

🤖 *Inteligência Artificial:*
• Machine Learning: sistemas que aprendem com dados
• Aplicações: reconhecimento de imagem, chatbots, recomendações

📈 *Tendências:* Edge Computing, IoT, computação quântica

👉 Foco: atualização tecnológica e entender o futuro da TI`,
  },
  {
    titulo: '🤖 Elementos de Automação',
    modulo: 'Módulo II',
    resumo: `Automação reduz a intervenção humana em processos repetitivos ou perigosos.

🔌 *Componentes fundamentais:*
• Sensores: captam variáveis do ambiente (temperatura, pressão, presença, luz)
• Atuadores: executam ações físicas (motores, válvulas, cilindros)
• CLP (Controlador Lógico Programável): o "cérebro" do sistema, processa lógica Ladder

🏭 *Diagrama Ladder:*
Linguagem de programação visual para CLPs, baseada em contatos e bobinas elétricas.

📊 *SCADA (Supervisory Control and Data Acquisition):*
Sistema de supervisão em tempo real que monitora e controla processos industriais à distância.

🔄 *Exemplo prático:*
Linha de produção: sensor detecta peça → CLP processa → atuador move o braço robótico

👉 Foco: entender como máquinas e sistemas industriais funcionam de forma autônoma`,
  },
  {
    titulo: '🧩 Engenharia de Software',
    modulo: 'Módulo II',
    resumo: `Engenharia de Software é a disciplina de criar sistemas de forma organizada, eficiente e sustentável.

📜 *Manifesto Ágil:*
Prioriza pessoas, software funcionando, colaboração e resposta a mudanças sobre processos rígidos.

🔄 *Frameworks ágeis:*
• Scrum: sprints de 1-4 semanas, reuniões diárias, backlog priorizado
• Kanban: fluxo contínuo, colunas (A fazer / Fazendo / Feito)

🏗️ *Princípios SOLID:*
• S: Single Responsibility — cada classe tem uma responsabilidade
• O: Open/Closed — aberto para extensão, fechado para modificação
• L: Liskov Substitution — subclasses substituem a classe pai
• I: Interface Segregation — interfaces específicas
• D: Dependency Inversion — dependa de abstrações, não de implementações

🧹 *Clean Architecture:* separa regras de negócio da infraestrutura, facilitando testes e manutenção.

👉 Foco: escrever código que dure, seja testável e fácil de manter`,
  },
  {
    titulo: '📊 Gerência de Projetos em TI',
    modulo: 'Módulo II',
    resumo: `Gerenciar projetos de TI significa equilibrar prazo, custo e escopo sem perder qualidade.

📐 *Triângulo de restrições:*
Prazo ↔ Custo ↔ Escopo — mudar um afeta os outros dois.

🔄 *Metodologias:*
• Scrum: ideal para projetos com requisitos que mudam
  - Sprint Planning → Daily Scrum → Sprint Review → Retrospectiva
• Kanban: ideal para fluxo contínuo de tarefas (suporte, manutenção)

🚀 *CI/CD (Integração e Entrega Contínua):*
Automatiza testes e deploy, garantindo que o código novo não quebre o sistema.

👥 *Stakeholders:* todas as partes interessadas no projeto (cliente, equipe, gestores).

📋 *Ferramentas comuns:* Jira, Trello, Azure DevOps, GitHub Projects

👉 Foco: entregar projetos no prazo, dentro do orçamento e com qualidade`,
  },
  {
    titulo: '⚡ Introdução à Eletrônica',
    modulo: 'Módulo II',
    resumo: `A eletrônica é a base física sobre a qual todo o hardware é construído.

⚡ *Conceitos fundamentais:*
• Tensão (V): "pressão" que empurra os elétrons
• Corrente (A): fluxo de elétrons
• Resistência (Ω): oposição ao fluxo — Lei de Ohm: V = R × I

🔬 *Semicondutores:*
• Transistor: interruptor eletrônico, base dos processadores modernos
• Diodo: permite corrente em apenas uma direção

🔢 *Eletrônica digital:*
Opera com apenas dois estados: 0 (desligado) e 1 (ligado).
Portas lógicas (AND, OR, NOT) são construídas com transistores e formam os circuitos dos processadores.

💡 *VLSI (Very Large Scale Integration):*
Bilhões de transistores em uma única pastilha de silício — é assim que os chips modernos são feitos.

👉 Foco: entender o hardware no nível elétrico e físico`,
  },
  {
    titulo: '🚀 Planejamento Estratégico e Empreendedorismo',
    modulo: 'Módulo II',
    resumo: `O sucesso tecnológico depende de alinhar inovação com estratégia de negócio.

🔍 *Análise SWOT:*
• Forças (Strengths): o que você faz bem
• Fraquezas (Weaknesses): onde precisa melhorar
• Oportunidades (Opportunities): tendências do mercado
• Ameaças (Threats): concorrência e riscos externos

📋 *Business Model Canvas:*
9 blocos que descrevem como um negócio cria, entrega e captura valor.
(Proposta de valor, segmentos de clientes, canais, receitas, custos...)

🚀 *Lean Startup:*
• MVP (Produto Mínimo Viável): versão básica para testar a ideia
• Ciclo: Construir → Medir → Aprender → Ajustar

💡 *Para TI:* todo projeto deve ter proposta de valor clara — qual problema resolve e para quem?

👉 Foco: criar e crescer projetos com visão de mercado`,
  },
  {
    titulo: '⚠️ Segurança do Trabalho',
    modulo: 'Módulo II',
    resumo: `A saúde do profissional de TI é protegida por normas específicas de ergonomia e segurança.

📋 *NR-17 (Ergonomia):*
Estabelece parâmetros para adaptar o trabalho às características físicas e psicológicas do trabalhador.

🖥️ *Ergonomia para TI:*
• Monitor na altura dos olhos, a 50-70cm de distância
• Cadeira com apoio lombar, pés apoiados no chão
• Pausas a cada 50 minutos de trabalho contínuo

⚠️ *LER/DORT:*
Lesões por Esforço Repetitivo / Distúrbios Osteomusculares Relacionados ao Trabalho.
Causas: digitação excessiva, postura inadequada, falta de pausas.

🏠 *Home Office:*
A NR-17 se aplica também ao trabalho remoto — o empregador deve orientar sobre ergonomia.

🦺 *EPIs (Equipamentos de Proteção Individual):*
Obrigatórios em ambientes com riscos elétricos ou físicos.

👉 Foco: prevenir acidentes e doenças ocupacionais na área de TI`,
  },
  {
    titulo: '⚙️ Sistemas Operacionais II',
    modulo: 'Módulo II',
    resumo: `Administração profissional de servidores e sistemas em produção.

🐧 *Linux — administração:*
• Shell Script: automatiza tarefas repetitivas (backups, relatórios, monitoramento)
• Permissões: chmod, chown — controla quem pode ler, escrever ou executar
• Serviços: systemctl start/stop/enable para gerenciar daemons

🪟 *Windows Server:*
• Active Directory (AD): gerencia usuários, grupos e computadores da rede
• GPO (Group Policy Objects): aplica configurações e restrições em massa
• DNS e DHCP integrados ao AD

🔐 *Segurança em servidores:*
• Princípio do menor privilégio: cada usuário tem só o acesso necessário
• Logs de auditoria: registram quem fez o quê e quando
• Firewall e atualizações regulares

👉 Foco: administrar servidores com segurança e eficiência em ambiente profissional`,
  },
  {
    titulo: '🐘 PHP e Laravel',
    modulo: 'Módulo III',
    resumo: `PHP é a linguagem backend mais usada na web, presente em 77% dos sites com linguagem conhecida.

🔧 *PHP 8.x — novidades:*
• Tipagem forte: evita erros silenciosos
• JIT Compiler: melhora performance
• Named arguments, match expression, fibers

🏗️ *Laravel — framework MVC:*
• Rotas: define URLs e seus controladores
• Eloquent ORM: manipula banco de dados com objetos PHP
  Ex: User::where('ativo', true)->get()
• Artisan: CLI para gerar código, rodar migrations, etc.
• Middleware: filtra requisições (autenticação, logs)
• Blade: template engine para views

📐 *Padrões PSR:*
PSR-1, PSR-2, PSR-4 garantem que código PHP de diferentes projetos seja compatível e legível.

👉 Foco: criar sistemas web dinâmicos e escaláveis com boas práticas`,
  },
  {
    titulo: '🎨 Design UX e Figma',
    modulo: 'Módulo III',
    resumo: `UX (User Experience) garante que o produto seja intuitivo e agradável de usar.

🎯 *10 Heurísticas de Nielsen:*
1. Visibilidade do status do sistema
2. Correspondência com o mundo real
3. Controle e liberdade do usuário
4. Consistência e padrões
5. Prevenção de erros
6. Reconhecimento em vez de memorização
7. Flexibilidade e eficiência
8. Design minimalista
9. Ajuda para reconhecer e corrigir erros
10. Documentação e ajuda

🖌️ *Figma — ferramenta de design:*
• Prototipagem de alta fidelidade antes de desenvolver
• Componentes reutilizáveis (Design System)
• Colaboração em tempo real
• Teste de usabilidade com usuários reais

🔄 *Processo UX:*
Pesquisa → Wireframe → Protótipo → Teste → Implementação

👉 Foco: criar interfaces que o usuário entenda sem precisar de manual`,
  },
  {
    titulo: '🌐 Programação Web',
    modulo: 'Módulo III',
    resumo: `Desenvolvimento web envolve frontend (o que o usuário vê) e backend (o que processa os dados).

🏗️ *Frontend — as 3 camadas:*
• HTML: estrutura e conteúdo
• CSS: estilo e layout (Flexbox, Grid)
• JavaScript: interatividade e lógica no navegador

⚙️ *Backend:*
• Processa requisições, acessa banco de dados, aplica regras de negócio
• Linguagens: PHP, Node.js, Python, Java

🔌 *APIs RESTful:*
• GET: buscar dados
• POST: criar dados
• PUT/PATCH: atualizar dados
• DELETE: remover dados
• Formato padrão: JSON

🔐 *Segurança:*
• JWT (JSON Web Token): autenticação stateless
• OAuth2: autorização delegada (login com Google/Facebook)
• HTTPS: criptografia na transmissão

👉 Foco: construir aplicações web completas, do HTML ao servidor`,
  },
  {
    titulo: '🗄️ Banco de Dados',
    modulo: 'Módulo III',
    resumo: `Bancos de dados organizam e garantem a integridade das informações de um sistema.

🔒 *Propriedades ACID:*
• Atomicidade: tudo ou nada (transação completa ou revertida)
• Consistência: dados sempre válidos
• Isolação: transações não interferem entre si
• Durabilidade: dados persistem mesmo após falhas

📐 *Normalização (SQL):*
• 1NF: eliminar grupos repetitivos, garantir chave primária
• 2NF: eliminar dependências parciais
• 3NF: eliminar dependências transitivas
• BCNF: rigor nas chaves candidatas

🔍 *SQL básico:*
SELECT, INSERT, UPDATE, DELETE, JOIN, WHERE, GROUP BY

📦 *NoSQL:*
• Escalabilidade horizontal (adiciona servidores)
• Flexível para dados semiestruturados
• Exemplos: MongoDB (documentos), Redis (chave-valor), Firebase (tempo real)

👉 Foco: modelar dados corretamente e garantir integridade e performance`,
  },
  {
    titulo: '🧪 Projeto Integrador',
    modulo: 'Módulo III',
    resumo: `O Projeto Integrador é a culminância do curso — aplica tudo que foi aprendido em um cenário real.

📋 *Etapas do projeto:*
1. Planejamento estratégico (SWOT, Canvas)
2. Levantamento de requisitos
3. Modelagem do banco de dados (DER, normalização)
4. Design de interface no Figma (UX/UI)
5. Desenvolvimento backend em PHP/Laravel
6. Desenvolvimento frontend (HTML, CSS, JS)
7. Testes e deploy

🎯 *O que é avaliado:*
• Integração entre as disciplinas
• Qualidade do código (SOLID, Clean Code)
• Usabilidade da interface (Heurísticas de Nielsen)
• Documentação técnica
• Apresentação e defesa do projeto

💡 *Dica:* escolha um problema real que você conhece — fica mais fácil de desenvolver e apresentar.

👉 Foco: experiência prática que simula o mercado de trabalho real`,
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
 * Gera resposta da IA para quando Ricardo responder uma pergunta
 */
async function avaliarResposta(historico) {
  const topico = getTopicoDoDia();
  const systemPrompt = `Você é um tutor de TI ajudando Ricardo a estudar para o curso técnico.
Tópico atual: ${topico.titulo}

Quando Ricardo responder uma pergunta:
- Avalie se está correto ou incompleto
- Complemente com informações importantes que faltaram
- Seja encorajador e didático
- Máximo 5 linhas
- Use emojis com moderação
- Responda em português brasileiro`;

  return _gerarResposta(systemPrompt, historico);
}

module.exports = { TOPICOS, getTopicoPorIndice, getTopicoDoDia, avaliarResposta };
