(async () => {
  'use strict';

  const chapters = JSON.parse(document.getElementById('course-data').textContent);
  const byId = new Map(chapters.map(chapter => [chapter.id, chapter]));
  const indexById = new Map(chapters.map((chapter, index) => [chapter.id, index]));
  const stateKey = 'stack-completa:single:v1';
  const databaseName = 'stack-completa-java';
  const databaseVersion = 1;
  const stateStore = 'course-state';
  const stateRecordKey = 'current';
  let database = null;
  let storageBackend = 'inicializando';
  let storageWriteQueue = Promise.resolve();
  let migratedFromLocalStorage = false;
  let isResettingData = false;
  const todayKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const addDays = (dateKey, amount) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + amount);
    return todayKey(date);
  };

  const glossaryTerms = [
    ['JDK', 'Kit de desenvolvimento que reúne compilador, ferramentas e runtime necessários para criar aplicações Java.', 'intro', ['Java Development Kit']],
    ['JRE', 'Ambiente necessário para executar aplicações Java: JVM mais bibliotecas de runtime.', 'intro', ['Java Runtime Environment']],
    ['JVM', 'Máquina virtual que carrega e executa bytecode Java, gerenciando memória, threads e otimizações em runtime.', 'intro', ['Java Virtual Machine']],
    ['Bytecode', 'Representação intermediária gerada pelo compilador Java e executada pela JVM, normalmente armazenada em arquivos .class.', 'primeiro-programa'],
    ['Terminal', 'Interface textual que exibe a saída de um processo e encaminha a ele comandos e dados digitados.', 'entrada-console'],
    ['CLI', 'Interface de linha de comando: interação por texto, argumentos e comandos em vez de controles gráficos.', 'entrada-console', ['Command-line interface', 'interface de linha de comando']],
    ['Entrada padrão', 'Canal de entrada do processo representado em Java por System.in; no terminal, normalmente recebe o que a pessoa digita.', 'entrada-console', ['standard input', 'stdin', 'System.in']],
    ['Scanner', 'Classe da biblioteca Java que divide uma entrada em linhas ou tokens e converte representações textuais.', 'entrada-console'],
    ['Buffer', 'Área temporária que mantém dados recebidos ou preparados até que sejam consumidos ou enviados.', 'entrada-console'],
    ['Parsing', 'Conversão de uma representação textual segundo uma sintaxe para um valor estruturado ou tipado.', 'entrada-console', ['parse']],
    ['EOF', 'Fim da entrada: sinal de que não existe outra linha ou byte disponível para leitura.', 'entrada-console', ['end of file', 'fim de arquivo']],
    ['BigDecimal', 'Tipo Java para números decimais com precisão e escala controladas, indicado quando arredondamento exato importa.', 'entrada-console'],
    ['Locale', 'Conjunto de convenções regionais de idioma, números, moeda, datas e ordenação.', 'entrada-console'],
    ['Socket', 'Extremidade de comunicação entre processos que transporta bytes, normalmente através de uma rede.', 'entrada-console', ['sockets']],
    ['Protocolo', 'Acordo que define formato, ordem, significado, erros e encerramento das mensagens trocadas.', 'entrada-console', ['protocolos']],
    ['JIT', 'Compilador Just-In-Time que transforma trechos frequentes de bytecode em código de máquina durante a execução.', 'jvm-profundo', ['Just-In-Time']],
    ['Garbage Collector', 'Componente da JVM que identifica objetos sem referências alcançáveis e recupera sua memória automaticamente.', 'jvm-profundo', ['GC', 'coletor de lixo']],
    ['Stack', 'Região associada a cada thread que armazena frames de métodos, parâmetros e variáveis locais.', 'jvm-profundo', ['pilha']],
    ['Heap', 'Região compartilhada da memória onde objetos e arrays são normalmente alocados.', 'jvm-profundo'],
    ['Classe', 'Definição de estrutura e comportamento usada para criar objetos.', 'classes', ['class']],
    ['Objeto', 'Instância concreta de uma classe, com identidade, estado e comportamento próprios.', 'classes'],
    ['Encapsulamento', 'Proteção do estado interno de um objeto por meio de uma interface controlada de operações.', 'encapsulamento'],
    ['Herança', 'Mecanismo pelo qual uma classe especializa outra e reutiliza membros compatíveis.', 'heranca'],
    ['Polimorfismo', 'Capacidade de tratar implementações diferentes por um contrato comum, com o comportamento decidido em runtime.', 'polimorfismo'],
    ['Abstração', 'Modelagem que destaca características essenciais e esconde detalhes desnecessários para quem usa o componente.', 'abstracao'],
    ['Interface', 'Contrato de tipos que declara comportamentos sem exigir uma implementação concreta única.', 'interfaces'],
    ['Exceção', 'Objeto que representa uma condição anormal e altera o fluxo normal de execução.', 'excecoes', ['exception']],
    ['Collection', 'Família de interfaces e implementações para armazenar e manipular grupos de objetos.', 'colecoes', ['Collections', 'coleção']],
    ['Generics', 'Sistema de parametrização de tipos que aumenta reutilização e segurança em tempo de compilação.', 'generics', ['genéricos']],
    ['Lambda', 'Expressão compacta que fornece a implementação de uma interface funcional.', 'streams', ['lambdas']],
    ['Stream', 'Pipeline declarativo para processar sequências de elementos sem representar uma coleção de armazenamento.', 'streams', ['streams']],
    ['Optional', 'Contêiner que expressa explicitamente a presença ou ausência de um valor de retorno.', 'javamoderno'],
    ['Record', 'Tipo Java compacto voltado a carregar um conjunto fixo de dados, com acessores, igualdade, hash e representação gerados.', 'java-21-profundo', ['records']],
    ['Sealed type', 'Classe ou interface Java que restringe explicitamente quais tipos podem estendê-la ou implementá-la.', 'java-21-profundo', ['sealed', 'tipo selado']],
    ['Virtual thread', 'Thread leve gerenciada pela JVM, adequada a grandes quantidades de tarefas que passam tempo bloqueadas em entrada e saída.', 'java-21-profundo', ['virtual threads', 'thread virtual', 'threads virtuais']],
    ['Big O', 'Notação que descreve como o custo de um algoritmo cresce conforme aumenta o tamanho da entrada.', 'big-o', ['complexidade assintótica']],
    ['Recursão', 'Técnica em que uma função resolve o problema chamando a si mesma sobre uma entrada menor, até alcançar um caso-base.', 'recursao'],
    ['Git', 'Sistema distribuído de controle de versão que registra a evolução do código e permite trabalho paralelo.', 'git'],
    ['Commit', 'Registro imutável de um conjunto coerente de alterações no histórico do Git.', 'git'],
    ['Maven', 'Ferramenta de build e gestão de dependências baseada em convenções e no arquivo pom.xml.', 'build'],
    ['Gradle', 'Ferramenta de automação de build que usa uma DSL para configurar tarefas e dependências.', 'build'],
    ['Reflection', 'API que permite inspecionar e manipular tipos, membros e anotações em tempo de execução.', 'anotacoes', ['reflexão']],
    ['JSON', 'Formato textual de troca de dados baseado em objetos, arrays e valores simples.', 'json'],
    ['Logging', 'Registro estruturado de eventos da aplicação para diagnóstico, auditoria e observabilidade.', 'logging', ['logs']],
    ['SOLID', 'Conjunto de cinco princípios de design orientado a objetos voltados a coesão, extensão e baixo acoplamento.', 'solid'],
    ['Injeção de dependência', 'Técnica em que um objeto recebe as colaborações de que precisa em vez de construí-las internamente.', 'di', ['DI', 'dependency injection']],
    ['IoC', 'Inversão de Controle: o fluxo de criação e coordenação de componentes é transferido para um contêiner ou framework.', 'spring-core', ['inversão de controle']],
    ['HTTP', 'Protocolo de requisição e resposta usado na comunicação entre clientes e servidores web.', 'http'],
    ['REST', 'Estilo arquitetural que modela recursos e usa as semânticas do HTTP para manipulá-los.', 'http'],
    ['Endpoint', 'Combinação de endereço e operação exposta por uma API para atender determinada interação.', 'http'],
    ['Status HTTP', 'Código numérico que comunica o resultado de uma requisição, como 200, 404 ou 409.', 'http', ['status code']],
    ['SQL', 'Linguagem declarativa usada para definir, consultar e modificar dados relacionais.', 'sql'],
    ['Transação', 'Unidade lógica de trabalho que deve ser confirmada integralmente ou revertida.', 'sql', ['transaction']],
    ['ACID', 'Propriedades de atomicidade, consistência, isolamento e durabilidade esperadas de transações confiáveis.', 'sql'],
    ['Índice', 'Estrutura auxiliar que acelera buscas no banco ao custo de espaço e manutenção nas escritas.', 'postgres', ['index']],
    ['MVCC', 'Controle de concorrência por múltiplas versões: mantém versões de linhas para oferecer snapshots e reduzir bloqueio entre leituras e escritas.', 'postgres-concorrencia', ['Multi-Version Concurrency Control']],
    ['Migration', 'Alteração versionada e reproduzível aplicada ao schema do banco de dados.', 'migrations', ['migrations', 'migração']],
    ['JDBC', 'API padrão do Java para abrir conexões, enviar SQL e processar resultados de bancos relacionais.', 'jdbc'],
    ['Bean', 'Objeto cujo ciclo de vida e dependências são gerenciados pelo contêiner Spring.', 'spring-core', ['beans']],
    ['Spring MVC', 'Módulo web do Spring que organiza requisições HTTP, controllers, conversão de dados e respostas.', 'spring-mvc'],
    ['JPA', 'Especificação Java de mapeamento objeto-relacional; implementações como Hibernate executam o trabalho concreto.', 'spring-jpa', ['Java Persistence API']],
    ['Entity', 'Classe persistente mapeada para dados relacionais e identificada no contexto do JPA.', 'spring-jpa', ['entidade']],
    ['DTO', 'Objeto criado para transportar dados através de uma fronteira sem expor diretamente o modelo interno.', 'dto-mapping', ['Data Transfer Object']],
    ['Bean Validation', 'Modelo declarativo de validação baseado em constraints como @NotNull e @Size.', 'validacao-erros', ['validação']],
    ['N+1', 'Problema em que uma consulta inicial dispara várias consultas adicionais, geralmente uma para cada item retornado.', 'n-mais-1'],
    ['CORS', 'Política do navegador que controla quais origens podem acessar recursos de outra origem.', 'cors-rate-limit', ['Cross-Origin Resource Sharing']],
    ['JUnit', 'Framework usado para escrever e executar testes automatizados em Java.', 'testes'],
    ['Mock', 'Dublê configurável usado para controlar dependências e verificar interações durante um teste.', 'mockito', ['mocks']],
    ['JWT', 'Token assinado composto por header, payload e assinatura; carrega claims, mas não é criptografado por padrão.', 'autenticacao-conceitos', ['JSON Web Token']],
    ['OAuth2', 'Framework de autorização delegada que permite conceder acesso limitado sem compartilhar a senha do usuário.', 'autenticacao-conceitos', ['OAuth 2.0']],
    ['OIDC', 'OpenID Connect: camada de identidade sobre OAuth 2.0 que padroniza autenticação e ID token.', 'security-oidc', ['OpenID Connect']],
    ['PKCE', 'Proteção do fluxo Authorization Code que vincula cada código a um segredo temporário criado pelo cliente.', 'security-oidc', ['Proof Key for Code Exchange']],
    ['RBAC', 'Modelo de autorização no qual permissões são atribuídas a papéis associados aos usuários.', 'mini-auth-rbac', ['Role-Based Access Control']],
    ['TLS', 'Protocolo criptográfico que oferece confidencialidade, integridade e autenticação para conexões como HTTPS.', 'https'],
    ['Docker', 'Plataforma para empacotar e executar aplicações em containers reproduzíveis.', 'docker-conceitos'],
    ['Imagem Docker', 'Artefato imutável em camadas que contém aplicação, runtime e configuração necessários para criar containers.', 'dockerfile', ['Docker image']],
    ['Container', 'Processo isolado iniciado a partir de uma imagem e compartilhando o kernel do host.', 'docker-conceitos', ['containers']],
    ['Docker Compose', 'Ferramenta declarativa para definir e executar vários serviços relacionados.', 'compose', ['Compose']],
    ['Testcontainers', 'Biblioteca que inicia containers descartáveis durante testes de integração.', 'testcontainers'],
    ['NoSQL', 'Família de bancos não relacionais com modelos como documentos, chave-valor, colunas ou grafos.', 'nosql'],
    ['MongoDB', 'Banco orientado a documentos que armazena estruturas semelhantes a JSON no formato BSON.', 'mongodb'],
    ['Redis', 'Armazenamento em memória baseado em estruturas de dados, frequentemente usado para cache e coordenação.', 'redis'],
    ['Cache', 'Cópia temporária de dados criada para reduzir latência e trabalho repetido.', 'spring-cache'],
    ['Circuit Breaker', 'Padrão que interrompe chamadas a uma dependência instável para evitar falhas em cascata.', 'resilience'],
    ['WebClient', 'Cliente HTTP reativo e não bloqueante fornecido pelo ecossistema Spring.', 'webclient'],
    ['AOP', 'Programação orientada a aspectos, usada para aplicar comportamentos transversais como logs e transações.', 'spring-aop', ['Aspect-Oriented Programming']],
    ['Actuator', 'Conjunto de endpoints operacionais do Spring Boot para saúde, métricas e diagnóstico.', 'actuator'],
    ['CI/CD', 'Automação contínua de integração, testes e entrega ou implantação de software.', 'cicd', ['pipeline']],
    ['Observabilidade', 'Capacidade de compreender o estado interno de um sistema por métricas, logs e traces.', 'mini-deploy-observavel'],
    ['SLO', 'Objetivo mensurável de confiabilidade de um serviço em uma janela, como 99,9% de sucesso em 30 dias.', 'observabilidade-pratica', ['Service Level Objective']],
    ['SBOM', 'Inventário dos componentes e versões presentes em um artefato de software.', 'hardening-producao', ['Software Bill of Materials']],
    ['Thread', 'Fluxo de execução dentro de um processo, com stack própria e memória compartilhada com outras threads.', 'threads', ['threads']],
    ['Race condition', 'Falha dependente da ordem de execução concorrente quando acessos compartilhados não são coordenados.', 'concorrencia-profunda', ['condição de corrida']],
    ['Deadlock', 'Situação em que fluxos concorrentes aguardam indefinidamente recursos mantidos uns pelos outros.', 'concorrencia-profunda'],
    ['Mensageria', 'Comunicação assíncrona baseada no envio de mensagens por meio de um broker ou canal.', 'mensageria'],
    ['Kafka', 'Plataforma distribuída de streaming de eventos baseada em logs particionados e persistentes.', 'kafka', ['Apache Kafka']],
    ['Tópico Kafka', 'Fluxo nomeado de registros no Kafka, dividido em partições.', 'kafka', ['topic']],
    ['Partição', 'Unidade ordenada e paralelizável de armazenamento de registros dentro de um tópico Kafka.', 'kafka', ['partition']],
    ['Consumer group', 'Grupo de consumidores que divide entre si as partições de um tópico.', 'kafka', ['grupo de consumidores']],
    ['DLT', 'Dead-letter topic: tópico que recebe mensagens não processadas após a política de tentativas definida.', 'kafka-confiavel', ['dead-letter topic']],
    ['Outbox', 'Tabela gravada na mesma transação do domínio para que eventos pendentes sejam publicados de forma recuperável.', 'kafka-confiavel', ['transactional outbox']],
    ['DDD', 'Abordagem de modelagem que aproxima o software do domínio e da linguagem usada pelos especialistas.', 'ddd', ['Domain-Driven Design']],
    ['Agregado', 'Fronteira de consistência no DDD, controlada por uma raiz que protege suas invariantes.', 'ddd', ['aggregate']],
    ['CAP', 'Princípio segundo o qual, diante de uma partição de rede, um sistema distribuído escolhe entre consistência e disponibilidade.', 'sistemas-distribuidos', ['teorema CAP']],
    ['PACELC', 'Modelo que acrescenta ao CAP a troca entre latência e consistência quando não existe partição.', 'consistencia-distribuida'],
    ['Idempotência', 'Propriedade de uma operação que produz o mesmo efeito observável quando repetida com a mesma intenção.', 'sistemas-distribuidos', ['idempotency']],
    ['Event-driven', 'Estilo arquitetural no qual componentes publicam e reagem a eventos, reduzindo o acoplamento temporal.', 'event-driven-profundo', ['arquitetura orientada a eventos']],
    ['WebSocket', 'Protocolo de conexão persistente e bidirecional entre cliente e servidor.', 'websockets', ['WebSockets']],
    ['BFF', 'Backend for Frontend: backend dedicado às necessidades de uma interface, capaz de intermediar APIs, sessão e tokens.', 'frontend-aplicacao', ['Backend for Frontend']],
    ['ADR', 'Registro curto que documenta uma decisão arquitetural, seu contexto e suas consequências.', 'code-review-adr', ['Architecture Decision Record']],
    ['WebHook', 'Chamada HTTP enviada automaticamente quando um evento ocorre em outro sistema.', 'conectando-front-back', ['webhook', 'webhooks']]
  ].map(([term, definition, chapter, aliases = []], index) => ({ key: `term-${index}`, term, definition, chapter, aliases }));
  const glossaryByKey = new Map(glossaryTerms.map(entry => [entry.key, entry]));

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.addEventListener('success', () => resolve(request.result), { once: true });
      request.addEventListener('error', () => reject(request.error || new Error('Falha no IndexedDB.')), { once: true });
    });
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (location.protocol === 'file:') { reject(new Error('Arquivos locais usam o modo de compatibilidade.')); return; }
      if (!('indexedDB' in window)) { reject(new Error('IndexedDB indisponível.')); return; }
      const request = indexedDB.open(databaseName, databaseVersion);
      request.addEventListener('upgradeneeded', () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(stateStore)) db.createObjectStore(stateStore);
      });
      request.addEventListener('success', () => {
        const db = request.result;
        db.addEventListener('versionchange', () => db.close());
        resolve(db);
      }, { once: true });
      request.addEventListener('blocked', () => reject(new Error('Atualização do banco bloqueada por outra aba.')), { once: true });
      request.addEventListener('error', () => reject(request.error || new Error('Não foi possível abrir o IndexedDB.')), { once: true });
    });
  }

  function readDatabaseState() {
    const transaction = database.transaction(stateStore, 'readonly');
    return requestResult(transaction.objectStore(stateStore).get(stateRecordKey));
  }

  function writeDatabaseState(value) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(stateStore, 'readwrite');
      transaction.objectStore(stateStore).put(value, stateRecordKey);
      transaction.addEventListener('complete', () => resolve(true), { once: true });
      transaction.addEventListener('abort', () => reject(transaction.error || new Error('Gravação cancelada.')), { once: true });
      transaction.addEventListener('error', () => reject(transaction.error || new Error('Falha ao gravar no IndexedDB.')), { once: true });
    });
  }

  function deleteDatabaseState() {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(stateStore, 'readwrite');
      transaction.objectStore(stateStore).delete(stateRecordKey);
      transaction.addEventListener('complete', () => resolve(true), { once: true });
      transaction.addEventListener('abort', () => reject(transaction.error || new Error('Exclusão cancelada.')), { once: true });
      transaction.addEventListener('error', () => reject(transaction.error || new Error('Falha ao excluir dados.')), { once: true });
    });
  }

  function readLegacyState() {
    try { return JSON.parse(localStorage.getItem(stateKey)) || null; } catch { return null; }
  }

  async function loadPersistedState() {
    const legacyState = readLegacyState();
    try {
      database = await openDatabase();
      storageBackend = 'IndexedDB';
      const indexedState = await readDatabaseState();
      if (indexedState) return indexedState;
      if (legacyState) {
        await writeDatabaseState(legacyState);
        const verifiedState = await readDatabaseState();
        if (!verifiedState) throw new Error('A verificação da migração falhou.');
        try { localStorage.removeItem(stateKey); } catch { /* origem pode bloquear localStorage */ }
        migratedFromLocalStorage = true;
        return verifiedState;
      }
      return {};
    } catch (error) {
      database = null;
      storageBackend = 'localStorage (compatibilidade)';
      return legacyState || {};
    }
  }

  let state;

  function normalizeState(candidate = {}) {
    const normalized = candidate && typeof candidate === 'object' ? candidate : {};
    normalized.completed ||= {};
    normalized.checklists ||= {};
    normalized.favorites ||= {};
    normalized.notes = normalized.notes && typeof normalized.notes === 'object' && !Array.isArray(normalized.notes)
      ? Object.fromEntries(Object.entries(normalized.notes).filter(([, note]) => typeof note === 'string'))
      : {};
    normalized.quizAnswers ||= {};
    normalized.review ||= {};
    normalized.mastery = normalized.mastery && typeof normalized.mastery === 'object' && !Array.isArray(normalized.mastery) ? normalized.mastery : {};
    normalized.errors = normalized.errors && typeof normalized.errors === 'object' && !Array.isArray(normalized.errors) ? normalized.errors : {};
    normalized.retrieval = normalized.retrieval && typeof normalized.retrieval === 'object' && !Array.isArray(normalized.retrieval) ? normalized.retrieval : {};
    normalized.diagnostic = normalized.diagnostic && typeof normalized.diagnostic === 'object' && !Array.isArray(normalized.diagnostic) ? normalized.diagnostic : {};
    normalized.diagnostic.runs = Array.isArray(normalized.diagnostic.runs) ? normalized.diagnostic.runs : [];
    normalized.diagnostic.active = normalized.diagnostic.active && typeof normalized.diagnostic.active === 'object'
      ? normalized.diagnostic.active
      : null;
    normalized.mastery = Object.fromEntries(Object.entries(normalized.mastery).filter(([, record]) => record && typeof record === 'object' && !Array.isArray(record)));
    normalized.errors = Object.fromEntries(Object.entries(normalized.errors).filter(([, error]) => error && typeof error === 'object' && !Array.isArray(error)));
    normalized.retrieval = Object.fromEntries(Object.entries(normalized.retrieval).filter(([, answer]) => answer && typeof answer === 'object' && !Array.isArray(answer)));
    normalized.diagnostic.runs = normalized.diagnostic.runs.filter(run => run && typeof run === 'object' && !Array.isArray(run)).slice(0, 20);
    if (normalized.diagnostic.active) {
      normalized.diagnostic.active.questions = Array.isArray(normalized.diagnostic.active.questions) ? normalized.diagnostic.active.questions : [];
      normalized.diagnostic.active.answers = Array.isArray(normalized.diagnostic.active.answers) ? normalized.diagnostic.active.answers : [];
      normalized.diagnostic.active.current = Math.max(0, Number(normalized.diagnostic.active.current) || 0);
    }
    const today = todayKey();
    const savedReviewPlan = normalized.reviewPlan && typeof normalized.reviewPlan === 'object' ? normalized.reviewPlan : {};
    const savedChoices = savedReviewPlan.choices && typeof savedReviewPlan.choices === 'object' ? savedReviewPlan.choices : {};
    normalized.reviewPlan = savedReviewPlan.date === today
      ? {
          date: today,
          choices: Object.fromEntries(Object.entries(savedChoices).filter(([, choice]) => choice === 'selected' || choice === 'deferred'))
        }
      : { date: today, choices: {} };
    delete normalized.experience;
    normalized.labs ||= {};
    normalized.activity ||= {};
    normalized.settings = normalized.settings && typeof normalized.settings === 'object' && !Array.isArray(normalized.settings) ? normalized.settings : {};
    normalized.settings.theme ||= 'system';
    if (normalized.settings.theme === 'dark') normalized.settings.theme = 'system';
    normalized.settings.fontScale ||= 1;
    normalized.settings.dailyGoal ||= 25;
    normalized.settings.focusMode ||= false;
    normalized.settings.reviewMode ||= false;
    normalized.settings.reduceMotion ||= false;
    normalized.settings.noteView = ['edit', 'split', 'preview'].includes(normalized.settings.noteView) ? normalized.settings.noteView : 'split';
    normalized.version = 9;
    return normalized;
  }
  state = normalizeState(await loadPersistedState());

  let activeId = byId.has(location.hash.slice(1))
    ? location.hash.slice(1)
    : (byId.has(state.lastChapter) ? state.lastChapter : chapters[0].id);
  let practiceOnly = false;
  let favoritesOnly = false;
  let deferredInstallPrompt = null;
  let noteSaveTimer = null;
  let noteDraftDirty = false;
  let loadedNoteChapterId = null;
  let labSaveTimer = null;
  let reviewQueue = [];
  let reviewPlanFilter = 'all';
  let learningHubView = 'overview';
  let masteryStatusFilter = 'all';
  let masterySearch = '';
  let errorFilter = 'open';
  let activeErrorId = null;
  let commandSelection = 0;
  let commandItems = [];
  let pomodoro = { remaining: 25 * 60, running: false, breakMode: false, timer: null };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const mount = $('#chapter-mount');
  const sidebar = $('#course-sidebar');
  const backdrop = $('#sidebar-backdrop');
  const search = $('#course-search');
  const previous = $('#previous-chapter');
  const next = $('#next-chapter');
  const complete = $('#complete-chapter');
  const phaseLabel = $('#phase-label');
  const counter = $('#chapter-counter');
  const studyOverlay = $('#study-overlay');
  const commandOverlay = $('#command-overlay');

  function buildCourseNavigation() {
    const navigation = $('#course-nav');
    const phases = new Map();
    chapters.forEach(chapter => {
      if (!phases.has(chapter.phaseId)) phases.set(chapter.phaseId, { title: chapter.phaseTitle, chapters: [] });
      phases.get(chapter.phaseId).chapters.push(chapter);
    });
    const fragment = document.createDocumentFragment();
    phases.forEach((phase, phaseId) => {
      const section = document.createElement('section');
      section.className = 'nav-phase';
      section.dataset.phase = phaseId;
      const heading = document.createElement('h2');
      heading.textContent = phase.title;
      section.append(heading);
      phase.chapters.forEach(chapter => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.chapter = chapter.id;
        const status = document.createElement('span');
        status.className = 'status-dot';
        const label = document.createElement('span');
        label.textContent = chapter.title;
        button.append(status, label);
        section.append(button);
      });
      fragment.append(section);
    });
    navigation.replaceChildren(fragment);
  }

  buildCourseNavigation();

  const legacyNumbers = new Map();
  chapters.forEach(chapter => {
    const label = document.getElementById('template-' + chapter.id)?.content.querySelector('.section-num')?.textContent.trim();
    if (!/^\d{1,3}$/.test(label || '')) return;
    const normalized = String(Number(label));
    if (!legacyNumbers.has(normalized)) legacyNumbers.set(normalized, []);
    legacyNumbers.get(normalized).push(chapter);
  });

  function normalizeLegacyChapterReferences() {
    const walker = document.createTreeWalker(mount, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue.match(/capítulos?\s+\d/i)) continue;
      if (node.parentElement?.closest('pre, code, a, .section-head, .topic-meta')) continue;
      nodes.push(node);
    }
    nodes.forEach(node => {
      node.nodeValue = node.nodeValue.replace(/\b(capítulo|capítulos)\s+(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?/gi, (full, prefix, start, end) => {
        const first = legacyNumbers.get(String(Number(start)));
        const last = end ? legacyNumbers.get(String(Number(end))) : null;
        if (first?.length !== 1 || (end && last?.length !== 1)) return full;
        const firstNumber = String(first[0].index + 1).padStart(3, '0');
        const lastNumber = end ? String(last[0].index + 1).padStart(3, '0') : '';
        return `${prefix} ${firstNumber}${lastNumber ? '–' + lastNumber : ''}`;
      });
    });
  }

  function save() {
    if (isResettingData) return Promise.resolve(false);
    state.updatedAt = new Date().toISOString();
    if (database) {
      const snapshot = typeof structuredClone === 'function' ? structuredClone(state) : JSON.parse(JSON.stringify(state));
      storageWriteQueue = storageWriteQueue
        .catch(() => undefined)
        .then(() => writeDatabaseState(snapshot))
        .catch(() => { toast('Não foi possível salvar no IndexedDB. Verifique o espaço disponível.'); return false; });
      updateStorageStatus();
      return storageWriteQueue;
    }
    try {
      localStorage.setItem(stateKey, JSON.stringify(state));
      updateStorageStatus();
      return Promise.resolve(true);
    } catch {
      toast('Não foi possível salvar. O armazenamento do navegador pode estar cheio.');
      return Promise.resolve(false);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  const glossaryAliases = glossaryTerms
    .flatMap(entry => [entry.term, ...entry.aliases].map(alias => ({ alias, entry })))
    .sort((first, second) => second.alias.length - first.alias.length);
  const glossaryAliasLookup = new Map(glossaryAliases.map(item => [item.alias.toLocaleLowerCase('pt-BR'), item.entry]));
  const glossaryPattern = new RegExp(glossaryAliases.map(item => item.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'giu');
  const wordCharacter = /[\p{L}\p{N}_]/u;

  function normalizeSearchText(value = '') {
    return String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase('pt-BR');
  }

  function highlightContextualTerms() {
    const occurrences = new Map();
    let totalHighlights = 0;
    const textNodes = [];
    const walker = document.createTreeWalker(mount, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || !node.nodeValue.trim()) continue;
      if (parent.closest('pre,code,a,button,textarea,input,select,.topic-meta,.section-head,.exercise-head,.glossary-popover,.retrieval-card')) continue;
      if (!parent.closest('p,li,td,th,.callout,.secret,.warn,.study-tip,.analogy')) continue;
      textNodes.push(node);
    }

    for (const node of textNodes) {
      if (totalHighlights >= 36) break;
      const text = node.nodeValue;
      const matches = [];
      glossaryPattern.lastIndex = 0;
      let match;
      while ((match = glossaryPattern.exec(text)) && totalHighlights + matches.length < 36) {
        const before = match.index > 0 ? text[match.index - 1] : '';
        const after = match.index + match[0].length < text.length ? text[match.index + match[0].length] : '';
        if ((before && wordCharacter.test(before)) || (after && wordCharacter.test(after))) continue;
        const entry = glossaryAliasLookup.get(match[0].toLocaleLowerCase('pt-BR'));
        if (!entry || (occurrences.get(entry.key) || 0) + matches.filter(item => item.entry.key === entry.key).length >= 2) continue;
        matches.push({ index: match.index, value: match[0], entry });
      }
      if (!matches.length) continue;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const item of matches) {
        fragment.append(document.createTextNode(text.slice(cursor, item.index)));
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'context-term';
        button.dataset.glossaryKey = item.entry.key;
        button.textContent = item.value;
        button.setAttribute('aria-label', `Ver definição: ${item.entry.term}`);
        fragment.append(button);
        cursor = item.index + item.value.length;
        occurrences.set(item.entry.key, (occurrences.get(item.entry.key) || 0) + 1);
        totalHighlights++;
      }
      fragment.append(document.createTextNode(text.slice(cursor)));
      node.replaceWith(fragment);
    }
  }

  function positionGlossaryPopover(anchor) {
    const popover = $('#glossary-popover');
    const anchorRect = anchor.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    let left = Math.min(innerWidth - popoverRect.width - 12, Math.max(12, anchorRect.left));
    let top = anchorRect.bottom + 9;
    if (top + popoverRect.height > innerHeight - 12) top = Math.max(12, anchorRect.top - popoverRect.height - 9);
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
  }

  function openGlossaryPopover(entry, anchor) {
    if (!entry || !anchor) return;
    const popover = $('#glossary-popover');
    $('#glossary-popover-title').textContent = entry.term;
    $('#glossary-popover-definition').textContent = entry.definition;
    $('#glossary-related-chapter').dataset.chapter = entry.chapter;
    const related = byId.get(entry.chapter);
    $('#glossary-related-chapter').textContent = related ? `Abrir capítulo ${related.index + 1}` : 'Abrir capítulo relacionado';
    popover.classList.add('open');
    positionGlossaryPopover(anchor);
    popover.querySelector('.popover-close').focus({ preventScroll: true });
  }

  function closeGlossaryPopover() {
    $('#glossary-popover').classList.remove('open');
  }

  function renderGlossary(query = '') {
    const list = $('#context-glossary-list');
    if (!list) return;
    const needle = normalizeSearchText(query.trim());
    const matches = glossaryTerms.filter(entry => !needle || normalizeSearchText(`${entry.term} ${entry.aliases.join(' ')} ${entry.definition} ${byId.get(entry.chapter)?.title || ''}`).includes(needle));
    $('#glossary-total').textContent = `${glossaryTerms.length} conceitos`;
    $('#glossary-results-count').textContent = `${matches.length} ${matches.length === 1 ? 'resultado' : 'resultados'}`;
    list.innerHTML = matches.length ? matches.map(entry => {
      const chapter = byId.get(entry.chapter);
      return `<article class="context-glossary-card" tabindex="0" role="button" data-glossary-card="${entry.key}"><h3>${escapeHtml(entry.term)}</h3><p>${escapeHtml(entry.definition)}</p><small>${chapter ? `${String(chapter.index + 1).padStart(3, '0')} · ${escapeHtml(chapter.title)}` : 'Conceito transversal'}</small></article>`;
    }).join('') : '<div class="review-empty">Nenhum conceito encontrado. Tente outro termo ou tecnologia.</div>';
  }

  function toast(message, duration = 2800) {
    const element = document.createElement('div');
    element.className = 'toast';
    element.textContent = message;
    $('#toast-region').append(element);
    setTimeout(() => element.remove(), duration);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.append(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
  }

  function downloadText(filename, content, type = 'text/plain') {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('visible');
  }
  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('visible');
  }

  function recordActivity(field, amount = 1) {
    const key = todayKey();
    state.activity[key] ||= { minutes: 0, chapters: 0, quizzes: 0, reviews: 0 };
    state.activity[key][field] = (Number(state.activity[key][field]) || 0) + amount;
    save();
  }

  function totalMinutes() {
    return Object.values(state.activity).reduce((total, day) => total + (Number(day.minutes) || 0), 0);
  }

  function calculateStreak() {
    let cursor = todayKey();
    if (!(state.activity[cursor]?.minutes || state.activity[cursor]?.chapters || state.activity[cursor]?.quizzes || state.activity[cursor]?.reviews || state.activity[cursor]?.retrievals || state.activity[cursor]?.diagnostics)) {
      cursor = addDays(cursor, -1);
    }
    let streak = 0;
    while (state.activity[cursor]?.minutes || state.activity[cursor]?.chapters || state.activity[cursor]?.quizzes || state.activity[cursor]?.reviews || state.activity[cursor]?.retrievals || state.activity[cursor]?.diagnostics) {
      streak++;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  function quizTotals() {
    const answers = Object.values(state.quizAnswers);
    return {
      answered: answers.length,
      correct: answers.filter(answer => answer.correct).length
    };
  }

  function updateProgress() {
    const done = chapters.filter(chapter => state.completed[chapter.id]).length;
    const percentage = Math.round(done / chapters.length * 100);
    $('#progress-pct').textContent = percentage + '%';
    $('#progress-fill').style.width = percentage + '%';
    $$('[data-chapter]').forEach(button => {
      button.querySelector('.status-dot')?.classList.toggle('done', Boolean(state.completed[button.dataset.chapter]));
      button.classList.toggle('favorite', Boolean(state.favorites[button.dataset.chapter]));
    });
    complete.classList.toggle('done', Boolean(state.completed[activeId]));
    complete.textContent = state.completed[activeId] ? '✓ Capítulo concluído' : 'Marcar como concluído';
    const favorite = $('#favorite-chapter');
    favorite.classList.toggle('active', Boolean(state.favorites[activeId]));
    favorite.textContent = state.favorites[activeId] ? '★' : '☆';
    updateDashboard();
  }

  function restoreQuizzes() {
    mount.querySelectorAll('.quiz').forEach((quiz, quizIndex) => {
      const key = `${activeId}:${quizIndex}`;
      const answer = state.quizAnswers[key];
      if (!answer) return;
      quiz.dataset.answered = '1';
      quiz.querySelectorAll('.quiz-opt').forEach((option, optionIndex) => {
        if (option.dataset.correct === 'true') option.classList.add('correct');
        if (optionIndex === answer.selected && !answer.correct) option.classList.add('wrong');
      });
      const feedback = quiz.querySelector('.quiz-feedback');
      if (feedback) feedback.textContent = answer.correct ? '✓ Correto — resposta salva.' : '✗ Resposta salva. Revise a alternativa destacada.';
    });
  }

  function enhanceChapter() {
    const index = indexById.get(activeId);
    const number = mount.querySelector('.section-num');
    if (number) number.textContent = String(index + 1).padStart(3, '0');
    mount.querySelectorAll('.prereq-tag[href^="#"]').forEach(link => {
      const prerequisite = byId.get(link.getAttribute('href').slice(1));
      if (prerequisite) link.textContent = String(prerequisite.index + 1).padStart(3, '0') + ' · ' + prerequisite.title;
    });
    mount.querySelectorAll('pre.code').forEach(pre => {
      if (pre.parentElement.classList.contains('code-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.before(wrap);
      wrap.append(pre);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-btn';
      button.textContent = 'Copiar';
      button.setAttribute('aria-label', 'Copiar código');
      wrap.append(button);
    });
    mount.querySelectorAll('.checklist input').forEach((input, inputIndex) => {
      input.checked = Boolean(state.checklists[activeId]?.[inputIndex]);
      input.nextElementSibling?.classList.toggle('done', input.checked);
    });
    normalizeLegacyChapterReferences();
    injectRetrievalPrompt();
    restoreQuizzes();
    highlightContextualTerms();
    updateReadingProgress();
  }

  function chapterReadingMinutes() {
    const words = mount.textContent.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(words / 210));
  }

  function render(id, pushHash = true) {
    if (!byId.has(id)) return;
    if (noteDraftDirty && loadedNoteChapterId && loadedNoteChapterId !== id) saveCurrentNote(loadedNoteChapterId, $('#note-editor').value, false);
    activeId = id;
    const chapter = byId.get(id);
    mount.replaceChildren(document.getElementById('template-' + id).content.cloneNode(true));
    phaseLabel.textContent = chapter.phaseTitle;
    previous.disabled = chapter.index === 0;
    next.disabled = chapter.index === chapters.length - 1;
    $$('[data-chapter]').forEach(button => button.classList.toggle('active', button.dataset.chapter === id));
    state.lastChapter = id;
    save();
    enhanceChapter();
    counter.textContent = `${chapter.index + 1} de ${chapters.length} · ${chapterReadingMinutes()} min`;
    counter.dataset.short = `${chapter.index + 1}/${chapters.length}`;
    updateProgress();
    updateNotesPanel();
    loadLabDraft();
    closeSidebar();
    if (pushHash) history.replaceState(null, '', '#' + id);
    window.scrollTo({ top: 0, behavior: state.settings.reduceMotion ? 'auto' : 'instant' });
    document.title = `${chapter.title} — Stack Completa`;
  }

  function filterNavigation() {
    const query = normalizeSearchText(search.value);
    let visible = 0;
    $$('[data-chapter]').forEach(button => {
      const chapter = byId.get(button.dataset.chapter);
      if (!chapter) return;
      const matchesPractice = !practiceOnly || chapter.id.startsWith('mini-');
      const matchesFavorite = !favoritesOnly || state.favorites[chapter.id];
      const matchesQuery = !query || normalizeSearchText(chapter.title).includes(query);
      button.hidden = !(matchesPractice && matchesFavorite && matchesQuery);
      if (!button.hidden) visible++;
    });
    $$('.nav-phase').forEach(phase => phase.hidden = !phase.querySelector('[data-chapter]:not([hidden])'));
    $('#empty-search').style.display = visible ? 'none' : 'block';
    $('#search-results').textContent = query
      ? `${visible} ${visible === 1 ? 'título encontrado' : 'títulos encontrados'}.`
      : '';
  }

  function toggleComplete() {
    const becomingComplete = !state.completed[activeId];
    state.completed[activeId] = becomingComplete;
    if (becomingComplete) {
      state.review[activeId] ||= { due: todayKey(), interval: 0, ease: 2.5, reviews: 0, mastery: 0 };
      recordActivity('chapters');
      toast('Capítulo concluído! Ele entrou na sua fila de revisão.');
    } else {
      delete state.review[activeId];
      delete state.reviewPlan.choices[activeId];
      save();
    }
    updateProgress();
    updateReviewPanel();
  }

  function toggleFavorite() {
    state.favorites[activeId] = !state.favorites[activeId];
    if (!state.favorites[activeId]) delete state.favorites[activeId];
    save();
    updateProgress();
    filterNavigation();
    toast(state.favorites[activeId] ? 'Capítulo adicionado aos favoritos.' : 'Capítulo removido dos favoritos.');
  }

  function updateReadingProgress() {
    const maximum = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(100, Math.max(0, scrollY / maximum * 100));
    $('#reading-progress').style.width = progress + '%';
    $('#chapter-mini-progress').style.width = progress + '%';
  }

  function openHub(tab = 'dashboard') {
    closeCommand();
    studyOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    selectHubTab(tab);
  }

  function closeHub() {
    studyOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function selectHubTab(tab) {
    $$('.hub-tab').forEach(button => button.classList.toggle('active', button.dataset.hubTab === tab));
    $$('.hub-panel').forEach(panel => panel.classList.toggle('active', panel.dataset.hubPanel === tab));
    if (tab === 'dashboard') updateDashboard();
    if (tab === 'notes') {
      updateNotesPanel();
      setTimeout(focusNoteWorkspace, 50);
    }
    if (tab === 'review') updateReviewPanel();
    if (tab === 'learning') renderLearningPanel();
    if (tab === 'lab') {
      loadLabDraft();
      setTimeout(() => $('#lab-editor').focus(), 50);
    }
    if (tab === 'glossary') {
      renderGlossary($('#glossary-search').value);
      setTimeout(() => $('#glossary-search').focus(), 50);
    }
    if (tab === 'settings') updateSettingsUI();
  }

  const achievements = [
    { label: 'Primeiro passo', test: () => Object.values(state.completed).filter(Boolean).length >= 1 },
    { label: 'Fundamentos ×10', test: () => Object.values(state.completed).filter(Boolean).length >= 10 },
    { label: 'Meia maratona', test: () => Object.values(state.completed).filter(Boolean).length >= 56 },
    { label: 'Stack completa', test: () => Object.values(state.completed).filter(Boolean).length === chapters.length },
    { label: '3 dias no fogo', test: () => calculateStreak() >= 3 },
    { label: '7 dias constante', test: () => calculateStreak() >= 7 },
    { label: '100 minutos', test: () => totalMinutes() >= 100 },
    { label: 'Mestre dos quizzes', test: () => quizTotals().correct >= 15 }
  ];

  function updateDashboard() {
    if (!$('#stat-completed')) return;
    const completedCount = chapters.filter(chapter => state.completed[chapter.id]).length;
    const streak = calculateStreak();
    const minutes = totalMinutes();
    const quizzes = quizTotals();
    $('#stat-completed').textContent = completedCount;
    $('#stat-streak').textContent = streak;
    $('#stat-time').textContent = minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
    $('#stat-score').textContent = quizzes.answered ? `${Math.round(quizzes.correct / quizzes.answered * 100)}%` : '—';
    $('#dashboard-message').textContent = streak >= 3
      ? `Você está em uma sequência de ${streak} dias. Proteja esse ritmo.`
      : 'Consistência vence intensidade. Continue de onde parou.';

    const goal = Number(state.settings.dailyGoal) || 25;
    const todayMinutes = Number(state.activity[todayKey()]?.minutes) || 0;
    const goalPercentage = Math.min(100, Math.round(todayMinutes / goal * 100));
    $('#goal-ring').style.setProperty('--goal', goalPercentage * 3.6 + 'deg');
    $('#goal-percent').textContent = goalPercentage + '%';
    $('#goal-copy').textContent = `${todayMinutes} de ${goal} minutos`;
    $('#daily-goal').value = String(goal);

    const activityGrid = $('#activity-grid');
    activityGrid.replaceChildren();
    for (let offset = 55; offset >= 0; offset--) {
      const key = addDays(todayKey(), -offset);
      const amount = (state.activity[key]?.minutes || 0) + (state.activity[key]?.chapters || 0) * 10 + (state.activity[key]?.reviews || 0) * 5 + (state.activity[key]?.retrievals || 0) * 2 + (state.activity[key]?.diagnostics || 0) * 2;
      const day = document.createElement('span');
      day.className = 'activity-day' + (amount >= 45 ? ' l3' : amount >= 20 ? ' l2' : amount > 0 ? ' l1' : '');
      day.title = `${key}: ${state.activity[key]?.minutes || 0} min`;
      activityGrid.append(day);
    }

    $('#achievement-list').innerHTML = achievements.map(achievement =>
      `<span class="achievement ${achievement.test() ? 'unlocked' : ''}">${achievement.test() ? '◆' : '◇'} ${escapeHtml(achievement.label)}</span>`
    ).join('');

    ensureDailyReviewPlan();
    const dueChapters = buildReviewQueue();
    const selectedCount = dueChapters.filter(chapter => reviewChoice(chapter.id) === 'selected').length;
    const deferredCount = dueChapters.length - selectedCount;
    const futureDates = Object.values(state.review).map(item => item.due).filter(date => date > todayKey()).sort();
    $('#review-summary').textContent = dueChapters.length
      ? selectedCount
        ? `${selectedCount} ${selectedCount === 1 ? 'revisão escolhida' : 'revisões escolhidas'} para hoje${deferredCount ? ` · ${deferredCount} ${deferredCount === 1 ? 'adiada' : 'adiadas'} somente neste dia` : ''}.`
        : `Você adiou ${deferredCount === 1 ? 'a revisão pendente' : `as ${deferredCount} revisões pendentes`} somente por hoje.`
      : futureDates.length ? `Fila em dia. Próxima revisão em ${formatDate(futureDates[0])}.` : 'Conclua um capítulo para iniciar sua memória de longo prazo.';
    updateLearningDashboard();
  }

  function formatDate(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(year, month - 1, day));
  }

  function noteWordCount(markdown) {
    const plainText = String(markdown)
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/!?(?:\[([^\]]*)\])(?:\([^)]*\)|\[[^\]]*\])/g, '$1')
      .replace(/[#>*_~|\[\]()-]/g, ' ')
      .trim();
    return plainText ? plainText.split(/\s+/u).length : 0;
  }

  function updateNoteCount(markdown = $('#note-editor').value) {
    const words = noteWordCount(markdown);
    const characters = String(markdown).length;
    $('#note-count').textContent = `${words} ${words === 1 ? 'palavra' : 'palavras'} · ${characters} ${characters === 1 ? 'caractere' : 'caracteres'}`;
  }

  function renderNotePreview(markdown = $('#note-editor').value) {
    const preview = $('#note-preview');
    if (!preview) return;
    if (!markdown.trim()) {
      preview.innerHTML = '<div class="note-preview-empty">Comece a escrever para visualizar o Markdown.</div>';
      updateNoteCount(markdown);
      return;
    }
    if (!window.marked?.parse || !window.DOMPurify?.sanitize) {
      preview.innerHTML = '<div class="note-preview-empty">O renderizador Markdown não pôde ser carregado. O texto original continua salvo.</div>';
      updateNoteCount(markdown);
      return;
    }
    try {
      const rendered = window.marked.parse(markdown, { gfm: true, breaks: true, async: false });
      preview.innerHTML = window.DOMPurify.sanitize(rendered, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'button', 'textarea', 'select', 'option', 'svg', 'math'],
        FORBID_ATTR: ['style', 'srcset']
      });
      preview.querySelectorAll('a[href]').forEach(link => {
        if (!link.getAttribute('href').startsWith('#')) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      });
      preview.querySelectorAll('img').forEach(image => {
        image.loading = 'lazy';
        image.referrerPolicy = 'no-referrer';
      });
      let taskIndex = 0;
      preview.querySelectorAll('input').forEach(input => {
        const listItem = input.closest('li');
        if (input.type !== 'checkbox' || !input.disabled || !listItem) { input.remove(); return; }
        listItem.classList.add('task-list-item');
        listItem.parentElement?.classList.add('contains-task-list');
        input.disabled = false;
        input.dataset.markdownTask = String(taskIndex++);
        input.setAttribute('aria-label', input.checked ? 'Marcar tarefa como pendente' : 'Marcar tarefa como concluída');
      });
    } catch {
      preview.innerHTML = '<div class="note-preview-empty">Não foi possível visualizar este Markdown. O texto original permanece intacto e salvo.</div>';
    }
    updateNoteCount(markdown);
  }

  function renderNoteChapterList() {
    const noteIds = chapters.filter(item => typeof state.notes[item.id] === 'string' && state.notes[item.id].trim());
    $('#note-chapter-list').innerHTML = noteIds.length
      ? noteIds.map(item => `<button class="note-chip ${item.id === activeId ? 'active' : ''}" type="button" data-note-chapter="${item.id}" ${item.id === activeId ? 'aria-current="true"' : ''}>${String(item.index + 1).padStart(3, '0')} · ${escapeHtml(item.title)}</button>`).join('')
      : '<span class="support-note">Nenhuma anotação criada ainda.</span>';
  }

  function focusNoteWorkspace() {
    const target = state.settings.noteView === 'preview' ? $('#note-preview') : $('#note-editor');
    target?.focus({ preventScroll: true });
  }

  function setNoteView(view, persist = true, focus = true) {
    if (!['edit', 'split', 'preview'].includes(view)) return;
    state.settings.noteView = view;
    $('#note-editor-grid').dataset.noteView = view;
    $$('[data-note-view]').forEach(button => {
      const active = button.dataset.noteView === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    renderNotePreview();
    if (persist) save();
    if (focus) setTimeout(focusNoteWorkspace, 0);
  }

  function updateNotesPanel() {
    if (!$('#note-editor')) return;
    const chapter = byId.get(activeId);
    $('#note-chapter-title').textContent = `${String(chapter.index + 1).padStart(3, '0')} · ${chapter.title}`;
    if (loadedNoteChapterId !== activeId) {
      $('#note-editor').value = typeof state.notes[activeId] === 'string' ? state.notes[activeId] : '';
      loadedNoteChapterId = activeId;
      noteDraftDirty = false;
    }
    setNoteView(state.settings.noteView, false, false);
    renderNoteChapterList();
    $('#autosave-status').textContent = noteDraftDirty ? 'Alterações pendentes' : 'Salvo';
  }

  function saveCurrentNote(chapterId = loadedNoteChapterId || activeId, value = $('#note-editor').value, refreshList = true) {
    clearTimeout(noteSaveTimer);
    if (!byId.has(chapterId)) return Promise.resolve(false);
    if (value.trim()) state.notes[chapterId] = value;
    else delete state.notes[chapterId];
    const isVisibleDraft = chapterId === loadedNoteChapterId && $('#note-editor').value === value;
    if (isVisibleDraft) noteDraftDirty = false;
    const write = save();
    if (refreshList) renderNoteChapterList();
    write.then(success => {
      if (chapterId !== loadedNoteChapterId || $('#note-editor').value !== value) return;
      $('#autosave-status').textContent = success ? 'Salvo agora' : 'Falha ao salvar';
      if (!success) noteDraftDirty = true;
    });
    return write;
  }

  function handleNoteInput() {
    noteDraftDirty = true;
    $('#autosave-status').textContent = 'Salvando…';
    renderNotePreview();
    clearTimeout(noteSaveTimer);
    const chapterId = loadedNoteChapterId || activeId;
    const value = $('#note-editor').value;
    noteSaveTimer = setTimeout(() => saveCurrentNote(chapterId, value), 450);
  }

  function replaceNoteSelection(replacement, start, end, selectionStart, selectionEnd) {
    const editor = $('#note-editor');
    editor.setRangeText(replacement, start, end, 'end');
    editor.setSelectionRange(start + selectionStart, start + selectionEnd);
    editor.focus();
    handleNoteInput();
  }

  function formatNoteLines(action) {
    const editor = $('#note-editor');
    const lineStart = editor.value.lastIndexOf('\n', Math.max(0, editor.selectionStart - 1)) + 1;
    const nextBreak = editor.value.indexOf('\n', editor.selectionEnd);
    const lineEnd = nextBreak < 0 ? editor.value.length : nextBreak;
    const original = editor.value.slice(lineStart, lineEnd) || 'item';
    const lines = original.split('\n');
    const withoutMarker = line => line.replace(/^\s*(?:#{1,6}\s+|>\s+|(?:[-+*]|\d+[.)])\s+(?:\[[ xX]\]\s+)?)/, '');
    const replacement = lines.map((line, index) => {
      const content = withoutMarker(line) || 'item';
      if (action === 'heading') return `## ${content}`;
      if (action === 'unordered-list') return `- ${content}`;
      if (action === 'ordered-list') return `${index + 1}. ${content}`;
      if (action === 'task') return `- [ ] ${content}`;
      return `> ${content}`;
    }).join('\n');
    replaceNoteSelection(replacement, lineStart, lineEnd, 0, replacement.length);
  }

  function applyMarkdownAction(action) {
    if (state.settings.noteView === 'preview') setNoteView('split', true, false);
    const editor = $('#note-editor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = editor.value.slice(start, end);
    const wrappers = {
      bold: ['**', '**', 'texto em negrito'],
      italic: ['*', '*', 'texto em itálico'],
      strike: ['~~', '~~', 'texto riscado'],
      'inline-code': ['`', '`', 'codigo']
    };
    if (wrappers[action]) {
      const [before, after, placeholder] = wrappers[action];
      const content = selected || placeholder;
      replaceNoteSelection(`${before}${content}${after}`, start, end, before.length, before.length + content.length);
      return;
    }
    if (['heading', 'unordered-list', 'ordered-list', 'task', 'quote'].includes(action)) { formatNoteLines(action); return; }
    if (action === 'link') {
      const label = selected || 'texto do link';
      const url = 'https://exemplo.com';
      replaceNoteSelection(`[${label}](${url})`, start, end, label.length + 3, label.length + 3 + url.length);
      return;
    }
    if (action === 'code-block') {
      const content = selected || 'System.out.println("Olá, Markdown!");';
      const before = '```java\n';
      replaceNoteSelection(`${before}${content}\n\`\`\``, start, end, before.length, before.length + content.length);
      return;
    }
    if (action === 'table') {
      const table = '| Conceito | Observação |\n| --- | --- |\n| Exemplo | Detalhe |';
      replaceNoteSelection(table, start, end, 2, 10);
    }
  }

  function toggleMarkdownTask(taskIndex, checked) {
    const editor = $('#note-editor');
    let current = -1;
    const updated = editor.value.replace(/^(\s*(?:[-+*]|\d+[.)])\s+)\[([ xX])\]/gm, (match, prefix) => {
      current += 1;
      return current === taskIndex ? `${prefix}[${checked ? 'x' : ' '}]` : match;
    });
    if (updated === editor.value) return;
    editor.value = updated;
    handleNoteInput();
  }

  function buildReviewQueue() {
    return chapters.filter(chapter => state.completed[chapter.id] && (!state.review[chapter.id] || state.review[chapter.id].due <= todayKey()));
  }

  function ensureDailyReviewPlan() {
    const today = todayKey();
    if (!state.reviewPlan || state.reviewPlan.date !== today || !state.reviewPlan.choices || typeof state.reviewPlan.choices !== 'object') {
      state.reviewPlan = { date: today, choices: {} };
      return true;
    }
    return false;
  }

  function reviewChoice(chapterId) {
    return state.reviewPlan.choices[chapterId] === 'deferred' ? 'deferred' : 'selected';
  }

  function setReviewChoice(chapterId, choice) {
    ensureDailyReviewPlan();
    if (!buildReviewQueue().some(chapter => chapter.id === chapterId)) return;
    state.reviewPlan.choices[chapterId] = choice === 'deferred' ? 'deferred' : 'selected';
    save();
    updateReviewPanel();
    toast(choice === 'deferred'
      ? 'Revisão adiada somente por hoje. Ela volta amanhã.'
      : 'Revisão incluída no plano de hoje.');
  }

  function setAllReviewChoices(choice) {
    const dueChapters = buildReviewQueue();
    ensureDailyReviewPlan();
    dueChapters.forEach(chapter => { state.reviewPlan.choices[chapter.id] = choice; });
    save();
    updateReviewPanel();
    toast(choice === 'deferred'
      ? 'Todas as revisões foram adiadas somente por hoje.'
      : 'Todas as revisões foram incluídas no plano de hoje.');
  }

  function reviewHash(value) {
    return [...String(value)].reduce((hash, character) => ((hash * 31) + character.codePointAt(0)) >>> 0, 2166136261);
  }

  function shuffleReviewOptions(options, seed) {
    return options
      .map((option, index) => ({ option, order: reviewHash(`${seed}:${index}:${option.text}`) }))
      .sort((left, right) => left.order - right.order)
      .map(item => item.option);
  }

  function reviewHeadings(chapter) {
    const template = document.getElementById('template-' + chapter.id);
    if (!template) return [];
    const generic = /^(exercício|solução|checkpoint|execução guiada|critérios|resumo|conclusão)$/i;
    return [...new Set([...template.content.querySelectorAll('h3')]
      .map(heading => heading.textContent.replace(/\s+/g, ' ').trim())
      .filter(heading => heading.length >= 10 && !generic.test(heading)))];
  }

  function buildReviewOptions(correctText, distractors, seed, size = 4) {
    const seen = new Set([normalizeSearchText(correctText)]);
    const alternatives = [];
    [...distractors]
      .sort((left, right) => reviewHash(`${seed}:${left}`) - reviewHash(`${seed}:${right}`))
      .forEach(text => {
        const normalized = normalizeSearchText(text);
        if (!normalized || seen.has(normalized) || alternatives.length >= size - 1) return;
        seen.add(normalized);
        alternatives.push({ text, correct: false });
      });
    return shuffleReviewOptions([{ text: correctText, correct: true }, ...alternatives], seed);
  }

  function chapterConcepts(chapter) {
    if (!chapter) return [];
    const concepts = glossaryTerms.filter(entry => entry.chapter === chapter.id);
    return concepts.length ? concepts : [{
      key: `chapter:${chapter.id}`,
      term: chapter.title,
      definition: `Conhecimentos centrais do capítulo “${chapter.title}”.`,
      chapter: chapter.id,
      aliases: []
    }];
  }

  function finalizeLearningQuestion(chapter, question, concept, source) {
    return {
      ...question,
      id: `${chapter.id}:${reviewHash(`${source}:${question.prompt}`)}`,
      chapterId: chapter.id,
      conceptKey: concept.key,
      conceptTerm: concept.term,
      source
    };
  }

  function conceptForQuestion(chapter, text, fallbackIndex = 0) {
    const concepts = chapterConcepts(chapter);
    if (!concepts.length) return null;
    const haystack = normalizeSearchText(text);
    return concepts.find(concept => [concept.term, ...(concept.aliases || [])]
      .some(label => normalizeSearchText(label).length >= 3 && haystack.includes(normalizeSearchText(label))))
      || concepts[fallbackIndex % concepts.length];
  }

  function buildReviewQuestion(chapter, roundOverride) {
    const item = state.review[chapter.id] || { reviews: 0 };
    const round = Number.isFinite(roundOverride) ? roundOverride : (Number(item.reviews) || 0);
    const seed = `${chapter.id}:${round}`;
    const template = document.getElementById('template-' + chapter.id);
    const quizzes = template ? [...template.content.querySelectorAll('.quiz')].map(quiz => {
      const prompt = quiz.querySelector('.q')?.textContent.replace(/\s+/g, ' ').trim();
      const options = [...quiz.querySelectorAll('.quiz-opt')].map(option => ({
        text: option.textContent.replace(/\s+/g, ' ').trim(),
        correct: option.dataset.correct === 'true'
      })).filter(option => option.text);
      return { prompt, options };
    }).filter(question => question.prompt && question.options.length >= 2 && question.options.filter(option => option.correct).length === 1) : [];

    if (quizzes.length) {
      const source = quizzes[round % quizzes.length];
      const options = shuffleReviewOptions(source.options, seed);
      const correct = options.find(option => option.correct);
      return finalizeLearningQuestion(chapter, {
        prompt: source.prompt,
        options,
        explanation: `Resposta correta: ${correct.text}`
      }, conceptForQuestion(chapter, `${source.prompt} ${source.options.map(option => option.text).join(' ')}`, round), 'checkpoint do capítulo');
    }

    const concepts = glossaryTerms.filter(entry => entry.chapter === chapter.id);
    if (concepts.length) {
      const concept = concepts[round % concepts.length];
      const distractors = glossaryTerms
        .filter(entry => entry.key !== concept.key)
        .map(entry => entry.definition);
      return finalizeLearningQuestion(chapter, {
        prompt: `Qual alternativa define corretamente “${concept.term}”?`,
        options: buildReviewOptions(concept.definition, distractors, seed),
        explanation: `${concept.term}: ${concept.definition}`
      }, concept, 'conceito do glossário');
    }

    const headings = reviewHeadings(chapter);
    if (headings.length) {
      const correctHeading = headings[round % headings.length];
      const distractors = chapters
        .filter(candidate => candidate.id !== chapter.id)
        .flatMap(candidate => reviewHeadings(candidate).slice(0, 2));
      const concept = chapterConcepts(chapter)[0];
      return finalizeLearningQuestion(chapter, {
        prompt: `Qual tópico é desenvolvido diretamente em “${chapter.title}”?`,
        options: buildReviewOptions(correctHeading, distractors, seed),
        explanation: `“${correctHeading}” é uma seção deste capítulo.`
      }, concept, 'estrutura do capítulo');
    }

    const distractors = chapters
      .filter(candidate => candidate.phaseId !== chapter.phaseId)
      .map(candidate => candidate.title);
    const concept = chapterConcepts(chapter)[0];
    return finalizeLearningQuestion(chapter, {
      prompt: `Qual capítulo pertence à fase “${chapter.phaseTitle}”?`,
      options: buildReviewOptions(chapter.title, distractors, seed),
      explanation: `“${chapter.title}” pertence à fase “${chapter.phaseTitle}”.`
    }, concept, 'mapa da trilha');
  }

  function masteryCatalog() {
    const entries = [...glossaryTerms];
    const linkedChapters = new Set(entries.map(entry => entry.chapter));
    chapters.filter(chapter => !linkedChapters.has(chapter.id)).forEach(chapter => entries.push(chapterConcepts(chapter)[0]));
    return entries;
  }

  function masteryRecord(conceptKey) {
    const saved = state.mastery[conceptKey];
    return saved && typeof saved === 'object' && !Array.isArray(saved)
      ? saved
      : { score: 0, attempts: 0, correct: 0, streak: 0, needsReview: false, sources: {} };
  }

  function unresolvedErrorsForConcept(conceptKey) {
    return Object.values(state.errors).filter(error => error.conceptKey === conceptKey && !error.resolved);
  }

  function masteryStatus(conceptKey) {
    const record = masteryRecord(conceptKey);
    if (!record.attempts) return { id: 'not-started', label: 'Não estudado' };
    if (record.needsReview || unresolvedErrorsForConcept(conceptKey).length) return { id: 'review', label: 'Precisa revisar' };
    if (record.score < 45) return { id: 'learning', label: 'Em aprendizado' };
    if (record.score < 80) return { id: 'understood', label: 'Compreendido' };
    return { id: 'consolidated', label: 'Consolidado' };
  }

  function recordLearningEvidence({ chapter, question, selectedIndex, source }) {
    if (!chapter || !question || !Array.isArray(question.options)) return null;
    const selected = question.options[selectedIndex];
    const correctIndex = question.options.findIndex(option => option.correct);
    if (!selected || correctIndex < 0) return null;
    const correct = selectedIndex === correctIndex;
    const weights = {
      retrieval: { correct: 8, wrong: 0 },
      diagnostic: { correct: 16, wrong: -6 },
      quiz: { correct: 14, wrong: -10 },
      review: { correct: 20, wrong: -16 },
      error: { correct: 24, wrong: -8 }
    };
    const weight = weights[source] || weights.quiz;
    const record = masteryRecord(question.conceptKey);
    record.score = Math.max(0, Math.min(100, (Number(record.score) || 0) + (correct ? weight.correct : weight.wrong)));
    record.attempts = (Number(record.attempts) || 0) + 1;
    record.correct = (Number(record.correct) || 0) + (correct ? 1 : 0);
    record.streak = correct ? (Number(record.streak) || 0) + 1 : 0;
    record.needsReview = correct ? false : source !== 'retrieval';
    record.lastSeen = new Date().toISOString();
    record.lastSource = source;
    record.sources ||= {};
    record.sources[source] = (Number(record.sources[source]) || 0) + 1;
    state.mastery[question.conceptKey] = record;

    const errorId = `${chapter.id}:${question.id}`;
    if (!correct) {
      const previous = state.errors[errorId] || {};
      state.errors[errorId] = {
        ...previous,
        id: errorId,
        questionId: question.id,
        chapterId: chapter.id,
        conceptKey: question.conceptKey,
        conceptTerm: question.conceptTerm,
        prompt: question.prompt,
        options: question.options.map(option => option.text),
        correctIndex,
        selectedIndex,
        explanation: question.explanation,
        source,
        attempts: (Number(previous.attempts) || 0) + 1,
        resolved: false,
        createdAt: previous.createdAt || new Date().toISOString(),
        lastWrongAt: new Date().toISOString()
      };
    } else {
      Object.values(state.errors).forEach(error => {
        const sameQuestion = error.id === errorId
          || (error.chapterId === chapter.id
            && error.conceptKey === question.conceptKey
            && normalizeSearchText(error.prompt) === normalizeSearchText(question.prompt));
        if (!sameQuestion || error.resolved) return;
        error.resolved = true;
        error.resolvedAt = new Date().toISOString();
      });
    }
    return { correct, correctIndex, selected, record, errorId };
  }

  function buildRetrievalQuestion(chapter) {
    const linkedConcepts = glossaryTerms.filter(entry => entry.chapter === chapter.id);
    if (!linkedConcepts.length) return buildReviewQuestion(chapter, 0);
    const concept = linkedConcepts[0];
    const phaseDistractors = glossaryTerms.filter(entry => entry.key !== concept.key && byId.get(entry.chapter)?.phaseId === chapter.phaseId);
    const otherDistractors = glossaryTerms.filter(entry => entry.key !== concept.key && byId.get(entry.chapter)?.phaseId !== chapter.phaseId);
    const distractors = (phaseDistractors.length >= 3 ? phaseDistractors : [...phaseDistractors, ...otherDistractors]).map(entry => entry.definition);
    return finalizeLearningQuestion(chapter, {
      prompt: `Antes de ler: qual alternativa melhor descreve “${concept.term}”?`,
      options: buildReviewOptions(concept.definition, distractors, `${chapter.id}:retrieval`),
      explanation: `${concept.term}: ${concept.definition}`
    }, concept, 'recuperação inicial');
  }

  function injectRetrievalPrompt() {
    if (mount.querySelector('.retrieval-card')) return;
    const chapter = byId.get(activeId);
    if (!chapter) return;
    const question = buildRetrievalQuestion(chapter);
    const answer = state.retrieval[chapter.id];
    const answered = answer?.questionId === question.id;
    const correctIndex = question.options.findIndex(option => option.correct);
    const card = document.createElement('section');
    card.className = `retrieval-card${answered ? ' answered' : ''}`;
    card.setAttribute('aria-labelledby', 'retrieval-title');
    card.innerHTML = `<div class="retrieval-head"><div><span class="concept-level">recuperação antes da explicação</span><h3 id="retrieval-title">Tente responder antes de continuar</h3></div><span class="retrieval-purpose">Não vale nota</span></div>
      <p>Primeiro tente recuperar ou prever. Errar aqui é útil: a tentativa prepara sua atenção para a explicação do capítulo.</p>
      <p class="retrieval-question">${escapeHtml(question.prompt)}</p>
      <div class="retrieval-options" role="group" aria-label="Alternativas da pergunta inicial">
        ${question.options.map((option, index) => {
          const stateClass = answered ? index === correctIndex ? ' correct' : index === answer.selectedIndex ? ' wrong' : '' : '';
          return `<button class="review-option${stateClass}" type="button" data-retrieval-option="${index}" ${answered ? 'disabled' : ''}><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option.text)}</button>`;
        }).join('')}
      </div>
      <div class="retrieval-feedback${answered ? ` visible ${answer.correct ? ' correct' : ' wrong'}` : ''}" role="status" aria-live="polite">${answered ? `<strong>${answer.correct ? '✓ Sua previsão estava correta' : 'Agora você já sabe o que procurar na explicação'}</strong><p>${escapeHtml(question.explanation)}</p>` : ''}</div>
      ${answered ? '<button class="ghost-btn retrieval-continue" type="button" data-retrieval-continue>Continuar a leitura ↓</button>' : ''}`;
    const anchor = mount.querySelector('.topic-meta') || mount.querySelector('.section-head');
    if (anchor) anchor.insertAdjacentElement('afterend', card);
    else mount.prepend(card);
  }

  function answerRetrieval(optionIndex) {
    const chapter = byId.get(activeId);
    if (!chapter || state.retrieval[chapter.id]?.questionId === buildRetrievalQuestion(chapter).id) return;
    const question = buildRetrievalQuestion(chapter);
    const result = recordLearningEvidence({ chapter, question, selectedIndex: optionIndex, source: 'retrieval' });
    if (!result) return;
    state.retrieval[chapter.id] = {
      questionId: question.id,
      conceptKey: question.conceptKey,
      selectedIndex: optionIndex,
      correct: result.correct,
      answeredAt: new Date().toISOString()
    };
    recordActivity('retrievals');
    mount.querySelector('.retrieval-card')?.remove();
    injectRetrievalPrompt();
    updateLearningDashboard();
    mount.querySelector('[data-retrieval-continue]')?.focus({ preventScroll: true });
  }

  function updateReviewPanel() {
    if (!$('#review-stage')) return;
    if (ensureDailyReviewPlan()) save();
    const dueChapters = buildReviewQueue();
    reviewQueue = dueChapters.filter(chapter => reviewChoice(chapter.id) === 'selected');
    const deferredChapters = dueChapters.filter(chapter => reviewChoice(chapter.id) === 'deferred');
    $('#review-count').textContent = dueChapters.length
      ? `${reviewQueue.length} ${reviewQueue.length === 1 ? 'escolhida' : 'escolhidas'} · ${deferredChapters.length} ${deferredChapters.length === 1 ? 'adiada' : 'adiadas'}`
      : 'fila em dia';
    if (!dueChapters.length) {
      const future = chapters
        .filter(chapter => state.review[chapter.id]?.due > todayKey())
        .sort((a, b) => state.review[a.id].due.localeCompare(state.review[b.id].due));
      $('#review-stage').innerHTML = `<div class="review-empty"><strong>Fila zerada.</strong><br>${future.length ? `A próxima revisão será em ${formatDate(state.review[future[0].id].due)}.` : 'Conclua capítulos para criar cartões automaticamente.'}</div>`;
      updateDashboard();
      return;
    }

    const visibleChapters = dueChapters.filter(chapter => reviewPlanFilter === 'all' || reviewChoice(chapter.id) === reviewPlanFilter);
    const plannerRows = visibleChapters.length
      ? visibleChapters.map(chapter => {
          const selected = reviewChoice(chapter.id) === 'selected';
          const item = state.review[chapter.id] || { mastery: 0, reviews: 0 };
          return `<label class="review-plan-item">
            <input type="checkbox" data-review-plan-toggle="${chapter.id}" ${selected ? 'checked' : ''}>
            <span class="review-plan-copy"><strong>${String(chapter.index + 1).padStart(3, '0')} · ${escapeHtml(chapter.title)}</strong><small>${item.reviews ? `${item.reviews} ${item.reviews === 1 ? 'revisão feita' : 'revisões feitas'} · domínio ${item.mastery || 0}/4` : 'Primeira revisão'}</small></span>
            <span class="review-plan-state ${selected ? 'selected' : 'deferred'}">${selected ? 'Hoje' : 'Adiada'}</span>
          </label>`;
        }).join('')
      : '<p class="review-plan-empty">Nenhum item nesta visualização.</p>';

    const planner = `<section class="review-planner" aria-labelledby="review-plan-title">
      <div class="review-plan-heading"><div><span class="hub-kicker">Plano de ${formatDate(todayKey())}</span><h3 id="review-plan-title">Escolha o que revisar hoje</h3><p>Desmarcar adia apenas neste dispositivo e somente até amanhã; o intervalo de memória não é alterado.</p></div>
        <div class="setting-actions"><button class="ghost-btn" type="button" data-review-plan-bulk="selected">Selecionar todas</button><button class="ghost-btn" type="button" data-review-plan-bulk="deferred">Adiar todas hoje</button></div>
      </div>
      <div class="review-plan-filters" role="group" aria-label="Filtrar plano de revisão">
        <button type="button" data-review-plan-filter="all" class="${reviewPlanFilter === 'all' ? 'active' : ''}" aria-pressed="${reviewPlanFilter === 'all'}">Todas <b>${dueChapters.length}</b></button>
        <button type="button" data-review-plan-filter="selected" class="${reviewPlanFilter === 'selected' ? 'active' : ''}" aria-pressed="${reviewPlanFilter === 'selected'}">Hoje <b>${reviewQueue.length}</b></button>
        <button type="button" data-review-plan-filter="deferred" class="${reviewPlanFilter === 'deferred' ? 'active' : ''}" aria-pressed="${reviewPlanFilter === 'deferred'}">Adiadas <b>${deferredChapters.length}</b></button>
      </div>
      <div class="review-plan-list">${plannerRows}</div>
    </section>`;

    if (!reviewQueue.length) {
      $('#review-stage').innerHTML = `${planner}<div class="review-empty"><strong>Nenhuma revisão escolhida para hoje.</strong><br>${deferredChapters.length === 1 ? 'O item adiado reaparece' : `Os ${deferredChapters.length} itens adiados reaparecem`} automaticamente amanhã, ainda na fila.</div>`;
      updateDashboard();
      return;
    }

    const chapter = reviewQueue[0];
    const item = state.review[chapter.id] || { mastery: 0, reviews: 0 };
    const question = buildReviewQuestion(chapter);
    $('#review-stage').innerHTML = `
      ${planner}
      <article class="review-card" data-review-id="${chapter.id}">
        <span class="hub-kicker">Próxima escolhida · ${escapeHtml(chapter.phaseTitle)} · ${chapter.index + 1}/${chapters.length}</span>
        <h3>${escapeHtml(chapter.title)}</h3>
        <div class="review-question-meta"><span>Múltipla escolha</span><span>${escapeHtml(question.source)}</span></div>
        <p class="review-question">${escapeHtml(question.prompt)}</p>
        <div class="review-options" role="group" aria-label="Alternativas da revisão">
          ${question.options.map((option, index) => `<button class="review-option" type="button" data-review-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option.text)}</button>`).join('')}
        </div>
        <div class="review-feedback" id="review-feedback" role="status" aria-live="polite"></div>
        <label class="form-label">Domínio atual · ${item.mastery || 0}/4</label>
        <div class="mastery-bar"><i style="width:${(item.mastery || 0) * 25}%"></i></div>
        <div class="review-card-actions">
          <div class="setting-actions"><button class="ghost-btn" type="button" data-review-open="${chapter.id}">Consultar capítulo</button><button class="ghost-btn" type="button" data-review-plan-defer="${chapter.id}">Adiar este item hoje</button></div>
          <button class="primary-btn" type="button" data-review-next hidden>${reviewQueue.length > 1 ? 'Próxima questão' : 'Concluir sessão'}</button>
        </div>
      </article>`;
    updateDashboard();
  }

  function answerReview(optionIndex) {
    const chapter = reviewQueue[0];
    if (!chapter) return;
    const card = $('#review-stage [data-review-id]');
    if (!card || card.dataset.answered === 'true') return;
    const question = buildReviewQuestion(chapter);
    const selected = question.options[optionIndex];
    if (!selected) return;
    const correctIndex = question.options.findIndex(option => option.correct);
    const correct = optionIndex === correctIndex;
    const item = state.review[chapter.id] || { due: todayKey(), interval: 0, ease: 2.5, reviews: 0, mastery: 0 };
    const currentEase = Number(item.ease) || 2.5;
    let interval;
    if (!correct) {
      interval = 1;
      item.ease = Math.max(1.3, currentEase - 0.2);
      item.mastery = Math.max(0, (Number(item.mastery) || 0) - 1);
    } else {
      interval = item.reviews === 0 ? 3 : item.reviews === 1 ? 7 : Math.max(7, Math.round((Number(item.interval) || 7) * currentEase));
      item.ease = Math.min(3.1, currentEase + 0.05);
      item.mastery = Math.min(4, (Number(item.mastery) || 0) + 1);
    }
    item.interval = interval;
    item.reviews += 1;
    item.attempts = (Number(item.attempts) || 0) + 1;
    item.correctAnswers = (Number(item.correctAnswers) || 0) + (correct ? 1 : 0);
    item.lastRating = correct ? 'correct' : 'incorrect';
    item.lastQuestion = question.prompt;
    item.lastAnswer = selected.text;
    item.reviewedAt = new Date().toISOString();
    item.due = addDays(todayKey(), interval);
    state.review[chapter.id] = item;
    recordLearningEvidence({ chapter, question, selectedIndex: optionIndex, source: 'review' });
    delete state.reviewPlan.choices[chapter.id];
    recordActivity('reviews');
    card.dataset.answered = 'true';
    card.querySelectorAll('[data-review-option]').forEach((button, index) => {
      button.disabled = true;
      if (index === correctIndex) button.classList.add('correct');
      if (index === optionIndex && !correct) button.classList.add('wrong');
    });
    const feedback = $('#review-feedback');
    feedback.className = `review-feedback visible ${correct ? 'correct' : 'wrong'}`;
    feedback.innerHTML = `<strong>${correct ? '✓ Resposta correta' : '✗ Resposta incorreta'}</strong><p>${escapeHtml(question.explanation)}</p><small>Próxima revisão: ${formatDate(item.due)}.</small>`;
    card.querySelector('.form-label').textContent = `Domínio atualizado · ${item.mastery}/4`;
    card.querySelector('.mastery-bar i').style.width = `${item.mastery * 25}%`;
    card.querySelector('[data-review-next]').hidden = false;
    card.querySelector('[data-review-plan-defer]').hidden = true;
    updateDashboard();
  }

  function uniqueMasteryCatalog() {
    return [...new Map(masteryCatalog().map(concept => [concept.key, concept])).values()];
  }

  function learningStats() {
    const catalog = uniqueMasteryCatalog();
    const statuses = catalog.map(concept => masteryStatus(concept.key));
    const unresolved = Object.values(state.errors).filter(error => !error.resolved).length;
    return {
      total: catalog.length,
      studied: statuses.filter(status => status.id !== 'not-started').length,
      understood: statuses.filter(status => status.id === 'understood' || status.id === 'consolidated').length,
      consolidated: statuses.filter(status => status.id === 'consolidated').length,
      review: statuses.filter(status => status.id === 'review').length,
      unresolved
    };
  }

  function updateLearningDashboard() {
    const stats = learningStats();
    const copy = $('#learning-dashboard-copy');
    if (copy) copy.textContent = stats.studied
      ? `${stats.understood} conceitos compreendidos ou consolidados · ${stats.unresolved} ${stats.unresolved === 1 ? 'erro pendente' : 'erros pendentes'}.`
      : 'Responda recuperações, quizzes ou um diagnóstico para construir seu mapa de domínio.';
    if ($('#learning-summary')) $('#learning-summary').textContent = `${stats.understood}/${stats.total} dominados · ${stats.unresolved} erros`;
  }

  function renderLearningPanel() {
    if (!$('#learning-stage')) return;
    $$('.learning-tabs [data-learning-view]').forEach(button => {
      const active = button.dataset.learningView === learningHubView;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    updateLearningDashboard();
    if (learningHubView === 'errors') renderErrorNotebook();
    else if (learningHubView === 'diagnostic') renderDiagnostic();
    else if (learningHubView === 'projects') renderProjectReadiness();
    else renderMasteryOverview();
  }

  function renderMasteryOverview() {
    const stats = learningStats();
    const catalog = uniqueMasteryCatalog();
    const filtered = catalog.filter(concept => {
      const status = masteryStatus(concept.key);
      const chapter = byId.get(concept.chapter);
      const matchesStatus = masteryStatusFilter === 'all' || status.id === masteryStatusFilter;
      const matchesSearch = !masterySearch || normalizeSearchText(`${concept.term} ${concept.definition} ${chapter?.title || ''}`).includes(normalizeSearchText(masterySearch));
      return matchesStatus && matchesSearch;
    });
    const cards = filtered.map(concept => {
      const record = masteryRecord(concept.key);
      const status = masteryStatus(concept.key);
      const chapter = byId.get(concept.chapter);
      const attempts = Math.max(0, Number(record.attempts) || 0);
      const score = Math.max(0, Math.min(100, Number(record.score) || 0));
      const accuracy = attempts ? Math.max(0, Math.min(100, Math.round((Number(record.correct) || 0) / attempts * 100))) : 0;
      return `<article class="mastery-concept ${status.id}">
        <div class="mastery-concept-head"><div><span class="mastery-status ${status.id}">${status.label}</span><h4>${escapeHtml(concept.term)}</h4></div><b>${Math.round(score)}%</b></div>
        <p>${escapeHtml(concept.definition)}</p>
        <div class="mastery-track"><i style="width:${Math.round(score)}%"></i></div>
        <footer><span>${attempts ? `${attempts} evidências · ${accuracy}% de acerto` : 'Sem evidência ainda'}</span><button type="button" data-learning-chapter="${concept.chapter}">${chapter ? `Cap. ${chapter.index + 1}` : 'Abrir'}</button></footer>
      </article>`;
    }).join('');
    $('#learning-stage').innerHTML = `<section class="learning-stat-grid">
      <article><b>${stats.studied}</b><span>conceitos praticados</span></article>
      <article><b>${stats.understood}</b><span>compreendidos</span></article>
      <article><b>${stats.consolidated}</b><span>consolidados</span></article>
      <article class="needs-review"><b>${stats.review}</b><span>precisam de revisão</span></article>
    </section>
    <div class="mastery-toolbar"><input class="study-input" id="mastery-search" type="search" value="${escapeHtml(masterySearch)}" placeholder="Buscar conceito ou capítulo…"><select class="study-select" id="mastery-status-filter"><option value="all">Todos os estados</option><option value="not-started">Não estudado</option><option value="learning">Em aprendizado</option><option value="understood">Compreendido</option><option value="consolidated">Consolidado</option><option value="review">Precisa revisar</option></select></div>
    <p class="learning-explanation">O domínio usa evidências de diagnóstico, recuperação inicial, quizzes, revisões e correções do caderno de erros. Abrir ou concluir uma página, sozinho, não prova aprendizagem.</p>
    <div class="mastery-list">${cards || '<div class="review-empty">Nenhum conceito corresponde aos filtros.</div>'}</div>`;
    $('#mastery-status-filter').value = masteryStatusFilter;
  }

  function renderErrorNotebook() {
    const errors = Object.values(state.errors)
      .filter(error => errorFilter === 'all' || (errorFilter === 'resolved' ? error.resolved : !error.resolved))
      .sort((left, right) => String(right.lastWrongAt || right.createdAt).localeCompare(String(left.lastWrongAt || left.createdAt)));
    const openCount = Object.values(state.errors).filter(error => !error.resolved).length;
    const resolvedCount = Object.values(state.errors).filter(error => error.resolved).length;
    const practiceCandidate = activeErrorId ? state.errors[activeErrorId] : null;
    const practice = practiceCandidate && Array.isArray(practiceCandidate.options) && Number.isInteger(practiceCandidate.correctIndex)
      ? practiceCandidate
      : null;
    const showPracticeResult = Boolean(practice?.lastPracticeAt || practice?.resolved);
    const shownSelection = practice?.lastPracticeSelected ?? practice?.selectedIndex;
    const previousAnswer = practice && Number.isInteger(practice.selectedIndex) ? practice.options[practice.selectedIndex] : '';
    const practiceHtml = practice ? `<article class="error-practice ${practice.resolved ? 'resolved' : ''}" data-error-practice-card="${escapeHtml(practice.id)}">
      <span class="hub-kicker">Correção ativa · ${escapeHtml(practice.conceptTerm)}</span><h3>${escapeHtml(practice.prompt)}</h3>
      ${previousAnswer ? `<p class="error-answer-context">Resposta que gerou a pendência: <strong>${escapeHtml(previousAnswer)}</strong>${practice.source ? ` · ${escapeHtml(practice.source)}` : ''}</p>` : ''}
      <div class="review-options">${practice.options.map((option, index) => `<button class="review-option ${showPracticeResult ? index === practice.correctIndex ? 'correct' : index === shownSelection && !practice.lastPracticeCorrect ? 'wrong' : '' : ''}" type="button" data-error-option="${index}" ${showPracticeResult ? 'disabled' : ''}><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option)}</button>`).join('')}</div>
      ${showPracticeResult ? `<div class="review-feedback visible ${practice.resolved ? 'correct' : 'wrong'}"><strong>${practice.resolved ? '✓ Erro corrigido' : '✗ Ainda precisa de revisão'}</strong><p>${escapeHtml(practice.explanation || 'Consulte o capítulo relacionado e tente explicar por que a alternativa destacada está correta.')}</p></div>` : ''}
      <div class="review-card-actions"><button class="ghost-btn" type="button" data-learning-chapter="${escapeHtml(practice.chapterId)}">Consultar capítulo</button><button class="ghost-btn" type="button" data-error-close>Fechar prática</button></div>
    </article>` : '';
    const list = errors.map(error => {
      const chapter = byId.get(error.chapterId);
      const attempts = Math.max(1, Number(error.attempts) || 1);
      return `<article class="error-item ${error.resolved ? 'resolved' : ''}"><div><span class="mastery-status ${error.resolved ? 'consolidated' : 'review'}">${error.resolved ? 'Corrigido' : 'Pendente'}</span><h4>${escapeHtml(error.conceptTerm)}</h4><p>${escapeHtml(error.prompt)}</p><small>${chapter ? `${String(chapter.index + 1).padStart(3, '0')} · ${escapeHtml(chapter.title)}` : ''} · ${attempts} ${attempts === 1 ? 'erro' : 'erros'}</small></div><button class="ghost-btn" type="button" data-error-practice="${escapeHtml(error.id)}">${error.resolved ? 'Ver correção' : 'Corrigir agora'}</button></article>`;
    }).join('');
    $('#learning-stage').innerHTML = `${practiceHtml}<div class="error-notebook-head"><div><h3>Caderno automático de erros</h3><p>Uma resposta errada em qualquer atividade entra aqui com contexto, alternativa escolhida e explicação.</p></div><div class="learning-filter-group"><button type="button" data-error-filter="open">Pendentes ${openCount}</button><button type="button" data-error-filter="resolved">Corrigidos ${resolvedCount}</button><button type="button" data-error-filter="all">Todos</button></div></div><div class="error-list">${list || '<div class="review-empty">Nenhum erro nesta visualização.</div>'}</div>`;
    $$('[data-error-filter]').forEach(button => button.classList.toggle('active', button.dataset.errorFilter === errorFilter));
  }

  function answerErrorPractice(optionIndex) {
    const error = state.errors[activeErrorId];
    const chapter = error ? byId.get(error.chapterId) : null;
    if (!error || !chapter || error.lastPracticeAt || !Array.isArray(error.options) || !Number.isInteger(error.correctIndex)) return;
    const options = error.options.map((text, index) => ({ text, correct: index === error.correctIndex }));
    const question = { id: error.questionId, chapterId: chapter.id, conceptKey: error.conceptKey, conceptTerm: error.conceptTerm, prompt: error.prompt, options, explanation: error.explanation, source: 'caderno de erros' };
    const result = recordLearningEvidence({ chapter, question, selectedIndex: optionIndex, source: 'error' });
    const updated = state.errors[activeErrorId];
    updated.practiceAttempts = (Number(updated.practiceAttempts) || 0) + 1;
    updated.lastPracticeAt = new Date().toISOString();
    updated.lastPracticeSelected = optionIndex;
    updated.lastPracticeCorrect = result.correct;
    if (result.correct) { updated.resolved = true; updated.resolvedAt = new Date().toISOString(); }
    recordActivity('reviews');
    renderLearningPanel();
    updateDashboard();
  }

  function phaseOptionsHtml(selectedScope) {
    const phases = [...new Map(chapters.map(chapter => [chapter.phaseId, chapter.phaseTitle])).entries()];
    return `<option value="all" ${selectedScope === 'all' ? 'selected' : ''}>Curso completo · até 20 questões</option>${phases.map(([id, title]) => `<option value="${id}" ${selectedScope === id ? 'selected' : ''}>${escapeHtml(title)}</option>`).join('')}`;
  }

  function pickEvenly(items, limit) {
    if (items.length <= limit) return [...items];
    return Array.from({ length: limit }, (_, index) => items[Math.floor(index * items.length / limit)]);
  }

  function startDiagnostic(scope) {
    let selectedChapters;
    if (scope === 'all') {
      const byPhase = new Map();
      chapters.forEach(chapter => {
        if (!byPhase.has(chapter.phaseId)) byPhase.set(chapter.phaseId, []);
        byPhase.get(chapter.phaseId).push(chapter);
      });
      selectedChapters = pickEvenly([...byPhase.values()], 20).map(group => group[Math.floor(group.length / 2)]);
    } else {
      selectedChapters = pickEvenly(chapters.filter(chapter => chapter.phaseId === scope), 10);
    }
    if (!selectedChapters.length) {
      toast('Não há capítulos disponíveis para este diagnóstico.');
      return;
    }
    const runNumber = state.diagnostic.runs.length;
    state.diagnostic.active = {
      id: `diagnostic:${Date.now()}`,
      scope,
      current: 0,
      questions: selectedChapters.map((chapter, index) => buildReviewQuestion(chapter, runNumber + index + 1)),
      answers: [],
      feedback: null,
      startedAt: new Date().toISOString()
    };
    save();
    renderDiagnostic();
  }

  function answerDiagnostic(optionIndex) {
    const run = state.diagnostic.active;
    if (!run || run.feedback) return;
    const question = run.questions[run.current];
    const chapter = question ? byId.get(question.chapterId) : null;
    if (!chapter || !Array.isArray(question.options)) return;
    const result = recordLearningEvidence({ chapter, question, selectedIndex: optionIndex, source: 'diagnostic' });
    if (!result) return;
    const answer = { chapterId: chapter.id, conceptKey: question.conceptKey, conceptTerm: question.conceptTerm, prompt: question.prompt, selectedIndex: optionIndex, correct: result.correct, correctIndex: result.correctIndex };
    run.answers.push(answer);
    run.feedback = answer;
    recordActivity('diagnostics');
    renderDiagnostic();
    updateDashboard();
  }

  function advanceDiagnostic() {
    const run = state.diagnostic.active;
    if (!run?.feedback) return;
    if (run.current < run.questions.length - 1) {
      run.current += 1;
      run.feedback = null;
      save();
      renderDiagnostic();
      return;
    }
    const correct = run.answers.filter(answer => answer.correct).length;
    const weakAnswers = run.answers.filter(answer => !answer.correct);
    const suggested = weakAnswers.map(answer => byId.get(answer.chapterId)).find(Boolean)
      || chapters.find(chapter => run.scope === 'all' || chapter.phaseId === run.scope);
    state.diagnostic.runs.unshift({
      id: run.id,
      scope: run.scope,
      total: run.answers.length,
      correct,
      accuracy: Math.round(correct / Math.max(1, run.answers.length) * 100),
      weakConcepts: [...new Set(weakAnswers.map(answer => answer.conceptKey))],
      weakConceptTerms: [...new Set(weakAnswers.map(answer => answer.conceptTerm))],
      strongConceptTerms: [...new Set(run.answers.filter(answer => answer.correct).map(answer => answer.conceptTerm))],
      weakChapters: [...new Set(weakAnswers.map(answer => answer.chapterId))],
      strongChapters: [...new Set(run.answers.filter(answer => answer.correct).map(answer => answer.chapterId))],
      suggestedChapter: suggested?.id,
      completedAt: new Date().toISOString()
    });
    state.diagnostic.runs = state.diagnostic.runs.slice(0, 20);
    state.diagnostic.active = null;
    save();
    renderDiagnostic();
    updateDashboard();
  }

  function renderDiagnostic() {
    const run = state.diagnostic.active;
    if (run) {
      const question = Array.isArray(run.questions) ? run.questions[Number(run.current) || 0] : null;
      if (!question || !Array.isArray(question.options) || !question.options.some(option => option.correct)) {
        state.diagnostic.active = null;
        save();
        toast('O diagnóstico incompleto era incompatível e foi descartado. Seu histórico foi preservado.');
        renderDiagnostic();
        return;
      }
      const feedback = run.feedback;
      const correctIndex = question.options.findIndex(option => option.correct);
      $('#learning-stage').innerHTML = `<article class="diagnostic-active"><div class="diagnostic-progress"><span>Questão ${run.current + 1} de ${run.questions.length}</span><div><i style="width:${(run.current + (feedback ? 1 : 0)) / run.questions.length * 100}%"></i></div></div><span class="hub-kicker">${escapeHtml(byId.get(question.chapterId)?.phaseTitle || '')} · ${escapeHtml(question.conceptTerm)}</span><h3>${escapeHtml(question.prompt)}</h3><div class="review-options">${question.options.map((option, index) => `<button class="review-option ${feedback ? index === correctIndex ? 'correct' : index === feedback.selectedIndex && !feedback.correct ? 'wrong' : '' : ''}" type="button" data-diagnostic-option="${index}" ${feedback ? 'disabled' : ''}><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option.text)}</button>`).join('')}</div>${feedback ? `<div class="review-feedback visible ${feedback.correct ? 'correct' : 'wrong'}"><strong>${feedback.correct ? '✓ Correto' : '✗ Incorreto'}</strong><p>${escapeHtml(question.explanation)}</p></div><button class="primary-btn diagnostic-next" type="button" data-diagnostic-next>${run.current === run.questions.length - 1 ? 'Ver resultado' : 'Próxima questão'}</button>` : ''}<button class="diagnostic-cancel" type="button" data-diagnostic-cancel>Encerrar sem concluir</button></article>`;
      return;
    }
    const last = state.diagnostic.runs[0];
    const suggested = last?.suggestedChapter ? byId.get(last.suggestedChapter) : null;
    const validScopes = new Set(['all', ...chapters.map(chapter => chapter.phaseId)]);
    const selectedScope = validScopes.has(last?.scope) ? last.scope : 'all';
    const strongTerms = Array.isArray(last?.strongConceptTerms) ? last.strongConceptTerms : [];
    const weakTerms = Array.isArray(last?.weakConceptTerms) ? last.weakConceptTerms : [];
    const accuracy = Math.max(0, Math.min(100, Number(last?.accuracy) || 0));
    const total = Math.max(0, Number(last?.total) || 0);
    const correct = Math.max(0, Math.min(total, Number(last?.correct) || 0));
    const phaseNames = new Map(chapters.map(chapter => [chapter.phaseId, chapter.phaseTitle]));
    const history = state.diagnostic.runs.slice(1).map(entry => {
      const entryTotal = Math.max(0, Number(entry.total) || 0);
      const entryCorrect = Math.max(0, Math.min(entryTotal, Number(entry.correct) || 0));
      const entryAccuracy = Math.max(0, Math.min(100, Number(entry.accuracy) || 0));
      const entryWeak = Array.isArray(entry.weakConceptTerms) ? entry.weakConceptTerms.length : 0;
      const timestamp = new Date(entry.completedAt);
      const dateLabel = Number.isNaN(timestamp.getTime()) ? 'Data indisponível' : timestamp.toLocaleDateString('pt-BR');
      const scopeLabel = entry.scope === 'all' ? 'Curso completo' : phaseNames.get(entry.scope) || 'Fase removida';
      return `<article><div><strong>${escapeHtml(scopeLabel)}</strong><small>${escapeHtml(dateLabel)} · ${entryWeak} ${entryWeak === 1 ? 'lacuna' : 'lacunas'}</small></div><span>${entryCorrect}/${entryTotal} · ${entryAccuracy}%</span></article>`;
    }).join('');
    $('#learning-stage').innerHTML = `<section class="diagnostic-intro"><div><span class="hub-kicker">Ponto de partida</span><h3>Descubra o que já domina e onde começar</h3><p>O diagnóstico não conclui capítulos automaticamente. Ele coleta evidências, identifica lacunas e recomenda um ponto de entrada sem esconder o restante da trilha.</p></div><div class="diagnostic-start"><label class="form-label" for="diagnostic-scope">Escopo</label><select class="study-select" id="diagnostic-scope">${phaseOptionsHtml(selectedScope)}</select><button class="primary-btn" type="button" data-diagnostic-start>Iniciar diagnóstico</button></div></section>${last ? `<article class="diagnostic-result"><div class="diagnostic-score"><b>${accuracy}%</b><span>${correct} de ${total} respostas corretas</span></div><div><span class="mastery-status ${accuracy >= 80 ? 'consolidated' : accuracy >= 50 ? 'understood' : 'review'}">${accuracy >= 80 ? 'Base forte' : accuracy >= 50 ? 'Base parcial' : 'Fundamentos frágeis'}</span><h3>Último resultado</h3><p>${weakTerms.length ? `${weakTerms.length} conceitos entraram no mapa como pontos de atenção.` : 'Nenhuma lacuna foi detectada nesta amostra.'}</p>${suggested ? `<button class="ghost-btn" type="button" data-learning-chapter="${suggested.id}">Começar por ${escapeHtml(suggested.title)}</button>` : ''}</div><div class="diagnostic-breakdown"><section><h4>Base demonstrada</h4><div>${strongTerms.length ? strongTerms.map(term => `<span>${escapeHtml(term)}</span>`).join('') : '<small>Ainda sem acertos suficientes nesta amostra.</small>'}</div></section><section><h4>Revisar primeiro</h4><div>${weakTerms.length ? weakTerms.map(term => `<span>${escapeHtml(term)}</span>`).join('') : '<small>Nenhum ponto fraco detectado.</small>'}</div></section></div></article>` : ''}${history ? `<section class="diagnostic-history"><h3>Resultados anteriores</h3>${history}</section>` : ''}`;
  }

  function projectChapters() {
    return chapters.filter(chapter => chapter.id.startsWith('mini-') || ['projeto', 'projetospring', 'projeto-integrador'].includes(chapter.id));
  }

  function projectPrerequisites(project) {
    const template = document.getElementById('template-' + project.id);
    const explicit = template ? [...template.content.querySelectorAll('.prereq-tag[href^="#"]')].map(link => link.getAttribute('href').slice(1)).filter(id => byId.has(id)) : [];
    if (explicit.length) return [...new Set(explicit)];
    return chapters.slice(Math.max(0, project.index - 4), project.index).filter(chapter => !projectChapters().some(item => item.id === chapter.id)).slice(-3).map(chapter => chapter.id);
  }

  function chapterEvidenceScore(chapterId) {
    const concepts = chapterConcepts(byId.get(chapterId));
    if (!concepts.length) return 0;
    return Math.round(concepts.reduce((total, concept) => total + Number(masteryRecord(concept.key).score || 0), 0) / concepts.length);
  }

  function projectReadiness(project) {
    const prerequisites = projectPrerequisites(project).map(id => {
      const chapter = byId.get(id);
      const completed = Boolean(state.completed[id]);
      const evidence = chapterEvidenceScore(id);
      return { chapter, completed, evidence, score: (completed ? 65 : 0) + Math.round(evidence * .35) };
    });
    const score = prerequisites.length ? Math.round(prerequisites.reduce((total, item) => total + item.score, 0) / prerequisites.length) : 100;
    return { prerequisites, score, ready: score >= 70 && prerequisites.every(item => item.completed) };
  }

  function renderProjectReadiness() {
    const cards = projectChapters().map(project => {
      const readiness = projectReadiness(project);
      const status = state.completed[project.id] ? 'completed' : readiness.ready ? 'ready' : 'preparing';
      const statusLabel = status === 'completed' ? 'Concluído' : status === 'ready' ? 'Preparado para começar' : 'Preparação pendente';
      const requirements = readiness.prerequisites.map(item => `<button type="button" data-learning-chapter="${item.chapter.id}"><span>${item.completed ? '✓' : '○'}</span><span>${escapeHtml(item.chapter.title)}<small>${item.completed ? `concluído · evidência ${item.evidence}%` : 'capítulo ainda não concluído'}</small></span></button>`).join('');
      return `<article class="project-readiness ${status}"><header><div><span class="mastery-status ${status === 'ready' || status === 'completed' ? 'consolidated' : 'learning'}">${statusLabel}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.phaseTitle)}</p></div><div class="readiness-score"><b>${readiness.score}%</b><span>prontidão</span></div></header><div class="project-readiness-track"><i style="width:${readiness.score}%"></i></div><details><summary>Ver requisitos (${readiness.prerequisites.filter(item => item.completed).length}/${readiness.prerequisites.length})</summary><div class="project-requirements">${requirements || '<p>Este projeto não possui pré-requisito obrigatório.</p>'}</div></details><footer><p>${readiness.ready ? 'Você concluiu os fundamentos e já produziu evidências suficientes para tentar.' : 'Você pode abrir o projeto agora, mas os itens pendentes indicam onde a implementação provavelmente ficará difícil.'}</p><button class="primary-btn" type="button" data-learning-chapter="${project.id}">${readiness.ready ? 'Começar projeto' : 'Abrir mesmo assim'}</button></footer></article>`;
    }).join('');
    $('#learning-stage').innerHTML = `<div class="project-readiness-intro"><h3>Projetos recomendados pelo seu preparo</h3><p>A prontidão combina capítulos concluídos e evidências reais por conceito. Ela orienta a sequência, mas nunca bloqueia o acesso ao projeto.</p></div><div class="project-readiness-list">${cards}</div>`;
  }

  const snippets = {
    hello: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Olá, Java!");\n    }\n}`,
    variables: `public class Main {\n    public static void main(String[] args) {\n        int aulas = 7;\n        int minutos = 25;\n        int total = aulas * minutos;\n        System.out.println("Tempo total: " + total + " minutos");\n    }\n}`,
    loop: `public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Iteração " + i);\n        }\n    }\n}`
  };

  function chapterSnippet() {
    const code = mount.querySelector('pre.code')?.innerText.trim();
    return code || snippets.hello;
  }

  function loadLabDraft() {
    if (!$('#lab-editor')) return;
    if (document.activeElement === $('#lab-editor')) return;
    $('#lab-editor').value = state.labs[activeId] || chapterSnippet();
    $('#lab-snippets').value = 'chapter';
  }

  function saveLabDraft() {
    state.labs[activeId] = $('#lab-editor').value;
    save();
    $('#lab-save-status').textContent = 'Rascunho salvo agora';
  }

  function splitStatements(source) {
    const statements = [];
    let current = '';
    let quote = null;
    let escaped = false;
    for (const character of source) {
      if (escaped) { current += character; escaped = false; continue; }
      if (character === '\\' && quote) { current += character; escaped = true; continue; }
      if ((character === '"' || character === "'") && (!quote || quote === character)) quote = quote ? null : character;
      if (character === ';' && !quote) { statements.push(current.trim()); current = ''; }
      else current += character;
    }
    if (current.trim()) statements.push(current.trim());
    return statements;
  }

  function splitPlus(expression) {
    const pieces = [];
    let current = '';
    let quote = null;
    let depth = 0;
    let escaped = false;
    for (const character of expression) {
      if (escaped) { current += character; escaped = false; continue; }
      if (character === '\\' && quote) { current += character; escaped = true; continue; }
      if ((character === '"' || character === "'") && (!quote || quote === character)) quote = quote ? null : character;
      if (!quote && character === '(') depth++;
      if (!quote && character === ')') depth--;
      if (!quote && character === '+' && depth === 0) { pieces.push(current.trim()); current = ''; }
      else current += character;
    }
    pieces.push(current.trim());
    return pieces;
  }

  function resolveTerm(term, variables) {
    const clean = term.trim();
    if (/^"(?:[^"\\]|\\.)*"$/.test(clean)) {
      try { return JSON.parse(clean); } catch { return clean.slice(1, -1); }
    }
    if (/^'(?:[^'\\]|\\.)*'$/.test(clean)) return clean.slice(1, -1);
    if (clean === 'true') return true;
    if (clean === 'false') return false;
    if (Object.prototype.hasOwnProperty.call(variables, clean)) return variables[clean];
    const substituted = clean.replace(/\b[A-Za-z_$][\w$]*\b/g, name => {
      if (!Object.prototype.hasOwnProperty.call(variables, name) || typeof variables[name] !== 'number') throw new Error(`Variável não encontrada ou não numérica: ${name}`);
      return String(variables[name]);
    });
    if (!/^[\d\s+\-*/%().]+$/.test(substituted)) throw new Error(`Expressão ainda não suportada: ${clean}`);
    const value = Function(`"use strict"; return (${substituted})`)();
    if (!Number.isFinite(value)) throw new Error(`Resultado numérico inválido: ${clean}`);
    return value;
  }

  function resolveExpression(expression, variables) {
    const pieces = splitPlus(expression);
    if (pieces.length === 1) return resolveTerm(pieces[0], variables);
    let result = resolveTerm(pieces[0], variables);
    for (const piece of pieces.slice(1)) {
      const value = resolveTerm(piece, variables);
      result = typeof result === 'string' || typeof value === 'string' ? String(result) + String(value) : Number(result) + Number(value);
    }
    return result;
  }

  function runJavaSubset(source) {
    const output = [];
    const variables = {};
    let ignored = 0;
    let cleaned = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

    const loopPattern = /for\s*\(\s*int\s+(\w+)\s*=\s*(-?\d+)\s*;\s*\1\s*(<=|<|>=|>)\s*(-?\d+)\s*;\s*\1(\+\+|--)\s*\)\s*\{([\s\S]*?)\}/g;
    const loops = [];
    cleaned = cleaned.replace(loopPattern, (_, name, start, operator, end, direction, body) => {
      const token = `__LOOP_${loops.length}__`;
      loops.push({ name, start: Number(start), operator, end: Number(end), direction, body });
      return token + ';';
    });
    cleaned = cleaned
      .replace(/(?:public\s+)?class\s+\w+(?:\s+extends\s+\w+)?\s*\{/g, '')
      .replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/g, '')
      .replace(/[{}]/g, ';');

    function executeBlock(block) {
      for (let statement of splitStatements(block)) {
        statement = statement.replace(/^[{}\s]+|[{}\s]+$/g, '').trim();
        if (!statement) continue;
        const loopToken = statement.match(/__LOOP_(\d+)__/);
        if (loopToken) {
          const loop = loops[Number(loopToken[1])];
          const compare = value => ({ '<': value < loop.end, '<=': value <= loop.end, '>': value > loop.end, '>=': value >= loop.end })[loop.operator];
          let guard = 0;
          for (let value = loop.start; compare(value); value += loop.direction === '++' ? 1 : -1) {
            variables[loop.name] = value;
            executeBlock(loop.body);
            if (++guard > 500) throw new Error('Laço interrompido após 500 iterações.');
          }
          continue;
        }
        const print = statement.match(/System\.out\.(println|print)\s*\(([\s\S]*)\)$/);
        if (print) {
          const value = print[2].trim() ? resolveExpression(print[2], variables) : '';
          if (print[1] === 'println' || !output.length) output.push(String(value));
          else output[output.length - 1] += String(value);
          if (output.length > 1000) throw new Error('Saída interrompida após 1.000 linhas.');
          continue;
        }
        const declaration = statement.match(/(?:final\s+)?(?:byte|short|int|long|float|double|String|boolean|var)\s+(\w+)\s*=\s*([\s\S]+)$/);
        if (declaration) { variables[declaration[1]] = resolveExpression(declaration[2], variables); continue; }
        const increment = statement.match(/^(\w+)(\+\+|--)$/);
        if (increment && typeof variables[increment[1]] === 'number') { variables[increment[1]] += increment[2] === '++' ? 1 : -1; continue; }
        const assignment = statement.match(/^(\w+)\s*=\s*([\s\S]+)$/);
        if (assignment && Object.prototype.hasOwnProperty.call(variables, assignment[1])) { variables[assignment[1]] = resolveExpression(assignment[2], variables); continue; }
        if (/^(?:package|import|public\s+class|class\s+|public\s+static\s+void\s+main|static\s+void\s+main)/.test(statement)) { ignored++; continue; }
        if (/\b(if|while|switch|new|return|try|catch)\b/.test(statement)) throw new Error(`Recurso exige o JDK completo: ${statement.slice(0, 55)}…`);
        ignored++;
      }
    }
    executeBlock(cleaned);
    return { output: output.join('\n'), ignored };
  }

  function executeLab() {
    const consoleElement = $('#lab-console');
    consoleElement.classList.remove('error');
    try {
      const result = runJavaSubset($('#lab-editor').value);
      consoleElement.textContent = (result.output || '(programa finalizado sem saída)') + (result.ignored ? `\n\n[runner local ignorou ${result.ignored} linha(s) estrutural(is)]` : '');
      saveLabDraft();
    } catch (error) {
      consoleElement.classList.add('error');
      consoleElement.textContent = `Erro do runner didático: ${error.message}\n\nBaixe o .java para compilar recursos completos com o JDK.`;
    }
  }

  const systemDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const systemHighContrast = window.matchMedia('(prefers-contrast: more)');
  const systemForcedColors = window.matchMedia('(forced-colors: active)');

  function resolvedTheme() {
    if (state.settings.theme === 'light' || state.settings.theme === 'contrast') return state.settings.theme;
    if (systemHighContrast.matches || systemForcedColors.matches) return 'contrast';
    return systemDarkTheme.matches ? 'contrast' : 'light';
  }

  function applySettings() {
    const theme = resolvedTheme();
    document.body.dataset.theme = theme;
    document.documentElement.style.setProperty('--reader-scale', Number(state.settings.fontScale) || 1);
    document.body.classList.toggle('focus-mode', Boolean(state.settings.focusMode));
    document.body.classList.toggle('review-mode', Boolean(state.settings.reviewMode));
    document.body.classList.toggle('reduce-motion', Boolean(state.settings.reduceMotion));
    $('meta[name="theme-color"]').content = theme === 'light' ? '#f6f1e7' : '#050505';
    updateSettingsUI();
  }

  function updateSettingsUI() {
    if (!$('#theme-control')) return;
    $$('#theme-control button').forEach(button => button.classList.toggle('active', button.dataset.themeValue === state.settings.theme));
    const systemStatus = $('#theme-system-status');
    if (systemStatus) systemStatus.textContent = state.settings.theme === 'system'
      ? `Seguindo o sistema: ${resolvedTheme() === 'contrast' ? 'alto contraste' : 'claro'}.`
      : 'Escolha Sistema para acompanhar automaticamente o dispositivo.';
    $$('#font-control button').forEach(button => button.classList.toggle('active', Number(button.dataset.fontValue) === Number(state.settings.fontScale)));
    $('#focus-toggle').textContent = state.settings.focusMode ? 'Desativar' : 'Ativar';
    $('#review-mode-toggle').textContent = state.settings.reviewMode ? 'Desativar' : 'Ativar';
    $('#motion-toggle').textContent = state.settings.reduceMotion ? 'Desativar' : 'Ativar';
    $('#daily-goal').value = String(state.settings.dailyGoal);
    updateStorageStatus();
  }

  async function updateStorageStatus() {
    const element = $('#storage-status');
    if (!element) return;
    const localSize = new Blob([JSON.stringify(state)]).size;
    let message = `Armazenamento principal: ${storageBackend}. Seus dados de estudo ocupam ${(localSize / 1024).toFixed(1)} KB.`;
    if (navigator.storage?.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) message += ` Uso total do site: ${(estimate.usage / 1024 / 1024).toFixed(1)} MB.`;
      } catch { /* estimativa opcional */ }
    }
    element.textContent = message;
  }

  function exportData() {
    const backup = {
      app: 'Stack Completa Java',
      version: 9,
      exportedAt: new Date().toISOString(),
      chapterCount: chapters.length,
      data: state
    };
    downloadText(`stack-completa-backup-${todayKey()}.json`, JSON.stringify(backup, null, 2), 'application/json');
    toast('Backup completo exportado.');
  }

  async function importData(file) {
    try {
      const parsed = JSON.parse(await file.text());
      const imported = parsed.data || parsed;
      if (!imported || typeof imported !== 'object' || (!imported.completed && !imported.notes && !imported.checklists)) throw new Error('estrutura incompatível');
      if (!confirm('Importar este backup substituirá os dados atuais deste curso. Continuar?')) return;
      state = normalizeState(imported);
      await save();
      toast('Backup importado. Recarregando o curso…');
      setTimeout(() => location.reload(), 600);
    } catch (error) {
      toast(`Não foi possível importar: ${error.message}.`);
    }
  }

  function openCommand() {
    closeHub();
    commandOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('#command-input').value = '';
    commandSelection = 0;
    renderCommands('');
    setTimeout(() => $('#command-input').focus(), 30);
  }

  function closeCommand() {
    commandOverlay.classList.remove('open');
    if (!studyOverlay.classList.contains('open')) document.body.style.overflow = '';
  }

  const commands = [
    { title: 'Abrir visão geral', hint: 'Central', action: () => openHub('dashboard') },
    { title: 'Criar anotação neste capítulo', hint: 'N', action: () => openHub('notes') },
    { title: 'Abrir fila de revisão', hint: 'R', action: () => openHub('review') },
    { title: 'Abrir mapa de domínio e erros', hint: 'M', action: () => openHub('learning') },
    { title: 'Abrir Java Lab', hint: 'L', action: () => openHub('lab') },
    { title: 'Pesquisar no glossário', hint: 'G', action: () => openHub('glossary') },
    { title: 'Abrir preferências e backup', hint: 'Configurações', action: () => openHub('settings') },
    { title: 'Favoritar/desfavoritar capítulo', hint: 'F', action: toggleFavorite },
    { title: 'Concluir/desmarcar capítulo', hint: 'C', action: toggleComplete },
    { title: 'Alternar modo foco', hint: 'Leitura', action: () => { state.settings.focusMode = !state.settings.focusMode; save(); applySettings(); } }
  ];

  function renderCommands(query) {
    const needle = normalizeSearchText(query);
    const actions = commands.filter(command => !needle || normalizeSearchText(command.title).includes(needle));
    const chapterMatches = chapters.filter(chapter => !needle || normalizeSearchText(chapter.title).includes(needle)).slice(0, 30);
    commandItems = [
      ...actions.map(command => ({ ...command, kind: 'Ação' })),
      ...chapterMatches.map(chapter => ({ title: chapter.title, hint: `${chapter.index + 1} · ${chapter.phaseTitle}`, kind: 'Capítulo', action: () => render(chapter.id) }))
    ];
    commandSelection = Math.min(commandSelection, Math.max(0, commandItems.length - 1));
    $('#command-results').innerHTML = commandItems.length
      ? commandItems.map((item, index) => `<button class="command-item ${index === commandSelection ? 'selected' : ''}" type="button" data-command-index="${index}"><span><small>${escapeHtml(item.kind)}</small><br>${escapeHtml(item.title)}</span><small>${escapeHtml(item.hint)}</small></button>`).join('')
      : '<div class="review-empty">Nenhum comando ou capítulo encontrado.</div>';
  }

  function runCommand(index) {
    const item = commandItems[index];
    if (!item) return;
    closeCommand();
    item.action();
  }

  function updateConnectionStatus() {
    const online = navigator.onLine;
    $('#connection-dot').classList.toggle('offline', !online);
    $('#connection-label').textContent = online ? 'Online · offline ativado' : 'Offline · curso disponível';
    $('#offline-banner').classList.toggle('visible', !online);
  }

  async function setupOffline() {
    const detail = $('#offline-detail');
    const install = $('#install-app');
    if (location.protocol === 'file:') {
      detail.textContent = 'Este arquivo já abre sem internet. Para instalar como app e receber atualizações, sirva a pasta em localhost ou HTTPS.';
      install.disabled = true;
      install.textContent = 'Abra via localhost';
      return;
    }
    if (!('serviceWorker' in navigator)) {
      detail.textContent = 'O navegador não oferece Service Worker; o HTML continua utilizável localmente.';
      install.disabled = true;
      return;
    }
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      await navigator.serviceWorker.ready;
      detail.textContent = 'Conteúdo integral armazenado neste dispositivo e pronto para abrir sem internet.';
      $('#refresh-offline').addEventListener('click', async () => {
        await registration.update();
        registration.active?.postMessage({ type: 'CACHE_COURSE' });
        toast('Cache offline atualizado.');
      });
    } catch (error) {
      detail.textContent = `Não foi possível ativar o cache automático: ${error.message}`;
    }
  }

  function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoro.remaining / 60);
    const seconds = pomodoro.remaining % 60;
    $('#pomodoro-display').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    $('#pomodoro-mode').textContent = pomodoro.breakMode ? 'Pausa de recuperação · 5 min' : 'Sessão de concentração · 25 min';
    $('#pomodoro-toggle').textContent = pomodoro.running ? 'Pausar' : 'Iniciar';
  }

  function togglePomodoro() {
    pomodoro.running = !pomodoro.running;
    clearInterval(pomodoro.timer);
    if (pomodoro.running) {
      pomodoro.timer = setInterval(() => {
        pomodoro.remaining--;
        if (pomodoro.remaining <= 0) {
          clearInterval(pomodoro.timer);
          pomodoro.running = false;
          pomodoro.breakMode = !pomodoro.breakMode;
          pomodoro.remaining = pomodoro.breakMode ? 5 * 60 : 25 * 60;
          toast(pomodoro.breakMode ? 'Foco concluído. Respire por 5 minutos.' : 'Pausa concluída. Pronto para outra sessão?');
          if ('Notification' in window && Notification.permission === 'granted') new Notification('Stack Completa', { body: pomodoro.breakMode ? 'Sessão concluída. Hora da pausa.' : 'Pausa concluída. Vamos continuar?' });
        }
        updatePomodoroDisplay();
      }, 1000);
    }
    updatePomodoroDisplay();
  }

  function resetPomodoro() {
    clearInterval(pomodoro.timer);
    pomodoro = { remaining: 25 * 60, running: false, breakMode: false, timer: null };
    updatePomodoroDisplay();
  }

  $('#course-nav').addEventListener('click', event => {
    const button = event.target.closest('[data-chapter]');
    if (button) render(button.dataset.chapter);
  });
  $('#practice-filter').addEventListener('click', event => {
    practiceOnly = !practiceOnly;
    event.currentTarget.classList.toggle('active', practiceOnly);
    event.currentTarget.textContent = practiceOnly ? 'Mostrando mini-projetos' : 'Focar somente na prática';
    filterNavigation();
  });
  $('#favorites-filter').addEventListener('click', event => {
    favoritesOnly = !favoritesOnly;
    event.currentTarget.classList.toggle('active', favoritesOnly);
    event.currentTarget.textContent = favoritesOnly ? '★ Favoritos' : '☆ Favoritos';
    filterNavigation();
  });
  search.addEventListener('input', filterNavigation);
  previous.addEventListener('click', () => render(chapters[indexById.get(activeId) - 1]?.id));
  next.addEventListener('click', () => render(chapters[indexById.get(activeId) + 1]?.id));
  complete.addEventListener('click', toggleComplete);
  $('#favorite-chapter').addEventListener('click', toggleFavorite);
  $('#sidebar-open').addEventListener('click', openSidebar);
  $('#sidebar-close').addEventListener('click', closeSidebar);
  backdrop.addEventListener('click', closeSidebar);
  $$('[data-open-hub]').forEach(button => button.addEventListener('click', () => openHub(button.dataset.openHub)));
  $$('.hub-tab').forEach(button => button.addEventListener('click', () => selectHubTab(button.dataset.hubTab)));
  $('#hub-close').addEventListener('click', closeHub);
  studyOverlay.addEventListener('click', event => { if (event.target === studyOverlay) closeHub(); });
  commandOverlay.addEventListener('click', event => { if (event.target === commandOverlay) closeCommand(); });

  mount.addEventListener('click', async event => {
    const retrievalOption = event.target.closest('[data-retrieval-option]')?.dataset.retrievalOption;
    if (retrievalOption !== undefined) { answerRetrieval(Number(retrievalOption)); return; }
    if (event.target.closest('[data-retrieval-continue]')) {
      event.target.closest('.retrieval-card')?.nextElementSibling?.scrollIntoView({ behavior: state.settings.reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const contextualTerm = event.target.closest('[data-glossary-key]');
    if (contextualTerm) { openGlossaryPopover(glossaryByKey.get(contextualTerm.dataset.glossaryKey), contextualTerm); return; }
    const internal = event.target.closest('a[href^="#"]');
    if (internal) { event.preventDefault(); render(internal.getAttribute('href').slice(1)); return; }
    const reveal = event.target.closest('.reveal-btn');
    if (reveal) {
      const solution = reveal.nextElementSibling;
      solution?.classList.toggle('open');
      reveal.textContent = solution?.classList.contains('open') ? 'Ocultar solução' : 'Ver solução';
      return;
    }
    const option = event.target.closest('.quiz-opt');
    if (option) {
      const quiz = option.closest('.quiz');
      if (!quiz || quiz.dataset.answered) return;
      const quizIndex = [...mount.querySelectorAll('.quiz')].indexOf(quiz);
      const selected = [...quiz.querySelectorAll('.quiz-opt')].indexOf(option);
      const correct = option.dataset.correct === 'true';
      quiz.dataset.answered = '1';
      quiz.querySelectorAll('.quiz-opt').forEach(item => {
        if (item.dataset.correct === 'true') item.classList.add('correct');
        else if (item === option) item.classList.add('wrong');
      });
      const feedback = quiz.querySelector('.quiz-feedback');
      if (feedback) feedback.textContent = correct ? '✓ Correto — resposta salva.' : '✗ Revise a alternativa destacada.';
      state.quizAnswers[`${activeId}:${quizIndex}`] = { selected, correct, answeredAt: new Date().toISOString() };
      const chapter = byId.get(activeId);
      const questionOptions = [...quiz.querySelectorAll('.quiz-opt')].map(item => ({
        text: item.textContent.replace(/\s+/g, ' ').trim(),
        correct: item.dataset.correct === 'true'
      }));
      const prompt = quiz.querySelector('.q')?.textContent.replace(/\s+/g, ' ').trim() || `Questão do capítulo “${chapter.title}”`;
      const question = finalizeLearningQuestion(chapter, {
        prompt,
        options: questionOptions,
        explanation: `Resposta correta: ${questionOptions.find(item => item.correct)?.text || ''}`
      }, conceptForQuestion(chapter, `${prompt} ${questionOptions.map(item => item.text).join(' ')}`, quizIndex), 'quiz do capítulo');
      recordLearningEvidence({ chapter, question, selectedIndex: selected, source: 'quiz' });
      recordActivity('quizzes');
      updateDashboard();
      return;
    }
    const copy = event.target.closest('.copy-btn');
    if (copy) {
      await copyText(copy.parentElement.querySelector('pre').innerText);
      copy.textContent = 'Copiado';
      copy.classList.add('copied');
      setTimeout(() => { copy.textContent = 'Copiar'; copy.classList.remove('copied'); }, 1200);
      return;
    }
    const tab = event.target.closest('.install-tab');
    if (tab) {
      const box = tab.closest('.install-box');
      const tabs = [...box.querySelectorAll('.install-tab')];
      const panels = [...box.querySelectorAll('.install-panel')];
      const tabIndex = tabs.indexOf(tab);
      tabs.forEach(item => item.classList.toggle('active', item === tab));
      panels.forEach((item, panelIndex) => item.classList.toggle('active', panelIndex === tabIndex));
    }
  });

  mount.addEventListener('change', event => {
    if (!event.target.matches('.checklist input')) return;
    const inputs = [...mount.querySelectorAll('.checklist input')];
    const inputIndex = inputs.indexOf(event.target);
    state.checklists[activeId] ||= {};
    state.checklists[activeId][inputIndex] = event.target.checked;
    save();
    event.target.nextElementSibling?.classList.toggle('done', event.target.checked);
  });

  $('#daily-goal').addEventListener('change', event => { state.settings.dailyGoal = Number(event.target.value); save(); updateDashboard(); });
  $('#continue-study').addEventListener('click', closeHub);
  $('#note-editor').addEventListener('input', handleNoteInput);
  $('#note-editor').addEventListener('keydown', event => {
    const modifier = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();
    if (modifier && event.shiftKey && ['e', 's', 'p'].includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      setNoteView({ e: 'edit', s: 'split', p: 'preview' }[key]);
      return;
    }
    if (modifier && !event.shiftKey && ['b', 'i', 'k'].includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      applyMarkdownAction({ b: 'bold', i: 'italic', k: 'link' }[key]);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      replaceNoteSelection('  ', event.currentTarget.selectionStart, event.currentTarget.selectionEnd, 2, 2);
    }
  });
  $('#note-preview').addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (!(event.ctrlKey || event.metaKey) || !event.shiftKey || !['e', 's', 'p'].includes(key)) return;
    event.preventDefault();
    event.stopPropagation();
    setNoteView({ e: 'edit', s: 'split', p: 'preview' }[key]);
  });
  $('#note-preview').addEventListener('change', event => {
    const task = event.target.closest('[data-markdown-task]');
    if (task) toggleMarkdownTask(Number(task.dataset.markdownTask), task.checked);
  });
  $('.note-view-tabs').addEventListener('click', event => {
    const view = event.target.closest('[data-note-view]')?.dataset.noteView;
    if (view) setNoteView(view);
  });
  $('.markdown-tools').addEventListener('click', event => {
    const action = event.target.closest('[data-markdown-action]')?.dataset.markdownAction;
    if (action) applyMarkdownAction(action);
  });
  $('#note-chapter-list').addEventListener('click', event => {
    const button = event.target.closest('[data-note-chapter]');
    if (button) { closeHub(); render(button.dataset.noteChapter); setTimeout(() => openHub('notes'), 80); }
  });
  $('#copy-note').addEventListener('click', async () => { await copyText($('#note-editor').value); toast('Markdown copiado.'); });
  $('#download-note').addEventListener('click', () => {
    const chapter = byId.get(activeId);
    downloadText(`${String(chapter.index + 1).padStart(3, '0')}-${chapter.id}.md`, $('#note-editor').value, 'text/markdown;charset=utf-8');
  });
  $('#clear-note').addEventListener('click', () => {
    if (!$('#note-editor').value || confirm('Limpar definitivamente a anotação deste capítulo?')) {
      $('#note-editor').value = '';
      renderNotePreview('');
      saveCurrentNote();
    }
  });

  $('#review-stage').addEventListener('click', event => {
    const filter = event.target.closest('[data-review-plan-filter]')?.dataset.reviewPlanFilter;
    if (filter) {
      reviewPlanFilter = filter;
      updateReviewPanel();
      return;
    }
    const bulkChoice = event.target.closest('[data-review-plan-bulk]')?.dataset.reviewPlanBulk;
    if (bulkChoice) {
      setAllReviewChoices(bulkChoice);
      return;
    }
    const deferredChapter = event.target.closest('[data-review-plan-defer]')?.dataset.reviewPlanDefer;
    if (deferredChapter) {
      setReviewChoice(deferredChapter, 'deferred');
      return;
    }
    const option = event.target.closest('[data-review-option]')?.dataset.reviewOption;
    if (option !== undefined) {
      answerReview(Number(option));
      return;
    }
    if (event.target.closest('[data-review-next]')) {
      updateReviewPanel();
      return;
    }
    const chapterId = event.target.closest('[data-review-open]')?.dataset.reviewOpen;
    if (chapterId) { closeHub(); render(chapterId); }
  });
  $('#review-stage').addEventListener('change', event => {
    const checkbox = event.target.closest('[data-review-plan-toggle]');
    if (checkbox) setReviewChoice(checkbox.dataset.reviewPlanToggle, checkbox.checked ? 'selected' : 'deferred');
  });

  $('.learning-tabs').addEventListener('click', event => {
    const view = event.target.closest('[data-learning-view]')?.dataset.learningView;
    if (!view) return;
    learningHubView = view;
    activeErrorId = null;
    renderLearningPanel();
  });
  $('#learning-stage').addEventListener('click', event => {
    const chapterId = event.target.closest('[data-learning-chapter]')?.dataset.learningChapter;
    if (chapterId && byId.has(chapterId)) { closeHub(); render(chapterId); return; }
    const errorFilterValue = event.target.closest('[data-error-filter]')?.dataset.errorFilter;
    if (errorFilterValue) { errorFilter = errorFilterValue; activeErrorId = null; renderErrorNotebook(); return; }
    const practiceId = event.target.closest('[data-error-practice]')?.dataset.errorPractice;
    if (practiceId && state.errors[practiceId]) {
      activeErrorId = practiceId;
      if (!state.errors[practiceId].resolved) {
        delete state.errors[practiceId].lastPracticeAt;
        delete state.errors[practiceId].lastPracticeSelected;
        delete state.errors[practiceId].lastPracticeCorrect;
      }
      renderErrorNotebook();
      return;
    }
    if (event.target.closest('[data-error-close]')) { activeErrorId = null; renderErrorNotebook(); return; }
    const errorOption = event.target.closest('[data-error-option]')?.dataset.errorOption;
    if (errorOption !== undefined) { answerErrorPractice(Number(errorOption)); return; }
    if (event.target.closest('[data-diagnostic-start]')) { startDiagnostic($('#diagnostic-scope').value); return; }
    const diagnosticOption = event.target.closest('[data-diagnostic-option]')?.dataset.diagnosticOption;
    if (diagnosticOption !== undefined) { answerDiagnostic(Number(diagnosticOption)); return; }
    if (event.target.closest('[data-diagnostic-next]')) { advanceDiagnostic(); return; }
    if (event.target.closest('[data-diagnostic-cancel]') && confirm('Encerrar este diagnóstico sem salvar um resultado final? As evidências das questões já respondidas permanecem.')) {
      state.diagnostic.active = null;
      save();
      renderDiagnostic();
    }
  });
  $('#learning-stage').addEventListener('change', event => {
    if (event.target.id === 'mastery-status-filter') {
      masteryStatusFilter = event.target.value;
      renderMasteryOverview();
    }
  });
  $('#learning-stage').addEventListener('input', event => {
    if (event.target.id !== 'mastery-search') return;
    masterySearch = event.target.value;
    renderMasteryOverview();
    const field = $('#mastery-search');
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
  });

  $('#lab-editor').addEventListener('input', () => {
    $('#lab-save-status').textContent = 'Salvando…';
    clearTimeout(labSaveTimer);
    labSaveTimer = setTimeout(saveLabDraft, 500);
  });
  $('#lab-editor').addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const editor = event.currentTarget;
      editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end');
      editor.dispatchEvent(new Event('input'));
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); executeLab(); }
  });
  $('#lab-snippets').addEventListener('change', event => {
    const value = event.target.value;
    const nextValue = value === 'chapter' ? chapterSnippet() : snippets[value];
    if ($('#lab-editor').value.trim() && !confirm('Substituir o rascunho atual por este exemplo?')) { event.target.value = 'chapter'; return; }
    $('#lab-editor').value = nextValue;
    saveLabDraft();
  });
  $('#lab-run').addEventListener('click', executeLab);
  $('#lab-copy').addEventListener('click', async () => { await copyText($('#lab-editor').value); toast('Código copiado.'); });
  $('#lab-download').addEventListener('click', () => downloadText('Main.java', $('#lab-editor').value, 'text/x-java-source'));

  $('#glossary-search').addEventListener('input', event => renderGlossary(event.target.value));
  $('#context-glossary-list').addEventListener('click', event => {
    const card = event.target.closest('[data-glossary-card]');
    if (card) openGlossaryPopover(glossaryByKey.get(card.dataset.glossaryCard), card);
  });
  $('#context-glossary-list').addEventListener('keydown', event => {
    const card = event.target.closest('[data-glossary-card]');
    if (card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openGlossaryPopover(glossaryByKey.get(card.dataset.glossaryCard), card); }
  });
  $('#glossary-popover-close').addEventListener('click', closeGlossaryPopover);
  $('#glossary-related-chapter').addEventListener('click', event => {
    const chapter = event.currentTarget.dataset.chapter;
    closeGlossaryPopover();
    closeHub();
    if (chapter) render(chapter);
  });
  $('#glossary-open-all').addEventListener('click', () => { closeGlossaryPopover(); openHub('glossary'); });
  document.addEventListener('pointerdown', event => {
    if ($('#glossary-popover').classList.contains('open') && !event.target.closest('#glossary-popover,[data-glossary-key],[data-glossary-card]')) closeGlossaryPopover();
  });

  $('#theme-control').addEventListener('click', event => {
    const value = event.target.closest('[data-theme-value]')?.dataset.themeValue;
    if (!value) return;
    state.settings.theme = value;
    save();
    applySettings();
  });
  $('#font-control').addEventListener('click', event => {
    const value = event.target.closest('[data-font-value]')?.dataset.fontValue;
    if (!value) return;
    state.settings.fontScale = Number(value);
    save();
    applySettings();
  });
  $('#focus-toggle').addEventListener('click', () => { state.settings.focusMode = !state.settings.focusMode; save(); applySettings(); });
  $('#review-mode-toggle').addEventListener('click', () => { state.settings.reviewMode = !state.settings.reviewMode; save(); applySettings(); });
  $('#motion-toggle').addEventListener('click', () => { state.settings.reduceMotion = !state.settings.reduceMotion; save(); applySettings(); });
  $('#export-data').addEventListener('click', exportData);
  $('#import-data').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', event => { if (event.target.files[0]) importData(event.target.files[0]); event.target.value = ''; });
  $('#reset-data').addEventListener('click', async () => {
    if (!confirm('Apagar todo o seu progresso, notas, favoritos, respostas, revisões, mapa de domínio, caderno de erros, diagnósticos e rascunhos? Esta ação não pode ser desfeita sem um backup.')) return;
    isResettingData = true;
    await storageWriteQueue.catch(() => undefined);
    if (database) await deleteDatabaseState();
    try { localStorage.removeItem(stateKey); } catch { /* armazenamento legado pode estar bloqueado */ }
    toast('Dados locais removidos. Recarregando…');
    setTimeout(() => location.reload(), 600);
  });

  $('#command-input').addEventListener('input', event => { commandSelection = 0; renderCommands(event.target.value); });
  $('#command-input').addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); commandSelection = Math.min(commandItems.length - 1, commandSelection + 1); renderCommands(event.currentTarget.value); }
    if (event.key === 'ArrowUp') { event.preventDefault(); commandSelection = Math.max(0, commandSelection - 1); renderCommands(event.currentTarget.value); }
    if (event.key === 'Enter') { event.preventDefault(); runCommand(commandSelection); }
  });
  $('#command-results').addEventListener('click', event => {
    const index = event.target.closest('[data-command-index]')?.dataset.commandIndex;
    if (index !== undefined) runCommand(Number(index));
  });

  $('#pomodoro-toggle').addEventListener('click', togglePomodoro);
  $('#pomodoro-reset').addEventListener('click', resetPomodoro);

  document.addEventListener('keydown', event => {
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) || event.target.isContentEditable;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openCommand(); return; }
    if (event.key === 'Escape') { closeSidebar(); closeHub(); closeCommand(); closeGlossaryPopover(); return; }
    if (typing) return;
    if (event.key === '/') { event.preventDefault(); openSidebar(); search.focus(); }
    if (event.altKey && event.key === 'ArrowLeft') previous.click();
    if (event.altKey && event.key === 'ArrowRight') next.click();
    if (!event.ctrlKey && !event.metaKey && !event.altKey) {
      if (event.key.toLowerCase() === 'f') toggleFavorite();
      if (event.key.toLowerCase() === 'n') openHub('notes');
      if (event.key.toLowerCase() === 'r') openHub('review');
      if (event.key.toLowerCase() === 'm') openHub('learning');
      if (event.key.toLowerCase() === 'l') openHub('lab');
      if (event.key.toLowerCase() === 'g') openHub('glossary');
      if (event.key.toLowerCase() === 'c') toggleComplete();
    }
  });

  window.addEventListener('scroll', () => { updateReadingProgress(); closeGlossaryPopover(); }, { passive: true });
  window.addEventListener('resize', updateReadingProgress);
  window.addEventListener('hashchange', () => render(location.hash.slice(1), false));
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
  [systemDarkTheme, systemHighContrast, systemForcedColors].forEach(mediaQuery => {
    const handleSystemThemeChange = () => { if (state.settings.theme === 'system') applySettings(); };
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleSystemThemeChange);
    else mediaQuery.addListener(handleSystemThemeChange);
  });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    $('#install-app').disabled = false;
    $('#install-app').textContent = 'Instalar app';
  });
  window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; $('#install-app').textContent = 'App instalado'; toast('Curso instalado com sucesso.'); });
  $('#install-app').addEventListener('click', async () => {
    if (!deferredInstallPrompt) { toast('Use a opção “Instalar aplicativo” do menu do navegador quando ela aparecer.'); return; }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  });

  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    recordActivity('minutes');
    updateDashboard();
  }, 60000);

  applySettings();
  updateConnectionStatus();
  updatePomodoroDisplay();
  setupOffline();
  render(activeId);
  if (migratedFromLocalStorage) toast('Progresso migrado com segurança para o IndexedDB.');
  const deepLink = new URLSearchParams(location.search);
  const requestedHub = deepLink.get('hub');
  const requestedSearch = deepLink.get('search');
  const requestedLearningView = deepLink.get('learning');
  if (['overview', 'errors', 'diagnostic', 'projects'].includes(requestedLearningView)) learningHubView = requestedLearningView;
  if (requestedSearch) {
    search.value = requestedSearch;
    filterNavigation();
  }
  if (['dashboard', 'notes', 'review', 'learning', 'lab', 'glossary', 'settings'].includes(requestedHub)) openHub(requestedHub);
})();
