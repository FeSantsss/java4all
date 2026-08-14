const fs = require('node:fs');
const vm = require('node:vm');

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const curriculum = fs.readFileSync('curriculum-v2.js', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const dataMatch = index.match(/<script type="application\/json" id="course-data">([\s\S]*?)<\/script>/);

if (!dataMatch) throw new Error('course-data não encontrado.');

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
if (chapters.some((chapter, index) => chapter.index !== index)) throw new Error('Índices de capítulos não são contíguos.');
if ((index.match(/<template\b/g) || []).length !== (index.match(/<\/template>/g) || []).length) throw new Error('Templates do index.html não estão balanceados.');
for (const fragment of bannedFragments) if (allCourseHtml.includes(fragment)) throw new Error(`Conteúdo obsoleto reapareceu: ${fragment}`);
if (!app.includes('buildCourseNavigation();')) throw new Error('Sumário dinâmico não está habilitado.');
if (!app.includes('reviewPlan') || !app.includes('data-review-plan-toggle')) throw new Error('Planejamento diário da revisão não está habilitado.');
if (!index.includes('<script src="curriculum-v2.js"></script>')) throw new Error('curriculum-v2.js não está ligado ao index.');
if (!serviceWorker.includes("'./curriculum-v2.js'")) throw new Error('A expansão curricular não está no cache offline.');

console.log(`OK: ${chapters.length} capítulos, ${templateIds.length} templates, ${inserted.length} expansões e ${prerequisiteIds.length} referências verificadas.`);
