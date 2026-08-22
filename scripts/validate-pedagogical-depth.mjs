import { readFile } from 'node:fs/promises';

const report = JSON.parse(await readFile('docs/internal/master-audit/phase-0-inventory.json', 'utf8'));
const schema = await readFile('platform/src/content/schema.ts', 'utf8');
const renderer = await readFile('platform/src/components/course/ContentBlockView.tsx', 'utf8');
const overrides = JSON.parse(await readFile('platform/content/pedagogy-overrides.json', 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const semanticTypes = ['mental-model', 'comparison', 'error-case', 'diagram', 'table'];
for (const type of semanticTypes) {
  assert(schema.includes(`type: '${type}'`), `Schema sem bloco pedagógico: ${type}.`);
  assert(renderer.includes(`case '${type}'`), `Renderizador sem bloco pedagógico: ${type}.`);
}

for (const marker of ['introducedConceptIds', 'usedConceptIds', 'PedagogicalAudit', 'knowledgeMatrix', 'explanation?: string[]']) {
  assert(schema.includes(marker), `Contrato pedagógico ausente do schema: ${marker}.`);
}

assert(overrides.version === 1 && overrides.chapters && typeof overrides.chapters === 'object', 'Registro autoral de pedagogia inválido.');
assert(report.summary.chapters === 151, 'A auditoria de profundidade não cobre os 151 capítulos atuais.');
assert(report.summary.missingChapterPrerequisites === 0, 'Há referências para capítulos inexistentes.');

const invalidApprovals = report.chapters.filter(chapter => (
  chapter.declaredAuditStatus === 'approved'
  && (chapter.flags.length || !chapter.dependenciesValidated || !chapter.resourcesAuditedForRelevance)
));
assert(invalidApprovals.length === 0, `Capítulos aprovados sem cumprir o contrato: ${invalidApprovals.map(chapter => chapter.chapterId).join(', ')}.`);
assert(report.conceptGraphIssues?.length === 0, `Grafo de conceitos inválido: ${report.conceptGraphIssues?.join('; ')}.`);

const phase2Ids = ['intro', 'primeiro-programa', 'variaveis-tipos', 'operadores-expressoes', 'controle-fluxo', 'lacos-repeticao', 'arrays-matrizes', 'strings-wrapper', 'metodos-escopo', 'entrada-console', 'logica-programacao', 'mini-caixa-eletronico'];
const phase2Incomplete = phase2Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase2Incomplete.length === 0, `Fase 2 incompleta: ${phase2Incomplete.join(', ')}.`);

const phase3Ids = ['classes', 'atributos', 'construtores', 'encapsulamento', 'static', 'heranca', 'polimorfismo', 'abstracao', 'interfaces', 'pilares-profundo', 'associacoes-cardinalidade', 'mini-biblioteca-cli'];
const phase3Incomplete = phase3Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase3Incomplete.length === 0, `Fase 3 incompleta: ${phase3Incomplete.join(', ')}.`);

const phase4Ids = ['pacotes', 'excecoes', 'colecoes', 'generics', 'streams', 'javamoderno', 'functional-semantics-lab', 'jvm-profundo', 'java-21-profundo'];
const phase4Incomplete = phase4Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase4Incomplete.length === 0, `Fase 4 incompleta: ${phase4Incomplete.join(', ')}.`);

const phase5Ids = ['java-io', 'mini-analisador-vendas', 'json', 'process-api-cli', 'mini-importador-pedidos', 'zenith-cli-inicial'];
const phase5Incomplete = phase5Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase5Incomplete.length === 0, `Fase 5 incompleta: ${phase5Incomplete.join(', ')}.`);

const phase6Ids = ['big-o', 'recursao', 'ordenacao-busca', 'algoritmos-praticos', 'git', 'build', 'debugging', 'logging', 'testes'];
const phase6Incomplete = phase6Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase6Incomplete.length === 0, `Fase 6 incompleta: ${phase6Incomplete.join(', ')}.`);

const phase7Ids = ['http', 'http-wire-contract', 'java-httpclient-json', 'unreliable-api-client', 'pure-java-api-project'];
const phase7Incomplete = phase7Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase7Incomplete.length === 0, `Fase 7 incompleta: ${phase7Incomplete.join(', ')}.`);

const phase8Ids = ['sql', 'postgres', 'postgres-concorrencia', 'migrations', 'jdbc', 'mini-financas-jdbc', 'jdbc-under-the-hood'];
const phase8Incomplete = phase8Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase8Incomplete.length === 0, `Fase 8 incompleta: ${phase8Incomplete.join(', ')}.`);

const phase9Ids = ['anotacoes', 'solid', 'di', 'padroes', 'clean-code', 'projetospring', 'di-ioc-profundo', 'arquitetura-software', 'ddd'];
const phase9Incomplete = phase9Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase9Incomplete.length === 0, `Fase 9 incompleta: ${phase9Incomplete.join(', ')}.`);

const phase10Ids = ['spring-core', 'spring-boot-fundamentos', 'devtools', 'lombok', 'spring-mvc', 'spring-jpa', 'jpa-transacoes', 'dto-mapping', 'validacao-erros', 'paginacao-swagger', 'api-design-avancado', 'n-mais-1', 'cors-rate-limit', 'mini-helpdesk-api', 'rest-resource-contracts'];
const phase10Incomplete = phase10Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase10Incomplete.length === 0, `Fase 10 incompleta: ${phase10Incomplete.join(', ')}.`);

const phase11Ids = ['autenticacao-conceitos', 'spring-security', 'security-oidc', 'https', 'mini-auth-rbac', 'auth-front-ts', 'frontend-aplicacao', 'api-contract-evolution'];
const phase11Incomplete = phase11Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase11Incomplete.length === 0, `Fase 11 incompleta: ${phase11Incomplete.join(', ')}.`);

const phase12Ids = ['mockito', 'docker-conceitos', 'dockerfile', 'compose', 'testcontainers', 'estrategia-testes', 'nosql', 'mongodb', 'redis', 'nosql-operacional', 'hospedagem-db'];
const phase12Incomplete = phase12Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase12Incomplete.length === 0, `Fase 12 incompleta: ${phase12Incomplete.join(', ')}.`);

const phase13Ids = ['threads', 'concorrencia-profunda', 'websockets', 'tcp-protocol-design', 'lanterna-tui', 'developer-tools-java'];
const phase13Incomplete = phase13Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase13Incomplete.length === 0, `Fase 13 incompleta: ${phase13Incomplete.join(', ')}.`);

const phase14Ids = ['secrets', 'cicd', 'praticas-producao', 'hardening-producao', 'deploy-backend', 'spring-profiles', 'mini-deploy-observavel', 'deploy-frontend'];
const phase14Incomplete = phase14Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase14Incomplete.length === 0, `Fase 14 incompleta: ${phase14Incomplete.join(', ')}.`);

const phase15Ids = ['webclient', 'ddd-estrategico', 'conectando-front-back', 'coupled-services-lab', 'resilience', 'spring-aop', 'spring-cache', 'actuator', 'observabilidade-pratica'];
const phase15Incomplete = phase15Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase15Incomplete.length === 0, `Fase 15 incompleta: ${phase15Incomplete.join(', ')}.`);

const phase16Ids = ['mensageria', 'in-memory-event-bus', 'messaging-model', 'aws-sns-sqs', 'delivery-failure-lab', 'eda-observability-security', 'async-integration-tests', 'kafka', 'spring-kafka', 'kafka-confiavel', 'event-driven-profundo', 'testes-integracao-avancados'];
const phase16Incomplete = phase16Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase16Incomplete.length === 0, `Fase 16 incompleta: ${phase16Incomplete.join(', ')}.`);

const phase17Ids = ['sistemas-distribuidos', 'consistencia-distribuida', 'outbox-inbox', 'saga-schema-ordering', 'mini-pedidos-eventos'];
const phase17Incomplete = phase17Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase17Incomplete.length === 0, `Fase 17 incompleta: ${phase17Incomplete.join(', ')}.`);

const phase18Ids = ['estruturas-avancadas', 'mini-reservas-testadas', 'projeto'];
const phase18Incomplete = phase18Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase18Incomplete.length === 0, `Fase 18 incompleta: ${phase18Incomplete.join(', ')}.`);

const phase19Ids = ['code-review-adr', 'agile', 'mapa-sistema', 'projeto-integrador', 'quiz'];
const phase19Incomplete = phase19Ids.filter(id => {
  const chapter = report.chapters.find(item => item.chapterId === id);
  return !chapter || chapter.status !== 'aprovado' || !chapter.resourcesAuditedForRelevance || !chapter.dependenciesValidated;
});
assert(phase19Incomplete.length === 0, `Fase 19 incompleta: ${phase19Incomplete.join(', ')}.`);
assert(report.summary.chaptersApproved === 151, `As fases 2 a 19 devem aprovar exatamente 151 capítulos; encontrados ${report.summary.chaptersApproved}.`);
assert(report.summary.chaptersTriagedAsFailed === 0, `Não deve haver backlog após a Fase 19; encontrados ${report.summary.chaptersTriagedAsFailed}.`);

const approvedProjectsWithoutMatrix = report.chapters.filter(chapter => (
  chapter.declaredAuditStatus === 'approved'
  && chapter.projects > 0
  && chapter.flags.includes('projeto-sem-matriz-de-conhecimento')
));
assert(approvedProjectsWithoutMatrix.length === 0, `Projetos aprovados sem matriz de conhecimentos: ${approvedProjectsWithoutMatrix.map(chapter => chapter.chapterId).join(', ')}.`);

console.log(`Contrato pedagógico validado: ${report.summary.chapters} capítulos rastreados, ${report.summary.chaptersApproved} aprovados e ${report.summary.futureChapterPrerequisites} dependências futuras registradas como backlog explícito.`);
