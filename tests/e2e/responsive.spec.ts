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
