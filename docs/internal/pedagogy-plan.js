'use strict';

const modules = [
  { id: 'orientation', title: 'Orientacao e ambiente', prerequisites: [], englishLevel: 0, projectGuidance: 'supported' },
  { id: 'programming-fundamentals', title: 'Fundamentos de programacao', prerequisites: ['orientation'], englishLevel: 0, projectGuidance: 'supported' },
  { id: 'oop-modeling', title: 'POO, modelagem e associacoes', prerequisites: ['programming-fundamentals'], englishLevel: 0, projectGuidance: 'supported' },
  { id: 'java-core', title: 'Java essencial e programacao funcional', prerequisites: ['oop-modeling'], englishLevel: 1, projectGuidance: 'guided' },
  { id: 'io-cli-serialization', title: 'I/O, serializacao e aplicacoes CLI', prerequisites: ['java-core'], englishLevel: 1, projectGuidance: 'guided' },
  { id: 'algorithms-data-structures', title: 'Algoritmos e estruturas de dados', prerequisites: ['java-core'], englishLevel: 1, projectGuidance: 'guided' },
  { id: 'testing-engineering', title: 'Build, Git, debugging e testes fundamentais', prerequisites: ['java-core'], englishLevel: 1, projectGuidance: 'guided' },
  { id: 'http-api-clients', title: 'HTTP, JSON e consumo de APIs com Java', prerequisites: ['io-cli-serialization', 'testing-engineering'], englishLevel: 1, projectGuidance: 'guided' },
  { id: 'relational-data-jdbc', title: 'SQL, PostgreSQL, JDBC e transacoes', prerequisites: ['io-cli-serialization', 'testing-engineering'], englishLevel: 1, projectGuidance: 'guided' },
  { id: 'application-design', title: 'Design de aplicacao antes de frameworks', prerequisites: ['oop-modeling', 'testing-engineering'], englishLevel: 1, projectGuidance: 'bounded' },
  { id: 'spring-api', title: 'Spring e primeira API completa', prerequisites: ['http-api-clients', 'relational-data-jdbc', 'application-design'], englishLevel: 2, projectGuidance: 'bounded' },
  { id: 'api-security-quality', title: 'Contratos, seguranca e qualidade de APIs', prerequisites: ['spring-api'], englishLevel: 2, projectGuidance: 'bounded' },
  { id: 'containers-integration-data', title: 'Containers, testes de integracao e dados avancados', prerequisites: ['spring-api', 'testing-engineering'], englishLevel: 2, projectGuidance: 'bounded' },
  { id: 'concurrency-network-tui', title: 'Concorrencia, redes e interfaces de terminal', prerequisites: ['io-cli-serialization', 'testing-engineering'], englishLevel: 2, projectGuidance: 'bounded' },
  { id: 'production-delivery', title: 'Producao, CI/CD e operacao', prerequisites: ['api-security-quality', 'containers-integration-data'], englishLevel: 2, projectGuidance: 'bounded' },
  { id: 'synchronous-integration', title: 'Integracao sincrona entre servicos', prerequisites: ['api-security-quality', 'concurrency-network-tui'], englishLevel: 2, projectGuidance: 'independent' },
  { id: 'resilience-observability', title: 'Falhas, resiliencia e observabilidade', prerequisites: ['synchronous-integration', 'production-delivery'], englishLevel: 3, projectGuidance: 'independent' },
  { id: 'messaging-eda', title: 'Mensageria e arquitetura orientada a eventos', prerequisites: ['synchronous-integration', 'relational-data-jdbc', 'containers-integration-data', 'concurrency-network-tui'], englishLevel: 3, projectGuidance: 'independent' },
  { id: 'distributed-consistency', title: 'Consistencia e sistemas distribuidos', prerequisites: ['messaging-eda', 'resilience-observability'], englishLevel: 3, projectGuidance: 'independent' },
  { id: 'professional-final', title: 'Trabalho em equipe e projeto integrador', prerequisites: ['distributed-consistency', 'production-delivery'], englishLevel: 3, projectGuidance: 'independent' }
];

const legacyPhaseMappings = {
  start: 'orientation',
  fundamentals: 'programming-fundamentals',
  oop: 'oop-modeling',
  core: 'java-core',
  algorithms: 'algorithms-data-structures',
  'engineering-foundation': 'application-design',
  'web-data': 'relational-data-jdbc',
  spring: 'spring-api',
  testing: 'testing-engineering',
  security: 'api-security-quality',
  containers: 'containers-integration-data',
  'integration-testing': 'containers-integration-data',
  'advanced-data': 'containers-integration-data',
  'spring-advanced': 'resilience-observability',
  production: 'production-delivery',
  messaging: 'messaging-eda',
  architecture: 'distributed-consistency',
  'advanced-algorithms': 'algorithms-data-structures',
  team: 'professional-final',
  integration: 'api-security-quality',
  finish: 'professional-final'
};

const chapterOverrides = {
  'java-io': 'io-cli-serialization',
  'mini-analisador-vendas': 'io-cli-serialization',
  git: 'testing-engineering',
  build: 'testing-engineering',
  logging: 'testing-engineering',
  json: 'io-cli-serialization',
  'mini-importador-pedidos': 'io-cli-serialization',
  http: 'http-api-clients',
  threads: 'concurrency-network-tui',
  'concorrencia-profunda': 'concurrency-network-tui',
  debugging: 'testing-engineering',
  'jvm-profundo': 'java-core',
  'pilares-profundo': 'oop-modeling',
  'di-ioc-profundo': 'application-design',
  'arquitetura-software': 'application-design',
  ddd: 'application-design',
  'ddd-estrategico': 'synchronous-integration',
  webclient: 'synchronous-integration',
  resilience: 'resilience-observability',
  actuator: 'resilience-observability',
  'observabilidade-pratica': 'resilience-observability',
  'conectando-front-back': 'synchronous-integration',
  'auth-front-ts': 'api-security-quality',
  'frontend-aplicacao': 'api-security-quality',
  websockets: 'concurrency-network-tui',
  'deploy-frontend': 'production-delivery',
  mensageria: 'messaging-eda',
  kafka: 'messaging-eda',
  'spring-kafka': 'messaging-eda',
  'kafka-confiavel': 'messaging-eda',
  'event-driven-profundo': 'messaging-eda',
  'testes-integracao-avancados': 'messaging-eda',
  'sistemas-distribuidos': 'distributed-consistency',
  'consistencia-distribuida': 'distributed-consistency',
  'mini-pedidos-eventos': 'distributed-consistency'
};

const splitRequirements = {
  'javamoderno': ['Optional', 'var', 'Date/Time must become separately assessable concepts'],
  'java-21-profundo': ['records/sealed/pattern matching stay in Java core', 'virtual threads move after concurrency foundations'],
  http: ['HTTP protocol fundamentals', 'Java HttpClient', 'JSON mapping', 'defensive API consumption', 'curl and debugging', 'REST design'],
  'spring-jpa': ['object associations and cardinality must already exist in OOP', 'JPA ownership/fetch/cascade remain here'],
  resilience: ['move after synchronous dependency failures, timeout, retry and coupling are experienced'],
  mensageria: ['queue, pub/sub, broker, delivery and backpressure before a product-specific broker'],
  'event-driven-profundo': ['synchronous baseline', 'in-memory event bus', 'EDA trade-offs', 'failure semantics', 'schema and observability'],
  'testes-integracao-avancados': ['database containers', 'Kafka containers', 'deterministic async waiting', 'failure scenarios'],
  'projeto-integrador': ['requirements and architecture support must be reduced to the independent level']
};

const requiredAncestry = {
  'spring-api': ['http-api-clients', 'relational-data-jdbc', 'application-design'],
  'containers-integration-data': ['testing-engineering'],
  'concurrency-network-tui': ['io-cli-serialization'],
  'synchronous-integration': ['http-api-clients'],
  'resilience-observability': ['synchronous-integration'],
  'messaging-eda': ['synchronous-integration', 'concurrency-network-tui', 'relational-data-jdbc'],
  'distributed-consistency': ['messaging-eda', 'resilience-observability']
};

module.exports = {
  modules,
  legacyPhaseMappings,
  chapterOverrides,
  splitRequirements,
  requiredAncestry
};
