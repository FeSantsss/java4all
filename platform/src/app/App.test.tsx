import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from '@/app/App';
import generatedCourse from '@/content/generated-course.json';
import { assembleCourse, type GeneratedCourseData } from '@/content/course';

const course = assembleCourse(generatedCourse as GeneratedCourseData);

describe('complete React course shell', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    window.localStorage?.clear();
    window.scrollTo = vi.fn();
  });

  it('renders identity, progress, resources and technical English', async () => {
    render(<App course={course} />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' })).toBeInTheDocument();
    expect(screen.getByText('java4br')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Central de estudos' })).toBeInTheDocument();
    expect(screen.getByText(/Technical English/)).toBeInTheDocument();
    expect(screen.getByText('Recursos complementares')).toBeInTheDocument();
  });

  it('navigates to a mandatory structured chapter and persists learning actions', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });

    fireEvent.click(screen.getByRole('button', { name: 'Java HttpClient e JSON sem framework web' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Java HttpClient e JSON sem framework web' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Marcar como concluído' }));
    expect(screen.getByRole('button', { name: 'Concluído' })).toBeInTheDocument();
  });

  it('filters the full navigation by title and summary', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar capítulos' }), { target: { value: 'Lanterna' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Lanterna: uma TUI real em Java' })).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Primeiro programa: escrever, compilar e executar' })).not.toBeInTheDocument();
  });

  it('renders the complete legacy exercise solution and the Markdown workspace', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });

    fireEvent.click(screen.getByRole('button', { name: 'Ver solução' }));
    expect(screen.getByText(/the JVM calls main WITHOUT creating a Main object/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Anotação em Markdown' }), { target: { value: '## Hipótese\n- [ ] validar com javac' } });
    fireEvent.click(screen.getByRole('button', { name: 'Prévia' }));
    expect(screen.getByRole('heading', { name: 'Hipótese' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'validar com javac' })).toBeInTheDocument();
  });

  it('exposes complete glossary definitions and executable learning panels', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });
    fireEvent.click(screen.getByRole('button', { name: 'Central de estudos' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Domínio e erros' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Glossário' }));

    expect(screen.getByText('Kit de desenvolvimento que reúne compilador, ferramentas e runtime necessários para criar aplicações Java.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Diagnóstico' }));
    expect(screen.getByRole('button', { name: 'Iniciar diagnóstico' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Projetos' }));
    expect(screen.getByText('Prontidão de projetos')).toBeInTheDocument();
  });

  it('switches between system, high-contrast and real-white themes', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });
    fireEvent.click(screen.getByRole('button', { name: /Preferências/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Alto contraste' }));
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('contrast'));
    fireEvent.click(screen.getByRole('button', { name: 'Branco' }));
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('white'));
    expect(screen.getByText(/Curso offline e instalável/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Como instalar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sistema' }));
    expect(screen.getByRole('button', { name: 'Sistema' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps the editable daily study goal in the restored overview', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });
    fireEvent.click(screen.getByRole('button', { name: 'Central de estudos' }));
    const goal = screen.getByRole('combobox', { name: 'Meta diária' });
    fireEvent.change(goal, { target: { value: '45' } });
    expect(goal).toHaveValue('45');
    expect(screen.getByText(/de 45 minutos com o curso visível/)).toBeInTheDocument();
  });

  it('stores contextual English evidence and runs a Java example locally', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });
    fireEvent.change(screen.getByRole('textbox', { name: 'Evidence in English no capítulo' }), { target: { value: 'The JVM executes bytecode.' } });
    expect(screen.getByRole('textbox', { name: 'Evidence in English no capítulo' })).toHaveValue('The JVM executes bytecode.');

    fireEvent.click(screen.getByRole('button', { name: /Java Lab/ }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Exemplo do Java Lab' }), { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: /Executar/ }));
    expect(screen.getByText('Hello, Java!')).toBeInTheDocument();
  });
});
