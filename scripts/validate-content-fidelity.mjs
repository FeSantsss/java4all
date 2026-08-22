import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const contentRoot = resolve('platform/public/content');
const chapterDirectory = resolve(contentRoot, 'chapters');
const catalog = JSON.parse(await readFile(resolve(contentRoot, 'catalog.json'), 'utf8'));
const glossary = JSON.parse(await readFile(resolve(contentRoot, 'glossary.json'), 'utf8'));
const inventory = JSON.parse(await readFile(resolve(contentRoot, 'source-inventory.json'), 'utf8'));
const generated = JSON.parse(await readFile('platform/src/content/generated-course.json', 'utf8'));
const generatedById = new Map(generated.chapters.map(chapter => [chapter.id, chapter]));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalize(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function comparable(value) {
  return normalize(value).replace(/\s/g, '');
}

function htmlText(html) {
  return normalize(JSDOM.fragment(html).textContent);
}

function blockText(block) {
  if (block.fidelityText) return normalize(block.fidelityText);
  if (block.type === 'html') return htmlText(block.html);
  if (block.type === 'code') return normalize(block.source);
  if (block.type === 'exercise') return block.sourceHtml ? htmlText(block.sourceHtml) : normalize(`${block.title} ${block.prompt} ${block.criteria.join(' ')}`);
  if (block.type === 'quiz') return normalize(`${block.prompt} ${block.options.map(option => option.label).join(' ')}`);
  if (block.type === 'checklist') return normalize(block.items.map(item => item.label).join(' '));
  return '';
}

const files = (await readdir(chapterDirectory)).filter(file => file.endsWith('.html')).sort();
const expectedFiles = catalog.chapters.map(chapter => `${chapter.id}.html`).sort();
assert(JSON.stringify(files) === JSON.stringify(expectedFiles), 'O conjunto de arquivos HTML não corresponde exatamente ao catálogo.');
assert(catalog.chapters.length === generated.chapters.length, 'O catálogo separado diverge da contagem de capítulos legados gerados.');
assert(glossary.length === 111, 'O glossário separado deve preservar 111 definições.');
assert(generated.glossary.length === glossary.length, 'O modelo React não carregou o glossário completo.');

const allHtml = [];
const allText = [];
for (const chapter of catalog.chapters) {
  const html = await readFile(resolve(chapterDirectory, `${chapter.id}.html`), 'utf8');
  const record = inventory.chapters.find(item => item.id === chapter.id);
  const section = JSDOM.fragment(html).querySelector('.section');
  const generatedChapter = generatedById.get(chapter.id);
  assert(record && section && generatedChapter, `Capítulo incompleto na cadeia de migração: ${chapter.id}.`);
  assert(record.htmlSha256 === sha256(html), `HTML alterado sem atualizar a prova de origem: ${chapter.id}.`);
  assert(record.textSha256 === sha256(normalize(section.textContent)), `Texto alterado sem atualizar a prova de origem: ${chapter.id}.`);
  assert(normalize(section.querySelector('.section-title')?.textContent) === normalize(chapter.title), `Título divergente em ${chapter.id}.`);
  assert(generatedChapter.title === chapter.title, `Título não preservado no modelo React: ${chapter.id}.`);

  const children = [...section.children];
  for (const [index, child] of children.entries()) {
    if (child.matches('.section-head')) continue;
    const block = generatedChapter.blocks.find(candidate => (
      candidate.sourceIndex === index || candidate.sourceIndexes?.includes(index) || candidate.id.endsWith(`-${index}`)
    ) && !candidate.id.includes('concept-check'));
    assert(block, `Bloco React ausente para ${chapter.id}, filho ${index}.`);
    const sourceIndexes = block.sourceIndexes ?? [index];
    if (index !== sourceIndexes[0]) continue;
    const sourceText = normalize(sourceIndexes.map(sourceIndex => children[sourceIndex]?.textContent ?? '').join(' '));
    const migratedText = blockText(block);
    assert(comparable(sourceText) === comparable(migratedText), `Conteúdo resumido ou perdido em ${chapter.id}, bloco ${block.id}.`);
  }

  allHtml.push(html);
  allText.push(normalize(section.textContent));
}

assert(sha256(allHtml.join('')) === inventory.aggregateHtmlSha256, 'O hash agregado dos HTMLs separados divergiu da extração original.');
assert(sha256(allText.join('\n')) === inventory.aggregateTextSha256, 'O hash agregado do texto divergiu da extração original.');
console.log(`OK: ${files.length} arquivos HTML, ${inventory.counts.htmlBytes} bytes e ${glossary.length} definições preservados sem resumo.`);
