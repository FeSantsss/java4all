import { access, readFile, readdir } from 'node:fs/promises';

const generated = JSON.parse(await readFile('platform/src/content/generated-course.json', 'utf8'));
const requiredSource = await readFile('platform/src/content/required-chapters.ts', 'utf8');
const appSource = await readFile('platform/src/app/App.tsx', 'utf8');
const schemaSource = await readFile('platform/src/content/schema.ts', 'utf8');
const progressSource = await readFile('platform/src/progress/schema.ts', 'utf8');
const overviewSource = await readFile('platform/src/components/study/OverviewPanel.tsx', 'utf8');
const generatorSource = await readFile('scripts/generate-course-content.mjs', 'utf8');
const sourceCatalog = JSON.parse(await readFile('platform/public/content/catalog.json', 'utf8'));
const sourceGlossary = JSON.parse(await readFile('platform/public/content/glossary.json', 'utf8'));
const publicSources = `${await readFile('README.md', 'utf8')}\n${await readFile('platform/index.html', 'utf8')}\n${await readFile('platform/public/manifest.webmanifest', 'utf8')}\n${overviewSource}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const legacyChapterCount = generated.chapters.length;
assert(generated.source.chapters === legacyChapterCount, `A migração diverge da contagem de ${legacyChapterCount} capítulos legados.`);
assert(sourceCatalog.chapters.length === legacyChapterCount, `O catálogo separado diverge da contagem de ${legacyChapterCount} capítulos.`);
assert(sourceGlossary.length === 111 && generated.glossary.length === 111, 'As 111 definições do glossário devem chegar ao React.');
assert((await readdir('platform/public/content/chapters')).filter(file => file.endsWith('.html')).length === legacyChapterCount, 'Cada capítulo legado deve possuir seu próprio HTML.');
assert(!generatorSource.includes("readFile(resolve(root, 'index.html')") && !generatorSource.includes('curriculum-v2.js'), 'O gerador voltou a depender do monólito legado.');
assert(generated.modules.length === 20, 'A arquitetura deve possuir 20 módulos pedagógicos.');
assert(new Set(generated.chapters.map(chapter => chapter.id)).size === legacyChapterCount, 'Há IDs legados duplicados.');

const blocks = generated.chapters.flatMap(chapter => chapter.blocks);
const quizzes = blocks.filter(block => block.type === 'quiz');
const generatedConceptChecks = quizzes.filter(quiz => quiz.id.includes('-concept-check-'));
const exercises = blocks.filter(block => block.type === 'exercise');
const checklists = blocks.filter(block => block.type === 'checklist');
assert(generated.chapters.every(chapter => chapter.blocks.some(block => block.type === 'quiz')), 'Todo capítulo legado precisa de avaliação conceitual.');
assert(quizzes.length >= 150, 'O inventário de quizzes legados ficou abaixo do baseline de compatibilidade.');
assert(quizzes.every(quiz => quiz.prompt && quiz.options.length >= 3), 'Todo quiz precisa de enunciado e pelo menos três alternativas.');
assert(quizzes.every(quiz => quiz.options.filter(option => option.correct).length === 1), 'Todo quiz precisa de exatamente uma resposta correta.');
assert(quizzes.every(quiz => new Set(quiz.options.map(option => option.label)).size === quiz.options.length), 'Quizzes não podem repetir alternativas.');
assert(generatedConceptChecks.every(quiz => quiz.options.every(option => option.label.length <= 260)), 'Alternativas geradas não podem virar blocos de conteúdo truncados.');
assert(generatedConceptChecks.every(quiz => quiz.options.every(option => !/[┌┐└┘├┤┬┴┼─│▼▲]/.test(option.label))), 'Diagramas não podem ser convertidos em alternativas de quiz.');
assert(exercises.length >= 134, 'Exercícios foram perdidos durante a migração.');
assert(generated.chapters.every(chapter => chapter.resources.length >= 2), 'Todo capítulo deve possuir documentação e recurso complementar.');
assert(generated.chapters.every(chapter => chapter.englishActivity?.prompt), 'Todo capítulo deve integrar inglês técnico contextual.');

const requiredTerms = [
  'associacoes-cardinalidade', 'jdbc-under-the-hood', 'java-httpclient-json', 'pure-java-api-project',
  'process-api-cli', 'zenith-cli-inicial', 'ProcessBuilder', 'stdout', 'stderr', 'exit code',
  'lanterna-tui', 'aws-sns-sqs', 'delivery-failure-lab', 'outbox-inbox', 'saga-schema-ordering',
  'async-integration-tests', 'HttpClient', 'visibility timeout', 'DLQ', 'redrive', 'LocalStack',
  'Awaitility', 'Transactional Outbox', 'Inbox', 'Saga', 'SNS + SQS', 'Lanterna'
];
for (const term of requiredTerms) assert(requiredSource.toLocaleLowerCase('pt-BR').includes(term.toLocaleLowerCase('pt-BR')), `Cobertura obrigatória ausente: ${term}`);

const requiredIds = [...requiredSource.matchAll(/\n\s*id: '([^']+)', moduleId:/g)].map(match => match[1]);
assert(requiredIds.length === 23 && new Set(requiredIds).size === 23, 'A trilha estruturada deve possuir 23 capítulos adicionais únicos.');
assert(/PROGRESS_VERSION = 11/.test(progressSource), 'O progresso React deve permanecer explicitamente versionado.');
assert(/parseBackup/.test(progressSource) && /migrateProgress/.test(progressSource), 'Migração e validação de backup são obrigatórias.');
assert(/type: 'project'/.test(schemaSource) && /type: 'quiz'/.test(schemaSource) && /Resource/.test(schemaSource), 'O schema perdeu entidades pedagógicas estruturadas.');
assert(/useProgress/.test(appSource) && /StudyHub/.test(appSource), 'A aplicação deve usar o domínio de progresso e a central de estudos.');
assert(!publicSources.includes('Stack Completa'), 'A identidade pública antiga reapareceu.');
assert(!publicSources.includes('Stack completa'), 'A identidade pública antiga reapareceu em uma variação de capitalização.');
assert(publicSources.includes('java4br') && publicSources.includes('inglês técnico'), 'Identidade ou inglês técnico não estão apresentados publicamente.');

for (const path of ['dist/index.html', 'dist/course-content.json', 'dist/manifest.webmanifest', 'dist/icon.svg', 'dist/sw.js', 'dist/content/catalog.json', 'dist/content/glossary.json', 'dist/content/chapters/intro.html', 'dist/content/chapters/quiz.html']) {
  await access(path);
}
const serviceWorker = await readFile('dist/sw.js', 'utf8');
assert(serviceWorker.includes('course-content.json'), 'O conteúdo do curso não está no precache offline.');
assert(serviceWorker.includes('content/chapters/intro.html') && serviceWorker.includes('content/chapters/quiz.html'), 'Os capítulos HTML separados não estão no precache offline.');
assert(serviceWorker.includes('java4br-platform-v2'), 'O service worker perdeu a identidade/versionamento do cache.');

const urls = new Set([
  ...generated.chapters.flatMap(chapter => chapter.resources.map(resource => resource.url)),
  ...[...requiredSource.matchAll(/'https:\/\/[^']+'/g)].map(match => match[0].slice(1, -1))
]);
for (const value of urls) {
  const url = new URL(value);
  assert(url.protocol === 'https:', `Recurso externo sem HTTPS: ${value}`);
}

console.log(`OK: plataforma com 128 capítulos migrados + 23 estruturados, ${quizzes.length} quizzes legados inventariados, ${exercises.length} exercícios legados tipados, ${checklists.length} checklists e ${urls.size} URLs únicas.`);
