import type { Chapter } from '@/content/schema';

interface TechnicalEnglishLabProps {
  chapter: Chapter;
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  idPrefix?: string;
}

const levelOutcomes = [
  'Connect names directly to behavior.',
  'Infer short technical sentences from context.',
  'Read contracts and explain failures.',
  'Research, specify, and collaborate in English.'
] as const;

export function TechnicalEnglishLab({ chapter, value, onChange, compact = false, idPrefix = 'chapter' }: TechnicalEnglishLabProps) {
  const headingId = `${idPrefix}-english-${chapter.id}`;
  return (
    <section className={`english-lab ${compact ? 'is-compact' : ''}`} aria-labelledby={headingId}>
      <div className="english-lab-heading">
        <div><p className="hub-kicker">Technical English · level {chapter.englishActivity.level}</p><h2 id={headingId}>{chapter.englishActivity.label}</h2></div>
        <span className="english-level" aria-label={`Nível ${chapter.englishActivity.level} de 3`}>{chapter.englishActivity.level}/3</span>
      </div>
      <p className="english-principle"><strong>Meaning first.</strong> {levelOutcomes[chapter.englishActivity.level]}</p>
      <div className="english-context">
        <p className="english-context-label">Code as language context</p>
        <pre className="english-code-cue"><code>{chapter.englishActivity.codeContext}</code></pre>
        <blockquote>{chapter.englishActivity.readPassage}</blockquote>
      </div>
      <ol className="english-flow">
        <li><span>01</span><div><strong>Infer</strong><p>{chapter.englishActivity.comprehensionQuestion}</p></div></li>
        <li><span>02</span><div><strong>Use context</strong><p>{chapter.englishActivity.contextSupport}</p></div></li>
        <li><span>03</span><div><strong>Read the source</strong><p>{chapter.englishActivity.documentationTask}</p></div></li>
        <li><span>04</span><div><strong>Produce</strong><p>{chapter.englishActivity.productionTask}</p></div></li>
      </ol>
      {!compact ? <label className="english-evidence"><span>Evidence in English</span><textarea aria-label={idPrefix === 'hub' ? 'Evidence in English na Central' : 'Evidence in English no capítulo'} value={value} onChange={event => onChange(event.target.value)} placeholder="Answer the question and keep your technical evidence here..." /><small>Success check: {chapter.englishActivity.successCriterion} Salvo automaticamente neste navegador e incluído no backup.</small></label> : null}
    </section>
  );
}
