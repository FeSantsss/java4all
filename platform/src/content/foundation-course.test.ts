import generatedCourse from '@/content/generated-course.json';
import { requiredChapters } from '@/content/required-chapters';
import { assembleCourse, type GeneratedCourseData } from '@/content/course';

const course = assembleCourse(generatedCourse as GeneratedCourseData);

describe('complete course content', () => {
  it('preserves every legacy chapter and resolves all references', () => {
    const chapterIds = new Set(course.chapters.map(chapter => chapter.id));

    // Contagem derivada, não hardcoded: o total de capítulos cresce
    // legitimamente conforme a reconstrução editorial adiciona capítulos
    // (ex.: terminal-shell-fundamentos). O que este teste protege é que
    // NENHUM capítulo legado ou estruturado se perde, não um número fixo.
    expect(course.chapters).toHaveLength(generatedCourse.chapters.length + requiredChapters.length);
    expect(chapterIds.size).toBe(course.chapters.length);
    expect(course.modules).toHaveLength(20);
    for (const chapter of course.chapters) {
      expect(chapter.prerequisiteChapterIds.every(id => chapterIds.has(id))).toBe(true);
      expect(chapter.blocks.length).toBeGreaterThan(0);
      expect(chapter.resources.length).toBeGreaterThanOrEqual(2);
      expect(chapter.englishActivity.prompt).toBeTruthy();
    }
  });

  it('contains the mandatory API, beyond-CRUD and EDA learning paths', () => {
    const requiredIds = [
      'associacoes-cardinalidade', 'jdbc-under-the-hood', 'java-httpclient-json',
      'pure-java-api-project', 'process-api-cli', 'zenith-cli-inicial',
      'tcp-protocol-design', 'lanterna-tui', 'aws-sns-sqs', 'delivery-failure-lab',
      'outbox-inbox', 'saga-schema-ordering', 'async-integration-tests'
    ];

    for (const id of requiredIds) expect(course.chapters.find(chapter => chapter.id === id)).toBeDefined();
  });

  it('assesses every concept in the structured chapters', () => {
    // Os capítulos estruturados (required-chapters.ts) são identificados pelo
    // próprio conjunto de IDs, não por uma posição fixa no array combinado --
    // a contagem de capítulos legados cresce conforme a reconstrução editorial
    // adiciona capítulos (ex.: terminal-shell-fundamentos).
    const structuredIds = new Set(requiredChapters.map(chapter => chapter.id));
    const structured = course.chapters.filter(chapter => structuredIds.has(chapter.id));
    for (const chapter of structured) {
      const quizzes = chapter.blocks.filter(block => block.type === 'quiz');
      const assessedConcepts = new Set(quizzes.map(quiz => quiz.conceptId));
      expect(quizzes.length).toBeGreaterThanOrEqual(chapter.conceptIds.length);
      expect(chapter.conceptIds.every(conceptId => assessedConcepts.has(conceptId))).toBe(true);
      for (const quiz of quizzes) {
        expect(quiz.options).toHaveLength(3);
        expect(quiz.options.filter(option => option.correct)).toHaveLength(1);
      }
    }
  });

  it('integrates contextual English without translation exercises', () => {
    const requiredFields = [
      'codeContext', 'readPassage', 'comprehensionQuestion', 'contextSupport',
      'documentationTask', 'productionTask', 'successCriterion'
    ] as const;
    const levels = new Set<number>();

    for (const chapter of course.chapters) {
      levels.add(chapter.englishActivity.level);
      for (const field of requiredFields) expect(chapter.englishActivity[field].trim().length).toBeGreaterThan(7);
      expect(`${chapter.englishActivity.comprehensionQuestion} ${chapter.englishActivity.productionTask}`)
        .not.toMatch(/traduz|tradu[cç][aã]o|translate into portuguese/i);
    }

    expect(levels).toEqual(new Set([0, 1, 2, 3]));
  });

  it('provides complete English contracts for advanced structured projects', () => {
    const structuredProjects = course.chapters.slice(128).flatMap(chapter =>
      chapter.blocks.filter(block => block.type === 'project').map(project => ({ chapter, project }))
    );

    expect(structuredProjects.length).toBeGreaterThanOrEqual(10);
    for (const { chapter, project } of structuredProjects) {
      if (chapter.englishLevel < 2) continue;
      expect(project.englishSpecification?.requirements.length).toBeGreaterThanOrEqual(5);
      expect(project.englishSpecification?.acceptanceCriteria.length).toBeGreaterThanOrEqual(4);
      expect(JSON.stringify(project.englishSpecification)).not.toMatch(/\b(?:construa|requisitos|critérios|aplicação|falhas|projeto)\b/i);
    }
  });
});
