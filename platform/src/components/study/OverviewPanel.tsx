import type { Chapter } from '@/content/schema';
import type { ProgressState } from '@/progress/schema';

interface OverviewPanelProps {
  chapters: Chapter[];
  progress: ProgressState;
  onSelectChapter: (chapterId: string) => void;
  onUpdate: (updater: (progress: ProgressState) => ProgressState) => void;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function OverviewPanel({ chapters, progress, onSelectChapter, onUpdate }: OverviewPanelProps) {
  const completed = Object.keys(progress.completed).length;
  const answers = Object.keys(progress.quizAnswers).length;
  const correctAnswers = chapters.flatMap(chapter => chapter.blocks).filter(block => block.type === 'quiz' && block.options.some(option => option.correct && option.id === progress.quizAnswers[block.id])).length;
  const totalMinutes = Object.values(progress.activity).reduce((sum, day) => sum + day.minutes, 0);
  const today = new Date();
  const todayMinutes = progress.activity[dateKey(today)]?.minutes ?? 0;
  const goalPercent = Math.min(100, Math.round(todayMinutes / progress.settings.dailyGoal * 100));
  let streak = 0;
  const cursor = new Date(today);
  while (true) {
    const day = progress.activity[dateKey(cursor)];
    if (!day || Object.values(day).every(value => value === 0)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  const days = Array.from({ length: 42 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (41 - offset));
    const key = dateKey(date);
    const activity = progress.activity[key];
    const amount = activity ? activity.minutes + activity.chapters * 10 + activity.quizzes * 2 + activity.reviews * 5 : 0;
    return { key, amount };
  });
  const favorites = chapters.filter(chapter => progress.favorites[chapter.id]);
  const noted = chapters.filter(chapter => progress.notes[chapter.id]?.trim());
  const englishEvidence = Object.values(progress.englishEvidence).filter(value => value.trim()).length;
  const evidence = Math.round((completed / chapters.length * 0.6 + correctAnswers / Math.max(1, answers) * 0.4) * 100);
  const achievements = [
    { label: 'Primeiro passo', unlocked: completed >= 1 },
    { label: 'Fundamentos ×10', unlocked: completed >= 10 },
    { label: 'Meia maratona', unlocked: completed >= 56 },
    { label: 'Trilha java4br completa', unlocked: completed === chapters.length },
    { label: '3 dias no fogo', unlocked: streak >= 3 },
    { label: '7 dias constante', unlocked: streak >= 7 },
    { label: '100 minutos', unlocked: totalMinutes >= 100 },
    { label: 'Mestre dos quizzes', unlocked: correctAnswers >= 15 },
    { label: 'First evidence in English', unlocked: englishEvidence >= 1 },
    { label: 'English ×10', unlocked: englishEvidence >= 10 }
  ];

  return <>
    <div className="stats-grid"><div><strong>{completed}</strong><span>capítulos concluídos</span></div><div><strong>{answers ? Math.round(correctAnswers / answers * 100) : 0}%</strong><span>acerto nos quizzes</span></div><div><strong>{streak}</strong><span>dias de sequência</span></div><div><strong>{totalMinutes}</strong><span>minutos de foco</span></div></div>
    <section className="hub-section daily-goal"><div className="goal-ring" style={{ '--goal': `${goalPercent * 3.6}deg` } as React.CSSProperties}><b>{goalPercent}%</b></div><div><h3>Meta de hoje</h3><p>{todayMinutes} de {progress.settings.dailyGoal} minutos com o curso visível.</p><label htmlFor="daily-goal">Meta diária</label><select id="daily-goal" value={progress.settings.dailyGoal} onChange={event => onUpdate(current => ({ ...current, settings: { ...current.settings, dailyGoal: Number(event.target.value) } }))}>{[15, 25, 45, 60, 90].map(minutes => <option key={minutes} value={minutes}>{minutes} min</option>)}</select></div></section>
    <section className="hub-section"><h3>Domínio por evidências</h3><div className="mastery-track"><i style={{ width: `${evidence}%` }} /></div><p>{evidence}% combinando conclusão e respostas corretas. Abrir uma página, sozinho, não prova domínio.</p></section>
    <section className="hub-section"><div className="flex items-center justify-between gap-3"><h3>Atividade recente</h3><span className="text-xs text-stone-500">meta diária: {progress.settings.dailyGoal} min</span></div><div className="activity-grid" aria-label="Atividade dos últimos 42 dias">{days.map(day => <span key={day.key} className={day.amount >= 45 ? 'l3' : day.amount >= 20 ? 'l2' : day.amount > 0 ? 'l1' : ''} title={`${day.key}: ${day.amount} pontos de atividade`} />)}</div></section>
    <section className="hub-section"><h3>Conquistas</h3><div className="achievement-list">{achievements.map(achievement => <span key={achievement.label} className={`achievement ${achievement.unlocked ? 'unlocked' : ''}`}>{achievement.unlocked ? '◆' : '◇'} {achievement.label}</span>)}</div></section>
    <section className="hub-section"><h3>Favoritos e anotações</h3><div className="hub-list">{[...new Set([...favorites, ...noted])].slice(0, 12).map(chapter => <button key={chapter.id} type="button" onClick={() => onSelectChapter(chapter.id)}>{chapter.title}<small>{progress.notes[chapter.id] ? 'Possui anotação' : 'Favorito'}</small></button>)}{favorites.length + noted.length === 0 ? <p>Nenhum capítulo marcado ainda.</p> : null}</div></section>
  </>;
}
