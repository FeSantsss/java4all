import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { KnowledgePanel } from '@/components/study/KnowledgePanel';
import type { Chapter, GlossaryEntry } from '@/content/schema';
import { createEmptyProgress, type ProgressState } from '@/progress/schema';

const chapter = {
  id: 'intro',
  moduleId: 'foundation',
  order: 1,
  title: 'Introdução',
  summary: '',
  objectives: [],
  whyItExists: '',
  prerequisiteChapterIds: [],
  conceptIds: ['term-0'],
  estimatedMinutes: 30,
  englishLevel: 0,
  blocks: [],
  resources: [],
  englishActivity: {
    level: 0,
    label: 'Context first',
    instruction: 'Read from context.',
    prompt: 'Write one sentence.',
    codeContext: 'book.isAvailable()',
    readPassage: 'The book is available.',
    comprehensionQuestion: 'What can the reader do?',
    contextSupport: 'Use o comportamento como pista.',
    documentationTask: 'Find the API behavior.',
    productionTask: 'Write one sentence.',
    successCriterion: 'The action is clear.'
  }
} satisfies Chapter;

const glossary = [{ id: 'term-0', term: 'JDK', definition: 'Kit de desenvolvimento.', chapterId: 'intro', aliases: [] }] satisfies GlossaryEntry[];

function LegacyProgressHarness() {
  const [progress, setProgress] = useState<ProgressState>(() => ({
    ...createEmptyProgress(),
    mastery: { 'term-0': { attempts: 3, correct: 3, score: 100 } },
    errors: {
      legacy: {
        id: 'legacy',
        chapterId: 'intro',
        conceptKey: 'term-0',
        prompt: 'O que contém o JDK?',
        options: ['Somente a JVM', 'Compilador, ferramentas e runtime', 'Somente bytecode'],
        correctIndex: 1,
        resolved: false
      }
    }
  }));
  return <KnowledgePanel chapters={[chapter]} glossary={glossary} progress={progress} onUpdate={updater => setProgress(current => updater(current))} onSelectChapter={() => undefined} />;
}

describe('legacy learning evidence UI', () => {
  it('renders legacy glossary mastery and corrects a text-option error record', () => {
    render(<LegacyProgressHarness />);

    expect(screen.getByText('Consolidado')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Erros' }));
    expect(screen.getByText('Somente a JVM')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Compilador, ferramentas e runtime' }));
    expect(screen.getByText('Nenhum erro nesta visualização.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Corrigidos' }));
    expect(screen.getByText('Corrigido')).toBeInTheDocument();
  });
});
