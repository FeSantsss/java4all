import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { findPortugueseCodeIdentifiers } from './english-code.mjs';

const root = resolve(import.meta.dirname, '..');
const course = JSON.parse(await readFile(resolve(root, 'platform/src/content/generated-course.json'), 'utf8'));
const errors = [];
const codeExamples = [];

for (const chapter of course.chapters) {
  for (const block of chapter.blocks) {
    if (block.type === 'code') codeExamples.push({ chapterId: chapter.id, source: block.source });
    const nestedHtml = block.type === 'html' ? block.html : block.type === 'exercise' ? block.sourceHtml : undefined;
    if (nestedHtml) {
      const fragment = JSDOM.fragment(nestedHtml);
      for (const pre of fragment.querySelectorAll('pre.code')) {
        codeExamples.push({ chapterId: chapter.id, source: pre.textContent ?? '' });
      }
    }
  }
}

const portugueseProse = /\b(?:agora|ainda|antes|apenas|assim|ate|capitulo|como|depois|deve|duas|entao|esta|este|exatamente|fazer|funciona|isso|mais|mas|mesma|mesmo|muito|nao|nunca|onde|para|pode|porque|precisa|quando|sem|sempre|sua|tambem|tempo|toda|tudo|uma|voce)\b/i;

for (const example of codeExamples) {
  const identifiers = findPortugueseCodeIdentifiers(example.source);
  if (identifiers.length) errors.push(`${example.chapterId}: Portuguese identifiers: ${identifiers.join(', ')}`);

  for (const line of example.source.split('\n')) {
    const commentAt = [line.indexOf('//'), line.indexOf('# '), line.indexOf('-- '), line.indexOf('/*')]
      .filter(index => index >= 0).sort((left, right) => left - right)[0];
    const code = commentAt === undefined ? line : line.slice(0, commentAt);
    const comment = commentAt === undefined ? '' : line.slice(commentAt);
    if (comment && portugueseProse.test(comment)) errors.push(`${example.chapterId}: mixed comment in “${comment.trim()}”`);
  }
}

const requiredActivityFields = [
  'label', 'codeContext', 'readPassage', 'comprehensionQuestion', 'contextSupport',
  'documentationTask', 'productionTask', 'successCriterion'
];
const levelCounts = [0, 0, 0, 0];
for (const chapter of course.chapters) {
  const activity = chapter.englishActivity;
  levelCounts[activity.level] += 1;
  for (const field of requiredActivityFields) {
    if (typeof activity[field] !== 'string' || activity[field].trim().length < 8) {
      errors.push(`${chapter.id}: English activity field ${field} is missing or too short.`);
    }
  }
  const assessment = `${activity.comprehensionQuestion} ${activity.productionTask}`;
  if (/traduz|tradu[cç][aã]o|what does .+ mean in portuguese|translate .+ into/i.test(assessment)) {
    errors.push(`${chapter.id}: translation exercise is not allowed.`);
  }
  if (activity.level >= 2 && portugueseProse.test(`${activity.readPassage} ${activity.comprehensionQuestion} ${activity.documentationTask} ${activity.productionTask} ${activity.successCriterion}`)) {
    errors.push(`${chapter.id}: advanced English activity still depends on Portuguese.`);
  }
  if (activity.level === 3 && !/issue|specification|requirements|trade-offs/i.test(activity.productionTask)) {
    errors.push(`${chapter.id}: professional activity must produce an English technical artifact.`);
  }
}

// Piso, não meta exata: o número de exemplos de código cresce legitimamente
// conforme capítulos são aprofundados ou novos capítulos são adicionados.
if (codeExamples.length < 414) errors.push(`Expected at least 414 legacy code examples, found ${codeExamples.length}.`);
if (levelCounts.some(count => count === 0)) errors.push(`English progression is incomplete: ${levelCounts.join('/')}.`);

if (errors.length) {
  console.error(`English validation failed with ${errors.length} error(s):`);
  errors.slice(0, 80).forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`English validated: ${codeExamples.length} code examples; levels ${levelCounts.join('/')}; no translation-based assessment.`);
