const fs = require('node:fs');
const vm = require('node:vm');

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const curriculum = fs.readFileSync('curriculum-v2.js', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const marked = fs.readFileSync('vendor/marked.umd.js', 'utf8');
const domPurify = fs.readFileSync('vendor/purify.min.js', 'utf8');
const markedLicense = fs.readFileSync('vendor/marked.LICENSE.md', 'utf8');
const domPurifyLicense = fs.readFileSync('vendor/DOMPurify.LICENSE', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
const glossaryBlock = app.match(/const glossaryTerms = \[([\s\S]*?)\n  \]\.map/);
const dataMatch = index.match(/<script type="application\/json" id="course-data">([\s\S]*?)<\/script>/);

if (!dataMatch) throw new Error('course-data não encontrado.');
if (!glossaryBlock) throw new Error('Glossário contextual não encontrado.');
const glossaryEntries = vm.runInNewContext(`[${glossaryBlock[1]}]`);

const inserted = [];
const dataElement = {
  textContent: dataMatch[1],
  insertAdjacentHTML(_position, html) { inserted.push(html); }
};
const document = {
  getElementById(id) { return id === 'course-data' ? dataElement : undefined; },
  querySelectorAll() { return []; }
};

vm.runInNewContext(curriculum, { document, console });
const chapters = JSON.parse(dataElement.textContent);
const ids = chapters.map(chapter => chapter.id);
const normalizeSearchText = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');
const springSearchIds = chapters.filter(chapter => normalizeSearchText(chapter.title).includes('spring')).map(chapter => chapter.id);
const templateIds = [...index.matchAll(/<template id="template-([^"]+)"/g)].map(match => match[1]);
inserted.forEach(html => {
  const match = html.match(/^<template id="template-([^"]+)"/);
  if (!match) throw new Error('Template de expansão malformado.');
  templateIds.push(match[1]);
  if ((html.match(/<template\b/g) || []).length !== (html.match(/<\/template>/g) || []).length) {
    throw new Error(`Template ${match[1]} não fecha corretamente.`);
  }
});

const duplicateChapterIds = ids.filter((id, indexOfId) => ids.indexOf(id) !== indexOfId);
const duplicateTemplateIds = templateIds.filter((id, indexOfId) => templateIds.indexOf(id) !== indexOfId);
const missingTemplates = ids.filter(id => !templateIds.includes(id));
const missingChapters = templateIds.filter(id => !ids.includes(id));
const allCourseHtml = index + '\n' + inserted.join('\n');
const prerequisiteIds = [...allCourseHtml.matchAll(/class="prereq-tag"\s+href="#([^"]+)"/g)].map(match => match[1]);
const invalidPrerequisites = [...new Set(prerequisiteIds.filter(id => !ids.includes(id)))];
const chapterPosition = new Map(ids.map((id, position) => [id, position]));
const forwardPrerequisites = [];
for (const template of allCourseHtml.matchAll(/<template id="template-([^"]+)">([\s\S]*?)<\/template>/g)) {
  const chapterId = template[1];
  for (const prerequisite of template[2].matchAll(/class="prereq-tag"\s+href="#([^"]+)"/g)) {
    if (chapterPosition.get(prerequisite[1]) >= chapterPosition.get(chapterId)) forwardPrerequisites.push(`${chapterId} -> ${prerequisite[1]}`);
  }
}
const invalidExpansionLinks = [...new Set(inserted.flatMap(html => [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1])).filter(id => !ids.includes(id)))];
const glossaryCount = (glossaryBlock[1].match(/^    \['/gm) || []).length;
const invalidGlossaryChapters = glossaryEntries.filter(entry => !ids.includes(entry[2])).map(entry => `${entry[0]} -> ${entry[2]}`);
const duplicateGlossaryTerms = glossaryEntries.map(entry => normalizeSearchText(entry[0])).filter((term, index, terms) => terms.indexOf(term) !== index);
const expansionById = new Map(inserted.map(html => [html.match(/^<template id="template-([^"]+)"/)?.[1], html]));
const expansionsWithoutFoundation = [...expansionById].filter(([, html]) => !html.includes('class="concept-foundation"')).map(([id]) => id);
const expansionsWithCodeBeforeFoundation = [...expansionById].filter(([, html]) => {
  const firstCode = html.indexOf('<pre class="code">');
  const foundation = html.indexOf('class="concept-foundation"');
  return firstCode >= 0 && (foundation < 0 || firstCode < foundation);
}).map(([id]) => id);
const assertOrdered = (html, labels, chapterId) => {
  let previous = -1;
  labels.forEach(label => {
    const current = html.indexOf(label);
    if (current < 0) throw new Error(`Marco pedagógico ausente em ${chapterId}: ${label}`);
    if (current <= previous) throw new Error(`Progressão pedagógica fora de ordem em ${chapterId}: ${label}`);
    previous = current;
  });
};
const bannedFragments = [
  '#resultado.id',
  'todos os 65 capítulos',
  'Dez perguntas cobrindo',
  'curl -fsSL https://get.docker.com | sh',
  'Java foi desenhada como uma linguagem <strong>100% orientada a objetos</strong>'
];

if (chapters.length !== 128) throw new Error(`Esperados 128 capítulos; encontrados ${chapters.length}.`);
if (inserted.length !== 16) throw new Error(`Esperadas 16 expansões; encontradas ${inserted.length}.`);
if (duplicateChapterIds.length) throw new Error(`IDs de capítulo duplicados: ${duplicateChapterIds.join(', ')}`);
if (duplicateTemplateIds.length) throw new Error(`IDs de template duplicados: ${duplicateTemplateIds.join(', ')}`);
if (missingTemplates.length) throw new Error(`Capítulos sem template: ${missingTemplates.join(', ')}`);
if (missingChapters.length) throw new Error(`Templates sem capítulo: ${missingChapters.join(', ')}`);
if (invalidPrerequisites.length) throw new Error(`Pré-requisitos inexistentes: ${invalidPrerequisites.join(', ')}`);
if (forwardPrerequisites.length) throw new Error(`Pré-requisitos aparecem depois do capítulo: ${forwardPrerequisites.join(', ')}`);
if (invalidExpansionLinks.length) throw new Error(`Pontes curriculares apontam para capítulos inexistentes: ${invalidExpansionLinks.join(', ')}`);
if (glossaryCount !== 111) throw new Error(`Esperados 111 termos no glossário; encontrados ${glossaryCount}.`);
if (invalidGlossaryChapters.length) throw new Error(`Conceitos apontam para capítulos inexistentes: ${invalidGlossaryChapters.join(', ')}`);
if (duplicateGlossaryTerms.length) throw new Error(`Termos duplicados no mapa de domínio: ${duplicateGlossaryTerms.join(', ')}`);
for (const term of ['CLI', 'Scanner', 'EOF', 'Socket', 'Protocolo', 'Virtual thread', 'MVCC', 'PKCE', 'SLO', 'SBOM', 'DLT', 'PACELC', 'BFF']) {
  if (!glossaryBlock[1].includes(`['${term}'`)) throw new Error(`Termo conceitual ausente do glossário: ${term}`);
}
if (expansionsWithoutFoundation.length) throw new Error(`Expansões sem base conceitual: ${expansionsWithoutFoundation.join(', ')}`);
if (expansionsWithCodeBeforeFoundation.length) throw new Error(`Expansões mostram código antes da base conceitual: ${expansionsWithCodeBeforeFoundation.join(', ')}`);
if (!springSearchIds.includes('spring-core') || springSearchIds.includes('lombok')) throw new Error('A busca por título não isola corretamente os capítulos de Spring.');
if (!normalizeSearchText('Exceções').includes(normalizeSearchText('excecoes'))) throw new Error('A busca por título não ignora acentos.');
if (chapters.some((chapter, index) => chapter.index !== index)) throw new Error('Índices de capítulos não são contíguos.');
if ((index.match(/<template\b/g) || []).length !== (index.match(/<\/template>/g) || []).length) throw new Error('Templates do index.html não estão balanceados.');
for (const fragment of bannedFragments) if (allCourseHtml.includes(fragment)) throw new Error(`Conteúdo obsoleto reapareceu: ${fragment}`);
if (!app.includes('buildCourseNavigation();')) throw new Error('Sumário dinâmico não está habilitado.');
if (!app.includes('normalizeSearchText(chapter.title).includes')) throw new Error('A busca não está limitada aos títulos dos capítulos.');
if (!index.includes('[hidden] { display: none !important; }')) throw new Error('O CSS pode sobrescrever os resultados ocultos da busca.');
if (!app.includes('reviewPlan') || !app.includes('data-review-plan-toggle')) throw new Error('Planejamento diário da revisão não está habilitado.');
if (!app.includes('buildReviewQuestion') || !app.includes('data-review-option') || !app.includes('answerReview')) throw new Error('Revisões de múltipla escolha não estão habilitadas.');
if (app.includes('data-review-rate')) throw new Error('A autoavaliação antiga ainda está ligada à revisão.');
if (!index.includes('data-hub-panel="learning"') || !index.includes('data-learning-view="overview"') || !index.includes('data-learning-view="errors"') || !index.includes('data-learning-view="diagnostic"') || !index.includes('data-learning-view="projects"')) throw new Error('A central de domínio está incompleta.');
if (!app.includes('recordLearningEvidence') || !app.includes('masteryStatus') || !app.includes('renderMasteryOverview')) throw new Error('O mapa de domínio unificado não está habilitado.');
if (!app.includes('injectRetrievalPrompt') || !app.includes('data-retrieval-option') || !app.includes("source: 'retrieval'")) throw new Error('A recuperação antes da explicação não está habilitada.');
if (!app.includes('renderErrorNotebook') || !app.includes('data-error-option') || !app.includes('answerErrorPractice')) throw new Error('O caderno automático de erros não está habilitado.');
if (!app.includes('startDiagnostic') || !app.includes('data-diagnostic-option') || !app.includes('weakConceptTerms') || !app.includes('strongConceptTerms')) throw new Error('O teste diagnóstico está incompleto.');
if (!app.includes('projectReadiness') || !app.includes('renderProjectReadiness') || !app.includes('data-learning-chapter')) throw new Error('A prontidão por projeto não está habilitada.');
for (const stateField of ['normalized.mastery', 'normalized.errors', 'normalized.retrieval', 'normalized.diagnostic']) {
  if (!app.includes(stateField)) throw new Error(`Campo persistido ausente no modelo de aprendizagem: ${stateField}`);
}
if (!app.includes('normalized.version = 9') || !app.includes('version: 9')) throw new Error('Versão do estado e do backup está inconsistente.');
if (!index.includes('<script src="vendor/marked.umd.js"></script>') || !index.includes('<script src="vendor/purify.min.js"></script>')) throw new Error('As bibliotecas locais do editor Markdown não estão ligadas ao index.');
if (!marked.includes('marked v18.0.7') || !domPurify.includes('DOMPurify 3.4.12')) throw new Error('As versões vendorizadas do editor Markdown são inesperadas.');
if (!markedLicense.toLowerCase().includes('mit license') || !domPurifyLicense.includes('Apache License')) throw new Error('As licenças das bibliotecas Markdown estão ausentes ou incompletas.');
if (!app.includes('renderNotePreview') || !app.includes('DOMPurify.sanitize') || !app.includes('data-markdown-task') || !app.includes('applyMarkdownAction')) throw new Error('O editor Markdown seguro está incompleto.');
if (!index.includes('data-note-view="edit"') || !index.includes('data-note-view="split"') || !index.includes('data-note-view="preview"')) throw new Error('Os modos do editor Markdown estão incompletos.');
if (!index.includes('<script src="curriculum-v2.js"></script>')) throw new Error('curriculum-v2.js não está ligado ao index.');
if (!serviceWorker.includes("'./curriculum-v2.js'")) throw new Error('A expansão curricular não está no cache offline.');
if (!serviceWorker.includes("'./vendor/marked.umd.js'") || !serviceWorker.includes("'./vendor/purify.min.js'")) throw new Error('O editor Markdown não está disponível offline.');
if (!serviceWorker.includes("stack-completa-java-v17")) throw new Error('O cache offline não foi renovado para o editor Markdown.');
if (!manifest.shortcuts?.some(shortcut => shortcut.url === './index.html?hub=learning')) throw new Error('O atalho instalável para o mapa de domínio está ausente.');
for (const removedMarker of ['experience-v3.js', 'STACK_EXPERIENCE_DATA', 'data-hub-panel="startup"', 'simulation-stage', 'visual-lab-stage']) {
  if (`${index}\n${app}\n${serviceWorker}`.includes(removedMarker)) throw new Error(`Implementação removida reapareceu: ${removedMarker}`);
}

assertOrdered(expansionById.get('entrada-console'), ['Camada 1 — seu primeiro uso de Scanner', 'Camada 2 — linha, token e buffer', 'Camada 3 — ler, normalizar, converter e validar', 'Camada 4 — quando a entrada termina', 'Aprofundamento — dinheiro e formato regional', 'Depois do Scanner: arquivos, sockets e protocolos'], 'entrada-console');
assertOrdered(expansionById.get('java-21-profundo'), ['Virtual threads: primeiro o caso mínimo', 'Aprofundamento — executor, resultado, timeout e cancelamento'], 'java-21-profundo');
assertOrdered(expansionById.get('frontend-aplicacao'), ['Camada 1 — um estado local simples', 'Camada 2 — estados remotos explícitos'], 'frontend-aplicacao');
assertOrdered(expansionById.get('security-oidc'), ['Quatro mecanismos que não são equivalentes', '.csrf(csrf -> csrf.disable())'], 'security-oidc');

console.log(`OK: ${chapters.length} capítulos, ${templateIds.length} templates, ${inserted.length} expansões com base conceitual, ${glossaryCount} termos e ${prerequisiteIds.length} pré-requisitos verificados.`);
