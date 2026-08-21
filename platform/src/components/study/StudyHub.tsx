import { useEffect, useRef, useState } from 'react';
import { EnglishHubPanel } from '@/components/english/EnglishHubPanel';
import { MarkdownNoteEditor } from '@/components/notes/MarkdownNoteEditor';
import { JavaLabPanel } from '@/components/study/JavaLabPanel';
import { KnowledgePanel } from '@/components/study/KnowledgePanel';
import { OverviewPanel } from '@/components/study/OverviewPanel';
import { ReviewPanel } from '@/components/study/ReviewPanel';
import { SettingsPanel } from '@/components/study/SettingsPanel';
import type { Chapter, GlossaryEntry } from '@/content/schema';
import type { PwaState } from '@/pwa/usePwa';
import { createBackup, createEmptyProgress, parseBackup, type ProgressState } from '@/progress/schema';

export type HubTab = 'overview' | 'notes' | 'review' | 'knowledge' | 'lab' | 'english' | 'focus' | 'settings';

interface StudyHubProps {
  open: boolean;
  initialTab: HubTab;
  chapters: Chapter[];
  glossary: GlossaryEntry[];
  activeChapterId: string;
  progress: ProgressState;
  pwa: PwaState;
  onClose: () => void;
  onRestore: (progress: ProgressState) => void;
  onUpdate: (updater: (progress: ProgressState) => ProgressState) => void;
  onSelectChapter: (chapterId: string) => void;
}

const tabs: Array<[HubTab, string, string]> = [
  ['overview', 'Visão geral', '◈'], ['notes', 'Anotações', '✎'], ['review', 'Revisão', '↻'],
  ['knowledge', 'Domínio e erros', '◇'], ['lab', 'Java Lab', '⌘'], ['english', 'Technical English', 'EN'],
  ['focus', 'Foco', '◷'], ['settings', 'Preferências', '⚙']
];

export function StudyHub({ open, initialTab, chapters, glossary, activeChapterId, progress, pwa, onClose, onRestore, onUpdate, onSelectChapter }: StudyHubProps) {
  const [tab, setTab] = useState<HubTab>(initialTab);
  const [message, setMessage] = useState('');
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeChapter = chapters.find(chapter => chapter.id === activeChapterId) ?? chapters[0];

  useEffect(() => {
    if (!focusRunning) return;
    const interval = window.setInterval(() => {
      setFocusSeconds(value => {
        if (value > 1) return value - 1;
        setFocusRunning(false);
        const today = new Date().toISOString().slice(0, 10);
        onUpdate(current => {
          const day = current.activity[today] ?? { minutes: 0, chapters: 0, quizzes: 0, reviews: 0, retrievals: 0, diagnostics: 0 };
          return { ...current, activity: { ...current.activity, [today]: { ...day, minutes: day.minutes + 25 } } };
        });
        setMessage('Sessão de foco concluída. Faça uma pausa de recuperação.');
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [focusRunning, onUpdate]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  const exportBackup = () => {
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([JSON.stringify(createBackup(progress), null, 2)], { type: 'application/json' }));
    anchor.download = `java4br-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    setMessage('Backup completo exportado.');
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      if (!window.confirm('Importar este backup substituirá os dados atuais. Continuar?')) return;
      onRestore(parseBackup(JSON.parse(await file.text())));
      setMessage('Backup validado e restaurado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Falha ao importar o backup.');
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  };

  if (!open || !activeChapter) return null;
  const minutes = String(Math.floor(focusSeconds / 60)).padStart(2, '0');
  const seconds = String(focusSeconds % 60).padStart(2, '0');

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="study-hub" role="dialog" aria-modal="true" aria-labelledby="study-hub-title">
        <aside className="hub-nav" aria-label="Central de estudos">
          <div className="hub-brand"><span className="brand-mark">J</span><div><strong>Study OS</strong><small>seu cockpit Java + English</small></div></div>
          <div className="hub-tab-list" role="tablist" aria-label="Áreas da Central de estudos">{tabs.map(([id, label, icon]) => <button key={id} type="button" role="tab" aria-label={label} aria-selected={tab === id} onClick={() => { setTab(id); if (contentRef.current) contentRef.current.scrollTop = 0; }}><span aria-hidden="true">{icon}</span>{label}</button>)}</div>
          <div className="hub-connection"><i className={pwa.online ? '' : 'offline'} />{pwa.online ? 'Online · offline ativado' : 'Offline · curso disponível'}</div>
        </aside>
        <div className="hub-main">
          <div className="hub-header"><div><p className="hub-kicker">Central de estudos</p><h2 id="study-hub-title">Seu percurso no java4br</h2></div><button ref={closeRef} type="button" className="icon-button" onClick={onClose} aria-label="Fechar central">×</button></div>
          <div ref={contentRef} className="hub-content">
            {tab === 'overview' ? <OverviewPanel chapters={chapters} progress={progress} onSelectChapter={onSelectChapter} onUpdate={onUpdate} /> : null}
            {tab === 'notes' ? <><div className="hub-heading"><div><p className="hub-kicker">Segundo cérebro em Markdown</p><h2>Anotações por capítulo</h2><p>{activeChapter.title}</p></div><span className="autosave-status">Salvo</span></div><MarkdownNoteEditor idPrefix="hub" value={progress.notes[activeChapter.id] ?? ''} view={progress.settings.noteView} onChange={note => onUpdate(current => ({ ...current, notes: { ...current.notes, [activeChapter.id]: note } }))} onViewChange={noteView => onUpdate(current => ({ ...current, settings: { ...current.settings, noteView } }))} /></> : null}
            {tab === 'review' ? <ReviewPanel chapters={chapters} progress={progress} onUpdate={onUpdate} onSelectChapter={onSelectChapter} /> : null}
            {tab === 'knowledge' ? <KnowledgePanel chapters={chapters} glossary={glossary} progress={progress} onUpdate={onUpdate} onSelectChapter={onSelectChapter} /> : null}
            {tab === 'lab' ? <JavaLabPanel chapter={activeChapter} progress={progress} onUpdate={onUpdate} onMessage={setMessage} /> : null}
            {tab === 'english' ? <EnglishHubPanel chapters={chapters} activeChapterId={activeChapter.id} progress={progress} onUpdate={onUpdate} onSelectChapter={onSelectChapter} /> : null}
            {tab === 'focus' ? <><div className="hub-heading"><div><p className="hub-kicker">Pomodoro</p><h2>Sessão de concentração</h2><p>25 minutos de foco e uma pausa consciente.</p></div></div><div className="focus-clock" aria-live="polite">{minutes}:{seconds}</div><div className="focus-actions"><button type="button" className="primary-button" onClick={() => setFocusRunning(value => !value)}>{focusRunning ? 'Pausar' : 'Iniciar foco'}</button><button type="button" className="secondary-button" onClick={() => { setFocusRunning(false); setFocusSeconds(25 * 60); }}>Reiniciar</button></div></> : null}
            {tab === 'settings' ? <SettingsPanel progress={progress} pwa={pwa} importRef={importRef} onUpdate={onUpdate} onExport={exportBackup} onImport={importBackup} onMessage={setMessage} onReset={() => { if (window.confirm('Apagar todo o progresso, notas, inglês, revisões, erros e rascunhos?')) { onRestore(createEmptyProgress()); setMessage('Dados locais reiniciados.'); } }} /> : null}
            {message ? <p className="hub-message" role="status">{message}</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
