import { access, readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(path) {
  return readFile(path, 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

function assertMarkers(source, label, markers) {
  for (const marker of markers) {
    assert(source.includes(marker), `${label} não cobre marcador obrigatório da especificação mestre: ${marker}`);
  }
}

const [
  packageJson,
  auditReport,
  dependencyGraph,
  chapterMatrix,
  readme,
  progressDoc,
  contentModel,
  schema,
  requiredChapters,
  e2e,
  depthValidator,
  assessmentValidator,
  resourceValidator,
  catalogValidator,
  finalReleaseValidator,
  traceabilityValidator
] = await Promise.all([
  readJson('package.json'),
  readJson('docs/internal/master-audit/phase-0-inventory.json'),
  readJson('docs/internal/master-audit/dependency-graph.json'),
  readText('docs/internal/master-audit/chapter-audit-matrix.csv'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md'),
  readText('docs/internal/content-model.md'),
  readText('platform/src/content/schema.ts'),
  readText('platform/src/content/required-chapters.ts'),
  readText('tests/e2e/responsive.spec.ts'),
  readText('scripts/validate-pedagogical-depth.mjs'),
  readText('scripts/validate-assessment-integrity.mjs'),
  readText('scripts/validate-resource-integrity.mjs'),
  readText('scripts/validate-catalog-integrity.mjs'),
  readText('scripts/validate-final-release.mjs'),
  readText('scripts/validate-traceability-contract.mjs')
]);

const expectedSummary = {
  chapters: 151,
  legacyChapters: 128,
  structuredChapters: 23,
  modules: 20,
  projects: 23,
  exercises: 160,
  quizzes: 268,
  uniqueResourceUrls: 260,
  concepts: 384,
  chaptersTriagedAsFailed: 0,
  chaptersApproved: 151,
  missingChapterPrerequisites: 0,
  futureChapterPrerequisites: 0
};

for (const [key, expected] of Object.entries(expectedSummary)) {
  assert(auditReport.summary[key] === expected, `Fechamento mestre diverge em ${key}: esperado ${expected}, encontrado ${auditReport.summary[key]}.`);
}
assert(Object.keys(auditReport.summary.flagCounts).length === 0, 'Fechamento mestre não aceita flags pendentes.');
assert(auditReport.conceptGraphIssues.length === 0, 'Fechamento mestre não aceita violações no grafo conceitual.');

const matrixRows = chapterMatrix.trim().split('\n').slice(1);
assert(matrixRows.length === 151, `Matriz de capítulos deve ter 151 linhas; encontrou ${matrixRows.length}.`);
assert(matrixRows.every(row => row.includes(',"approved","true","true","true","aprovado",""')), 'Toda linha da matriz precisa estar aprovada, revisada, com recursos auditados, dependências validadas e sem flags.');
assert(dependencyGraph.modules.length === 20, 'Grafo de dependências deve manter 20 módulos.');
assert(dependencyGraph.chapters.length === 151, 'Grafo de dependências deve manter 151 capítulos.');

const masterCoverageSource = [
  requiredChapters,
  chapterMatrix,
  progressDoc,
  e2e
].join('\n');

for (const file of [
  'phase-0-discovery.md',
  'phase-1-infrastructure.md',
  'phase-2-foundations.md',
  'phase-3-oop.md',
  'phase-4-java-core.md',
  'phase-5-io-cli-process.md',
  'phase-6-algorithms-engineering.md',
  'phase-7-http-integration.md',
  'phase-8-relational-data-jdbc.md',
  'phase-9-application-design.md',
  'phase-10-spring-api.md',
  'phase-11-api-security-quality.md',
  'phase-12-containers-integration-data.md',
  'phase-13-concurrency-network-tui.md',
  'phase-14-production-delivery.md',
  'phase-15-sync-resilience.md',
  'phase-16-messaging-eda.md',
  'phase-17-distributed-consistency.md',
  'phase-18-intermediate-projects.md',
  'phase-19-professional-final.md',
  'phase-20-final-release-hardening.md',
  'phase-21-deployment-readiness.md',
  'phase-22-maintenance-guardrails.md',
  'phase-23-progress-contract.md',
  'phase-24-ui-accessibility-contract.md',
  'phase-25-learning-tools-contract.md',
  'phase-26-catalog-integrity.md',
  'phase-27-assessment-integrity.md',
  'phase-28-resource-integrity.md',
  'phase-29-technical-english-contract.md',
  'phase-30-traceability-contract.md',
  'phase-31-master-spec-closure.md'
]) {
  await access(`docs/internal/master-audit/${file}`);
  assert(progressDoc.includes(file), `Progresso interno deve listar ${file}.`);
  assert(finalReleaseValidator.includes(file), `validate:final-release deve exigir ${file}.`);
  assert(traceabilityValidator.includes(file), `validate:traceability deve exigir ${file}.`);
}

assertMarkers(contentModel, 'Modelo de conteúdo', [
  'Generated JSON files are never edited directly',
  'whyItExists',
  'introducedConceptIds',
  'usedConceptIds',
  'audit.status',
  'intuition',
  'mental-model',
  'comparison',
  'error-case',
  'prediction',
  'Every project must reuse prior knowledge',
  'A resource group states exactly which concept it reinforces',
  'Translation questions and isolated vocabulary lists are invalid',
  'All IDs are unique and every reference resolves',
  'Projects never require chapters or concepts positioned later'
]);

assertMarkers(schema, 'Schema semântico', [
  'IntuitionBlock',
  'ConceptBlock',
  'MentalModelBlock',
  'ComparisonBlock',
  'ErrorCaseBlock',
  'PredictionBlock',
  'QuizBlock',
  'ExerciseBlock',
  'ProjectBlock',
  'Resource',
  'EnglishActivity',
  'knowledgeMatrix'
]);

assertMarkers(masterCoverageSource, 'Cobertura curricular obrigatória', [
  'functional-semantics-lab',
  'Optional, lambdas, Set e Streams por semântica',
  'HashSet',
  'TreeSet',
  'map versus flatMap',
  'parallelStream',
  'process-api-cli',
  'ProcessBuilder',
  'stdout',
  'stderr',
  'exit code',
  'sh -c',
  'allowlist',
  'zenith-cli-inicial',
  'jdbc-under-the-hood',
  'PreparedStatement',
  'autoCommit=false',
  'rollback',
  'java-httpclient-json',
  'HttpClient',
  'REST',
  'spring-core',
  'IoC',
  'spring-mvc',
  'dispatcher',
  'spring-jpa',
  'jpa-transacoes',
  'flush-nao-e-commit',
  'lanterna-tui',
  'Terminal',
  'Screen',
  'GUI2',
  'tcp-protocol-design',
  'socket',
  'framing',
  'messaging-model',
  'queue',
  'pub/sub',
  'Kafka',
  'Outbox',
  'Inbox',
  'Saga',
  'Testcontainers',
  'Awaitility',
  'CAP',
  'PACELC'
]);

assertMarkers(progressDoc, 'Progresso interno', [
  'Current phase: Auditoria Mestre — Fase 31 de Fechamento da Especificação Mestre concluída',
  'A Fase 31 adiciona o gate de fechamento da especificação mestre',
  'Fundamentos, POO, Java Core, I/O/CLI/Process API',
  'HTTP/integração, SQL/JDBC, Design de Aplicação, Spring/API',
  'Mensageria, SNS/SQS, Kafka, EDA, Consistência Distribuída, Outbox/Inbox, Saga',
  '151 capítulos aprovados',
  'zero capítulos em backlog',
  'phase-31-master-spec-closure.md',
  '| Master specification closure | completed | 31 |'
]);

assertMarkers(e2e, 'E2E de trilha pedagógica', [
  'busca da trilha filtra capítulos explicitamente pelo título',
  'I/O, Process API e Zenith inicial ficam contextualizados',
  'HTTP e integração defensiva aparecem antes do Spring',
  'SQL, PostgreSQL e JDBC preservam progressão',
  'Spring/API progride do container até contrato REST',
  'Concorrência, WebSocket, TCP, TUI e ferramentas Java avançam sem salto conceitual',
  'Mensageria e EDA começam rasas e avançam até Kafka confiável',
  'Consistência distribuída progride de CAP/PACELC até outbox, saga',
  'Fechamento profissional progride de review e processo até mapa, projeto final'
]);

assertMarkers(depthValidator, 'Gate de profundidade', [
  'chaptersTriagedAsFailed === 0',
  'futureChapterPrerequisites',
  'introducedConceptIds',
  'usedConceptIds',
  'knowledgeMatrix'
]);
assertMarkers(assessmentValidator, 'Gate de avaliação', [
  'chapter.quizzes > 0',
  'option.correct === true',
  'explanation',
  'acceptanceCriteria',
  'knowledgeMatrix'
]);
assertMarkers(resourceValidator, 'Gate de recursos', [
  "auditStatus === 'approved'",
  'resource.verifiedAt',
  "url.protocol === 'https:'",
  'recurso-generico',
  'recurso-repetido-em-massa'
]);
assertMarkers(catalogValidator, 'Gate de catálogo/offline', [
  'source-inventory.json',
  'htmlSha256',
  'course-content.json',
  'content/catalog.json',
  'serviceWorker.includes'
]);

assert(packageJson.scripts['validate:master-spec'] === 'node scripts/validate-master-spec-closure.mjs', 'Script validate:master-spec ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:master-spec'), 'npm run validate deve executar o fechamento da especificação mestre.');
assert(packageJson.scripts.validate.indexOf('npm run validate:traceability') < packageJson.scripts.validate.indexOf('npm run validate:master-spec'), 'validate:master-spec deve rodar depois da rastreabilidade.');
assert(packageJson.scripts.validate.indexOf('npm run validate:master-spec') < packageJson.scripts.validate.indexOf('npm run validate:maintenance'), 'validate:master-spec deve rodar antes dos guardrails finais de manutenção.');

assert(readme.includes('aprender Java, backend e fundamentos de computação'), 'README público deve explicar o propósito do curso.');
assert(readme.includes('Validação completa') && readme.includes('npm run validate'), 'README público deve documentar a validação completa sem expor gates internos.');

console.log('OK: especificação mestre fechada — 151 capítulos aprovados, 32 relatórios, matriz completa, eixos obrigatórios cobertos e gates sincronizados.');
