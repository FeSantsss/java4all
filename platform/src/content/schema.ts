export type EnglishLevel = 0 | 1 | 2 | 3;
export type ProjectGuidance = 'supported' | 'guided' | 'bounded' | 'independent';
export type PedagogicalStatus = 'pending' | 'in-review' | 'needs-revision' | 'approved';
export type Authorship = 'authored' | 'legacy-preserved' | 'generated-compatibility';

export interface PedagogicalAudit {
  status: PedagogicalStatus;
  sourceKind: 'legacy-html' | 'structured-typescript';
  reviewedAt?: string;
  notes?: string[];
}

/**
 * Camada de evidência editorial, INDEPENDENTE de `PedagogicalAudit.status`.
 *
 * `audit.status === 'approved'` é autodeclarado pelo autor do capítulo; a
 * auditoria automática (scripts/audit-master-course.mjs) só o invalida se
 * encontrar flags estruturais (falta quiz, pré-requisito futuro etc.), nunca
 * avalia se o conteúdo de fato ensina os tópicos que promete. Isso cria risco
 * de autoaprovação circular: um capítulo raso pode se declarar "approved" e
 * passar sem que ninguém tenha comparado o corpo do texto ao que o título e o
 * tempo estimado prometem.
 *
 * `EditorialReview` existe para registrar essa comparação explicitamente:
 * quais subtemas o capítulo PRECISA ensinar (`requiredTopics`), e para cada um,
 * quais blocos de conteúdo (`ContentBlock.id`) de fato o ensinam
 * (`evidenceBlocks`). Ver docs/internal/content-rewrite/editorial-contract.md.
 *
 * IMPORTANTE: esta estrutura dá RASTREABILIDADE, não QUALIDADE. Um gate pode
 * confirmar que todo `requiredTopics` aponta para algum bloco real (evita
 * "tópico fantasma"), mas não pode confirmar que a explicação está correta,
 * profunda ou pedagogicamente boa — isso continua exigindo revisão humana.
 */
export interface EditorialReview {
  /** Subtemas que este capítulo se compromete a ensinar (não só mencionar). */
  requiredTopics: string[];
  /** Para cada tópico obrigatório, os IDs de ContentBlock que o ensinam de fato. */
  evidenceBlocks: Record<string, string[]>;
  /** Fontes primárias consultadas para verificar as afirmações técnicas do capítulo. */
  primarySources: string[];
  /** ISO date da última revisão factual (afirmações técnicas conferidas contra fonte primária). */
  factualReviewedAt?: string;
  /** ISO date da última revisão pedagógica (progressão, densidade, exemplos, exercícios). */
  pedagogicalReviewedAt?: string;
  /** Pendências reais e conhecidas -- um array vazio é a única condição que conta como "sem pendências". */
  openIssues: string[];
}

export interface Course {
  id: string;
  contentVersion: number;
  title: string;
  description: string;
  modules: CourseModule[];
  chapters: Chapter[];
  concepts: Concept[];
  glossary: GlossaryEntry[];
}

export interface Concept {
  id: string;
  name: string;
  aliases: string[];
  introducedIn: string;
  reinforcedIn: string[];
  prerequisiteConceptIds: string[];
  commonConfusions: string[];
  outcomes: string[];
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
  /** Candidatos herdados; não significam conceitos pedagogicamente auditados. */
  conceptIds: string[];
  introducedConceptIds: string[];
  usedConceptIds: string[];
  estimatedMinutes: number;
  englishLevel: EnglishLevel;
  blocks: ContentBlock[];
  resources: Resource[];
  englishActivity: EnglishActivity;
  audit: PedagogicalAudit;
  /** Opcional durante a transição -- capítulos sem isso ainda não passaram pela reconstrução editorial. */
  editorialReview?: EditorialReview;
}

export type ContentBlock =
  | IntuitionBlock
  | ConceptBlock
  | MentalModelBlock
  | ComparisonBlock
  | ErrorCaseBlock
  | DiagramBlock
  | TableBlock
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
  authorship?: Authorship;
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

export interface MentalModelBlock extends BaseBlock {
  type: 'mental-model';
  title: string;
  body: string;
  flow?: string[];
  ownership?: string[];
  lifecycle?: string[];
}

export interface ComparisonBlock extends BaseBlock {
  type: 'comparison';
  title: string;
  criteria: string[];
  alternatives: Array<{
    name: string;
    values: string[];
    useWhen: string;
    avoidWhen: string;
  }>;
}

export interface ErrorCaseBlock extends BaseBlock {
  type: 'error-case';
  title: string;
  scenario: string;
  symptom: string;
  cause: string;
  diagnosis: string[];
  correction: string;
  prevention?: string;
}

export interface DiagramBlock extends BaseBlock {
  type: 'diagram';
  title: string;
  description: string;
  steps: string[];
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  title: string;
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  source: string;
  highlightedHtml?: string;
  caption: string;
  expectedOutput?: string;
  explanation?: string[];
  commonMistakes?: string[];
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
  knowledgeMatrix?: Array<{
    requirement: string;
    conceptIds: string[];
    chapterIds: string[];
    expectedEvidence: string;
  }>;
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
  publisher?: string;
  official?: boolean;
  expectedLevel?: 'beginner' | 'intermediate' | 'advanced';
  verifiedAt?: string;
  auditStatus?: 'pending' | 'approved' | 'rejected';
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
