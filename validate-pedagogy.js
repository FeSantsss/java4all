const fs = require('node:fs');
const plan = require('./docs/internal/pedagogy-plan');

const chapters = JSON.parse(fs.readFileSync('platform/public/content/catalog.json', 'utf8')).chapters;
const moduleIds = plan.modules.map(module => module.id);
const moduleById = new Map(plan.modules.map(module => [module.id, module]));
const modulePosition = new Map(moduleIds.map((id, indexOfModule) => [id, indexOfModule]));

if (new Set(moduleIds).size !== moduleIds.length) throw new Error('IDs de modulo duplicados.');

for (const module of plan.modules) {
  for (const prerequisite of module.prerequisites) {
    if (!moduleById.has(prerequisite)) throw new Error(`Modulo ${module.id} aponta para pre-requisito inexistente: ${prerequisite}`);
    if (modulePosition.get(prerequisite) >= modulePosition.get(module.id)) throw new Error(`Modulo ${module.id} possui pre-requisito adiante na trilha: ${prerequisite}`);
  }
}

const guidanceOrder = ['supported', 'guided', 'bounded', 'independent'];
let lastEnglishLevel = -1;
let lastGuidanceLevel = -1;
for (const module of plan.modules) {
  if (module.englishLevel < lastEnglishLevel) throw new Error(`Carga de ingles regride em ${module.id}.`);
  const guidanceLevel = guidanceOrder.indexOf(module.projectGuidance);
  if (guidanceLevel < lastGuidanceLevel) throw new Error(`Ajuda de projeto aumenta novamente em ${module.id}.`);
  lastEnglishLevel = module.englishLevel;
  lastGuidanceLevel = guidanceLevel;
}

const ancestorsOf = moduleId => {
  const ancestors = new Set();
  const visit = id => {
    for (const prerequisite of moduleById.get(id).prerequisites) {
      if (ancestors.has(prerequisite)) continue;
      ancestors.add(prerequisite);
      visit(prerequisite);
    }
  };
  visit(moduleId);
  return ancestors;
};

for (const [moduleId, requirements] of Object.entries(plan.requiredAncestry)) {
  const ancestors = ancestorsOf(moduleId);
  for (const requirement of requirements) {
    if (!ancestors.has(requirement)) throw new Error(`${moduleId} nao depende de ${requirement}.`);
  }
}

const currentPhaseIds = new Set(chapters.map(chapter => chapter.phaseId));
for (const phaseId of currentPhaseIds) {
  if (!plan.legacyPhaseMappings[phaseId]) throw new Error(`Fase atual sem destino: ${phaseId}`);
}

const mappedChapters = chapters.map(chapter => {
  const targetModule = plan.chapterOverrides[chapter.id] || plan.legacyPhaseMappings[chapter.phaseId];
  if (!moduleById.has(targetModule)) throw new Error(`Capitulo ${chapter.id} possui destino invalido: ${targetModule}`);
  return { id: chapter.id, targetModule };
});

const chapterIds = new Set(chapters.map(chapter => chapter.id));
for (const chapterId of Object.keys(plan.chapterOverrides)) {
  if (!chapterIds.has(chapterId)) throw new Error(`Override aponta para capitulo inexistente: ${chapterId}`);
}
for (const chapterId of Object.keys(plan.splitRequirements)) {
  if (!chapterIds.has(chapterId)) throw new Error(`Divisao planejada aponta para capitulo inexistente: ${chapterId}`);
}

const targetCounts = new Map(moduleIds.map(id => [id, 0]));
for (const chapter of mappedChapters) targetCounts.set(chapter.targetModule, targetCounts.get(chapter.targetModule) + 1);

console.log(`OK: ${chapters.length} capitulos mapeados em ${plan.modules.length} modulos sem ciclos ou pre-requisitos futuros entre modulos.`);
console.log([...targetCounts].map(([id, count]) => `${id}:${count}`).join(', '));
