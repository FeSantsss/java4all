import { migrateProgress, type ProgressState } from '@/progress/schema';

const DATABASE = 'java4br-course';
const STORE = 'course-state';
const KEY = 'current';
const LOCAL_KEY = 'java4br:course-state:v1';
const LEGACY_LOCAL_KEY = 'stack-completa:single:v1';
const LEGACY_DATABASE = 'stack-completa-java';

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result), { once: true });
    request.addEventListener('error', () => reject(request.error ?? new Error('Falha no IndexedDB.')), { once: true });
  });
}

async function openDatabase(): Promise<IDBDatabase> {
  const request = indexedDB.open(DATABASE, 1);
  request.addEventListener('upgradeneeded', () => {
    if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
  });
  return requestResult(request);
}

async function readLegacyDatabase(): Promise<unknown> {
  let existing = true;
  if (typeof indexedDB.databases === 'function') {
    try {
      existing = (await indexedDB.databases()).some(database => database.name === LEGACY_DATABASE);
    } catch {
      // Some browsers expose databases() but deny enumeration; opening remains safe.
    }
  }
  if (!existing) return null;
  const request = indexedDB.open(LEGACY_DATABASE);
  const database = await requestResult(request);
  if (!database.objectStoreNames.contains(STORE)) {
    database.close();
    return null;
  }
  const transaction = database.transaction(STORE, 'readonly');
  const value = await requestResult(transaction.objectStore(STORE).get(KEY));
  database.close();
  return value;
}

function localCandidate(): unknown {
  for (const key of [LOCAL_KEY, LEGACY_LOCAL_KEY]) {
    try {
      const value = window.localStorage?.getItem(key);
      if (value) return JSON.parse(value);
    } catch { /* continue to the next compatibility source */ }
  }
  return null;
}

export async function loadProgress(): Promise<ProgressState> {
  try {
    const database = await openDatabase();
    const transaction = database.transaction(STORE, 'readonly');
    const value = await requestResult(transaction.objectStore(STORE).get(KEY));
    database.close();
    return migrateProgress(value ?? await readLegacyDatabase() ?? localCandidate());
  } catch {
    return migrateProgress(localCandidate());
  }
}

export async function saveProgress(progress: ProgressState): Promise<void> {
  try {
    const database = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE, 'readwrite');
      transaction.objectStore(STORE).put(progress, KEY);
      transaction.addEventListener('complete', () => resolve(), { once: true });
      transaction.addEventListener('abort', () => reject(transaction.error), { once: true });
      transaction.addEventListener('error', () => reject(transaction.error), { once: true });
    });
    database.close();
  } catch {
    window.localStorage?.setItem(LOCAL_KEY, JSON.stringify(progress));
  }
}
