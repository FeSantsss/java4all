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

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const [
  packageJson,
  generatedCourse,
  readme,
  contentModel,
  progressDoc,
  englishValidator,
  schema,
  progressSchema,
  technicalEnglishLab,
  englishHub,
  app,
  sidebar,
  commandPalette,
  foundationCourseTest
] = await Promise.all([
  readJson('package.json'),
  readJson('platform/src/content/generated-course.json'),
  readText('README.md'),
  readText('docs/internal/content-model.md'),
  readText('docs/internal/implementation-progress.md'),
  readText('scripts/validate-english.mjs'),
  readText('platform/src/content/schema.ts'),
  readText('platform/src/progress/schema.ts'),
  readText('platform/src/components/english/TechnicalEnglishLab.tsx'),
  readText('platform/src/components/english/EnglishHubPanel.tsx'),
  readText('platform/src/app/App.tsx'),
  readText('platform/src/components/course/CourseSidebar.tsx'),
  readText('platform/src/components/navigation/CommandPalette.tsx'),
  readText('platform/src/content/foundation-course.test.ts')
]);

const requiredActivityFields = [
  'label',
  'codeContext',
  'readPassage',
  'comprehensionQuestion',
  'contextSupport',
  'documentationTask',
  'productionTask',
  'successCriterion',
  'instruction',
  'prompt'
];

const expectedLabels = new Map([
  [0, 'Context first'],
  [1, 'Guided reading'],
  [2, 'Applied comprehension'],
  [3, 'Professional use']
]);
const expectedCounts = [24, 41, 45, 19];
const expectedModuleLevels = [
  0, 0, 0,
  1, 1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 2, 2,
  3, 3, 3, 3
];
const levelCounts = [0, 0, 0, 0];

const legacyChapterCount = generatedCourse.chapters.length;
assert(generatedCourse.modules.length === 20, `Contrato de inglês espera 20 módulos; encontrado ${generatedCourse.modules.length}.`);
assert(generatedCourse.modules.every((module, index) => module.englishLevel === expectedModuleLevels[index]), 'Progressão de inglês por módulo mudou sem revisão explícita.');

for (const chapter of generatedCourse.chapters) {
  const activity = chapter.englishActivity;
  assert(activity && typeof activity === 'object', `Capítulo ${chapter.id} perdeu englishActivity.`);
  assert(Number.isInteger(activity.level) && activity.level >= 0 && activity.level <= 3, `Capítulo ${chapter.id} tem nível de inglês inválido.`);
  assert(activity.level === chapter.englishLevel, `Capítulo ${chapter.id} diverge entre englishLevel e englishActivity.level.`);
  assert(activity.label === expectedLabels.get(activity.level), `Capítulo ${chapter.id} tem label incompatível com o nível ${activity.level}.`);
  levelCounts[activity.level] += 1;

  for (const field of requiredActivityFields) {
    assert(clean(activity[field]).length >= 8, `Capítulo ${chapter.id} perdeu campo útil de inglês técnico: ${field}.`);
  }
  assert(activity.instruction === activity.readPassage, `Capítulo ${chapter.id} deve manter instruction como alias compatível de readPassage.`);
  assert(activity.prompt === activity.productionTask, `Capítulo ${chapter.id} deve manter prompt como alias compatível de productionTask.`);
  assert(clean(activity.codeContext).length <= 240, `Capítulo ${chapter.id} usa contexto de código grande demais para prática linguística.`);
  assert(/[A-Za-z0-9_.()[\]{};:=><"'/-]/.test(activity.codeContext), `Capítulo ${chapter.id} não usa pista técnica em codeContext.`);
  assert(!/traduz|tradu[cç][aã]o|translate .*portuguese|what does .+ mean in portuguese/i.test(`${activity.comprehensionQuestion} ${activity.productionTask}`), `Capítulo ${chapter.id} voltou a usar tradução solta.`);

  if (activity.level === 0) {
    assert(/Follow the values|observable result|method/i.test(`${activity.readPassage} ${activity.productionTask} ${activity.successCriterion}`), `Nível 0 de ${chapter.id} deve começar por inferência rasa a partir do código.`);
  }
  if (activity.level === 1) {
    assert(/search query|official reference|one sentence/i.test(`${activity.documentationTask} ${activity.productionTask}`), `Nível 1 de ${chapter.id} deve praticar leitura guiada e busca curta.`);
  }
  if (activity.level === 2) {
    assert(/bug report|failure|contract|evidence/i.test(`${activity.readPassage} ${activity.productionTask} ${activity.successCriterion}`), `Nível 2 de ${chapter.id} deve exigir compreensão aplicada.`);
  }
  if (activity.level === 3) {
    assert(/issue|requirements|constraints|acceptance criteria|trade-offs/i.test(activity.productionTask), `Nível 3 de ${chapter.id} deve produzir artefato técnico profissional em inglês.`);
  }
}

assert(levelCounts.every((count, index) => count === expectedCounts[index]), `Distribuição de níveis mudou: esperado ${expectedCounts.join('/')}, encontrado ${levelCounts.join('/')}.`);

for (const marker of [
  'EnglishActivity',
  'instruction: string',
  'prompt: string',
  'codeContext: string',
  'readPassage: string',
  'productionTask: string',
  'successCriterion: string'
]) {
  assert(schema.includes(marker), `Schema perdeu contrato de EnglishActivity: ${marker}`);
}

for (const marker of [
  'findPortugueseCodeIdentifiers',
  'codeExamples.length < 414',
  'translation exercise is not allowed',
  'advanced English activity still depends on Portuguese',
  'professional activity must produce an English technical artifact'
]) {
  assert(englishValidator.includes(marker), `validate:english perdeu proteção essencial: ${marker}`);
}

for (const marker of [
  'English levels',
  'Level 0 - contextual tokens',
  'Level 1 - short comprehension',
  'Level 2 - applied reading',
  'Level 3 - professional autonomy',
  'Translation questions and isolated vocabulary lists are invalid',
  'Guidance and English exposure progress monotonically at module level'
]) {
  assert(contentModel.includes(marker), `Modelo de conteúdo perdeu regra de inglês técnico: ${marker}`);
}

for (const marker of [
  'englishEvidence: Record<string, string>',
  'englishEvidence: {}',
  'englishEvidence: stringRecord(source.englishEvidence)',
  "kind: 'java4br-progress-backup'"
]) {
  assert(progressSchema.includes(marker), `Persistência perdeu evidência de inglês técnico: ${marker}`);
}

for (const marker of [
  'Meaning first.',
  'Code as language context',
  'Evidence in English',
  'Success check:',
  'Salvo automaticamente neste navegador e incluído no backup.'
]) {
  assert(technicalEnglishLab.includes(marker), `Laboratório de inglês perdeu UX contextual: ${marker}`);
}

for (const marker of [
  'English for developers',
  'Contexto antes de tradução',
  'evidências salvas',
  'Level {item.level}',
  'chapters.filter(chapter => chapter.englishLevel >= active.englishLevel)'
]) {
  assert(englishHub.includes(marker), `Central de inglês perdeu roadmap/evidência: ${marker}`);
}

for (const marker of [
  "openHub('english')",
  'aria-label=\"Praticar inglês técnico\"',
  'englishEvidence={progress.englishEvidence[activeChapter.id] ??',
  'onEnglishEvidenceChange',
  'englishEvidence: { ...current.englishEvidence'
]) {
  assert(app.includes(marker), `App perdeu integração de inglês técnico: ${marker}`);
}

assert(sidebar.includes("onOpenHub('english')") && sidebar.includes('EN English'), 'Sidebar deve manter atalho para inglês técnico.');
assert(commandPalette.includes("onOpenHub('english')") && commandPalette.includes('Praticar Technical English'), 'Command palette deve manter ação de inglês técnico.');
assert(foundationCourseTest.includes('integrates contextual English without translation exercises'), 'Teste de conteúdo deve cobrir inglês contextual.');
assert(foundationCourseTest.includes('provides complete English contracts for advanced structured projects'), 'Teste de conteúdo deve cobrir contratos profissionais em inglês.');

assert(packageJson.scripts['validate:english'] === 'node scripts/validate-english.mjs', 'Script validate:english ausente ou divergente.');
assert(packageJson.scripts['validate:technical-english'] === 'node scripts/validate-technical-english-contract.mjs', 'Script validate:technical-english ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:english'), 'npm run validate deve executar validate:english.');
assert(packageJson.scripts.validate.includes('npm run validate:technical-english'), 'npm run validate deve executar o contrato de inglês técnico.');
assert(packageJson.scripts.validate.indexOf('npm run validate:english') < packageJson.scripts.validate.indexOf('npm run validate:technical-english'), 'Contrato de inglês técnico deve rodar depois do gate base de inglês.');

for (const marker of [
  'Inglês técnico contextual dentro dos capítulos',
  'O que você vai estudar'
]) {
  assert(readme.includes(marker), `README perdeu documentação de inglês técnico: ${marker}`);
}

for (const marker of [
  'Fase 29 de Inglês Técnico Contextual',
  'A Fase 29 adiciona o gate de contrato de inglês técnico contextual',
  'phase-29-technical-english-contract.md',
  `${legacyChapterCount} atividades contextuais de inglês técnico`
]) {
  assert(progressDoc.includes(marker), `Progresso interno perdeu marcador da Fase 29: ${marker}`);
}
await access('docs/internal/master-audit/phase-29-technical-english-contract.md');

console.log(`OK: inglês técnico contextual protegido — ${legacyChapterCount} atividades, níveis ${levelCounts.join('/')}, roadmap, evidência persistida e sem tradução solta.`);
