import { useEffect, useRef, useState } from 'react';
import type { CodeBlock, ContentBlock, ExerciseBlock } from '@/content/schema';

interface ContentBlockViewProps {
  block: ContentBlock;
  selectedQuizOption?: string;
  checklistState: Record<string, boolean>;
  onQuizAnswer: (quizId: string, optionId: string) => void;
  onChecklistToggle: (itemId: string, checked: boolean) => void;
}

function enhanceLegacyCode(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('pre.code').forEach(pre => {
    if (pre.parentElement?.classList.contains('legacy-code-shell')) return;
    const shell = document.createElement('div');
    shell.className = 'legacy-code-shell';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code-button';
    button.setAttribute('aria-label', 'Copiar código');
    button.textContent = 'Copiar';
    pre.before(shell);
    shell.append(button, pre);
  });
}

async function copyLegacyCode(button: HTMLElement) {
  const code = button.parentElement?.querySelector('pre')?.textContent ?? '';
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    button.textContent = 'Copiado';
    window.setTimeout(() => { if (button.isConnected) button.textContent = 'Copiar'; }, 1600);
  } catch {
    button.textContent = 'Selecione e copie';
  }
}

function CodeExample({ block }: { block: CodeBlock }) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="code-figure">
      <figcaption className="mb-2 text-sm font-bold text-stone-700">{block.caption}</figcaption>
      <div className="code-shell">
        <button
          type="button"
          className="copy-code-button"
          aria-label="Copiar código"
          onClick={() => void navigator.clipboard.writeText(block.source).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }).catch(() => setCopied(false))}
        >
          {copied ? 'Copiado' : 'Copiar'}
        </button>
        <pre className="code-block"><code {...(block.highlightedHtml ? { dangerouslySetInnerHTML: { __html: block.highlightedHtml } } : { children: block.source })} /></pre>
      </div>
      {block.expectedOutput ? <p className="mt-2 font-mono text-sm text-emerald-800">Saída esperada: {block.expectedOutput}</p> : null}
      {block.explanation?.length ? <section className="code-explanation"><h3>Como o código funciona</h3><ol>{block.explanation.map((step, index) => <li key={`${block.id}-explanation-${index}`}>{step}</li>)}</ol></section> : null}
      {block.commonMistakes?.length ? <aside className="code-mistakes"><strong>Erros comuns</strong><ul>{block.commonMistakes.map((mistake, index) => <li key={`${block.id}-mistake-${index}`}>{mistake}</li>)}</ul></aside> : null}
    </figure>
  );
}

function LegacyExercise({ block }: { block: ExerciseBlock }) {
  const [revealed, setRevealed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (rootRef.current) enhanceLegacyCode(rootRef.current); });
  return (
    <section className="learning-card border-orange-300 bg-orange-50">
      <p className="eyebrow text-orange-800">Exercício · {block.difficulty}</p>
      <div
        ref={rootRef}
        className={`legacy-content legacy-exercise ${revealed ? 'is-revealed' : ''}`}
        onClick={event => {
          const target = event.target;
          if (target instanceof HTMLElement && target.closest('.copy-code-button')) {
            void copyLegacyCode(target.closest<HTMLElement>('.copy-code-button')!);
            return;
          }
          if (target instanceof HTMLElement && target.closest('.reveal-btn')) setRevealed(value => !value);
        }}
        dangerouslySetInnerHTML={{ __html: block.sourceHtml ?? '' }}
      />
    </section>
  );
}

function LegacyHtml({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({ kind: 'install', index: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    enhanceLegacyCode(root);
    const isComparison = selection.kind === 'comparison';
    const tabs = [...root.querySelectorAll<HTMLElement>(isComparison ? '.ct-btn' : '.install-tab')];
    const panels = [...root.querySelectorAll<HTMLElement>(isComparison ? '.ct-panel' : '.install-panel')];
    tabs.forEach((item, index) => {
      item.classList.toggle('active', index === selection.index);
      item.setAttribute('aria-selected', String(index === selection.index));
      item.tabIndex = index === selection.index ? 0 : -1;
    });
    panels.forEach((panel, index) => panel.classList.toggle('active', index === selection.index));
  });

  return (
    <div
      ref={rootRef}
      className="legacy-content legacy-block"
      onClick={event => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const copyButton = target.closest<HTMLElement>('.copy-code-button');
        if (copyButton) {
          void copyLegacyCode(copyButton);
          return;
        }
        const tab = target.closest<HTMLElement>('.install-tab, .ct-btn');
        if (!tab) return;
        const root = event.currentTarget;
        const isComparison = tab.classList.contains('ct-btn');
        const tabs = [...root.querySelectorAll<HTMLElement>(isComparison ? '.ct-btn' : '.install-tab')];
        const panels = [...root.querySelectorAll<HTMLElement>(isComparison ? '.ct-panel' : '.install-panel')];
        const selectedIndex = tabs.indexOf(tab);
        if (selectedIndex < 0 || selectedIndex >= panels.length) return;
        setSelection({ kind: isComparison ? 'comparison' : 'install', index: selectedIndex });
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ContentBlockView({ block, selectedQuizOption, checklistState, onQuizAnswer, onChecklistToggle }: ContentBlockViewProps) {
  switch (block.type) {
    case 'intuition':
      return (
        <section className="learning-card border-amber-300 bg-amber-50">
          <p className="eyebrow text-amber-800">Ponte intuitiva</p>
          <h2>{block.title}</h2>
          <p>{block.body}</p>
          {block.analogyLimit ? <p className="mt-4 border-l-2 border-amber-700 pl-4 text-sm text-stone-600">Limite: {block.analogyLimit}</p> : null}
        </section>
      );
    case 'concept':
      return <section className="concept-block"><h2>{block.title}</h2><p>{block.body}</p></section>;
    case 'mental-model':
      return <section className="learning-card semantic-mental-model"><p className="eyebrow">Modelo mental</p><h2>{block.title}</h2><p>{block.body}</p>{block.flow?.length ? <><h3>Fluxo</h3><ol className="semantic-flow">{block.flow.map((step, index) => <li key={`${block.id}-flow-${index}`}>{step}</li>)}</ol></> : null}{block.ownership?.length ? <><h3>Responsabilidades e ownership</h3><ul>{block.ownership.map((item, index) => <li key={`${block.id}-owner-${index}`}>{item}</li>)}</ul></> : null}{block.lifecycle?.length ? <><h3>Ciclo de vida</h3><ol>{block.lifecycle.map((item, index) => <li key={`${block.id}-lifecycle-${index}`}>{item}</li>)}</ol></> : null}</section>;
    case 'comparison':
      return <section className="learning-card semantic-comparison"><p className="eyebrow">Comparação e decisão</p><h2>{block.title}</h2><div className="responsive-table"><table><thead><tr><th scope="col">Critério</th>{block.alternatives.map(alternative => <th scope="col" key={alternative.name}>{alternative.name}</th>)}</tr></thead><tbody>{block.criteria.map((criterion, index) => <tr key={criterion}><th scope="row">{criterion}</th>{block.alternatives.map(alternative => <td key={alternative.name}>{alternative.values[index] ?? '—'}</td>)}</tr>)}</tbody></table></div><div className="comparison-decisions">{block.alternatives.map(alternative => <article key={alternative.name}><h3>{alternative.name}</h3><p><strong>Use quando:</strong> {alternative.useWhen}</p><p><strong>Evite quando:</strong> {alternative.avoidWhen}</p></article>)}</div></section>;
    case 'error-case':
      return <section className="learning-card semantic-error-case"><p className="eyebrow">Falha real e diagnóstico</p><h2>{block.title}</h2><p>{block.scenario}</p><dl><div><dt>Sintoma</dt><dd>{block.symptom}</dd></div><div><dt>Causa</dt><dd>{block.cause}</dd></div><div><dt>Correção</dt><dd>{block.correction}</dd></div>{block.prevention ? <div><dt>Prevenção</dt><dd>{block.prevention}</dd></div> : null}</dl><h3>Como diagnosticar</h3><ol>{block.diagnosis.map((step, index) => <li key={`${block.id}-diagnosis-${index}`}>{step}</li>)}</ol></section>;
    case 'diagram':
      return <figure className="learning-card semantic-diagram" aria-labelledby={`${block.id}-title`}><figcaption><span className="eyebrow">Fluxo textual acessível</span><h2 id={`${block.id}-title`}>{block.title}</h2><p>{block.description}</p></figcaption><ol className="semantic-flow">{block.steps.map((step, index) => <li key={`${block.id}-step-${index}`}>{step}</li>)}</ol></figure>;
    case 'table':
      return <section className="learning-card semantic-table"><h2>{block.title}</h2><div className="responsive-table"><table><caption>{block.caption ?? block.title}</caption><thead><tr>{block.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`${block.id}-${rowIndex}`}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={`${cell}-${cellIndex}`}>{cell}</th> : <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div></section>;
    case 'code':
      return <CodeExample block={block} />;
    case 'prediction':
      return (
        <details className="learning-card border-emerald-300 bg-emerald-50">
          <summary className="cursor-pointer font-bold text-emerald-950">Preveja antes de revelar</summary>
          <p className="mt-3">{block.prompt}</p>
          <p className="mt-4 border-t border-emerald-200 pt-4 text-stone-700">{block.answer}</p>
        </details>
      );
    case 'callout':
      return <aside className={`learning-card callout-${block.tone}`}><strong>{block.title}</strong><p className="mt-2">{block.body}</p></aside>;
    case 'html':
      return <LegacyHtml html={block.html} />;
    case 'quiz': {
      const selected = block.options.find(option => option.id === selectedQuizOption);
      return (
        <section className="learning-card border-sky-300 bg-sky-50" aria-labelledby={`${block.id}-title`}>
          <p className="eyebrow text-sky-800">Verificação de conceito</p>
          <h2 id={`${block.id}-title`}>{block.prompt}</h2>
          <div className="mt-4 grid gap-2">
            {block.options.map(option => {
              const chosen = option.id === selectedQuizOption;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onQuizAnswer(block.id, option.id)}
                  aria-pressed={chosen}
                  className={`quiz-option ${chosen ? option.correct ? 'correct' : 'incorrect' : ''}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {selected ? (
            <p className={`mt-4 font-bold ${selected.correct ? 'text-emerald-800' : 'text-red-800'}`} role="status">
              {selected.explanation ?? (selected.correct ? 'Correto. Explique também por que as alternativas restantes falham.' : 'Ainda não. Releia o contrato e compare as consequências de cada alternativa.')}
            </p>
          ) : null}
        </section>
      );
    }
    case 'exercise':
      if (block.sourceHtml) return <LegacyExercise block={block} />;
      return (
        <section className="learning-card border-orange-300 bg-orange-50">
          <p className="eyebrow text-orange-800">Exercício · {block.difficulty}</p>
          <h2>{block.title}</h2>
          <p>{block.prompt}</p>
          <details className="mt-4"><summary className="cursor-pointer font-bold">Critérios de validação</summary><ul>{block.criteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul></details>
        </section>
      );
    case 'checklist':
      return (
        <section className="learning-card checklist-card border-teal-300 bg-teal-50">
          <p className="eyebrow text-teal-800">Prática verificável</p>
          <h2>{block.title}</h2>
          <div className="checklist-items">
            {block.items.map(item => <label key={item.id} className="checklist-item"><input type="checkbox" checked={Boolean(checklistState[item.id])} onChange={event => onChecklistToggle(item.id, event.target.checked)} /><span>{item.label}</span></label>)}
          </div>
        </section>
      );
    case 'project':
      return (
        <section className="project-card">
          <p className="eyebrow text-white/75">Projeto · orientação {block.guidance}</p>
          <h2>{block.title}</h2>
          <p>{block.brief}</p>
          <h3>Requisitos</h3><ul>{block.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}</ul>
          <h3>Critérios de aceite</h3><ul>{block.acceptanceCriteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul>
          {block.knowledgeMatrix?.length ? <><h3>Matriz de conhecimentos</h3><div className="responsive-table"><table><thead><tr><th scope="col">Requisito</th><th scope="col">Conceitos</th><th scope="col">Capítulos anteriores</th><th scope="col">Evidência</th></tr></thead><tbody>{block.knowledgeMatrix.map(entry => <tr key={entry.requirement}><th scope="row">{entry.requirement}</th><td>{entry.conceptIds.join(', ')}</td><td>{entry.chapterIds.join(', ')}</td><td>{entry.expectedEvidence}</td></tr>)}</tbody></table></div></> : null}
          {block.englishSpecification ? <section className="project-english-spec" lang="en" aria-label="Professional project specification in English">
            <p className="eyebrow">Technical English · project contract</p>
            <h3>{block.englishSpecification.title}</h3>
            <p>{block.englishSpecification.brief}</p>
            <h4>Requirements</h4><ul>{block.englishSpecification.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}</ul>
            <h4>Acceptance criteria</h4><ul>{block.englishSpecification.acceptanceCriteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul>
          </section> : null}
        </section>
      );
  }
}
