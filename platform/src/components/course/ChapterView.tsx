import { ContentBlockView } from '@/components/course/ContentBlockView';
import { MarkdownNoteEditor } from '@/components/notes/MarkdownNoteEditor';
import { TechnicalEnglishLab } from '@/components/english/TechnicalEnglishLab';
import type { Chapter, CourseModule } from '@/content/schema';

interface ChapterViewProps {
  chapter: Chapter;
  module: CourseModule;
  chapterNumber: number;
  totalChapters: number;
  completed: boolean;
  favorite: boolean;
  quizAnswers: Record<string, string>;
  checklistState: Record<string, boolean>;
  note: string;
  englishEvidence: string;
  noteView: 'edit' | 'split' | 'preview';
  onQuizAnswer: (quizId: string, optionId: string) => void;
  onChecklistToggle: (itemId: string, checked: boolean) => void;
  onToggleComplete: () => void;
  onToggleFavorite: () => void;
  onNoteChange: (note: string) => void;
  onEnglishEvidenceChange: (evidence: string) => void;
  onNoteViewChange: (view: 'edit' | 'split' | 'preview') => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ChapterView({
  chapter, module, chapterNumber, totalChapters, completed, favorite, quizAnswers, checklistState, note, englishEvidence, noteView,
  onQuizAnswer, onChecklistToggle, onToggleComplete, onToggleFavorite, onNoteChange, onEnglishEvidenceChange, onNoteViewChange, onPrevious, onNext
}: ChapterViewProps) {
  return (
    <article className="chapter-page mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-14">
      <header className="chapter-hero mb-10 border-b border-stone-200 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-amber-800">{module.title} · {String(chapterNumber).padStart(3, '0')}/{totalChapters} · {chapter.estimatedMinutes} min</p>
          <div className="flex gap-2">
            <button type="button" className="icon-button" onClick={onToggleFavorite} aria-pressed={favorite} aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>{favorite ? '★' : '☆'}</button>
            <button type="button" className={`complete-button ${completed ? 'is-complete' : ''}`} onClick={onToggleComplete}>{completed ? 'Concluído' : 'Marcar como concluído'}</button>
          </div>
        </div>
        <h1 className="mt-4 text-balance font-display text-4xl leading-tight font-black text-stone-950 sm:text-5xl">{chapter.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">{chapter.summary}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><strong className="text-sm">Por que isso existe?</strong><p className="mt-1 text-sm leading-6">{chapter.whyItExists}</p></div>
          <div className="rounded-xl border border-stone-200 bg-white p-4"><strong className="text-sm">Objetivos verificáveis</strong><ul className="mt-2 text-sm">{chapter.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul></div>
        </div>
      </header>

      <div className="chapter-blocks">
        {chapter.blocks.map(block => (
          <ContentBlockView key={block.id} block={block} selectedQuizOption={quizAnswers[block.id]} checklistState={checklistState} onQuizAnswer={onQuizAnswer} onChecklistToggle={onChecklistToggle} />
        ))}
      </div>

      <section className="mt-12 grid gap-5 border-t border-stone-200 pt-10 lg:grid-cols-2">
        <div className="resource-panel">
          <p className="eyebrow text-emerald-800">Recursos complementares</p>
          <h2>Continue pela fonte</h2>
          <div className="mt-4 space-y-3">
            {chapter.resources.map(resource => (
              <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="resource-link">
                <span>{resource.type === 'video' ? 'Vídeo' : 'Documentação'} · {resource.language}</span>
                <strong>{resource.title}</strong>
                <small>{resource.reinforces}</small>
              </a>
            ))}
          </div>
        </div>
        <TechnicalEnglishLab chapter={chapter} value={englishEvidence} onChange={onEnglishEvidenceChange} />
      </section>

      <MarkdownNoteEditor value={note} view={noteView} onChange={onNoteChange} onViewChange={onNoteViewChange} />

      <nav className="mt-10 flex justify-between gap-3" aria-label="Navegação entre capítulos">
        <button type="button" className="secondary-button" onClick={onPrevious} disabled={chapterNumber === 1}>Anterior</button>
        <button type="button" className="primary-button" onClick={onNext} disabled={chapterNumber === totalChapters}>Próximo capítulo</button>
      </nav>
    </article>
  );
}
