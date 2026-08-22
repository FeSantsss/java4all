import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Gate de RASTREABILIDADE editorial -- NÃO de qualidade de texto.
//
// Este validador confirma que, para todo capítulo que declara uma
// `editorialReview` (platform/src/content/schema.ts), a estrutura é íntegra:
// todo tópico obrigatório aponta para pelo menos um bloco de conteúdo real
// que de fato existe no capítulo gerado, e não há `openIssues` pendentes.
//
// Ele NÃO decide se o texto é bom, correto ou suficientemente profundo --
// isso continua exigindo revisão humana. Ver
// docs/internal/content-rewrite/editorial-contract.md.

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const generated = JSON.parse(await readFile('platform/src/content/generated-course.json', 'utf8'));
const requiredSource = await readFile('platform/src/content/required-chapters.ts', 'utf8');
const transpiled = ts.transpileModule(requiredSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const requiredModule = await import(`data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`);
const allChapters = [...generated.chapters, ...requiredModule.requiredChapters];

let reviewed = 0;
let pending = 0;

for (const chapter of allChapters) {
  const review = chapter.editorialReview;
  if (!review) {
    pending += 1;
    continue;
  }

  assert(Array.isArray(review.requiredTopics) && review.requiredTopics.length > 0,
    `${chapter.id}: editorialReview.requiredTopics não pode estar vazio quando declarado.`);
  assert(Array.isArray(review.openIssues),
    `${chapter.id}: editorialReview.openIssues precisa ser um array (vazio se não há pendências).`);

  const blockIds = new Set(chapter.blocks.map(block => block.id));
  for (const topic of review.requiredTopics) {
    const evidence = review.evidenceBlocks?.[topic];
    assert(Array.isArray(evidence) && evidence.length > 0,
      `${chapter.id}: tópico obrigatório "${topic}" não tem evidenceBlocks -- tópico fantasma.`);
    for (const blockId of evidence) {
      assert(blockIds.has(blockId),
        `${chapter.id}: evidenceBlocks["${topic}"] referencia bloco inexistente "${blockId}".`);
    }
  }

  assert(review.openIssues.length === 0,
    `${chapter.id}: declara editorialReview com pendências abertas (${review.openIssues.join('; ')}) -- não deve ser tratado como concluído.`);
  assert(Array.isArray(review.primarySources) && review.primarySources.length > 0,
    `${chapter.id}: editorialReview precisa citar ao menos uma fonte primária.`);

  reviewed += 1;
}

console.log(`OK: rastreabilidade editorial validada -- ${reviewed} capítulo(s) com EditorialReview íntegra, ${pending} ainda sem EditorialReview (aguardando reconstrução editorial). Isto NÃO avalia qualidade do texto -- ver editorial-contract.md.`);
