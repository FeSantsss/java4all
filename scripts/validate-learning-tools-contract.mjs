import { access, readFile } from 'node:fs/promises';

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
  sidebar,
  commandPalette,
  reviewPanel,
  knowledgePanel,
  javaLab,
  e2e,
  readme,
  progressDoc
] = await Promise.all([
  readJson('package.json'),
  readText('platform/src/components/course/CourseSidebar.tsx'),
  readText('platform/src/components/navigation/CommandPalette.tsx'),
  readText('platform/src/components/study/ReviewPanel.tsx'),
  readText('platform/src/components/study/KnowledgePanel.tsx'),
  readText('platform/src/components/study/JavaLabPanel.tsx'),
  readText('tests/e2e/responsive.spec.ts'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md')
]);

assert(sidebar.includes('Buscar pelo título'), 'Busca da trilha deve declarar que filtra pelo título.');
assert(sidebar.includes("chapter.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch)"), 'Busca da trilha deve filtrar capítulos pelo título.');
assert(!sidebar.includes('`${chapter.title} ${chapter.summary}`'), 'Busca da trilha não pode voltar a usar resumo do capítulo.');
assert(sidebar.includes('practiceOnly') && sidebar.includes('favoritesOnly'), 'Filtros de prática e favoritos devem permanecer.');
assert(sidebar.includes("aria-current={active ? 'page' : undefined}"), 'Capítulo ativo deve manter aria-current.');
assert(sidebar.includes("onOpenHub('review')") && sidebar.includes("onOpenHub('knowledge')") && sidebar.includes("onOpenHub('lab')"), 'Atalhos da trilha para revisão/domínio/lab devem permanecer.');

assert(commandPalette.includes("chapter.title.toLocaleLowerCase('pt-BR').includes(normalized)"), 'Command palette deve buscar capítulos pelo título.');
assert(!commandPalette.includes('`${chapter.title} ${chapter.summary}`'), 'Command palette não pode voltar a buscar capítulo por resumo.');
for (const action of ['Abrir fila de revisão', 'Abrir mapa de domínio e erros', 'Abrir Java Lab', 'Praticar Technical English', 'Alternar modo foco']) {
  assert(commandPalette.includes(action), `Command palette perdeu ação: ${action}.`);
}

assert(reviewPanel.includes("choices: Record<string, 'selected' | 'deferred'>") || reviewPanel.includes("'selected' : 'deferred'"), 'Revisão deve manter escolha selected/deferred.');
assert(reviewPanel.includes('reviewPlan.date !== today') && reviewPanel.includes("!== 'deferred'"), 'Revisão deve respeitar seleção/deferimento do dia.');
assert(reviewPanel.includes('type="checkbox"'), 'Plano de revisão deve permitir escolher itens por checkbox.');
assert(reviewPanel.includes('Recuperação antes da revisão'), 'Revisão deve manter recuperação ativa antes da resposta.');
assert(reviewPanel.includes('quiz.options.map(option => <button'), 'Revisão deve responder por múltipla escolha.');
assert(reviewPanel.includes('Registrar e continuar'), 'Revisão deve registrar a resposta e avançar.');
assert(reviewPanel.includes('intervalDays') && reviewPanel.includes('ease') && reviewPanel.includes('mastery'), 'Revisão deve preservar cálculo espaçado.');
assert(reviewPanel.includes('current.errors'), 'Erro de revisão deve entrar no caderno de erros.');

for (const view of ['mastery', 'errors', 'diagnostic', 'projects', 'glossary']) {
  assert(knowledgePanel.includes(`'${view}'`), `Painel de conhecimento perdeu visão: ${view}.`);
}
assert(knowledgePanel.includes('glossary.filter'), 'Glossário contextual deve filtrar termos.');
assert(knowledgePanel.includes('item.aliases.join'), 'Glossário deve considerar aliases.');
assert(knowledgePanel.includes('correctError'), 'Caderno de erros deve permitir corrigir erro.');
assert(knowledgePanel.includes('startDiagnostic') && knowledgePanel.includes('answerDiagnostic') && knowledgePanel.includes('advanceDiagnostic'), 'Diagnóstico executável deve permanecer.');
assert(knowledgePanel.includes('projectReadiness') || knowledgePanel.includes('Prontidão de projetos'), 'Prontidão de projetos deve permanecer.');
assert(knowledgePanel.includes('onSelectChapter(item.chapterId)'), 'Glossário deve abrir capítulo relacionado.');

assert(javaLab.includes('executeJavaSubset'), 'Java Lab deve manter runner didático offline.');
assert(javaLab.includes("progress.labs[chapter.id]"), 'Java Lab deve persistir rascunho por capítulo.');
assert(javaLab.includes('aria-label="Código Java"'), 'Java Lab deve manter editor acessível.');
assert(javaLab.includes('ctrlKey || event.metaKey') && javaLab.includes("event.key === 'Enter'"), 'Java Lab deve executar com Ctrl/Cmd+Enter.');
assert(javaLab.includes('navigator.clipboard'), 'Java Lab deve manter cópia para clipboard.');
assert(javaLab.includes("anchor.download = 'Main.java'"), 'Java Lab deve permitir baixar Main.java.');
assert(javaLab.includes('aria-live="polite"'), 'Console do Java Lab deve anunciar resultado.');

assert(e2e.includes('busca da trilha filtra capítulos explicitamente pelo título'), 'E2E deve proteger busca por título.');
assert(e2e.includes("fill('spring')"), 'E2E deve reproduzir busca por Spring.');
assert(e2e.includes("Git & fluxo de trabalho") && e2e.includes('toHaveCount(0)'), 'E2E deve garantir que Git não aparece ao buscar Spring.');

assert(packageJson.scripts['validate:learning-tools'] === 'node scripts/validate-learning-tools-contract.mjs', 'Script validate:learning-tools ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:learning-tools'), 'npm run validate deve executar o gate de ferramentas de estudo.');
assert(readme.includes('npm run validate:learning-tools'), 'README deve documentar o gate de ferramentas de estudo.');
assert(readme.includes('phase-25-learning-tools-contract.md'), 'README deve apontar para o relatório da fase 25.');
assert(progressDoc.includes('A Fase 25 adiciona o gate das ferramentas de estudo'), 'Progresso interno não preserva o histórico da Fase 25.');
assert(progressDoc.includes('A Fase 26 adiciona o gate de integridade do catálogo e offline'), 'Progresso interno não preserva o histórico da Fase 26 após a Fase 25.');
assert(progressDoc.includes('A Fase 27 adiciona o gate de integridade das avaliações'), 'Progresso interno não preserva o histórico da Fase 27 após a Fase 26.');
assert(progressDoc.includes('Fase 28 de Integridade dos Recursos'), 'Progresso interno não registra a fase atual após a Fase 27.');
await access('docs/internal/master-audit/phase-25-learning-tools-contract.md');

console.log('OK: ferramentas de estudo protegidas — busca por título, revisão, glossário, diagnóstico e Java Lab coerentes.');
