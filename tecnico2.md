# GUIA COMPLETO DE TI - SUPORTE TECNICO
## Modulos I, II e III + Pratica Profissional

---

# MODULO I - FUNDAMENTOS DA INFRAESTRUTURA

## 1. Fundamentos e Manutencao de Hardware

### Resumo

O hardware e a base fisica de qualquer sistema computacional. A arquitetura de Von Neumann define como CPU, memoria e dispositivos de E/S se comunicam atraves de barramentos. O ciclo de instrucao (busca, decodificacao, execucao) e o coracaoo do processamento.

**Componentes principais:**
- **CPU**: processa instrucoes via ciclo fetch-decode-execute. Possui nucleos (cores), cache L1/L2/L3 e frequencia em GHz
- **RAM**: memoria volatil de acesso rapido. Tipos: DDR4, DDR5. Capacidade afeta multitarefa
- **HD/SSD**: armazenamento persistente. SSD usa memoria flash (muito mais rapido). NVMe e ainda mais veloz que SATA
- **Placa-mae**: interliga todos os componentes via chipset e barramentos (PCIe, SATA, USB)
- **Fonte de alimentacao**: converte corrente alternada (AC) em continua (DC). Wattagem deve suportar todos os componentes

**Manutencao:**
- Preventiva: limpeza de poeira, verificacao de temperatura, atualizacao de drivers e BIOS
- Corretiva: diagnostico de falhas com ferramentas como HWMonitor, CrystalDiskInfo, MemTest86
- Hierarquia de memoria: registradores > cache L1 > cache L2 > cache L3 > RAM > SSD > HD

### Perguntas Intermediarias

1. Qual a diferenca entre cache L1, L2 e L3 e por que essa hierarquia existe?
2. Um computador liga mas nao exibe imagem. Qual sequencia de diagnostico voce seguiria?
3. O que e o Gargalo de Von Neumann e como a cache mitiga esse problema?
4. Qual a diferenca entre SSD SATA e SSD NVMe em termos de protocolo e desempenho?
5. Como voce identificaria se um problema de lentidao e causado por RAM insuficiente ou CPU sobrecarregada?

---

## 2. Introducao a Informatica

### Resumo

A informatica estuda o processamento automatico da informacao. O ciclo fundamental e: Entrada -> Processamento -> Saida -> Armazenamento. Compreender a diferenca entre hardware (fisico) e software (logico) e o ponto de partida para qualquer profissional de TI.

**Conceitos essenciais:**
- **Bit e Byte**: menor unidade de dado (0 ou 1). 8 bits = 1 byte. Escala: KB, MB, GB, TB
- **Tipos de software**: sistema operacional, aplicativos, utilitarios, drivers
- **Tipos de computadores**: desktop, notebook, servidor, embarcado, mainframe
- **Perifericos de entrada**: teclado, mouse, scanner, microfone
- **Perifericos de saida**: monitor, impressora, caixas de som
- **Perifericos de E/S**: touchscreen, HD externo, pendrive

**Sistemas de numeracao:**
- Binario (base 2): usado internamente pelo hardware
- Hexadecimal (base 16): usado em enderecos de memoria e cores
- Decimal (base 10): uso cotidiano humano

### Perguntas Intermediarias

1. Converta o numero decimal 156 para binario e hexadecimal.
2. Qual a diferenca entre software proprietario e software livre? Cite exemplos de cada.
3. O que e firmware e como ele difere de um sistema operacional comum?
4. Explique o conceito de virtualizacao e cite um cenario pratico de uso.
5. Por que servidores usam memoria ECC (Error-Correcting Code)? O que ela corrige?

---

## 3. Logica Matematica Aplicada a Computacao

### Resumo

A logica matematica e a base do raciocinio computacional. Todo programa, circuito e algoritmo e construido sobre operacoes booleanas. Entender logica e essencial para programar, depurar codigo e projetar circuitos digitais.

**Operadores logicos:**
- **AND (E)**: verdadeiro somente se ambas as entradas forem verdadeiras
- **OR (OU)**: verdadeiro se pelo menos uma entrada for verdadeira
- **NOT (NAO)**: inverte o valor logico
- **XOR (OU exclusivo)**: verdadeiro se as entradas forem diferentes
- **NAND / NOR**: negacoes de AND e OR, base de circuitos digitais

**Algoritmos e complexidade:**
- Algoritmo: sequencia finita de passos para resolver um problema
- Notacao Big O: mede eficiencia. O(1) constante, O(n) linear, O(n2) quadratico, O(log n) logaritmico
- Fluxogramas: representacao visual de algoritmos
- Pseudocodigo: descricao de algoritmo em linguagem proxima ao humano

### Perguntas Intermediarias

1. Monte a tabela verdade para a expressao: (A AND B) OR (NOT C)
2. Qual a diferenca entre complexidade O(n) e O(n2)? Quando isso importa na pratica?
3. Explique o que e recursao e cite um exemplo classico de algoritmo recursivo.
4. O que e um algoritmo de busca binaria e qual sua vantagem sobre a busca linear?
5. Como portas logicas NAND podem ser usadas para construir qualquer outra porta logica?

---

## 4. Redes de Computadores

### Resumo

Redes permitem a comunicacao entre dispositivos. O modelo TCP/IP e a base pratica da internet, enquanto o modelo OSI (7 camadas) e o referencial teorico para diagnostico de problemas. Entender redes e indispensavel para qualquer tecnico de suporte.

**Modelos de referencia:**
- **OSI (7 camadas)**: Fisica, Enlace, Rede, Transporte, Sessao, Apresentacao, Aplicacao
- **TCP/IP (4 camadas)**: Interface de Rede, Internet, Transporte, Aplicacao

**Protocolos essenciais:**
- **IP**: endereçamento logico de dispositivos. IPv4 (32 bits) e IPv6 (128 bits)
- **TCP**: orientado a conexao, garante entrega (handshake 3 vias: SYN, SYN-ACK, ACK)
- **UDP**: sem conexao, mais rapido, usado em streaming e jogos
- **DNS**: traduz nomes de dominio em enderecos IP
- **DHCP**: atribui IPs automaticamente aos dispositivos da rede
- **HTTP/HTTPS**: transferencia de paginas web. HTTPS usa criptografia TLS

**Equipamentos:**
- **Switch**: conecta dispositivos na mesma rede local (camada 2)
- **Roteador**: conecta redes diferentes, decide o melhor caminho (camada 3)
- **Access Point**: expande a rede via Wi-Fi
- **Firewall**: filtra trafego por regras de seguranca

**Endereçamento IP:**
- Classes: A (0-127), B (128-191), C (192-223)
- IPs privados: 192.168.x.x, 10.x.x.x, 172.16-31.x.x
- APIPA: 169.254.x.x (indica falha no DHCP)
- Sub-redes (CIDR): /24 = 254 hosts, /16 = 65534 hosts

### Perguntas Intermediarias

1. Um usuario recebeu o IP 169.254.10.5. O que isso indica e como voce resolveria?
2. Qual a diferenca entre TCP e UDP? Cite um protocolo que usa cada um.
3. Explique o processo de resolucao DNS passo a passo quando voce acessa um site.
4. O que e uma VLAN e qual problema ela resolve em redes corporativas?
5. Como o comando traceroute ajuda a diagnosticar problemas de conectividade?

---

## 5. Sistemas Operacionais I

### Resumo

O sistema operacional (SO) e o intermediario entre o hardware e os programas do usuario. Ele gerencia recursos como CPU, memoria, disco e dispositivos, garantindo que multiplos processos coexistam sem conflito.

**Funcoes principais:**
- **Gerenciamento de processos**: escalonamento (Round Robin, SJF, Prioridade), estados (pronto, executando, bloqueado)
- **Gerenciamento de memoria**: memoria virtual, paginacao, segmentacao, swap
- **Sistema de arquivos**: FAT32, NTFS (Windows), ext4 (Linux), APFS (macOS)
- **Gerenciamento de dispositivos**: drivers, plug and play, IRQ
- **Interface**: CLI (linha de comando) e GUI (interface grafica)

**Processo de boot:**
1. BIOS/UEFI inicializa o hardware (POST)
2. Bootloader carrega o kernel (ex: GRUB no Linux)
3. Kernel inicializa drivers e servicos
4. Interface do usuario e carregada

**Windows vs Linux:**
- Windows: interface grafica robusta, ampla compatibilidade de software comercial
- Linux: codigo aberto, estavel para servidores, altamente configuravel via terminal

### Perguntas Intermediarias

1. O que e um deadlock? Como o sistema operacional pode preveni-lo?
2. Explique a diferenca entre processo e thread. Quando usar cada um?
3. O que e memoria virtual e como o mecanismo de swap funciona?
4. Qual a diferenca entre BIOS e UEFI? Quais vantagens o UEFI oferece?
5. Como o escalonador Round Robin distribui o tempo de CPU entre processos?

---

## 6. Softwares Aplicativos

### Resumo

Softwares aplicativos sao programas que executam tarefas especificas para o usuario final. No ambiente corporativo, o dominio dessas ferramentas e diretamente ligado a produtividade e a capacidade de suporte tecnico.

**Categorias principais:**
- **Suites de escritorio**: Microsoft 365 (Word, Excel, PowerPoint, Outlook, Teams), Google Workspace
- **Navegadores**: Chrome, Firefox, Edge. Problemas comuns: cache, extensoes, certificados SSL
- **Sistemas ERP**: SAP, TOTVS. Integram financeiro, RH, estoque em uma unica plataforma
- **Antivirus/EDR**: Windows Defender, CrowdStrike. Protecao contra malware e ransomware
- **Clientes de e-mail**: Outlook, Thunderbird. Configuracao IMAP/POP3/SMTP

**Microsoft 365 no suporte:**
- Gerenciamento de licencas no portal admin.microsoft.com
- Recuperacao de e-mails deletados via Exchange Online (ate 30 dias na lixeira)
- Problemas de sincronizacao do OneDrive: verificar status, reconectar conta
- Teams: problemas de audio/video geralmente sao de driver ou permissao de microfone

### Perguntas Intermediarias

1. Um usuario nao consegue abrir o Outlook e recebe erro de perfil corrompido. Como voce resolveria?
2. Qual a diferenca entre IMAP e POP3 na configuracao de e-mail? Qual recomendar para uso corporativo?
3. Como voce recuperaria um arquivo do OneDrive que foi deletado ha 20 dias?
4. O que e um ERP e por que o suporte tecnico precisa entender minimamente seu funcionamento?
5. Como identificar se uma lentidao no navegador e causada por extensao maliciosa ou problema de rede?

---

## 7. Topicos Especiais: IA e Cloud Computing

### Resumo

A computacao em nuvem e a inteligencia artificial redefiniriam a infraestrutura de TI. O profissional moderno precisa entender os modelos de servico em nuvem e como a IA esta sendo integrada ao suporte tecnico.

**Modelos de servico em nuvem:**
- **IaaS** (Infrastructure as a Service): voce gerencia SO, apps e dados. Ex: AWS EC2, Azure VM
- **PaaS** (Platform as a Service): voce gerencia apenas os dados e aplicacoes. Ex: Azure App Service
- **SaaS** (Software as a Service): voce usa o software pronto. Ex: Microsoft 365, Salesforce

**Modelos de implantacao:**
- Nuvem publica: recursos compartilhados (AWS, Azure, GCP)
- Nuvem privada: infraestrutura dedicada a uma organizacao
- Nuvem hibrida: combinacao de publica e privada

**IA no suporte tecnico:**
- Chatbots e agentes virtuais para triagem de chamados
- Machine Learning para prever falhas de hardware
- Automacao de tarefas repetitivas (reset de senha, provisionamento)
- Analise de logs com IA para detectar anomalias

### Perguntas Intermediarias

1. Qual a diferenca entre IaaS, PaaS e SaaS? Cite um exemplo real de cada.
2. O que e o modelo de responsabilidade compartilhada na nuvem?
3. Como a computacao em nuvem impacta o trabalho do tecnico de suporte local?
4. O que e escalabilidade horizontal vs vertical em ambientes cloud?
5. Cite 3 vantagens e 2 riscos de migrar a infraestrutura de uma empresa para a nuvem.

---

# MODULO II - ORGANIZACAO, ENGENHARIA E GESTAO

## 8. Elementos de Automacao

### Resumo

Automacao industrial e de TI visa substituir ou reduzir a intervencao humana em processos repetitivos, aumentando eficiencia, precisao e seguranca. No contexto de TI, automacao abrange desde scripts simples ate orquestracao de infraestrutura completa.

**Componentes de automacao industrial:**
- **Sensores**: captam variaveis fisicas (temperatura, pressao, presenca, luminosidade)
- **Atuadores**: executam acoes fisicas (motores, valvulas, cilindros pneumaticos)
- **CLP (Controlador Logico Programavel)**: cerebro do sistema, processa logica Ladder
- **SCADA**: supervisao e aquisicao de dados em tempo real
- **IHM (Interface Homem-Maquina)**: painel de controle visual do operador

**Automacao em TI:**
- Scripts PowerShell/Bash para tarefas administrativas
- Ferramentas RPA (Robotic Process Automation): UiPath, Automation Anywhere
- CI/CD: automacao de build, testes e deploy de software
- Provisionamento automatico: Ansible, Terraform, Chef

### Perguntas Intermediarias

1. Qual a diferenca entre um CLP e um microcontrolador como o Arduino?
2. O que e RPA e como ele difere de uma automacao tradicional com scripts?
3. Cite um exemplo pratico de automacao que um tecnico de suporte poderia implementar no dia a dia.
4. O que e um pipeline CI/CD e quais etapas ele tipicamente inclui?
5. Como o Ansible difere do Terraform em termos de proposito e uso?

---

## 9. Engenharia de Software

### Resumo

Engenharia de Software e a disciplina que aplica principios de engenharia ao desenvolvimento de sistemas. Vai alem de escrever codigo: envolve planejamento, arquitetura, qualidade e manutencao ao longo do ciclo de vida do software.

**Ciclo de vida do software (SDLC):**
1. Levantamento de requisitos
2. Analise e design
3. Implementacao (codificacao)
4. Testes (unitario, integracao, sistema, aceitacao)
5. Implantacao (deploy)
6. Manutencao

**Metodologias:**
- **Cascata (Waterfall)**: fases sequenciais, rigido, bom para requisitos fixos
- **Agil**: iterativo e incremental, adaptavel a mudancas. Frameworks: Scrum, Kanban, XP
- **Scrum**: sprints de 1-4 semanas, papeis (Product Owner, Scrum Master, Dev Team), cerimônias (Daily, Review, Retrospectiva)

**Principios SOLID:**
- S: Single Responsibility (uma classe, uma responsabilidade)
- O: Open/Closed (aberto para extensao, fechado para modificacao)
- L: Liskov Substitution (subclasses devem substituir superclasses)
- I: Interface Segregation (interfaces especificas sao melhores que genericas)
- D: Dependency Inversion (dependa de abstracoes, nao de implementacoes)

### Perguntas Intermediarias

1. Qual a principal diferenca entre metodologia Cascata e Agil? Quando usar cada uma?
2. O que e divida tecnica e como ela impacta a manutencao de um sistema?
3. Explique o principio Single Responsibility com um exemplo pratico de codigo.
4. O que e refatoracao de codigo? Ela muda o comportamento do sistema?
5. Qual a diferenca entre testes unitarios e testes de integracao?

---

## 10. Gerencia de Projetos em TI

### Resumo

Gerenciar projetos de TI exige equilibrar o triangulo de restricoes: escopo, prazo e custo. Metodologias ageis e ferramentas de gestao sao essenciais para entregar valor de forma consistente e previsivel.

**Conceitos fundamentais:**
- **Projeto**: esforco temporario para criar um produto ou servico unico
- **Escopo**: o que esta e o que nao esta incluido no projeto
- **Cronograma**: sequencia e duracao das atividades (Diagrama de Gantt)
- **Risco**: evento incerto que pode impactar o projeto (positivo ou negativo)
- **Stakeholder**: qualquer pessoa afetada pelo projeto

**Frameworks ageis:**
- **Scrum**: sprints, backlog, velocity, burndown chart
- **Kanban**: fluxo continuo, colunas (To Do, Doing, Done), WIP limits
- **SAFe**: Scrum em escala para grandes organizacoes

**KPIs de projetos:**
- Velocity: quantidade de trabalho entregue por sprint
- Lead Time: tempo do pedido ate a entrega
- Cycle Time: tempo de inicio ao fim de uma tarefa
- SLA: acordo de nivel de servico com o cliente

### Perguntas Intermediarias

1. O que e o triangulo de restricoes em gerencia de projetos e como ele afeta decisoes?
2. Qual a diferenca entre Scrum e Kanban? Quando cada um e mais adequado?
3. O que e um SLA e como ele e monitorado em um ambiente de suporte tecnico?
4. Como voce priorizaria um backlog com 50 itens de diferentes areas da empresa?
5. O que e um MVP (Minimum Viable Product) e qual sua importancia em projetos ageis?

---

## 11. Introducao a Eletronica

### Resumo

A eletronica e a base fisica do hardware. Entender circuitos, componentes e sinais eletricos permite ao tecnico diagnosticar falhas em nivel mais profundo, alem de compreender como o hardware processa informacao em nivel de silicio.

**Conceitos basicos:**
- **Tensao (V)**: diferenca de potencial eletrico (Volts)
- **Corrente (I)**: fluxo de eletrons (Amperes)
- **Resistencia (R)**: oposicao ao fluxo (Ohms). Lei de Ohm: V = R x I
- **Potencia (P)**: energia consumida por segundo (Watts). P = V x I

**Componentes essenciais:**
- **Resistor**: limita corrente
- **Capacitor**: armazena carga eletrica, filtra ruidos
- **Diodo**: permite corrente em apenas uma direcao
- **Transistor**: amplifica ou chaveamento de sinais, base dos chips
- **Circuito Integrado (CI)**: milhoes de transistores em um chip

**Eletronica digital:**
- Opera com dois estados: 0 (baixo) e 1 (alto)
- Portas logicas: AND, OR, NOT, NAND, NOR, XOR
- Flip-flops: armazenam 1 bit de informacao

### Perguntas Intermediarias

1. Usando a Lei de Ohm, calcule a corrente em um circuito com 12V e resistencia de 4 ohms.
2. Qual a funcao de um capacitor em uma fonte de alimentacao de computador?
3. Por que transistores sao a base dos processadores modernos?
4. Qual a diferenca entre eletronica analogica e digital?
5. O que e um curto-circuito e quais danos ele pode causar a um computador?

---

## 12. Planejamento Estrategico e Empreendedorismo

### Resumo

O profissional de TI moderno precisa alinhar tecnologia a estrategia de negocios. Entender modelos de negocio, analise de mercado e metodologias de inovacao e diferencial competitivo no mercado de trabalho.

**Ferramentas estrategicas:**
- **Analise SWOT**: Forcas, Fraquezas, Oportunidades e Ameacas
- **Business Model Canvas**: 9 blocos que descrevem um modelo de negocio
- **OKR**: Objectives and Key Results, metodologia de metas usada por Google e startups
- **Lean Startup**: validar hipoteses rapidamente com MVP antes de grandes investimentos

**Empreendedorismo em TI:**
- Identificar problemas reais que tecnologia pode resolver
- Prototipagem rapida e validacao com usuarios reais
- Pitch: apresentacao concisa do negocio para investidores
- Bootstrapping vs investimento externo (anjo, venture capital)

### Perguntas Intermediarias

1. Como voce aplicaria uma analise SWOT para avaliar a infraestrutura de TI de uma empresa?
2. O que e um MVP e como ele reduz o risco em projetos de tecnologia?
3. Qual a diferenca entre OKR e KPI? Como eles se complementam?
4. Explique o conceito de Product-Market Fit e sua importancia para startups de tecnologia.
5. Como a metodologia Lean pode ser aplicada na gestao de um departamento de TI?

---

## 13. Seguranca do Trabalho

### Resumo

A seguranca do trabalho em TI envolve tanto a protecao fisica do trabalhador quanto a ergonomia e saude ocupacional. Normas regulamentadoras (NRs) estabelecem os requisitos minimos que empresas devem cumprir.

**Normas relevantes para TI:**
- **NR-17 (Ergonomia)**: regula postura, iluminacao, mobiliario e organizacao do trabalho
- **NR-10 (Eletricidade)**: seguranca em instalacoes eletricas, obrigatoria para quem trabalha com hardware
- **NR-6 (EPI)**: equipamentos de protecao individual obrigatorios

**Riscos ocupacionais em TI:**
- LER/DORT: lesoes por esforco repetitivo (digitacao excessiva, mouse)
- Fadiga visual: exposicao prolongada a telas
- Estresse e burnout: alta demanda, prazos, suporte sob pressao
- Riscos eletricos: manuseio de hardware sem desligar a fonte

**Boas praticas:**
- Pausas regulares (regra 20-20-20 para os olhos)
- Postura correta: monitor na altura dos olhos, cotovelos a 90 graus
- Pulseira antiestatica ao manusear componentes internos
- Desligar e desconectar equipamentos antes de abrir gabinetes

### Perguntas Intermediarias

1. Quais os principais riscos ergonomicos para um tecnico de suporte que trabalha 8h/dia no computador?
2. Por que usar pulseira antiestatica ao manusear componentes internos de um computador?
3. O que e a NR-17 e quais parametros ela define para o posto de trabalho informatizado?
4. Como identificar sinais precoces de burnout em uma equipe de suporte tecnico?
5. Quais cuidados de seguranca sao necessarios ao trabalhar com no-breaks e fontes de alimentacao?

---

## 14. Sistemas Operacionais II - Administracao Avancada

### Resumo

A administracao profissional de sistemas operacionais envolve gerenciar servidores, usuarios, permissoes e politicas de seguranca em ambientes corporativos. Dominar Windows Server e Linux e essencial para suporte de nivel 2 e 3.

**Windows Server / Active Directory:**
- **Active Directory (AD)**: servico de diretorio que centraliza autenticacao e autorizacao
- **Dominio**: conjunto de computadores gerenciados pelo AD
- **GPO (Group Policy Object)**: politicas aplicadas a usuarios e computadores do dominio
- **OU (Organizational Unit)**: unidade organizacional para agrupar objetos no AD
- **Kerberos**: protocolo de autenticacao usado pelo AD
- **LDAP**: protocolo para consultar e modificar o diretorio

**Azure AD / Microsoft Entra ID:**
- Versao cloud do Active Directory
- Usa OAuth 2.0 e SAML para autenticacao
- SSPR (Self-Service Password Reset): usuario redefine senha sem chamar o suporte
- MFA: autenticacao multifator obrigatoria para acesso seguro

**Linux - Administracao:**
- Gerenciamento de usuarios: useradd, usermod, userdel, passwd
- Permissoes: chmod (rwx), chown (proprietario), grupos
- Servicos: systemctl start/stop/enable/status
- Logs: journalctl, /var/log/syslog, /var/log/auth.log

### Perguntas Intermediarias

1. O que e uma GPO e como ela pode ser usada para aumentar a seguranca de estacoes de trabalho?
2. Qual a diferenca entre Active Directory local e Azure Active Directory?
3. Como voce criaria um usuario no Linux e definiria suas permissoes de acesso a uma pasta?
4. O que e o protocolo Kerberos e como ele funciona na autenticacao do AD?
5. Como o comando journalctl pode ajudar a diagnosticar uma falha de servico no Linux?

---

# MODULO III - PRATICA, DESENVOLVIMENTO E PROJETOS

## 15. PHP e Desenvolvimento Backend

### Resumo

PHP e uma linguagem server-side amplamente usada para desenvolvimento web dinamico. Com PHP 8.x e frameworks como Laravel, e possivel construir sistemas robustos e escaláveis.

**Fundamentos do PHP:**
- Variaveis: tipagem dinamica, prefixo cifrão. Ex: nome = Ricardo
- Tipos: string, int, float, bool, array, null, object
- Estruturas: if/else, switch, for, foreach, while
- Orientacao a objetos: classes, heranca, interfaces, traits

**PHP 8.x - novidades:**
- JIT Compiler: melhora de performance
- Named Arguments: passar argumentos por nome
- Match expression: alternativa mais segura ao switch
- Nullsafe operator: evita erros com null
- Tipos de uniao: int ou string no mesmo parametro

**Laravel:**
- MVC: Model (Eloquent ORM), View (Blade), Controller
- Rotas: web.php e api.php
- Migrations: versionamento do banco de dados
- Artisan: CLI do Laravel
- Middleware: filtros de requisicao (autenticacao, CORS)

### Perguntas Intermediarias

1. Qual a diferenca entre include e require no PHP? Quando usar cada um?
2. O que e o Eloquent ORM e como ele simplifica operacoes com banco de dados?
3. Explique o padrao MVC e como o Laravel o implementa.
4. O que sao migrations no Laravel e por que sao importantes para trabalho em equipe?
5. Como voce protegeria uma aplicacao PHP contra SQL Injection?

---

## 16. Design UX e Figma

### Resumo

UX (User Experience) garante que produtos digitais sejam intuitivos e acessiveis. O Figma e a ferramenta lider para design de interfaces e prototipagem colaborativa.

**Principios de UX:**
- 10 Heuristicas de Nielsen: visibilidade do status, controle do usuario, consistencia, prevencao de erros
- Hierarquia visual: guiar o olhar do usuario pelo layout
- Acessibilidade WCAG: contraste, tamanho de fonte, navegacao por teclado
- Design responsivo: adaptar layout para diferentes tamanhos de tela

**Processo de design:**
1. Pesquisa com usuarios (entrevistas, surveys)
2. Personas: representacoes ficticias dos usuarios reais
3. Wireframe: esboço estrutural sem design visual
4. Prototipo de alta fidelidade: design final interativo no Figma
5. Teste de usabilidade: validar com usuarios reais

**Figma - recursos:**
- Componentes reutilizaveis e variantes
- Auto Layout: responsividade automatica
- Prototipagem com transicoes e interacoes
- Colaboracao em tempo real

### Perguntas Intermediarias

1. O que e a heuristica de Nielsen visibilidade do status do sistema? Cite um exemplo.
2. Qual a diferenca entre UX e UI? Como elas se complementam?
3. O que e um wireframe e por que ele e criado antes do design final?
4. Como voce avaliaria a acessibilidade de uma interface digital?
5. O que e Design System e quais beneficios ele traz para equipes de desenvolvimento?

---

## 17. Banco de Dados

### Resumo

Banco de dados e o sistema responsavel por armazenar, organizar e recuperar informacoes de forma eficiente e segura. O dominio de SQL e modelagem de dados e essencial para qualquer desenvolvedor ou tecnico de sistemas.

**Banco de dados relacional (SQL):**
- Tabelas com linhas (registros) e colunas (atributos)
- Chave primaria (PK): identifica unicamente cada registro
- Chave estrangeira (FK): cria relacionamento entre tabelas
- Comandos DDL: CREATE, ALTER, DROP (estrutura)
- Comandos DML: SELECT, INSERT, UPDATE, DELETE (dados)
- JOINs: INNER, LEFT, RIGHT, FULL OUTER

**Normalizacao:**
- 1FN: eliminar grupos repetitivos, garantir chave primaria
- 2FN: eliminar dependencias parciais em chaves compostas
- 3FN: eliminar dependencias transitivas
- BCNF: resolver sobreposicao de chaves candidatas

**Propriedades ACID:**
- Atomicidade: tudo ou nada na transacao
- Consistencia: dados sempre em estado valido
- Isolamento: transacoes nao interferem entre si
- Durabilidade: dados persistem apos commit

**NoSQL:**
- Documento: MongoDB (JSON-like)
- Chave-valor: Redis (cache, sessoes)
- Coluna: Cassandra (big data)
- Grafo: Neo4j (redes sociais, recomendacoes)

### Perguntas Intermediarias

1. Escreva uma query SQL que retorne os 5 clientes com maior valor total de pedidos.
2. Qual a diferenca entre INNER JOIN e LEFT JOIN? Quando usar cada um?
3. O que e normalizacao de banco de dados e por que ela e importante?
4. Quando voce escolheria um banco NoSQL em vez de um banco relacional?
5. O que e um indice em banco de dados e como ele melhora a performance de consultas?

---

## 18. Programacao Web

### Resumo

Desenvolvimento web envolve a criacao de aplicacoes acessiveis via navegador. O frontend cuida da interface visual, o backend processa a logica de negocios, e as APIs conectam os dois lados.

**Frontend:**
- HTML: estrutura do conteudo (semantica: header, main, section, article)
- CSS: estilizacao (Flexbox, Grid, responsividade, variaveis CSS)
- JavaScript: interatividade (DOM, eventos, fetch API, async/await)
- Frameworks: React, Vue, Angular

**Backend:**
- Servidor HTTP: processa requisicoes e retorna respostas
- APIs RESTful: metodos HTTP (GET, POST, PUT, DELETE), status codes
- Autenticacao: JWT (JSON Web Token), OAuth2, sessoes
- Linguagens: PHP, Node.js, Python, Java

**APIs RESTful:**
- GET: buscar dados
- POST: criar recurso
- PUT/PATCH: atualizar recurso
- DELETE: remover recurso
- Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error

**Seguranca web:**
- HTTPS: criptografia TLS para proteger dados em transito
- CORS: controle de acesso entre origens diferentes
- XSS: Cross-Site Scripting, injecao de scripts maliciosos
- CSRF: Cross-Site Request Forgery, requisicoes forjadas

### Perguntas Intermediarias

1. Qual a diferenca entre autenticacao e autorizacao? Como o JWT implementa cada uma?
2. O que e CORS e por que ele existe? Como configurar corretamente?
3. Explique o que acontece desde o momento que voce digita uma URL ate a pagina aparecer.
4. Qual a diferenca entre renderizacao SSR (Server-Side) e CSR (Client-Side)?
5. Como voce protegeria uma API REST contra acesso nao autorizado?

---

## 19. Projeto Integrador

### Resumo

O Projeto Integrador e a culminancia do curso, exigindo a aplicacao pratica de todos os conhecimentos adquiridos. Simula um cenario real de mercado, desde o levantamento de requisitos ate a entrega do produto final.

**Etapas do projeto:**
1. Definicao do problema e escopo
2. Levantamento de requisitos funcionais e nao-funcionais
3. Modelagem do banco de dados (DER, modelo relacional)
4. Design de interface no Figma (wireframe e prototipo)
5. Desenvolvimento backend (PHP/Laravel ou outra stack)
6. Desenvolvimento frontend (HTML, CSS, JS)
7. Testes e correcao de bugs
8. Deploy e apresentacao

**Documentacao obrigatoria:**
- Documento de requisitos (ERS)
- Diagrama de casos de uso
- Diagrama Entidade-Relacionamento (DER)
- Manual do usuario

### Perguntas Intermediarias

1. Como voce levantaria os requisitos de um sistema para uma empresa que nunca teve software proprio?
2. Qual a diferenca entre requisito funcional e nao-funcional? Cite exemplos de cada.
3. Como voce organizaria o trabalho em equipe no projeto usando metodologia agil?
4. O que e um Diagrama de Casos de Uso e qual sua utilidade no projeto?
5. Como voce faria o deploy de uma aplicacao PHP em um servidor Linux?

---

# SUPORTE TECNICO PROFISSIONAL

## 20. Estrutura do Suporte de TI (Help Desk / Service Desk)

### Resumo

O suporte tecnico e estruturado em niveis para otimizar o atendimento. Cada nivel tem escopo definido, e o objetivo e resolver o maior numero de chamados no menor nivel possivel (First Call Resolution).

**Niveis de suporte:**
- **Nivel 0**: autoatendimento (FAQs, base de conhecimento, chatbots)
- **Nivel 1 (Help Desk)**: triagem, problemas simples, reset de senha, configuracoes basicas
- **Nivel 2 (Service Desk)**: problemas tecnicos mais complexos, configuracao de sistemas
- **Nivel 3**: especialistas, engenheiros de infraestrutura, desenvolvimento
- **Nivel 4**: fornecedores externos (Microsoft, fabricantes de hardware)

**Atribuicoes do tecnico Nivel 1:**
- Reset de senhas e desbloqueio de contas no AD
- Configuracao de MFA e SSPR
- Suporte a Office 365 (Outlook, Teams, OneDrive)
- Mapeamento de impressoras e unidades de rede
- Instalacao de softwares basicos
- Abertura e documentacao de chamados no sistema ITSM

**KPIs de suporte:**
- MTTR (Mean Time to Resolve): tempo medio de resolucao
- FCR (First Call Resolution): resolucao no primeiro contato
- SLA: acordo de nivel de servico (ex: responder em 1h, resolver em 4h)
- NPS: Net Promoter Score, satisfacao do usuario

### Perguntas Intermediarias

1. Qual a diferenca entre Help Desk e Service Desk?
2. Um chamado de nivel 1 nao foi resolvido em 2h e o SLA e de 4h. O que voce faz?
3. Como voce documentaria um chamado de forma que o nivel 2 nao precise refazer perguntas?
4. O que e FCR e por que e uma metrica tao importante para o suporte?
5. Como voce lidaria com um usuario que insiste que o problema e urgente mas nao e critico?

---

## 21. ITIL 4 - Gestao de Servicos de TI

### Resumo

ITIL 4 e o framework mais adotado mundialmente para gestao de servicos de TI. Ele fornece um conjunto de praticas para alinhar TI aos objetivos de negocio, garantindo qualidade e eficiencia na entrega de servicos.

**Conceitos fundamentais:**
- **Servico**: meio de entregar valor ao cliente sem que ele gerencie custos e riscos especificos
- **Incidente**: interrupcao nao planejada de um servico (ex: servidor fora do ar)
- **Problema**: causa raiz de um ou mais incidentes
- **Mudanca**: adicao, modificacao ou remocao de qualquer item de configuracao
- **Requisicao de Servico**: pedido formal de algo previsto (ex: novo notebook)

**Gerenciamento de Incidentes vs Problemas:**
- Incidente: reativo, restaurar o servico o mais rapido possivel
- Problema: proativo, encontrar e eliminar a causa raiz
- Workaround: solucao temporaria para um incidente enquanto o problema e investigado
- Known Error: problema com causa raiz identificada mas ainda sem solucao definitiva

**4 Dimensoes do ITIL 4:**
1. Organizacoes e Pessoas
2. Informacao e Tecnologia
3. Parceiros e Fornecedores
4. Fluxos de Valor e Processos

### Perguntas Intermediarias

1. Qual a diferenca entre Gerenciamento de Incidentes e Gerenciamento de Problemas no ITIL?
2. O que e um workaround e quando ele deve ser usado?
3. Como o ITIL define um SLA e quais elementos ele deve conter?
4. O que e uma CMDB (Configuration Management Database) e qual sua importancia?
5. Explique o conceito de Melhoria Continua de Servico (CSI) no ITIL.

---

## 22. Linux para Suporte Tecnico

### Resumo

Linux e o sistema operacional dominante em servidores, nuvem e containers. O dominio da linha de comando Linux e indispensavel para qualquer tecnico que aspira ao nivel 2 ou superior.

**Comandos essenciais - Arquivos:**
- ls -la: listar arquivos com permissoes e detalhes
- pwd: mostrar diretorio atual
- cd: navegar entre diretorios
- cp, mv, rm: copiar, mover, remover arquivos
- cat, less, tail -f: visualizar conteudo de arquivos
- grep: buscar padroes em arquivos
- find: localizar arquivos por nome ou atributo
- chmod, chown: alterar permissoes e proprietario

**Comandos - Processos e Recursos:**
- top / htop: monitorar CPU e RAM em tempo real
- ps aux: listar todos os processos
- kill -9 PID: forcar encerramento de processo
- free -h: verificar uso de memoria RAM e swap
- df -h: verificar uso de disco por particao
- du -sh pasta: verificar tamanho de uma pasta

**Comandos - Rede:**
- ping: testar conectividade
- traceroute: mapear rota de pacotes
- ip a: ver enderecos IP das interfaces
- netstat -tulnp / ss -tulnp: ver portas abertas
- curl -I: testar resposta HTTP de um servidor
- nslookup / dig: consultar DNS

**Systemd e Logs:**
- systemctl start/stop/restart/status servico
- systemctl enable/disable: iniciar automaticamente no boot
- journalctl -xe: ver logs detalhados do sistema
- tail -f /var/log/syslog: monitorar log em tempo real

### Perguntas Intermediarias

1. Como voce verificaria qual processo esta consumindo mais CPU em um servidor Linux?
2. Um servico web nao inicia apos reinicializacao. Qual sequencia de comandos voce usaria para diagnosticar?
3. Como voce encontraria todos os arquivos maiores que 1GB em um servidor Linux?
4. Explique o sistema de permissoes do Linux (rwx) e como o chmod funciona.
5. Como voce monitoraria em tempo real os logs de um servico especifico no Linux?

---

## 23. Troubleshooting - Resolucao de Problemas

### Resumo

Troubleshooting e a habilidade mais valorizada em entrevistas de suporte. O recrutador nao busca a resposta certa imediata, mas sim o raciocinio logico em camadas, do simples para o complexo.

**Metodologia de diagnostico:**
1. Identificar e descrever o problema claramente
2. Coletar informacoes (quando comecou, o que mudou, quem e afetado)
3. Isolar o escopo (so este usuario? so este computador? toda a rede?)
4. Formular hipoteses (do mais simples ao mais complexo)
5. Testar hipoteses sistematicamente
6. Aplicar solucao e verificar
7. Documentar o caso

**Cenario classico: Internet nao funciona**
1. Verificar se e so este computador ou varios (escopo)
2. Checar cabo de rede e luzes do switch (camada fisica)
3. Executar ipconfig - verificar se tem IP valido (DHCP)
4. Ping no gateway (roteador interno)
5. Ping em IP externo (8.8.8.8) - testa saida da rede
6. Ping em nome de dominio (google.com) - testa DNS
7. Se tudo ok localmente, escalar para infraestrutura

**Cenario: Computador lento**
1. Verificar uso de CPU e RAM (Gerenciador de Tarefas / top)
2. Verificar processos suspeitos (malware, mineradores)
3. Verificar espaco em disco (disco cheio causa lentidao)
4. Verificar temperatura (superaquecimento throttling)
5. Verificar inicializacao (programas desnecessarios no boot)
6. Verificar saude do HD/SSD (CrystalDiskInfo)

**Cenario: Usuario nao consegue fazer login**
1. Verificar se a conta esta bloqueada no AD
2. Verificar se a senha expirou
3. Verificar se o computador esta no dominio
4. Verificar conectividade com o controlador de dominio
5. Verificar logs de autenticacao no Event Viewer

### Perguntas Intermediarias

1. Um usuario diz que o email nao esta chegando. Descreva seu processo de diagnostico passo a passo.
2. Como voce diferenciaria um problema de hardware de um problema de software em um computador que nao liga?
3. Um servidor web retorna erro 502 Bad Gateway. O que isso indica e como voce investigaria?
4. Como voce diagnosticaria um problema de impressora de rede que funciona para alguns usuarios mas nao para outros?
5. Qual a importancia de documentar cada passo do troubleshooting mesmo quando o problema nao foi resolvido?

---

## 24. Seguranca da Informacao

### Resumo

Seguranca da informacao protege dados e sistemas contra ameacas internas e externas. O tecnico de suporte e a primeira linha de defesa e precisa reconhecer ameacas e aplicar boas praticas.

**Tríade CIA:**
- Confidencialidade: apenas pessoas autorizadas acessam os dados
- Integridade: dados nao sao alterados sem autorizacao
- Disponibilidade: sistemas acessiveis quando necessario

**Principais ameacas:**
- Phishing: e-mails falsos para roubar credenciais
- Ransomware: criptografa arquivos e exige resgate
- Malware: software malicioso (virus, trojan, spyware)
- Engenharia social: manipulacao psicologica para obter acesso
- Brute Force: tentativas automaticas de adivinhar senhas

**Boas praticas:**
- Principio do menor privilegio: dar apenas o acesso necessario
- MFA: autenticacao multifator em todas as contas criticas
- Backup 3-2-1: 3 copias, 2 midias diferentes, 1 offsite
- Patch management: manter sistemas atualizados
- Politica de senhas: minimo 12 caracteres, complexidade, rotacao

### Perguntas Intermediarias

1. O que e o principio do menor privilegio e como ele reduz riscos de seguranca?
2. Um usuario recebeu um e-mail suspeito e clicou no link. Quais sao os primeiros passos?
3. Explique a estrategia de backup 3-2-1 e por que ela e eficaz contra ransomware.
4. Qual a diferenca entre autenticacao e autorizacao em sistemas de seguranca?
5. O que e um ataque de engenharia social e como treinar usuarios para reconhece-lo?

---

## 25. Entrevistas de Emprego em TI

### Resumo

Entrevistas para suporte tecnico avaliam tanto conhecimento tecnico quanto habilidades comportamentais. Gestores priorizam adaptabilidade, comunicacao e atitude sobre conhecimento tecnico puro.

**Metodo STAR para respostas comportamentais:**
- S (Situacao): contexto do ocorrido
- T (Tarefa): qual era sua responsabilidade
- A (Acao): o que voce fez especificamente
- R (Resultado): qual foi o resultado mensuravel

**Perguntas comportamentais classicas:**
- Como voce lida com usuario irritado? (empatia, escuta ativa, foco na solucao)
- Explique a nuvem para uma crianca. (capacidade de simplificar conceitos tecnicos)
- Ja discordou de um gestor? Como resolveu? (maturidade, dados vs opiniao)
- Qual habilidade e mais importante no suporte? (atendimento ao cliente + pesquisa)

**Perguntas tecnicas frequentes:**
- O que e DNS e como funciona?
- Diferenca entre TCP e UDP?
- Como resetar senha no Active Directory?
- O que fazer quando o usuario recebe IP 169.254.x.x?
- Como verificar portas abertas em um servidor?

**Dicas para a entrevista:**
- Pesquise a empresa antes (produtos, tecnologias usadas, cultura)
- Demonstre curiosidade e vontade de aprender
- Seja honesto sobre o que nao sabe, mas mostre como buscaria a solucao
- Tenha exemplos reais de problemas que voce resolveu
- Pergunte sobre a stack tecnologica e o processo de onboarding

### Perguntas Intermediarias

1. Use o metodo STAR para responder: Conte sobre uma vez que voce resolveu um problema tecnico dificil.
2. Como voce explicaria o que e um servidor DNS para um usuario sem conhecimento tecnico?
3. Quais certificacoes de TI sao mais valorizadas para suporte tecnico no mercado atual?
4. Como voce se manteria atualizado com as novas tecnologias apos ser contratado?
5. O que voce faria no primeiro dia de trabalho como tecnico de suporte em uma empresa nova?

---

# RESUMO GERAL

## Visao por Modulo

**Modulo I - Fundamentos:**
- Hardware: CPU, RAM, SSD, placa-mae, hierarquia de memoria
- Redes: TCP/IP, OSI, DNS, DHCP, IP, switch, roteador
- SO: processos, memoria virtual, boot, Windows vs Linux
- Cloud: IaaS, PaaS, SaaS, responsabilidade compartilhada

**Modulo II - Organizacao:**
- Automacao: CLP, SCADA, RPA, CI/CD
- Engenharia de Software: SDLC, Agil, Scrum, SOLID
- Gerencia de Projetos: escopo, prazo, custo, KPIs
- SO II: Active Directory, GPO, Azure AD, Linux admin

**Modulo III - Pratica:**
- PHP/Laravel: MVC, Eloquent, migrations, seguranca
- UX/Figma: heuristicas, wireframe, prototipo, acessibilidade
- Banco de Dados: SQL, normalizacao, ACID, NoSQL
- Web: HTML/CSS/JS, APIs REST, JWT, seguranca web

**Pratica Profissional:**
- Suporte N1/N2/N3: triagem, escalada, documentacao
- ITIL 4: incidente vs problema, SLA, CMDB
- Linux CLI: arquivos, processos, rede, systemd
- Troubleshooting: metodologia em camadas, cenarios reais
- Seguranca: CIA, ameacas, MFA, backup 3-2-1
- Entrevistas: STAR, perguntas tecnicas, dicas

---

*Documento gerado para uso como base de conhecimento do agente de IA de mentoria em TI.*
