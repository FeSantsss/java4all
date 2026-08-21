import { IDBFactory } from 'fake-indexeddb';
import { loadProgress } from '@/progress/repository';

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result), { once: true });
    request.addEventListener('error', () => reject(request.error), { once: true });
  });
}

async function seedLegacyProgress(value: unknown) {
  const request = indexedDB.open('stack-completa-java', 1);
  request.addEventListener('upgradeneeded', () => request.result.createObjectStore('course-state'));
  const database = await requestResult(request);
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction('course-state', 'readwrite');
    transaction.objectStore('course-state').put(value, 'current');
    transaction.addEventListener('complete', () => resolve(), { once: true });
    transaction.addEventListener('error', () => reject(transaction.error), { once: true });
  });
  database.close();
}

describe('progress repository compatibility', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: new IDBFactory() });
    window.localStorage?.clear();
  });

  it('discovers and migrates the real legacy IndexedDB when the new database is empty', async () => {
    await seedLegacyProgress({
      version: 9,
      completed: { intro: true },
      notes: { intro: 'Nota vinda do IndexedDB antigo' },
      quizAnswers: { 'intro:0': { selected: 2, correct: false } },
      checklists: { intro: { 0: true } },
      review: { intro: { due: '2026-08-25', interval: 3, reviews: 2, ease: 2.4, mastery: 1 } },
      activity: { '2026-08-20': { minutes: 25, quizzes: 1 } },
      lastChapter: 'intro'
    });

    const progress = await loadProgress();

    expect(progress.migratedFrom).toBe(9);
    expect(progress.completed.intro).toBeTruthy();
    expect(progress.notes.intro).toBe('Nota vinda do IndexedDB antigo');
    expect(progress.quizAnswers['intro:0']).toBe('intro:0:option:2');
    expect(progress.checklists['intro-checklist-0']).toBe(true);
    expect(progress.review.intro).toMatchObject({ intervalDays: 3, attempts: 2, ease: 2.4, mastery: 1 });
    expect(progress.activity['2026-08-20']).toMatchObject({ minutes: 25, quizzes: 1 });
    expect(progress.lastChapter).toBe('intro');
  });
});
