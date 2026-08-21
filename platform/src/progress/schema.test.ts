import { createBackup, migrateProgress, parseBackup, PROGRESS_VERSION } from '@/progress/schema';

describe('versioned progress', () => {
  it('migrates the legacy v9 shape without losing learning data', () => {
    const migrated = migrateProgress({
      version: 9,
      completed: { intro: true },
      notes: { intro: 'Minha nota' },
      favorites: { intro: true },
      quizAnswers: { 'intro:0': { selected: 1, correct: true, answeredAt: '2026-08-01T12:00:00.000Z' } },
      checklists: { intro: { 0: true, 1: false } },
      review: { intro: { due: '2026-08-10', interval: 7, ease: 2.6, reviews: 3, mastery: 2 } },
      mastery: { intro: { level: 2 } },
      activity: { '2026-08-01': { minutes: 25, chapters: 1, quizzes: 2, reviews: 1, retrievals: 1, diagnostics: 1 } },
      labs: { intro: 'class Main {}' },
      englishEvidence: { intro: 'The JVM executes bytecode.' },
      reviewPlan: { date: '2026-08-01', choices: { intro: 'deferred' } },
      settings: { theme: 'light', reduceMotion: true, fontScale: 1.1, dailyGoal: 40, focusMode: true, reviewMode: true, noteView: 'preview' },
      lastChapter: 'intro'
    });

    expect(migrated.version).toBe(PROGRESS_VERSION);
    expect(migrated.completed.intro).toBeTruthy();
    expect(migrated.notes.intro).toBe('Minha nota');
    expect(migrated.quizAnswers['intro:0']).toBe('intro:0:option:1');
    expect(migrated.checklists['intro-checklist-0']).toBe(true);
    expect(migrated.checklists['intro-checklist-1']).toBe(false);
    expect(migrated.review.intro).toMatchObject({ intervalDays: 7, attempts: 3, ease: 2.6, mastery: 2 });
    expect(migrated.activity['2026-08-01']).toMatchObject({ minutes: 25, quizzes: 2, diagnostics: 1 });
    expect(migrated.labs.intro).toBe('class Main {}');
    expect(migrated.englishEvidence.intro).toBe('The JVM executes bytecode.');
    expect(migrated.reviewPlan.choices.intro).toBe('deferred');
    expect(migrated.settings).toMatchObject({ theme: 'white', reducedMotion: true, fontScale: 1.1, dailyGoal: 40, focusMode: true, reviewMode: true, noteView: 'preview' });
    expect(migrated.mastery.intro).toEqual({ level: 2 });
    expect(migrated.migratedFrom).toBe(9);
  });

  it('round-trips a complete backup and rejects unrelated JSON', () => {
    const progress = migrateProgress({ completed: { intro: true }, errors: { e1: { note: 'erro' } } });
    expect(parseBackup(createBackup(progress))).toEqual(progress);
    expect(() => parseBackup({ completed: {} })).toThrow(/backup válido/);
  });

  it('imports a known version 9 backup envelope', () => {
    const migrated = parseBackup({
      app: 'Stack Completa Java',
      version: 9,
      data: { completed: { intro: true }, notes: { intro: 'preservada' } }
    });
    expect(migrated.completed.intro).toBeTruthy();
    expect(migrated.notes.intro).toBe('preservada');
  });
});
