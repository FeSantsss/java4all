import { access, readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(path) {
  return readFile(path, 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const contentFiles = (await readdir('platform/content'))
  .filter(file => file.endsWith('.json'))
  .sort();

const phaseContentFiles = contentFiles.filter(file => /phase-\d+\.json$/.test(file));
const expectedPhaseContentFiles = [
  'foundations-phase-2.json',
  'oop-phase-3.json',
  'java-core-phase-4.json',
  'io-cli-phase-5.json',
  'algorithms-engineering-phase-6.json',
  'http-integration-phase-7.json',
  'relational-data-phase-8.json',
  'application-design-phase-9.json',
  'spring-api-phase-10.json',
  'api-security-quality-phase-11.json',
  'containers-integration-data-phase-12.json',
  'concurrency-network-tui-phase-13.json',
  'production-delivery-phase-14.json',
  'sync-resilience-phase-15.json',
  'messaging-eda-phase-16.json',
  'distributed-consistency-phase-17.json',
  'intermediate-projects-phase-18.json',
  'professional-final-phase-19.json'
];

assert(JSON.stringify(phaseContentFiles) === JSON.stringify(expectedPhaseContentFiles.slice().sort()), 'Arquivos de conteúdo por fase divergiram do inventário de manutenção.');
assert(contentFiles.includes('pedagogy-overrides.json'), 'Registro autoral pedagogy-overrides.json ausente.');

const [
  generator,
  packageJson,
  readme,
  contentModel,
  progressDoc,
  generatedCourse,
  publicCourse,
  auditReport,
  sourceInventory,
  catalog
] = await Promise.all([
  readText('scripts/generate-course-content.mjs'),
  readJson('package.json'),
  readText('README.md'),
  readText('docs/internal/content-model.md'),
  readText('docs/internal/implementation-progress.md'),
  readJson('platform/src/content/generated-course.json'),
  readJson('platform/public/course-content.json'),
  readJson('docs/internal/master-audit/phase-0-inventory.json'),
  readJson('platform/public/content/source-inventory.json'),
  readJson('platform/public/content/catalog.json')
]);

for (const file of ['pedagogy-overrides.json', ...phaseContentFiles]) {
  assert(generator.includes(`platform/content/${file}`), `Gerador não lê a fonte autoral ${file}.`);
  assert(contentModel.includes(`platform/content/${file}`), `Modelo de conteúdo não documenta a fonte autoral ${file}.`);
}

for (const file of [
  'phase-20-final-release-hardening.md',
  'phase-21-deployment-readiness.md',
  'phase-22-maintenance-guardrails.md'
]) {
  assert(readme.includes(file), `README não aponta para ${file}.`);
  await access(`docs/internal/master-audit/${file}`);
}

assert(progressDoc.includes('A Fase 22 adiciona guardrails de manutenção'), 'Progresso interno não preserva o registro histórico da Fase 22.');
assert(progressDoc.includes('A Fase 23 adiciona o gate de contrato de progresso'), 'Progresso interno não preserva o registro histórico da Fase 23.');
assert(packageJson.scripts['validate:maintenance'] === 'node scripts/validate-maintenance-guardrails.mjs', 'Script validate:maintenance ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:maintenance'), 'npm run validate deve executar os guardrails de manutenção.');

for (const forbiddenRoot of ['index.html', 'app.js', 'curriculum-v2.js', 'sw.js', 'manifest.webmanifest', 'supabase-config.js']) {
  try {
    await access(forbiddenRoot);
    throw new Error(`Arquivo legado raiz não deveria existir: ${forbiddenRoot}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

assert(generatedCourse.chapters.length === 128, 'generated-course.json deve conter os 128 capítulos legados gerados.');
assert(publicCourse.chapters.length === generatedCourse.chapters.length, 'course-content.json público diverge do generated-course.json em capítulos.');
assert(publicCourse.modules.length === generatedCourse.modules.length, 'course-content.json público diverge do generated-course.json em módulos.');
assert(publicCourse.concepts.length === generatedCourse.concepts.length, 'course-content.json público diverge do generated-course.json em conceitos.');
assert(auditReport.summary.chapters === 151 && auditReport.summary.chaptersApproved === 151, 'Auditoria mestre deve permanecer em 151/151 capítulos.');
assert(auditReport.summary.chaptersTriagedAsFailed === 0, 'Auditoria mestre não pode voltar a ter backlog.');
assert(catalog.chapters.length === 128, 'Catálogo canônico deve preservar 128 capítulos legados.');
assert(sourceInventory.chapters.length === 128, 'Inventário de origem deve preservar 128 capítulos legados.');
assert(sourceInventory.aggregateHtmlSha256 && sourceInventory.aggregateTextSha256, 'Inventário de origem deve manter hashes agregados.');

const chapterFiles = (await readdir('platform/public/content/chapters')).filter(file => file.endsWith('.html')).sort();
assert(chapterFiles.length === 128, 'Diretório de capítulos canônicos deve conter 128 HTMLs.');
const catalogIds = new Set(catalog.chapters.map(chapter => `${chapter.id}.html`));
const missingHtml = [...catalogIds].filter(file => !chapterFiles.includes(file));
assert(missingHtml.length === 0, `Capítulos do catálogo sem HTML canônico: ${missingHtml.join(', ')}.`);
const extraHtml = chapterFiles.filter(file => !catalogIds.has(file));
assert(extraHtml.length === 0, `HTMLs canônicos sem entrada no catálogo: ${extraHtml.join(', ')}.`);

assert(!generator.includes("readFile(resolve(root, 'index.html')"), 'Gerador não pode voltar a ler index.html monolítico.');
assert(!generator.includes("readFile(resolve(root, 'curriculum-v2.js')"), 'Gerador não pode voltar a ler curriculum-v2.js monolítico.');
assert(readme.includes('generated-course.json` e `course-content.json` são artefatos gerados'), 'README deve avisar que JSONs gerados não são fonte autoral.');

console.log(`OK: guardrails de manutenção ativos — ${phaseContentFiles.length} fontes de fase conectadas, 128 HTMLs canônicos e zero monólitos legados.`);
