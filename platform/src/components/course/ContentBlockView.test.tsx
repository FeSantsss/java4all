import { render, screen } from '@testing-library/react';
import { ContentBlockView } from '@/components/course/ContentBlockView';
import type { ContentBlock } from '@/content/schema';

const inertProps = {
  checklistState: {},
  onQuizAnswer: () => undefined,
  onChecklistToggle: () => undefined
};

describe('semantic content blocks', () => {
  it('renders mental models, comparisons, failures, diagrams and semantic tables accessibly', () => {
    const blocks: ContentBlock[] = [
      { id: 'mental', type: 'mental-model', title: 'Ciclo da conexão', body: 'Uma conexão possui dono.', flow: ['abrir', 'usar', 'fechar'], ownership: ['o chamador fecha'], lifecycle: ['criada', 'encerrada'] },
      { id: 'comparison', type: 'comparison', title: 'List ou Set', criteria: ['Duplicidade'], alternatives: [{ name: 'List', values: ['aceita'], useWhen: 'ordem e repetição importam', avoidWhen: 'unicidade é invariante' }, { name: 'Set', values: ['rejeita'], useWhen: 'pertencimento importa', avoidWhen: 'duplicidade tem significado' }] },
      { id: 'failure', type: 'error-case', title: 'Cursor fechado', scenario: 'O método devolveu ResultSet.', symptom: 'SQLException', cause: 'A conexão foi fechada.', diagnosis: ['inspecionar ownership'], correction: 'Mapear antes de fechar.', prevention: 'Não devolver cursores.' },
      { id: 'diagram', type: 'diagram', title: 'Request e response', description: 'Fluxo HTTP.', steps: ['cliente envia', 'servidor responde'] },
      { id: 'table', type: 'table', title: 'Métodos HTTP', caption: 'Semântica dos métodos', headers: ['Método', 'Seguro'], rows: [['GET', 'sim'], ['POST', 'não']] }
    ];

    render(<>{blocks.map(block => <ContentBlockView key={block.id} block={block} {...inertProps} />)}</>);

    expect(screen.getByRole('heading', { name: 'Ciclo da conexão' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'List ou Set' })).toBeInTheDocument();
    expect(screen.getByText('inspecionar ownership')).toBeInTheDocument();
    expect(screen.getByRole('figure', { name: /Request e response/ })).toBeInTheDocument();
    expect(screen.getByText('Semântica dos métodos')).toBeInTheDocument();
  });

  it('shows authored code explanations, option rationale and project knowledge matrix', () => {
    const blocks: ContentBlock[] = [
      { id: 'code', type: 'code', language: 'java', caption: 'Exemplo', source: 'return value;', explanation: ['retorna o valor ao chamador'], commonMistakes: ['ignorar o tipo de retorno'] },
      { id: 'quiz', type: 'quiz', conceptId: 'return', prompt: 'O que ocorre?', options: [{ id: 'correct', label: 'Retorna', correct: true, explanation: 'O return encerra o método e entrega o valor.' }, { id: 'wrong', label: 'Imprime', correct: false, explanation: 'Retornar não escreve no console.' }] },
      { id: 'project', type: 'project', title: 'Projeto', brief: 'Aplicação', requirements: ['Persistir'], guidance: 'guided', acceptanceCriteria: ['Teste passa'], knowledgeMatrix: [{ requirement: 'Persistir', conceptIds: ['files'], chapterIds: ['java-io'], expectedEvidence: 'Teste de round-trip' }] }
    ];

    render(<>{blocks.map(block => <ContentBlockView key={block.id} block={block} selectedQuizOption={block.id === 'quiz' ? 'wrong' : undefined} {...inertProps} />)}</>);

    expect(screen.getByText('retorna o valor ao chamador')).toBeInTheDocument();
    expect(screen.getByText('Retornar não escreve no console.')).toHaveAttribute('role', 'status');
    expect(screen.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeInTheDocument();
    expect(screen.getByText('Teste de round-trip')).toBeInTheDocument();
  });
});
