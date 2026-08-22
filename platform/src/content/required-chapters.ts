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
  curriculumOrder?: number;
  objectives?: string[];
  introducedConceptIds?: string[];
  usedConceptIds?: string[];
  analogyLimit?: string;
  semanticBlocks?: ContentBlock[];
  skipConceptQuizzes?: boolean;
  codeExplanation?: { explanation: string[]; commonMistakes: string[] };
  projectKnowledgeMatrix?: NonNullable<Extract<ContentBlock, { type: 'project' }>['knowledgeMatrix']>;
  auditedResources?: Resource[];
  audit?: Chapter['audit'];
}

const englishTopics: Record<string, string> = {
  'associacoes-cardinalidade': 'object associations and cardinality',
  'functional-semantics-lab': 'Optional, Set, lambdas, and Stream semantics',
  'process-api-cli': 'Java Process API and CLI process boundaries',
  'zenith-cli-inicial': 'deterministic Zenith CLI assistant',
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
  const conceptIds = input.concepts.map(([title]) => title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
  );
  const conceptQuizzes: ContentBlock[] = input.concepts.map(([title, body], index) => {
    const conceptId = conceptIds[index] ?? `${input.id}-concept-${index}`;
    const firstDistractor = input.concepts[(index + 1) % input.concepts.length] ?? [title, body];
    const secondDistractor = input.concepts[(index + 2) % input.concepts.length] ?? [title, body];
    return {
      id: `${input.id}-concept-check-${index}`,
      type: 'quiz',
      authorship: 'authored',
      conceptId,
      prompt: `Ao decidir sobre “${title}”, qual afirmação preserva o comportamento estudado?`,
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
      authorship: 'authored',
      title: 'O problema antes da ferramenta',
      body: input.why,
      analogyLimit: input.analogyLimit
    },
    ...input.concepts.map(([title, body], index): ContentBlock => ({
      id: `${input.id}-concept-${index}`,
      type: 'concept',
      authorship: 'authored',
      title,
      body
    })),
    {
      id: `${input.id}-decision`,
      type: 'callout',
      authorship: 'authored',
      tone: 'domain',
      title: 'Quando usar e quando não usar',
      body: input.decision
    },
    ...(input.semanticBlocks ?? []),
    ...(input.code
      ? [{
          id: `${input.id}-code`,
          type: 'code' as const,
          authorship: 'authored' as const,
          language: 'java',
          caption: input.code[0],
          source: input.code[1],
          ...(input.codeExplanation ?? {})
        }]
      : []),
    {
      id: `${input.id}-prediction`,
      type: 'prediction',
      authorship: 'authored',
      prompt: input.prediction[0],
      answer: input.prediction[1]
    },
    {
      id: `${input.id}-exercise`,
      type: 'exercise',
      authorship: 'authored',
      title: input.exercise[0],
      prompt: input.exercise[1],
      difficulty: input.englishLevel >= 2 ? 'advanced' : 'intermediate',
      criteria: input.exercise[2]
    },
    ...(input.skipConceptQuizzes ? [] : conceptQuizzes),
    {
      id: `${input.id}-quiz`,
      type: 'quiz',
      authorship: 'authored',
      conceptId: input.id,
      prompt: input.quiz[0],
      options: [
        { id: `${input.id}-q-a`, label: input.quiz[1], correct: true, explanation: 'Esta alternativa preserva o contrato e o comportamento observável descritos no cenário.' },
        { id: `${input.id}-q-b`, label: input.quiz[2], correct: false, explanation: 'Esta alternativa aplica uma regra geral sem representar a relação e suas restrições reais.' },
        { id: `${input.id}-q-c`, label: input.quiz[3], correct: false, explanation: 'Esta alternativa desloca a decisão para uma tecnologia ou efeito que não define o modelo.' }
      ]
    },
    ...(input.project
      ? [{
          id: `${input.id}-project`,
          type: 'project' as const,
          authorship: 'authored' as const,
          title: input.project[0],
          brief: `Construa uma aplicação verificável para aplicar ${input.title}.`,
          requirements: input.project[1],
          guidance: input.project[2],
          acceptanceCriteria: input.project[3],
          knowledgeMatrix: input.projectKnowledgeMatrix,
          englishSpecification: input.englishLevel >= 2 ? englishProjectSpecification(input) : undefined
        }]
      : [])
  ];

  return {
    id: input.id,
    moduleId: input.moduleId,
    order: input.curriculumOrder ?? 10_000 + order,
    title: input.title,
    summary: input.summary,
    objectives: input.objectives ?? input.concepts.map(([title]) => `Raciocinar sobre ${title.toLowerCase()}`),
    whyItExists: input.why,
    prerequisiteChapterIds: input.prerequisites,
    conceptIds,
    introducedConceptIds: input.introducedConceptIds ?? [],
    usedConceptIds: input.usedConceptIds ?? [],
    estimatedMinutes: input.project ? 240 : 120,
    englishLevel: input.englishLevel,
    blocks,
    resources: input.auditedResources ?? input.resources.map(([type, title, url, reinforces], index) => ({
      id: `${input.id}-resource-${index}`,
      type,
      title,
      url,
      reinforces,
      language: 'en',
      auditStatus: 'pending'
    })),
    englishActivity: technicalEnglish(input),
    audit: input.audit ?? { status: 'needs-revision', sourceKind: 'structured-typescript' }
  };
}

const inputs: ChapterInput[] = [
  {
    id: 'associacoes-cardinalidade', moduleId: 'oop-modeling', title: 'Associações, cardinalidade e invariantes entre objetos',
    summary: 'Modele direção, quantidade, ownership e consistência das relações antes de tecnologias de persistência.',
    why: 'Objetos raramente vivem isolados. Sem declarar quem conhece quem, quantos participantes são permitidos e quem protege a mudança, o programa cria referências contraditórias mesmo que cada classe isolada pareça correta.',
    prerequisites: ['pilares-profundo'], englishLevel: 0, curriculumOrder: 10,
    objectives: ['Representar associações uni e bidirecionais', 'Declarar mínimos e máximos da cardinalidade', 'Distinguir associação, agregação e composição pelo ciclo de vida', 'Preservar os dois lados por uma única operação de domínio'],
    introducedConceptIds: ['associacao-direcao', 'cardinalidade-objeto', 'composicao-ciclo-vida', 'consistencia-relacao'],
    usedConceptIds: ['identidade-referencia-objeto', 'encapsulamento-invariante', 'heranca-composicao', 'abstracao-modelagem', 'array-indice-length'],
    analogyLimit: 'Desenhar linhas entre caixas mostra navegação e quantidade, mas não substitui as operações que preservam o grafo em memória.',
    skipConceptQuizzes: true,
    concepts: [
      ['Associação e direção', 'Uma associação significa que um objeto conhece ou colabora com outro. Unidirecional tem navegação em um sentido; bidirecional mantém referências nos dois e custa mais para permanecer coerente.'],
      ['Cardinalidade', 'Zero ou um, exatamente um e zero ou muitos expressam limites do domínio. Nesta fase, o lado muitos usa array e contador; a relação não depende de coleção ou banco.'],
      ['Agregação, composição e ciclo de vida', 'Associação apenas conecta; agregação comunica todo e partes independentes; composição dá ao todo responsabilidade forte por criar, manter e tornar a parte inacessível com seu próprio ciclo.'],
      ['Consistência dos dois lados', 'Relação bidirecional precisa de uma operação responsável por validar capacidade, evitar duplicidade e atualizar ambos os lados como uma única transição observável.']
    ],
    decision: 'Comece unidirecional. Adicione o caminho de volta somente se um caso de uso precisar navegar por ele. Se a relação possui data, status ou regras próprias, transforme-a em uma classe; não esconda esses dados em duas referências soltas.',
    semanticBlocks: [{
      id: 'associacoes-cardinalidade-model', type: 'mental-model', authorship: 'authored', title: 'Uma relação é um grafo de referências',
      body: 'Cada objeto é um nó; cada campo de referência é uma aresta navegável. A cardinalidade limita quantas arestas podem existir e uma operação de domínio mantém as representações coerentes.',
      flow: ['Cliente pede adicionar endereço', 'Cliente verifica null, duplicidade e capacidade', 'Array recebe a referência na próxima posição', 'Contador avança somente após a inclusão válida'],
      ownership: ['Cliente protege seu array e contador', 'Endereco continua sendo um objeto independente neste modelo', 'Código externo não escreve posições nem contador diretamente']
    }, {
      id: 'associacoes-cardinalidade-table', type: 'table', authorship: 'authored', title: 'Cardinalidade em memória',
      headers: ['Regra', 'Representação inicial', 'Caso-limite'], rows: [['0..1', 'referência que pode ser null', 'segunda associação substitui ou deve ser recusada conforme contrato'], ['1', 'referência obrigatória no construtor', 'null não produz objeto válido'], ['0..N limitado', 'array + contador', 'capacidade cheia precisa ser recusada antes do acesso']],
      caption: 'Coleções dinâmicas serão ensinadas em Java Core; arrays tornam os limites visíveis nesta fase.'
    }, {
      id: 'associacoes-direcao-quiz', type: 'quiz', authorship: 'authored', conceptId: 'associacao-e-direcao',
      prompt: 'O sistema lista os endereços de um cliente, mas nunca precisa descobrir o cliente a partir de um endereço. Qual direção é suficiente?',
      options: [
        { id: 'associacoes-direcao-a', label: 'Cliente mantém referências para Endereco; Endereco não aponta de volta.', correct: true, explanation: 'A navegação unidirecional atende ao único caso de uso e evita um segundo lado para sincronizar.' },
        { id: 'associacoes-direcao-b', label: 'Os dois objetos precisam apontar um para o outro porque toda associação é bidirecional.', correct: false, explanation: 'Bidirecionalidade só se justifica quando há navegação inversa necessária e adiciona uma invariante de consistência.' },
        { id: 'associacoes-direcao-c', label: 'Endereco deve herdar Cliente para permitir a navegação.', correct: false, explanation: 'Um endereço não é um cliente; herança não representa colaboração entre instâncias.' }
      ]
    }, {
      id: 'associacoes-cardinalidade-rule-quiz', type: 'quiz', authorship: 'authored', conceptId: 'cardinalidade',
      prompt: 'Um Pedido válido precisa ter exatamente um Cliente desde sua criação. Qual representação expressa melhor essa regra nesta fase?',
      options: [
        { id: 'associacoes-cardinalidade-a', label: 'Receber Cliente no construtor, recusar null e guardar uma referência privada.', correct: true, explanation: 'A construção torna explícita a cardinalidade mínima e máxima igual a um.' },
        { id: 'associacoes-cardinalidade-b', label: 'Criar um array de clientes e deixar todas as posições vazias.', correct: false, explanation: 'Isso representa uma quantidade diferente e permite Pedido sem cliente.' },
        { id: 'associacoes-cardinalidade-c', label: 'Guardar apenas o nome do cliente em String.', correct: false, explanation: 'Copiar um atributo não representa a associação com a identidade do Cliente.' }
      ]
    }, {
      id: 'associacoes-ciclo-quiz', type: 'quiz', authorship: 'authored', conceptId: 'agregacao-composicao-e-ciclo-de-vida',
      prompt: 'Um Endereco já existe, pode ser compartilhado e continua válido se um Cliente deixar de referenciá-lo. O que isso revela?',
      options: [
        { id: 'associacoes-ciclo-a', label: 'O ciclo de vida é independente; não há composição forte nesse modelo.', correct: true, explanation: 'A parte não pertence exclusivamente ao todo e não nasce nem deixa de existir com ele.' },
        { id: 'associacoes-ciclo-b', label: 'É composição obrigatória porque existe um campo de referência.', correct: false, explanation: 'Um campo prova navegação, não ownership exclusivo ou dependência de ciclo de vida.' },
        { id: 'associacoes-ciclo-c', label: 'É herança porque os dois objetos possuem identidade.', correct: false, explanation: 'Identidade não cria relação de subtipo; os objetos apenas colaboram.' }
      ]
    }, {
      id: 'associacoes-consistencia-quiz', type: 'quiz', authorship: 'authored', conceptId: 'consistencia-dos-dois-lados',
      prompt: 'Turma e Aluno precisam navegar para suas Matriculas. Como evitar que apenas um lado seja atualizado?',
      options: [
        { id: 'associacoes-consistencia-a', label: 'Uma única operação valida e atualiza todas as referências e contadores envolvidos.', correct: true, explanation: 'Centralizar a transição impede que consumidores executem apenas metade da mudança.' },
        { id: 'associacoes-consistencia-b', label: 'Expor os arrays para o menu atualizar cada lado quando lembrar.', correct: false, explanation: 'Estado exposto permite mudanças parciais e contadores divergentes.' },
        { id: 'associacoes-consistencia-c', label: 'Duplicar a regra em getters dos três objetos.', correct: false, explanation: 'Getter deve consultar; duplicação não define responsável nem garante uma transição completa.' }
      ]
    }],
    code: ['Um-para-muitos limitado sem coleção futura', 'public final class Cliente {\n    private final String nome;\n    private final Endereco[] enderecos = new Endereco[3];\n    private int quantidade;\n\n    public Cliente(String nome) { this.nome = nome; }\n\n    public boolean adicionarEndereco(Endereco endereco) {\n        if (endereco == null || quantidade == enderecos.length) return false;\n        for (int i = 0; i < quantidade; i++) {\n            if (enderecos[i] == endereco) return false;\n        }\n        enderecos[quantidade] = endereco;\n        quantidade++;\n        return true;\n    }\n}'],
    codeExplanation: { explanation: ['O array representa o máximo três e quantidade separa posições ocupadas das posições null ainda livres.', 'A operação recusa null, capacidade cheia e a mesma identidade antes de alterar array e contador.', 'A relação é unidirecional: Endereco não precisa conhecer Cliente sem um requisito de navegação inversa.'], commonMistakes: ['Expor o array por getter e permitir escrita externa', 'Incrementar o contador antes de validar', 'Criar referência de volta sem caso de uso'] },
    prediction: ['Cliente adiciona Endereco, mas Endereco não aponta de volta para Cliente. Isso é inconsistente?', 'Não necessariamente. A associação é unidirecional por escolha; só há inconsistência quando o contrato declara dois lados e eles discordam.'],
    exercise: ['Modelagem antes de persistência', 'Modele Turma, Matricula e Aluno com arrays. Matricula deve guardar aluno, turma, período e status; Turma controla capacidade e não aceita o mesmo aluno duas vezes.', ['Cardinalidades mínimas e máximas estão escritas.', 'Matricula é classe porque a relação possui dados e regras.', 'Uma única operação valida e registra a matrícula.', 'Capacidade cheia e duplicidade não alteram estado.']],
    quiz: ['Quando a relação merece uma classe própria?', 'Quando possui dados, regras ou ciclo de vida que não pertencem isoladamente a nenhum participante.', 'Sempre que duas classes possuem campos String.', 'Somente quando uma tecnologia de banco exige tabela intermediária.'],
    auditedResources: [{ id: 'associacoes-jls-reference-types', type: 'reference', title: 'JLS 4.3: tipos de referência e objetos', url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.3', reinforces: 'Fundamenta identidade, referências e objetos usados para formar o grafo em memória.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-21', auditStatus: 'approved' }, { id: 'associacoes-jls-arrays', type: 'reference', title: 'JLS 10: arrays', url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html', reinforces: 'Confirma a representação de cardinalidade limitada sem antecipar Collections.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-21', auditStatus: 'approved' }],
    resources: [],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-21', notes: ['Associações ensinadas em memória com arrays antes de ORM ou Collections.'] }
  },
  {
    id: 'functional-semantics-lab', moduleId: 'java-core', title: 'Optional, lambdas, Set e Streams por semântica',
    summary: 'Escolha APIs funcionais pela pergunta feita aos dados.', why: 'Código funcional vira receita quando filter, map, flatMap, Optional e Set são ensinados como palavras soltas. A escolha deve começar pela cardinalidade e pelo efeito desejado.',
    prerequisites: ['javamoderno'], englishLevel: 1, curriculumOrder: 6,
    objectives: ['Derivar a API da cardinalidade e do efeito', 'Explicar igualdade e ordem antes de escolher Set', 'Provar lazy evaluation e ausência de interferência', 'Comparar loop e Stream sem dogma'],
    introducedConceptIds: ['escolha-api-semantica', 'evidencia-pipeline'],
    usedConceptIds: ['list-set-map-semantica', 'equals-hashcode-contrato', 'chave-hash-estavel', 'optional-zero-ou-um', 'lambda-target-typing', 'map-flatmap-cardinalidade', 'stream-nao-interferencia'],
    analogyLimit: 'Uma tabela de cardinalidade ajuda a selecionar a abstração, mas custo, legibilidade, ordem e mutabilidade ainda precisam ser validados no caso concreto.',
    concepts: [
      ['Optional', 'Representa zero ou um resultado no retorno. Não corrige entidade parcialmente inicializada, não deve mascarar null em todo campo e não substitui uma coleção vazia.'],
      ['Lambda e captura', 'Uma lambda descreve comportamento e pode capturar variáveis efetivamente finais. Efeitos colaterais compartilhados quebram previsibilidade, sobretudo em parallelStream.'],
      ['Set e igualdade', 'Set responde pertencimento/unicidade. HashSet depende do contrato entre equals e hashCode; TreeSet depende de uma ordem compatível com a noção de duplicidade.'],
      ['map versus flatMap', 'map preserva a camada do resultado; flatMap evita estruturas aninhadas quando a função já devolve um contexto como Optional ou Stream.']
    ],
    decision: 'Use Stream para transformação declarativa finita, não para esconder I/O, mutação ou depuração difícil. Use Set quando a pergunta for unicidade/pertencimento, não para “ser mais rápido” sem medir e sem definir igualdade.',
    semanticBlocks: [{
      id: 'functional-semantics-table', type: 'table', authorship: 'authored', title: 'Cardinalidade e efeito antes da API',
      headers: ['Contrato', 'Candidato', 'Prova mínima'], rows: [['zero ou um resultado', 'Optional<T>', 'vazio e presente'], ['muitos com ordem e duplicata', 'List<T>', 'ordem e repetição'], ['muitos únicos', 'Set<T>', 'equals/hashCode e mutação'], ['transformação composta', 'Stream<T>', 'fonte preservada, vazio e terminal'], ['transição com estado ou early return complexo', 'loop', 'estado a cada iteração e saída']],
      caption: 'A escolha final também considera leitura, custo e contrato de mutabilidade.'
    }, {
      id: 'functional-semantics-error', type: 'error-case', authorship: 'authored', title: 'Set não corrige duplicidade mal definida',
      scenario: 'Dois clientes com o mesmo e-mail entram no HashSet porque a classe herdou equals de Object.', symptom: 'O conjunto mantém duas identidades que o domínio chama de mesmo cliente.',
      cause: 'A estrutura recebeu igualdade de identidade, mas o requisito esperava igualdade lógica por e-mail.',
      diagnosis: ['escrever a regra de identidade lógica', 'verificar reflexividade, simetria e transitividade', 'verificar hash coerente e campo estável'],
      correction: 'Definir equals/hashCode com uma identidade imutável ou escolher outra chave explícita.', prevention: 'Testar igual, diferente, hash collision e mutação antes de confiar em Set ou Map.'
    }],
    prediction: ['Se equals considera email, mas hashCode usa id mutável, contains continuará confiável?', 'Não. O elemento pode ficar no bucket calculado pelo valor antigo e o contrato de HashSet foi violado.'],
    exercise: ['Pergunta antes da API', 'Para seis requisitos, escreva primeiro a cardinalidade de entrada/saída e só depois escolha loop, Set, Optional ou Stream.', ['Cada escolha explica semântica, não estilo.', 'Não há mutação compartilhada em pipeline.', 'Casos vazio, duplicado e nulo são testados.']],
    quiz: ['Qual retorno expressa “pode existir um cliente, no máximo um”?', 'Optional<Cliente>.', 'Stream<Optional<Cliente>>.', 'Cliente nulo sem contrato.'],
    resources: [],
    auditedResources: [{ id: 'functional-stream-api', type: 'reference', title: 'Stream package — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html', reinforces: 'Define non-interference, stateless behavior, operações intermediárias e terminais.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'functional-collections', type: 'guide', title: 'dev.java: Collections Framework', url: 'https://dev.java/learn/api/collections-framework/', reinforces: 'Relaciona contratos de List, Set, Map, mutabilidade e escolha de implementação.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Laboratório integrador após Collections, Generics, Streams e Java moderno.'] }
  },
  {
    id: 'process-api-cli', moduleId: 'io-cli-serialization', title: 'Process API: executando programas externos com segurança',
    summary: 'Modele processos filhos como fronteiras externas: argumentos, streams, exit code, timeout e risco de shell.',
    why: 'Uma CLI Java muitas vezes precisa chamar outro programa: git, javac, uma ferramenta local ou um script controlado. Isso não é uma chamada de método. O processo filho tem ciclo de vida próprio, stdout, stderr, código de saída, bloqueios possíveis e riscos de injeção quando shell e texto livre entram na conversa.',
    prerequisites: ['json'], englishLevel: 1, curriculumOrder: 3,
    objectives: ['Distinguir comando, argumento, shell e processo filho', 'Capturar stdout, stderr e exit code sem deadlock', 'Aplicar timeout e política de encerramento', 'Evitar command injection por concatenação de entrada'],
    introducedConceptIds: ['processo-filho-contrato', 'stdout-stderr-exit-code', 'shell-quoting-injection', 'process-timeout-cancelamento'],
    usedConceptIds: ['stream-resource-lifecycle', 'cli-stdin-stdout', 'checked-unchecked-contrato'],
    analogyLimit: 'Processo filho lembra pedir trabalho a outro programa, mas ele não compartilha heap, exceções Java ou transação com o processo pai.',
    concepts: [
      ['Processo filho', 'ProcessBuilder inicia outro programa do sistema operacional. Ele recebe lista de argumentos, ambiente, diretório de trabalho e redirecionamentos; o resultado precisa ser observado por streams e exit code.'],
      ['stdout, stderr e exit code', 'stdout é saída comum, stderr é diagnóstico, e exit code comunica sucesso ou falha por convenção do programa chamado. Nenhum deles equivale automaticamente a exceção Java.'],
      ['Shell e argumentos', 'ProcessBuilder com lista evita parsing do shell. Shell só deve entrar quando você realmente precisa de recursos como expansão, pipe ou redirecionamento, e nunca com entrada livre concatenada.'],
      ['Timeout e encerramento', 'Processo externo pode travar, esperar entrada ou produzir saída demais. Defina deadline, drene streams e declare se vai encerrar normalmente, forçar ou reportar recuperação manual.']
    ],
    decision: 'Use Process API para chamar ferramentas conhecidas e controladas. Não use para executar comando arbitrário informado pelo usuário. Quando o trabalho puder ser feito por API Java estável, prefira a API: ela é tipada, testável e portável.',
    semanticBlocks: [{
      id: 'process-api-flow', type: 'diagram', authorship: 'authored', title: 'Ciclo de vida de um processo filho',
      description: 'O processo pai configura, inicia, consome saídas, espera término e transforma o resultado em contrato Java.',
      steps: ['montar lista comando + argumentos', 'definir diretório e ambiente mínimo', 'iniciar processo', 'drenar stdout e stderr', 'aguardar com timeout', 'ler exit code', 'devolver resultado tipado']
    }, {
      id: 'process-api-error', type: 'error-case', authorship: 'authored', title: 'O processo parece travado, mas o buffer encheu',
      scenario: 'Um comando escreve muito em stderr e o programa Java só chama waitFor sem consumir a saída.',
      symptom: 'O processo não termina ou parece congelado.',
      cause: 'O buffer do pipe pode encher; o filho fica bloqueado tentando escrever e o pai fica bloqueado esperando término.',
      diagnosis: ['verificar se stdout e stderr são consumidos', 'testar com saída grande', 'adicionar timeout e relatório de bytes capturados'],
      correction: 'Drenar os streams enquanto o processo executa ou redirecionar saída de forma controlada.',
      prevention: 'Todo wrapper de processo deve declarar política para stdout, stderr, tamanho máximo, timeout e exit code.'
    }, {
      id: 'process-api-security', type: 'callout', authorship: 'authored', tone: 'security', title: 'Command injection começa como conveniência',
      body: 'Montar "sh -c " + textoDoUsuario permite que caracteres do shell mudem o comando executado. Para comandos conhecidos, passe cada argumento como item separado e valide allowlist de executáveis/opções.'
    }],
    code: ['Wrapper mínimo com argumentos separados, arquivos temporários e timeout', 'record ProcessResult(int exitCode, String stdout, String stderr) {}\n\nstatic ProcessResult runCommand(List<String> command, Duration timeout) throws IOException, InterruptedException {\n    Path stdoutFile = Files.createTempFile("stdout-", ".txt");\n    Path stderrFile = Files.createTempFile("stderr-", ".txt");\n    try {\n        Process process = new ProcessBuilder(command)\n            .redirectOutput(stdoutFile.toFile())\n            .redirectError(stderrFile.toFile())\n            .start();\n        boolean finished = process.waitFor(timeout.toMillis(), TimeUnit.MILLISECONDS);\n        if (!finished) {\n            process.destroy();\n            if (!process.waitFor(200, TimeUnit.MILLISECONDS)) process.destroyForcibly();\n            throw new IllegalStateException("process timeout: " + command.get(0));\n        }\n        return new ProcessResult(\n            process.exitValue(),\n            Files.readString(stdoutFile, StandardCharsets.UTF_8),\n            Files.readString(stderrFile, StandardCharsets.UTF_8));\n    } finally {\n        Files.deleteIfExists(stdoutFile);\n        Files.deleteIfExists(stderrFile);\n    }\n}'],
    codeExplanation: { explanation: ['A lista command separa executável e argumentos sem pedir parsing ao shell.', 'Redirecionar stdout e stderr para arquivos evita depender de buffers de pipe para saídas maiores.', 'waitFor com timeout impede espera infinita e define política de encerramento antes de devolver exit code e diagnóstico.'], commonMistakes: ['Concatenar entrada de usuário em sh -c', 'Ignorar stderr e exit code', 'Esquecer cleanup dos arquivos temporários'] },
    prediction: ['Um comando imprime aviso em stderr e retorna exit code 0. Isso é falha?', 'Não obrigatoriamente. O contrato do programa chamado define o significado; seu wrapper deve preservar stderr e exit code para a camada de decisão.'],
    exercise: ['Executor permitido', 'Crie um wrapper que execute apenas comandos de uma allowlist, com diretório controlado, timeout, captura separada de stdout/stderr e erro tipado para exit code diferente de zero.', ['Argumentos são lista, não string de shell.', 'Timeout possui teste com processo lento.', 'stdout e stderr aparecem separados no resultado.', 'Comando fora da allowlist é recusado antes de iniciar processo.']],
    quiz: ['Por que passar argumentos separados ao ProcessBuilder?', 'Porque evita depender do parsing do shell e reduz risco de injeção.', 'Porque transforma qualquer comando em sucesso.', 'Porque stderr vira exceção Java automaticamente.'],
    resources: [],
    auditedResources: [{ id: 'process-api-processbuilder', type: 'reference', title: 'ProcessBuilder API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ProcessBuilder.html', reinforces: 'Define criação de processos, comando, ambiente, diretório e redirecionamentos.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'process-api-process', type: 'reference', title: 'Process API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Process.html', reinforces: 'Define stdout, stderr, stdin, waitFor, exitValue, destroy e ciclo de vida.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Shell livre, pipes, processos longos e concorrência profunda ficam fora desta fase.'] }
  },
  {
    id: 'zenith-cli-inicial', moduleId: 'io-cli-serialization', title: 'Projeto Zenith inicial: assistente CLI determinístico',
    summary: 'Construa a primeira versão do Zenith como CLI restrita, auditável e reproduzível.',
    why: 'Zenith só é útil como projeto de estudo se cada incremento usar conceitos já ensinados. A primeira versão não interpreta linguagem natural aberta nem executa qualquer comando: ela recebe comandos pequenos, valida argumentos, chama funções ou processos permitidos e produz relatório verificável.',
    prerequisites: ['mini-importador-pedidos'], englishLevel: 1, curriculumOrder: 5,
    objectives: ['Definir uma gramática pequena de comandos', 'Separar parsing, autorização, execução e relatório', 'Executar somente ações permitidas e reproduzíveis', 'Registrar evidência sem segredos nem caminho local'],
    introducedConceptIds: ['zenith-comando-deterministico'],
    usedConceptIds: ['processo-filho-contrato', 'stdout-stderr-exit-code', 'shell-quoting-injection', 'process-timeout-cancelamento', 'importacao-tolerante', 'relatorio-dados-deterministico'],
    analogyLimit: 'Chamar de assistente ajuda a dar forma ao projeto, mas nesta fase ele é uma CLI determinística, não IA, chatbot, agente autônomo ou executor irrestrito.',
    concepts: [
      ['Comandos permitidos', 'Cada comando tem nome, argumentos, validação e ação definida em código. Texto desconhecido falha com mensagem útil em vez de tentar adivinhar intenção.'],
      ['Camadas do Zenith', 'Parser transforma texto em comando; policy autoriza; executor chama função ou processo permitido; reporter devolve saída determinística e segura.'],
      ['Evidência reproduzível', 'Fixtures, arquivos de exemplo, exit codes e relatórios permitem repetir o mesmo cenário sem internet, segredo ou estado escondido.'],
      ['Limite consciente', 'Sem shell livre, sem rede, sem deletar arquivos e sem modificar diretórios fora da pasta do projeto. O escopo pequeno protege o aprendizado.']
    ],
    decision: 'Comece com dois ou três comandos úteis e chatos: validar CSV, gerar relatório e checar versão de uma ferramenta permitida. Só aumente o escopo quando houver teste, política e evidência para cada ação.',
    semanticBlocks: [{
      id: 'zenith-architecture', type: 'mental-model', authorship: 'authored', title: 'Zenith como pipeline de decisão',
      body: 'A entrada textual não executa nada diretamente. Ela atravessa parsing, validação, autorização, execução controlada e relatório.',
      flow: ['linha da CLI', 'parser reconhece comando', 'validador tipa argumentos', 'policy aplica allowlist', 'executor chama caso de uso ou Process API', 'reporter escreve saída e evidência'],
      ownership: ['parser não acessa filesystem', 'policy não executa processo', 'executor não decide texto livre', 'reporter não altera domínio']
    }, {
      id: 'zenith-command-table', type: 'table', authorship: 'authored', title: 'Primeiros comandos sugeridos',
      headers: ['Comando', 'Entrada', 'Saída', 'Conceitos usados'],
      rows: [['validate-orders', 'CSV de pedidos', 'JSON de aceitos/rejeitados', 'I/O, JSON, validação'], ['sales-report', 'CSV de vendas', 'relatório ordenado', 'Streams, BigDecimal, relatório determinístico'], ['tool-version', 'nome em allowlist', 'stdout/stderr/exit code', 'Process API']]
    }, {
      id: 'zenith-project-block', type: 'project', authorship: 'authored', title: 'Zenith CLI v0',
      brief: 'Implemente uma CLI determinística com comandos pequenos, fixtures e relatório de evidência.',
      requirements: ['Comandos desconhecidos falham sem executar nada.', 'Argumentos são validados antes da ação.', 'Process API usa allowlist, timeout e captura separada de stdout/stderr.', 'Relatórios são gravados em UTF-8 e têm ordem determinística.', 'README documenta comandos, fixtures, limites e decisões.'],
      guidance: 'guided',
      acceptanceCriteria: ['Funciona offline com fixtures do repositório.', 'Não executa shell livre nem comandos fora da allowlist.', 'Falhas de arquivo, parsing, validação e processo têm mensagens diferentes.', 'Testes cobrem comando válido, comando inválido, argumento ausente, timeout e relatório gerado.'],
      knowledgeMatrix: [
        { requirement: 'CLI determinística', conceptIds: ['cli-stdin-stdout', 'zenith-comando-deterministico'], chapterIds: ['entrada-console', 'zenith-cli-inicial'], expectedEvidence: 'Tabela com comandos aceitos, argumentos, erros e exemplos.' },
        { requirement: 'Importação e relatório', conceptIds: ['importacao-tolerante', 'relatorio-dados-deterministico'], chapterIds: ['mini-importador-pedidos', 'mini-analisador-vendas'], expectedEvidence: 'Fixtures com aceitos/rejeitados e saída JSON estável.' },
        { requirement: 'Processo externo permitido', conceptIds: ['processo-filho-contrato', 'stdout-stderr-exit-code', 'process-timeout-cancelamento'], chapterIds: ['process-api-cli'], expectedEvidence: 'Teste com comando permitido, comando negado e processo lento.' },
        { requirement: 'Segurança de comandos', conceptIds: ['shell-quoting-injection'], chapterIds: ['process-api-cli'], expectedEvidence: 'Nenhum comando usa sh -c com entrada do usuário; allowlist revisável.' }
      ]
    }],
    code: ['Dispatcher pequeno, sem texto livre', 'sealed interface ZenithCommand permits ValidateOrders, SalesReport, ToolVersion {}\nrecord ValidateOrders(Path input, Path output) implements ZenithCommand {}\nrecord SalesReport(Path input, Path output) implements ZenithCommand {}\nrecord ToolVersion(String toolName) implements ZenithCommand {}\n\nstatic int execute(ZenithCommand command) {\n    return switch (command) {\n        case ValidateOrders task -> validateOrders(task.input(), task.output());\n        case SalesReport task -> generateSalesReport(task.input(), task.output());\n        case ToolVersion task -> printAllowedToolVersion(task.toolName());\n    };\n}'],
    codeExplanation: { explanation: ['A sealed interface limita os tipos de comando que o dispatcher aceita.', 'Cada record carrega argumentos já parseados e tipados.', 'O switch exaustivo impede que um comando novo seja esquecido silenciosamente.'], commonMistakes: ['Executar a linha digitada diretamente', 'Misturar parsing e regra dentro do switch', 'Adicionar comando que modifica arquivos fora do escopo sem política'] },
    prediction: ['Usuário digita “rode qualquer comando: rm -rf dados”. O Zenith v0 deve tentar interpretar?', 'Não. Comando desconhecido ou fora da allowlist deve falhar antes de qualquer execução. Nesta fase, previsibilidade vale mais que esperteza.'],
    exercise: ['Tabela de comandos antes do código', 'Escreva a especificação dos comandos, argumentos, exemplos, erros e arquivos tocados antes de implementar o parser.', ['A tabela cabe em uma página.', 'Cada comando mapeia para conceitos já ensinados.', 'Nenhum comando depende de internet ou segredo.', 'Cada erro esperado possui mensagem e teste.']],
    quiz: ['Por que Zenith v0 não deve aceitar linguagem natural aberta?', 'Porque o objetivo é estudar contratos verificáveis com repertório atual, não adivinhar intenção nem executar ações inseguras.', 'Porque Java não consegue ler texto.', 'Porque ProcessBuilder exige Spring Boot.'],
    resources: [],
    auditedResources: [{ id: 'zenith-processbuilder', type: 'reference', title: 'ProcessBuilder API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ProcessBuilder.html', reinforces: 'Base para comandos externos permitidos do Zenith v0.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'zenith-jls-sealed', type: 'reference', title: 'JLS 8.1.1.2: sealed classes', url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.1.2', reinforces: 'Fundamenta o conjunto fechado de comandos modelado por tipos.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Zenith inicia como CLI determinística; IA, rede, TUI e automação ampla ficam para fases futuras.'] }
  },
  {
    id: 'jdbc-under-the-hood', moduleId: 'relational-data-jdbc', title: 'JDBC por baixo do CRUD',
    summary: 'Entenda driver, conexão, protocolo, statements, transação e falhas.', why: 'JDBC é a fronteira onde objetos, SQL, rede, recursos e transações se encontram. Uma sequência conectar-executar-fechar não ensina ownership nem o que ocorre quando a segunda operação falha.',
    prerequisites: ['jdbc', 'mini-financas-jdbc'], englishLevel: 1, curriculumOrder: 6,
    introducedConceptIds: [],
    usedConceptIds: ['jdbc-driver-connection', 'preparedstatement-parametro', 'resultset-mapeamento', 'jdbc-transacao-rollback', 'pool-conexao-backpressure', 'mvcc-isolamento-lock'],
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
    resources: [],
    auditedResources: [{ id: 'jdbc-under-connection-api', type: 'reference', title: 'Connection API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Connection.html', reinforces: 'Contrato de sessão, auto-commit, commit, rollback, isolamento e fechamento.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'jdbc-under-resultset-api', type: 'reference', title: 'ResultSet API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/ResultSet.html', reinforces: 'Cursor, navegação, leitura de colunas e vínculo com statement/conexão.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22' }
  },
  {
    id: 'http-wire-contract', moduleId: 'http-api-clients', title: 'HTTP no fio: request, response e semântica',
    summary: 'Leia HTTP antes de usar controllers.', why: 'Sem enxergar método, target, headers, body, status e cache, anotações de framework parecem produzir respostas por magia.',
    prerequisites: ['http'], englishLevel: 1, curriculumOrder: 1,
    introducedConceptIds: ['curl-inspecao-http'],
    usedConceptIds: ['http-mensagem-recurso', 'http-metodo-semantica', 'http-status-classe', 'http-idempotencia-seguranca', 'http-header-body-negociacao'],
    codeExplanation: { explanation: ['curl -i mostra status line, headers e body, não apenas o conteúdo final.', 'Accept declara que o cliente prefere JSON como representação da resposta.', 'A URL identifica o recurso remoto inspecionado de forma reproduzível.'], commonMistakes: ['Testar só no navegador e não ver headers', 'Confundir Accept com Content-Type', 'Não registrar status e headers ao diagnosticar API'] },
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
    resources: [],
    auditedResources: [{ id: 'http-wire-rfc9110', type: 'reference', title: 'RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110', reinforces: 'Define métodos, status, representações, headers, segurança e idempotência.', language: 'en', publisher: 'IETF', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'http-wire-curl-manpage', type: 'reference', title: 'curl man page', url: 'https://curl.se/docs/manpage.html', reinforces: 'Documenta opções específicas para inspeção, headers, verbose output e reprodução de requests.', language: 'en', publisher: 'curl', official: true, expectedLevel: 'beginner', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22' }
  },
  {
    id: 'java-httpclient-json', moduleId: 'http-api-clients', title: 'Java HttpClient e JSON sem framework web',
    summary: 'Consuma uma API com biblioteca padrão e mapeamento explícito.', why: 'Antes de WebClient ou clients declarativos, o aluno precisa montar uma request, escolher timeout, observar status e converter bytes em um modelo próprio.',
    prerequisites: ['http-wire-contract', 'json', 'excecoes'], englishLevel: 1, curriculumOrder: 2,
    introducedConceptIds: ['httpclient-reuso-timeout', 'http-response-bodyhandler', 'dto-mapping-fronteira'],
    usedConceptIds: ['http-status-classe', 'http-header-body-negociacao', 'serializacao-desserializacao', 'checked-unchecked-contrato'],
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
    projectKnowledgeMatrix: [
      { requirement: 'Cliente HTTP reutilizável', conceptIds: ['httpclient-reuso-timeout'], chapterIds: ['java-httpclient-json'], expectedEvidence: 'Um único HttpClient configurado com timeouts e usado por múltiplas chamadas.' },
      { requirement: 'Contrato de status e body', conceptIds: ['http-response-bodyhandler', 'http-status-classe'], chapterIds: ['http', 'java-httpclient-json'], expectedEvidence: 'Testes para 2xx, 404, 429 e 5xx com tipos de erro diferentes.' },
      { requirement: 'DTO separado do domínio', conceptIds: ['dto-mapping-fronteira', 'serializacao-desserializacao'], chapterIds: ['json', 'java-httpclient-json'], expectedEvidence: 'Mapper explícito valida ausência/null antes de construir domínio.' },
      { requirement: 'Execução offline testável', conceptIds: ['stub-http-deterministico'], chapterIds: ['pure-java-api-project'], expectedEvidence: 'Servidor stub local reproduz payload, atraso e status sem internet.' }
    ],
    codeExplanation: { explanation: ['HttpClient é configurado uma vez com connectTimeout e pode ser reutilizado.', 'HttpRequest declara timeout da requisição, Accept e método GET.', 'A resposta é avaliada por status antes de tratar o body como sucesso.'], commonMistakes: ['Criar HttpClient a cada chamada', 'Ignorar status e parsear body sempre', 'Achar que timeout garante que o servidor não processou a requisição'] },
    resources: [],
    auditedResources: [{ id: 'java-httpclient-api', type: 'reference', title: 'HttpClient API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.net.http/java/net/http/HttpClient.html', reinforces: 'Define criação, reuso, envio síncrono/assíncrono e configuração do cliente.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'java-httpresponse-api', type: 'reference', title: 'HttpResponse API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.net.http/java/net/http/HttpResponse.html', reinforces: 'Documenta statusCode, headers, body e BodyHandlers.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22' }
  },
  {
    id: 'unreliable-api-client', moduleId: 'http-api-clients', title: 'APIs externas falham: timeout, retry, limites e secrets',
    summary: 'Projete integrações sob falha parcial.', why: 'Uma integração que funciona no caminho feliz não está pronta: rede atrasa, respostas mudam, credenciais expiram, limites são atingidos e a resposta pode se perder depois do efeito remoto.',
    prerequisites: ['java-httpclient-json'], englishLevel: 1, curriculumOrder: 3,
    introducedConceptIds: ['timeout-deadline-cancelamento-http', 'retry-backoff-jitter', 'rate-limit-paginacao', 'secrets-integracao'],
    usedConceptIds: ['http-idempotencia-seguranca', 'http-status-classe', 'httpclient-reuso-timeout', 'configuracao-externa', 'gitignore-secrets'],
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
    resources: [],
    auditedResources: [{ id: 'unreliable-timeout-exception', type: 'reference', title: 'HttpTimeoutException API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.net.http/java/net/http/HttpTimeoutException.html', reinforces: 'Define falha temporal no cliente Java e sua posição na hierarquia de exceções.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'unreliable-aws-backoff', type: 'reference', title: 'Timeouts, retries, and backoff with jitter', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', reinforces: 'Explica limites, retries, backoff, jitter e riscos de amplificação em sistemas distribuídos.', language: 'en', publisher: 'AWS', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22' }
  },
  {
    id: 'pure-java-api-project', moduleId: 'http-api-clients', title: 'Projeto: integração entre APIs em Java puro',
    summary: 'Consolide HTTP, JSON, concorrência e resiliência antes do Spring.', why: 'O projeto prova que HTTP e integração são conhecimentos de Java/backend, não efeitos de anotações Spring.',
    prerequisites: ['unreliable-api-client', 'testes'], englishLevel: 1, curriculumOrder: 4,
    introducedConceptIds: ['stub-http-deterministico', 'falha-parcial-cache-stale'],
    usedConceptIds: ['httpclient-reuso-timeout', 'http-response-bodyhandler', 'dto-mapping-fronteira', 'retry-backoff-jitter', 'rate-limit-paginacao', 'secrets-integracao'],
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
    projectKnowledgeMatrix: [
      { requirement: 'Duas integrações independentes', conceptIds: ['httpclient-reuso-timeout', 'http-response-bodyhandler'], chapterIds: ['java-httpclient-json'], expectedEvidence: 'Cada API possui adapter, timeout, DTO e erro próprio.' },
      { requirement: 'Falha parcial representável', conceptIds: ['falha-parcial-cache-stale'], chapterIds: ['pure-java-api-project'], expectedEvidence: 'Saída diferencia completo, parcial, indisponível e stale.' },
      { requirement: 'Política defensiva', conceptIds: ['retry-backoff-jitter', 'rate-limit-paginacao'], chapterIds: ['unreliable-api-client'], expectedEvidence: 'Matriz cobre 429, 5xx, timeout, JSON inválido e retry limitado.' },
      { requirement: 'Teste offline', conceptIds: ['stub-http-deterministico', 'teste-aaa-first'], chapterIds: ['testes', 'pure-java-api-project'], expectedEvidence: 'HttpServer local injeta status, headers, atraso e payload sem internet.' },
      { requirement: 'Configuração segura', conceptIds: ['secrets-integracao', 'configuracao-externa'], chapterIds: ['logging', 'unreliable-api-client'], expectedEvidence: 'API keys vêm do ambiente e não aparecem em logs, fixtures ou README.' }
    ],
    resources: [],
    auditedResources: [{ id: 'pure-httpserver-api', type: 'reference', title: 'JDK HttpServer API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpServer.html', reinforces: 'Servidor HTTP local para testes controlados de status, headers, payload e atraso.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'pure-completablefuture-api', type: 'reference', title: 'CompletableFuture API — Java 21', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html', reinforces: 'Composição assíncrona explícita para chamadas independentes com limites.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Sem Spring; integração defensiva em Java puro antes de frameworks.'] }
  },
  {
    id: 'rest-resource-contracts', moduleId: 'spring-api', title: 'REST: recursos, DTOs, validação e erros',
    summary: 'Projete o contrato antes das anotações.', why: 'Uma API não é REST porque devolve JSON. O contrato precisa representar recursos, transições, status, validação, concorrência e erros que clientes consigam interpretar.',
    prerequisites: ['pure-java-api-project', 'spring-mvc'], englishLevel: 2, curriculumOrder: 14,
    objectives: ['Modelar recursos antes de endpoints soltos', 'Separar DTO público de Entity persistente', 'Publicar erros HTTP estáveis e úteis', 'Prever concorrência, idempotência e evolução de contrato'],
    introducedConceptIds: [],
    usedConceptIds: ['mvc-controller-binding', 'dto-entity-boundary-spring', 'bean-validation-boundary', 'controller-advice-problem-details', 'http-optimistic-concurrency', 'api-compatible-evolution'],
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
    resources: [],
    auditedResources: [{ id: 'rest-mvc-controller-contract', type: 'reference', title: 'Spring MVC: Annotated Controllers', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html', reinforces: 'Mostra como controllers recebem request, fazem binding e publicam respostas sem virar domínio.', language: 'en', publisher: 'Spring', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'rest-problem-details-rfc9457', type: 'reference', title: 'RFC 9457: Problem Details for HTTP APIs', url: 'https://www.rfc-editor.org/rfc/rfc9457', reinforces: 'Define estrutura interoperável para erros HTTP publicados como contrato.', language: 'en', publisher: 'IETF', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Fecha o módulo Spring/API conectando MVC, DTO, validação, erro e evolução de contrato.'] }
  },
  {
    id: 'api-contract-evolution', moduleId: 'api-security-quality', title: 'OpenAPI, testes e evolução de contratos',
    summary: 'Use contrato como artefato verificável, não decoração.', why: 'Uma API usada por outros times precisa evoluir sem surpresas. Documentação gerada depois do código não substitui decisões de compatibilidade nem testes do que foi publicado.',
    prerequisites: ['rest-resource-contracts', 'paginacao-swagger'], englishLevel: 2, curriculumOrder: 7,
    objectives: ['Tratar OpenAPI como contrato verificável', 'Classificar breaking changes por impacto em cliente', 'Usar testes para travar request, response e erro', 'Planejar depreciação sem quebrar consumidores silenciosamente'],
    introducedConceptIds: ['contract-test-evolution', 'openapi-breaking-change', 'spring-rest-docs-contract'],
    usedConceptIds: ['openapi-documentation-contract', 'api-compatible-evolution', 'controller-advice-problem-details', 'frontend-api-error-state'],
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
    resources: [],
    auditedResources: [{ id: 'api-contract-openapi-311', type: 'reference', title: 'OpenAPI Specification 3.1.1', url: 'https://spec.openapis.org/oas/v3.1.1.html', reinforces: 'Estrutura formal de paths, operations, parameters, schemas, responses e exemplos.', language: 'en', publisher: 'OpenAPI Initiative', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'api-contract-spring-restdocs', type: 'reference', title: 'Spring REST Docs Reference', url: 'https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/', reinforces: 'Documentação de API gerada a partir de testes que verificam request e response.', language: 'en', publisher: 'Spring', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Fecha a fase de segurança/qualidade conectando contrato, consumidores e regressão verificável.'] }
  },
  {
    id: 'tcp-protocol-design', moduleId: 'concurrency-network-tui', title: 'Sockets TCP e desenho de protocolo',
    summary: 'Construa comunicação além de HTTP sem perder framing e falhas.', why: 'TCP entrega um fluxo ordenado de bytes, não mensagens. Sem framing, charset, timeout e encerramento, dois programas podem concordar com tipos Java e ainda discordar no fio.',
    prerequisites: ['java-io', 'threads'], englishLevel: 2, curriculumOrder: 3,
    objectives: ['Explicar TCP como fluxo de bytes, não mensagens', 'Projetar framing e limite de tamanho', 'Controlar concorrência, timeout e shutdown', 'Evitar protocolo próprio quando HTTP/WebSocket/broker resolvem melhor'],
    introducedConceptIds: ['tcp-stream-framing', 'socket-timeout-backpressure'],
    usedConceptIds: ['stream-resource-lifecycle', 'thread-lifecycle-scheduler', 'deadlock-livelock-starvation'],
    concepts: [['Socket e endpoint', 'IP identifica host e porta identifica processo/serviço. ServerSocket aceita conexões; cada Socket possui streams independentes.'], ['Framing', 'Delimitador, tamanho prefixado ou formato autodescritivo define onde termina uma mensagem; uma leitura não corresponde necessariamente a um envio.'], ['Concorrência e backpressure', 'Um executor limitado controla conexões. Fila ilimitada apenas move a sobrecarga para memória.'], ['Timeout e shutdown', 'Read timeout evita espera infinita; encerramento coordenado para de aceitar, termina trabalho e fecha recursos.']],
    decision: 'Use protocolo próprio apenas quando o domínio/ambiente justificar. HTTP, WebSocket ou broker resolvem interoperabilidade; socket cru transfere para você framing, compatibilidade, segurança e operação.',
    prediction: ['write enviou 100 bytes. Uma chamada read receberá exatamente 100?', 'Não. TCP é stream; a leitura pode devolver menos ou combinar dados disponíveis. O protocolo precisa de framing e loop.'],
    exercise: ['Protocolo de chat', 'Defina wire format versionado, tamanho máximo, autenticação inicial e erros antes de implementar.', ['Mensagens têm limite e framing.', 'Entrada malformada não derruba o servidor.', 'Concorrência é limitada.']],
    quiz: ['O que TCP preserva?', 'Ordem do fluxo de bytes em uma conexão, não fronteiras de mensagens.', 'Uma mensagem por read.', 'Entrega exatamente uma vez após crash.'],
    project: ['Servidor de chat TCP', ['Múltiplos clientes', 'Protocolo documentado', 'Heartbeat e timeout', 'Shutdown coordenado'], 'bounded', ['Teste fragmenta writes deliberadamente.', 'Não há thread/fila ilimitada.', 'Cliente incompatível recebe erro útil.']],
    projectKnowledgeMatrix: [
      { requirement: 'Framing versionado', conceptIds: ['tcp-stream-framing'], chapterIds: ['tcp-protocol-design', 'java-io'], expectedEvidence: 'Teste fragmenta writes e comprova reconstrução de mensagens.' },
      { requirement: 'Concorrência limitada', conceptIds: ['socket-timeout-backpressure', 'atomic-concurrent-utilities'], chapterIds: ['threads', 'tcp-protocol-design'], expectedEvidence: 'Executor/fila têm limite e recusam excesso de forma observável.' },
      { requirement: 'Shutdown seguro', conceptIds: ['socket-timeout-backpressure', 'stream-resource-lifecycle'], chapterIds: ['tcp-protocol-design', 'java-io'], expectedEvidence: 'Servidor para de aceitar, finaliza conexões e fecha recursos.' }
    ],
    resources: [],
    auditedResources: [{ id: 'java-networking-api', type: 'reference', title: 'Java networking API — Java 25', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/net/package-summary.html', reinforces: 'Sockets, endereços, portas e opções de rede.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'tcp-rfc9293', type: 'reference', title: 'RFC 9293: Transmission Control Protocol', url: 'https://www.rfc-editor.org/rfc/rfc9293', reinforces: 'Contrato do TCP como fluxo ordenado de bytes.', language: 'en', publisher: 'IETF', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Aprofunda comunicação abaixo de HTTP sem exigir conhecimento futuro de mensageria.'] }
  },
  {
    id: 'lanterna-tui', moduleId: 'concurrency-network-tui', title: 'Lanterna: uma TUI real em Java',
    summary: 'Separe Terminal, Screen, componentes e estado.', why: 'Uma TUI cria interface interativa em ambiente textual e força decisões úteis sobre event loop, foco, redimensionamento e separação entre domínio e apresentação.',
    prerequisites: ['java-io', 'interfaces', 'threads'], englishLevel: 2, curriculumOrder: 4,
    objectives: ['Separar terminal, screen, widgets e domínio', 'Desenhar UI textual com buffer e cleanup', 'Modelar event loop e foco sem acoplar regra ao toolkit', 'Testar estado sem depender do terminal real'],
    introducedConceptIds: ['tui-terminal-screen-buffer', 'tui-event-loop-state'],
    usedConceptIds: ['stream-resource-lifecycle', 'interface-contrato', 'thread-lifecycle-scheduler'],
    concepts: [['Terminal', 'Camada de baixo nível para cursor, teclas, cores e tamanho. Dá controle, mas exige redraw e input explícitos.'], ['Screen', 'Buffer de tela que permite desenhar um quadro e atualizar diferenças com refresh, reduzindo flicker.'], ['GUI2', 'Camada de janelas e componentes como Label, Button e TextBox. É produtiva quando o layout cabe no modelo de componentes.'], ['Event loop e estado', 'Entrada produz intenção, reducer/caso de uso altera estado e renderização reflete o novo estado. Domínio não importa Lanterna.']],
    decision: 'Use Terminal/Screen para visualização customizada e GUI2 para formulários/janelas. Não introduza threads só para input; primeiro defina ownership da UI e passagem de eventos.',
    code: ['Screen mínimo com fechamento garantido', 'var terminal = new DefaultTerminalFactory().createTerminal();\ntry (var screen = new TerminalScreen(terminal)) {\n    screen.startScreen();\n    screen.newTextGraphics().putString(2, 1, "java4br");\n    screen.refresh();\n    screen.readInput();\n}'],
    codeExplanation: { explanation: ['DefaultTerminalFactory cria a abstração de terminal concreta para o ambiente atual.', 'TerminalScreen mantém buffer visual; try-with-resources garante fechamento mesmo se leitura/refresh falhar.'], commonMistakes: ['Deixar terminal sem cleanup e quebrar o shell após erro.', 'Colocar regra de domínio dentro de widgets ou objetos Lanterna.'] },
    prediction: ['O domínio recebe TextBox para validar um nome. Qual acoplamento surgiu?', 'A regra passou a depender do toolkit visual; deveria receber texto/command e devolver resultado independente da UI.'],
    exercise: ['Redimensionamento e foco', 'Implemente lista filtrável que mantém seleção válida ao redimensionar e não bloqueia o domínio.', ['Estado não vive nos widgets.', 'Esc fecha com cleanup.', 'Layout pequeno possui fallback.']],
    quiz: ['Qual papel do Screen?', 'Manter um buffer visual e aplicar atualizações ao terminal.', 'Persistir o domínio em banco.', 'Criar uma thread por tecla.'],
    project: ['Monitor de tarefas TUI', ['Lista, filtro e formulário', 'Atalhos documentados', 'Persistência em JSON', 'Estado testável sem terminal'], 'bounded', ['Terminal sempre fecha.', 'Navegação funciona por teclado.', 'Domínio possui testes sem Lanterna.']],
    projectKnowledgeMatrix: [
      { requirement: 'Buffer visual com cleanup', conceptIds: ['tui-terminal-screen-buffer', 'stream-resource-lifecycle'], chapterIds: ['lanterna-tui', 'java-io'], expectedEvidence: 'Terminal fecha em sucesso, erro e Esc.' },
      { requirement: 'Estado testável sem terminal', conceptIds: ['tui-event-loop-state', 'interface-contrato'], chapterIds: ['lanterna-tui', 'interfaces'], expectedEvidence: 'Reducer/caso de uso possui testes sem criar Terminal real.' },
      { requirement: 'Entrada e foco previsíveis', conceptIds: ['tui-event-loop-state'], chapterIds: ['lanterna-tui'], expectedEvidence: 'Atalhos, foco e redimensionamento têm critérios reproduzíveis.' }
    ],
    resources: [],
    auditedResources: [{ id: 'lanterna-repository', type: 'reference', title: 'Lanterna repository and guide', url: 'https://github.com/mabe02/lanterna', reinforces: 'Versão 3.1.2, camadas e exemplos oficiais.', language: 'en', publisher: 'Lanterna', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'lanterna-api-docs', type: 'reference', title: 'Lanterna API docs 3.1', url: 'https://mabe02.github.io/lanterna/apidocs/3.1/', reinforces: 'Terminal, Screen, TextGraphics e GUI2.', language: 'en', publisher: 'Lanterna', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Ensina UI textual como arquitetura de estado e eventos, não como adereço visual.'] }
  },
  {
    id: 'developer-tools-java', moduleId: 'concurrency-network-tui', title: 'Ferramentas para desenvolvedores em Java',
    summary: 'Construa utilitários reais com processos, arquivos e observabilidade.', why: 'Java serve para CLIs, automação e ferramentas de infraestrutura. Projetos pequenos tornam contratos de sistema operacional, streaming e saída observáveis sem depender de CRUD.',
    prerequisites: ['java-io', 'build', 'logging'], englishLevel: 2, curriculumOrder: 5,
    objectives: ['Executar processos externos sem shell injection', 'Drenar stdout/stderr, timeout e exit code corretamente', 'Monitorar filesystem com rescan e idempotência', 'Usar JFR/jcmd como diagnóstico por evidência'],
    introducedConceptIds: ['watchservice-filesystem-events', 'jfr-jcmd-diagnostics'],
    usedConceptIds: ['processo-filho-contrato', 'process-timeout-cancelamento', 'path-filesystem', 'files-nio-atomicidade'],
    concepts: [['ProcessBuilder', 'Argumentos são valores separados, não uma string de shell. stdout, stderr, exit code, timeout e cancelamento precisam de contrato.'], ['WatchService', 'Notifica mudanças de diretório, mas eventos podem ser agrupados/perdidos; rescan e idempotência mantêm a visão correta.'], ['JFR e jcmd', 'Ferramentas do JDK observam JVM em execução. Diagnóstico começa por evidência, não por flags copiadas.']],
    decision: 'Use ferramenta Java quando portabilidade, APIs do ecossistema e manutenção justificarem o runtime. Para transformação de uma linha, shell pode ser mais simples.',
    prediction: ['Processo filho escreve stderr suficiente e ninguém consome. O que pode ocorrer?', 'O buffer pode encher e bloquear o filho, parecendo deadlock; ambos os streams precisam ser drenados.'],
    exercise: ['Wrapper de processo', 'Execute comando permitido com deadline, capture saídas separadas e produza resultado tipado.', ['Não usa shell injection.', 'Timeout encerra árvore conforme política.', 'Exit code não é ignorado.']],
    quiz: ['Por que passar argumentos separados ao ProcessBuilder?', 'Evita depender do parsing do shell e reduz injeção.', 'Faz qualquer comando retornar zero.', 'Converte stderr em stdout automaticamente.'],
    project: ['Analisador incremental de logs', ['WatchService com rescan', 'Parser por linha', 'Métricas e relatório', 'Backpressure'], 'bounded', ['Arquivo rotacionado é tratado.', 'Memória é limitada.', 'Fixtures cobrem linhas inválidas.']],
    projectKnowledgeMatrix: [
      { requirement: 'Processo externo seguro', conceptIds: ['processo-filho-contrato', 'process-timeout-cancelamento'], chapterIds: ['process-api-cli', 'developer-tools-java'], expectedEvidence: 'Argumentos são separados, stdout/stderr drenados e timeout testado.' },
      { requirement: 'Monitoramento incremental', conceptIds: ['watchservice-filesystem-events', 'files-nio-atomicidade'], chapterIds: ['developer-tools-java', 'java-io'], expectedEvidence: 'Watcher faz rescan e trata rotação/duplicidade de eventos.' },
      { requirement: 'Diagnóstico por evidência', conceptIds: ['jfr-jcmd-diagnostics'], chapterIds: ['developer-tools-java', 'jvm-profundo'], expectedEvidence: 'Relatório diferencia hipótese de evidência coletada por ferramenta.' }
    ],
    resources: [],
    auditedResources: [{ id: 'developer-processbuilder-api', type: 'reference', title: 'ProcessBuilder API — Java 25', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ProcessBuilder.html', reinforces: 'Processos, argumentos, ambiente e redirecionamento.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'developer-jdk-diagnostic-tools', type: 'reference', title: 'JDK troubleshooting tools — Java 25', url: 'https://docs.oracle.com/en/java/javase/25/troubleshoot/diagnostic-tools.html', reinforces: 'JFR, jcmd, jstack e evidência operacional da JVM.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Fecha o módulo mostrando Java como ferramenta de automação, diagnóstico e operação local.'] }
  },
  {
    id: 'coupled-services-lab', moduleId: 'synchronous-integration', title: 'Do monólito aos serviços síncronos acoplados',
    summary: 'Experimente a falha que motiva assincronia.', why: 'EDA só faz sentido depois que o aluno mede o acoplamento temporal: checkout depende de estoque, pagamento e notificação disponíveis na mesma janela.',
    prerequisites: ['rest-resource-contracts', 'webclient', 'ddd-estrategico'], englishLevel: 2,
    objectives: ['Medir acoplamento temporal entre serviços síncronos', 'Modelar timeout como estado desconhecido', 'Definir deadline e idempotência antes de retry', 'Registrar evidência que justifica ou rejeita mensageria depois'],
    introducedConceptIds: ['temporal-coupling-sync', 'partial-failure-unknown-state', 'synchronous-deadline-budget'],
    usedConceptIds: ['spring-webclient-reactive-client', 'frontend-backend-contract', 'anti-corruption-integration-contract', 'timeout-deadline-cancelamento-http', 'http-idempotencia-seguranca'],
    concepts: [['Monólito modular', 'Módulos no mesmo processo podem preservar fronteiras sem rede. Separar deploy não corrige modelo ruim.'], ['Acoplamento temporal', 'No síncrono, chamador e chamado precisam estar disponíveis ao mesmo tempo e a latência se soma ao caminho crítico.'], ['Falha parcial', 'Timeout deixa resultado desconhecido. Retry, compensação e idempotência surgem antes de qualquer broker.']],
    decision: 'Mantenha síncrono quando resposta imediata e consistência do fluxo são valiosas. Migre etapas desacopláveis somente após medir disponibilidade, latência e necessidade de buffer.',
    prediction: ['Pagamento confirmou, mas checkout perdeu a resposta. O serviço deve marcar falha definitiva?', 'Não. O estado é desconhecido; precisa consultar/reconciliar usando identidade idempotente.'],
    exercise: ['Laboratório de indisponibilidade', 'Separe três serviços HTTP e injete atraso, 503 e resposta perdida.', ['Métricas mostram latência acumulada.', 'Estados desconhecidos são modelados.', 'A decisão de assíncrono aponta uma dor medida.']],
    quiz: ['Qual custo nasce ao separar processos?', 'Rede, falhas parciais, observabilidade e evolução de contrato.', 'Transações distribuídas gratuitas.', 'Eliminação de acoplamento lógico.'],
    project: ['Checkout síncrono instrumentado', ['Três serviços', 'Timeout/deadline', 'Idempotency key', 'Tracing/correlation ID'], 'independent', ['Falhas são reproduzíveis.', 'Baseline orientará o redesenho EDA.', 'Nenhum retry infinito.']],
    projectKnowledgeMatrix: [
      { requirement: 'Acoplamento temporal medido', conceptIds: ['temporal-coupling-sync', 'synchronous-deadline-budget'], chapterIds: ['webclient', 'coupled-services-lab'], expectedEvidence: 'Relatório mostra latência acumulada e caminho crítico antes/depois da falha injetada.' },
      { requirement: 'Estado desconhecido modelado', conceptIds: ['partial-failure-unknown-state', 'http-idempotencia-seguranca'], chapterIds: ['unreliable-api-client', 'coupled-services-lab'], expectedEvidence: 'Timeout não vira falha definitiva sem reconciliação/idempotency key.' },
      { requirement: 'Fronteira de domínio preservada', conceptIds: ['anti-corruption-integration-contract', 'frontend-backend-contract'], chapterIds: ['ddd-estrategico', 'conectando-front-back'], expectedEvidence: 'DTO externo é traduzido antes de alterar agregado interno.' }
    ],
    resources: [],
    auditedResources: [{ id: 'aws-timeouts-retries-backoff', type: 'reference', title: 'AWS Builders Library: Timeouts, retries, and backoff with jitter', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', reinforces: 'Falhas síncronas, timeout, retry responsável e jitter.', language: 'en', publisher: 'AWS', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'spring-rest-clients-coupling', type: 'official-docs', title: 'Spring REST clients', url: 'https://docs.spring.io/spring-framework/reference/integration/rest-clients.html', reinforces: 'Clientes síncronos, reativos e declarativos em integrações HTTP.', language: 'en', publisher: 'Spring', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Laboratório posiciona resiliência depois da dor síncrona medida e antes de mensageria.'] }
  },
  {
    id: 'in-memory-event-bus', moduleId: 'messaging-eda', title: 'Event Bus em Java puro',
    summary: 'Aprenda evento e dispatch antes do broker.', why: 'Um barramento em memória expõe publicação, handlers, ordem, isolamento de falha e testes sem esconder conceitos em Kafka ou cloud.',
    prerequisites: ['coupled-services-lab', 'interfaces', 'generics'], englishLevel: 3, curriculumOrder: 1,
    objectives: ['Construir um event bus tipado em Java puro', 'Diferenciar evento, comando e mensagem antes de broker real', 'Definir política de erro de subscriber', 'Explicar por que bus em memória ainda é síncrono e não durável'],
    introducedConceptIds: ['event-command-message-intent'],
    usedConceptIds: ['message-envelope-payload-metadata', 'temporal-coupling-sync', 'interface-contrato', 'declaracao-generica-bound'],
    analogyLimit: 'Um quadro de avisos ajuda a visualizar publish/subscribe, mas aqui tudo ainda roda no mesmo processo e some no crash.',
    concepts: [['Event, command e message', 'Evento registra fato passado; comando pede ação a um destinatário; mensagem é o envelope transportado. O nome expressa intenção e tempo.'], ['Dispatch', 'O bus encontra subscribers por tipo/rota. Um handler falho não deve corromper silenciosamente os demais.'], ['Sincronia escondida', 'Um event bus in-memory chamado na mesma stack ainda é síncrono; desacopla código, não disponibilidade nem deploy.']],
    decision: 'Use o bus para aprender e para eventos internos simples. Não o apresente como substituto durável de broker: crash perde memória e publicação/transação continuam acopladas.',
    prediction: ['publish chama handlers na mesma thread. O produtor já é assíncrono?', 'Não. Ele ainda aguarda todos os handlers; apenas a dependência de tipos pode ter diminuído.'],
    exercise: ['Falha de subscriber', 'Defina política quando um de três handlers lança exceção.', ['Semântica é explícita.', 'Erros são observáveis.', 'Ordem e reentrância possuem teste.']],
    quiz: ['Qual nome descreve melhor PedidoConfirmado?', 'Evento: um fato passado relevante.', 'Comando para talvez confirmar.', 'Fila física.'],
    project: ['Event Bus tipado', ['Subscribe/unsubscribe', 'Dispatch por tipo', 'Política de erro', 'Testes de ordem/reentrância'], 'bounded', ['Sem reflection desnecessária.', 'API impede handlers incompatíveis.', 'Limites de durabilidade documentados.']],
    projectKnowledgeMatrix: [
      { requirement: 'API tipada de publicação', conceptIds: ['event-command-message-intent', 'declaracao-generica-bound'], chapterIds: ['interfaces', 'generics', 'in-memory-event-bus'], expectedEvidence: 'O compilador impede handler incompatível e os nomes diferenciam evento de comando.' },
      { requirement: 'Política de erro explícita', conceptIds: ['partial-failure-unknown-state', 'temporal-coupling-sync'], chapterIds: ['coupled-services-lab', 'in-memory-event-bus'], expectedEvidence: 'Teste mostra se falha de um subscriber interrompe, isola ou acumula erro.' },
      { requirement: 'Limite de durabilidade documentado', conceptIds: ['message-envelope-payload-metadata'], chapterIds: ['mensageria', 'in-memory-event-bus'], expectedEvidence: 'README declara que o bus em memória não persiste nem desacopla disponibilidade.' }
    ],
    resources: [['official-docs', 'Java Flow API', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Flow.html', 'Publisher/subscriber e backpressure como referência, não obrigação.'], ['video', 'Souza: evolução síncrona para EDA', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg', 'Trechos 01:29-18:12: síncrono, monólito e serviços acoplados.']],
    auditedResources: [{ id: 'java-flow-api-phase16', type: 'official-docs', title: 'Java Flow API', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Flow.html', reinforces: 'Publisher, Subscriber, Subscription e Processor como vocabulário Java para fluxo de mensagens.', language: 'en', publisher: 'Oracle', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'guava-eventbus-phase16', type: 'reference', title: 'Guava EventBus explained', url: 'https://github.com/google/guava/wiki/EventBusExplained', reinforces: 'Limitações práticas de event bus em processo e alternativas modernas.', language: 'en', publisher: 'Google Guava', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Capítulo mantém a introdução rasa antes de broker real e explicita o limite síncrono/durável.'] }
  },
  {
    id: 'messaging-model', moduleId: 'messaging-eda', title: 'Messaging: queue, pub/sub, broker e entrega',
    summary: 'Escolha o canal pela responsabilidade.', why: 'Queue e pub/sub resolvem problemas diferentes. Sem distinguir competição por trabalho de distribuição de fatos, topologias parecem apenas caixas e setas.',
    prerequisites: ['in-memory-event-bus'], englishLevel: 3, curriculumOrder: 2,
    objectives: ['Escolher queue ou pub/sub pela responsabilidade', 'Explicar broker, backlog e backpressure operacional', 'Comparar semânticas de entrega sem vender exactly-once mágico', 'Nomear mensagens como evento ou comando pelo contrato esperado'],
    introducedConceptIds: ['broker-backlog-backpressure'],
    usedConceptIds: ['queue-work-competing-consumers', 'pubsub-fanout-subscription', 'delivery-at-least-once-idempotency', 'event-command-message-intent'],
    concepts: [['Queue', 'Consumidores competem pelo trabalho; cada mensagem deve ser processada por um membro lógico, aceitando redelivery conforme o broker.'], ['Publish/subscribe', 'Cada assinatura interessada recebe sua cópia. Fan-out permite ritmos e retenções independentes.'], ['Broker e backpressure', 'Broker armazena/roteia; backlog torna diferença entre produção e consumo observável, mas exige limite, retenção e alarmes.'], ['Delivery semantics', 'At-most-once pode perder; at-least-once pode duplicar; exactly-once é garantia limitada por fronteiras e não elimina idempotência do efeito externo.']],
    decision: 'Use command queue quando há um dono do trabalho; publique event quando múltiplos consumidores independentes podem reagir. Não use evento como RPC sem resposta explícita.',
    prediction: ['Dois consumidores do mesmo grupo recebem cópias para fan-out?', 'Não; no mesmo grupo eles dividem trabalho. Fan-out exige assinaturas/grupos independentes.'],
    exercise: ['Escolha de topologia', 'Modele envio de e-mail, baixa de estoque, analytics e comando de estorno.', ['Eventos e comandos têm nomes temporais corretos.', 'Cada consumidor tem política de backlog.', 'Não há promessa vaga de exactly-once.']],
    quiz: ['Qual topologia entrega uma cópia independente a auditoria e analytics?', 'Pub/sub com assinaturas duráveis separadas.', 'Uma queue com consumidores competindo.', 'Uma chamada HTTP sem persistência.'],
    resources: [['official-docs', 'Apache Kafka design', 'https://kafka.apache.org/40/documentation.html#design', 'Log, consumers e delivery.'], ['video', 'Souza: SNS, SQS e microservices EDA', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg', 'Trechos 18:22-53:42: fan-out e evolução arquitetural.']],
    auditedResources: [{ id: 'enterprise-integration-patterns-message-channel', type: 'reference', title: 'Enterprise Integration Patterns: Message Channel', url: 'https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageChannel.html', reinforces: 'Canal de mensagens como abstração entre produtor e consumidor.', language: 'en', publisher: 'Enterprise Integration Patterns', official: false, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'enterprise-integration-patterns-pubsub-channel', type: 'reference', title: 'Enterprise Integration Patterns: Publish-Subscribe Channel', url: 'https://www.enterpriseintegrationpatterns.com/patterns/messaging/PublishSubscribeChannel.html', reinforces: 'Distribuição de uma mensagem para múltiplos assinantes independentes.', language: 'en', publisher: 'Enterprise Integration Patterns', official: false, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Fecha a ponte conceitual entre bus local, fila, fan-out, broker e semântica de entrega.'] }
  },
  {
    id: 'aws-sns-sqs', moduleId: 'messaging-eda', title: 'AWS SNS + SQS: fan-out durável',
    summary: 'Implemente tópico, filas, policies e consumers idempotentes.', why: 'SNS distribui notificações e SQS amortece processamento. Juntos permitem que cada consumidor receba sua cópia, progrida no próprio ritmo e sobreviva a indisponibilidade temporária.',
    prerequisites: ['messaging-model', 'docker-conceitos'], englishLevel: 3, curriculumOrder: 3,
    objectives: ['Montar fan-out SNS para filas SQS independentes', 'Consumir SQS com receipt handle e delete após efeito', 'Comparar Standard e FIFO sem prometer exactly-once global', 'Aplicar policies mínimas e idempotência'],
    introducedConceptIds: ['sns-topic-fanout-policy', 'sqs-queue-visibility-receipt', 'fifo-deduplication-group'],
    usedConceptIds: ['pubsub-fanout-subscription', 'queue-work-competing-consumers', 'delivery-at-least-once-idempotency', 'runtime-secret-boundary'],
    concepts: [['SNS topic', 'Publisher envia ao tópico; subscriptions encaminham para endpoints. SNS não substitui a retenção de uma queue consumida mais tarde.'], ['SQS queue', 'Consumer faz polling, recebe receipt handle, processa e apaga após sucesso. Antes disso a mensagem permanece armazenada e pode reaparecer.'], ['Fan-out e policy', 'Cada SQS subscription recebe cópia. Queue policy deve autorizar somente o tópico esperado; IAM define ações do publisher/consumer.'], ['Standard e FIFO', 'Standard prioriza escala com at-least-once e best-effort ordering. FIFO usa message group/deduplication com limites e não torna o efeito externo exatamente uma vez.']],
    decision: 'Use SNS+SQS quando consumidores independentes precisam de buffer próprio. Não use uma única queue para fan-out nem coloque credenciais estáticas no application.yml.',
    code: ['Consumer AWS SDK v2: apague somente após o efeito', 'var messages = sqs.receiveMessage(r -> r.queueUrl(queueUrl)\n    .waitTimeSeconds(20).maxNumberOfMessages(10)).messages();\nfor (var message : messages) {\n    processIdempotently(message.messageId(), message.body());\n    sqs.deleteMessage(r -> r.queueUrl(queueUrl)\n        .receiptHandle(message.receiptHandle()));\n}'],
    codeExplanation: { explanation: ['receiveMessage faz polling da fila e devolve mensagens temporariamente invisíveis para outros consumidores.', 'deleteMessage usa o receipt handle e deve ocorrer somente depois que o efeito idempotente foi confirmado.'], commonMistakes: ['Apagar antes de processar e perder trabalho em crash', 'Usar messageId como única chave de idempotência quando o domínio exige eventId próprio'] },
    prediction: ['Consumer processou e caiu antes de deleteMessage. O que acontece?', 'Após visibility timeout a mensagem pode reaparecer; o efeito precisa ser idempotente/deduplicado.'],
    exercise: ['Fan-out local verificável', 'Crie tópico PedidoCriado e filas estoque/notificação com policies mínimas.', ['Cada fila recebe uma cópia.', 'Falha de notificação não bloqueia estoque.', 'Secrets vêm do ambiente.', 'Teste documenta limite do ambiente local.']],
    quiz: ['Para que serve visibility timeout?', 'Ocultar temporariamente mensagem recebida enquanto o consumidor processa, sem removê-la.', 'Garantir exactly-once.', 'Definir retenção total do tópico SNS.'],
    project: ['Pedidos com SNS + SQS', ['AWS SDK v2', 'Duas filas e DLQs', 'Idempotência', 'Métricas de backlog'], 'independent', ['Executa em ambiente local documentado.', 'Não exige conta paga para testes comuns.', 'Policies seguem menor privilégio.']],
    projectKnowledgeMatrix: [
      { requirement: 'Fan-out durável', conceptIds: ['sns-topic-fanout-policy', 'pubsub-fanout-subscription'], chapterIds: ['messaging-model', 'aws-sns-sqs'], expectedEvidence: 'Duas filas recebem cópias independentes do mesmo evento publicado no tópico.' },
      { requirement: 'Consumo idempotente', conceptIds: ['sqs-queue-visibility-receipt', 'delivery-at-least-once-idempotency'], chapterIds: ['mensageria', 'aws-sns-sqs'], expectedEvidence: 'Crash antes de deleteMessage não duplica efeito no domínio.' },
      { requirement: 'Segurança mínima', conceptIds: ['message-security-iam-policy', 'runtime-secret-boundary'], chapterIds: ['secrets', 'aws-sns-sqs'], expectedEvidence: 'Policies autorizam somente o tópico/fila necessários e credenciais não entram no Git.' }
    ],
    resources: [['official-docs', 'AWS SNS + SQS fan-out', 'https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html', 'Push do tópico, polling e persistência por fila.'], ['official-docs', 'Amazon SQS guide', 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html', 'Modelo, segurança e entrega.'], ['video', 'Souza: SNS e SQS', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg', 'Trechos 18:22-28:50: SNS/SQS, DLQ e redrive.']],
    auditedResources: [{ id: 'aws-sns-sqs-fanout-structured-phase16', type: 'official-docs', title: 'Fanout to Amazon SQS queues', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html', reinforces: 'Tópico SNS com filas SQS assinantes para fan-out durável.', language: 'en', publisher: 'AWS', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'aws-sqs-developer-guide-phase16', type: 'official-docs', title: 'Amazon SQS Developer Guide', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html', reinforces: 'Modelo SQS, filas, polling, segurança e entrega.', language: 'en', publisher: 'AWS', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Capítulo transforma SNS/SQS em laboratório aplicado depois do modelo conceitual.'] }
  },
  {
    id: 'delivery-failure-lab', moduleId: 'messaging-eda', title: 'Falhas em EDA: retry, DLQ, redrive e visibility timeout',
    summary: 'Projete a recuperação antes do caminho feliz.', why: 'At-least-once transforma duplicação, poison messages e crashes em comportamento normal. Confiabilidade nasce da política de falha, não de um try/catch no listener.',
    prerequisites: ['aws-sns-sqs'], englishLevel: 3, curriculumOrder: 4,
    objectives: ['Diferenciar falha transitória, permanente e poison message', 'Dimensionar visibility timeout e retry window', 'Usar DLQ e redrive como operação controlada', 'Provar idempotência sob crash e reentrega'],
    introducedConceptIds: ['dlq-redrive-policy', 'visibility-timeout-retry-window'],
    usedConceptIds: ['sqs-queue-visibility-receipt', 'delivery-at-least-once-idempotency', 'retry-backoff-jitter'],
    concepts: [['Idempotent consumer', 'Event ID identifica a intenção; registrar deduplicação e efeito na mesma transação local impede janela entre “marcar” e “executar”.'], ['Retry e backoff', 'Falha transitória pode voltar à fila com atraso. Falha permanente deve parar cedo; retry sem limite amplifica indisponibilidade.'], ['DLQ e redrive', 'DLQ isola mensagens após maxReceiveCount. Redrive é operação controlada: corrigir causa, selecionar lote, preservar evidência e monitorar nova falha.'], ['Visibility timeout', 'Mensagem recebida fica invisível, não bloqueada para sempre. Timeout curto duplica trabalho; longo atrasa retry. Heartbeat pode estender processamento conhecido.']],
    decision: 'DLQ não é lixeira nem banco de auditoria. Não redrive tudo automaticamente e não configure visibility timeout sem medir duração p95/p99 e crash behavior.',
    prediction: ['Visibility timeout é 30s e processamento leva 60s. Mesmo sem crash há risco?', 'Sim. A mensagem pode reaparecer e outro consumidor executar em paralelo; estenda timeout/heartbeat e mantenha idempotência.'],
    exercise: ['Poison message', 'Injete payload incompatível, falha transitória e crash após efeito.', ['Cada falha segue caminho diferente.', 'Receive count e backlog geram métricas.', 'Redrive possui runbook e limite.']],
    quiz: ['Quando apagar a mensagem SQS?', 'Depois que o efeito idempotente foi confirmado conforme o contrato.', 'Imediatamente ao receber.', 'Somente quando a fila ficar vazia.'],
    resources: [['official-docs', 'SQS visibility timeout', 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html', 'Reentrega, extensão e mensagens in-flight.'], ['official-docs', 'SNS dead-letter queues', 'https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html', 'Falha de entrega, policy e redrive.']],
    auditedResources: [{ id: 'aws-sqs-visibility-timeout-phase16', type: 'official-docs', title: 'Amazon SQS visibility timeout', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html', reinforces: 'In-flight messages, reentrega, extensão e efeitos de timeout.', language: 'en', publisher: 'AWS', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'aws-sqs-dlq-redrive-phase16', type: 'official-docs', title: 'Amazon SQS dead-letter queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html', reinforces: 'DLQ, maxReceiveCount, redrive e isolamento de mensagens problemáticas.', language: 'en', publisher: 'AWS', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Laboratório troca caminho feliz por política explícita de falha e recuperação.'] }
  },
  {
    id: 'outbox-inbox', moduleId: 'distributed-consistency', title: 'Transactional Outbox e Inbox',
    summary: 'Feche as janelas entre banco e broker.', why: 'Gravar domínio e publicar mensagem são dois efeitos independentes. Sem uma estratégia, crash entre eles produz dado sem evento ou evento sem dado.',
    prerequisites: ['consistencia-distribuida', 'delivery-failure-lab', 'jdbc-under-the-hood'], englishLevel: 3, curriculumOrder: 2,
    objectives: ['Gravar estado e intenção de publicação na mesma transação local', 'Projetar relay recuperável aceitando duplicação', 'Usar inbox/dedup para proteger efeitos do consumidor', 'Definir retenção, limpeza e métricas da outbox/inbox'],
    introducedConceptIds: ['outbox-atomic-publish-intent', 'inbox-dedup-effect-transaction', 'relay-retry-duplication-window'],
    usedConceptIds: ['aggregate-transaction-boundary', 'event-command-message-intent', 'delivery-at-least-once-idempotency', 'eventual-consistency-reconciliation'],
    analogyLimit: 'Uma caixa de saída ajuda, mas aqui a garantia vem da transação local e de recuperação, não de alguém lembrando de enviar depois.',
    concepts: [['Outbox', 'A mesma transação grava estado e registro de evento pendente. Um relay publica, registra tentativa e permite recuperação; não cria transação distribuída.'], ['Relay e duplicação', 'Polling publisher ou CDC pode publicar mais de uma vez quando crash ocorre após publish e antes de marcar. Consumer continua idempotente.'], ['Inbox', 'Consumer registra event ID e efeito na mesma transação local. Unique constraint torna corrida observável e segura.'], ['Retenção e ordenação', 'Outbox/inbox crescem: particionamento, limpeza auditável e chave de ordenação fazem parte da operação.']],
    decision: 'Use Outbox quando estado e evento precisam nascer juntos. Não a use para esconder contrato ruim nem apague registros antes de confirmar publicação e retenção exigida.',
    prediction: ['Relay publicou e caiu antes de marcar sent. A mensagem será duplicada?', 'Pode ser. A recuperação republica o pendente; por isso o consumer deduplica pelo event ID.'],
    exercise: ['Prova de crash', 'Pare o relay em cada janela e demonstre ausência de evento perdido.', ['Estado e outbox compartilham transação.', 'Duplicação é absorvida no inbox.', 'Cleanup não remove pendentes.']],
    quiz: ['Qual problema Outbox resolve?', 'Atomicidade local entre mudança de domínio e intenção durável de publicar.', 'Exactly-once global entre todos os serviços.', 'Ordenação total entre todos os aggregates.'],
    project: ['Pedidos com Outbox/Inbox', ['PostgreSQL', 'Relay recuperável', 'Unique event ID', 'Métricas de idade/backlog'], 'independent', ['Kill tests cobrem janelas.', 'Publicação duplicada não duplica efeito.', 'Schema do evento é versionado.']],
    projectKnowledgeMatrix: [
      { requirement: 'Atomicidade local', conceptIds: ['outbox-atomic-publish-intent', 'aggregate-transaction-boundary'], chapterIds: ['jdbc-under-the-hood', 'outbox-inbox'], expectedEvidence: 'Pedido e registro de outbox nascem ou falham juntos na mesma transação local.' },
      { requirement: 'Relay recuperável', conceptIds: ['relay-retry-duplication-window', 'broker-backlog-backpressure'], chapterIds: ['messaging-model', 'outbox-inbox'], expectedEvidence: 'Kill test prova que queda após publish não perde evento e pode republicar com segurança.' },
      { requirement: 'Consumer idempotente', conceptIds: ['inbox-dedup-effect-transaction', 'delivery-at-least-once-idempotency'], chapterIds: ['delivery-failure-lab', 'outbox-inbox'], expectedEvidence: 'Unique event ID impede efeito duplicado sob redelivery.' }
    ],
    resources: [['reference', 'Transactional Outbox pattern', 'https://microservices.io/patterns/data/transactional-outbox.html', 'Problema e forças do padrão.'], ['official-docs', 'PostgreSQL transaction isolation', 'https://www.postgresql.org/docs/current/transaction-iso.html', 'Garantias da transação local.']],
    auditedResources: [{ id: 'microservices-outbox-phase17', type: 'reference', title: 'Transactional Outbox pattern', url: 'https://microservices.io/patterns/data/transactional-outbox.html', reinforces: 'Problema, forças e solução para publicar mensagens após transação local.', language: 'en', publisher: 'microservices.io', official: false, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'postgres-transaction-isolation-outbox-phase17', type: 'official-docs', title: 'PostgreSQL transaction isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html', reinforces: 'Garantias e limites da transação local que sustenta outbox/inbox.', language: 'en', publisher: 'PostgreSQL', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Capítulo fecha a janela banco/broker sem vender exactly-once global.'] }
  },
  {
    id: 'saga-schema-ordering', moduleId: 'distributed-consistency', title: 'Saga, evolução de eventos e ordering',
    summary: 'Coordene estados distribuídos sem rollback mágico.', why: 'Depois que cada serviço confirma sua própria transação, falha posterior exige decisão de negócio: compensar, aguardar, reconciliar ou aceitar estado parcial observável.',
    prerequisites: ['outbox-inbox', 'ddd-estrategico'], englishLevel: 3, curriculumOrder: 3,
    objectives: ['Escolher Saga por coreografia ou orquestração', 'Modelar compensação como ação de domínio', 'Versionar eventos sem quebrar consumidores', 'Limitar ordering ao aggregate/fluxo que realmente exige ordem'],
    introducedConceptIds: ['saga-choreography-orchestration', 'compensating-action-domain-state', 'event-schema-ordering-evolution'],
    usedConceptIds: ['outbox-atomic-publish-intent', 'eventual-consistency-reconciliation', 'kafka-schema-evolution-contract', 'partition-key-ordering-contract'],
    analogyLimit: 'Uma Saga lembra uma coreografia de passos, mas cada passo persiste estado, pode falhar e pode precisar de compensação própria.',
    concepts: [['Saga choreography', 'Serviços reagem a eventos sem coordenador central. Reduz centralização, mas fluxo e ciclos ficam difíceis de enxergar.'], ['Saga orchestration', 'Orchestrator envia comandos e registra estado. Torna sequência explícita, mas pode concentrar processo demais.'], ['Compensação', 'É nova ação de negócio, não rollback físico. Pode falhar, ser parcial ou impossível; estados precisam refletir isso.'], ['Schema e ordering', 'Eventos carregam type/version/eventId/occurredAt/aggregateId. Evolução aditiva, upcasters e compatibilidade são testados. Ordene por aggregate quando necessário, não globalmente por conveniência.']],
    decision: 'Escolha choreography para fluxos pequenos e estáveis; orchestration para processos longos que exigem visibilidade/controle. Não force compensação que contradiz o domínio, como “desenviar” e-mail.',
    prediction: ['Evento v2 remove campo que consumidor v1 exige. Retry resolve?', 'Não. É incompatibilidade permanente; precisa contrato compatível, transformação/upcaster ou migração coordenada.'],
    exercise: ['Máquina de estados da Saga', 'Modele reserva, pagamento, estoque e entrega com timeout e compensações.', ['Todo estado terminal/intermediário é explícito.', 'Comandos e eventos não se confundem.', 'Falha de compensação possui reconciliação.']],
    quiz: ['O que é compensação?', 'Nova operação de domínio que tenta neutralizar efeito anterior conforme regras atuais.', 'Rollback ACID entre serviços.', 'Apagar o evento do broker.'],
    project: ['Saga de pedidos', ['Escolher choreography ou orchestration e justificar', 'Persistir estado', 'Timeout/reconciliação', 'Schema compatível'], 'independent', ['Diagrama deriva do comportamento implementado.', 'Falhas e duplicações são testadas.', 'Ordering é limitado por aggregate.']],
    projectKnowledgeMatrix: [
      { requirement: 'Coordenação explícita', conceptIds: ['saga-choreography-orchestration', 'bounded-context-context-map'], chapterIds: ['ddd-estrategico', 'saga-schema-ordering'], expectedEvidence: 'Decisão por coreografia/orquestração é justificada pelo fluxo e pelo ownership.' },
      { requirement: 'Compensação correta', conceptIds: ['compensating-action-domain-state', 'eventual-consistency-reconciliation'], chapterIds: ['consistencia-distribuida', 'saga-schema-ordering'], expectedEvidence: 'Estados intermediários, compensações e falha de compensação aparecem no modelo e nos testes.' },
      { requirement: 'Evento evolutivo e ordenado', conceptIds: ['event-schema-ordering-evolution', 'partition-key-ordering-contract'], chapterIds: ['kafka-confiavel', 'event-driven-profundo'], expectedEvidence: 'Eventos carregam versionamento e ordering limitado ao aggregate/fluxo necessário.' }
    ],
    resources: [['reference', 'Saga pattern', 'https://microservices.io/patterns/data/saga.html', 'Choreography, orchestration e compensação.'], ['official-docs', 'Kafka ordering/design', 'https://kafka.apache.org/40/documentation.html#design', 'Partições, keys e consumidores.']],
    auditedResources: [{ id: 'microservices-saga-phase17', type: 'reference', title: 'Saga pattern', url: 'https://microservices.io/patterns/data/saga.html', reinforces: 'Coordenação de transações locais por coreografia/orquestração e compensação.', language: 'en', publisher: 'microservices.io', official: false, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'kafka-design-ordering-phase17', type: 'official-docs', title: 'Apache Kafka: Design', url: 'https://kafka.apache.org/40/documentation.html#design', reinforces: 'Partições, logs, keys, consumers e consequências de ordering.', language: 'en', publisher: 'Apache Kafka', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Capítulo ensina consistência distribuída como processo de negócio observável.'] }
  },
  {
    id: 'eda-observability-security', moduleId: 'messaging-eda', title: 'Observabilidade e segurança em EDA',
    summary: 'Opere fluxos assíncronos com contexto, métricas e menor privilégio.', why: 'Sem uma request aguardando, o caminho de um evento atravessa tempo e processos. Logs isolados não dizem onde ele parou nem se backlog representa crescimento normal ou incidente.',
    prerequisites: ['delivery-failure-lab', 'observabilidade-pratica'], englishLevel: 3, curriculumOrder: 5,
    objectives: ['Propagar eventId, correlationId e causationId sem misturar papéis', 'Definir métricas acionáveis de backlog, idade, retry e DLQ', 'Criar traces assíncronos sem fingir chamada síncrona contínua', 'Aplicar menor privilégio e proteção de payload'],
    introducedConceptIds: ['eda-correlation-causality', 'async-trace-boundary', 'message-security-iam-policy'],
    usedConceptIds: ['structured-log-correlation-id', 'metrics-cardinality-labels', 'trace-span-boundary', 'runtime-secret-boundary'],
    concepts: [['Correlação e causalidade', 'eventId identifica mensagem; correlationId liga fluxo; causationId aponta a mensagem que originou outra. Não reutilize todos como uma única string sem semântica.'], ['Métricas', 'Lag/backlog, idade da mensagem mais antiga, taxa, erro, retry, DLQ e duração do handler medem saúde; contagem bruta sem capacidade não basta.'], ['Tracing assíncrono', 'Propague contexto no envelope e crie spans producer/consumer sem fingir uma única chamada síncrona.'], ['Segurança', 'IAM mínimo por topic/queue, criptografia em trânsito/repouso, policies restritas, payload sem segredo e validação de schema/origem.']],
    decision: 'Não registre payload integral por padrão: pode conter PII/secrets e aumentar custo. Use identificadores, campos permitidos e amostragem consciente.',
    prediction: ['Backlog é 10 mil. Isso prova incidente?', 'Não sozinho. Compare taxa de chegada/consumo, idade, capacidade e SLO; backlog pode ser esperado em lote.'],
    exercise: ['Painel operacional', 'Defina sinais e alertas para publisher, broker, consumer, retry e DLQ.', ['Alertas apontam impacto e ação.', 'Correlação atravessa eventos derivados.', 'PII não entra em logs.']],
    quiz: ['Qual métrica detecta mensagem antiga presa mesmo com throughput alto?', 'Idade da mensagem mais antiga.', 'Número de classes Java.', 'Somente CPU do producer.'],
    resources: [['official-docs', 'OpenTelemetry messaging semantic conventions', 'https://opentelemetry.io/docs/specs/semconv/messaging/', 'Spans, atributos e contexto em messaging.'], ['official-docs', 'AWS SNS security', 'https://docs.aws.amazon.com/sns/latest/dg/sns-security.html', 'IAM, proteção de dados e policies.']],
    auditedResources: [{ id: 'opentelemetry-messaging-semconv-phase16', type: 'official-docs', title: 'OpenTelemetry messaging semantic conventions', url: 'https://opentelemetry.io/docs/specs/semconv/messaging/', reinforces: 'Atributos e spans para sistemas de messaging e consumidores assíncronos.', language: 'en', publisher: 'OpenTelemetry', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'aws-sns-security-phase16', type: 'official-docs', title: 'Security in Amazon SNS', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-security.html', reinforces: 'IAM, proteção de dados, controle de acesso e segurança de tópicos SNS.', language: 'en', publisher: 'AWS', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Capítulo amarra EDA a sinais operacionais e segurança antes de testes finais.'] }
  },
  {
    id: 'async-integration-tests', moduleId: 'messaging-eda', title: 'Testcontainers e testes assíncronos determinísticos',
    summary: 'Teste banco, Kafka e AWS local sem sleeps arbitrários.', why: 'Mock não reproduz SQL, broker, serialização ou offsets. Teste de integração precisa de dependências reais descartáveis e uma condição observável, não Thread.sleep torcendo para terminar.',
    prerequisites: ['testcontainers', 'aws-sns-sqs', 'delivery-failure-lab'], englishLevel: 3, curriculumOrder: 6,
    objectives: ['Usar Testcontainers para dependências reais descartáveis', 'Documentar limites de LocalStack/emulação local', 'Substituir sleep fixo por assertiva eventual com deadline', 'Separar testes unitários, integração e contrato pelo risco que provam'],
    introducedConceptIds: ['localstack-container-boundary', 'async-awaitility-eventual-assertion'],
    usedConceptIds: ['testcontainers-disposable-dependency', 'sqs-queue-visibility-receipt', 'visibility-timeout-retry-window', 'deterministic-integration-test'],
    concepts: [['Testcontainers', 'Container descartável fornece dependência real em estado conhecido. Fixe imagem compatível, espere readiness e compartilhe ciclo conforme isolamento exigido.'], ['Kafka container', 'A API atual usa org.testcontainers.kafka.KafkaContainer ou ConfluentKafkaContainer; a classe antiga em org.testcontainers.containers está depreciada.'], ['LocalStack', 'Permite testar APIs AWS localmente, mas comportamento não é identidade perfeita com AWS. A documentação atual exige auth token a partir de 23/03/2026; registre essa limitação e ofereça alternativa/mocks para testes comuns.'], ['Awaitility', 'Espera uma condição até deadline e produz diagnóstico. Não cria sincronização/thread safety e não substitui assertiva de efeito observável.']],
    decision: 'Use unit tests para regras puras e integração para fronteiras reais. Não transforme toda a suíte em containers nem use sleep fixo; espere estado com limite e diagnóstico.',
    code: ['Condição assíncrona, não atraso arbitrário', 'publish(orderCreated);\nawait().atMost(Duration.ofSeconds(10))\n    .pollInterval(Duration.ofMillis(100))\n    .untilAsserted(() ->\n        assertThat(repository.findById(id)).hasValueSatisfying(Order::isReserved));'],
    codeExplanation: { explanation: ['publish cria o estímulo assíncrono; Awaitility repete a assertiva até o estado esperado aparecer ou o deadline falhar.', 'O teste observa o efeito persistido, não apenas a ausência de exceção no envio.'], commonMistakes: ['Trocar sleep(5000) por sleep(10000) e chamar de determinismo', 'Esperar condição sem timeout nem mensagem diagnóstica'] },
    prediction: ['Trocar sleep(5000) por sleep(10000) torna teste determinístico?', 'Não. Continua dependente de timing e fica mais lento; espere a condição com deadline e falha diagnóstica.'],
    exercise: ['Matriz de testes EDA', 'Separe unit, database container, Kafka container, LocalStack/contract e end-to-end.', ['Cada camada tem falha que só ela detecta.', 'Async usa condição observável.', 'Imagens/dependências são atuais e fixadas.']],
    quiz: ['O que Awaitility não faz?', 'Garantir thread safety do código testado.', 'Repetir uma condição até deadline.', 'Falhar quando a condição não ocorre.'],
    project: ['Suíte de confiabilidade EDA', ['PostgreSQL e Kafka Testcontainers 2.0.5', 'Awaitility 4.3.1', 'Crash/duplicação/schema inválido', 'Relatório de evidência'], 'independent', ['Sem sleeps fixos.', 'Falha mostra causa útil.', 'Suite roda isolada e limpa recursos.']],
    projectKnowledgeMatrix: [
      { requirement: 'Dependência real descartável', conceptIds: ['testcontainers-disposable-dependency', 'localstack-container-boundary'], chapterIds: ['testcontainers', 'async-integration-tests'], expectedEvidence: 'Suite sobe container, espera readiness e documenta diferença entre emulador/local e cloud real.' },
      { requirement: 'Assertiva assíncrona determinística', conceptIds: ['async-awaitility-eventual-assertion', 'visibility-timeout-retry-window'], chapterIds: ['delivery-failure-lab', 'async-integration-tests'], expectedEvidence: 'Não há sleep fixo; a falha mostra qual estado esperado não apareceu até o deadline.' },
      { requirement: 'Risco por camada', conceptIds: ['deterministic-integration-test', 'sqs-queue-visibility-receipt'], chapterIds: ['estrategia-testes', 'aws-sns-sqs'], expectedEvidence: 'Matriz separa regra pura, adapter, broker/cloud local e fluxo end-to-end.' }
    ],
    resources: [['official-docs', 'Testcontainers Kafka module', 'https://java.testcontainers.org/modules/kafka/', 'Containers Kafka atuais e classe depreciada.'], ['official-docs', 'Testcontainers LocalStack module', 'https://java.testcontainers.org/modules/localstack/', 'Integração AWS local e requisito atual de autenticação.'], ['official-docs', 'Awaitility usage', 'https://github.com/awaitility/awaitility/wiki/Usage', 'Polling, deadline, fail-fast e limitações.']],
    auditedResources: [{ id: 'testcontainers-kafka-structured-phase16', type: 'official-docs', title: 'Testcontainers Kafka Module', url: 'https://java.testcontainers.org/modules/kafka/', reinforces: 'Kafka container atual, configuração e classes recomendadas.', language: 'en', publisher: 'Testcontainers', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'testcontainers-localstack-structured-phase16', type: 'official-docs', title: 'Testcontainers LocalStack Module', url: 'https://java.testcontainers.org/modules/localstack/', reinforces: 'Serviços AWS locais para testes com limites documentados.', language: 'en', publisher: 'Testcontainers', official: true, expectedLevel: 'advanced', verifiedAt: '2026-08-22', auditStatus: 'approved' }, { id: 'awaitility-usage-phase16', type: 'reference', title: 'Awaitility usage', url: 'https://github.com/awaitility/awaitility/wiki/Usage', reinforces: 'Polling, deadline, untilAsserted e padrões para testes assíncronos.', language: 'en', publisher: 'Awaitility', official: true, expectedLevel: 'intermediate', verifiedAt: '2026-08-22', auditStatus: 'approved' }],
    audit: { status: 'approved', sourceKind: 'structured-typescript', reviewedAt: '2026-08-22', notes: ['Fecha a fase com validação determinística de fluxos assíncronos.'] }
  }
];

export const requiredChapters = inputs.map(makeChapter);
