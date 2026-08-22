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
  workflow,
  viteConfig,
  manifest,
  serviceWorkerSource,
  builtServiceWorker,
  builtIndex,
  readme,
  progressDoc
] = await Promise.all([
  readJson('package.json'),
  readText('.github/workflows/deploy-pages.yml'),
  readText('vite.config.mts'),
  readJson('platform/public/manifest.webmanifest'),
  readText('scripts/generate-service-worker.mjs'),
  readText('dist/sw.js'),
  readText('dist/index.html'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md')
]);

assert(packageJson.engines?.node === '>=22.22.2', 'package.json deve fixar o requisito Node >=22.22.2.');
assert(workflow.includes('name: Deploy java4br'), 'Workflow de Pages sem identidade java4br.');
assert(workflow.includes('branches: [main]'), 'Workflow de Pages deve publicar a partir da branch main.');
assert(workflow.includes('workflow_dispatch:'), 'Workflow de Pages deve permitir execução manual.');
assert(workflow.includes('contents: read'), 'Workflow de Pages deve limitar permissão contents a read.');
assert(workflow.includes('pages: write'), 'Workflow de Pages precisa de permissão pages: write.');
assert(workflow.includes('id-token: write'), 'Workflow de Pages precisa de id-token: write.');
assert(workflow.includes('concurrency:'), 'Workflow de Pages deve ter concorrência configurada.');
assert(workflow.includes('cancel-in-progress: true'), 'Workflow de Pages deve cancelar deploys antigos em andamento.');
assert(workflow.includes('node-version: 22.22.2'), 'Workflow de Pages deve usar o mesmo Node documentado.');
assert(workflow.includes('cache: npm'), 'Workflow de Pages deve usar cache npm.');
assert(workflow.includes('npm ci'), 'Workflow de Pages deve instalar dependências de forma reprodutível.');
assert(workflow.includes('npx playwright install --with-deps chromium'), 'Workflow de Pages deve instalar Chromium para E2E.');
assert(workflow.includes('npm run validate'), 'Workflow de Pages deve executar a esteira completa antes do deploy.');
assert(workflow.includes('actions/configure-pages@v5'), 'Workflow de Pages deve configurar GitHub Pages.');
assert(workflow.includes('actions/upload-pages-artifact@v3'), 'Workflow de Pages deve subir o artefato de Pages.');
assert(workflow.includes('path: dist'), 'Workflow de Pages deve publicar exatamente o diretório dist.');
assert(workflow.includes('actions/deploy-pages@v4'), 'Workflow de Pages deve usar deploy-pages.');

assert(viteConfig.includes("root: fileURLToPath(new URL('./platform', import.meta.url))"), 'Vite deve manter platform/ como raiz.');
assert(viteConfig.includes("base: './'"), 'Vite deve usar base relativa para GitHub Pages.');
assert(viteConfig.includes("outDir: fileURLToPath(new URL('./dist', import.meta.url))"), 'Build deve sair em dist/.');
assert(viteConfig.includes('emptyOutDir: true'), 'Build deve limpar dist antes de gerar novo artefato.');

assert(manifest.name.includes('java4br'), 'Manifest PWA sem identidade java4br.');
assert(manifest.lang === 'pt-BR', 'Manifest deve declarar pt-BR.');
assert(manifest.start_url === './', 'Manifest deve usar start_url relativo.');
assert(manifest.scope === './', 'Manifest deve usar scope relativo.');
assert(manifest.display === 'standalone', 'Manifest deve ser instalável como standalone.');
assert(manifest.icons?.some(icon => icon.src === './icon.svg' && icon.purpose.includes('maskable')), 'Manifest deve declarar ícone maskable.');

assert(serviceWorkerSource.includes("const cacheName = 'java4br-platform-v2'"), 'Gerador do service worker perdeu o cache versionado.');
assert(serviceWorkerSource.includes("key.startsWith('java4br-')"), 'Service worker deve limpar caches java4br antigos.');
assert(serviceWorkerSource.includes("event.data?.type === 'CACHE_COURSE'"), 'Service worker deve manter comando explícito de cache offline.');
assert(builtServiceWorker.includes('java4br-platform-v2'), 'Service worker gerado perdeu o cache versionado.');
assert(builtServiceWorker.includes('./course-content.json'), 'Service worker gerado deve precachear course-content.json.');
assert(builtServiceWorker.includes('./content/catalog.json'), 'Service worker gerado deve precachear catalog.json.');
assert(builtServiceWorker.includes('./content/glossary.json'), 'Service worker gerado deve precachear glossary.json.');
assert(builtServiceWorker.includes('./content/chapters/intro.html'), 'Service worker gerado deve precachear capítulos HTML.');
assert(builtServiceWorker.includes('./content/chapters/quiz.html'), 'Service worker gerado deve precachear o capítulo final.');

assert(builtIndex.includes('./manifest.webmanifest'), 'index.html gerado deve apontar para manifest relativo.');
assert(builtIndex.includes('type="module"'), 'index.html gerado deve carregar bundle como módulo.');

for (const path of [
  'dist/index.html',
  'dist/manifest.webmanifest',
  'dist/icon.svg',
  'dist/sw.js',
  'dist/course-content.json',
  'dist/content/catalog.json',
  'dist/content/glossary.json',
  'dist/content/chapters/intro.html',
  'dist/content/chapters/quiz.html'
]) {
  await access(path);
}

assert(readme.includes('[Acessar o curso]'), 'README público deve manter link do curso.');
assert(progressDoc.includes('A Fase 21 adiciona o gate de deploy/PWA'), 'Progresso interno deve documentar o gate de prontidão de deploy.');
assert(progressDoc.includes('phase-21-deployment-readiness.md'), 'Progresso interno deve apontar para o relatório da Fase 21.');

console.log('OK: deploy GitHub Pages/PWA pronto — workflow, Vite, dist, manifest e service worker coerentes.');
