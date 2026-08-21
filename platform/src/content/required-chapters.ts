import type {
  Chapter,
  ContentBlock,
  EnglishActivity,
  EnglishLevel,
  ProjectGuidance,
  Resource
} from '@/content/schema';

interface ChapterInput {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  why: string;
  prerequisites: string[];
  concepts: Array<[string, string]>;
  decision: string;
  prediction: [string, string];
  exercise: [string, string, string[]];
  quiz: [string, string, string, string];
  code?: [string, string];
  project?: [string, string[], ProjectGuidance, string[]];
  resources: Array<[Resource['type'], string, string, string]>;
  englishLevel: EnglishLevel;
}

const englishTopics: Record<string, string> = {
  'associacoes-cardinalidade': 'object associations and cardinality',
  'functional-semantics-lab': 'Optional, Set, lambdas, and Stream semantics',
  'jdbc-under-the-hood': 'JDBC resource and transaction ownership',
  'http-wire-contract': 'HTTP wire contract',
  'java-httpclient-json': 'Java HttpClient and JSON boundary',
  'unreliable-api-client': 'unreliable external API client',
  'pure-java-api-project': 'pure Java API integration project',
  'rest-resource-contracts': 'REST resource contract',
  'api-contract-evolution': 'API contract evolution',
  'tcp-protocol-design': 'TCP protocol design',
  'lanterna-tui': 'Lanterna terminal interface',
  'java-developer-tool': 'Java developer tool',
  'coupled-services-lab': 'coupled services failure lab',
  'in-memory-event-bus': 'in-memory event bus',
  'messaging-model': 'messaging delivery model',
  'aws-sns-sqs': 'AWS SNS and SQS fan-out',
  'delivery-failure-lab': 'messaging delivery failure',
  'outbox-inbox': 'Transactional Outbox and Inbox',
  'saga-schema-ordering': 'Saga, schema evolution, and ordering',
  'eda-observability-security': 'EDA observability and security',
  'async-integration-tests': 'deterministic asynchronous integration tests'
};

function technicalEnglish(input: ChapterInput): EnglishActivity {
  const { englishLevel: level } = input;
  const topic = englishTopics[input.id] ?? input.id.replaceAll('-', ' ');
  const codeContext = input.code?.[1].split('\n').find(line => line.trim())?.trim()
    ?? `// Follow the ${topic} contract through observable behavior.`;
  const stages = [
    {
      label: 'Context first',
      readPassage: `The ${topic} example uses names that reveal state and behavior. Follow the values and result before looking up unfamiliar words.`,
      comprehensionQuestion: 'Which name reveals the action, and what result can you observe?',
      contextSupport: 'Use o fluxo do código como pista. Não transforme os nomes em pares de tradução.',
      documentationTask: 'Na referência oficial, localize um nome de API usado no capítulo e confirme seu comportamento pelo exemplo.',
      productionTask: 'Write one short sentence: “The method ___ when ___.”',
      successCriterion: 'The sentence connects one code name to an observable action.'
    },
    {
      label: 'Guided reading',
      readPassage: `A ${topic} operation receives input, checks its contract, and returns an explicit result. Invalid input must not be hidden.`,
      comprehensionQuestion: 'What does the operation receive, and when does it fail?',
      contextSupport: 'Identifique sujeito, ação, condição e resultado antes de consultar uma palavra isolada.',
      documentationTask: `In the official reference, find one sentence that describes ${topic} behavior and confirm it with the example.`,
      productionTask: `Write an English search query for one real ${topic} doubt, then answer it in one sentence.`,
      successCriterion: 'The query includes technology, behavior, and expected result or failure.'
    },
    {
      label: 'Applied comprehension',
      readPassage: `The ${topic} component must preserve its contract under invalid input and dependency failure. Callers need an observable outcome.`,
      comprehensionQuestion: 'Which contract can fail, how is the failure observed, and what should happen next?',
      contextSupport: 'Form a hypothesis from code and behavior, then use the official source to verify it.',
      documentationTask: `According to the official documentation, identify one precondition, result, or failure related to ${topic}.`,
      productionTask: `Write a bug report for a plausible ${topic} failure with expected behavior, actual behavior, and steps to reproduce.`,
      successCriterion: 'Another developer can reproduce and diagnose the failure without translation notes.'
    },
    {
      label: 'Professional use',
      readPassage: `Design the ${topic} flow so failures remain observable, retries are bounded, and duplicate work cannot corrupt state.`,
      comprehensionQuestion: 'Which constraint protects correctness, and which trade-off belongs in the review?',
      contextSupport: 'Work directly from the contract and sources. Express uncertainty as a technical question.',
      documentationTask: `Read the official material for ${topic}. Extract one behavior, one limitation, and one operational consequence.`,
      productionTask: `Write an implementation issue for ${topic} with constraints, acceptance criteria, failure scenarios, and trade-offs.`,
      successCriterion: 'An international team can implement and review the issue without additional Portuguese context.'
    }
  ] as const;
  const stage = stages[level];
  return {
    level,
    ...stage,
    codeContext,
    instruction: stage.readPassage,
    prompt: stage.productionTask
  };
}

function englishProjectSpecification(input: ChapterInput) {
  const topic = englishTopics[input.id] ?? input.id.replaceAll('-', ' ');
  return {
    title: `Professional specification: ${topic}`,
    brief: `Build a verifiable ${topic} application from this English contract. Treat documentation, failure behavior, and operational evidence as part of the deliverable.`,
    requirements: [
      `Implement the ${topic} behavior and keep domain rules outside the user interface.`,
      'Use English for packages, types, methods, variables, exceptions, tests, log messages, and public contracts.',
      'Handle invalid input and dependency failure explicitly; preserve the original cause and useful context.',
      'Document setup, commands, constraints, recovery behavior, and design trade-offs in an English README.',
      'Provide deterministic automated tests for the happy path, boundary cases, and at least one failure scenario.'
    ],
    acceptanceCriteria: [
      'A reviewer can build, run, and test the project by following only the English README.',
      'No secret, machine-specific path, unbounded retry, or silent failure is committed.',
      'Tests prove the observable contract and produce useful evidence when they fail.',
      'An implementation issue written in English links requirements to code and verification evidence.'
    ]
  };
}

function makeChapter(input: ChapterInput, order: number): Chapter {
  const conceptIds = input.concepts.map(([title]) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  const conceptQuizzes: ContentBlock[] = input.concepts.map(([title, body], index) => {
    const conceptId = conceptIds[index] ?? `${input.id}-concept-${index}`;
    const firstDistractor = input.concepts[(index + 1) % input.concepts.length] ?? [title, body];
    const secondDistractor = input.concepts[(index + 2) % input.concepts.length] ?? [title, body];
    return {
      id: `${input.id}-concept-check-${index}`,
      type: 'quiz',
      conceptId,
      prompt: `Qual afirmação descreve corretamente “${title}” neste contexto?`,
      options: [
        { id: `${input.id}-concept-${index}-a`, label: body, correct: true, explanation: `Esta é a definição operacional de “${title}” usada no capítulo.` },
        { id: `${input.id}-concept-${index}-b`, label: firstDistractor[1], correct: false, explanation: `Esta afirmação descreve “${firstDistractor[0]}”, não “${title}”.` },
        { id: `${input.id}-concept-${index}-c`, label: secondDistractor[1], correct: false, explanation: `Esta afirmação descreve “${secondDistractor[0]}”, não “${title}”.` }
      ]
    };
  });
  const blocks: ContentBlock[] = [
    {
      id: `${input.id}-intuition`,
      type: 'intuition',
      title: 'O problema antes da ferramenta',
      body: input.why
    },
    ...input.concepts.map(([title, body], index): ContentBlock => ({
      id: `${input.id}-concept-${index}`,
      type: 'concept',
      title,
      body
    })),
    {
      id: `${input.id}-decision`,
      type: 'callout',
      tone: 'domain',
      title: 'Quando usar e quando não usar',
      body: input.decision
    },
    ...(input.code
      ? [{
          id: `${input.id}-code`,
          type: 'code' as const,
          language: 'java',
          caption: input.code[0],
          source: input.code[1]
        }]
      : []),
    {
      id: `${input.id}-prediction`,
      type: 'prediction',
      prompt: input.prediction[0],
      answer: input.prediction[1]
    },
    {
      id: `${input.id}-exercise`,
      type: 'exercise',
      title: input.exercise[0],
      prompt: input.exercise[1],
      difficulty: input.englishLevel >= 2 ? 'advanced' : 'intermediate',
      criteria: input.exercise[2]
    },
    ...conceptQuizzes,
    {
      id: `${input.id}-quiz`,
      type: 'quiz',
      conceptId: input.id,
      prompt: input.quiz[0],
      options: [
        { id: `${input.id}-q-a`, label: input.quiz[1], correct: true },
        { id: `${input.id}-q-b`, label: input.quiz[2], correct: false },
        { id: `${input.id}-q-c`, label: input.quiz[3], correct: false }
      ]
    },
    ...(input.project
      ? [{
          id: `${input.id}-project`,
          type: 'project' as const,
          title: input.project[0],
          brief: `Construa uma aplicação verificável para aplicar ${input.title}.`,
          requirements: input.project[1],
          guidance: input.project[2],
          acceptanceCriteria: input.project[3],
          englishSpecification: input.englishLevel >= 2 ? englishProjectSpecification(input) : undefined
        }]
      : [])
  ];

  return {
    id: input.id,
    moduleId: input.moduleId,
    order: 10_000 + order,
    title: input.title,
    summary: input.summary,
    objectives: input.concepts.map(([title]) => `Raciocinar sobre ${title.toLowerCase()}`),
    whyItExists: input.why,
    prerequisiteChapterIds: input.prerequisites,
    conceptIds,
    estimatedMinutes: input.project ? 240 : 120,
    englishLevel: input.englishLevel,
    blocks,
    resources: input.resources.map(([type, title, url, reinforces], index) => ({
      id: `${input.id}-resource-${index}`,
      type,
      title,
      url,
      reinforces,
      language: 'en'
    })),
    englishActivity: technicalEnglish(input)
  };
}

const inputs: ChapterInput[] = [
  {
    id: 'associacoes-cardinalidade', moduleId: 'oop-modeling', title: 'Associações, cardinalidade e invariantes entre objetos',
    summary: 'Modele relações antes de conhecer anotações de persistência.',
    why: 'Objetos raramente vivem isolados. Se o aluno encontra @OneToMany antes de compreender identidade, referência, coleção e cardinalidade, aprende configuração sem saber qual relação está modelando.',
    prerequisites: ['interfaces'], englishLevel: 0,
    concepts: [
      ['Associação e direção', 'Uma associação representa colaboração ou conhecimento entre objetos. Unidirecional e bidirecional descrevem quem navega para quem; não são decisões de banco.'],
      ['Cardinalidade', 'Um-para-um, um-para-muitos e muitos-para-muitos expressam quantas instâncias podem participar. A regra do domínio define mínimos, máximos e obrigatoriedade.'],
      ['Agregação, composição e ciclo de vida', 'Composição implica propriedade forte do ciclo de vida. Não a escolha apenas porque um objeto contém uma lista de outro.'],
      ['Consistência dos dois lados', 'Uma relação bidirecional exige uma operação única que atualize ambos os lados; setters independentes criam estados contraditórios.']
    ],
    decision: 'Comece unidirecional e amplie apenas quando uma navegação real exigir. Muitos-para-muitos direto costuma esconder atributos da própria relação; nesse caso modele uma entidade associativa.',
    prediction: ['Pedido adiciona Item, mas Item.pedido continua null. O grafo está consistente?', 'Não. A memória contém duas versões incompatíveis da mesma relação; uma operação de domínio deve proteger ambos os lados.'],
    exercise: ['Modelagem antes do ORM', 'Modele Turma, Matrícula e Aluno com período, status e data de entrada na relação.', ['Cardinalidades e opcionais estão explícitos.', 'Matrícula é tratada como conceito com identidade/regras próprias.', 'Uma operação de domínio preserva os dois lados.']],
    quiz: ['Quando uma entidade associativa é preferível?', 'Quando a própria relação possui dados, regras ou ciclo de vida.', 'Sempre que houver duas classes Java.', 'Somente quando o banco não aceita chave estrangeira.'],
    resources: [['official-docs', 'Java: classes e objetos', 'https://dev.java/learn/classes-objects/', 'Referências, encapsulamento e colaboração entre objetos.'], ['guide', 'Jakarta Persistence: relationships', 'https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2', 'Compare depois o modelo de objetos com o mapeamento, sem inverter a ordem.']]
  },
  {
    id: 'functional-semantics-lab', moduleId: 'java-core', title: 'Optional, lambdas, Set e Streams por semântica',
    summary: 'Escolha APIs funcionais pela pergunta feita aos dados.', why: 'Código funcional vira receita quando filter, map, flatMap, Optional e Set são ensinados como palavras soltas. A escolha deve começar pela cardinalidade e pelo efeito desejado.',
    prerequisites: ['javamoderno', 'streams', 'colecoes'], englishLevel: 1,
    concepts: [
      ['Optional', 'Representa zero ou um resultado no retorno. Não corrige entidade parcialmente inicializada, não deve mascarar null em todo campo e não substitui uma coleção vazia.'],
      ['Lambda e captura', 'Uma lambda descreve comportamento e pode capturar variáveis efetivamente finais. Efeitos colaterais compartilhados quebram previsibilidade, sobretudo em parallelStream.'],
      ['Set e igualdade', 'Set responde pertencimento/unicidade. HashSet depende do contrato entre equals e hashCode; TreeSet depende de uma ordem compatível com a noção de duplicidade.'],
      ['map versus flatMap', 'map preserva a camada do resultado; flatMap evita estruturas aninhadas quando a função já devolve um contexto como Optional ou Stream.']
    ],
    decision: 'Use Stream para transformação declarativa finita, não para esconder I/O, mutação ou depuração difícil. Use Set quando a pergunta for unicidade/pertencimento, não para “ser mais rápido” sem medir e sem definir igualdade.',
    prediction: ['Se equals considera email, mas hashCode usa id mutável, contains continuará confiável?', 'Não. O elemento pode ficar no bucket calculado pelo valor antigo e o contrato de HashSet foi violado.'],
    exercise: ['Pergunta antes da API', 'Para seis requisitos, escreva primeiro a cardinalidade de entrada/saída e só depois escolha loop, Set, Optional ou Stream.', ['Cada escolha explica semântica, não estilo.', 'Não há mutação compartilhada em pipeline.', 'Casos vazio, duplicado e nulo são testados.']],
    quiz: ['Qual retorno expressa “pode existir um cliente, no máximo um”?', 'Optional<Cliente>.', 'Stream<Optional<Cliente>>.', 'Cliente nulo sem contrato.'],
    resources: [['official-docs', 'Java Stream API', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/package-summary.html', 'Operações intermediárias, terminais e não interferência.'], ['official-docs', 'Optional API', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html', 'Contrato de zero ou um valor.']]
  },
  {
    id: 'jdbc-under-the-hood', moduleId: 'relational-data-jdbc', title: 'JDBC por baixo do CRUD',
    summary: 'Entenda driver, conexão, protocolo, statements, transação e falhas.', why: 'JDBC é a fronteira onde objetos, SQL, rede, recursos e transações se encontram. Uma sequência conectar-executar-fechar não ensina ownership nem o que ocorre quando a segunda operação falha.',
    prerequisites: ['jdbc', 'mini-financas-jdbc'], englishLevel: 1,
    concepts: [
      ['Driver e conexão', 'O driver traduz a API JDBC para o protocolo do banco. Connection representa uma sessão cara e limitada; pools emprestam e devolvem conexões, não criam uma por query.'],
      ['PreparedStatement', 'Separa SQL de valores, reduz injeção e permite conversão tipada. Nomes de tabela não são parâmetros e exigem allowlist quando variáveis.'],
      ['ResultSet e ownership', 'ResultSet é um cursor ligado ao statement/conexão. try-with-resources fecha na ordem inversa; devolver o cursor para outra camada prolonga recursos sem contrato.'],
      ['Transação e erro', 'Com autoCommit=false, commit confirma a unidade e rollback desfaz o trabalho não confirmado. A exceção original e a falha do rollback precisam de diagnóstico sem perder contexto.']
    ],
    decision: 'JDBC direto é adequado para aprender SQL, controle fino e caminhos pequenos. Um ORM reduz mapeamento repetitivo, mas não elimina SQL, transações, índices, cardinalidade ou N+1.',
    prediction: ['O débito passou e o crédito lançou SQLException com autoCommit=true. O rollback posterior restaura o débito?', 'Não. O débito já foi confirmado como transação separada. A unidade precisa começar antes das duas operações.'],
    exercise: ['Transferência observável', 'Implemente transferência com PreparedStatement, isolamento explícito, rollback, tradução de erro e teste concorrente.', ['Débito e crédito são atômicos.', 'Recursos fecham mesmo em erro.', 'SQL e parâmetros são registrados sem secrets.', 'O teste usa banco real descartável.']],
    quiz: ['Por que um pool não é apenas otimização?', 'Ele limita e administra um recurso externo escasso, afetando backpressure e disponibilidade.', 'Ele transforma qualquer SQL em transação.', 'Ele elimina a necessidade de fechar Connection.'],
    resources: [['official-docs', 'Oracle JDBC basics', 'https://docs.oracle.com/javase/tutorial/jdbc/basics/', 'Conexões, statements, ResultSet e transações.'], ['official-docs', 'JDBC API', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/package-summary.html', 'Contratos atuais da API.']]
  },
  {
    id: 'http-wire-contract', moduleId: 'http-api-clients', title: 'HTTP no fio: request, response e semântica',
    summary: 'Leia HTTP antes de usar controllers.', why: 'Sem enxergar método, target, headers, body, status e cache, anotações de framework parecem produzir respostas por magia.',
    prerequisites: ['http'], englishLevel: 1,
    concepts: [
      ['Request', 'Method expressa a intenção; target identifica o recurso; headers carregam metadados; body carrega uma representação. URL e URI não são o servidor nem o recurso em si.'],
      ['Response', 'Status comunica a classe do resultado, headers descrevem controle e representação, e body pode estar ausente. 4xx aponta para a requisição; 5xx para incapacidade do servidor.'],
      ['Métodos e idempotência', 'GET, HEAD, PUT e DELETE são definidos como idempotentes; POST normalmente não. Idempotência descreve o efeito pretendido de repetições, não respostas byte a byte iguais.'],
      ['Cache e negociação', 'Cache-Control, ETag/If-None-Match e Vary formam contratos. Content-Type descreve o corpo enviado; Accept declara formatos aceitos.']
    ],
    decision: 'Use HTTP para interação síncrona e resposta imediata. Não use request longa como fila improvisada nem declare 200 para erros de domínio apenas porque houve resposta.',
    code: ['Inspecione o protocolo com curl', 'curl -i --request GET \\\n  --header "Accept: application/json" \\\n  https://api.github.com/repos/openjdk/jdk'],
    prediction: ['Um PUT repetido devolve 200 e depois 204. Isso viola idempotência?', 'Não necessariamente. O efeito final pode ser o mesmo embora a representação/status da resposta varie.'],
    exercise: ['Autópsia HTTP', 'Capture três requests com curl -v: sucesso, validação e recurso ausente. Anote cada parte e o contrato observado.', ['Método, URI, headers e body foram separados.', 'Status não é confundido com regra de domínio.', 'Repetição e cache são analisados.']],
    quiz: ['Qual header descreve o formato do body recebido?', 'Content-Type.', 'Accept, independentemente da direção.', 'Authorization.'],
    resources: [['official-docs', 'HTTP Semantics RFC 9110', 'https://www.rfc-editor.org/rfc/rfc9110', 'Métodos, status, representações e semântica.'], ['guide', 'curl documentation', 'https://curl.se/docs/', 'Montagem, inspeção e debugging de requests.']]
  },
  {
    id: 'java-httpclient-json', moduleId: 'http-api-clients', title: 'Java HttpClient e JSON sem framework web',
    summary: 'Consuma uma API com biblioteca padrão e mapeamento explícito.', why: 'Antes de WebClient ou clients declarativos, o aluno precisa montar uma request, escolher timeout, observar status e converter bytes em um modelo próprio.',
    prerequisites: ['http-wire-contract', 'json', 'excecoes'], englishLevel: 1,
    concepts: [
      ['Cliente reutilizável', 'HttpClient é imutável depois de construído e administra conexões reutilizáveis. Criar um cliente por request desperdiça pooling e torna políticas inconsistentes.'],
      ['Request e timeout', 'Connect timeout limita estabelecimento da conexão; request timeout limita a troca específica. Nenhum deles prova que o servidor não executou a operação.'],
      ['Response e BodyHandler', 'statusCode, headers e body são dados separados. O BodyHandler escolhe String, arquivo, stream ou descarte e também define responsabilidade de consumo.'],
      ['JSON de fronteira', 'Mapeie JSON para DTO externo tolerante e depois para domínio. Campo ausente, null, tipo inesperado e campo novo precisam de política explícita.']
    ],
    decision: 'HttpClient é suficiente para clients pequenos e controle explícito. Adote biblioteca de JSON pela necessidade de parsing seguro; não concatene JSON manualmente nem exponha DTO externo como entidade do domínio.',
    code: ['GET síncrono com timeout e status explícito', 'var client = HttpClient.newBuilder()\n    .connectTimeout(Duration.ofSeconds(3))\n    .build();\nvar request = HttpRequest.newBuilder(URI.create(url))\n    .timeout(Duration.ofSeconds(5))\n    .header("Accept", "application/json")\n    .GET().build();\nvar response = client.send(request, BodyHandlers.ofString());\nif (response.statusCode() / 100 != 2) throw new ApiException(response.statusCode());'],
    prediction: ['sendAsync torna uma API lenta automaticamente rápida?', 'Não. Ele evita bloquear a thread chamadora, mas latência, limite remoto e custo continuam existindo e precisam de timeout/backpressure.'],
    exercise: ['Cliente de CEP defensivo', 'Consuma uma API pública, converta para DTO, trate 404, 429, 5xx, timeout, JSON inválido e cancelamento.', ['Um HttpClient é reutilizado.', 'Domínio não depende do JSON externo.', 'Falhas possuem tipos e contexto seguros.', 'Teste usa servidor HTTP local controlado.']],
    quiz: ['Por que não criar HttpClient em cada chamada?', 'Porque o cliente gerencia configuração e pool de conexões reutilizáveis.', 'Porque HttpClient só aceita uma URI durante toda a vida.', 'Porque send deixa de funcionar após a primeira resposta.'],
    project: ['Explorador de API em Java puro', ['CLI com busca e paginação', 'Cache local com validade', 'Timeout e cancelamento', 'Testes com servidor stub'], 'guided', ['Executa sem Spring.', 'Não contém API key no código.', 'Distingue erro técnico, remoto e de domínio.']],
    resources: [['official-docs', 'Java HttpClient', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpClient.html', 'Criação, reuso, envio síncrono/assíncrono e recursos.'], ['official-docs', 'Java HTTP package', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/package-summary.html', 'HttpRequest, HttpResponse, WebSocket e exceções.']]
  },
  {
    id: 'unreliable-api-client', moduleId: 'http-api-clients', title: 'APIs externas falham: timeout, retry, limites e secrets',
    summary: 'Projete integrações sob falha parcial.', why: 'Uma integração que funciona no caminho feliz não está pronta: rede atrasa, respostas mudam, credenciais expiram, limites são atingidos e a resposta pode se perder depois do efeito remoto.',
    prerequisites: ['java-httpclient-json'], englishLevel: 1,
    concepts: [
      ['Timeout, deadline e cancelamento', 'Timeout limita uma etapa; deadline limita o orçamento total. Tentativas devem consumir o mesmo orçamento e propagar cancelamento.'],
      ['Retry com backoff e jitter', 'Repita somente falhas transitórias e operações seguras/idempotentes. Backoff reduz pressão; jitter evita clientes sincronizados.'],
      ['Rate limiting e paginação', '429 e Retry-After comunicam capacidade. Paginação por cursor evita inconsistência de offsets sob inserções, mas o cursor é opaco.'],
      ['Autenticação e secrets', 'API keys e tokens entram por ambiente/secret store, nunca no repositório, log, URL ou bundle. Rotação e menor privilégio fazem parte do contrato.']
    ],
    decision: 'Retry não é resposta universal. Não repita validação, autenticação inválida ou POST não idempotente sem chave. Circuit breaker só entra depois que métricas demonstram falha persistente e efeito cascata.',
    prediction: ['POST de pagamento retornou timeout. Repetir sem idempotency key é seguro?', 'Não. O pagamento pode ter sido confirmado e apenas a resposta se perdeu; consulte estado ou repita com chave/contrato idempotente.'],
    exercise: ['Matriz de falhas', 'Defina política para 400, 401, 404, 409, 429, 500, timeout, DNS, JSON inválido e resposta parcial.', ['Cada falha tem decisão de retry explícita.', 'Orçamento total e limite de tentativas existem.', 'Logs não expõem credenciais ou PII.']],
    quiz: ['Qual retry é mais seguro?', 'GET idempotente após 503, limitado por deadline e com backoff/jitter.', 'POST de cobrança após timeout, sem chave.', '401 repetido até o token funcionar.'],
    resources: [['official-docs', 'Java HttpTimeoutException', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpTimeoutException.html', 'Falha temporal no cliente Java.'], ['reference', 'HTTP Semantics', 'https://www.rfc-editor.org/rfc/rfc9110', 'Métodos seguros/idempotentes e Retry-After.']]
  },
  {
    id: 'pure-java-api-project', moduleId: 'http-api-clients', title: 'Projeto: integração entre APIs em Java puro',
    summary: 'Consolide HTTP, JSON, concorrência e resiliência antes do Spring.', why: 'O projeto prova que HTTP e integração são conhecimentos de Java/backend, não efeitos de anotações Spring.',
    prerequisites: ['unreliable-api-client', 'testes'], englishLevel: 1,
    concepts: [
      ['Portas e adapters', 'O caso de uso depende de interfaces pequenas; HttpClient, arquivo e relógio são adapters substituíveis.'],
      ['Composição de resultados', 'Duas APIs possuem latência e falhas independentes. Modele parcial, indisponível e stale em vez de transformar tudo em null.'],
      ['Testes determinísticos', 'Um HttpServer local controla status, atraso, headers e payload. Testes não dependem da internet nem de rate limit real.']
    ],
    decision: 'Não introduza Spring neste projeto. A restrição torna visíveis composição, ownership e fronteiras; depois será possível avaliar o que o framework realmente elimina.',
    prediction: ['Uma API respondeu e a segunda falhou. Retornar lista vazia preserva informação?', 'Não. Lista vazia afirma sucesso sem itens; o estado parcial/indisponível precisa permanecer representável.'],
    exercise: ['Plano antes do código', 'Modele estados, portas, timeouts, cache e contrato de saída antes de escolher bibliotecas.', ['Diagrama mostra fronteiras.', 'Falha parcial é observável.', 'Critérios de aceite podem ser testados offline.']],
    quiz: ['O que torna o teste reprodutível?', 'Servidor stub local com respostas e atrasos controlados.', 'Chamar sempre a API pública mais popular.', 'Aumentar timeout até o teste passar.'],
    project: ['Painel de clima e localização', ['Consumir duas APIs', 'Cache com stale fallback', 'Execução concorrente limitada', 'Exportar JSON e CSV', 'Testar 429/500/timeout'], 'bounded', ['Sem Spring.', 'Funciona offline com fixtures.', 'Decisões registradas em README.', 'Erros preservam causa e contexto.']],
    resources: [['official-docs', 'JDK HttpServer', 'https://docs.oracle.com/en/java/javase/25/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpServer.html', 'Servidor local para testes controlados.'], ['official-docs', 'CompletableFuture', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html', 'Composição assíncrona explícita.']]
  },
  {
    id: 'rest-resource-contracts', moduleId: 'spring-api', title: 'REST: recursos, DTOs, validação e erros',
    summary: 'Projete o contrato antes das anotações.', why: 'Uma API não é REST porque devolve JSON. O contrato precisa representar recursos, transições, status, validação, concorrência e erros que clientes consigam interpretar.',
    prerequisites: ['pure-java-api-project', 'spring-mvc'], englishLevel: 2,
    concepts: [
      ['Modelagem de recurso', 'URI nomeia recursos; métodos expressam intenção. A representação pode mudar sem expor a entidade persistida.'],
      ['Request e response DTO', 'Request descreve entrada permitida; response descreve contrato publicado. Separá-los impede mass assignment e evolução acoplada ao banco.'],
      ['Erro técnico e de domínio', '422 pode expressar regra inválida; 409 conflito de estado; 503 dependência indisponível. Um Problem Details estável inclui type, title, status e correlação.'],
      ['Concorrência e idempotência', 'ETag/If-Match evita lost update; idempotency key torna criação repetida reconhecível sem confundir requisições distintas.']
    ],
    decision: 'Use PATCH quando o contrato define alteração parcial e semântica; não como “PUT menor”. Não exponha stack trace, entidade JPA ou segredo em respostas.',
    prediction: ['Dois clientes editam a mesma versão e ambos enviam PUT. Sem precondition, o que ocorre?', 'A última gravação pode sobrescrever silenciosamente a primeira: lost update.'],
    exercise: ['Contrato de pedidos', 'Desenhe endpoints e Problem Details para criar, pagar, cancelar e consultar pedido.', ['Estados inválidos não são representáveis por endpoint genérico.', 'Status e erros têm semântica.', 'Concorrência e repetição estão cobertas.']],
    quiz: ['Por que Response DTO difere de Entity?', 'Porque contrato público e persistência evoluem por motivos e ritmos diferentes.', 'Porque JSON não aceita classes.', 'Porque JPA impede getters.'],
    resources: [['official-docs', 'Spring MVC reference', 'https://docs.spring.io/spring-framework/reference/web/webmvc.html', 'Contrato HTTP e implementação MVC.'], ['reference', 'Problem Details RFC 9457', 'https://www.rfc-editor.org/rfc/rfc9457', 'Formato interoperável de erros HTTP.']]
  },
  {
    id: 'api-contract-evolution', moduleId: 'api-security-quality', title: 'OpenAPI, testes e evolução de contratos',
    summary: 'Use contrato como artefato verificável, não decoração.', why: 'Uma API usada por outros times precisa evoluir sem surpresas. Documentação gerada depois do código não substitui decisões de compatibilidade nem testes do que foi publicado.',
    prerequisites: ['rest-resource-contracts', 'paginacao-swagger'], englishLevel: 2,
    concepts: [
      ['API-first', 'O contrato permite discutir exemplos, erros, autenticação e compatibilidade antes da implementação. Não dispensa validação de comportamento.'],
      ['Evolução compatível', 'Adicionar campo opcional costuma ser compatível apenas se clientes toleram desconhecidos. Remover, renomear ou tornar obrigatório normalmente quebra consumidores.'],
      ['Camadas de teste', 'Unit testa regra; controller slice testa binding/HTTP; integração testa stack e banco; contrato testa expectativas entre consumidor e provedor.'],
      ['Versionamento', 'Prefira evolução aditiva e depreciação observável. Nova versão é necessária quando a semântica incompatível não pode coexistir com segurança.']
    ],
    decision: 'Não versione por toda mudança interna. Também não prometa compatibilidade sem executar diff do OpenAPI, testes de consumidor e janela de depreciação.',
    prediction: ['Adicionar enum novo é sempre compatível?', 'Não. Clientes com switch exaustivo ou validação fechada podem falhar; valores desconhecidos exigem política.'],
    exercise: ['Revisão de breaking changes', 'Compare duas versões de contrato e classifique mudanças de campo, enum, status e autenticação.', ['Cada classificação considera clientes reais.', 'Há estratégia de depreciação.', 'Testes impedem regressão do contrato.']],
    quiz: ['Qual teste detecta que o JSON publicado mudou sem intenção?', 'Teste de contrato/integração sobre a representação HTTP.', 'Somente teste unitário do repository.', 'Teste que apenas verifica status 200.'],
    resources: [['official-docs', 'OpenAPI 3.1 specification', 'https://spec.openapis.org/oas/v3.1.1.html', 'Estrutura e semântica do contrato.'], ['official-docs', 'Spring REST Docs', 'https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/', 'Documentação verificada por testes.']]
  },
  {
    id: 'tcp-protocol-design', moduleId: 'concurrency-network-tui', title: 'Sockets TCP e desenho de protocolo',
    summary: 'Construa comunicação além de HTTP sem perder framing e falhas.', why: 'TCP entrega um fluxo ordenado de bytes, não mensagens. Sem framing, charset, timeout e encerramento, dois programas podem concordar com tipos Java e ainda discordar no fio.',
    prerequisites: ['java-io', 'threads'], englishLevel: 2,
    concepts: [['Socket e endpoint', 'IP identifica host e porta identifica processo/serviço. ServerSocket aceita conexões; cada Socket possui streams independentes.'], ['Framing', 'Delimitador, tamanho prefixado ou formato autodescritivo define onde termina uma mensagem; uma leitura não corresponde necessariamente a um envio.'], ['Concorrência e backpressure', 'Um executor limitado controla conexões. Fila ilimitada apenas move a sobrecarga para memória.'], ['Timeout e shutdown', 'Read timeout evita espera infinita; encerramento coordenado para de aceitar, termina trabalho e fecha recursos.']],
    decision: 'Use protocolo próprio apenas quando o domínio/ambiente justificar. HTTP, WebSocket ou broker resolvem interoperabilidade; socket cru transfere para você framing, compatibilidade, segurança e operação.',
    prediction: ['write enviou 100 bytes. Uma chamada read receberá exatamente 100?', 'Não. TCP é stream; a leitura pode devolver menos ou combinar dados disponíveis. O protocolo precisa de framing e loop.'],
    exercise: ['Protocolo de chat', 'Defina wire format versionado, tamanho máximo, autenticação inicial e erros antes de implementar.', ['Mensagens têm limite e framing.', 'Entrada malformada não derruba o servidor.', 'Concorrência é limitada.']],
    quiz: ['O que TCP preserva?', 'Ordem do fluxo de bytes em uma conexão, não fronteiras de mensagens.', 'Uma mensagem por read.', 'Entrega exatamente uma vez após crash.'],
    project: ['Servidor de chat TCP', ['Múltiplos clientes', 'Protocolo documentado', 'Heartbeat e timeout', 'Shutdown coordenado'], 'bounded', ['Teste fragmenta writes deliberadamente.', 'Não há thread/fila ilimitada.', 'Cliente incompatível recebe erro útil.']],
    resources: [['official-docs', 'Java networking API', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/net/package-summary.html', 'Sockets, endereços e opções de rede.'], ['reference', 'TCP RFC 9293', 'https://www.rfc-editor.org/rfc/rfc9293', 'Contrato do transporte.']]
  },
  {
    id: 'lanterna-tui', moduleId: 'concurrency-network-tui', title: 'Lanterna: uma TUI real em Java',
    summary: 'Separe Terminal, Screen, componentes e estado.', why: 'Uma TUI cria interface interativa em ambiente textual e força decisões úteis sobre event loop, foco, redimensionamento e separação entre domínio e apresentação.',
    prerequisites: ['java-io', 'interfaces', 'threads'], englishLevel: 2,
    concepts: [['Terminal', 'Camada de baixo nível para cursor, teclas, cores e tamanho. Dá controle, mas exige redraw e input explícitos.'], ['Screen', 'Buffer de tela que permite desenhar um quadro e atualizar diferenças com refresh, reduzindo flicker.'], ['GUI2', 'Camada de janelas e componentes como Label, Button e TextBox. É produtiva quando o layout cabe no modelo de componentes.'], ['Event loop e estado', 'Entrada produz intenção, reducer/caso de uso altera estado e renderização reflete o novo estado. Domínio não importa Lanterna.']],
    decision: 'Use Terminal/Screen para visualização customizada e GUI2 para formulários/janelas. Não introduza threads só para input; primeiro defina ownership da UI e passagem de eventos.',
    code: ['Screen mínimo com fechamento garantido', 'var terminal = new DefaultTerminalFactory().createTerminal();\ntry (var screen = new TerminalScreen(terminal)) {\n    screen.startScreen();\n    screen.newTextGraphics().putString(2, 1, "java4br");\n    screen.refresh();\n    screen.readInput();\n}'],
    prediction: ['O domínio recebe TextBox para validar um nome. Qual acoplamento surgiu?', 'A regra passou a depender do toolkit visual; deveria receber texto/command e devolver resultado independente da UI.'],
    exercise: ['Redimensionamento e foco', 'Implemente lista filtrável que mantém seleção válida ao redimensionar e não bloqueia o domínio.', ['Estado não vive nos widgets.', 'Esc fecha com cleanup.', 'Layout pequeno possui fallback.']],
    quiz: ['Qual papel do Screen?', 'Manter um buffer visual e aplicar atualizações ao terminal.', 'Persistir o domínio em banco.', 'Criar uma thread por tecla.'],
    project: ['Monitor de tarefas TUI', ['Lista, filtro e formulário', 'Atalhos documentados', 'Persistência em JSON', 'Estado testável sem terminal'], 'bounded', ['Terminal sempre fecha.', 'Navegação funciona por teclado.', 'Domínio possui testes sem Lanterna.']],
    resources: [['official-docs', 'Lanterna repository and guide', 'https://github.com/mabe02/lanterna', 'Versão 3.1.2, camadas e exemplos oficiais.'], ['official-docs', 'Lanterna API docs', 'https://mabe02.github.io/lanterna/apidocs/3.1/', 'Terminal, Screen e GUI2.']]
  },
  {
    id: 'developer-tools-java', moduleId: 'concurrency-network-tui', title: 'Ferramentas para desenvolvedores em Java',
    summary: 'Construa utilitários reais com processos, arquivos e observabilidade.', why: 'Java serve para CLIs, automação e ferramentas de infraestrutura. Projetos pequenos tornam contratos de sistema operacional, streaming e saída observáveis sem depender de CRUD.',
    prerequisites: ['java-io', 'build', 'logging'], englishLevel: 2,
    concepts: [['ProcessBuilder', 'Argumentos são valores separados, não uma string de shell. stdout, stderr, exit code, timeout e cancelamento precisam de contrato.'], ['WatchService', 'Notifica mudanças de diretório, mas eventos podem ser agrupados/perdidos; rescan e idempotência mantêm a visão correta.'], ['JFR e jcmd', 'Ferramentas do JDK observam JVM em execução. Diagnóstico começa por evidência, não por flags copiadas.']],
    decision: 'Use ferramenta Java quando portabilidade, APIs do ecossistema e manutenção justificarem o runtime. Para transformação de uma linha, shell pode ser mais simples.',
    prediction: ['Processo filho escreve stderr suficiente e ninguém consome. O que pode ocorrer?', 'O buffer pode encher e bloquear o filho, parecendo deadlock; ambos os streams precisam ser drenados.'],
    exercise: ['Wrapper de processo', 'Execute comando permitido com deadline, capture saídas separadas e produza resultado tipado.', ['Não usa shell injection.', 'Timeout encerra árvore conforme política.', 'Exit code não é ignorado.']],
    quiz: ['Por que passar argumentos separados ao ProcessBuilder?', 'Evita depender do parsing do shell e reduz injeção.', 'Faz qualquer comando retornar zero.', 'Converte stderr em stdout automaticamente.'],
    project: ['Analisador incremental de logs', ['WatchService com rescan', 'Parser por linha', 'Métricas e relatório', 'Backpressure'], 'bounded', ['Arquivo rotacionado é tratado.', 'Memória é limitada.', 'Fixtures cobrem linhas inválidas.']],
    resources: [['official-docs', 'ProcessBuilder API', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ProcessBuilder.html', 'Processos e redirecionamento.'], ['official-docs', 'JDK troubleshooting tools', 'https://docs.oracle.com/en/java/javase/25/troubleshoot/diagnostic-tools.html', 'JFR, jcmd e evidência operacional.']]
  },
  {
    id: 'coupled-services-lab', moduleId: 'synchronous-integration', title: 'Do monólito aos serviços síncronos acoplados',
    summary: 'Experimente a falha que motiva assincronia.', why: 'EDA só faz sentido depois que o aluno mede o acoplamento temporal: checkout depende de estoque, pagamento e notificação disponíveis na mesma janela.',
    prerequisites: ['rest-resource-contracts', 'webclient'], englishLevel: 2,
    concepts: [['Monólito modular', 'Módulos no mesmo processo podem preservar fronteiras sem rede. Separar deploy não corrige modelo ruim.'], ['Acoplamento temporal', 'No síncrono, chamador e chamado precisam estar disponíveis ao mesmo tempo e a latência se soma ao caminho crítico.'], ['Falha parcial', 'Timeout deixa resultado desconhecido. Retry, compensação e idempotência surgem antes de qualquer broker.']],
    decision: 'Mantenha síncrono quando resposta imediata e consistência do fluxo são valiosas. Migre etapas desacopláveis somente após medir disponibilidade, latência e necessidade de buffer.',
    prediction: ['Pagamento confirmou, mas checkout perdeu a resposta. O serviço deve marcar falha definitiva?', 'Não. O estado é desconhecido; precisa consultar/reconciliar usando identidade idempotente.'],
    exercise: ['Laboratório de indisponibilidade', 'Separe três serviços HTTP e injete atraso, 503 e resposta perdida.', ['Métricas mostram latência acumulada.', 'Estados desconhecidos são modelados.', 'A decisão de assíncrono aponta uma dor medida.']],
    quiz: ['Qual custo nasce ao separar processos?', 'Rede, falhas parciais, observabilidade e evolução de contrato.', 'Transações distribuídas gratuitas.', 'Eliminação de acoplamento lógico.'],
    project: ['Checkout síncrono instrumentado', ['Três serviços', 'Timeout/deadline', 'Idempotency key', 'Tracing/correlation ID'], 'independent', ['Falhas são reproduzíveis.', 'Baseline orientará o redesenho EDA.', 'Nenhum retry infinito.']],
    resources: [['reference', 'AWS Builders Library: timeouts/retries/backoff', 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', 'Falhas síncronas e retry responsável.'], ['official-docs', 'Spring HTTP interface clients', 'https://docs.spring.io/spring-framework/reference/integration/rest-clients.html', 'Clientes síncronos e reativos atuais.']]
  },
  {
    id: 'in-memory-event-bus', moduleId: 'messaging-eda', title: 'Event Bus em Java puro',
    summary: 'Aprenda evento e dispatch antes do broker.', why: 'Um barramento em memória expõe publicação, handlers, ordem, isolamento de falha e testes sem esconder conceitos em Kafka ou cloud.',
    prerequisites: ['coupled-services-lab', 'interfaces', 'generics'], englishLevel: 3,
    concepts: [['Event, command e message', 'Evento registra fato passado; comando pede ação a um destinatário; mensagem é o envelope transportado. O nome expressa intenção e tempo.'], ['Dispatch', 'O bus encontra subscribers por tipo/rota. Um handler falho não deve corromper silenciosamente os demais.'], ['Sincronia escondida', 'Um event bus in-memory chamado na mesma stack ainda é síncrono; desacopla código, não disponibilidade nem deploy.']],
    decision: 'Use o bus para aprender e para eventos internos simples. Não o apresente como substituto durável de broker: crash perde memória e publicação/transação continuam acopladas.',
    prediction: ['publish chama handlers na mesma thread. O produtor já é assíncrono?', 'Não. Ele ainda aguarda todos os handlers; apenas a dependência de tipos pode ter diminuído.'],
    exercise: ['Falha de subscriber', 'Defina política quando um de três handlers lança exceção.', ['Semântica é explícita.', 'Erros são observáveis.', 'Ordem e reentrância possuem teste.']],
    quiz: ['Qual nome descreve melhor PedidoConfirmado?', 'Evento: um fato passado relevante.', 'Comando para talvez confirmar.', 'Fila física.'],
    project: ['Event Bus tipado', ['Subscribe/unsubscribe', 'Dispatch por tipo', 'Política de erro', 'Testes de ordem/reentrância'], 'bounded', ['Sem reflection desnecessária.', 'API impede handlers incompatíveis.', 'Limites de durabilidade documentados.']],
    resources: [['official-docs', 'Java Flow API', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Flow.html', 'Publisher/subscriber e backpressure como referência, não obrigação.'], ['video', 'Souza: evolução síncrona para EDA', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg', 'Trechos 01:29-18:12: síncrono, monólito e serviços acoplados.']]
  },
  {
    id: 'messaging-model', moduleId: 'messaging-eda', title: 'Messaging: queue, pub/sub, broker e entrega',
    summary: 'Escolha o canal pela responsabilidade.', why: 'Queue e pub/sub resolvem problemas diferentes. Sem distinguir competição por trabalho de distribuição de fatos, topologias parecem apenas caixas e setas.',
    prerequisites: ['in-memory-event-bus'], englishLevel: 3,
    concepts: [['Queue', 'Consumidores competem pelo trabalho; cada mensagem deve ser processada por um membro lógico, aceitando redelivery conforme o broker.'], ['Publish/subscribe', 'Cada assinatura interessada recebe sua cópia. Fan-out permite ritmos e retenções independentes.'], ['Broker e backpressure', 'Broker armazena/roteia; backlog torna diferença entre produção e consumo observável, mas exige limite, retenção e alarmes.'], ['Delivery semantics', 'At-most-once pode perder; at-least-once pode duplicar; exactly-once é garantia limitada por fronteiras e não elimina idempotência do efeito externo.']],
    decision: 'Use command queue quando há um dono do trabalho; publique event quando múltiplos consumidores independentes podem reagir. Não use evento como RPC sem resposta explícita.',
    prediction: ['Dois consumidores do mesmo grupo recebem cópias para fan-out?', 'Não; no mesmo grupo eles dividem trabalho. Fan-out exige assinaturas/grupos independentes.'],
    exercise: ['Escolha de topologia', 'Modele envio de e-mail, baixa de estoque, analytics e comando de estorno.', ['Eventos e comandos têm nomes temporais corretos.', 'Cada consumidor tem política de backlog.', 'Não há promessa vaga de exactly-once.']],
    quiz: ['Qual topologia entrega uma cópia independente a auditoria e analytics?', 'Pub/sub com assinaturas duráveis separadas.', 'Uma queue com consumidores competindo.', 'Uma chamada HTTP sem persistência.'],
    resources: [['official-docs', 'Apache Kafka design', 'https://kafka.apache.org/documentation/#design', 'Log, consumers e delivery.'], ['video', 'Souza: SNS, SQS e microservices EDA', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg', 'Trechos 18:22-53:42: fan-out e evolução arquitetural.']]
  },
  {
    id: 'aws-sns-sqs', moduleId: 'messaging-eda', title: 'AWS SNS + SQS: fan-out durável',
    summary: 'Implemente tópico, filas, policies e consumers idempotentes.', why: 'SNS distribui notificações e SQS amortece processamento. Juntos permitem que cada consumidor receba sua cópia, progrida no próprio ritmo e sobreviva a indisponibilidade temporária.',
    prerequisites: ['messaging-model', 'docker-conceitos'], englishLevel: 3,
    concepts: [['SNS topic', 'Publisher envia ao tópico; subscriptions encaminham para endpoints. SNS não substitui a retenção de uma queue consumida mais tarde.'], ['SQS queue', 'Consumer faz polling, recebe receipt handle, processa e apaga após sucesso. Antes disso a mensagem permanece armazenada e pode reaparecer.'], ['Fan-out e policy', 'Cada SQS subscription recebe cópia. Queue policy deve autorizar somente o tópico esperado; IAM define ações do publisher/consumer.'], ['Standard e FIFO', 'Standard prioriza escala com at-least-once e best-effort ordering. FIFO usa message group/deduplication com limites e não torna o efeito externo exatamente uma vez.']],
    decision: 'Use SNS+SQS quando consumidores independentes precisam de buffer próprio. Não use uma única queue para fan-out nem coloque credenciais estáticas no application.yml.',
    code: ['Consumer AWS SDK v2: apague somente após o efeito', 'var messages = sqs.receiveMessage(r -> r.queueUrl(queueUrl)\n    .waitTimeSeconds(20).maxNumberOfMessages(10)).messages();\nfor (var message : messages) {\n    processIdempotently(message.messageId(), message.body());\n    sqs.deleteMessage(r -> r.queueUrl(queueUrl)\n        .receiptHandle(message.receiptHandle()));\n}'],
    prediction: ['Consumer processou e caiu antes de deleteMessage. O que acontece?', 'Após visibility timeout a mensagem pode reaparecer; o efeito precisa ser idempotente/deduplicado.'],
    exercise: ['Fan-out local verificável', 'Crie tópico PedidoCriado e filas estoque/notificação com policies mínimas.', ['Cada fila recebe uma cópia.', 'Falha de notificação não bloqueia estoque.', 'Secrets vêm do ambiente.', 'Teste documenta limite do ambiente local.']],
    quiz: ['Para que serve visibility timeout?', 'Ocultar temporariamente mensagem recebida enquanto o consumidor processa, sem removê-la.', 'Garantir exactly-once.', 'Definir retenção total do tópico SNS.'],
    project: ['Pedidos com SNS + SQS', ['AWS SDK v2', 'Duas filas e DLQs', 'Idempotência', 'Métricas de backlog'], 'independent', ['Executa em ambiente local documentado.', 'Não exige conta paga para testes comuns.', 'Policies seguem menor privilégio.']],
    resources: [['official-docs', 'AWS SNS + SQS fan-out', 'https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html', 'Push do tópico, polling e persistência por fila.'], ['official-docs', 'Amazon SQS guide', 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html', 'Modelo, segurança e entrega.'], ['video', 'Souza: SNS e SQS', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg', 'Trechos 18:22-28:50: SNS/SQS, DLQ e redrive.']]
  },
  {
    id: 'delivery-failure-lab', moduleId: 'messaging-eda', title: 'Falhas em EDA: retry, DLQ, redrive e visibility timeout',
    summary: 'Projete a recuperação antes do caminho feliz.', why: 'At-least-once transforma duplicação, poison messages e crashes em comportamento normal. Confiabilidade nasce da política de falha, não de um try/catch no listener.',
    prerequisites: ['aws-sns-sqs'], englishLevel: 3,
    concepts: [['Idempotent consumer', 'Event ID identifica a intenção; registrar deduplicação e efeito na mesma transação local impede janela entre “marcar” e “executar”.'], ['Retry e backoff', 'Falha transitória pode voltar à fila com atraso. Falha permanente deve parar cedo; retry sem limite amplifica indisponibilidade.'], ['DLQ e redrive', 'DLQ isola mensagens após maxReceiveCount. Redrive é operação controlada: corrigir causa, selecionar lote, preservar evidência e monitorar nova falha.'], ['Visibility timeout', 'Mensagem recebida fica invisível, não bloqueada para sempre. Timeout curto duplica trabalho; longo atrasa retry. Heartbeat pode estender processamento conhecido.']],
    decision: 'DLQ não é lixeira nem banco de auditoria. Não redrive tudo automaticamente e não configure visibility timeout sem medir duração p95/p99 e crash behavior.',
    prediction: ['Visibility timeout é 30s e processamento leva 60s. Mesmo sem crash há risco?', 'Sim. A mensagem pode reaparecer e outro consumidor executar em paralelo; estenda timeout/heartbeat e mantenha idempotência.'],
    exercise: ['Poison message', 'Injete payload incompatível, falha transitória e crash após efeito.', ['Cada falha segue caminho diferente.', 'Receive count e backlog geram métricas.', 'Redrive possui runbook e limite.']],
    quiz: ['Quando apagar a mensagem SQS?', 'Depois que o efeito idempotente foi confirmado conforme o contrato.', 'Imediatamente ao receber.', 'Somente quando a fila ficar vazia.'],
    resources: [['official-docs', 'SQS visibility timeout', 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html', 'Reentrega, extensão e mensagens in-flight.'], ['official-docs', 'SNS dead-letter queues', 'https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html', 'Falha de entrega, policy e redrive.']]
  },
  {
    id: 'outbox-inbox', moduleId: 'distributed-consistency', title: 'Transactional Outbox e Inbox',
    summary: 'Feche as janelas entre banco e broker.', why: 'Gravar domínio e publicar mensagem são dois efeitos independentes. Sem uma estratégia, crash entre eles produz dado sem evento ou evento sem dado.',
    prerequisites: ['delivery-failure-lab', 'jdbc-under-the-hood'], englishLevel: 3,
    concepts: [['Outbox', 'A mesma transação grava estado e registro de evento pendente. Um relay publica, registra tentativa e permite recuperação; não cria transação distribuída.'], ['Relay e duplicação', 'Polling publisher ou CDC pode publicar mais de uma vez quando crash ocorre após publish e antes de marcar. Consumer continua idempotente.'], ['Inbox', 'Consumer registra event ID e efeito na mesma transação local. Unique constraint torna corrida observável e segura.'], ['Retenção e ordenação', 'Outbox/inbox crescem: particionamento, limpeza auditável e chave de ordenação fazem parte da operação.']],
    decision: 'Use Outbox quando estado e evento precisam nascer juntos. Não a use para esconder contrato ruim nem apague registros antes de confirmar publicação e retenção exigida.',
    prediction: ['Relay publicou e caiu antes de marcar sent. A mensagem será duplicada?', 'Pode ser. A recuperação republica o pendente; por isso o consumer deduplica pelo event ID.'],
    exercise: ['Prova de crash', 'Pare o relay em cada janela e demonstre ausência de evento perdido.', ['Estado e outbox compartilham transação.', 'Duplicação é absorvida no inbox.', 'Cleanup não remove pendentes.']],
    quiz: ['Qual problema Outbox resolve?', 'Atomicidade local entre mudança de domínio e intenção durável de publicar.', 'Exactly-once global entre todos os serviços.', 'Ordenação total entre todos os aggregates.'],
    project: ['Pedidos com Outbox/Inbox', ['PostgreSQL', 'Relay recuperável', 'Unique event ID', 'Métricas de idade/backlog'], 'independent', ['Kill tests cobrem janelas.', 'Publicação duplicada não duplica efeito.', 'Schema do evento é versionado.']],
    resources: [['reference', 'Transactional Outbox pattern', 'https://microservices.io/patterns/data/transactional-outbox.html', 'Problema e forças do padrão.'], ['official-docs', 'PostgreSQL transaction isolation', 'https://www.postgresql.org/docs/current/transaction-iso.html', 'Garantias da transação local.']]
  },
  {
    id: 'saga-schema-ordering', moduleId: 'distributed-consistency', title: 'Saga, evolução de eventos e ordering',
    summary: 'Coordene estados distribuídos sem rollback mágico.', why: 'Depois que cada serviço confirma sua própria transação, falha posterior exige decisão de negócio: compensar, aguardar, reconciliar ou aceitar estado parcial observável.',
    prerequisites: ['outbox-inbox', 'ddd-estrategico'], englishLevel: 3,
    concepts: [['Saga choreography', 'Serviços reagem a eventos sem coordenador central. Reduz centralização, mas fluxo e ciclos ficam difíceis de enxergar.'], ['Saga orchestration', 'Orchestrator envia comandos e registra estado. Torna sequência explícita, mas pode concentrar processo demais.'], ['Compensação', 'É nova ação de negócio, não rollback físico. Pode falhar, ser parcial ou impossível; estados precisam refletir isso.'], ['Schema e ordering', 'Eventos carregam type/version/eventId/occurredAt/aggregateId. Evolução aditiva, upcasters e compatibilidade são testados. Ordene por aggregate quando necessário, não globalmente por conveniência.']],
    decision: 'Escolha choreography para fluxos pequenos e estáveis; orchestration para processos longos que exigem visibilidade/controle. Não force compensação que contradiz o domínio, como “desenviar” e-mail.',
    prediction: ['Evento v2 remove campo que consumidor v1 exige. Retry resolve?', 'Não. É incompatibilidade permanente; precisa contrato compatível, transformação/upcaster ou migração coordenada.'],
    exercise: ['Máquina de estados da Saga', 'Modele reserva, pagamento, estoque e entrega com timeout e compensações.', ['Todo estado terminal/intermediário é explícito.', 'Comandos e eventos não se confundem.', 'Falha de compensação possui reconciliação.']],
    quiz: ['O que é compensação?', 'Nova operação de domínio que tenta neutralizar efeito anterior conforme regras atuais.', 'Rollback ACID entre serviços.', 'Apagar o evento do broker.'],
    project: ['Saga de pedidos', ['Escolher choreography ou orchestration e justificar', 'Persistir estado', 'Timeout/reconciliação', 'Schema compatível'], 'independent', ['Diagrama deriva do comportamento implementado.', 'Falhas e duplicações são testadas.', 'Ordering é limitado por aggregate.']],
    resources: [['reference', 'Saga pattern', 'https://microservices.io/patterns/data/saga.html', 'Choreography, orchestration e compensação.'], ['official-docs', 'Kafka ordering/design', 'https://kafka.apache.org/documentation/#design', 'Partições, keys e consumidores.']]
  },
  {
    id: 'eda-observability-security', moduleId: 'messaging-eda', title: 'Observabilidade e segurança em EDA',
    summary: 'Opere fluxos assíncronos com contexto, métricas e menor privilégio.', why: 'Sem uma request aguardando, o caminho de um evento atravessa tempo e processos. Logs isolados não dizem onde ele parou nem se backlog representa crescimento normal ou incidente.',
    prerequisites: ['delivery-failure-lab', 'observabilidade-pratica'], englishLevel: 3,
    concepts: [['Correlação e causalidade', 'eventId identifica mensagem; correlationId liga fluxo; causationId aponta a mensagem que originou outra. Não reutilize todos como uma única string sem semântica.'], ['Métricas', 'Lag/backlog, idade da mensagem mais antiga, taxa, erro, retry, DLQ e duração do handler medem saúde; contagem bruta sem capacidade não basta.'], ['Tracing assíncrono', 'Propague contexto no envelope e crie spans producer/consumer sem fingir uma única chamada síncrona.'], ['Segurança', 'IAM mínimo por topic/queue, criptografia em trânsito/repouso, policies restritas, payload sem segredo e validação de schema/origem.']],
    decision: 'Não registre payload integral por padrão: pode conter PII/secrets e aumentar custo. Use identificadores, campos permitidos e amostragem consciente.',
    prediction: ['Backlog é 10 mil. Isso prova incidente?', 'Não sozinho. Compare taxa de chegada/consumo, idade, capacidade e SLO; backlog pode ser esperado em lote.'],
    exercise: ['Painel operacional', 'Defina sinais e alertas para publisher, broker, consumer, retry e DLQ.', ['Alertas apontam impacto e ação.', 'Correlação atravessa eventos derivados.', 'PII não entra em logs.']],
    quiz: ['Qual métrica detecta mensagem antiga presa mesmo com throughput alto?', 'Idade da mensagem mais antiga.', 'Número de classes Java.', 'Somente CPU do producer.'],
    resources: [['official-docs', 'OpenTelemetry messaging semantic conventions', 'https://opentelemetry.io/docs/specs/semconv/messaging/', 'Spans, atributos e contexto em messaging.'], ['official-docs', 'AWS SNS security', 'https://docs.aws.amazon.com/sns/latest/dg/sns-security.html', 'IAM, proteção de dados e policies.']]
  },
  {
    id: 'async-integration-tests', moduleId: 'messaging-eda', title: 'Testcontainers e testes assíncronos determinísticos',
    summary: 'Teste banco, Kafka e AWS local sem sleeps arbitrários.', why: 'Mock não reproduz SQL, broker, serialização ou offsets. Teste de integração precisa de dependências reais descartáveis e uma condição observável, não Thread.sleep torcendo para terminar.',
    prerequisites: ['testcontainers', 'aws-sns-sqs', 'delivery-failure-lab'], englishLevel: 3,
    concepts: [['Testcontainers', 'Container descartável fornece dependência real em estado conhecido. Fixe imagem compatível, espere readiness e compartilhe ciclo conforme isolamento exigido.'], ['Kafka container', 'A API atual usa org.testcontainers.kafka.KafkaContainer ou ConfluentKafkaContainer; a classe antiga em org.testcontainers.containers está depreciada.'], ['LocalStack', 'Permite testar APIs AWS localmente, mas comportamento não é identidade perfeita com AWS. A documentação atual exige auth token a partir de 23/03/2026; registre essa limitação e ofereça alternativa/mocks para testes comuns.'], ['Awaitility', 'Espera uma condição até deadline e produz diagnóstico. Não cria sincronização/thread safety e não substitui assertiva de efeito observável.']],
    decision: 'Use unit tests para regras puras e integração para fronteiras reais. Não transforme toda a suíte em containers nem use sleep fixo; espere estado com limite e diagnóstico.',
    code: ['Condição assíncrona, não atraso arbitrário', 'publish(orderCreated);\nawait().atMost(Duration.ofSeconds(10))\n    .pollInterval(Duration.ofMillis(100))\n    .untilAsserted(() ->\n        assertThat(repository.findById(id)).hasValueSatisfying(Order::isReserved));'],
    prediction: ['Trocar sleep(5000) por sleep(10000) torna teste determinístico?', 'Não. Continua dependente de timing e fica mais lento; espere a condição com deadline e falha diagnóstica.'],
    exercise: ['Matriz de testes EDA', 'Separe unit, database container, Kafka container, LocalStack/contract e end-to-end.', ['Cada camada tem falha que só ela detecta.', 'Async usa condição observável.', 'Imagens/dependências são atuais e fixadas.']],
    quiz: ['O que Awaitility não faz?', 'Garantir thread safety do código testado.', 'Repetir uma condição até deadline.', 'Falhar quando a condição não ocorre.'],
    project: ['Suíte de confiabilidade EDA', ['PostgreSQL e Kafka Testcontainers 2.0.5', 'Awaitility 4.3.1', 'Crash/duplicação/schema inválido', 'Relatório de evidência'], 'independent', ['Sem sleeps fixos.', 'Falha mostra causa útil.', 'Suite roda isolada e limpa recursos.']],
    resources: [['official-docs', 'Testcontainers Kafka module', 'https://java.testcontainers.org/modules/kafka/', 'Containers Kafka atuais e classe depreciada.'], ['official-docs', 'Testcontainers LocalStack module', 'https://java.testcontainers.org/modules/localstack/', 'Integração AWS local e requisito atual de autenticação.'], ['official-docs', 'Awaitility usage', 'https://github.com/awaitility/awaitility/wiki/Usage', 'Polling, deadline, fail-fast e limitações.']]
  }
];

export const requiredChapters = inputs.map(makeChapter);
