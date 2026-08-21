import { requiredChapters } from '@/content/required-chapters';
import type { Chapter, Course, CourseModule, GlossaryEntry } from '@/content/schema';

export interface GeneratedCourseData {
  modules: CourseModule[];
  chapters: Chapter[];
  glossary: GlossaryEntry[];
}

export function assembleCourse(generatedCourse: GeneratedCourseData): Course {
  const chapters = [...generatedCourse.chapters, ...requiredChapters];
  const modules = generatedCourse.modules.map(module => ({
    ...module,
    chapterIds: chapters.filter(chapter => chapter.moduleId === module.id).map(chapter => chapter.id)
  }));

  return {
    id: 'java4br',
    contentVersion: 2,
    title: 'java4br',
    description: 'Java e backend por fundamentos, projetos acumulativos e inglês técnico integrado.',
    modules,
    chapters,
    glossary: generatedCourse.glossary
  };
}

export async function loadCourse(): Promise<Course> {
  const response = await fetch(`${import.meta.env.BASE_URL}course-content.json`);
  if (!response.ok) throw new Error(`Falha ao carregar o conteúdo do curso (${response.status}).`);
  return assembleCourse(await response.json() as GeneratedCourseData);
}
