import { expect, test, type Page } from '@playwright/test';

const axePath = require.resolve('axe-core/axe.min.js');

async function openChapter(page: Page, chapterId: string) {
  await page.goto(`/#${chapterId}`);
  await expect(page.locator('.chapter-page h1')).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`#${chapterId}$`));
}

async function expectNoGlobalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  expect(overflow.document, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
  expect(overflow.body, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport + 1);
}

test('capítulos reparados permanecem legíveis de 360 px ao desktop', async ({ page }) => {
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'pilares-profundo');
    await expectNoGlobalOverflow(page);
    const options = page.locator('.quiz-option');
    await expect(options.first()).toBeVisible();
    expect(await options.allTextContents()).not.toEqual(expect.arrayContaining([expect.stringMatching(/[┌┐└┘├┤┬┴┼─│▼▲]/)]));
    const largestOption = await options.evaluateAll(nodes => Math.max(...nodes.map(node => node.getBoundingClientRect().height)));
    expect(largestOption).toBeLessThan(260);

    await openChapter(page, 'mini-biblioteca-cli');
    await expectNoGlobalOverflow(page);
    const checklist = page.locator('.checklist-item').first();
    await expect(checklist).toBeVisible();
    const colors = await checklist.evaluate(element => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color };
    });
    expect(colors.background).not.toBe('rgb(255, 255, 255)');
    expect(colors.color).not.toBe('rgb(255, 255, 255)');

    await openChapter(page, 'javamoderno');
    await expectNoGlobalOverflow(page);
    await expect(page.locator('.legacy-content h2', { hasText: 'var' })).toBeVisible();
    const keyword = page.locator('.code-block .kw').first();
    await expect(keyword).toBeVisible();
    const syntaxColors = await keyword.evaluate(element => ({
      token: getComputedStyle(element).color,
      code: getComputedStyle(element.closest('code')!).color
    }));
    expect(syntaxColors.token).not.toBe(syntaxColors.code);
  }
});

test('navegação mobile, temas, inglês e manifesto continuam funcionais', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openChapter(page, 'intro');
  await page.getByRole('button', { name: 'Trilha', exact: true }).click();
  await expect(page.locator('.course-sidebar')).toHaveClass(/is-open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.course-sidebar')).not.toHaveClass(/is-open/);

  await page.getByRole('button', { name: 'Praticar inglês técnico' }).click();
  await expect(page.getByRole('tab', { name: 'Technical English' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Inglês técnico dentro do Java' })).toBeVisible();
  const hubWidth = await page.locator('.study-hub').evaluate(element => ({ client: element.clientWidth, scroll: element.scrollWidth }));
  expect(hubWidth.scroll).toBeLessThanOrEqual(hubWidth.client + 1);
  await page.locator('.hub-content').evaluate(element => { element.scrollTop = 700; });
  await page.getByRole('tab', { name: 'Preferências' }).click();
  await expect(page.locator('.hub-content')).toHaveJSProperty('scrollTop', 0);
  await page.getByRole('button', { name: 'Fechar central' }).click();

  await page.getByRole('button', { name: 'Central de estudos' }).click();
  await page.getByRole('tab', { name: 'Preferências' }).click();
  await page.getByRole('button', { name: 'Branco', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'white');
  await page.getByRole('button', { name: 'Alto contraste' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'contrast');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', /manifest\.webmanifest/);
  await expectNoGlobalOverflow(page);
});

test('busca da trilha filtra capítulos explicitamente pelo título', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openChapter(page, 'intro');
  await page.getByLabel('Buscar pelo título').fill('spring');
  await expect(page.getByRole('button', { name: 'Spring Core — IoC/DI oficial' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Git & fluxo de trabalho' })).toHaveCount(0);
  await expect(page.getByText(/capítulos$/).first()).toContainText('de 151 capítulos');
  await expectNoGlobalOverflow(page);
});

test('abas herdadas de instalação e comparação respondem novamente', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1280, height: 800 });
  await openChapter(page, 'git');
  await page.getByRole('tab', { name: 'Linux', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Linux', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.install-panel.active')).toContainText('sudo apt');

  await openChapter(page, 'auth-front-ts');
  await page.getByRole('tab', { name: /Com TypeScript/ }).click();
  await expect(page.getByRole('tab', { name: /Com TypeScript/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.ct-panel.active')).toContainText('interface Book');

  await openChapter(page, 'javamoderno');
  await page.getByRole('button', { name: 'Copiar código' }).first().click();
  await expect(page.getByRole('button', { name: 'Copiar código' }).first()).toHaveText('Copiado');
});

test('página principal não possui violações críticas de acessibilidade', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openChapter(page, 'javamoderno');
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => {
    const axe = (window as typeof window & { axe: { run: (context?: Document, options?: object) => Promise<{ violations: Array<{ impact: string | null; id: string; help: string }> }> } }).axe;
    const result = await axe.run(document, { resultTypes: ['violations'] });
    return result.violations.filter(violation => violation.impact === 'critical');
  });
  expect(violations).toEqual([]);
});

test('fundamentos auditados exibem raciocínio, racional e matriz do projeto', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'intro');
    await expect(page.getByRole('heading', { name: 'O ciclo observável' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'java existe, mas javac não' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    const wrongAnswer = page.getByRole('button', { name: 'Reescrever o programa usando Spring.' });
    await wrongAnswer.click();
    await expect(page.getByText('Um framework não corrige localização de classe nem faz parte dos pré-requisitos.')).toBeVisible();

    await openChapter(page, 'mini-caixa-eletronico');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Entrada resistente a formato inválido' })).toBeVisible();
    await expect(page.getByText(/não use banco de dados, framework, coleção, testes automatizados/i)).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('POO auditada progride até associações e projeto sem conhecimento futuro', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'classes');
    await expect(page.getByRole('heading', { name: 'Referência não é o objeto' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'associacoes-cardinalidade');
    await expect(page.getByRole('heading', { name: 'Uma relação é um grafo de referências' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cardinalidade em memória' })).toBeVisible();
    await expect(page.getByText('Coleções dinâmicas serão ensinadas em Java Core; arrays tornam os limites visíveis nesta fase.')).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mini-biblioteca-cli');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Relações' })).toBeVisible();
    await expect(page.getByText(/sem depender de coleções, exceções, banco ou frameworks ainda não ensinados/i)).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Java Core auditado preserva semântica e progressão no mobile e desktop', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'colecoes');
    await expect(page.getByRole('heading', { name: 'Igualdade e hashing antes de Set e Map' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'functional-semantics-lab');
    await expect(page.getByRole('heading', { name: 'Cardinalidade e efeito antes da API' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'jvm-profundo');
    await expect(page.getByRole('heading', { name: 'Afirmação semântica ou detalhe de implementação' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'java-21-profundo');
    await expect(page.getByRole('heading', { name: 'Versão em que o recurso ficou permanente' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('I/O, Process API e Zenith inicial ficam contextualizados no mobile e desktop', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'java-io');
    await expect(page.getByRole('heading', { name: 'Do caminho ao valor confiável' })).toBeVisible();
    await expect(page.getByText(/Files\.lines produz stream lazy ligado a recurso aberto/i)).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'process-api-cli');
    await expect(page.getByRole('heading', { name: 'Ciclo de vida de um processo filho' })).toBeVisible();
    await expect(page.getByText('Command injection começa como conveniência')).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'zenith-cli-inicial');
    await expect(page.getByRole('heading', { name: 'Zenith como pipeline de decisão' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Processo externo permitido' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Algoritmos e engenharia inicial preservam progressão e evidência', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'big-o');
    await expect(page.getByRole('heading', { name: 'Análise, benchmark e profiling' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'algoritmos-praticos');
    await expect(page.getByRole('heading', { name: 'Dijkstra com peso negativo' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'git');
    await expect(page.getByRole('heading', { name: 'Do arquivo editado ao histórico revisável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'testes');
    await expect(page.getByRole('heading', { name: 'AAA sem teatro' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'estruturas-avancadas');
    await expect(page.getByRole('heading', { name: 'Estrutura de dados é contrato de acesso, não coleção com nome chique' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Escolha pela operação dominante' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mini-reservas-testadas');
    await expect(page.getByRole('heading', { name: 'Reserva é promessa de capacidade, não só cadastro com data' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Motor de reservas guiado por testes', exact: true })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Invariante de capacidade' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'projeto');
    await expect(page.getByRole('heading', { name: 'Projeto intermediário bom prova uma fatia completa antes de crescer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sistema de biblioteca em Java puro' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Modelo de relações' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('HTTP e integração defensiva aparecem antes do Spring e com matriz verificável', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'http');
    await expect(page.getByRole('heading', { name: 'Accept e Content-Type em direções diferentes' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'http-wire-contract');
    await expect(page.locator('.code-block code', { hasText: 'curl -i --request GET' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Métodos e idempotência', exact: true })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'java-httpclient-json');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Cliente HTTP reutilizável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'pure-java-api-project');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Falha parcial representável' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('SQL, PostgreSQL e JDBC preservam progressão, transação e projeto auditável', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'sql');
    await expect(page.getByRole('heading', { name: 'DDL, DML e transação não fazem o mesmo papel' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'postgres-concorrencia');
    await expect(page.getByRole('heading', { name: 'Saldo negativo por leitura desatualizada' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'jdbc');
    await expect(page.getByRole('heading', { name: 'SQL injection começa como concatenação inocente' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mini-financas-jdbc');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Transação de transferência' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'jdbc-under-the-hood');
    await expect(page.getByRole('heading', { name: 'Driver e conexão', exact: true })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Design de aplicação progride de metadados e DI até arquitetura e DDD', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'anotacoes');
    await expect(page.getByRole('heading', { name: 'Anotação é etiqueta; comportamento vem de quem lê' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'di');
    await expect(page.getByRole('heading', { name: 'Fluxo de composição manual' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'projetospring');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Metadado lido em runtime' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'arquitetura-software');
    await expect(page.getByRole('heading', { name: 'Monólito modular antes de microserviços por moda' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'ddd');
    await expect(page.getByRole('heading', { name: 'Modelo de domínio não é modelo de transporte' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Spring/API progride do container até contrato REST e projeto verificável', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'spring-core');
    await expect(page.getByRole('heading', { name: 'Spring automatiza uma composição que você já fez à mão' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'spring-mvc');
    await expect(page.getByRole('heading', { name: 'Controller é adaptador HTTP, não dono da regra' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'jpa-transacoes');
    await expect(page.getByRole('heading', { name: 'Flush não é commit' }).first()).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mini-helpdesk-api');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Contrato HTTP verificável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'rest-resource-contracts');
    await expect(page.getByRole('heading', { name: 'Modelagem de recurso', exact: true })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Segurança e qualidade de API progride de identidade até contrato testado', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'autenticacao-conceitos');
    await expect(page.getByRole('heading', { name: 'Autenticar é reconhecer; autorizar é permitir' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'spring-security');
    await expect(page.getByRole('heading', { name: 'Segurança acontece antes do controller' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'security-oidc');
    await expect(page.getByRole('heading', { name: 'OIDC adiciona identidade ao OAuth2' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mini-auth-rbac');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Ownership do recurso' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'api-contract-evolution');
    await expect(page.getByRole('heading', { name: 'Evolução compatível', exact: true })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Containers, testes de integração e dados avançados preservam ordem e prática operacional', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'mockito');
    await expect(page.getByRole('heading', { name: 'Mock não é objeto falso qualquer' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'docker-conceitos');
    await expect(page.getByRole('heading', { name: 'Container é processo isolado a partir de uma imagem' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'testcontainers');
    await expect(page.getByRole('heading', { name: 'Teste de integração precisa de dependência real e estado descartável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'estrategia-testes');
    await expect(page.getByRole('heading', { name: 'Estratégia de teste é mapa de risco, não contagem de arquivos' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mongodb');
    await expect(page.getByRole('heading', { name: 'Documento deve refletir uma leitura útil, não a árvore inteira do mundo' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'redis');
    await expect(page.getByRole('heading', { name: 'Redis é caixa de ferramentas de estruturas rápidas' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'hospedagem-db');
    await expect(page.getByRole('heading', { name: 'Ambiente de banco é contrato de risco' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Concorrência, WebSocket, TCP, TUI e ferramentas Java avançam sem salto conceitual', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'threads');
    await expect(page.getByRole('heading', { name: 'Concorrência é sobre interleavings possíveis' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'concorrencia-profunda');
    await expect(page.getByRole('heading', { name: 'Concorrência tem três perguntas: valor, visibilidade e progresso' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'websockets');
    await expect(page.getByRole('heading', { name: 'WebSocket mantém uma conversa aberta' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'tcp-protocol-design');
    await expect(page.getByRole('heading', { name: 'Framing', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Framing versionado' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'lanterna-tui');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Estado testável sem terminal' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'developer-tools-java');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Processo externo seguro' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Produção progride de secrets e CI até deploy observável com evidência', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'secrets');
    await expect(page.getByRole('heading', { name: 'Secret é valor de runtime, não parte do programa' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'cicd');
    await expect(page.getByRole('heading', { name: 'Pipeline é a memória operacional do time' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'hardening-producao');
    await expect(page.getByRole('heading', { name: 'Serviço em produção precisa falhar de modo operável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'deploy-backend');
    await expect(page.getByRole('heading', { name: 'Deploy é assumir um contrato operacional' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'spring-profiles');
    await expect(page.getByRole('heading', { name: 'Profile escolhe configuração do ambiente, não identidade do usuário' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mini-deploy-observavel');
    await expect(page.getByRole('heading', { name: 'Deploy reproduzível e observável', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Operação recuperável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'deploy-frontend');
    await expect(page.getByRole('heading', { name: 'Front-end também é artefato de produção' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Integração síncrona e resiliência partem da falha medida até observabilidade', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'webclient');
    await expect(page.getByRole('heading', { name: 'Cliente HTTP é fronteira, não atalho para chamar método remoto' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'ddd-estrategico');
    await expect(page.getByRole('heading', { name: 'Contexto é fronteira de significado e ownership' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'conectando-front-back');
    await expect(page.getByRole('heading', { name: 'Front e back se conectam por contrato observável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'coupled-services-lab');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Estado desconhecido modelado' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'resilience');
    await expect(page.getByRole('heading', { name: 'Resiliência é controlar dano, não fingir sucesso' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'spring-aop');
    await expect(page.getByRole('heading', { name: 'AOP coloca comportamento na fronteira da chamada' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'spring-cache');
    await expect(page.getByRole('heading', { name: 'Cache troca frescor por custo menor' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'actuator');
    await expect(page.getByRole('heading', { name: 'Endpoint operacional responde se o serviço pode ser operado' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'observabilidade-pratica');
    await expect(page.getByRole('heading', { name: 'Observabilidade começa pela pergunta que você precisa responder' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Mensageria e EDA começam rasas e avançam até Kafka confiável e testes assíncronos', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'mensageria');
    await expect(page.getByRole('heading', { name: 'Mensagem desacopla tempo, não elimina responsabilidade' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Comece pelo caminho mais raso' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'in-memory-event-bus');
    await expect(page.getByRole('heading', { name: 'Matriz de conhecimentos' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Limite de durabilidade documentado' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'messaging-model');
    await expect(page.getByRole('heading', { name: 'Queue', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Broker e backpressure', exact: true })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'aws-sns-sqs');
    await expect(page.getByRole('heading', { name: 'SNS topic', exact: true })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Fan-out durável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'delivery-failure-lab');
    await expect(page.getByRole('heading', { name: 'DLQ e redrive', exact: true })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'eda-observability-security');
    await expect(page.getByRole('heading', { name: 'Correlação e causalidade', exact: true })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'async-integration-tests');
    await expect(page.getByRole('heading', { name: 'Awaitility', exact: true })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Assertiva assíncrona determinística' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'kafka');
    await expect(page.getByRole('heading', { name: 'Kafka é log particionado, não fila mágica' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'spring-kafka');
    await expect(page.getByRole('heading', { name: 'Spring Kafka adapta Kafka ao modelo Spring' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'kafka-confiavel');
    await expect(page.getByRole('heading', { name: 'Confiabilidade em Kafka é contrato de efeito' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'event-driven-profundo');
    await expect(page.getByRole('heading', { name: 'EDA muda ownership do tempo' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'testes-integracao-avancados');
    await expect(page.getByRole('heading', { name: 'Teste de integração prova fronteira, não sorte de timing' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Consistência distribuída progride de CAP/PACELC até outbox, saga e projeto com evidência', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'sistemas-distribuidos');
    await expect(page.getByRole('heading', { name: 'Distribuído significa que a verdade atravessa tempo, rede e donos diferentes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CAP sem caricatura' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'consistencia-distribuida');
    await expect(page.getByRole('heading', { name: 'Consistência é promessa observável, não sentimento de segurança' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Modelos de consistência como contrato de UX' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'outbox-inbox');
    await expect(page.getByRole('heading', { name: 'Outbox', exact: true })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Relay recuperável' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'saga-schema-ordering');
    await expect(page.getByRole('heading', { name: 'Saga choreography', exact: true })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Compensação correta' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mini-pedidos-eventos');
    await expect(page.getByRole('heading', { name: 'Projeto distribuído bom entrega evidência de falha, não só caminho feliz' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pedidos orientados a eventos com provas de consistência' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Publicação sem janela perdida' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});

test('Fechamento profissional progride de review e processo até mapa, projeto final e revisão diagnóstica', async ({ page }) => {
  for (const viewport of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openChapter(page, 'code-review-adr');
    await expect(page.getByRole('heading', { name: 'Review bom protege o futuro do código sem virar disputa de gosto' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Checklist de revisão que vale comentário' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'agile');
    await expect(page.getByRole('heading', { name: 'Ágil é reduzir atraso de feedback, não colecionar cerimônia' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scrum e Kanban por problema resolvido' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'mapa-sistema');
    await expect(page.getByRole('heading', { name: 'Mapa final transforma capítulos soltos em uma cadeia de responsabilidade' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Trace narrado de uma ação' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'projeto-integrador');
    await expect(page.getByRole('heading', { name: 'Projeto final bom é menor do que sua ambição e mais comprovado do que sua promessa' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sistema completo de ponta a ponta', exact: true })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'Arquitetura justificada' })).toBeVisible();
    await expectNoGlobalOverflow(page);

    await openChapter(page, 'quiz');
    await expect(page.getByRole('heading', { name: 'Quiz final é bússola de revisão, não placar de ego' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Plano de revisão por erro' })).toBeVisible();
    await expectNoGlobalOverflow(page);
  }
});
