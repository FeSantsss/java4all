import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { getCourseCounts } from './lib/course-counts.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(path) {
  return readFile(path, 'utf8');
}

async function readBuffer(path) {
  return readFile(path);
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function assertUnique(values, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  assert(duplicates.size === 0, `${label} contém IDs duplicados: ${[...duplicates].join(', ')}`);
}

function assertSortedByOrder(items, label) {
  const orders = items.map(item => item.order);
  assertUnique(orders, `${label} order`);
  const sorted = [...orders].sort((left, right) => left - right);
  assert(orders.every((order, index) => order === sorted[index]), `${label} não está ordenado por order.`);
}

const [
  packageJson,
  generatedCourse,
  publicCourse,
  catalog,
  publicGlossary,
  sourceInventory,
  auditInventory,
  serviceWorker,
  readme,
  progressDoc
] = await Promise.all([
  readJson('package.json'),
  readJson('platform/src/content/generated-course.json'),
  readJson('platform/public/course-content.json'),
  readJson('platform/public/content/catalog.json'),
  readJson('platform/public/content/glossary.json'),
  readJson('platform/public/content/source-inventory.json'),
  readJson('docs/internal/master-audit/phase-0-inventory.json'),
  readText('dist/sw.js'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md')
]);

assert(JSON.stringify(publicCourse) === JSON.stringify(generatedCourse), 'platform/public/course-content.json diverge de platform/src/content/generated-course.json.');
assert(JSON.stringify(publicGlossary) === JSON.stringify(generatedCourse.glossary), 'Glossário público diverge do glossário do curso gerado.');

const counts = await getCourseCounts();
assert(generatedCourse.chapters.length === counts.chapters - 23, `O catálogo legado precisa continuar com ${counts.chapters - 23} capítulos.`);
assert(generatedCourse.modules.length === 20, 'O catálogo legado precisa continuar com 20 módulos.');
assert(generatedCourse.concepts.length === counts.concepts, 'O catálogo legado diverge da contagem de conceitos derivada.');
assert(generatedCourse.glossary.length === 111, 'O glossário contextual legado precisa continuar com 111 termos.');

assertUnique(generatedCourse.modules.map(module => module.id), 'Módulos');
assertUnique(generatedCourse.chapters.map(chapter => chapter.id), 'Capítulos legados');
assertUnique(generatedCourse.concepts.map(concept => concept.id), 'Conceitos');
assertUnique(generatedCourse.glossary.map(entry => entry.id), 'Termos do glossário');

const moduleIds = new Set(generatedCourse.modules.map(module => module.id));
const chapterIds = new Set(generatedCourse.chapters.map(chapter => chapter.id));
const conceptIds = new Set(generatedCourse.concepts.map(concept => concept.id));
const moduleById = new Map(generatedCourse.modules.map(module => [module.id, module]));
const chapterById = new Map(generatedCourse.chapters.map(chapter => [chapter.id, chapter]));
const auditChapterById = new Map(auditInventory.chapters.map(chapter => [chapter.chapterId, chapter]));
const auditedChapterIds = new Set(auditInventory.chapters.map(chapter => chapter.chapterId));

function chapterPosition(chapter) {
  const module = moduleById.get(chapter.moduleId);
  return [module.order, chapter.order];
}

function comesBefore(left, right) {
  const [leftModuleOrder, leftChapterOrder] = chapterPosition(left);
  const [rightModuleOrder, rightChapterOrder] = chapterPosition(right);
  return leftModuleOrder < rightModuleOrder || (leftModuleOrder === rightModuleOrder && leftChapterOrder < rightChapterOrder);
}

assertSortedByOrder(generatedCourse.modules, 'Módulos');

for (const module of generatedCourse.modules) {
  assert(module.chapterIds.length > 0, `Módulo sem capítulos: ${module.id}`);
  assert(module.chapterIds.every(chapterId => chapterIds.has(chapterId)), `Módulo ${module.id} referencia capítulo inexistente.`);
  assert(module.prerequisiteModuleIds.every(moduleId => moduleIds.has(moduleId)), `Módulo ${module.id} referencia módulo pré-requisito inexistente.`);
  assert(module.prerequisiteModuleIds.every(moduleId => moduleById.get(moduleId).order < module.order), `Módulo ${module.id} referencia pré-requisito futuro.`);
}

for (const chapter of generatedCourse.chapters) {
  assert(moduleIds.has(chapter.moduleId), `Capítulo ${chapter.id} referencia módulo inexistente.`);
  assert(chapter.prerequisiteChapterIds.every(chapterId => auditedChapterIds.has(chapterId)), `Capítulo ${chapter.id} referencia pré-requisito inexistente.`);
  assert(chapter.prerequisiteChapterIds.every(chapterId => {
    if (chapterIds.has(chapterId)) return comesBefore(chapterById.get(chapterId), chapter);
    return auditChapterById.get(chapterId).effectiveOrder < auditChapterById.get(chapter.id).effectiveOrder;
  }), `Capítulo ${chapter.id} referencia pré-requisito futuro no catálogo legado.`);
  assert(chapter.blocks.length > 0, `Capítulo ${chapter.id} não possui blocos.`);
  assert(chapter.resources.length >= 2, `Capítulo ${chapter.id} precisa manter pelo menos dois recursos auditados.`);
  assert(chapter.audit?.status === 'approved', `Capítulo ${chapter.id} perdeu status aprovado.`);
  assertUnique(chapter.blocks.map(block => block.id), `Blocos do capítulo ${chapter.id}`);
  assertUnique(chapter.resources.map(resource => resource.id), `Recursos do capítulo ${chapter.id}`);
  for (const conceptId of [...chapter.introducedConceptIds, ...chapter.usedConceptIds]) {
    assert(conceptIds.has(conceptId), `Capítulo ${chapter.id} referencia conceito inexistente: ${conceptId}`);
  }
}

for (const module of generatedCourse.modules) {
  const expectedChapterIds = generatedCourse.chapters
    .filter(chapter => chapter.moduleId === module.id)
    .sort((left, right) => left.order - right.order)
    .map(chapter => chapter.id);
  assert(JSON.stringify(module.chapterIds) === JSON.stringify(expectedChapterIds), `chapterIds do módulo ${module.id} divergem da ordem real dos capítulos.`);
}

assert(catalog.version === 1, 'catalog.json deve manter version 1.');
assert(catalog.chapters.length === generatedCourse.chapters.length, 'catalog.json diverge da quantidade de capítulos gerados.');
for (const [index, entry] of catalog.chapters.entries()) {
  const chapter = generatedCourse.chapters[index];
  assert(entry.index === index, `catalog.json tem index incorreto em ${entry.id}.`);
  assert(entry.id === chapter.id, `catalog.json diverge do curso gerado no índice ${index}.`);
  assert(entry.title === chapter.title, `catalog.json tem título divergente para ${entry.id}.`);
  assert(typeof entry.phaseId === 'string' && entry.phaseId.length > 0, `catalog.json sem phaseId para ${entry.id}.`);
  assert(typeof entry.phaseTitle === 'string' && entry.phaseTitle.length > 0, `catalog.json sem phaseTitle para ${entry.id}.`);
}

assert(sourceInventory.version === 1, 'source-inventory.json deve manter version 1.');
assert(sourceInventory.counts.chapters === generatedCourse.chapters.length, 'Inventário diverge da quantidade de capítulos legados.');
assert(sourceInventory.counts.glossaryTerms === generatedCourse.glossary.length, 'Inventário diverge da quantidade de termos do glossário.');
assert(sourceInventory.chapters.length === generatedCourse.chapters.length, 'Inventário não lista todos os capítulos legados.');

let actualHtmlBytes = 0;
for (const [index, entry] of sourceInventory.chapters.entries()) {
  const chapter = generatedCourse.chapters[index];
  assert(entry.id === chapter.id, `Inventário diverge do catálogo no índice ${index}.`);
  const htmlPath = `platform/public/content/chapters/${entry.id}.html`;
  const html = await readBuffer(htmlPath);
  actualHtmlBytes += html.byteLength;
  assert(entry.bytes === html.byteLength, `Tamanho HTML divergente em ${entry.id}.`);
  assert(entry.htmlSha256 === sha256(html), `Hash HTML divergente em ${entry.id}.`);
  assert(serviceWorker.includes(`./content/chapters/${entry.id}.html`), `Service worker não precacheia ${entry.id}.html.`);
  await access(`dist/content/chapters/${entry.id}.html`);
}
assert(actualHtmlBytes === sourceInventory.counts.htmlBytes, 'Soma de bytes HTML diverge do inventário.');

for (const path of [
  './course-content.json',
  './content/catalog.json',
  './content/glossary.json',
  './content/source-inventory.json',
  './manifest.webmanifest',
  './icon.svg'
]) {
  assert(serviceWorker.includes(path), `Service worker não precacheia ${path}.`);
}

assert(packageJson.scripts['validate:catalog'] === 'node scripts/validate-catalog-integrity.mjs', 'Script validate:catalog ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:catalog'), 'npm run validate deve executar o gate de integridade do catálogo.');
assert(readme.includes(`${counts.chapters} capítulos distribuídos em 20 módulos ordenados por pré-requisitos.`), 'README público deve apresentar o catálogo do curso.');
assert(progressDoc.includes('A Fase 26 adiciona o gate de integridade do catálogo e offline'), 'Progresso interno não preserva o histórico da Fase 26.');
assert(progressDoc.includes('phase-26-catalog-integrity.md'), 'Progresso interno deve listar o relatório da Fase 26.');
assert(progressDoc.includes('A Fase 27 adiciona o gate de integridade das avaliações'), 'Progresso interno não preserva o histórico da Fase 27 após a Fase 26.');
assert(progressDoc.includes('Fase 28 de Integridade dos Recursos'), 'Progresso interno não registra a fase atual após a Fase 27.');

console.log('OK: integridade do catálogo protegida — curso público, catálogo, inventário, hashes HTML e cache offline coerentes.');
