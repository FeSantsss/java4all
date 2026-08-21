export const PROGRESS_VERSION = 11;

export interface ProgressSettings {
  theme: 'system' | 'white' | 'contrast';
  reducedMotion: boolean;
  comfortableReading: boolean;
  fontScale: number;
  dailyGoal: number;
  focusMode: boolean;
  reviewMode: boolean;
  noteView: 'edit' | 'split' | 'preview';
}

export interface ActivityRecord {
  minutes: number;
  chapters: number;
  quizzes: number;
  reviews: number;
  retrievals: number;
  diagnostics: number;
}

export interface ReviewRecord {
  dueAt: string;
  intervalDays: number;
  attempts: number;
  ease: number;
  mastery: number;
}

export interface ProgressState {
  version: typeof PROGRESS_VERSION;
  completed: Record<string, string>;
  favorites: Record<string, boolean>;
  notes: Record<string, string>;
  quizAnswers: Record<string, string>;
  checklists: Record<string, boolean>;
  review: Record<string, ReviewRecord>;
  mastery: Record<string, unknown>;
  errors: Record<string, unknown>;
  retrieval: Record<string, unknown>;
  diagnostic: Record<string, unknown>;
  projectReadiness: Record<string, unknown>;
  activity: Record<string, ActivityRecord>;
  labs: Record<string, string>;
  englishEvidence: Record<string, string>;
  reviewPlan: { date: string; choices: Record<string, 'selected' | 'deferred'> };
  settings: ProgressSettings;
  lastChapter: string;
  migratedFrom?: number;
}

export interface ProgressBackup {
  kind: 'java4br-progress-backup';
  schemaVersion: typeof PROGRESS_VERSION;
  courseId: 'java4br';
  exportedAt: string;
  payload: ProgressState;
}

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

const stringRecord = (value: unknown): Record<string, string> => Object.fromEntries(
  Object.entries(record(value)).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
);

const booleanRecord = (value: unknown): Record<string, boolean> => Object.fromEntries(
  Object.entries(record(value)).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean')
);

function checklistRecord(value: unknown): Record<string, boolean> {
  const output: Record<string, boolean> = {};
  for (const [key, entry] of Object.entries(record(value))) {
    if (typeof entry === 'boolean') output[key] = entry;
    else for (const [index, checked] of Object.entries(record(entry))) {
      if (typeof checked === 'boolean') output[`${key}-checklist-${index}`] = checked;
    }
  }
  return output;
}

function quizAnswerRecord(value: unknown): Record<string, string> {
  return Object.fromEntries(Object.entries(record(value)).flatMap(([id, answer]) => {
    if (typeof answer === 'string') return [[id, answer]];
    const legacy = record(answer);
    return Number.isInteger(legacy.selected) ? [[id, `${id}:option:${legacy.selected}`]] : [];
  }));
}

function activityRecord(value: unknown): Record<string, ActivityRecord> {
  return Object.fromEntries(Object.entries(record(value)).map(([date, entry]) => {
    const legacy = record(entry);
    return [date, {
      minutes: typeof legacy.minutes === 'number' ? legacy.minutes : 0,
      chapters: typeof entry === 'number' ? entry : typeof legacy.chapters === 'number' ? legacy.chapters : 0,
      quizzes: typeof legacy.quizzes === 'number' ? legacy.quizzes : 0,
      reviews: typeof legacy.reviews === 'number' ? legacy.reviews : 0,
      retrievals: typeof legacy.retrievals === 'number' ? legacy.retrievals : 0,
      diagnostics: typeof legacy.diagnostics === 'number' ? legacy.diagnostics : 0
    }];
  }));
}

function completedRecord(value: unknown): Record<string, string> {
  const now = new Date().toISOString();
  return Object.fromEntries(Object.entries(record(value)).flatMap(([id, completed]) => {
    if (typeof completed === 'string') return [[id, completed]];
    if (completed === true) return [[id, now]];
    return [];
  }));
}

export function createEmptyProgress(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    completed: {}, favorites: {}, notes: {}, quizAnswers: {}, checklists: {}, review: {},
    mastery: {}, errors: {}, retrieval: {}, diagnostic: {}, projectReadiness: {}, activity: {}, labs: {}, englishEvidence: {},
    reviewPlan: { date: '', choices: {} },
    settings: { theme: 'system', reducedMotion: false, comfortableReading: true, fontScale: 1, dailyGoal: 25, focusMode: false, reviewMode: false, noteView: 'split' },
    lastChapter: ''
  };
}

export function migrateProgress(candidate: unknown): ProgressState {
  const source = record(candidate);
  const empty = createEmptyProgress();
  const sourceVersion = typeof source.version === 'number' ? source.version : 1;
  const rawSettings = record(source.settings);
  const rawReview = record(source.review);
  const review = Object.fromEntries(Object.entries(rawReview).flatMap(([id, value]) => {
    const item = record(value);
    const dueAt = typeof item.dueAt === 'string'
      ? item.dueAt
      : typeof item.due === 'string' ? new Date(`${item.due}T00:00:00`).toISOString() : '';
    if (!dueAt) return [];
    return [[id, {
      dueAt,
      intervalDays: typeof item.intervalDays === 'number' ? item.intervalDays : typeof item.interval === 'number' ? item.interval : 1,
      attempts: typeof item.attempts === 'number' ? item.attempts : typeof item.reviews === 'number' ? item.reviews : 0,
      ease: typeof item.ease === 'number' ? item.ease : 2.5,
      mastery: typeof item.mastery === 'number' ? item.mastery : 0
    }]];
  }));
  const sourceReviewPlan = record(source.reviewPlan);
  const reviewChoices = Object.fromEntries(Object.entries(record(sourceReviewPlan.choices)).filter((entry): entry is [string, 'selected' | 'deferred'] => entry[1] === 'selected' || entry[1] === 'deferred'));

  return {
    ...empty,
    completed: completedRecord(source.completed),
    favorites: booleanRecord(source.favorites),
    notes: stringRecord(source.notes),
    quizAnswers: quizAnswerRecord(source.quizAnswers),
    checklists: checklistRecord(source.checklists),
    review,
    mastery: record(source.mastery),
    errors: record(source.errors),
    retrieval: record(source.retrieval),
    diagnostic: record(source.diagnostic),
    projectReadiness: record(source.projectReadiness),
    activity: activityRecord(source.activity),
    labs: stringRecord(source.labs),
    englishEvidence: stringRecord(source.englishEvidence),
    reviewPlan: { date: typeof sourceReviewPlan.date === 'string' ? sourceReviewPlan.date : '', choices: reviewChoices },
    settings: {
      theme: rawSettings.theme === 'contrast'
        ? 'contrast'
        : rawSettings.theme === 'white' || rawSettings.theme === 'light' ? 'white' : 'system',
      reducedMotion: typeof rawSettings.reducedMotion === 'boolean' ? rawSettings.reducedMotion : typeof rawSettings.reduceMotion === 'boolean' ? rawSettings.reduceMotion : false,
      comfortableReading: typeof rawSettings.comfortableReading === 'boolean' ? rawSettings.comfortableReading : true,
      fontScale: typeof rawSettings.fontScale === 'number' ? rawSettings.fontScale : 1,
      dailyGoal: typeof rawSettings.dailyGoal === 'number' ? rawSettings.dailyGoal : 25,
      focusMode: typeof rawSettings.focusMode === 'boolean' ? rawSettings.focusMode : false,
      reviewMode: typeof rawSettings.reviewMode === 'boolean' ? rawSettings.reviewMode : false,
      noteView: rawSettings.noteView === 'edit' || rawSettings.noteView === 'preview' ? rawSettings.noteView : 'split'
    },
    lastChapter: typeof source.lastChapter === 'string' ? source.lastChapter : '',
    migratedFrom: typeof source.migratedFrom === 'number'
      ? source.migratedFrom
      : sourceVersion < PROGRESS_VERSION ? sourceVersion : undefined
  };
}

export function createBackup(progress: ProgressState): ProgressBackup {
  return {
    kind: 'java4br-progress-backup',
    schemaVersion: PROGRESS_VERSION,
    courseId: 'java4br',
    exportedAt: new Date().toISOString(),
    payload: progress
  };
}

export function parseBackup(value: unknown): ProgressState {
  const backup = record(value);
  if ((backup.app === 'Stack Completa Java' || backup.app === 'java4br') && backup.version === 9 && backup.data) {
    return migrateProgress(backup.data);
  }
  if (backup.kind !== 'java4br-progress-backup' || backup.courseId !== 'java4br') {
    throw new Error('Este arquivo não é um backup válido do java4br.');
  }
  if (typeof backup.schemaVersion !== 'number' || backup.schemaVersion > PROGRESS_VERSION) {
    throw new Error('O backup foi criado por uma versão mais nova e não pode ser importado com segurança.');
  }
  if (!backup.payload || typeof backup.payload !== 'object' || Array.isArray(backup.payload)) {
    throw new Error('O backup não contém um estado de progresso válido.');
  }
  return migrateProgress(backup.payload);
}
