export type EnglishLevel = 0 | 1 | 2 | 3;
export type ProjectGuidance = 'supported' | 'guided' | 'bounded' | 'independent';

export interface Course {
  id: string;
  contentVersion: number;
  title: string;
  description: string;
  modules: CourseModule[];
  chapters: Chapter[];
  glossary: GlossaryEntry[];
}

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  chapterId: string;
  aliases: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  summary: string;
  order: number;
  prerequisiteModuleIds: string[];
  chapterIds: string[];
  englishLevel: EnglishLevel;
  projectGuidance: ProjectGuidance;
}

export interface Chapter {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  summary: string;
  objectives: string[];
  whyItExists: string;
  prerequisiteChapterIds: string[];
  conceptIds: string[];
  estimatedMinutes: number;
  englishLevel: EnglishLevel;
  blocks: ContentBlock[];
  resources: Resource[];
  englishActivity: EnglishActivity;
}

export type ContentBlock =
  | IntuitionBlock
  | ConceptBlock
  | CodeBlock
  | PredictionBlock
  | CalloutBlock
  | HtmlBlock
  | QuizBlock
  | ChecklistBlock
  | ExerciseBlock
  | ProjectBlock;

interface BaseBlock {
  id: string;
  sourceIndex?: number;
  sourceIndexes?: number[];
  fidelityText?: string;
}

export interface IntuitionBlock extends BaseBlock {
  type: 'intuition';
  title: string;
  body: string;
  analogyLimit?: string;
}

export interface ConceptBlock extends BaseBlock {
  type: 'concept';
  title: string;
  body: string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  source: string;
  highlightedHtml?: string;
  caption: string;
  expectedOutput?: string;
}

export interface PredictionBlock extends BaseBlock {
  type: 'prediction';
  prompt: string;
  answer: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  tone: 'note' | 'warning' | 'security' | 'domain';
  title: string;
  body: string;
}

export interface HtmlBlock extends BaseBlock {
  type: 'html';
  html: string;
}

export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
  explanation?: string;
}

export interface QuizBlock extends BaseBlock {
  type: 'quiz';
  conceptId: string;
  prompt: string;
  options: QuizOption[];
}

export interface ExerciseBlock extends BaseBlock {
  type: 'exercise';
  title: string;
  prompt: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  criteria: string[];
  sourceHtml?: string;
}

export interface ChecklistBlock extends BaseBlock {
  type: 'checklist';
  title: string;
  items: Array<{ id: string; label: string }>;
}

export interface ProjectBlock extends BaseBlock {
  type: 'project';
  title: string;
  brief: string;
  requirements: string[];
  guidance: ProjectGuidance;
  acceptanceCriteria: string[];
  englishSpecification?: {
    title: string;
    brief: string;
    requirements: string[];
    acceptanceCriteria: string[];
  };
}

export interface Resource {
  id: string;
  type: 'official-docs' | 'video' | 'guide' | 'reference';
  title: string;
  url: string;
  reinforces: string;
  language: 'pt-BR' | 'en';
}

export interface EnglishActivity {
  level: EnglishLevel;
  label: string;
  instruction: string;
  prompt: string;
  codeContext: string;
  readPassage: string;
  comprehensionQuestion: string;
  contextSupport: string;
  documentationTask: string;
  productionTask: string;
  successCriterion: string;
}
