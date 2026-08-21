import { useState } from 'react';
import type { Chapter, GlossaryEntry, QuizBlock } from '@/content/schema';
import type { ProgressState } from '@/progress/schema';

interface KnowledgePanelProps {
  chapters: Chapter[];
  glossary: GlossaryEntry[];
  progress: ProgressState;
  onUpdate: (updater: (progress: ProgressState) => ProgressState) => void;
  onSelectChapter: (chapterId: string) => void;
}

type KnowledgeView = 'mastery' | 'errors' | 'diagnostic' | 'projects' | 'glossary';
const asRecord = (value: unknown) => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const emptyDay = () => ({ minutes: 0, chapters: 0, quizzes: 0, reviews: 0, retrievals: 0, diagnostics: 0 });

function normalizedError(raw: unknown, fallbackId: string): Record<string, unknown> & {
  id: string;
  conceptId: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
} {
  const error = asRecord(raw);
  const options = Array.isArray(error.options) ? error.options.map((rawOption, index) => {
    if (typeof rawOption === 'string') return { id: String(index), label: rawOption };
    const option = asRecord(rawOption);
    return {
      id: typeof option.id === 'string' ? option.id : String(index),
      label: typeof option.label === 'string' ? option.label : String(option.text ?? `Alternativa ${index + 1}`)
    };
  }) : [];
  const correctOptionId = typeof error.correctOptionId === 'string'
    ? error.correctOptionId
    : Number.isInteger(error.correctIndex) ? String(error.correctIndex) : '';
  return {
    ...error,
    id: typeof error.id === 'string' ? error.id : fallbackId,
    conceptId: typeof error.conceptId === 'string' ? error.conceptId : typeof error.conceptKey === 'string' ? error.conceptKey : fallbackId,
    options,
    correctOptionId
  };
}

export function KnowledgePanel({ chapters, glossary, progress, onUpdate, onSelectChapter }: KnowledgePanelProps) {
  const [view, setView] = useState<KnowledgeView>('mastery');
  const [query, setQuery] = useState('');
  const [errorFilter, setErrorFilter] = useState<'open' | 'resolved' | 'all'>('open');
  const [diagnosticScope, setDiagnosticScope] = useState('all');
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<Array<{ chapter: Chapter; quiz: QuizBlock }>>([]);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Array<{ chapterId: string; correct: boolean }>>([]);
  const [diagnosticSelection, setDiagnosticSelection] = useState('');
  const chapterById = new Map(chapters.map(chapter => [chapter.id, chapter]));
  const errors = Object.entries(progress.errors).filter(([, value]) => {
    const resolved = asRecord(value).resolved === true;
    return errorFilter === 'all' || (errorFilter === 'resolved' ? resolved : !resolved);
  });
  const projects = chapters.filter(chapter => chapter.blocks.some(block => block.type === 'project') || /(^|\s)(mini-?projeto|projeto final)/i.test(chapter.title));
  const normalizedQuery = query.toLocaleLowerCase('pt-BR');
  const glossaryResults = glossary.filter(item => `${item.term} ${item.definition} ${item.aliases.join(' ')}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery));

  const correctError = (errorId: string, optionId: string) => onUpdate(current => {
    const error = normalizedError(current.errors[errorId], errorId);
    const correct = error.correctOptionId === optionId;
    const conceptId = error.conceptId;
    const mastery = asRecord(current.mastery[conceptId]);
    const attempts = (typeof mastery.attempts === 'number' ? mastery.attempts : 0) + 1;
    const right = (typeof mastery.correct === 'number' ? mastery.correct : 0) + (correct ? 1 : 0);
    return { ...current, errors: { ...current.errors, [errorId]: { ...error, selectedOptionId: optionId, resolved: correct, updatedAt: new Date().toISOString() } }, mastery: { ...current.mastery, [conceptId]: { ...mastery, attempts, correct: right, score: Math.round(right / attempts * 100) } } };
  });

  const startDiagnostic = () => {
    const candidates = chapters.filter(chapter => diagnosticScope === 'all' || chapter.moduleId === diagnosticScope).flatMap(chapter => {
      const quiz = chapter.blocks.find((block): block is QuizBlock => block.type === 'quiz');
      return quiz ? [{ chapter, quiz }] : [];
    });
    const selected = candidates.length <= 10 ? candidates : Array.from({ length: 10 }, (_, index) => candidates[Math.floor(index * candidates.length / 10)]).filter((item): item is { chapter: Chapter; quiz: QuizBlock } => Boolean(item));
    setDiagnosticQuestions(selected);
    setDiagnosticIndex(0);
    setDiagnosticAnswers([]);
    setDiagnosticSelection('');
  };

  const answerDiagnostic = (optionId: string) => {
    if (diagnosticSelection) return;
    const current = diagnosticQuestions[diagnosticIndex];
    if (!current) return;
    const correct = current.quiz.options.some(option => option.id === optionId && option.correct);
    setDiagnosticSelection(optionId);
    setDiagnosticAnswers(answers => [...answers, { chapterId: current.chapter.id, correct }]);
    const today = new Date().toISOString().slice(0, 10);
    onUpdate(progressState => {
      const day = progressState.activity[today] ?? emptyDay();
      return { ...progressState, activity: { ...progressState.activity, [today]: { ...day, diagnostics: day.diagnostics + 1 } } };
    });
  };

  const advanceDiagnostic = () => {
    if (diagnosticIndex < diagnosticQuestions.length - 1) {
      setDiagnosticIndex(index => index + 1);
      setDiagnosticSelection('');
      return;
    }
    const result = [...diagnosticAnswers];
    const weakChapterIds = result.filter(answer => !answer.correct).map(answer => answer.chapterId);
    onUpdate(current => {
      const diagnostic = asRecord(current.diagnostic);
      const runs = Array.isArray(diagnostic.runs) ? diagnostic.runs : [];
      return { ...current, diagnostic: { ...diagnostic, runs: [{ scope: diagnosticScope, correct: result.filter(answer => answer.correct).length, total: result.length, weakChapterIds, completedAt: new Date().toISOString() }, ...runs].slice(0, 20) } };
    });
    setDiagnosticQuestions([]);
    setDiagnosticSelection('');
  };

  const diagnosticQuestion = diagnosticQuestions[diagnosticIndex];
  return <>
    <div className="knowledge-tabs" role="tablist">{([['mastery', 'Domínio'], ['errors', 'Erros'], ['diagnostic', 'Diagnóstico'], ['projects', 'Projetos'], ['glossary', 'Glossário']] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}>{label}</button>)}</div>
    {view === 'mastery' ? <section className="hub-section"><h3>Mapa de domínio</h3><p>O estado é calculado por respostas, correções e revisões, não apenas por páginas abertas.</p><input className="search-input" type="search" aria-label="Buscar conceito no domínio" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar conceito..." /><div className="mastery-list">{glossaryResults.slice(0, 80).map(item => { const slug = item.term.toLocaleLowerCase('pt-BR').replaceAll(' ', '-'); const evidence = asRecord(progress.mastery[item.id] ?? progress.mastery[slug]); const attempts = typeof evidence.attempts === 'number' ? evidence.attempts : 0; const score = typeof evidence.score === 'number' ? evidence.score : 0; return <article key={item.id}><div><strong>{item.term}</strong><span>{attempts ? score >= 80 ? 'Consolidado' : score >= 50 ? 'Em aprendizado' : 'Precisa revisar' : 'Não estudado'}</span></div><p>{item.definition}</p><div className="mastery-track"><i style={{ width: `${score}%` }} /></div><button type="button" onClick={() => onSelectChapter(item.chapterId)}>Abrir capítulo</button></article>; })}</div></section> : null}
    {view === 'errors' ? <section className="hub-section"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3>Caderno automático de erros</h3><p>Responda novamente; o item só é resolvido pela alternativa correta.</p></div><div className="knowledge-filters">{(['open', 'resolved', 'all'] as const).map(filter => <button type="button" aria-pressed={errorFilter === filter} onClick={() => setErrorFilter(filter)} key={filter}>{filter === 'open' ? 'Pendentes' : filter === 'resolved' ? 'Corrigidos' : 'Todos'}</button>)}</div></div><div className="error-list">{errors.map(([id, raw]) => { const error = normalizedError(raw, id); const resolved = error.resolved === true; return <article key={id} className={resolved ? 'resolved' : ''}><span>{resolved ? 'Corrigido' : 'Pendente'}</span><h4>{String(error.prompt ?? id)}</h4><div className="grid gap-2">{error.options.map(option => <button type="button" className={`quiz-option ${resolved && option.id === error.correctOptionId ? 'correct' : ''}`} key={option.id} disabled={resolved} onClick={() => correctError(id, option.id)}>{option.label}</button>)}</div><button type="button" className="secondary-button mt-3" onClick={() => onSelectChapter(String(error.chapterId))}>Consultar capítulo</button></article>; })}{errors.length === 0 ? <p>Nenhum erro nesta visualização.</p> : null}</div></section> : null}
    {view === 'diagnostic' ? <section className="hub-section"><h3>Diagnóstico executável</h3>{!diagnosticQuestion ? <><p>Selecione o escopo. O diagnóstico distribui até 10 perguntas pela trilha escolhida e registra pontos fracos.</p><select value={diagnosticScope} onChange={event => setDiagnosticScope(event.target.value)}><option value="all">Curso completo</option>{[...new Set(chapters.map(chapter => chapter.moduleId))].map(moduleId => <option key={moduleId} value={moduleId}>{moduleId.replaceAll('-', ' ')}</option>)}</select><button type="button" className="primary-button ml-2" onClick={startDiagnostic}>Iniciar diagnóstico</button></> : <><p className="eyebrow text-sky-800">Questão {diagnosticIndex + 1}/{diagnosticQuestions.length} · {diagnosticQuestion.chapter.title}</p><h3>{diagnosticQuestion.quiz.prompt}</h3><div className="grid gap-2">{diagnosticQuestion.quiz.options.map(option => <button type="button" key={option.id} disabled={Boolean(diagnosticSelection)} className={`quiz-option ${diagnosticSelection ? option.correct ? 'correct' : option.id === diagnosticSelection ? 'incorrect' : '' : ''}`} onClick={() => answerDiagnostic(option.id)}>{option.label}</button>)}</div>{diagnosticSelection ? <button type="button" className="primary-button mt-3" onClick={advanceDiagnostic}>{diagnosticIndex === diagnosticQuestions.length - 1 ? 'Concluir diagnóstico' : 'Próxima questão'}</button> : null}</>}</section> : null}
    {view === 'projects' ? <section className="hub-section"><h3>Prontidão de projetos</h3><p>A recomendação usa pré-requisitos concluídos, mas nunca bloqueia o acesso.</p><div className="project-readiness-list">{projects.map(project => { const prerequisites = project.prerequisiteChapterIds.map(id => chapterById.get(id)).filter((chapter): chapter is Chapter => Boolean(chapter)); const done = prerequisites.filter(chapter => progress.completed[chapter.id]).length; const score = prerequisites.length ? Math.round(done / prerequisites.length * 100) : 100; return <article key={project.id}><div><strong>{project.title}</strong><span>{score === 100 ? 'Preparado' : 'Preparação pendente'}</span></div><div className="mastery-track"><i style={{ width: `${score}%` }} /></div><p>{done}/{prerequisites.length} pré-requisitos concluídos.</p><details><summary>Ver pré-requisitos</summary>{prerequisites.map(chapter => <button type="button" key={chapter.id} onClick={() => onSelectChapter(chapter.id)}>{progress.completed[chapter.id] ? '✓' : '○'} {chapter.title}</button>)}</details><button type="button" className="primary-button mt-3" onClick={() => onSelectChapter(project.id)}>Abrir projeto</button></article>; })}</div></section> : null}
    {view === 'glossary' ? <section className="hub-section"><h3>Glossário completo · {glossary.length} conceitos</h3><input className="search-input" type="search" aria-label="Buscar no glossário" value={query} onChange={event => setQuery(event.target.value)} placeholder="Termo, alias ou definição..." /><div className="glossary-list">{glossaryResults.map(item => <article key={item.id}><h4>{item.term}</h4><p>{item.definition}</p>{item.aliases.length ? <small>Aliases: {item.aliases.join(', ')}</small> : null}<button type="button" onClick={() => onSelectChapter(item.chapterId)}>Abrir capítulo relacionado</button></article>)}</div></section> : null}
  </>;
}
