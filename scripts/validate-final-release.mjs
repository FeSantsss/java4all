import { access, readFile } from 'node:fs/promises';
import { getCourseCounts } from './lib/course-counts.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(path) {
  return readFile(path, 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const [
  packageJson,
  report,
  generatedCourse,
  publicCourse,
  readme,
  contentModel,
  progressDoc,
  finalPhaseReport
] = await Promise.all([
  readJson('package.json'),
  readJson('docs/internal/master-audit/phase-0-inventory.json'),
  readJson('platform/src/content/generated-course.json'),
  readJson('platform/public/course-content.json'),
  readText('README.md'),
  readText('docs/internal/content-model.md'),
  readText('docs/internal/implementation-progress.md'),
  readText('docs/internal/master-audit/phase-20-final-release-hardening.md')
]);

const counts = await getCourseCounts();

// Contagens derivadas das fontes autorais/geradas -- não hardcoded. O curso pode
// crescer legitimamente (ex.: novos capítulos de reconstrução editorial); o que
// não pode divergir são os totais internos (legado + estruturado, capítulos vs.
// concepts.length) e a exigência de 100% aprovado/zero backlog para release.
const expectedSummary = {
  chapters: counts.chapters,
  legacyChapters: counts.chapters - 23,
  structuredChapters: 23,
  modules: 20,
  concepts: counts.concepts,
  chaptersTriagedAsFailed: 0,
  chaptersApproved: counts.chapters,
  missingChapterPrerequisites: 0,
  futureChapterPrerequisites: 0
};

for (const [key, expected] of Object.entries(expectedSummary)) {
  assert(report.summary[key] === expected, `Resumo final divergente em ${key}: esperado ${expected}, encontrado ${report.summary[key]}.`);
}

assert(Object.keys(report.summary.flagCounts).length === 0, 'A auditoria final não pode manter flags de triagem.');
assert(report.conceptGraphIssues.length === 0, `A auditoria final não pode manter violações de conceito: ${report.conceptGraphIssues.join('; ')}.`);
assert(report.chapters.length === counts.chapters, `A matriz final deve conter exatamente ${counts.chapters} capítulos.`);
assert(report.chapters.every(chapter => chapter.declaredAuditStatus === 'approved'), 'Todos os capítulos devem estar declarados como aprovados.');
assert(report.chapters.every(chapter => chapter.status === 'aprovado'), 'Todos os capítulos devem ter status efetivo aprovado.');
assert(report.chapters.every(chapter => chapter.depthReviewed), 'Todos os capítulos devem estar marcados como revisados em profundidade.');
assert(report.chapters.every(chapter => chapter.resourcesAuditedForRelevance), 'Todos os capítulos devem ter recursos auditados por relevância.');
assert(report.chapters.every(chapter => chapter.dependenciesValidated), 'Todos os capítulos devem ter dependências pedagógicas validadas.');
assert(report.chapters.every(chapter => chapter.flags.length === 0), 'Nenhum capítulo pode manter flags na auditoria final.');
assert(report.chapters.every(chapter => chapter.quizzes > 0), 'Todo capítulo final aprovado precisa de verificação.');
assert(report.chapters.every(chapter => chapter.resources >= 2), 'Todo capítulo final aprovado precisa de pelo menos dois recursos.');
assert(report.chapters.some(chapter => chapter.projects > 0), 'A trilha final precisa manter projetos auditáveis.');

assert(generatedCourse.chapters.length === counts.chapters - 23, `O gerador deve produzir ${counts.chapters - 23} capítulos a partir do pipeline legado/HTML.`);
assert(generatedCourse.modules.length === 20, 'O modelo gerado deve manter 20 módulos.');
assert(generatedCourse.concepts.length === counts.concepts, 'O grafo gerado diverge da contagem de conceitos derivada.');
assert(publicCourse.chapters.length === generatedCourse.chapters.length, 'O JSON público e o JSON fonte divergem em capítulos legados.');
assert(publicCourse.modules.length === generatedCourse.modules.length, 'O JSON público e o JSON fonte divergem em módulos.');
assert(publicCourse.concepts.length === generatedCourse.concepts.length, 'O JSON público e o JSON fonte divergem em conceitos.');

const requiredPhaseReports = [
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
];
for (const file of requiredPhaseReports) {
  await access(`docs/internal/master-audit/${file}`);
}

const requiredDocs = [
  [readme, '# java4br'],
  [readme, '[Acessar o curso]'],
  [readme, '151 capítulos'],
  [readme, 'Exercícios, quizzes, checklists e projetos práticos.'],
  [readme, 'Validação completa'],
  [readme, 'npm run validate'],
  [readme, 'docs/internal/'],
  [progressDoc, 'phase-20-final-release-hardening.md'],
  [progressDoc, 'phase-21-deployment-readiness.md'],
  [progressDoc, 'phase-22-maintenance-guardrails.md'],
  [progressDoc, 'phase-23-progress-contract.md'],
  [progressDoc, 'phase-24-ui-accessibility-contract.md'],
  [progressDoc, 'phase-25-learning-tools-contract.md'],
  [progressDoc, 'phase-26-catalog-integrity.md'],
  [progressDoc, 'phase-27-assessment-integrity.md'],
  [progressDoc, 'phase-28-resource-integrity.md'],
  [progressDoc, 'phase-29-technical-english-contract.md'],
  [progressDoc, 'phase-30-traceability-contract.md'],
  [progressDoc, 'phase-31-master-spec-closure.md'],
  [progressDoc, 'validate:ui'],
  [progressDoc, 'validate:learning-tools'],
  [progressDoc, 'validate:catalog'],
  [progressDoc, 'validate:assessment'],
  [progressDoc, 'validate:resources'],
  [progressDoc, 'validate:technical-english'],
  [progressDoc, 'validate:traceability'],
  [progressDoc, 'validate:master-spec'],
  [progressDoc, 'validate:deployment'],
  [progressDoc, 'validate:maintenance'],
  [progressDoc, 'validate:progress'],
  [contentModel, 'professional-final-phase-19.json'],
  [contentModel, 'zero backlog'],
  [progressDoc, 'Fase 28 de Integridade dos Recursos'],
  [progressDoc, 'Fase 29 de Inglês Técnico Contextual'],
  [progressDoc, 'Fase 30 de Rastreabilidade Viva'],
  [progressDoc, 'Fase 31 de Fechamento da Especificação Mestre'],
  [progressDoc, '151 capítulos aprovados'],
  [progressDoc, '384 conceitos'],
  [progressDoc, 'zero capítulos em backlog'],
  [finalPhaseReport, 'Status: completed'],
  [finalPhaseReport, 'Chapters approved: 151'],
  [finalPhaseReport, 'Backlog chapters: 0'],
  [finalPhaseReport, 'Rendered external URLs validated online: 262']
];
for (const [source, marker] of requiredDocs) {
  assert(source.includes(marker), `Documentação final sem marcador obrigatório: ${marker}`);
}

assert(packageJson.scripts['validate:final-release'] === 'node scripts/validate-final-release.mjs', 'Script validate:final-release ausente ou divergente.');
assert(packageJson.scripts['validate:ui'] === 'node scripts/validate-ui-accessibility-contract.mjs', 'Script validate:ui ausente ou divergente.');
assert(packageJson.scripts['validate:learning-tools'] === 'node scripts/validate-learning-tools-contract.mjs', 'Script validate:learning-tools ausente ou divergente.');
assert(packageJson.scripts['validate:catalog'] === 'node scripts/validate-catalog-integrity.mjs', 'Script validate:catalog ausente ou divergente.');
assert(packageJson.scripts['validate:assessment'] === 'node scripts/validate-assessment-integrity.mjs', 'Script validate:assessment ausente ou divergente.');
assert(packageJson.scripts['validate:resources'] === 'node scripts/validate-resource-integrity.mjs', 'Script validate:resources ausente ou divergente.');
assert(packageJson.scripts['validate:technical-english'] === 'node scripts/validate-technical-english-contract.mjs', 'Script validate:technical-english ausente ou divergente.');
assert(packageJson.scripts['validate:deployment'] === 'node scripts/validate-deployment-readiness.mjs', 'Script validate:deployment ausente ou divergente.');
assert(packageJson.scripts['validate:maintenance'] === 'node scripts/validate-maintenance-guardrails.mjs', 'Script validate:maintenance ausente ou divergente.');
assert(packageJson.scripts['validate:traceability'] === 'node scripts/validate-traceability-contract.mjs', 'Script validate:traceability ausente ou divergente.');
assert(packageJson.scripts['validate:master-spec'] === 'node scripts/validate-master-spec-closure.mjs', 'Script validate:master-spec ausente ou divergente.');
assert(packageJson.scripts['validate:progress'] === 'node scripts/validate-progress-contract.mjs', 'Script validate:progress ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:ui'), 'npm run validate deve executar o gate de UI/acessibilidade.');
assert(packageJson.scripts.validate.includes('npm run validate:learning-tools'), 'npm run validate deve executar o gate de ferramentas de estudo.');
assert(packageJson.scripts.validate.includes('npm run validate:catalog'), 'npm run validate deve executar o gate de integridade do catálogo.');
assert(packageJson.scripts.validate.includes('npm run validate:assessment'), 'npm run validate deve executar o gate de integridade das avaliações.');
assert(packageJson.scripts.validate.includes('npm run validate:resources'), 'npm run validate deve executar o gate de integridade dos recursos.');
assert(packageJson.scripts.validate.includes('npm run validate:technical-english'), 'npm run validate deve executar o gate de inglês técnico contextual.');
assert(packageJson.scripts.validate.includes('npm run validate:deployment'), 'npm run validate deve executar o gate de prontidão de deploy.');
assert(packageJson.scripts.validate.includes('npm run validate:final-release'), 'npm run validate deve executar o gate final de release.');
assert(packageJson.scripts.validate.includes('npm run validate:traceability'), 'npm run validate deve executar o gate de rastreabilidade viva.');
assert(packageJson.scripts.validate.includes('npm run validate:master-spec'), 'npm run validate deve executar o gate de fechamento da especificação mestre.');
assert(packageJson.scripts.validate.includes('npm run validate:maintenance'), 'npm run validate deve executar os guardrails de manutenção.');
assert(packageJson.scripts.validate.includes('npm run validate:progress'), 'npm run validate deve executar o gate de progresso.');
assert(!JSON.stringify(packageJson.dependencies).toLowerCase().includes('supabase'), 'Supabase não deve estar em dependencies.');
assert(!JSON.stringify(packageJson.devDependencies).toLowerCase().includes('supabase'), 'Supabase não deve estar em devDependencies.');

const searchableSources = [
  await readText('platform/src/content/course.ts'),
  await readText('platform/src/progress/repository.ts'),
  await readText('platform/src/progress/schema.ts'),
  await readText('platform/src/app/App.tsx'),
  await readText('README.md')
].join('\n').toLowerCase();
assert(!searchableSources.includes('createclient') && !searchableSources.includes('@supabase'), 'Restos de cliente Supabase foram encontrados em fontes críticas.');

console.log('OK: release final auditado — 151/151 capítulos aprovados, zero backlog, docs coerentes e sem Supabase em fontes críticas.');
