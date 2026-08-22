import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { translateCodeElement, translateCodeText } from './english-code.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const pedagogy = require(resolve(root, 'docs/internal/pedagogy-plan.js'));
const contentRoot = resolve(root, 'platform/public/content');
const catalog = JSON.parse(await readFile(resolve(contentRoot, 'catalog.json'), 'utf8'));
const glossary = JSON.parse(await readFile(resolve(contentRoot, 'glossary.json'), 'utf8'));
const pedagogyOverrides = JSON.parse(await readFile(resolve(root, 'platform/content/pedagogy-overrides.json'), 'utf8'));
const foundationsPhase2 = JSON.parse(await readFile(resolve(root, 'platform/content/foundations-phase-2.json'), 'utf8'));
const oopPhase3 = JSON.parse(await readFile(resolve(root, 'platform/content/oop-phase-3.json'), 'utf8'));
const javaCorePhase4 = JSON.parse(await readFile(resolve(root, 'platform/content/java-core-phase-4.json'), 'utf8'));
const ioCliPhase5 = JSON.parse(await readFile(resolve(root, 'platform/content/io-cli-phase-5.json'), 'utf8'));
const algorithmsEngineeringPhase6 = JSON.parse(await readFile(resolve(root, 'platform/content/algorithms-engineering-phase-6.json'), 'utf8'));
const httpIntegrationPhase7 = JSON.parse(await readFile(resolve(root, 'platform/content/http-integration-phase-7.json'), 'utf8'));
const relationalDataPhase8 = JSON.parse(await readFile(resolve(root, 'platform/content/relational-data-phase-8.json'), 'utf8'));
const applicationDesignPhase9 = JSON.parse(await readFile(resolve(root, 'platform/content/application-design-phase-9.json'), 'utf8'));
const springApiPhase10 = JSON.parse(await readFile(resolve(root, 'platform/content/spring-api-phase-10.json'), 'utf8'));
const apiSecurityQualityPhase11 = JSON.parse(await readFile(resolve(root, 'platform/content/api-security-quality-phase-11.json'), 'utf8'));
const containersIntegrationDataPhase12 = JSON.parse(await readFile(resolve(root, 'platform/content/containers-integration-data-phase-12.json'), 'utf8'));
const concurrencyNetworkTuiPhase13 = JSON.parse(await readFile(resolve(root, 'platform/content/concurrency-network-tui-phase-13.json'), 'utf8'));
const productionDeliveryPhase14 = JSON.parse(await readFile(resolve(root, 'platform/content/production-delivery-phase-14.json'), 'utf8'));
const syncResiliencePhase15 = JSON.parse(await readFile(resolve(root, 'platform/content/sync-resilience-phase-15.json'), 'utf8'));
const messagingEdaPhase16 = JSON.parse(await readFile(resolve(root, 'platform/content/messaging-eda-phase-16.json'), 'utf8'));
const distributedConsistencyPhase17 = JSON.parse(await readFile(resolve(root, 'platform/content/distributed-consistency-phase-17.json'), 'utf8'));
const intermediateProjectsPhase18 = JSON.parse(await readFile(resolve(root, 'platform/content/intermediate-projects-phase-18.json'), 'utf8'));
const professionalFinalPhase19 = JSON.parse(await readFile(resolve(root, 'platform/content/professional-final-phase-19.json'), 'utf8'));
const legacyChapters = catalog.chapters;
const dom = new JSDOM('<!doctype html><html><body></body></html>');
const { document } = dom.window;
const sectionByChapterId = new Map();
for (const chapter of legacyChapters) {
  const html = await readFile(resolve(contentRoot, 'chapters', `${chapter.id}.html`), 'utf8');
  const section = JSDOM.fragment(html).querySelector('.section');
  if (!section) throw new Error(`Arquivo de capítulo inválido: ${chapter.id}.html`);
  sectionByChapterId.set(chapter.id, section);
}
const moduleById = new Map(pedagogy.modules.map(module => [module.id, module]));

function targetModuleId(chapter) {
  return pedagogy.chapterOverrides[chapter.id] ?? pedagogy.legacyPhaseMappings[chapter.phaseId];
}

function cleanHtml(element) {
  let clone = element.cloneNode(true);
  const normalizeHeading = heading => {
    const normalized = document.createElement('h2');
    for (const attribute of heading.attributes) normalized.setAttribute(attribute.name, attribute.value);
    normalized.innerHTML = heading.innerHTML;
    return normalized;
  };
  if (clone.matches('h3, h4')) clone = normalizeHeading(clone);
  clone.querySelectorAll('script, style').forEach(node => node.remove());
  clone.querySelectorAll('*').forEach(node => {
    [...node.attributes].forEach(attribute => {
      if (attribute.name.toLowerCase().startsWith('on')) node.removeAttribute(attribute.name);
      if ((attribute.name === 'href' || attribute.name === 'src') && /^javascript:/i.test(attribute.value)) {
        node.removeAttribute(attribute.name);
      }
    });
  });
  clone.querySelectorAll('h3, h4').forEach(heading => {
    heading.replaceWith(normalizeHeading(heading));
  });
  clone.querySelectorAll('.install-tab').forEach(tab => {
    if (tab.tagName === 'BUTTON') return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = tab.className;
    button.innerHTML = tab.innerHTML;
    tab.replaceWith(button);
  });
  clone.querySelectorAll('.install-tab, .ct-btn').forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
    if (tab.tagName === 'BUTTON' && !tab.getAttribute('type')) tab.setAttribute('type', 'button');
    if (index > 0 && !tab.classList.contains('active')) tab.setAttribute('tabindex', '-1');
  });
  clone.querySelectorAll('.install-tabs, .code-toggle-bar').forEach(tabList => tabList.setAttribute('role', 'tablist'));
  const codeExamples = clone.matches('pre.code') ? [clone] : [...clone.querySelectorAll('pre.code')];
  codeExamples.forEach(translateCodeElement);
  return clone.outerHTML;
}

function slug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
}

function text(element) {
  return element?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function codeText(element) {
  return element?.textContent?.replace(/^\n+|\s+$/g, '') ?? '';
}

function conciseText(value, maxLength = 240) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const excerpt = normalized.slice(0, maxLength + 1);
  const sentenceEnd = Math.max(excerpt.lastIndexOf('. '), excerpt.lastIndexOf('; '), excerpt.lastIndexOf(': '));
  if (sentenceEnd >= Math.floor(maxLength * 0.55)) return excerpt.slice(0, sentenceEnd + 1);
  const wordEnd = excerpt.lastIndexOf(' ');
  return `${excerpt.slice(0, wordEnd > 0 ? wordEnd : maxLength).trimEnd()}…`;
}

function cleanInnerHtml(element) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = cleanHtml(element);
  return wrapper.firstElementChild?.innerHTML ?? '';
}

function siblingsForConcept(heading) {
  const siblings = [];
  let candidate = heading.nextElementSibling;
  while (candidate && !/^H[1-6]$/.test(candidate.tagName)) {
    if (!candidate.matches('.exercise, .quiz, .checklist')) siblings.push(candidate);
    candidate = candidate.nextElementSibling;
  }
  return siblings;
}

function conceptFact(heading) {
  const siblings = siblingsForConcept(heading);
  const paragraph = siblings.find(node => node.tagName === 'P' && text(node).length >= 30);
  if (paragraph) return conciseText(text(paragraph));

  const semantic = siblings.find(node => node.matches(
    '.callout, .warn, .good, .bad, .secret, .study-tip, .analogy, .rules-box, .concept-foundation, ul, ol'
  ));
  if (semantic) {
    const items = [...semantic.querySelectorAll(':scope > li')].map(text).filter(Boolean).slice(0, 3);
    return conciseText(items.length ? items.join(' · ') : text(semantic));
  }

  const comments = siblings
    .flatMap(node => [...node.querySelectorAll('.com')])
    .map(text)
    .map(comment => comment.replace(/^\/\/\s*/, ''))
    .filter(comment => comment.length >= 20)
    .slice(0, 2);
  if (comments.length) return conciseText(comments.join(' · '));

  const table = siblings.find(node => node.tagName === 'TABLE' || node.querySelector('table'));
  if (table) {
    const rows = [...table.querySelectorAll('tr')].slice(0, 3).map(row =>
      [...row.querySelectorAll('th, td')].map(text).filter(Boolean).join(': ')
    ).filter(Boolean);
    if (rows.length) return conciseText(rows.join(' · '));
  }

  const title = text(heading);
  return `O capítulo apresenta “${title}” como um contrato que deve ser compreendido pelos seus efeitos, limites e exemplos observáveis.`;
}

function quizBlock(element, chapterId, quizIndex, authored) {
  const quizId = `${chapterId}:${quizIndex}`;
  const rationales = authored.quizRationales?.[quizId] ?? [];
  const options = [...element.querySelectorAll('.quiz-opt')].map((option, optionIndex) => ({
    id: `${quizId}:option:${optionIndex}`,
    label: text(option),
    correct: option.dataset.correct === 'true',
    ...(rationales[optionIndex] ? { explanation: rationales[optionIndex] } : {})
  }));
  return {
    id: quizId,
    type: 'quiz',
    authorship: 'legacy-preserved',
    conceptId: slug(text(element.querySelector('.q')) || chapterId),
    prompt: text(element.querySelector('.q')),
    options
  };
}

function exerciseBlock(element, chapterId, index) {
  const title = text(element.querySelector('h4')) || 'Exercício de raciocínio';
  const extractedCriteria = [...element.querySelectorAll('.solution li')].map(text).filter(Boolean);
  const criteria = extractedCriteria.length
    ? extractedCriteria
    : ['A solução explica decisões, casos-limite e como foi validada.'];
  if (criteria.length === 1) {
    criteria.push('A entrega registra entrada, resultado esperado e evidência reproduzível da validação.');
  }
  const promptNode = [...element.children].find(child => child.tagName === 'P');
  const difficultyText = text(element.querySelector('.exercise-tag')).toLowerCase();
  const difficulty = difficultyText.includes('dif') || difficultyText.includes('avanç')
    ? 'advanced'
    : difficultyText.includes('méd') || difficultyText.includes('inter')
      ? 'intermediate'
      : 'foundation';
  return {
    id: `${chapterId}-exercise-${index}`,
    type: 'exercise',
    authorship: 'legacy-preserved',
    title,
    prompt: text(promptNode) || text(element),
    difficulty,
    criteria,
    fidelityText: text(element),
    sourceHtml: cleanHtml(element)
  };
}

function blocksFrom(section, chapterId, authored) {
  const blocks = [];
  let legacyQuizIndex = 0;
  let legacyChecklistIndex = 0;
  const consumedIndexes = new Set();
  const conceptFacts = [...section.querySelectorAll('h3')]
    .map(heading => ({ title: text(heading), fact: conceptFact(heading) }))
    .filter(item => item.title && item.fact);
  if (conceptFacts.length === 0) {
    conceptFacts.push({
      title: text(section.querySelector('h2')) || chapterId,
      fact: conciseText(text(section.querySelector('p'))) || `O conteúdo deve ser aplicado com contrato, casos-limite e validação explícitos.`
    });
  }
  [...section.children].forEach((child, index) => {
    if (consumedIndexes.has(index)) return;
    if (child.matches('.section-head')) return;
    if (child.matches('.code-toggle-bar')) {
      const group = document.createElement('div');
      group.className = 'code-comparison';
      group.append(child.cloneNode(true));
      const sourceIndexes = [index];
      let panelIndex = index + 1;
      while (panelIndex < section.children.length && section.children[panelIndex].matches('.ct-panel')) {
        group.append(section.children[panelIndex].cloneNode(true));
        consumedIndexes.add(panelIndex);
        sourceIndexes.push(panelIndex);
        panelIndex += 1;
      }
      blocks.push({ id: `${chapterId}-comparison-${index}`, type: 'html', html: cleanHtml(group), sourceIndexes, fidelityText: sourceIndexes.map(sourceIndex => text(section.children[sourceIndex])).join(' ') });
      return;
    }
    if (child.matches('.quiz')) {
      const block = quizBlock(child, chapterId, legacyQuizIndex++, authored);
      block.sourceIndex = index;
      blocks.push(block);
      return;
    }
    if (child.matches('.exercise')) {
      blocks.push(exerciseBlock(child, chapterId, index));
      return;
    }
    if (child.matches('.checklist')) {
      const itemNodes = [...child.querySelectorAll(':scope > label, :scope > li')];
      const items = itemNodes.map((item, itemIndex) => ({
        id: `${chapterId}-checklist-${legacyChecklistIndex + itemIndex}`,
        label: text(item)
      })).filter(item => item.label);
      legacyChecklistIndex += items.length;
      blocks.push({ id: `${chapterId}-checklist-${index}`, type: 'checklist', authorship: 'legacy-preserved', title: 'Checklist de prática', items });
      return;
    }
    if (child.matches('pre.code')) {
      const id = `${chapterId}-code-${index}`;
      const explanation = authored.codeExplanations?.[id];
      blocks.push({
        id,
        type: 'code',
        authorship: 'legacy-preserved',
        language: 'java',
        source: translateCodeText(codeText(child)),
        fidelityText: text(child),
        highlightedHtml: cleanInnerHtml(child),
        caption: `Exemplo executável de ${chapterId}.`,
        ...(explanation ?? {})
      });
      return;
    }
    blocks.push({ id: `${chapterId}-content-${index}`, type: 'html', authorship: 'legacy-preserved', html: cleanHtml(child), fidelityText: text(child) });
  });
  if (authored.generateCompatibilityQuizzes !== false) conceptFacts.forEach((concept, conceptIndex) => {
    const alternatives = [
      concept.fact,
      conceptFacts[(conceptIndex + 1) % conceptFacts.length]?.fact,
      conceptFacts[(conceptIndex + 2) % conceptFacts.length]?.fact
    ].filter((value, optionIndex, values) => value && values.indexOf(value) === optionIndex);
    while (alternatives.length < 3) {
      alternatives.push(alternatives.length === 1
        ? `O conceito ${concept.title} elimina a necessidade de validar casos-limite e efeitos observáveis.`
        : `O conceito ${concept.title} deve ser aplicado sempre, independentemente do problema e dos pré-requisitos.`);
    }
    const rotated = [alternatives[1], alternatives[0], alternatives[2]];
    blocks.push({
      id: `${chapterId}-concept-check-${conceptIndex}`,
      type: 'quiz',
      authorship: 'generated-compatibility',
      conceptId: slug(concept.title),
      prompt: `Em “${conciseText(concept.title, 110)}”, qual afirmação descreve corretamente o conceito?`,
      options: rotated.map((label, optionIndex) => ({
        id: `${chapterId}-concept-check-${conceptIndex}-${optionIndex}`,
        label,
        correct: label === concept.fact
      }))
    });
  });
  return [
    ...(authored.prependBlocks ?? []),
    ...blocks,
    ...(authored.appendBlocks ?? [])
  ];
}

const resourceProfiles = {
  orientation: ['https://dev.java/learn/', 'https://www.youtube.com/@java'],
  'programming-fundamentals': ['https://dev.java/learn/language-basics/', 'https://www.youtube.com/@java'],
  'oop-modeling': ['https://dev.java/learn/classes-objects/', 'https://www.youtube.com/@java'],
  'java-core': ['https://dev.java/learn/', 'https://www.youtube.com/@java'],
  'io-cli-serialization': ['https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/io/package-summary.html', 'https://www.youtube.com/@java'],
  'algorithms-data-structures': ['https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/package-summary.html', 'https://www.youtube.com/@java'],
  'testing-engineering': ['https://junit.org/junit5/docs/current/user-guide/', 'https://www.youtube.com/@java'],
  'http-api-clients': ['https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpClient.html', 'https://www.youtube.com/@java'],
  'relational-data-jdbc': ['https://docs.oracle.com/javase/tutorial/jdbc/basics/', 'https://www.youtube.com/@java'],
  'application-design': ['https://dev.java/learn/', 'https://www.youtube.com/@java'],
  'spring-api': ['https://docs.spring.io/spring-framework/reference/web/webmvc.html', 'https://www.youtube.com/@SpringSourceDev'],
  'api-security-quality': ['https://docs.spring.io/spring-security/reference/', 'https://www.youtube.com/@SpringSourceDev'],
  'containers-integration-data': ['https://java.testcontainers.org/', 'https://www.youtube.com/@atomicjar'],
  'concurrency-network-tui': ['https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html', 'https://www.youtube.com/@java'],
  'production-delivery': ['https://docs.spring.io/spring-boot/reference/actuator/', 'https://www.youtube.com/@SpringSourceDev'],
  'synchronous-integration': ['https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpClient.html', 'https://www.youtube.com/@java'],
  'resilience-observability': ['https://resilience4j.readme.io/docs', 'https://www.youtube.com/@SpringSourceDev'],
  'messaging-eda': ['https://docs.aws.amazon.com/sns/latest/dg/welcome.html', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg'],
  'distributed-consistency': ['https://kafka.apache.org/documentation/#design', 'https://youtu.be/w_aO4KVEbwA?si=NXYX9NW5yMUZjCAg'],
  'professional-final': ['https://docs.github.com/en/pull-requests/collaborating-with-pull-requests', 'https://www.youtube.com/@java']
};

function resourcesFor(chapter, moduleId) {
  const [documentation, video] = resourceProfiles[moduleId] ?? resourceProfiles['java-core'];
  return [
    {
      id: `${chapter.id}-official-docs`,
      type: 'official-docs',
      title: `Documentação de referência: ${chapter.title}`,
      url: documentation,
      reinforces: `Confirme contratos, termos e APIs usados em “${chapter.title}”.`,
      language: 'en',
      auditStatus: 'pending'
    },
    {
      id: `${chapter.id}-video`,
      type: 'video',
      title: `Aula complementar: ${chapter.title}`,
      url: video,
      reinforces: `Revise o modelo mental e compare os exemplos do capítulo com uma explicação audiovisual.`,
      language: video.includes('youtu') ? 'en' : 'en',
      auditStatus: 'pending'
    }
  ];
}

const englishTopicWords = {
  abstracao: 'abstraction', algoritmos: 'algorithms', analisador: 'analyzer', anotacoes: 'annotations',
  aplicacao: 'application', arquitetura: 'architecture', atributos: 'fields', autenticacao: 'authentication',
  avancadas: 'advanced', avancado: 'advanced', avancados: 'advanced', backend: 'backend', biblioteca: 'library',
  busca: 'search', caixa: 'ATM', colecoes: 'collections', conceitos: 'concepts', concorrencia: 'concurrency',
  conectando: 'connecting', confiavel: 'reliable', consistencia: 'consistency', console: 'console',
  construtores: 'constructors', controle: 'control', distribuida: 'distributed', distribuidos: 'distributed',
  eletronico: 'electronic', encapsulamento: 'encapsulation', entrada: 'input', erros: 'errors', escopo: 'scope',
  estrategia: 'strategy', estrategico: 'strategic', estruturas: 'structures', eventos: 'events', excecoes: 'exceptions',
  expressoes: 'expressions', financas: 'finance', fluxo: 'flow', fundamentos: 'fundamentals', heranca: 'inheritance',
  hospedagem: 'hosting', importador: 'importer', integracao: 'integration', integrador: 'capstone',
  lacos: 'loops', logica: 'logic', mapa: 'map', matrizes: 'matrices', mensageria: 'messaging',
  metodos: 'methods', observabilidade: 'observability', observavel: 'observable', operacional: 'operational',
  operadores: 'operators', ordenacao: 'sorting', pacotes: 'packages', padroes: 'patterns', paginacao: 'pagination',
  pedidos: 'orders', pilares: 'pillars', polimorfismo: 'polymorphism', pratica: 'practice', praticas: 'practices',
  praticos: 'practical', primeiro: 'first', producao: 'production', profunda: 'deep', profundo: 'deep',
  programa: 'program', programacao: 'programming', projeto: 'project', repeticao: 'iteration', reservas: 'reservations',
  sistema: 'system', sistemas: 'systems', testadas: 'tested', testes: 'tests', tipos: 'types',
  transacoes: 'transactions', validacao: 'validation', variaveis: 'variables', vendas: 'sales'
};

function englishTopic(chapter) {
  const exact = {
    intro: 'Java development environment', 'n-mais-1': 'N+1 query problem', javamoderno: 'modern Java',
    projetospring: 'pre-Spring mini framework', 'mini-caixa-eletronico': 'terminal ATM project',
    'mini-biblioteca-cli': 'object-oriented library CLI', 'mini-analisador-vendas': 'Stream sales analyzer',
    'mini-importador-pedidos': 'order importer', 'mini-financas-jdbc': 'personal finance with JDBC',
    'mini-helpdesk-api': 'Spring help desk API', 'mini-reservas-testadas': 'test-driven reservation engine',
    'mini-auth-rbac': 'role-based access control project', 'mini-deploy-observavel': 'observable deployment project',
    'mini-pedidos-eventos': 'event-driven orders project', 'projeto-integrador': 'end-to-end capstone system'
  };
  return exact[chapter.id] ?? chapter.id.split('-').map(word => englishTopicWords[word] ?? word).join(' ');
}

function englishCodeContext(section, topic) {
  const source = section.querySelector('pre.code');
  if (!source) return `// Observe how names reveal the ${topic} contract.`;
  const translated = translateCodeText(source.textContent ?? '');
  const line = translated.split('\n').map(item => item.trim()).find(item =>
    item.length >= 8 && item.length <= 150 && /[A-Za-z]/.test(item) && !/^[┌┐└┘├┤┬┴┼─│]/.test(item)
  );
  return line ?? `// Follow the observable behavior in this ${topic} example.`;
}

function englishActivity(chapter, section, level) {
  const topic = englishTopic(chapter);
  const codeContext = englishCodeContext(section, topic);
  const activities = [
    {
      label: 'Context first',
      readPassage: `The ${topic} example uses names that reveal state and behavior. Follow the values and the result before looking up unfamiliar words.`,
      comprehensionQuestion: 'Which name tells you what the program does, and what result can you observe?',
      contextSupport: 'Siga a execução do código. Use nomes, valores e resultado como pistas; não monte uma lista de traduções.',
      documentationTask: 'Na referência oficial, encontre um nome de API que também aparece no capítulo e observe o exemplo ao redor dele.',
      productionTask: 'Write one short sentence using this frame: “The method ___ when ___.”',
      successCriterion: 'Your sentence identifies an action and its observable result from the code.'
    },
    {
      label: 'Guided reading',
      readPassage: `A ${topic} operation receives input, checks a condition, and returns an observable result. Invalid input should fail explicitly instead of hiding the problem.`,
      comprehensionQuestion: 'What does the operation receive, and under which condition does it fail?',
      contextSupport: 'Procure primeiro sujeito, ação, condição e resultado. Consulte palavras isoladas somente depois de formular uma hipótese.',
      documentationTask: `In the official reference, find one sentence that describes a ${topic} operation. Use its example to confirm your interpretation.`,
      productionTask: `Write an English search query about one real doubt from this ${topic} chapter, then record the answer in one sentence.`,
      successCriterion: 'The query names the technology, behavior, and failure or result you need to understand.'
    },
    {
      label: 'Applied comprehension',
      readPassage: `The ${topic} component must preserve its contract under invalid input and dependency failure. Callers need an explicit result, not an ambiguous null or partial state.`,
      comprehensionQuestion: 'Which contract can fail, how is the failure observed, and what should the caller do next?',
      contextSupport: 'Infer the contract from code and behavior. Use the documentation only to confirm the hypothesis you already formed.',
      documentationTask: `According to the official documentation, identify one precondition, return value, or failure related to ${topic}. Cite the relevant section.`,
      productionTask: `Write a concise bug report for a plausible ${topic} failure with expected behavior, actual behavior, and steps to reproduce.`,
      successCriterion: 'A developer can reproduce the failure and distinguish expected from actual behavior without translation notes.'
    },
    {
      label: 'Professional use',
      readPassage: `Design the ${topic} flow so that failures remain observable, retries are bounded, and duplicate work cannot corrupt state. Document constraints and recovery trade-offs.`,
      comprehensionQuestion: 'Which constraint protects correctness, and which trade-off would you make explicit during review?',
      contextSupport: 'Work directly from the contract, code, and official material. Record uncertainty as a technical question, not as a translation exercise.',
      documentationTask: `Read the official material for ${topic}. Extract one normative behavior, one limitation, and one operational consequence.`,
      productionTask: `Write an implementation issue for ${topic} with context, constraints, acceptance criteria, failure scenarios, and trade-offs.`,
      successCriterion: 'The issue is implementable and reviewable by an international team without additional Portuguese context.'
    }
  ];
  const activity = activities[level];
  return {
    level,
    ...activity,
    codeContext,
    instruction: activity.readPassage,
    prompt: activity.productionTask
  };
}

const chapters = legacyChapters.map((chapter, order) => {
  const moduleId = targetModuleId(chapter);
  const module = moduleById.get(moduleId);
  const section = sectionByChapterId.get(chapter.id);
  if (!module || !section) throw new Error(`Capítulo sem módulo/arquivo: ${chapter.id}`);
  const prerequisites = [...section.querySelectorAll('.prereq-tag[href^="#"]')]
    .map(link => link.getAttribute('href').slice(1));
  const headings = [...section.querySelectorAll('h3')].map(text).filter(Boolean);
  const firstParagraph = [...section.children].find(child => child.tagName === 'P');
  const conceptIds = headings.slice(0, 12).map(slug).filter(Boolean);
  const authored = {
    ...(pedagogyOverrides.chapters[chapter.id] ?? {}),
    ...(foundationsPhase2.chapters?.[chapter.id] ?? {}),
    ...(oopPhase3.chapters?.[chapter.id] ?? {}),
    ...(javaCorePhase4.chapters?.[chapter.id] ?? {}),
    ...(ioCliPhase5.chapters?.[chapter.id] ?? {}),
    ...(algorithmsEngineeringPhase6.chapters?.[chapter.id] ?? {}),
    ...(httpIntegrationPhase7.chapters?.[chapter.id] ?? {}),
    ...(relationalDataPhase8.chapters?.[chapter.id] ?? {}),
    ...(applicationDesignPhase9.chapters?.[chapter.id] ?? {}),
    ...(springApiPhase10.chapters?.[chapter.id] ?? {}),
    ...(apiSecurityQualityPhase11.chapters?.[chapter.id] ?? {}),
    ...(containersIntegrationDataPhase12.chapters?.[chapter.id] ?? {}),
    ...(concurrencyNetworkTuiPhase13.chapters?.[chapter.id] ?? {}),
    ...(productionDeliveryPhase14.chapters?.[chapter.id] ?? {}),
    ...(syncResiliencePhase15.chapters?.[chapter.id] ?? {}),
    ...(messagingEdaPhase16.chapters?.[chapter.id] ?? {}),
    ...(distributedConsistencyPhase17.chapters?.[chapter.id] ?? {}),
    ...(intermediateProjectsPhase18.chapters?.[chapter.id] ?? {}),
    ...(professionalFinalPhase19.chapters?.[chapter.id] ?? {})
  };
  return {
    id: chapter.id,
    moduleId,
    order: authored.order ?? order,
    title: chapter.title,
    summary: text(firstParagraph) || `Estudo progressivo de ${chapter.title}.`,
    objectives: authored.objectives ?? headings.slice(0, 4).map(heading => `Compreender e aplicar: ${heading}`),
    whyItExists: authored.whyItExists ?? `Este capítulo introduz ${chapter.title} quando seus pré-requisitos já permitem discutir decisões, limites e uso real.`,
    prerequisiteChapterIds: authored.prerequisiteChapterIds ?? [...new Set(prerequisites)],
    conceptIds: conceptIds.length ? conceptIds : [slug(chapter.title)],
    introducedConceptIds: authored.introducedConceptIds ?? [],
    usedConceptIds: authored.usedConceptIds ?? [],
    estimatedMinutes: Math.max(30, Number.parseInt(text(section.querySelector('.time-est')), 10) * 60 || 60),
    englishLevel: module.englishLevel,
    blocks: blocksFrom(section, chapter.id, authored),
    resources: authored.resources ?? resourcesFor(chapter, moduleId),
    englishActivity: englishActivity(chapter, section, module.englishLevel),
    audit: authored.audit ?? { status: 'pending', sourceKind: 'legacy-html' }
  };
});

const modules = pedagogy.modules.map((module, order) => ({
  id: module.id,
  title: module.title,
  summary: `Constrói a base necessária para ${module.title.toLowerCase()} sem antecipar abstrações.`,
  order,
  prerequisiteModuleIds: module.prerequisites,
  chapterIds: chapters
    .filter(chapter => chapter.moduleId === module.id)
    .sort((left, right) => left.order - right.order)
    .map(chapter => chapter.id),
  englishLevel: module.englishLevel,
  projectGuidance: module.projectGuidance
}));

const output = {
  source: { chapters: legacyChapters.length },
  concepts: [
    ...(foundationsPhase2.concepts ?? []),
    ...(oopPhase3.concepts ?? []),
    ...(javaCorePhase4.concepts ?? []),
    ...(ioCliPhase5.concepts ?? []),
    ...(algorithmsEngineeringPhase6.concepts ?? []),
    ...(httpIntegrationPhase7.concepts ?? []),
    ...(relationalDataPhase8.concepts ?? []),
    ...(applicationDesignPhase9.concepts ?? []),
    ...(springApiPhase10.concepts ?? []),
    ...(apiSecurityQualityPhase11.concepts ?? []),
    ...(containersIntegrationDataPhase12.concepts ?? []),
    ...(concurrencyNetworkTuiPhase13.concepts ?? []),
    ...(productionDeliveryPhase14.concepts ?? []),
    ...(syncResiliencePhase15.concepts ?? []),
    ...(messagingEdaPhase16.concepts ?? []),
    ...(distributedConsistencyPhase17.concepts ?? []),
    ...(intermediateProjectsPhase18.concepts ?? []),
    ...(professionalFinalPhase19.concepts ?? [])
  ],
  glossary,
  modules,
  chapters
};

const serialized = `${JSON.stringify(output)}\n`;
await writeFile(resolve(root, 'platform/src/content/generated-course.json'), serialized);
await writeFile(resolve(root, 'platform/public/course-content.json'), serialized);
console.log(`Generated ${chapters.length} chapters and ${modules.length} modules.`);
