import { useEffect, useState } from 'react';
import { loadProgress, saveProgress } from '@/progress/repository';
import { createEmptyProgress, type ProgressState } from '@/progress/schema';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(createEmptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    let active = true;
    loadProgress()
      .then(value => {
        if (!active) return;
        setProgress(value);
        setLoaded(true);
      })
      .catch(error => {
        if (!active) return;
        setStorageError(error instanceof Error ? error.message : 'Falha ao carregar o progresso.');
        setLoaded(true);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timeout = window.setTimeout(() => {
      saveProgress(progress).catch(error => {
        setStorageError(error instanceof Error ? error.message : 'Falha ao salvar o progresso.');
      });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [loaded, progress]);

  const updateProgress = (updater: (current: ProgressState) => ProgressState) => {
    setProgress(current => updater(current));
  };

  return { progress, setProgress, updateProgress, loaded, storageError };
}
