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

    expect(await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' })).toBeInTheDocument();
    expect(screen.getByText('java4br')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Central de estudos' })).toBeInTheDocument();
    expect(screen.getByText(/Technical English/)).toBeInTheDocument();
    expect(screen.getByText('Recursos complementares')).toBeInTheDocument();
  });

  it('navigates to a mandatory structured chapter and persists learning actions', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' });

    fireEvent.click(screen.getByRole('button', { name: 'Java HttpClient e JSON sem framework web' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Java HttpClient e JSON sem framework web' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Marcar como concluído' }));
    expect(screen.getByRole('button', { name: 'Concluído' })).toBeInTheDocument();
  });

  it('filters the full navigation explicitly by title', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' });
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar pelo título' }), { target: { value: 'Spring' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Spring Core — IoC/DI oficial' })).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Git & fluxo de trabalho' })).not.toBeInTheDocument();
  });

  it('orders associations before the POO project', () => {
    const oop = course.modules.find(module => module.id === 'oop-modeling');
    expect(oop).toBeDefined();
    expect(oop!.chapterIds.indexOf('pilares-profundo')).toBeLessThan(oop!.chapterIds.indexOf('associacoes-cardinalidade'));
    expect(oop!.chapterIds.indexOf('associacoes-cardinalidade')).toBeLessThan(oop!.chapterIds.indexOf('mini-biblioteca-cli'));
  });

  it('orders Java Core from language organization to modern runtime topics', () => {
    const javaCore = course.modules.find(module => module.id === 'java-core');
    expect(javaCore).toBeDefined();
    const expectedOrder = [
      'pacotes',
      'excecoes',
      'colecoes',
      'generics',
      'streams',
      'javamoderno',
      'functional-semantics-lab',
      'jvm-profundo',
      'java-21-profundo'
    ];
    expect(expectedOrder.map(id => javaCore!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders I/O, JSON, Process API and Zenith as a bounded CLI progression', () => {
    const ioCli = course.modules.find(module => module.id === 'io-cli-serialization');
    expect(ioCli).toBeDefined();
    const expectedOrder = [
      'java-io',
      'mini-analisador-vendas',
      'json',
      'process-api-cli',
      'mini-importador-pedidos',
      'zenith-cli-inicial'
    ];
    expect(expectedOrder.map(id => ioCli!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('keeps algorithms and initial engineering chapters in prerequisite order', () => {
    const algorithms = course.modules.find(module => module.id === 'algorithms-data-structures');
    const engineering = course.modules.find(module => module.id === 'testing-engineering');
    expect(algorithms).toBeDefined();
    expect(engineering).toBeDefined();
    expect(['big-o', 'recursao', 'ordenacao-busca', 'algoritmos-praticos', 'estruturas-avancadas'].map(id => algorithms!.chapterIds.indexOf(id)))
      .toEqual([0, 1, 2, 3, 4]);
    expect(engineering!.chapterIds.indexOf('git')).toBeLessThan(engineering!.chapterIds.indexOf('build'));
    expect(engineering!.chapterIds.indexOf('build')).toBeLessThan(engineering!.chapterIds.indexOf('logging'));
    expect(engineering!.chapterIds.indexOf('testes')).toBeLessThan(engineering!.chapterIds.indexOf('mockito'));
    expect(engineering!.chapterIds.indexOf('mockito')).toBeLessThan(engineering!.chapterIds.indexOf('mini-reservas-testadas'));
    expect(engineering!.chapterIds.indexOf('mini-reservas-testadas')).toBeLessThan(engineering!.chapterIds.indexOf('projeto'));
  });

  it('orders HTTP from wire semantics to defensive pure-Java integration', () => {
    const http = course.modules.find(module => module.id === 'http-api-clients');
    expect(http).toBeDefined();
    const expectedOrder = [
      'http',
      'http-wire-contract',
      'java-httpclient-json',
      'unreliable-api-client',
      'pure-java-api-project'
    ];
    expect(expectedOrder.map(id => http!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders relational data from SQL basics to JDBC ownership', () => {
    const data = course.modules.find(module => module.id === 'relational-data-jdbc');
    expect(data).toBeDefined();
    const expectedOrder = [
      'sql',
      'postgres',
      'postgres-concorrencia',
      'migrations',
      'jdbc',
      'mini-financas-jdbc',
      'jdbc-under-the-hood'
    ];
    expect(expectedOrder.map(id => data!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders application design from annotations and SOLID to architecture and DDD', () => {
    const design = course.modules.find(module => module.id === 'application-design');
    expect(design).toBeDefined();
    const expectedOrder = [
      'anotacoes',
      'solid',
      'di',
      'padroes',
      'clean-code',
      'projetospring',
      'di-ioc-profundo',
      'arquitetura-software',
      'ddd'
    ];
    expect(expectedOrder.map(id => design!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders Spring/API from container fundamentals to a verified helpdesk API', () => {
    const springApi = course.modules.find(module => module.id === 'spring-api');
    expect(springApi).toBeDefined();
    const expectedOrder = [
      'spring-core',
      'spring-boot-fundamentos',
      'devtools',
      'lombok',
      'spring-mvc',
      'spring-jpa',
      'jpa-transacoes',
      'dto-mapping',
      'validacao-erros',
      'paginacao-swagger',
      'api-design-avancado',
      'n-mais-1',
      'cors-rate-limit',
      'mini-helpdesk-api',
      'rest-resource-contracts'
    ];
    expect(expectedOrder.map(id => springApi!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders API security from identity concepts to frontend and contract evolution', () => {
    const apiSecurity = course.modules.find(module => module.id === 'api-security-quality');
    expect(apiSecurity).toBeDefined();
    const expectedOrder = [
      'autenticacao-conceitos',
      'spring-security',
      'security-oidc',
      'https',
      'mini-auth-rbac',
      'auth-front-ts',
      'frontend-aplicacao',
      'api-contract-evolution'
    ];
    expect(expectedOrder.map(id => apiSecurity!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders containers, integration tests and advanced data from Docker to database hosting', () => {
    const testing = course.modules.find(module => module.id === 'testing-engineering');
    const containers = course.modules.find(module => module.id === 'containers-integration-data');
    expect(testing).toBeDefined();
    expect(containers).toBeDefined();
    expect(testing!.chapterIds.indexOf('mockito')).toBeGreaterThanOrEqual(0);
    const expectedOrder = [
      'docker-conceitos',
      'dockerfile',
      'compose',
      'testcontainers',
      'estrategia-testes',
      'nosql',
      'mongodb',
      'redis',
      'nosql-operacional',
      'hospedagem-db'
    ];
    expect(expectedOrder.map(id => containers!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders concurrency, network protocols and terminal UI as a progressive system module', () => {
    const module = course.modules.find(item => item.id === 'concurrency-network-tui');
    expect(module).toBeDefined();
    const expectedOrder = [
      'threads',
      'concorrencia-profunda',
      'websockets',
      'tcp-protocol-design',
      'lanterna-tui',
      'developer-tools-java'
    ];
    expect(expectedOrder.map(id => module!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders production delivery from secrets and CI to observable front-end delivery', () => {
    const module = course.modules.find(item => item.id === 'production-delivery');
    expect(module).toBeDefined();
    const expectedOrder = [
      'secrets',
      'cicd',
      'praticas-producao',
      'hardening-producao',
      'deploy-backend',
      'spring-profiles',
      'mini-deploy-observavel',
      'deploy-frontend'
    ];
    expect(expectedOrder.map(id => module!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders synchronous integration before resilience and observability', () => {
    const sync = course.modules.find(item => item.id === 'synchronous-integration');
    const resilience = course.modules.find(item => item.id === 'resilience-observability');
    expect(sync).toBeDefined();
    expect(resilience).toBeDefined();
    expect(['webclient', 'ddd-estrategico', 'conectando-front-back', 'coupled-services-lab'].map(id => sync!.chapterIds.indexOf(id)))
      .toEqual([0, 1, 2, 3]);
    expect(['resilience', 'spring-aop', 'spring-cache', 'actuator', 'observabilidade-pratica'].map(id => resilience!.chapterIds.indexOf(id)))
      .toEqual([0, 1, 2, 3, 4]);
  });

  it('orders messaging and EDA from message basics to Kafka reliability and async tests', () => {
    const module = course.modules.find(item => item.id === 'messaging-eda');
    expect(module).toBeDefined();
    const expectedOrder = [
      'mensageria',
      'in-memory-event-bus',
      'messaging-model',
      'aws-sns-sqs',
      'delivery-failure-lab',
      'eda-observability-security',
      'async-integration-tests',
      'kafka',
      'spring-kafka',
      'kafka-confiavel',
      'event-driven-profundo',
      'testes-integracao-avancados'
    ];
    expect(expectedOrder.map(id => module!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders distributed consistency from CAP/PACELC to outbox, saga and the event-driven project', () => {
    const module = course.modules.find(item => item.id === 'distributed-consistency');
    expect(module).toBeDefined();
    const expectedOrder = [
      'sistemas-distribuidos',
      'consistencia-distribuida',
      'outbox-inbox',
      'saga-schema-ordering',
      'mini-pedidos-eventos'
    ];
    expect(expectedOrder.map(id => module!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('orders professional final chapters from review practice to capstone and diagnostic revision', () => {
    const module = course.modules.find(item => item.id === 'professional-final');
    expect(module).toBeDefined();
    const expectedOrder = [
      'code-review-adr',
      'agile',
      'mapa-sistema',
      'projeto-integrador',
      'quiz'
    ];
    expect(expectedOrder.map(id => module!.chapterIds.indexOf(id))).toEqual([...expectedOrder.keys()]);
  });

  it('renders the complete legacy exercise solution and the Markdown workspace', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' });
    fireEvent.click(screen.getByRole('button', { name: 'Introdução & ambiente' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Introdução & ambiente' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ver solução' }));
    expect(screen.getByText((_, element) => (
      element?.tagName === 'LI' && element.textContent?.includes('javac --version mostra o compilador do JDK') === true
    ))).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Anotação em Markdown' }), { target: { value: '## Hipótese\n- [ ] validar com javac' } });
    fireEvent.click(screen.getByRole('button', { name: 'Prévia' }));
    expect(screen.getByRole('heading', { name: 'Hipótese' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'validar com javac' })).toBeInTheDocument();
  });

  it('exposes complete glossary definitions and executable learning panels', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' });
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
    await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' });
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
    await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' });
    fireEvent.click(screen.getByRole('button', { name: 'Central de estudos' }));
    const goal = screen.getByRole('combobox', { name: 'Meta diária' });
    fireEvent.change(goal, { target: { value: '45' } });
    expect(goal).toHaveValue('45');
    expect(screen.getByText(/de 45 minutos com o curso visível/)).toBeInTheDocument();
  });

  it('stores contextual English evidence and runs a Java example locally', async () => {
    render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Terminal e shell — antes de instalar qualquer coisa' });
    fireEvent.change(screen.getByRole('textbox', { name: 'Evidence in English no capítulo' }), { target: { value: 'The JVM executes bytecode.' } });
    expect(screen.getByRole('textbox', { name: 'Evidence in English no capítulo' })).toHaveValue('The JVM executes bytecode.');

    fireEvent.click(screen.getByRole('button', { name: /Java Lab/ }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Exemplo do Java Lab' }), { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: /Executar/ }));
    expect(screen.getByText('Hello, Java!')).toBeInTheDocument();
  });
});
