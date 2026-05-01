/**
 * studyService.js
 * Agente de Estudo Inteligente — Suporte TI
 * 19 tópicos com 4 tipos de mensagem por dia
 */

const { gerarResposta: _gerarResposta } = require('./aiProvider');

const TOPICOS = [
  {
    num: '01', titulo: 'Fundamentos e Manutenção de Hardware',
    conceitos: [
      'Arquitetura Von Neumann: instruções e dados coexistem na mesma memória',
      'Ciclo de instrução: Busca (fetch) → Decodifica → Executa',
      'Hierarquia de memória: Registradores > Cache L1 > L2 > L3 > RAM > SSD > HD',
      'Cache L1 fica dentro do núcleo da CPU — acesso em nanosegundos',
      'Gargalo de Von Neumann: limite na taxa de transferência entre CPU e RAM',
      'SSD NVMe usa protocolo PCIe — muito mais rápido que SSD SATA',
      'Manutenção preventiva: limpeza, controle térmico, atualização de drivers e BIOS',
      'Manutenção corretiva: diagnóstico com HWMonitor, CrystalDiskInfo, MemTest86',
    ],
    revisao: [
      'Qual a diferença entre cache L1, L2 e L3?',
      'O que é o Gargalo de Von Neumann e como a cache mitiga esse problema?',
      'Qual a diferença entre SSD SATA e SSD NVMe em termos de protocolo?',
      'Um computador liga mas não exibe imagem. Qual sequência de diagnóstico você seguiria?',
      'Como identificar se lentidão é causada por RAM insuficiente ou CPU sobrecarregada?',
    ],
    teste: [
      { p: 'O que é a arquitetura de Von Neumann?', a: ['A) Modelo onde CPU e memória são separados fisicamente', 'B) Modelo onde instruções e dados coexistem na mesma memória ✅', 'C) Tipo de processador de alta performance'] },
      { p: 'Qual memória é mais rápida?', a: ['A) HD', 'B) RAM', 'C) Cache L1 ✅'] },
      { p: 'SSD NVMe é mais rápido que SATA porque:', a: ['A) Tem mais capacidade de armazenamento', 'B) Usa protocolo PCIe em vez de SATA ✅', 'C) É maior fisicamente'] },
    ],
  },
  {
    num: '02', titulo: 'Introdução à Informática',
    conceitos: [
      'Ciclo fundamental: Entrada → Processamento → Saída → Armazenamento',
      'Hardware (físico) vs Software (lógico) — drivers fazem a ponte entre os dois',
      'Bit = menor unidade (0 ou 1). 8 bits = 1 byte. Escala: KB, MB, GB, TB',
      'Sistemas de numeração: binário (base 2), hexadecimal (base 16), decimal (base 10)',
      'Firmware: software gravado em hardware, ex: BIOS/UEFI — inicializa o hardware',
      'Virtualização: rodar múltiplos SOs em uma única máquina física',
      'Memória ECC: detecta e corrige erros de bit automaticamente — usada em servidores',
      'Tipos de software: SO, aplicativos, utilitários, drivers, firmware',
    ],
    revisao: [
      'Converta o decimal 156 para binário e hexadecimal.',
      'Qual a diferença entre software proprietário e software livre? Cite exemplos.',
      'O que é firmware e como ele difere de um sistema operacional?',
      'Explique virtualização e cite um cenário prático de uso.',
      'Por que servidores usam memória ECC? O que ela corrige?',
    ],
    teste: [
      { p: 'O ciclo de processamento é:', a: ['A) Ligar → Usar → Desligar', 'B) Entrada → Processamento → Saída ✅', 'C) Hardware → Software → Dados'] },
      { p: 'Firmware é:', a: ['A) Um tipo de vírus', 'B) Software gravado em hardware como BIOS/UEFI ✅', 'C) Um sistema operacional completo'] },
      { p: 'Um teclado é exemplo de:', a: ['A) Software', 'B) Hardware de entrada ✅', 'C) Sistema operacional'] },
    ],
  },
  {
    num: '03', titulo: 'Lógica Matemática',
    conceitos: [
      'Operadores: AND (ambos verdadeiros), OR (um verdadeiro), NOT (inverte), XOR (diferentes)',
      'Tabelas-verdade validam expressões booleanas e comportamento de circuitos',
      'Big O: O(1) constante, O(log n) logarítmico, O(n) linear, O(n²) quadrático, O(2ⁿ) exponencial',
      'Recursão: função que chama a si mesma — ex: fatorial, Fibonacci',
      'Busca binária: divide o conjunto ao meio a cada passo — O(log n)',
      'Portas NAND e NOR são universais: qualquer outra porta pode ser construída com elas',
      'Algoritmo: sequência finita de passos para resolver um problema',
      'Fluxograma: representação visual de algoritmos com símbolos padronizados',
    ],
    revisao: [
      'Se A=V e B=F, qual o resultado de A AND B? E de A OR B?',
      'Qual a diferença entre complexidade O(n) e O(n²)? Quando isso importa?',
      'Explique recursão e cite um exemplo clássico.',
      'O que é busca binária e qual sua vantagem sobre a busca linear?',
      'Como portas NAND podem construir qualquer outra porta lógica?',
    ],
    teste: [
      { p: 'AND retorna verdadeiro quando:', a: ['A) Pelo menos um operando é verdadeiro', 'B) Ambos os operandos são verdadeiros ✅', 'C) Nenhum operando é verdadeiro'] },
      { p: 'Qual complexidade é a mais eficiente?', a: ['A) O(n²)', 'B) O(n)', 'C) O(1) ✅'] },
      { p: 'Busca binária tem complexidade:', a: ['A) O(n)', 'B) O(log n) ✅', 'C) O(n²)'] },
    ],
  },
  {
    num: '04', titulo: 'Redes de Computadores',
    conceitos: [
      'Modelo OSI (7 camadas): Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação',
      'TCP/IP (4 camadas): Interface de Rede, Internet, Transporte, Aplicação — base prática da internet',
      'TCP: orientado a conexão, handshake 3 vias (SYN, SYN-ACK, ACK), garante entrega',
      'UDP: sem conexão, mais rápido, usado em streaming e jogos',
      'DNS: traduz nomes de domínio em IPs. DHCP: atribui IPs automaticamente',
      'IP 169.254.x.x (APIPA) = falha no DHCP — diagnóstico imediato',
      'Switch: conecta dispositivos na mesma rede (camada 2). Roteador: conecta redes diferentes (camada 3)',
      'Sub-redes CIDR: /24 = 254 hosts, /16 = 65534 hosts',
    ],
    revisao: [
      'Um usuário recebeu IP 169.254.10.5. O que indica e como resolver?',
      'Qual a diferença entre TCP e UDP? Cite um protocolo que usa cada um.',
      'Explique o processo de resolução DNS passo a passo.',
      'O que é uma VLAN e qual problema ela resolve?',
      'Como o traceroute ajuda a diagnosticar problemas de conectividade?',
    ],
    teste: [
      { p: 'O protocolo TCP garante:', a: ['A) Velocidade máxima de transmissão', 'B) Entrega confiável e ordenada dos dados ✅', 'C) Conexão sem fio'] },
      { p: 'LAN significa:', a: ['A) Long Area Network', 'B) Local Area Network ✅', 'C) Linked Access Node'] },
      { p: 'IP 169.254.x.x indica:', a: ['A) Conexão com internet estável', 'B) Falha na comunicação com o servidor DHCP ✅', 'C) IP reservado para servidores'] },
    ],
  },
  {
    num: '05', titulo: 'Sistemas Operacionais I',
    conceitos: [
      'SO gerencia CPU, memória, disco e dispositivos — intermediário entre hardware e software',
      'Escalonamento: Round Robin (fatias iguais), SJF (mais curto primeiro), Prioridade',
      'Estados de processo: pronto, executando, bloqueado',
      'Memória virtual + paginação: isola processos e amplia espaço de endereçamento',
      'Swap: extensão da RAM no disco — quando RAM enche, desempenho cai drasticamente',
      'Boot: BIOS/UEFI → POST → Bootloader (GRUB) → Kernel → Interface do usuário',
      'BIOS vs UEFI: UEFI suporta discos >2TB, boot seguro (Secure Boot) e interface gráfica',
      'Deadlock: dois processos bloqueados esperando recursos um do outro',
    ],
    revisao: [
      'O que é um deadlock? Como o SO pode preveni-lo?',
      'Qual a diferença entre processo e thread?',
      'O que é memória virtual e como o swap funciona?',
      'Qual a diferença entre BIOS e UEFI?',
      'Como o escalonador Round Robin distribui o tempo de CPU?',
    ],
    teste: [
      { p: 'O escalonamento Round Robin:', a: ['A) Prioriza processos mais longos', 'B) Dá fatias iguais de CPU para cada processo ✅', 'C) Executa apenas um processo por vez'] },
      { p: 'Memória virtual serve para:', a: ['A) Aumentar a velocidade do HD', 'B) Isolar processos e ampliar o espaço de endereçamento ✅', 'C) Substituir a memória cache'] },
      { p: 'Deadlock ocorre quando:', a: ['A) A CPU está sobrecarregada', 'B) Dois processos ficam bloqueados esperando recursos um do outro ✅', 'C) O disco está cheio'] },
    ],
  },
  {
    num: '06', titulo: 'Softwares Aplicativos',
    conceitos: [
      'Microsoft 365: Word, Excel, PowerPoint, Outlook, Teams — suite corporativa dominante',
      'ERP (Enterprise Resource Planning): integra financeiro, RH, estoque em uma plataforma',
      'Configuração de e-mail: IMAP (sincroniza em todos os dispositivos) vs POP3 (baixa e remove)',
      'SMTP: protocolo de envio de e-mail. Porta 587 (TLS) ou 465 (SSL)',
      'Problemas comuns Outlook: perfil corrompido → criar novo perfil no Painel de Controle',
      'OneDrive: recuperar arquivos deletados em até 30 dias pela Lixeira do OneDrive',
      'Teams: problemas de áudio/vídeo geralmente são de driver ou permissão de microfone',
      'Antivírus/EDR: Windows Defender, CrowdStrike — proteção contra malware e ransomware',
    ],
    revisao: [
      'Um usuário não consegue abrir o Outlook com erro de perfil corrompido. Como resolver?',
      'Qual a diferença entre IMAP e POP3? Qual recomendar para uso corporativo?',
      'Como recuperar um arquivo do OneDrive deletado há 20 dias?',
      'O que é um ERP e por que o suporte técnico precisa entendê-lo?',
      'Como identificar se lentidão no navegador é extensão maliciosa ou problema de rede?',
    ],
    teste: [
      { p: 'ERP significa:', a: ['A) Electronic Resource Program', 'B) Enterprise Resource Planning ✅', 'C) Extended Runtime Platform'] },
      { p: 'IMAP é preferível ao POP3 porque:', a: ['A) É mais antigo e estável', 'B) Sincroniza e-mails em todos os dispositivos ✅', 'C) Consome menos banda'] },
      { p: 'Para recuperar e-mails deletados no Exchange Online o prazo é:', a: ['A) 7 dias', 'B) 30 dias ✅', 'C) 90 dias'] },
    ],
  },
  {
    num: '07', titulo: 'Tópicos Especiais — IA e Cloud',
    conceitos: [
      'IaaS: você gerencia SO e apps (ex: AWS EC2, Azure VM)',
      'PaaS: você gerencia só dados e aplicações (ex: Azure App Service)',
      'SaaS: software pronto para usar (ex: Microsoft 365, Gmail, Salesforce)',
      'Responsabilidade compartilhada: provedor protege infraestrutura, cliente protege dados',
      'Escalabilidade horizontal: adicionar mais servidores. Vertical: aumentar recursos do servidor',
      'Nuvem híbrida: combina infraestrutura local (on-premises) com nuvem pública',
      'IA no suporte: chatbots para triagem, ML para prever falhas, automação de resets de senha',
      'DevOps: integração entre desenvolvimento e operações — CI/CD, containers, IaC',
    ],
    revisao: [
      'Qual a diferença entre IaaS, PaaS e SaaS? Cite um exemplo real de cada.',
      'O que é o modelo de responsabilidade compartilhada na nuvem?',
      'Qual a diferença entre escalabilidade horizontal e vertical?',
      'Cite 3 vantagens e 2 riscos de migrar para a nuvem.',
      'Como a IA está sendo usada no suporte técnico moderno?',
    ],
    teste: [
      { p: 'Gmail é um exemplo de:', a: ['A) IaaS', 'B) PaaS', 'C) SaaS ✅'] },
      { p: 'Na nuvem, quem protege os dados do cliente?', a: ['A) O provedor de nuvem', 'B) O próprio cliente ✅', 'C) O governo'] },
      { p: 'Escalabilidade horizontal significa:', a: ['A) Aumentar CPU e RAM do servidor atual', 'B) Adicionar mais servidores ao ambiente ✅', 'C) Reduzir o número de servidores'] },
    ],
  },
  {
    num: '08', titulo: 'Elementos de Automação',
    conceitos: [
      'Sensores captam variáveis físicas: temperatura, pressão, presença, luminosidade',
      'Atuadores executam ações físicas: motores, válvulas, cilindros pneumáticos',
      'CLP (Controlador Lógico Programável): processa lógica Ladder, cérebro do sistema',
      'SCADA: supervisão e aquisição de dados em tempo real — painel de controle industrial',
      'IHM (Interface Homem-Máquina): tela de operação do sistema automatizado',
      'RPA (Robotic Process Automation): automação de tarefas repetitivas em TI — UiPath, Automation Anywhere',
      'CI/CD: automação de build, testes e deploy de software',
      'Ansible/Terraform: provisionamento automático de infraestrutura (IaC)',
    ],
    revisao: [
      'Qual a diferença entre um CLP e um microcontrolador como Arduino?',
      'O que é RPA e como difere de automação com scripts?',
      'Cite um exemplo prático de automação que um técnico de suporte poderia implementar.',
      'O que é um pipeline CI/CD e quais etapas ele inclui?',
      'Como o Ansible difere do Terraform em termos de propósito?',
    ],
    teste: [
      { p: 'O CLP em automação industrial é:', a: ['A) Um tipo de sensor de temperatura', 'B) O controlador que processa a lógica do sistema ✅', 'C) Um atuador hidráulico'] },
      { p: 'SCADA serve para:', a: ['A) Programar CLPs', 'B) Supervisionar processos em tempo real ✅', 'C) Instalar sensores'] },
      { p: 'RPA é usado para:', a: ['A) Controlar robôs industriais físicos', 'B) Automatizar tarefas repetitivas em sistemas de TI ✅', 'C) Programar CLPs industriais'] },
    ],
  },
  {
    num: '09', titulo: 'Engenharia de Software',
    conceitos: [
      'Manifesto Ágil: pessoas > processos, software funcionando > documentação, colaboração > contrato',
      'Scrum: sprints de 1-4 semanas, papéis (PO, Scrum Master, Dev Team), cerimônias (Daily, Review, Retro)',
      'Kanban: fluxo contínuo, colunas To Do/Doing/Done, limite de WIP',
      'SOLID — S: Single Responsibility, O: Open/Closed, L: Liskov, I: Interface Segregation, D: Dependency Inversion',
      'Dívida técnica: atalhos no código que geram custo futuro de manutenção',
      'Refatoração: melhorar estrutura do código sem alterar comportamento externo',
      'Testes: unitário (função isolada), integração (módulos juntos), sistema (end-to-end)',
      'Clean Architecture: separar regras de negócio de frameworks e banco de dados',
    ],
    revisao: [
      'Qual a principal diferença entre Cascata e Ágil? Quando usar cada um?',
      'O que é dívida técnica e como ela impacta a manutenção?',
      'Explique o princípio Single Responsibility com exemplo prático.',
      'O que é refatoração? Ela muda o comportamento do sistema?',
      'Qual a diferença entre testes unitários e testes de integração?',
    ],
    teste: [
      { p: 'Scrum usa:', a: ['A) Fluxo contínuo sem iterações', 'B) Sprints com prazo fixo ✅', 'C) Apenas documentação'] },
      { p: 'O princípio S do SOLID significa:', a: ['A) Segurança do código', 'B) Single Responsibility — uma responsabilidade por classe ✅', 'C) Sincronização de dados'] },
      { p: 'Refatoração de código:', a: ['A) Adiciona novas funcionalidades', 'B) Melhora a estrutura sem alterar o comportamento ✅', 'C) Corrige bugs de segurança'] },
    ],
  },
  {
    num: '10', titulo: 'Gerência de Projetos em TI',
    conceitos: [
      'Triângulo de restrições: Prazo ↔ Custo ↔ Escopo — mudar um afeta os outros',
      'Scrum: Planning → Daily → Sprint Review → Retrospectiva',
      'KPIs: Velocity (trabalho por sprint), Lead Time, Cycle Time',
      'SLA: acordo de nível de serviço — ex: responder em 1h, resolver em 4h',
      'OKR: Objectives and Key Results — metodologia de metas usada por Google',
      'MVP: Produto Mínimo Viável — validar hipóteses antes de grandes investimentos',
      'CI/CD automatiza testes e deploy — reduz erros e acelera entregas',
      'Stakeholder: qualquer pessoa afetada pelo projeto — deve ser gerenciada ativamente',
    ],
    revisao: [
      'O que é o triângulo de restrições e como ele afeta decisões?',
      'Qual a diferença entre Scrum e Kanban? Quando cada um é mais adequado?',
      'O que é um SLA e como ele é monitorado no suporte técnico?',
      'Como você priorizaria um backlog com 50 itens de diferentes áreas?',
      'O que é MVP e qual sua importância em projetos ágeis?',
    ],
    teste: [
      { p: 'Se aumentar o escopo sem mudar prazo/custo:', a: ['A) A qualidade melhora automaticamente', 'B) A qualidade tende a cair ✅', 'C) O projeto fica mais barato'] },
      { p: 'CI/CD significa:', a: ['A) Controle Interno e Controle de Dados', 'B) Integração Contínua e Entrega Contínua ✅', 'C) Código Integrado e Deploy'] },
      { p: 'SLA define:', a: ['A) O salário da equipe de TI', 'B) Os níveis de serviço acordados com o cliente ✅', 'C) A arquitetura do sistema'] },
    ],
  },
  {
    num: '11', titulo: 'Introdução à Eletrônica',
    conceitos: [
      'Lei de Ohm: V = R × I (Tensão = Resistência × Corrente). Potência: P = V × I',
      'Resistor: limita corrente. Capacitor: armazena carga, filtra ruídos',
      'Diodo: permite corrente em apenas uma direção',
      'Transistor: interruptor eletrônico — base dos processadores modernos',
      'Eletrônica digital: opera com 0 e 1 — portas lógicas feitas com transistores',
      'Flip-flop: armazena 1 bit de informação — base das memórias digitais',
      'Curto-circuito: caminho de baixa resistência que causa superaquecimento e danos',
      'Pulseira antiestática: obrigatória ao manusear componentes internos — descarrega eletricidade estática',
    ],
    revisao: [
      'Calcule a corrente em um circuito com 12V e resistência de 4 ohms.',
      'Qual a função de um capacitor em uma fonte de alimentação?',
      'Por que transistores são a base dos processadores modernos?',
      'Qual a diferença entre eletrônica analógica e digital?',
      'O que é um curto-circuito e quais danos pode causar a um computador?',
    ],
    teste: [
      { p: 'A Lei de Ohm é:', a: ['A) V = R + I', 'B) V = R × I ✅', 'C) V = R / I'] },
      { p: 'Transistores são usados para:', a: ['A) Armazenar dados permanentemente', 'B) Funcionar como interruptores eletrônicos ✅', 'C) Transmitir sinais de rádio'] },
      { p: 'Pulseira antiestática é usada para:', a: ['A) Proteger contra choques elétricos', 'B) Descarregar eletricidade estática antes de manusear componentes ✅', 'C) Medir tensão elétrica'] },
    ],
  },
  {
    num: '12', titulo: 'Planejamento Estratégico e Empreendedorismo',
    conceitos: [
      'SWOT: Forças e Fraquezas (internas) + Oportunidades e Ameaças (externas)',
      'Business Model Canvas: 9 blocos — proposta de valor, clientes, canais, receitas, custos...',
      'Lean Startup: MVP → Construir → Medir → Aprender → Ajustar (ciclo rápido)',
      'OKR: Objectives and Key Results — metas ambiciosas com resultados mensuráveis',
      'Product-Market Fit: quando o produto resolve um problema real do mercado',
      'Bootstrapping: crescer sem investimento externo. VC: venture capital para escalar rápido',
      'Pitch: apresentação concisa do negócio — problema, solução, mercado, modelo de receita',
      'Lean aplicado em TI: eliminar desperdícios, automatizar processos, entregar valor contínuo',
    ],
    revisao: [
      'Como aplicar análise SWOT para avaliar a infraestrutura de TI de uma empresa?',
      'O que é MVP e como ele reduz risco em projetos de tecnologia?',
      'Qual a diferença entre OKR e KPI? Como se complementam?',
      'Explique Product-Market Fit e sua importância para startups de tecnologia.',
      'Como a metodologia Lean pode ser aplicada na gestão de um departamento de TI?',
    ],
    teste: [
      { p: 'SWOT analisa:', a: ['A) Apenas fatores externos do mercado', 'B) Fatores internos e externos do negócio ✅', 'C) Apenas a concorrência'] },
      { p: 'MVP significa:', a: ['A) Modelo de Valor Permanente', 'B) Produto Mínimo Viável ✅', 'C) Máximo Valor Possível'] },
      { p: 'OKR é uma metodologia de:', a: ['A) Gestão de infraestrutura', 'B) Definição e acompanhamento de metas ✅', 'C) Desenvolvimento de software'] },
    ],
  },
  {
    num: '13', titulo: 'Segurança do Trabalho',
    conceitos: [
      'NR-17 (Ergonomia): regula postura, iluminação, mobiliário e organização do trabalho',
      'NR-10 (Eletricidade): segurança em instalações elétricas — obrigatória para quem mexe em hardware',
      'LER/DORT: lesões por esforço repetitivo — digitação excessiva, má postura, mouse',
      'Regra 20-20-20: a cada 20 min, olhar para algo a 20 pés por 20 segundos (saúde ocular)',
      'Postura correta: monitor na altura dos olhos, cotovelos a 90°, pés apoiados no chão',
      'Burnout no suporte: alta demanda + pressão constante — identificar sinais precoces',
      'Riscos elétricos: desligar e desconectar equipamentos antes de abrir gabinetes',
      'EPI: pulseira antiestática, óculos de proteção, luvas isolantes para trabalho elétrico',
    ],
    revisao: [
      'Quais os principais riscos ergonômicos para um técnico que trabalha 8h/dia no computador?',
      'Por que usar pulseira antiestática ao manusear componentes internos?',
      'O que é a NR-17 e quais parâmetros ela define para o posto de trabalho?',
      'Como identificar sinais precoces de burnout em uma equipe de suporte?',
      'Quais cuidados de segurança são necessários ao trabalhar com no-breaks e fontes?',
    ],
    teste: [
      { p: 'A NR-17 trata de:', a: ['A) Segurança elétrica em data centers', 'B) Ergonomia e adaptação do trabalho ao trabalhador ✅', 'C) Normas de programação segura'] },
      { p: 'LER é causada principalmente por:', a: ['A) Exposição a radiação de monitores', 'B) Movimentos repetitivos e má postura ✅', 'C) Uso de equipamentos sem aterramento'] },
      { p: 'Antes de abrir um gabinete de computador você deve:', a: ['A) Usar luvas de borracha', 'B) Desligar e desconectar da tomada ✅', 'C) Ligar o ventilador do ambiente'] },
    ],
  },
  {
    num: '14', titulo: 'Sistemas Operacionais II',
    conceitos: [
      'Active Directory (AD): centraliza autenticação e autorização em redes Windows',
      'GPO (Group Policy Object): políticas aplicadas a usuários e computadores do domínio',
      'OU (Organizational Unit): agrupa objetos no AD para aplicar políticas específicas',
      'Azure AD / Microsoft Entra ID: versão cloud do AD — usa OAuth 2.0 e SAML',
      'SSPR: Self-Service Password Reset — usuário redefine senha sem chamar o suporte',
      'Linux — permissões: chmod (rwx), chown (proprietário), grupos de acesso',
      'Linux — usuários: useradd, usermod, userdel, passwd',
      'Princípio do menor privilégio: cada usuário tem apenas o acesso estritamente necessário',
    ],
    revisao: [
      'O que é uma GPO e como ela aumenta a segurança das estações de trabalho?',
      'Qual a diferença entre Active Directory local e Azure Active Directory?',
      'Como criar um usuário no Linux e definir permissões de acesso a uma pasta?',
      'O que é o protocolo Kerberos e como funciona na autenticação do AD?',
      'Como o journalctl ajuda a diagnosticar falhas de serviço no Linux?',
    ],
    teste: [
      { p: 'Active Directory serve para:', a: ['A) Gerenciar arquivos no Linux', 'B) Centralizar usuários, grupos e políticas no Windows Server ✅', 'C) Configurar redes Wi-Fi'] },
      { p: 'GPO significa:', a: ['A) General Protocol Object', 'B) Group Policy Object ✅', 'C) Global Permission Override'] },
      { p: 'SSPR permite que o usuário:', a: ['A) Acesse o servidor sem senha', 'B) Redefina sua própria senha sem acionar o suporte ✅', 'C) Instale softwares sem permissão'] },
    ],
  },
  {
    num: '15', titulo: 'PHP e Laravel',
    conceitos: [
      'PHP 8.x: JIT Compiler, Named Arguments, Match expression, Nullsafe operator (?->)',
      'Laravel MVC: Model (Eloquent ORM), View (Blade templates), Controller',
      'Eloquent ORM: manipula banco de dados usando objetos PHP — sem escrever SQL manual',
      'Migrations: versionamento do banco de dados — essencial para trabalho em equipe',
      'Artisan CLI: php artisan make:controller, make:model, migrate, tinker',
      'Middleware: filtros de requisição — autenticação, CORS, rate limiting',
      'Proteção SQL Injection: usar query bindings do Eloquent, nunca concatenar strings',
      'Padrões PSR: garantem compatibilidade e estilo consistente entre projetos PHP',
    ],
    revisao: [
      'Qual a diferença entre include e require no PHP?',
      'O que é o Eloquent ORM e como simplifica operações com banco de dados?',
      'Explique o padrão MVC e como o Laravel o implementa.',
      'O que são migrations no Laravel e por que são importantes?',
      'Como proteger uma aplicação PHP contra SQL Injection?',
    ],
    teste: [
      { p: 'Eloquent ORM permite:', a: ['A) Criar interfaces gráficas', 'B) Manipular banco de dados usando objetos PHP ✅', 'C) Gerenciar servidores Linux'] },
      { p: 'MVC significa:', a: ['A) Model-View-Controller ✅', 'B) Module-Version-Code', 'C) Main-Variable-Class'] },
      { p: 'Migrations no Laravel servem para:', a: ['A) Fazer backup do banco', 'B) Versionar a estrutura do banco de dados ✅', 'C) Otimizar queries SQL'] },
    ],
  },
  {
    num: '16', titulo: 'Design UX e Figma',
    conceitos: [
      '10 Heurísticas de Nielsen: visibilidade do status, controle do usuário, consistência, prevenção de erros',
      'Processo UX: Pesquisa → Personas → Wireframe → Protótipo → Teste → Implementação',
      'Wireframe: esboço estrutural sem design visual — define layout e hierarquia',
      'Protótipo de alta fidelidade no Figma: design final interativo para testes de usabilidade',
      'Design System: biblioteca de componentes reutilizáveis — garante consistência visual',
      'Acessibilidade WCAG: contraste mínimo 4.5:1, tamanho de fonte, navegação por teclado',
      'Auto Layout no Figma: responsividade automática dos componentes',
      'UX vs UI: UX = experiência e fluxo do usuário. UI = aparência visual da interface',
    ],
    revisao: [
      'O que é a heurística "visibilidade do status do sistema"? Cite um exemplo.',
      'Qual a diferença entre UX e UI? Como se complementam?',
      'O que é um wireframe e por que é criado antes do design final?',
      'Como avaliar a acessibilidade de uma interface digital?',
      'O que é Design System e quais benefícios traz para equipes de desenvolvimento?',
    ],
    teste: [
      { p: 'As Heurísticas de Nielsen são:', a: ['A) Regras de programação segura', 'B) Princípios para avaliar usabilidade de interfaces ✅', 'C) Métricas de performance de banco de dados'] },
      { p: 'Protótipo de alta fidelidade serve para:', a: ['A) Substituir o desenvolvimento', 'B) Testar a usabilidade antes de desenvolver ✅', 'C) Documentar o código'] },
      { p: 'Design System é:', a: ['A) Um framework CSS', 'B) Biblioteca de componentes reutilizáveis que garante consistência visual ✅', 'C) Um tipo de banco de dados'] },
    ],
  },
  {
    num: '17', titulo: 'Programação Web',
    conceitos: [
      'HTML: estrutura semântica (header, main, section, article, footer)',
      'CSS: Flexbox e Grid para layout, variáveis CSS, design responsivo com media queries',
      'JavaScript: manipulação do DOM, eventos, fetch API, async/await, Promises',
      'APIs RESTful: GET (buscar), POST (criar), PUT/PATCH (atualizar), DELETE (remover)',
      'Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error',
      'JWT: token de autenticação stateless — header.payload.signature codificado em Base64',
      'CORS: controla acesso entre origens diferentes — configurar no servidor backend',
      'Segurança: HTTPS (TLS), proteção contra XSS (sanitizar inputs) e CSRF (tokens)',
    ],
    revisao: [
      'Qual a diferença entre autenticação e autorização? Como o JWT implementa cada uma?',
      'O que é CORS e por que existe? Como configurar corretamente?',
      'Explique o que acontece desde digitar uma URL até a página aparecer.',
      'Qual a diferença entre renderização SSR e CSR?',
      'Como proteger uma API REST contra acesso não autorizado?',
    ],
    teste: [
      { p: 'Para criar dados em uma API REST usa-se:', a: ['A) GET', 'B) POST ✅', 'C) DELETE'] },
      { p: 'JWT é usado para:', a: ['A) Estilizar páginas web', 'B) Autenticação stateless em APIs ✅', 'C) Criar banco de dados'] },
      { p: 'Status code 401 significa:', a: ['A) Recurso não encontrado', 'B) Não autorizado — credenciais inválidas ou ausentes ✅', 'C) Erro interno do servidor'] },
    ],
  },
  {
    num: '18', titulo: 'Banco de Dados',
    conceitos: [
      'ACID: Atomicidade (tudo ou nada), Consistência (estado válido), Isolação (transações independentes), Durabilidade (persiste após commit)',
      'Normalização: 1NF (eliminar grupos repetitivos), 2NF (dependências parciais), 3NF (dependências transitivas)',
      'JOINs: INNER (interseção), LEFT (todos da esquerda), RIGHT (todos da direita), FULL OUTER (todos)',
      'Índice: estrutura que acelera consultas — como índice de livro. Cuidado: ocupa espaço e lentifica writes',
      'NoSQL — tipos: Documento (MongoDB), Chave-valor (Redis), Coluna (Cassandra), Grafo (Neo4j)',
      'Quando usar NoSQL: dados semiestruturados, alta escalabilidade, grande volume, flexibilidade de schema',
      'Transação: conjunto de operações que devem ser executadas como uma unidade atômica',
      'Stored Procedure: bloco de código SQL armazenado no banco — reutilizável e mais performático',
    ],
    revisao: [
      'Escreva uma query SQL que retorna os 5 clientes com maior valor total de pedidos.',
      'Qual a diferença entre INNER JOIN e LEFT JOIN? Quando usar cada um?',
      'O que é normalização e por que é importante?',
      'Quando escolher NoSQL em vez de banco relacional?',
      'O que é um índice e como melhora a performance de consultas?',
    ],
    teste: [
      { p: 'Atomicidade no ACID significa:', a: ['A) Dados sempre válidos', 'B) A transação é tudo ou nada ✅', 'C) Transações isoladas entre si'] },
      { p: 'NoSQL é ideal para:', a: ['A) Dados altamente estruturados com muitas relações', 'B) Dados semiestruturados com alta escalabilidade ✅', 'C) Relatórios financeiros complexos'] },
      { p: 'Um índice em banco de dados:', a: ['A) Aumenta o espaço em disco sem benefício', 'B) Acelera consultas mas ocupa espaço e lentifica writes ✅', 'C) Substitui a chave primária'] },
    ],
  },
  {
    num: '19', titulo: 'Projeto Integrador',
    conceitos: [
      'Une todas as disciplinas: planejamento, banco de dados, backend PHP, design Figma',
      'Etapas: requisitos → modelagem (DER) → design (Figma) → backend → frontend → testes → deploy',
      'Requisito funcional: o que o sistema faz. Não-funcional: como ele se comporta (performance, segurança)',
      'Diagrama de Casos de Uso: mostra interações entre atores e o sistema',
      'DER (Diagrama Entidade-Relacionamento): modela a estrutura do banco de dados',
      'Deploy em Linux: configurar Apache/Nginx, PHP-FPM, banco de dados, permissões de pasta',
      'Avalia: integração, qualidade do código (SOLID), usabilidade (Nielsen), documentação',
      'Simula cenário real de mercado — escolha um problema real para resolver!',
    ],
    revisao: [
      'Como levantar requisitos de um sistema para empresa que nunca teve software próprio?',
      'Qual a diferença entre requisito funcional e não-funcional? Cite exemplos.',
      'Como organizar o trabalho em equipe no projeto usando metodologia ágil?',
      'O que é um Diagrama de Casos de Uso e qual sua utilidade?',
      'Como fazer o deploy de uma aplicação PHP em um servidor Linux?',
    ],
    teste: [
      { p: 'O Projeto Integrador avalia principalmente:', a: ['A) Velocidade de digitação', 'B) Integração prática de todas as disciplinas do curso ✅', 'C) Conhecimento de hardware apenas'] },
      { p: 'DER significa:', a: ['A) Diagrama de Estrutura de Rede', 'B) Diagrama Entidade-Relacionamento ✅', 'C) Documento de Especificação de Requisitos'] },
      { p: 'Requisito não-funcional define:', a: ['A) O que o sistema deve fazer', 'B) Como o sistema deve se comportar (performance, segurança) ✅', 'C) Quais telas o sistema terá'] },
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
