import { access, readFile } from 'node:fs/promises';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readText(path) {
  return readFile(path, 'utf8');
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const [packageJson, readme, progressDoc, finalReleaseValidator] = await Promise.all([
  readJson('package.json'),
  readText('README.md'),
  readText('docs/internal/implementation-progress.md'),
  readText('scripts/validate-final-release.mjs')
]);

const requiredPhaseReports = [
  'phase-0-discovery.md',
  'phase-1-infrastructure.md',
  'phase-2-foundations.md',
  'phase-3-oop.md',
  'phase-4-java-core.md',
  'phase-5-io-cli-process.md',
  'phase-6-algorithms-engineering.md',
  'phase-7-http-integration.md',
  'phase-8-relational-data-jdbc.md',
  'phase-9-application-design.md',
  'phase-10-spring-api.md',
  'phase-11-api-security-quality.md',
  'phase-12-containers-integration-data.md',
  'phase-13-concurrency-network-tui.md',
  'phase-14-production-delivery.md',
  'phase-15-sync-resilience.md',
  'phase-16-messaging-eda.md',
  'phase-17-distributed-consistency.md',
  'phase-18-intermediate-projects.md',
  'phase-19-professional-final.md',
  'phase-20-final-release-hardening.md',
  'phase-21-deployment-readiness.md',
  'phase-22-maintenance-guardrails.md',
  'phase-23-progress-contract.md',
  'phase-24-ui-accessibility-contract.md',
  'phase-25-learning-tools-contract.md',
  'phase-26-catalog-integrity.md',
  'phase-27-assessment-integrity.md',
  'phase-28-resource-integrity.md',
  'phase-29-technical-english-contract.md',
  'phase-30-traceability-contract.md',
  'phase-31-master-spec-closure.md'
];

for (const file of requiredPhaseReports) {
  await access(`docs/internal/master-audit/${file}`);
  assert(progressDoc.includes(file), `Progresso interno não referencia relatório obrigatório: ${file}`);
  assert(finalReleaseValidator.includes(file), `validate:final-release não exige relatório obrigatório: ${file}`);
}

const requiredGates = new Map([
  ['validate:fidelity', 'node scripts/validate-content-fidelity.mjs'],
  ['validate:english', 'node scripts/validate-english.mjs'],
  ['validate:technical-english', 'node scripts/validate-technical-english-contract.mjs'],
  ['validate:depth', 'npm run audit:master && node scripts/validate-pedagogical-depth.mjs'],
  ['validate:platform', 'node validate-platform.mjs'],
  ['validate:ui', 'node scripts/validate-ui-accessibility-contract.mjs'],
  ['validate:learning-tools', 'node scripts/validate-learning-tools-contract.mjs'],
  ['validate:catalog', 'node scripts/validate-catalog-integrity.mjs'],
  ['validate:assessment', 'node scripts/validate-assessment-integrity.mjs'],
  ['validate:resources', 'node scripts/validate-resource-integrity.mjs'],
  ['validate:progress', 'node scripts/validate-progress-contract.mjs'],
  ['validate:deployment', 'node scripts/validate-deployment-readiness.mjs'],
  ['validate:final-release', 'node scripts/validate-final-release.mjs'],
  ['validate:traceability', 'node scripts/validate-traceability-contract.mjs'],
  ['validate:master-spec', 'node scripts/validate-master-spec-closure.mjs'],
  ['validate:maintenance', 'node scripts/validate-maintenance-guardrails.mjs']
]);

for (const [script, command] of requiredGates) {
  assert(packageJson.scripts[script] === command, `Script ${script} ausente ou divergente.`);
  assert(packageJson.scripts.validate.includes(`npm run ${script}`), `npm run validate não executa ${script}.`);
  assert(finalReleaseValidator.includes(`npm run ${script}`) || script === 'validate:fidelity' || script === 'validate:english' || script === 'validate:depth' || script === 'validate:platform', `validate:final-release não protege presença de ${script}.`);
}

for (const marker of [
  'Current phase: Auditoria Mestre — Fase 31 de Fechamento da Especificação Mestre concluída',
  'A Fase 20 adiciona um gate final de release',
  'A Fase 21 adiciona o gate de deploy/PWA',
  'A Fase 22 adiciona guardrails de manutenção',
  'A Fase 23 adiciona o gate de contrato de progresso',
  'A Fase 24 adiciona o gate de UI/acessibilidade',
  'A Fase 25 adiciona o gate das ferramentas de estudo',
  'A Fase 26 adiciona o gate de integridade do catálogo e offline',
  'A Fase 27 adiciona o gate de integridade das avaliações',
  'A Fase 28 de Integridade dos Recursos adiciona o gate de integridade dos recursos',
  'A Fase 29 adiciona o gate de contrato de inglês técnico contextual',
  'A Fase 30 adiciona o gate de rastreabilidade viva',
  'A Fase 31 adiciona o gate de fechamento da especificação mestre',
  'phase-31-master-spec-closure.md'
]) {
  assert(progressDoc.includes(marker), `Progresso interno perdeu marcador rastreável: ${marker}`);
}

const requiredTraceabilityRows = [
  ['Final release gate and Supabase removal', '20', 'validate:final-release'],
  ['GitHub Pages/PWA deployment readiness', '21', 'validate:deployment'],
  ['Maintenance drift guardrails', '22', 'validate:maintenance'],
  ['Progress schema, IndexedDB and backup contract', '23', 'validate:progress'],
  ['UI/accessibility contract', '24', 'validate:ui'],
  ['Study tools contract', '25', 'validate:learning-tools'],
  ['Catalog/offline artifact integrity', '26', 'validate:catalog'],
  ['Assessment integrity', '27', 'validate:assessment'],
  ['External resource integrity', '28', 'validate:resources'],
  ['Contextual technical English contract', '29', 'validate:technical-english'],
  ['Living traceability contract', '30', 'validate:traceability'],
  ['Master specification closure', '31', 'validate:master-spec']
];

for (const [requirement, phase, evidence] of requiredTraceabilityRows) {
  assert(progressDoc.includes(`| ${requirement} | completed | ${phase} |`), `Matriz de rastreabilidade não tem linha da Fase ${phase}: ${requirement}`);
  assert(progressDoc.includes(evidence), `Matriz de rastreabilidade não aponta evidência ${evidence}.`);
}

for (const marker of [
  '# java4br',
  '[Acessar o curso]',
  'Rodando localmente',
  'npm run validate',
  'docs/internal/'
]) {
  assert(readme.includes(marker), `README público perdeu marcador essencial: ${marker}`);
}

assert(packageJson.scripts.validate.indexOf('npm run validate:final-release') < packageJson.scripts.validate.indexOf('npm run validate:traceability'), 'validate:traceability deve rodar após validate:final-release.');
assert(packageJson.scripts.validate.indexOf('npm run validate:traceability') < packageJson.scripts.validate.indexOf('npm run validate:master-spec'), 'validate:master-spec deve rodar após validate:traceability.');
assert(packageJson.scripts.validate.indexOf('npm run validate:master-spec') < packageJson.scripts.validate.indexOf('npm run validate:maintenance'), 'validate:master-spec deve rodar antes dos guardrails finais de manutenção.');

console.log(`OK: rastreabilidade viva protegida — ${requiredPhaseReports.length} relatórios, ${requiredGates.size} gates e ${requiredTraceabilityRows.length} linhas críticas sincronizadas.`);
