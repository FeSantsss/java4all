import { Fragment, useRef, type ReactNode } from 'react';

type NoteView = 'edit' | 'split' | 'preview';

interface MarkdownNoteEditorProps {
  value: string;
  view: NoteView;
  idPrefix?: string;
  onChange: (value: string) => void;
  onViewChange: (view: NoteView) => void;
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function MarkdownPreview({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const lines = value.split('\n');
  const blocks: ReactNode[] = [];
  let code: string[] = [];
  let inCode = false;
  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCode) {
        blocks.push(<pre className="code-block" key={`code-${index}`}><code>{code.join('\n')}</code></pre>);
        code = [];
      }
      inCode = !inCode;
      return;
    }
    if (inCode) {
      code.push(line);
      return;
    }
    const task = line.match(/^\s*- \[([ xX])] (.*)$/);
    if (task) {
      const checkedMarker = task[1] ?? ' ';
      const taskText = task[2] ?? '';
      blocks.push(<label className="note-task" key={index}><input type="checkbox" checked={checkedMarker.toLowerCase() === 'x'} onChange={event => {
        const next = [...lines];
        next[index] = `- [${event.target.checked ? 'x' : ' '}] ${taskText}`;
        onChange(next.join('\n'));
      }} /><span><InlineMarkdown text={taskText} /></span></label>);
    } else if (line.startsWith('### ')) blocks.push(<h4 key={index}><InlineMarkdown text={line.slice(4)} /></h4>);
    else if (line.startsWith('## ')) blocks.push(<h3 key={index}><InlineMarkdown text={line.slice(3)} /></h3>);
    else if (line.startsWith('# ')) blocks.push(<h2 key={index}><InlineMarkdown text={line.slice(2)} /></h2>);
    else if (line.startsWith('> ')) blocks.push(<blockquote key={index}><InlineMarkdown text={line.slice(2)} /></blockquote>);
    else if (/^\s*[-*] /.test(line)) blocks.push(<p className="note-list-item" key={index}>• <InlineMarkdown text={line.replace(/^\s*[-*] /, '')} /></p>);
    else if (line.trim()) blocks.push(<p key={index}><InlineMarkdown text={line} /></p>);
    else blocks.push(<br key={index} />);
  });
  if (code.length) blocks.push(<pre className="code-block" key="code-final"><code>{code.join('\n')}</code></pre>);
  return <div className="note-preview">{blocks.length ? blocks : <p>Comece a escrever para visualizar o Markdown.</p>}</div>;
}

export function MarkdownNoteEditor({ value, view, idPrefix = 'chapter', onChange, onViewChange }: MarkdownNoteEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  const wrapSelection = (before: string, after = before) => {
    const editor = editorRef.current;
    if (!editor) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = value.slice(start, end) || 'texto';
    onChange(`${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const prefixLine = (prefix: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const lineStart = value.lastIndexOf('\n', Math.max(0, editor.selectionStart - 1)) + 1;
    onChange(`${value.slice(0, lineStart)}${prefix}${value.slice(lineStart)}`);
  };

  return (
    <section className="note-workspace" aria-labelledby={`${idPrefix}-note-title`}>
      <div className="note-heading"><div><h2 id={`${idPrefix}-note-title`}>Anotações deste capítulo</h2><p>{words} {words === 1 ? 'palavra' : 'palavras'} · salvo automaticamente</p></div><div className="note-views" role="group" aria-label="Visualização da anotação">{(['edit', 'split', 'preview'] as const).map(mode => <button type="button" key={mode} aria-pressed={view === mode} onClick={() => onViewChange(mode)}>{mode === 'edit' ? 'Editar' : mode === 'split' ? 'Dividido' : 'Prévia'}</button>)}</div></div>
      {view !== 'preview' ? <div className="note-toolbar" role="toolbar" aria-label="Formatação Markdown"><button type="button" onClick={() => wrapSelection('**')}>Negrito</button><button type="button" onClick={() => wrapSelection('`')}>Código</button><button type="button" onClick={() => prefixLine('## ')}>Título</button><button type="button" onClick={() => prefixLine('- ')}>Lista</button><button type="button" onClick={() => prefixLine('- [ ] ')}>Tarefa</button><button type="button" onClick={() => wrapSelection('```java\n', '\n```')}>Bloco Java</button></div> : null}
      <div className={`note-layout note-${view}`}>
        {view !== 'preview' ? <textarea ref={editorRef} id={`${idPrefix}-note`} value={value} onChange={event => onChange(event.target.value)} placeholder="Registre decisões, dúvidas, erros e conexões em Markdown..." aria-label="Anotação em Markdown" /> : null}
        {view !== 'edit' ? <MarkdownPreview value={value} onChange={onChange} /> : null}
      </div>
    </section>
  );
}
