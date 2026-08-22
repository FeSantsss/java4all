import { readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(path) {
  return readFile(path, 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

function assertUnique(values, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  assert(duplicates.size === 0, `${label} contém duplicatas: ${[...duplicates].join(', ')}`);
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const [
  packageJson,
  generatedCourse,
  auditReport,
  schema,
  requiredChapters,
  foundationCourseTest,
  readme,
  progressDoc
] = await Promise.all([
  readJson('package.json'),
  readJson('platform/src/content/generated-course.json'),
  readJson('docs/internal/master-audit/phase-0-inventory.json'),
  readText('platform/src/content/schema.ts'),
  readText('platform/src/content/required-chapters.ts'),
  readText('platform/src/content/foundation-course.test.ts'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md')
]);

assert(auditReport.summary.quizzes === 268, `Baseline final deve manter 268 verificações; encontrado ${auditReport.summary.quizzes}.`);
assert(auditReport.summary.exercises === 160, `Baseline final deve manter 160 exercícios; encontrado ${auditReport.summary.exercises}.`);
assert(auditReport.summary.projects === 23, `Baseline final deve manter 23 projetos; encontrado ${auditReport.summary.projects}.`);
assert(auditReport.summary.chaptersApproved === 151, 'Contrato de avaliação só vale sobre os 151 capítulos aprovados.');
assert(auditReport.summary.chaptersTriagedAsFailed === 0, 'Contrato de avaliação não pode conviver com backlog pedagógico.');

const allBlocks = generatedCourse.chapters.flatMap(chapter =>
  chapter.blocks.map(block => ({ ...block, chapterId: chapter.id, chapterTitle: chapter.title }))
);
const quizzes = allBlocks.filter(block => block.type === 'quiz');
const exercises = allBlocks.filter(block => block.type === 'exercise');
const projects = allBlocks.filter(block => block.type === 'project');

assert(quizzes.length === 157, `Os 128 capítulos legados devem manter 157 quizzes tipados; encontrado ${quizzes.length}.`);
assert(exercises.length === 137, `Os 128 capítulos legados devem manter 137 exercícios tipados; encontrado ${exercises.length}.`);
assert(projects.length === 11, `Os 128 capítulos legados devem manter 11 projetos tipados; encontrado ${projects.length}.`);

for (const chapter of generatedCourse.chapters) {
  assert(chapter.blocks.some(block => block.type === 'quiz'), `Capítulo legado sem quiz: ${chapter.id}`);
}

for (const quiz of quizzes) {
  assert(text(quiz.id), `Quiz sem ID em ${quiz.chapterId}.`);
  assert(text(quiz.prompt).length >= 20, `Quiz ${quiz.id} tem enunciado raso ou ausente.`);
  assert(text(quiz.conceptId), `Quiz ${quiz.id} não aponta para um conceito/rastro de revisão.`);
  assert(Array.isArray(quiz.options) && quiz.options.length >= 3, `Quiz ${quiz.id} precisa ter pelo menos três alternativas.`);
  assert(quiz.options.filter(option => option.correct === true).length === 1, `Quiz ${quiz.id} precisa ter exatamente uma alternativa correta.`);
  assertUnique(quiz.options.map(option => option.id), `Alternativas do quiz ${quiz.id}`);
  assertUnique(quiz.options.map(option => text(option.label).toLocaleLowerCase('pt-BR')), `Textos das alternativas do quiz ${quiz.id}`);
  for (const option of quiz.options) {
    assert(text(option.label).length >= 2, `Quiz ${quiz.id} tem alternativa vazia.`);
    assert(text(option.label).length <= 420, `Quiz ${quiz.id} tem alternativa longa demais para revisão objetiva.`);
    assert(text(option.explanation).length >= 18, `Alternativa ${option.id} do quiz ${quiz.id} não explica o racional.`);
    assert(!/[┌┐└┘├┤┬┴┼─│▼▲]/.test(option.label), `Quiz ${quiz.id} recebeu diagrama como alternativa.`);
  }
}

for (const exercise of exercises) {
  assert(text(exercise.id), `Exercício sem ID em ${exercise.chapterId}.`);
  assert(text(exercise.title).length >= 5, `Exercício ${exercise.id} sem título útil.`);
  assert(text(exercise.prompt).length >= 40, `Exercício ${exercise.id} tem enunciado superficial.`);
  assert(['foundation', 'intermediate', 'advanced'].includes(exercise.difficulty), `Exercício ${exercise.id} tem dificuldade inválida.`);
  assert(Array.isArray(exercise.criteria) && exercise.criteria.length >= 2, `Exercício ${exercise.id} precisa de pelo menos dois critérios de aceite.`);
  for (const criterion of exercise.criteria) {
    assert(text(criterion).length >= 8, `Exercício ${exercise.id} tem critério de aceite raso.`);
  }
}

for (const project of projects) {
  assert(text(project.title).length >= 8, `Projeto ${project.id} sem título útil.`);
  assert(text(project.brief).length >= 30, `Projeto ${project.id} sem briefing suficiente.`);
  assert(['supported', 'guided', 'bounded', 'independent'].includes(project.guidance), `Projeto ${project.id} tem guidance inválido.`);
  assert(project.requirements?.length >= 4, `Projeto ${project.id} precisa de requisitos suficientes.`);
  assert(project.acceptanceCriteria?.length >= 3, `Projeto ${project.id} precisa de critérios de aceite suficientes.`);
  assert(project.knowledgeMatrix?.length >= 2, `Projeto ${project.id} precisa de matriz de conhecimento.`);
  for (const row of project.knowledgeMatrix) {
    assert(text(row.requirement).length >= 3, `Projeto ${project.id} tem requisito vazio na matriz.`);
    assert(row.conceptIds?.length >= 1, `Projeto ${project.id} tem linha da matriz sem conceito.`);
    assert(row.chapterIds?.length >= 1, `Projeto ${project.id} tem linha da matriz sem capítulo.`);
    assert(text(row.expectedEvidence).length >= 20, `Projeto ${project.id} tem evidência esperada superficial.`);
  }
}

for (const chapter of auditReport.chapters) {
  assert(chapter.quizzes > 0, `Capítulo aprovado sem verificação: ${chapter.chapterId}`);
  assert(chapter.exercises > 0 || chapter.projects > 0 || (chapter.blockTypes?.checklist ?? 0) > 0, `Capítulo aprovado sem prática, checklist ou projeto: ${chapter.chapterId}`);
  assert(!chapter.flags.includes('quiz-sem-racional'), `Capítulo ${chapter.chapterId} tem quiz sem racional.`);
  assert(!chapter.flags.includes('exercicio-sem-criterio'), `Capítulo ${chapter.chapterId} tem exercício sem critério.`);
  assert(!chapter.flags.includes('projeto-sem-matriz-de-conhecimento'), `Capítulo ${chapter.chapterId} tem projeto sem matriz.`);
}

for (const marker of [
  "export interface QuizOption",
  "explanation?: string",
  "type: 'quiz'",
  "type: 'exercise'",
  "type: 'project'",
  'knowledgeMatrix',
  'expectedEvidence'
]) {
  assert(schema.includes(marker), `Schema perdeu marcador de avaliação: ${marker}`);
}

for (const marker of [
  'conceptQuizzes',
  'options: [',
  'correct: true',
  'correct: false',
  'explanation:',
  'criteria: input.exercise[2]',
  'acceptanceCriteria: input.project[3]',
  'knowledgeMatrix: input.projectKnowledgeMatrix'
]) {
  assert(requiredChapters.includes(marker), `Gerador dos capítulos estruturados perdeu contrato de avaliação: ${marker}`);
}

for (const marker of [
  "expect(quizzes.length).toBeGreaterThanOrEqual(chapter.conceptIds.length)",
  'expect(quiz.options).toHaveLength(3)',
  'expect(quiz.options.filter(option => option.correct)).toHaveLength(1)',
  'provides complete English contracts for advanced structured projects'
]) {
  assert(foundationCourseTest.includes(marker), `Testes de conteúdo não protegem avaliação estruturada: ${marker}`);
}

assert(packageJson.scripts['validate:assessment'] === 'node scripts/validate-assessment-integrity.mjs', 'Script validate:assessment ausente ou divergente.');
assert(packageJson.scripts.validate.includes('npm run validate:assessment'), 'npm run validate deve executar o gate de avaliação.');
assert(readme.includes('Exercícios, quizzes, checklists e projetos práticos.'), 'README público deve mencionar avaliações e prática.');
assert(progressDoc.includes('A Fase 27 adiciona o gate de integridade das avaliações'), 'Progresso interno não preserva o histórico da Fase 27.');
assert(progressDoc.includes('phase-27-assessment-integrity.md'), 'Progresso interno deve listar o relatório da Fase 27.');
assert(progressDoc.includes('Fase 28 de Integridade dos Recursos'), 'Progresso interno não registra a fase atual após a Fase 27.');

console.log('OK: avaliações protegidas — quizzes, exercícios, projetos, racionais e matrizes de conhecimento coerentes.');
