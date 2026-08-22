import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const outputDirectory = resolve(root, 'docs/internal/master-audit');
const generatedPath = resolve(root, 'platform/src/content/generated-course.json');
const requiredPath = resolve(root, 'platform/src/content/required-chapters.ts');
const generated = JSON.parse(await readFile(generatedPath, 'utf8'));
const requiredSource = await readFile(requiredPath, 'utf8');
const transpiledRequired = ts.transpileModule(requiredSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const requiredModule = await import(`data:text/javascript;base64,${Buffer.from(transpiledRequired).toString('base64')}`);
const requiredChapters = requiredModule.requiredChapters;
const chapters = [...generated.chapters, ...requiredChapters];
const legacyChapterIds = new Set(generated.chapters.map(chapter => chapter.id));
const conceptById = new Map(generated.concepts.map(concept => [concept.id, concept]));
const modulePosition = new Map(generated.modules.map((module, index) => [module.id, index]));
const chapterPosition = new Map(
  [...chapters]
    .sort((left, right) => (modulePosition.get(left.moduleId) - modulePosition.get(right.moduleId)) || left.order - right.order)
    .map((chapter, index) => [chapter.id, index])
);

function textFromBlock(block) {
  if (block.type === 'html') return JSDOM.fragment(block.html).textContent ?? '';
  if (block.type === 'exercise') return `${block.title} ${block.prompt} ${block.criteria.join(' ')} ${block.sourceHtml ? JSDOM.fragment(block.sourceHtml).textContent ?? '' : ''}`;
  if (block.type === 'quiz') return `${block.prompt} ${block.options.map(option => `${option.label} ${option.explanation ?? ''}`).join(' ')}`;
  if (block.type === 'checklist') return `${block.title} ${block.items.map(item => item.label).join(' ')}`;
  if (block.type === 'code') return `${block.caption} ${block.source} ${block.expectedOutput ?? ''}`;
  if (block.type === 'project') return `${block.title} ${block.brief} ${block.requirements.join(' ')} ${block.acceptanceCriteria.join(' ')}`;
  if (block.type === 'mental-model') return `${block.title} ${block.body} ${block.flow?.join(' ') ?? ''} ${block.ownership?.join(' ') ?? ''} ${block.lifecycle?.join(' ') ?? ''}`;
  if (block.type === 'comparison') return `${block.title} ${block.criteria.join(' ')} ${block.alternatives.flatMap(alternative => [alternative.name, ...alternative.values, alternative.useWhen, alternative.avoidWhen]).join(' ')}`;
  if (block.type === 'error-case') return `${block.title} ${block.scenario} ${block.symptom} ${block.cause} ${block.diagnosis.join(' ')} ${block.correction} ${block.prevention ?? ''}`;
  if (block.type === 'diagram') return `${block.title} ${block.description} ${block.steps.join(' ')}`;
  if (block.type === 'table') return `${block.title} ${block.headers.join(' ')} ${block.rows.flat().join(' ')}`;
  return `${block.title ?? ''} ${block.body ?? ''} ${block.prompt ?? ''} ${block.answer ?? ''}`;
}

function wordCount(value) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized ? normalized.split(' ').length : 0;
}

function countTypes(blocks) {
  return blocks.reduce((counts, block) => {
    counts[block.type] = (counts[block.type] ?? 0) + 1;
    return counts;
  }, {});
}

function isGenericResource(resource) {
  let url;
  try {
    url = new URL(resource.url);
  } catch {
    return true;
  }
  return /youtube\.com\/@[^/]+\/?$/.test(resource.url)
    || /^\/learn\/?$/.test(url.pathname)
    || /^\/(?:documentation|docs)\/?$/.test(url.pathname);
}

const resourceFrequency = new Map();
for (const chapter of chapters) {
  for (const resource of chapter.resources) {
    resourceFrequency.set(resource.url, (resourceFrequency.get(resource.url) ?? 0) + 1);
  }
}

const chapterRows = chapters.map(chapter => {
  const typeCounts = countTypes(chapter.blocks);
  const quizzes = chapter.blocks.filter(block => block.type === 'quiz');
  const exercises = chapter.blocks.filter(block => block.type === 'exercise');
  const projects = chapter.blocks.filter(block => block.type === 'project');
  const codeBlocks = chapter.blocks.filter(block => block.type === 'code');
  const generatedCompatibilityBlocks = chapter.blocks.filter(block => block.authorship === 'generated-compatibility');
  const missingPrerequisites = chapter.prerequisiteChapterIds.filter(id => !chapterPosition.has(id));
  const futurePrerequisites = chapter.prerequisiteChapterIds.filter(id => (
    chapterPosition.has(id) && chapterPosition.get(id) >= chapterPosition.get(chapter.id)
  ));
  const flags = [];
  const legacy = legacyChapterIds.has(chapter.id);

  if (/^Este capítulo introduz .+ quando seus pré-requisitos/.test(chapter.whyItExists)) flags.push('motivacao-gerada-generica');
  if (!typeCounts.intuition) flags.push('sem-ponte-intuitiva-tipificada');
  if (!typeCounts.exercise && !typeCounts.project && !typeCounts.checklist) flags.push('sem-pratica-estruturada');
  if (!quizzes.length) flags.push('sem-verificacao');
  if (quizzes.some(quiz => quiz.options.some(option => !option.explanation))) flags.push('quiz-sem-racional-por-alternativa');
  if (quizzes.some(quiz => /^Em “.+”, qual afirmação descreve corretamente o conceito\?$/.test(quiz.prompt))) flags.push('quiz-gerado-por-titulo');
  if (codeBlocks.some(block => !('explanation' in block))) flags.push('codigo-tipado-sem-explicacao');
  if (generatedCompatibilityBlocks.length) flags.push('avaliacao-gerada-para-compatibilidade');
  if (!chapter.introducedConceptIds?.length && !chapter.usedConceptIds?.length) flags.push('sem-grafo-de-conceitos-declarado');
  if (chapter.resources.some(isGenericResource)) flags.push('recurso-generico');
  if (chapter.resources.some(resource => (resourceFrequency.get(resource.url) ?? 0) >= 8)) flags.push('recurso-repetido-em-massa');
  if (projects.length && !projects.every(project => 'knowledgeMatrix' in project)) flags.push('projeto-sem-matriz-de-conhecimento');
  if (missingPrerequisites.length) flags.push('pre-requisito-inexistente');
  if (futurePrerequisites.length) flags.push('pre-requisito-futuro');

  const declaredAuditStatus = chapter.audit?.status ?? 'pending';
  const triageStatus = declaredAuditStatus === 'approved' && flags.length
    ? 'aprovacao-invalida'
    : flags.length ? 'reprovado-na-triagem'
      : declaredAuditStatus === 'approved' ? 'aprovado' : 'pendente-de-auditoria-humana';

  return {
    chapterId: chapter.id,
    title: chapter.title,
    moduleId: chapter.moduleId,
    effectiveOrder: chapterPosition.get(chapter.id),
    sourceKind: legacy ? 'legacy-html-generated-metadata' : 'structured-typescript',
    sourcePath: legacy
      ? `platform/public/content/chapters/${chapter.id}.html`
      : 'platform/src/content/required-chapters.ts',
    prerequisiteChapterIds: chapter.prerequisiteChapterIds,
    missingPrerequisites,
    futurePrerequisites,
    conceptIds: chapter.conceptIds,
    wordCount: wordCount(chapter.blocks.map(textFromBlock).join(' ')),
    blockTypes: typeCounts,
    exercises: exercises.length,
    quizzes: quizzes.length,
    projects: projects.length,
    resources: chapter.resources.length,
    genericResources: chapter.resources.filter(isGenericResource).map(resource => resource.url),
    flags,
    generatedCompatibilityBlocks: generatedCompatibilityBlocks.length,
    declaredAuditStatus,
    depthReviewed: declaredAuditStatus === 'approved',
    resourcesAuditedForRelevance: chapter.resources.length > 0 && chapter.resources.every(resource => resource.auditStatus === 'approved'),
    dependenciesValidated: missingPrerequisites.length === 0 && futurePrerequisites.length === 0,
    status: triageStatus
  };
});

const moduleEdges = generated.modules.flatMap(module => module.prerequisiteModuleIds.map(prerequisiteId => ({
  from: prerequisiteId,
  to: module.id
})));
const chapterEdges = chapterRows.flatMap(chapter => chapter.prerequisiteChapterIds.map(prerequisiteId => ({
  from: prerequisiteId,
  to: chapter.chapterId,
  missing: chapter.missingPrerequisites.includes(prerequisiteId),
  future: chapter.futurePrerequisites.includes(prerequisiteId)
})));
const summary = {
  auditVersion: 1,
  baselineDate: '2026-08-21',
  chapters: chapterRows.length,
  legacyChapters: chapterRows.filter(chapter => chapter.sourceKind.startsWith('legacy')).length,
  structuredChapters: chapterRows.filter(chapter => chapter.sourceKind === 'structured-typescript').length,
  modules: generated.modules.length,
  projects: chapterRows.reduce((total, chapter) => total + chapter.projects, 0),
  exercises: chapterRows.reduce((total, chapter) => total + chapter.exercises, 0),
  quizzes: chapterRows.reduce((total, chapter) => total + chapter.quizzes, 0),
  uniqueResourceUrls: resourceFrequency.size,
  concepts: generated.concepts.length,
  chaptersTriagedAsFailed: chapterRows.filter(chapter => chapter.status === 'reprovado-na-triagem').length,
  chaptersApproved: chapterRows.filter(chapter => chapter.declaredAuditStatus === 'approved' && chapter.status !== 'aprovacao-invalida').length,
  missingChapterPrerequisites: chapterEdges.filter(edge => edge.missing).length,
  futureChapterPrerequisites: chapterEdges.filter(edge => edge.future).length,
  flagCounts: Object.fromEntries([...new Set(chapterRows.flatMap(chapter => chapter.flags))].sort().map(flag => [
    flag,
    chapterRows.filter(chapter => chapter.flags.includes(flag)).length
  ]))
};

const report = {
  summary,
  sourceOfTruth: {
    legacyChapterBody: 'platform/public/content/chapters/<id>.html',
    legacyCatalog: 'platform/public/content/catalog.json',
    structuredChapters: 'platform/src/content/required-chapters.ts',
    authoredPedagogyOverrides: 'platform/content/pedagogy-overrides.json',
    moduleGraph: 'docs/internal/pedagogy-plan.js',
    glossary: 'platform/public/content/glossary.json',
    schema: 'platform/src/content/schema.ts',
    generatedArtifacts: ['platform/src/content/generated-course.json', 'platform/public/course-content.json'],
    generator: 'scripts/generate-course-content.mjs',
    runtimeAssembly: 'platform/src/content/course.ts'
  },
  chapters: chapterRows
};

function csvCell(value) {
  const serialized = Array.isArray(value) ? value.join('|') : String(value ?? '');
  return `"${serialized.replaceAll('"', '""')}"`;
}

const csvColumns = [
  'chapterId', 'title', 'moduleId', 'effectiveOrder', 'sourceKind', 'sourcePath',
  'prerequisiteChapterIds', 'conceptIds', 'wordCount', 'exercises', 'quizzes', 'projects',
  'resources', 'declaredAuditStatus', 'depthReviewed', 'resourcesAuditedForRelevance', 'dependenciesValidated', 'status', 'flags'
];
const csv = [csvColumns.join(','), ...chapterRows.map(chapter => csvColumns.map(column => csvCell(chapter[column])).join(','))].join('\n') + '\n';

await mkdir(outputDirectory, { recursive: true });
await writeFile(resolve(outputDirectory, 'phase-0-inventory.json'), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(resolve(outputDirectory, 'chapter-audit-matrix.csv'), csv);
await writeFile(resolve(outputDirectory, 'dependency-graph.json'), `${JSON.stringify({
  modules: generated.modules.map(module => ({ id: module.id, order: module.order, prerequisites: module.prerequisiteModuleIds })),
  chapters: chapterRows.map(chapter => ({ id: chapter.chapterId, moduleId: chapter.moduleId, order: chapter.effectiveOrder })),
  moduleEdges,
  chapterEdges
}, null, 2)}\n`);

const conceptGraphIssues = generated.concepts.flatMap(concept => {
  const issues = [];
  if (!chapterPosition.has(concept.introducedIn)) issues.push(`${concept.id}: capítulo introdutor inexistente`);
  for (const prerequisiteId of concept.prerequisiteConceptIds) {
    const prerequisite = conceptById.get(prerequisiteId);
    if (!prerequisite) issues.push(`${concept.id}: conceito pré-requisito inexistente ${prerequisiteId}`);
    else if (chapterPosition.get(prerequisite.introducedIn) > chapterPosition.get(concept.introducedIn)) {
      issues.push(`${concept.id}: conceito futuro usado como pré-requisito ${prerequisiteId}`);
    }
  }
  return issues;
});
for (const chapter of chapters.filter(item => item.audit?.status === 'approved')) {
  for (const conceptId of [...chapter.introducedConceptIds, ...chapter.usedConceptIds]) {
    const concept = conceptById.get(conceptId);
    if (!concept) conceptGraphIssues.push(`${chapter.id}: conceito declarado inexistente ${conceptId}`);
    else if (chapter.usedConceptIds.includes(conceptId) && chapterPosition.get(concept.introducedIn) >= chapterPosition.get(chapter.id)) {
      conceptGraphIssues.push(`${chapter.id}: usa conceito ainda não ensinado ${conceptId}`);
    }
  }
}
report.conceptGraphIssues = conceptGraphIssues;
await writeFile(resolve(outputDirectory, 'phase-0-inventory.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(`Auditoria mestre: ${summary.chapters} capítulos; ${summary.chaptersApproved} aprovados; ${summary.chaptersTriagedAsFailed} ainda reprovados na triagem.`);
console.log(`Grafo: ${moduleEdges.length} dependências de módulo, ${chapterEdges.length} dependências de capítulo, ${summary.missingChapterPrerequisites} ausentes, ${summary.futureChapterPrerequisites} futuras.`);
console.log(`Conceitos: ${summary.concepts} registrados; ${conceptGraphIssues.length} violações de ordem ou referência.`);
