import type { Chapter, CourseModule } from '@/content/schema';
import type { HubTab } from '@/components/study/StudyHub';

interface CourseSidebarProps {
  modules: CourseModule[];
  chapters: Chapter[];
  activeChapterId: string;
  completedIds: Set<string>;
  favoriteIds: Set<string>;
  searchValue: string;
  searchQuery: string;
  open: boolean;
  online: boolean;
  practiceOnly: boolean;
  favoritesOnly: boolean;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onSelectChapter: (chapterId: string) => void;
  onTogglePractice: () => void;
  onToggleFavorites: () => void;
  onOpenHub: (tab: HubTab) => void;
}

export function CourseSidebar({ modules, chapters, activeChapterId, completedIds, favoriteIds, searchValue, searchQuery, open, online, practiceOnly, favoritesOnly, onClose, onSearchChange, onSelectChapter, onTogglePractice, onToggleFavorites, onOpenHub }: CourseSidebarProps) {
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase('pt-BR');
  const visibleChapters = chapters.filter(chapter => {
    const matchesSearch = !normalizedSearch || `${chapter.title} ${chapter.summary}`.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
    const matchesPractice = !practiceOnly || chapter.blocks.some(block => block.type === 'project') || /projeto|prática|lab/i.test(chapter.title);
    return matchesSearch && matchesPractice && (!favoritesOnly || favoriteIds.has(chapter.id));
  });
  const visibleIds = new Set(visibleChapters.map(chapter => chapter.id));
  const completion = chapters.length ? Math.round(completedIds.size / chapters.length * 100) : 0;

  return (
    <aside className={`course-sidebar ${open ? 'is-open' : ''}`} aria-label="Navegação do curso">
      <div className="sidebar-brand">
        <div className="flex items-center gap-3">
          <span className="brand-mark">J</span>
          <div><strong className="font-display text-2xl">java4br</strong><p>Java → Backend → English</p></div>
        </div>
        <button type="button" onClick={onClose} className="icon-button lg:hidden" aria-label="Fechar trilha">×</button>
      </div>

      <div className="sidebar-progress"><div><span>Progresso real</span><strong>{completion}%</strong></div><div className="progress-track"><i style={{ width: `${completion}%` }} /></div></div>

      <label className="eyebrow" htmlFor="chapter-search">Buscar capítulos</label>
      <input id="chapter-search" type="search" value={searchValue} onChange={event => onSearchChange(event.target.value)} placeholder="Ex.: HttpClient, JDBC..." className="search-input" />
      <p className="sidebar-result-count">{visibleChapters.length} de {chapters.length} capítulos</p>
      <button type="button" className={`practice-filter ${practiceOnly ? 'active' : ''}`} aria-pressed={practiceOnly} onClick={onTogglePractice}>{practiceOnly ? 'Mostrando projetos e prática' : 'Focar somente na prática'}</button>
      <div className="sidebar-tools">
        <button type="button" onClick={() => onOpenHub('overview')}>◈ Central</button>
        <button type="button" className={favoritesOnly ? 'active' : ''} aria-pressed={favoritesOnly} onClick={onToggleFavorites}>{favoritesOnly ? '★ Favoritos' : '☆ Favoritos'}</button>
        <button type="button" onClick={() => onOpenHub('review')}>↻ Revisão</button>
        <button type="button" onClick={() => onOpenHub('knowledge')}>◇ Domínio</button>
        <button type="button" onClick={() => onOpenHub('lab')}>⌘ Java Lab</button>
        <button type="button" className="english-tool" onClick={() => onOpenHub('english')}>EN English</button>
        <button type="button" onClick={() => onOpenHub('settings')}>⚙ Preferências</button>
      </div>

      <nav className="mt-7 space-y-7" aria-label="Trilha do curso">
        {modules.map(module => {
          const moduleChapters = chapters.filter(chapter => chapter.moduleId === module.id && visibleIds.has(chapter.id));
          if (moduleChapters.length === 0) return null;
          const completedInModule = moduleChapters.filter(chapter => completedIds.has(chapter.id)).length;
          return (
            <details key={module.id} open={moduleChapters.some(chapter => chapter.id === activeChapterId) || Boolean(normalizedSearch)} className="module-group">
              <summary><span>{module.title}</span><small>{completedInModule}/{moduleChapters.length}</small></summary>
              <div className="mt-2 space-y-1">
                {moduleChapters.map(chapter => {
                  const active = chapter.id === activeChapterId;
                  return (
                    <button key={chapter.id} type="button" onClick={() => onSelectChapter(chapter.id)} aria-current={active ? 'page' : undefined} className={`chapter-link ${active ? 'active' : ''}`}>
                      <span className={`chapter-status ${completedIds.has(chapter.id) ? 'complete' : ''}`} aria-hidden="true" />
                      <span>{chapter.title}</span>
                    </button>
                  );
                })}
              </div>
            </details>
          );
        })}
      </nav>
      <div className="sidebar-connection"><i className={online ? '' : 'offline'} />{online ? 'Online · offline ativado' : 'Offline · curso disponível'}</div>
    </aside>
  );
}
