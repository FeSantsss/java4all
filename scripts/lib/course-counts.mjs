import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '../..');

/**
 * Deriva as contagens canônicas do curso (capítulos totais, conceitos, capítulos
 * aprovados) diretamente das fontes geradas/autorais, em vez de depender de um
 * número fixo copiado em cada validator. Isso existe porque o corpus MUDA de
 * tamanho legitimamente (novos capítulos podem ser adicionados na reconstrução
 * editorial) e um número hardcoded em 8+ arquivos diferentes vira uma fonte de
 * regressão falsa a cada mudança real de conteúdo.
 *
 * `chaptersApproved` aqui conta apenas `audit.status === 'approved'` declarado —
 * isso NÃO é o mesmo que "revisado editorialmente em profundidade". Consulte
 * `docs/internal/content-rewrite/editorial-contract.md` e o campo
 * `editorialReview` de cada capítulo para essa camada independente.
 */
export async function getCourseCounts() {
  const generatedPath = resolve(root, 'platform/src/content/generated-course.json');
  const requiredPath = resolve(root, 'platform/src/content/required-chapters.ts');
  const generated = JSON.parse(await readFile(generatedPath, 'utf8'));
  const requiredSource = await readFile(requiredPath, 'utf8');
  const transpiled = ts.transpileModule(requiredSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const requiredModule = await import(`data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`);
  const requiredChapters = requiredModule.requiredChapters;
  const allChapters = [...generated.chapters, ...requiredChapters];

  return {
    chapters: allChapters.length,
    concepts: generated.concepts.length,
    chaptersApproved: allChapters.filter(chapter => chapter.audit?.status === 'approved').length
  };
}
