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
  schema,
  repository,
  useProgress,
  studyHub,
  schemaTest,
  repositoryTest,
  readme,
  progressDoc
] = await Promise.all([
  readJson('package.json'),
  readText('platform/src/progress/schema.ts'),
  readText('platform/src/progress/repository.ts'),
  readText('platform/src/progress/useProgress.ts'),
  readText('platform/src/components/study/StudyHub.tsx'),
  readText('platform/src/progress/schema.test.ts'),
  readText('platform/src/progress/repository.test.ts'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md')
]);

const requiredStateFields = [
  'completed',
  'favorites',
  'notes',
  'quizAnswers',
  'checklists',
  'review',
  'mastery',
  'errors',
  'retrieval',
  'diagnostic',
  'projectReadiness',
  'activity',
  'labs',
  'englishEvidence',
  'reviewPlan',
  'settings',
  'lastChapter'
];

assert(schema.includes('export const PROGRESS_VERSION = 11'), 'Progress schema deve permanecer na versão 11.');
assert(schema.includes("kind: 'java4br-progress-backup'"), 'Envelope de backup java4br ausente.');
assert(schema.includes("courseId: 'java4br'"), 'Backup deve fixar courseId java4br.');
assert(schema.includes('export function createEmptyProgress'), 'createEmptyProgress deve existir.');
assert(schema.includes('export function migrateProgress'), 'migrateProgress deve existir.');
assert(schema.includes('export function createBackup'), 'createBackup deve existir.');
assert(schema.includes('export function parseBackup'), 'parseBackup deve existir.');
assert(schema.includes("backup.app === 'Stack Completa Java'"), 'Importação de envelope legado v9 deve permanecer compatível.');
assert(schema.includes('backup.schemaVersion > PROGRESS_VERSION'), 'Importação deve rejeitar backup de versão futura.');
assert(schema.includes('Este arquivo não é um backup válido do java4br.'), 'Erro de backup inválido deve ser claro para o usuário.');
assert(schema.includes('O backup foi criado por uma versão mais nova'), 'Erro de backup futuro deve ser claro para o usuário.');

for (const field of requiredStateFields) {
  assert(schema.includes(`${field}:`) || schema.includes(`${field}?`), `Campo de progresso ausente do schema: ${field}.`);
  assert(schema.includes(`${field}:`) || field === 'settings', `createEmptyProgress/migração não parece cobrir: ${field}.`);
}

for (const theme of ["'system'", "'white'", "'contrast'"]) {
  assert(schema.includes(theme), `Tema persistido obrigatório ausente: ${theme}.`);
}
assert(!schema.includes("'coffee'"), 'Tema café não pode reaparecer no contrato de progresso.');

assert(repository.includes("const DATABASE = 'java4br-course'"), 'IndexedDB principal deve usar java4br-course.');
assert(repository.includes("const STORE = 'course-state'"), 'Object store de progresso deve continuar course-state.');
assert(repository.includes("const KEY = 'current'"), 'Chave principal de progresso deve continuar current.');
assert(repository.includes("const LOCAL_KEY = 'java4br:course-state:v1'"), 'Fallback localStorage java4br ausente.');
assert(repository.includes("const LEGACY_LOCAL_KEY = 'stack-completa:single:v1'"), 'Fallback localStorage legado ausente.');
assert(repository.includes("const LEGACY_DATABASE = 'stack-completa-java'"), 'Migração IndexedDB legada ausente.');
assert(repository.includes('indexedDB.databases'), 'Repositório deve tentar descobrir banco legado sem criar lixo desnecessário.');
assert(repository.includes('return migrateProgress(value ?? await readLegacyDatabase() ?? localCandidate())'), 'Ordem de leitura deve preservar IndexedDB novo, legado e fallback local.');
assert(repository.includes("window.localStorage?.setItem(LOCAL_KEY, JSON.stringify(progress))"), 'saveProgress deve manter fallback localStorage.');
assert(repository.includes('database.close()'), 'Repositório deve fechar conexões IndexedDB.');

assert(useProgress.includes('loadProgress()'), 'Hook de progresso deve carregar o repositório.');
assert(useProgress.includes('saveProgress(progress)'), 'Hook de progresso deve persistir alterações.');
assert(useProgress.includes('createEmptyProgress'), 'Hook de progresso deve ter estado vazio seguro.');

assert(studyHub.includes('JSON.stringify(createBackup(progress), null, 2)'), 'Exportação deve usar createBackup.');
assert(studyHub.includes('java4br-backup-'), 'Arquivo exportado deve usar nome java4br.');
assert(studyHub.includes('parseBackup(JSON.parse(await file.text()))'), 'Importação deve validar via parseBackup.');
assert(studyHub.includes('Importar este backup substituirá os dados atuais'), 'Importação precisa manter confirmação destrutiva.');
assert(studyHub.includes('createEmptyProgress()'), 'Reset deve voltar ao estado vazio versionado.');

assert(schemaTest.includes('migrates the legacy v9 shape'), 'Teste de migração v9 ausente.');
assert(schemaTest.includes('round-trips a complete backup'), 'Teste de round-trip de backup ausente.');
assert(schemaTest.includes('rejects unrelated JSON'), 'Teste de rejeição de JSON não relacionado ausente.');
assert(schemaTest.includes('imports a known version 9 backup envelope'), 'Teste de envelope legado v9 ausente.');
assert(repositoryTest.includes('discovers and migrates the real legacy IndexedDB'), 'Teste de descoberta do IndexedDB legado ausente.');
assert(repositoryTest.includes("new IDBFactory()"), 'Teste de repositório deve usar fake-indexeddb.');

assert(packageJson.scripts['validate:progress'] === 'node scripts/validate-progress-contract.mjs', 'Script validate:progress ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:progress'), 'npm run validate deve executar o gate de progresso.');
assert(readme.includes('Progresso salvo localmente com IndexedDB'), 'README público deve mencionar persistência local.');
assert(progressDoc.includes('A Fase 23 adiciona o gate de contrato de progresso'), 'Progresso interno não preserva o registro histórico da Fase 23.');
assert(progressDoc.includes('phase-23-progress-contract.md'), 'Progresso interno deve apontar para o relatório da fase 23.');
assert(progressDoc.includes('A Fase 24 adiciona o gate de UI/acessibilidade'), 'Progresso interno não preserva o registro histórico da Fase 24.');

await access('docs/internal/master-audit/phase-23-progress-contract.md');

console.log('OK: contrato de progresso protegido — schema v11, IndexedDB, fallback, migração e backup/importação coerentes.');
