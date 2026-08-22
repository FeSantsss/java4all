import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

if (!process.argv.includes('--accept-content-changes')) {
  throw new Error('Use --accept-content-changes para confirmar conscientemente a nova prova de origem.');
}

const contentRoot = resolve('platform/public/content');
const catalog = JSON.parse(await readFile(resolve(contentRoot, 'catalog.json'), 'utf8'));
const glossary = JSON.parse(await readFile(resolve(contentRoot, 'glossary.json'), 'utf8'));
const previous = JSON.parse(await readFile(resolve(contentRoot, 'source-inventory.json'), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const normalize = value => String(value).replace(/\s+/g, ' ').trim();
const selectors = {
  headings: 'h1, h2, h3, h4, h5, h6', paragraphs: 'p', codeBlocks: 'pre.code', tables: 'table',
  exercises: '.exercise', quizzes: '.quiz', checklists: '.checklist', links: 'a'
};
const totals = Object.fromEntries(Object.keys(selectors).map(key => [key, 0]));
const allHtml = [];
const allText = [];
const chapters = [];

for (const chapter of catalog.chapters) {
  const html = await readFile(resolve(contentRoot, 'chapters', `${chapter.id}.html`), 'utf8');
  const section = JSDOM.fragment(html).querySelector('.section');
  if (!section) throw new Error(`Seção ausente: ${chapter.id}.`);
  const elements = Object.fromEntries(Object.entries(selectors).map(([key, selector]) => {
    const count = section.querySelectorAll(selector).length;
    totals[key] += count;
    return [key, count];
  }));
  const normalizedText = normalize(section.textContent);
  chapters.push({
    id: chapter.id,
    bytes: Buffer.byteLength(html),
    htmlSha256: hash(html),
    textSha256: hash(normalizedText),
    elements
  });
  allHtml.push(html);
  allText.push(normalizedText);
}

const inventory = {
  version: previous.version,
  sourceFiles: previous.sourceFiles,
  counts: {
    chapters: chapters.length,
    glossaryTerms: glossary.length,
    htmlBytes: chapters.reduce((sum, chapter) => sum + chapter.bytes, 0),
    ...totals
  },
  aggregateHtmlSha256: hash(allHtml.join('')),
  aggregateTextSha256: hash(allText.join('\n')),
  chapters
};

await writeFile(resolve(contentRoot, 'source-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`);
console.log(`Inventário atualizado conscientemente: ${chapters.length} capítulos, ${inventory.counts.htmlBytes} bytes.`);
