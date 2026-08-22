import { readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(path) {
  return readFile(path, 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function assertUnique(values, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  assert(duplicates.size === 0, `${label} contém duplicatas: ${[...duplicates].join(', ')}`);
}

const [
  packageJson,
  generatedCourse,
  auditReport,
  contentModel,
  validateLinks,
  auditMaster,
  readme,
  progressDoc
] = await Promise.all([
  readJson('package.json'),
  readJson('platform/src/content/generated-course.json'),
  readJson('docs/internal/master-audit/phase-0-inventory.json'),
  readText('docs/internal/content-model.md'),
  readText('scripts/validate-links.mjs'),
  readText('scripts/audit-master-course.mjs'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md')
]);

const resources = generatedCourse.chapters.flatMap(chapter =>
  chapter.resources.map(resource => ({ ...resource, chapterId: chapter.id, moduleId: chapter.moduleId }))
);

const authoritativePublishers = new Set([
  '12factor.net',
  'ADR GitHub organization',
  'Alistair Cockburn',
  'Domain Language',
  'Google',
  'Google SRE',
  'Jepsen',
  'Martin Fowler',
  'MIT',
  'microservices.io',
  'Refactoring.Guru',
  'University of Maryland'
]);

function isAuthoritative(resource) {
  return resource.official || authoritativePublishers.has(resource.publisher);
}

assert(auditReport.summary.uniqueResourceUrls === 260, `Auditoria final deve manter 260 URLs únicas curadas; encontrado ${auditReport.summary.uniqueResourceUrls}.`);
assert(resources.length === 256, `Os 128 capítulos legados devem manter 256 recursos tipados; encontrado ${resources.length}.`);
assert(new Set(resources.map(resource => resource.url)).size === 231, 'Os 128 capítulos legados devem manter 231 URLs únicas tipadas.');
assert(resources.every(resource => resource.auditStatus === 'approved'), 'Todos os recursos gerados precisam estar aprovados por relevância.');
assert(resources.every(resource => resource.language === 'en'), 'Recursos externos devem manter inglês técnico contextual.');
assert(resources.every(resource => ['official-docs', 'reference', 'guide'].includes(resource.type)), 'Tipo de recurso desconhecido no catálogo gerado.');
assert(resources.every(resource => ['foundation', 'beginner', 'intermediate', 'advanced'].includes(resource.expectedLevel)), 'Recurso sem nível esperado válido.');
assert(resources.filter(isAuthoritative).length >= 250, 'A trilha deve priorizar documentação oficial, normativa ou autoritativa.');

for (const chapter of generatedCourse.chapters) {
  assert(chapter.resources.length >= 2, `Capítulo ${chapter.id} perdeu o mínimo de dois recursos.`);
  assertUnique(chapter.resources.map(resource => resource.id), `IDs de recursos do capítulo ${chapter.id}`);
  assert(chapter.resources.some(isAuthoritative), `Capítulo ${chapter.id} precisa de pelo menos um recurso oficial, normativo ou autoritativo.`);
}

const frequency = new Map();
for (const resource of resources) {
  frequency.set(resource.url, (frequency.get(resource.url) ?? 0) + 1);
}

for (const resource of resources) {
  assert(clean(resource.id).length >= 3, `Recurso sem ID útil em ${resource.chapterId}.`);
  assert(clean(resource.title).length >= 8, `Recurso ${resource.id} sem título útil.`);
  assert(clean(resource.publisher).length >= 2, `Recurso ${resource.id} sem publisher.`);
  assert(clean(resource.reinforces).length >= 24, `Recurso ${resource.id} não explica o que reforça.`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(resource.verifiedAt), `Recurso ${resource.id} sem verifiedAt ISO.`);
  assert(resource.verifiedAt >= '2026-08-21', `Recurso ${resource.id} tem verificação antiga demais para o release atual.`);
  const url = new URL(resource.url);
  assert(url.protocol === 'https:', `Recurso sem HTTPS: ${resource.url}`);
  assert(!/youtube\.com\/@[^/]+\/?$/.test(resource.url), `Recurso genérico de canal não é aceito: ${resource.url}`);
  assert((frequency.get(resource.url) ?? 0) < 8, `Recurso repetido em massa sem granularidade suficiente: ${resource.url}`);
}

for (const chapter of auditReport.chapters) {
  assert(chapter.resources >= 2, `Capítulo aprovado com menos de dois recursos: ${chapter.chapterId}`);
  assert(chapter.resourcesAuditedForRelevance, `Capítulo aprovado sem auditoria de relevância dos recursos: ${chapter.chapterId}`);
  assert(chapter.genericResources.length === 0, `Capítulo ${chapter.chapterId} mantém recurso genérico: ${chapter.genericResources.join(', ')}`);
  assert(!chapter.flags.includes('recurso-generico'), `Capítulo ${chapter.chapterId} tem flag de recurso genérico.`);
  assert(!chapter.flags.includes('recurso-repetido-em-massa'), `Capítulo ${chapter.chapterId} tem recurso repetido em massa.`);
}

for (const marker of [
  'A resource group states exactly which concept it reinforces',
  'A generic module link does not satisfy concept-level resource coverage',
  'resources manually approved for relevance'
]) {
  assert(contentModel.includes(marker), `Modelo de conteúdo perdeu regra de recurso: ${marker}`);
}

for (const marker of [
  'chapter.resources.map(resource => resource.url)',
  "matchAll(/'https:\\/\\/[^']+'/g)",
  'recursos externos responderam sem links quebrados'
]) {
  assert(validateLinks.includes(marker), `Validador de links perdeu cobertura de recursos: ${marker}`);
}

for (const marker of [
  'function isGenericResource',
  'resourcesAuditedForRelevance',
  'recurso-generico',
  'recurso-repetido-em-massa'
]) {
  assert(auditMaster.includes(marker), `Auditoria mestre perdeu regra de qualidade de recurso: ${marker}`);
}

assert(packageJson.scripts['validate:resources'] === 'node scripts/validate-resource-integrity.mjs', 'Script validate:resources ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:resources'), 'npm run validate deve executar o gate de recursos.');
assert(readme.includes('recursos') || readme.includes('Recursos'), 'README público deve mencionar recursos da plataforma.');
assert(progressDoc.includes('Fase 28 de Integridade dos Recursos'), 'Progresso interno não registra a Fase 28.');
assert(progressDoc.includes('phase-28-resource-integrity.md'), 'Progresso interno deve listar o relatório da Fase 28.');

console.log('OK: recursos protegidos — metadados, relevância, HTTPS, prioridade oficial e anti-link genérico coerentes.');
