import { useState } from 'react';
import type { Chapter, QuizBlock } from '@/content/schema';
import type { ProgressState } from '@/progress/schema';

interface ReviewPanelProps {
  chapters: Chapter[];
  progress: ProgressState;
  onUpdate: (updater: (progress: ProgressState) => ProgressState) => void;
  onSelectChapter: (chapterId: string) => void;
}

const dayRecord = () => ({ minutes: 0, chapters: 0, quizzes: 0, reviews: 0, retrievals: 0, diagnostics: 0 });

export function ReviewPanel({ chapters, progress, onUpdate, onSelectChapter }: ReviewPanelProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [answered, setAnswered] = useState(false);
  const [cutoff] = useState(() => Date.now());
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const due = chapters.filter(chapter => {
    const review = progress.review[chapter.id];
    return review && new Date(review.dueAt).getTime() <= cutoff;
  });
  const selectedDue = due.filter(chapter => progress.reviewPlan.date !== today || progress.reviewPlan.choices[chapter.id] !== 'deferred');
  const chapter = selectedDue[0];
  const quizzes = chapter?.blocks.filter((block): block is QuizBlock => block.type === 'quiz') ?? [];
  const review = chapter ? progress.review[chapter.id] : undefined;
  const quiz = quizzes.length ? quizzes[(review?.attempts ?? 0) % quizzes.length] : undefined;
  const correct = quiz?.options.find(option => option.correct)?.id === selectedOption;

  const chooseForToday = (chapterId: string, selected: boolean) => onUpdate(current => ({ ...current, reviewPlan: { date: today, choices: { ...(current.reviewPlan.date === today ? current.reviewPlan.choices : {}), [chapterId]: selected ? 'selected' : 'deferred' } } }));

  const complete = () => {
    if (!chapter || !quiz || !selectedOption) return;
    onUpdate(current => {
      const previous = current.review[chapter.id] ?? { dueAt: new Date().toISOString(), intervalDays: 1, attempts: 0, ease: 2.5, mastery: 0 };
      const ease = Math.max(1.3, previous.ease + (correct ? 0.1 : -0.2));
      const intervalDays = correct ? previous.attempts === 0 ? 3 : previous.attempts === 1 ? 7 : Math.max(7, Math.round(previous.intervalDays * ease)) : 1;
      const now = new Date();
      const dueAt = new Date(now.getTime() + intervalDays * 86_400_000).toISOString();
      const key = `review:${chapter.id}:${quiz.id}`;
      const errors = { ...current.errors };
      if (correct) {
        if (errors[key] && typeof errors[key] === 'object') errors[key] = { ...(errors[key] as Record<string, unknown>), resolved: true, updatedAt: now.toISOString() };
      } else {
        errors[key] = { id: key, chapterId: chapter.id, conceptId: quiz.conceptId, prompt: quiz.prompt, options: quiz.options.map(option => ({ id: option.id, label: option.label })), correctOptionId: quiz.options.find(option => option.correct)?.id, selectedOptionId: selectedOption, resolved: false, updatedAt: now.toISOString() };
      }
      const day = current.activity[today] ?? dayRecord();
      return { ...current, errors, review: { ...current.review, [chapter.id]: { dueAt, intervalDays, ease, attempts: previous.attempts + 1, mastery: Math.max(0, Math.min(4, previous.mastery + (correct ? 1 : -1))) } }, activity: { ...current.activity, [today]: { ...day, reviews: day.reviews + 1 } } };
    });
    setSelectedOption('');
    setAnswered(false);
  };

  return <>
    <section className="hub-section"><div className="flex items-center justify-between gap-3"><div><h3>Plano de revisão</h3><p>{due.length} vencidas · {selectedDue.length} escolhidas para hoje</p></div></div><div className="review-plan-list">{due.map(item => <label key={item.id}><input type="checkbox" checked={progress.reviewPlan.date !== today || progress.reviewPlan.choices[item.id] !== 'deferred'} onChange={event => chooseForToday(item.id, event.target.checked)} /><span>{item.title}</span></label>)}</div></section>
    {chapter && quiz ? <section className="hub-section review-card"><p className="eyebrow text-emerald-800">Recuperação ativa · {chapter.title}</p><textarea aria-label="Recuperação antes da revisão" value={String((progress.retrieval[chapter.id] as Record<string, unknown> | undefined)?.answer ?? '')} onChange={event => onUpdate(current => ({ ...current, retrieval: { ...current.retrieval, [chapter.id]: { answer: event.target.value, updatedAt: new Date().toISOString() } } }))} placeholder="Explique de memória antes de responder..." /><h3>{quiz.prompt}</h3><div className="grid gap-2">{quiz.options.map(option => <button type="button" className={`quiz-option ${answered ? option.correct ? 'correct' : option.id === selectedOption ? 'incorrect' : '' : ''}`} key={option.id} disabled={answered} onClick={() => { setSelectedOption(option.id); setAnswered(true); }}>{option.label}</button>)}</div>{answered ? <div className={`review-result ${correct ? 'correct' : 'incorrect'}`} role="status">{correct ? 'Correto. O próximo intervalo será ampliado.' : 'Incorreto. O item volta amanhã e entrou no caderno de erros.'}</div> : null}<div className="mt-4 flex flex-wrap gap-2"><button type="button" className="secondary-button" onClick={() => onSelectChapter(chapter.id)}>Consultar capítulo</button><button type="button" className="primary-button" disabled={!answered} onClick={complete}>Registrar e continuar</button></div></section> : <p className="hub-empty">Fila zerada. Conclua capítulos para criar revisões automaticamente.</p>}
  </>;
}
