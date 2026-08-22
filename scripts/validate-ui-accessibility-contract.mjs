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
  app,
  settings,
  studyHub,
  markdownNotes,
  styles,
  accessibilityTest,
  e2e,
  readme,
  progressDoc
] = await Promise.all([
  readJson('package.json'),
  readText('platform/src/app/App.tsx'),
  readText('platform/src/components/study/SettingsPanel.tsx'),
  readText('platform/src/components/study/StudyHub.tsx'),
  readText('platform/src/components/notes/MarkdownNoteEditor.tsx'),
  readText('platform/src/styles.css'),
  readText('platform/src/app/accessibility.test.tsx'),
  readText('tests/e2e/responsive.spec.ts'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md')
]);

assert(app.includes('href="#main-content"') && app.includes('className="skip-link"'), 'Aplicação deve manter skip link para o conteúdo principal.');
assert(app.includes('<main id="main-content">'), 'Conteúdo principal deve manter id main-content.');
assert(app.includes("progress.settings.theme === 'system'"), 'Tema sistema deve continuar resolvido no runtime.');
assert(app.includes("window.matchMedia('(prefers-color-scheme: dark)'"), 'Tema sistema deve observar prefers-color-scheme.');
assert(app.includes("window.matchMedia('(prefers-contrast: more)'"), 'Tema sistema deve observar prefers-contrast.');
assert(app.includes("window.matchMedia('(forced-colors: active)'"), 'Tema sistema deve observar forced-colors.');
assert(app.includes("document.body.classList.toggle('reduce-motion'"), 'Redução de movimento deve ser aplicada no body.');
assert(app.includes("meta[name=\"theme-color\"]"), 'theme-color deve acompanhar o tema resolvido.');
assert(app.includes("progress.settings.reducedMotion ? 'auto' : 'smooth'"), 'Rolagem deve respeitar redução de movimento.');
assert(app.includes("aria-label=\"Central de estudos\""), 'Botão da Central de estudos deve manter nome acessível.');
assert(app.includes("aria-label=\"Praticar inglês técnico\""), 'Atalho de inglês técnico deve manter nome acessível.');
assert(app.includes("role=\"alert\""), 'Aviso de armazenamento deve continuar anunciado como alerta.');
assert(app.includes("role=\"status\""), 'Estados offline devem continuar anunciados como status.');

assert(settings.includes("['system', 'Sistema']") && settings.includes("['white', 'Branco']") && settings.includes("['contrast', 'Alto contraste']"), 'Preferências devem expor Sistema, Branco e Alto contraste.');
assert(!settings.toLowerCase().includes('café') && !settings.toLowerCase().includes('coffee'), 'Tema café não pode reaparecer na UI de preferências.');
assert(settings.includes('aria-label="Tema de leitura"'), 'Grupo de tema deve ter rótulo acessível.');
assert(settings.includes('aria-pressed={progress.settings.theme === theme}'), 'Botões de tema devem expor estado pressionado.');
assert(settings.includes('aria-label="Tamanho do texto"'), 'Controle de tamanho do texto deve ter rótulo acessível.');
assert(settings.includes('Reduzir movimentos'), 'Preferências devem manter controle de redução de movimento.');
assert(settings.includes('Curso offline e instalável'), 'Preferências devem manter bloco de PWA/offline.');
assert(settings.includes('Backup do seu estudo'), 'Preferências devem manter bloco de backup.');
assert(settings.includes('className="sr-only"'), 'Input de importação deve permanecer visualmente oculto e acessível via controle dedicado.');

assert(studyHub.includes('role="dialog"') && studyHub.includes('aria-modal="true"'), 'Central de estudos deve ser modal acessível.');
assert(studyHub.includes('aria-labelledby="study-hub-title"'), 'Central deve vincular título via aria-labelledby.');
assert(studyHub.includes('role="tablist"') && studyHub.includes('role="tab"'), 'Central deve manter navegação por tabs semânticas.');
assert(studyHub.includes('aria-selected={tab === id}'), 'Tabs da central devem expor aria-selected.');
assert(studyHub.includes("event.key !== 'Tab'") && studyHub.includes('event.shiftKey && document.activeElement === first'), 'Central deve preservar foco preso no modal.');
assert(studyHub.includes("event.key === 'Escape'"), 'Central deve fechar com Escape.');
assert(studyHub.includes('previousFocus?.focus()'), 'Central deve restaurar foco anterior ao fechar.');
assert(studyHub.includes('role="status"'), 'Mensagens da central devem ser anunciadas como status.');

assert(markdownNotes.includes('aria-label="Visualização da anotação"'), 'Editor Markdown deve rotular seletor de visualização.');
assert(markdownNotes.includes('aria-label="Formatação Markdown"'), 'Editor Markdown deve rotular toolbar.');
assert(markdownNotes.includes('aria-label="Anotação em Markdown"'), 'Textarea Markdown deve ter nome acessível.');
for (const marker of ['Negrito', 'Código', 'Título', 'Lista', 'Tarefa', 'Bloco Java', '<blockquote', 'note-task', 'code-block']) {
  assert(markdownNotes.includes(marker), `Editor Markdown perdeu suporte/controle: ${marker}.`);
}

for (const marker of [
  'button:focus-visible',
  'input:focus-visible',
  'summary:focus-visible',
  '.skip-link:focus',
  '.reduce-motion',
  '[data-theme="contrast"]',
  '[data-theme="white"]',
  '@media (max-width:',
  'overflow-x: auto'
]) {
  assert(styles.includes(marker), `CSS perdeu contrato visual/acessível: ${marker}.`);
}
assert(!styles.toLowerCase().includes('coffee'), 'CSS não pode conter tema coffee.');

assert(accessibilityTest.includes('axe.run'), 'Teste de acessibilidade deve executar axe.');
assert(accessibilityTest.includes('has no automatically detectable accessibility violations'), 'Teste axe principal ausente.');
assert(accessibilityTest.includes('keeps the open study hub free'), 'Teste axe da central aberta ausente.');
assert(accessibilityTest.includes("'color-contrast': { enabled: false }"), 'Teste axe deve documentar que contraste é coberto pelo contrato de CSS/tokens.');

assert(e2e.includes('página principal não possui violações críticas de acessibilidade'), 'E2E deve manter auditoria axe crítica no browser.');
assert(e2e.includes('navegação mobile, temas, inglês e manifesto continuam funcionais'), 'E2E deve cobrir mobile/tema/inglês/manifesto.');
assert(e2e.includes('{ width: 360, height: 800 }'), 'E2E deve cobrir viewport móvel estreita.');
assert(e2e.includes('{ width: 1440, height: 900 }'), 'E2E deve cobrir desktop.');
assert(e2e.includes('expectNoGlobalOverflow'), 'E2E deve verificar overflow global.');
assert(e2e.includes("toHaveAttribute('data-theme', 'white')"), 'E2E deve verificar tema branco.');
assert(e2e.includes("toHaveAttribute('data-theme', 'contrast')"), 'E2E deve verificar alto contraste.');
assert(e2e.includes("link[rel=\"manifest\"]"), 'E2E deve verificar manifesto PWA.');

assert(packageJson.scripts['validate:ui'] === 'node scripts/validate-ui-accessibility-contract.mjs', 'Script validate:ui ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:ui'), 'npm run validate deve executar o gate de UI/acessibilidade.');
assert(readme.includes('npm run validate:ui'), 'README deve documentar o gate de UI/acessibilidade.');
assert(readme.includes('phase-24-ui-accessibility-contract.md'), 'README deve apontar para o relatório da fase 24.');
assert(progressDoc.includes('A Fase 24 adiciona o gate de UI/acessibilidade'), 'Progresso interno não preserva o registro histórico da Fase 24.');
assert(progressDoc.includes('A Fase 25 adiciona o gate das ferramentas de estudo'), 'Progresso interno não preserva o histórico da Fase 25 após a Fase 24.');
assert(progressDoc.includes('A Fase 26 adiciona o gate de integridade do catálogo e offline'), 'Progresso interno não preserva o histórico da Fase 26 após a Fase 25.');
assert(progressDoc.includes('A Fase 27 adiciona o gate de integridade das avaliações'), 'Progresso interno não preserva o histórico da Fase 27 após a Fase 26.');
assert(progressDoc.includes('Fase 28 de Integridade dos Recursos'), 'Progresso interno não registra a fase atual após a Fase 27.');
await access('docs/internal/master-audit/phase-24-ui-accessibility-contract.md');

console.log('OK: contrato de UI/acessibilidade protegido — tema, foco, modal, Markdown, axe e E2E coerentes.');
