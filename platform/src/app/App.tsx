import { startTransition, useDeferredValue, useEffect, useEffectEvent, useState } from 'react';
import { ChapterView } from '@/components/course/ChapterView';
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { StudyHub, type HubTab } from '@/components/study/StudyHub';
import type { Course } from '@/content/schema';
import { useProgress } from '@/progress/useProgress';
import { usePwa } from '@/pwa/usePwa';

interface AppProps {
  course: Course;
}

export function App({ course }: AppProps) {
  const [activeChapterId, setActiveChapterId] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [hubTab, setHubTab] = useState<HubTab>('overview');
  const [commandOpen, setCommandOpen] = useState(false);
  const [practiceOnly, setPracticeOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const deferredSearch = useDeferredValue(search);
  const { progress, setProgress, updateProgress, loaded, storageError } = useProgress();
  const pwa = usePwa();
  const chapterById = new Map(course.chapters.map(chapter => [chapter.id, chapter]));
  const orderedChapters = course.modules.flatMap(module => module.chapterIds).map(id => chapterById.get(id)).filter((chapter): chapter is NonNullable<typeof chapter> => Boolean(chapter));
  const moduleById = new Map(course.modules.map(module => [module.id, module]));
  const hashChapterId = window.location.hash.slice(1);
  const preferredChapterId = activeChapterId
    || (chapterById.has(hashChapterId) ? hashChapterId : '')
    || (loaded && chapterById.has(progress.lastChapter) ? progress.lastChapter : '')
    || orderedChapters[0]?.id
    || '';
  const activeChapterIndex = orderedChapters.findIndex(chapter => chapter.id === preferredChapterId);
  const resolvedChapterIndex = activeChapterIndex >= 0 ? activeChapterIndex : 0;
  const activeChapter = orderedChapters[resolvedChapterIndex];
  const activeModule = activeChapter ? moduleById.get(activeChapter.moduleId) : undefined;
  const completedIds = new Set(Object.keys(progress.completed));
  const favoriteIds = new Set(Object.entries(progress.favorites).filter(([, favorite]) => favorite).map(([id]) => id));
  const completion = orderedChapters.length ? Math.round(completedIds.size / orderedChapters.length * 100) : 0;

  useEffect(() => {
    const ids = new Set(course.chapters.map(chapter => chapter.id));
    const selectFromHash = () => {
      const id = window.location.hash.slice(1);
      if (ids.has(id)) setActiveChapterId(id);
    };
    window.addEventListener('hashchange', selectFromHash);
    return () => window.removeEventListener('hashchange', selectFromHash);
  }, [course]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      document.documentElement.dataset.theme = progress.settings.theme === 'contrast' ? 'contrast' : 'white';
      return;
    }
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const contrast = window.matchMedia('(prefers-contrast: more)');
    const forced = window.matchMedia('(forced-colors: active)');
    const applyTheme = () => {
      const resolved = progress.settings.theme === 'system'
        ? dark.matches || contrast.matches || forced.matches ? 'contrast' : 'white'
        : progress.settings.theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.setProperty('--reader-scale', String(progress.settings.fontScale));
      document.body.classList.toggle('reduce-motion', progress.settings.reducedMotion);
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', resolved === 'contrast' ? '#050505' : '#ffffff');
    };
    applyTheme();
    const queries = [dark, contrast, forced];
    queries.forEach(query => query.addEventListener('change', applyTheme));
    return () => queries.forEach(query => query.removeEventListener('change', applyTheme));
  }, [progress.settings.fontScale, progress.settings.reducedMotion, progress.settings.theme]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.querySelector<HTMLElement>('.chapter-page');
      if (!article) return;
      const start = article.offsetTop;
      const total = Math.max(1, article.scrollHeight - window.innerHeight);
      setReadingProgress(Math.max(0, Math.min(100, (window.scrollY - start) / total * 100)));
    };
    updateReadingProgress();
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      window.removeEventListener('resize', updateReadingProgress);
    };
  }, [activeChapter?.id]);

  const selectChapter = (chapterId: string) => {
    if (!chapterById.has(chapterId)) return;
    startTransition(() => setActiveChapterId(chapterId));
    window.history.replaceState(null, '', `#${chapterId}`);
    updateProgress(current => ({ ...current, lastChapter: chapterId }));
    setSidebarOpen(false);
    setHubOpen(false);
    window.scrollTo({ top: 0, behavior: progress.settings.reducedMotion ? 'auto' : 'smooth' });
  };

  const moveChapter = (offset: number) => {
    const chapter = orderedChapters[resolvedChapterIndex + offset];
    if (chapter) selectChapter(chapter.id);
  };

  const toggleComplete = () => updateProgress(current => {
    if (!activeChapter) return current;
    const completed = { ...current.completed };
    const review = { ...current.review };
    if (completed[activeChapter.id]) {
      delete completed[activeChapter.id];
      delete review[activeChapter.id];
    } else {
      completed[activeChapter.id] = new Date().toISOString();
      review[activeChapter.id] = { dueAt: new Date(Date.now() + 86_400_000).toISOString(), intervalDays: 1, attempts: 0, ease: 2.5, mastery: 0 };
    }
    const today = new Date().toISOString().slice(0, 10);
    return {
      ...current,
      completed,
      review,
      mastery: { ...current.mastery, [activeChapter.id]: { completed: Boolean(completed[activeChapter.id]), updatedAt: new Date().toISOString() } },
      activity: { ...current.activity, [today]: { ...(current.activity[today] ?? { minutes: 0, chapters: 0, quizzes: 0, reviews: 0, retrievals: 0, diagnostics: 0 }), chapters: (current.activity[today]?.chapters ?? 0) + 1 } },
      lastChapter: activeChapter.id
    };
  });

  const toggleFavorite = () => {
    if (!activeChapter) return;
    updateProgress(current => ({ ...current, favorites: { ...current.favorites, [activeChapter.id]: !current.favorites[activeChapter.id] } }));
  };

  const openHub = (tab: HubTab) => {
    setHubTab(tab);
    setHubOpen(true);
    setSidebarOpen(false);
  };

  const handleKeyboard = useEffectEvent((event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) || event.target.isContentEditable);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommandOpen(true); return; }
      if (event.key === 'Escape') { setSidebarOpen(false); setHubOpen(false); setCommandOpen(false); return; }
      if (typing) return;
      if (event.key === '/') { event.preventDefault(); setSidebarOpen(true); requestAnimationFrame(() => document.querySelector<HTMLInputElement>('#chapter-search')?.focus()); }
      if (event.altKey && event.key === 'ArrowLeft') moveChapter(-1);
      if (event.altKey && event.key === 'ArrowRight') moveChapter(1);
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === 'f') toggleFavorite();
      if (key === 'c') toggleComplete();
      if (key === 'n') openHub('notes');
      if (key === 'r') openHub('review');
      if (key === 'm') openHub('knowledge');
      if (key === 'g') openHub('knowledge');
      if (key === 'l') openHub('lab');
      if (key === 'e') openHub('english');
  });

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  const recordVisibleMinute = useEffectEvent(() => {
    if (document.visibilityState !== 'visible') return;
    updateProgress(current => {
      const today = new Date().toISOString().slice(0, 10);
      const day = current.activity[today] ?? { minutes: 0, chapters: 0, quizzes: 0, reviews: 0, retrievals: 0, diagnostics: 0 };
      return { ...current, activity: { ...current.activity, [today]: { ...day, minutes: day.minutes + 1 } } };
    });
  });

  useEffect(() => {
    if (!loaded) return;
    const interval = window.setInterval(recordVisibleMinute, 60_000);
    return () => window.clearInterval(interval);
  }, [loaded]);

  if (!activeChapter || !activeModule) return <main className="grid min-h-screen place-items-center">Conteúdo indisponível.</main>;

  return (
    <div className={`app-shell ${progress.settings.comfortableReading ? 'comfortable-reading' : ''} ${progress.settings.focusMode ? 'focus-mode' : ''} ${progress.settings.reviewMode ? 'review-mode' : ''}`} style={{ fontSize: `${progress.settings.fontScale}rem` }}>
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <div className="reading-progress" aria-hidden="true"><i style={{ width: `${readingProgress}%` }} /></div>
      <CourseSidebar modules={course.modules} chapters={orderedChapters} activeChapterId={activeChapter.id} completedIds={completedIds} favoriteIds={favoriteIds} searchValue={search} searchQuery={deferredSearch} open={sidebarOpen} online={pwa.online} practiceOnly={practiceOnly} favoritesOnly={favoritesOnly} onClose={() => setSidebarOpen(false)} onSearchChange={setSearch} onSelectChapter={selectChapter} onTogglePractice={() => setPracticeOnly(value => !value)} onToggleFavorites={() => setFavoritesOnly(value => !value)} onOpenHub={openHub} />
      {sidebarOpen ? <button type="button" className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Fechar trilha" /> : null}
      <div className="min-w-0">
        <header className="topbar">
          <button type="button" className="secondary-button lg:hidden" onClick={() => setSidebarOpen(true)}>Trilha</button>
          <div className="toolbar-context"><span>{activeModule.title}</span><small>{String(resolvedChapterIndex + 1).padStart(3, '0')} / {orderedChapters.length}</small></div>
          <div className="progress-summary" aria-label={`${completion}% do curso concluído`}><div><strong>{completion}%</strong><span>{completedIds.size}/{orderedChapters.length} capítulos</span></div><div className="progress-track"><i style={{ width: `${completion}%` }} /></div></div>
          <div className="toolbar-actions"><button type="button" className="toolbar-action" onClick={toggleFavorite} aria-label={progress.favorites[activeChapter.id] ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>{progress.favorites[activeChapter.id] ? '★' : '☆'}</button><button type="button" className="toolbar-action" onClick={() => openHub('notes')} aria-label="Abrir anotações">✎</button><button type="button" className="toolbar-action english-shortcut" onClick={() => openHub('english')} aria-label="Praticar inglês técnico">EN</button><button type="button" className="toolbar-action" onClick={() => setCommandOpen(true)} aria-label="Abrir comandos">⌘</button><button type="button" className="secondary-button" onClick={() => openHub('overview')} aria-label="Central de estudos">Central</button></div>
        </header>
        {storageError ? <p className="storage-warning" role="alert">{storageError}</p> : null}
        <main id="main-content">
          <ChapterView chapter={activeChapter} module={activeModule} chapterNumber={resolvedChapterIndex + 1} totalChapters={orderedChapters.length} completed={Boolean(progress.completed[activeChapter.id])} favorite={Boolean(progress.favorites[activeChapter.id])} quizAnswers={progress.quizAnswers} checklistState={progress.checklists} note={progress.notes[activeChapter.id] ?? ''} englishEvidence={progress.englishEvidence[activeChapter.id] ?? ''} noteView={progress.settings.noteView}
            onQuizAnswer={(quizId, optionId) => updateProgress(current => {
              const quiz = activeChapter.blocks.find(block => block.type === 'quiz' && block.id === quizId);
              if (!quiz || quiz.type !== 'quiz') return current;
              const correctOption = quiz.options.find(option => option.correct);
              const correct = correctOption?.id === optionId;
              const now = new Date().toISOString();
              const today = now.slice(0, 10);
              const previousMastery = current.mastery[quiz.conceptId] && typeof current.mastery[quiz.conceptId] === 'object'
                ? current.mastery[quiz.conceptId] as Record<string, unknown>
                : {};
              const attempts = (typeof previousMastery.attempts === 'number' ? previousMastery.attempts : 0) + 1;
              const rightAnswers = (typeof previousMastery.correct === 'number' ? previousMastery.correct : 0) + (correct ? 1 : 0);
              const errors = { ...current.errors };
              const previousError = errors[quizId] && typeof errors[quizId] === 'object' ? errors[quizId] as Record<string, unknown> : {};
              errors[quizId] = {
                id: quizId,
                chapterId: activeChapter.id,
                conceptId: quiz.conceptId,
                prompt: quiz.prompt,
                options: quiz.options.map(option => ({ id: option.id, label: option.label })),
                correctOptionId: correctOption?.id,
                selectedOptionId: optionId,
                attempts: (typeof previousError.attempts === 'number' ? previousError.attempts : 0) + (correct ? 0 : 1),
                resolved: correct,
                updatedAt: now
              };
              const day = current.activity[today] ?? { minutes: 0, chapters: 0, quizzes: 0, reviews: 0, retrievals: 0, diagnostics: 0 };
              return {
                ...current,
                quizAnswers: { ...current.quizAnswers, [quizId]: optionId },
                errors,
                mastery: { ...current.mastery, [quiz.conceptId]: { attempts, correct: rightAnswers, score: Math.round(rightAnswers / attempts * 100), updatedAt: now } },
                activity: { ...current.activity, [today]: { ...day, quizzes: day.quizzes + 1 } }
              };
            })}
            onChecklistToggle={(itemId, checked) => updateProgress(current => ({ ...current, checklists: { ...current.checklists, [itemId]: checked } }))}
            onToggleComplete={toggleComplete}
            onToggleFavorite={toggleFavorite}
            onNoteChange={note => updateProgress(current => ({ ...current, notes: { ...current.notes, [activeChapter.id]: note } }))}
            onEnglishEvidenceChange={evidence => updateProgress(current => ({ ...current, englishEvidence: { ...current.englishEvidence, [activeChapter.id]: evidence } }))}
            onNoteViewChange={noteView => updateProgress(current => ({ ...current, settings: { ...current.settings, noteView } }))}
            onPrevious={() => moveChapter(-1)} onNext={() => moveChapter(1)} />
        </main>
      </div>
      {!pwa.online ? <div className="offline-banner" role="status">Você está offline. O curso completo continua disponível.</div> : null}
      {readingProgress > 8 ? <button type="button" className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: progress.settings.reducedMotion ? 'auto' : 'smooth' })} aria-label="Voltar ao topo">↑</button> : null}
      {hubOpen ? <StudyHub open initialTab={hubTab} chapters={orderedChapters} glossary={course.glossary} activeChapterId={activeChapter.id} progress={progress} pwa={pwa} onClose={() => setHubOpen(false)} onRestore={setProgress} onUpdate={updateProgress} onSelectChapter={selectChapter} /> : null}
      {commandOpen ? <CommandPalette open chapters={orderedChapters} onClose={() => setCommandOpen(false)} onSelectChapter={selectChapter} onOpenHub={openHub} onToggleFavorite={toggleFavorite} onToggleComplete={toggleComplete} onToggleFocus={() => updateProgress(current => ({ ...current, settings: { ...current.settings, focusMode: !current.settings.focusMode } }))} /> : null}
    </div>
  );
}
