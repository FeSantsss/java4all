import { useEffect, useRef, useState } from 'react';
import type { HubTab } from '@/components/study/StudyHub';
import type { Chapter } from '@/content/schema';

interface CommandPaletteProps {
  open: boolean;
  chapters: Chapter[];
  onClose: () => void;
  onSelectChapter: (chapterId: string) => void;
  onOpenHub: (tab: HubTab) => void;
  onToggleFavorite: () => void;
  onToggleComplete: () => void;
  onToggleFocus: () => void;
}

export function CommandPalette({ open, chapters, onClose, onSelectChapter, onOpenHub, onToggleFavorite, onToggleComplete, onToggleFocus }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const actions = [
    { title: 'Abrir visão geral', hint: 'Central', action: () => onOpenHub('overview') },
    { title: 'Criar anotação neste capítulo', hint: 'N', action: () => onOpenHub('notes') },
    { title: 'Abrir fila de revisão', hint: 'R', action: () => onOpenHub('review') },
    { title: 'Abrir mapa de domínio e erros', hint: 'M', action: () => onOpenHub('knowledge') },
    { title: 'Abrir Java Lab', hint: 'L', action: () => onOpenHub('lab') },
    { title: 'Praticar Technical English', hint: 'E', action: () => onOpenHub('english') },
    { title: 'Abrir preferências e instalação', hint: 'Configurações', action: () => onOpenHub('settings') },
    { title: 'Favoritar ou desfavoritar capítulo', hint: 'F', action: onToggleFavorite },
    { title: 'Concluir ou desmarcar capítulo', hint: 'C', action: onToggleComplete },
    { title: 'Alternar modo foco', hint: 'Leitura', action: onToggleFocus }
  ];
  const normalized = query.trim().toLocaleLowerCase('pt-BR');
  const items = [
    ...actions.filter(action => !normalized || action.title.toLocaleLowerCase('pt-BR').includes(normalized)).map(action => ({ ...action, kind: 'Ação' })),
    ...chapters.filter(chapter => !normalized || chapter.title.toLocaleLowerCase('pt-BR').includes(normalized)).slice(0, 30).map(chapter => ({ title: chapter.title, hint: chapter.moduleId.replaceAll('-', ' '), kind: 'Capítulo', action: () => onSelectChapter(chapter.id) }))
  ];
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = [...document.querySelectorAll<HTMLElement>('.command-box input, .command-box button:not(:disabled)')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', keepFocusInside);
    return () => {
      window.removeEventListener('keydown', keepFocusInside);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);
  if (!open) return null;
  const run = (index: number) => {
    const item = items[index];
    if (!item) return;
    onClose();
    item.action();
  };
  return <div className="command-overlay" role="dialog" aria-modal="true" aria-label="Comandos e busca rápida" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div className="command-box"><input ref={inputRef} className="command-input" type="search" value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} onKeyDown={event => { if (event.key === 'Escape') onClose(); if (event.key === 'ArrowDown') { event.preventDefault(); setSelected(value => Math.min(items.length - 1, value + 1)); } if (event.key === 'ArrowUp') { event.preventDefault(); setSelected(value => Math.max(0, value - 1)); } if (event.key === 'Enter') { event.preventDefault(); run(selected); } }} placeholder="Digite um capítulo ou ação..." aria-label="Buscar comando ou capítulo" /><div className="command-results">{items.map((item, index) => <button type="button" key={`${item.kind}-${item.title}`} className={selected === index ? 'selected' : ''} onMouseEnter={() => setSelected(index)} onClick={() => run(index)}><span><small>{item.kind}</small>{item.title}</span><kbd>{item.hint}</kbd></button>)}{items.length === 0 ? <p>Nenhum comando ou capítulo encontrado.</p> : null}</div></div></div>;
}
