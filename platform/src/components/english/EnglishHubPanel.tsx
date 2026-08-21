import { TechnicalEnglishLab } from '@/components/english/TechnicalEnglishLab';
import type { Chapter } from '@/content/schema';
import type { ProgressState } from '@/progress/schema';

interface EnglishHubPanelProps {
  chapters: Chapter[];
  activeChapterId: string;
  progress: ProgressState;
  onUpdate: (updater: (progress: ProgressState) => ProgressState) => void;
  onSelectChapter: (chapterId: string) => void;
}

export function EnglishHubPanel({ chapters, activeChapterId, progress, onUpdate, onSelectChapter }: EnglishHubPanelProps) {
  const active = chapters.find(chapter => chapter.id === activeChapterId) ?? chapters[0];
  if (!active) return null;
  const evidenceCount = Object.values(progress.englishEvidence).filter(value => value.trim()).length;
  const levels = [0, 1, 2, 3].map(level => ({ level, chapters: chapters.filter(chapter => chapter.englishLevel === level) }));
  return <>
    <div className="hub-heading"><div><p className="hub-kicker">English for developers</p><h2>Inglês técnico dentro do Java</h2><p>Contexto antes de tradução: código, documentação e problemas reais aumentam a autonomia a cada módulo.</p></div><span className="hub-kicker">{evidenceCount} evidências salvas</span></div>
    <div className="english-roadmap">{levels.map(item => <article key={item.level}><strong>Level {item.level}</strong><span>{item.chapters.length} capítulos</span><p>{levelGuidanceFor(item.level)}</p></article>)}</div>
    <TechnicalEnglishLab idPrefix="hub" chapter={active} value={progress.englishEvidence[active.id] ?? ''} onChange={value => onUpdate(current => ({ ...current, englishEvidence: { ...current.englishEvidence, [active.id]: value } }))} />
    <section className="hub-section"><h3>Próximas práticas em inglês</h3><div className="hub-list">{chapters.filter(chapter => chapter.englishLevel >= active.englishLevel).slice(0, 8).map(chapter => <button type="button" key={chapter.id} onClick={() => onSelectChapter(chapter.id)}>{chapter.title}<small>{chapter.englishActivity.label} · level {chapter.englishLevel}</small></button>)}</div></section>
  </>;
}

function levelGuidanceFor(level: number) {
  return [
    'Names and messages become meaning through code context.',
    'Short documentation, questions, and search queries.',
    'Contracts, failures, bug reports, and source evidence.',
    'Specifications, issues, trade-offs, and international collaboration.'
  ][level];
}
