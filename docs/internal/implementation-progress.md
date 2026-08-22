# java4br - Implementation Progress

## Master specification

Status: reaberto por uma especificação de auditoria pedagógica mais rigorosa

Last updated: 2026-08-22

Current phase: Auditoria Mestre — Fase 31 de Fechamento da Especificação Mestre concluída; reconstrução curricular completa, protegida por gates de release/deploy/manutenção/progresso/UI/estudo/catálogo/avaliação/recursos/inglês técnico/rastreabilidade/spec mestre

Overall state: A plataforma React/Tailwind, o corpus separado, a persistência e o PWA estão implementados e tecnicamente estáveis. As Fases 0 e 1 fornecem inventário integral, proveniência, schema semântico e um gate contra aprovação falsa. As Fases 2 a 19 reconstruíram Fundamentos, POO, Java Core, I/O/CLI/Process API, Algoritmos/Engenharia inicial, Estruturas de Dados Avançadas, projetos intermediários, HTTP/integração, SQL/JDBC, Design de Aplicação, Spring/API, Segurança/Qualidade de APIs, Containers/Testes/Dados avançados, Concorrência/Redes/TUI, Produção/CI/CD, Integração Síncrona, Resiliência/Observabilidade, Mensageria, SNS/SQS, Kafka, EDA, Consistência Distribuída, Outbox/Inbox, Saga, revisão técnica, ADR, processo ágil, mapa sistêmico, projeto integrador e revisão diagnóstica final. A Fase 20 adiciona um gate final de release para impedir divergência entre auditoria, documentação, artefatos gerados, validação e remoção de Supabase. A Fase 21 adiciona o gate de deploy/PWA para proteger GitHub Pages, Vite, dist, manifest e service worker. A Fase 22 adiciona guardrails de manutenção para impedir fontes autorais soltas, monólitos legados reintroduzidos e artefatos gerados tratados como fonte. A Fase 23 adiciona o gate de contrato de progresso para proteger schema v11, IndexedDB, fallback local, migração legada e backup/importação. A Fase 24 adiciona o gate de UI/acessibilidade para proteger skip link, foco, temas, redução de movimento, Central modal, Markdown, axe e responsividade. A Fase 25 adiciona o gate das ferramentas de estudo para proteger busca por título, revisão, glossário, diagnóstico, caderno de erros, prontidão de projetos e Java Lab. A Fase 26 adiciona o gate de integridade do catálogo e offline para proteger sincronia entre artefatos gerados, catálogo público, glossário, inventário de hashes, HTMLs em `dist/` e precache do service worker. A Fase 27 adiciona o gate de integridade das avaliações para proteger quizzes, exercícios, projetos, racionais de alternativas, critérios de aceite e matrizes de conhecimento. A Fase 28 de Integridade dos Recursos adiciona o gate de integridade dos recursos para proteger metadados, relevância, HTTPS, prioridade oficial/normativa e bloqueio contra links genéricos ou repetidos em massa. A Fase 29 adiciona o gate de contrato de inglês técnico contextual para proteger 129 atividades contextuais de inglês técnico, níveis 0-3, progressão por módulo, pistas de código, leitura sem tradução solta, produção de evidência, persistência e integração com a Central (Fase 29 de Inglês Técnico Contextual). A Fase 30 adiciona o gate de rastreabilidade viva para manter README, progresso interno, matriz de requisitos, relatórios de auditoria, `validate:final-release` e scripts `validate:*` sincronizados (Fase 30 de Rastreabilidade Viva). A Fase 31 adiciona o gate de fechamento da especificação mestre para cruzar os requisitos obrigatórios restantes com conteúdo aprovado, schema, matriz de capítulos, grafo, E2E e gates especializados. São 152 capítulos aprovados, 388 conceitos rastreados e zero capítulos em backlog. Evidências: `docs/internal/master-audit/phase-0-discovery.md`, `phase-1-infrastructure.md`, `phase-2-foundations.md`, `phase-3-oop.md`, `phase-4-java-core.md`, `phase-5-io-cli-process.md`, `phase-6-algorithms-engineering.md`, `phase-7-http-integration.md`, `phase-8-relational-data-jdbc.md`, `phase-9-application-design.md`, `phase-10-spring-api.md`, `phase-11-api-security-quality.md`, `phase-12-containers-integration-data.md`, `phase-13-concurrency-network-tui.md`, `phase-14-production-delivery.md`, `phase-15-sync-resilience.md`, `phase-16-messaging-eda.md`, `phase-17-distributed-consistency.md`, `phase-18-intermediate-projects.md`, `phase-19-professional-final.md`, `phase-20-final-release-hardening.md`, `phase-21-deployment-readiness.md`, `phase-22-maintenance-guardrails.md`, `phase-23-progress-contract.md`, `phase-24-ui-accessibility-contract.md`, `phase-25-learning-tools-contract.md`, `phase-26-catalog-integrity.md`, `phase-27-assessment-integrity.md`, `phase-28-resource-integrity.md`, `phase-29-technical-english-contract.md`, `phase-30-traceability-contract.md` e `phase-31-master-spec-closure.md`.

---

## Current project inventory

- Delivery: Vite 8, React 19, TypeScript 6 and Tailwind CSS 4 build the public `dist/`; GitHub Pages CI validates and deploys that artifact.
- Curriculum: 129 legacy chapters preserved plus 23 structured chapters, totaling 152 chapters across 20 prerequisite-aware modules.
- Learning content: 268 quizzes, 160 exercises, 14 migrated checklists, cumulative projects, official resources, and one contextual technical-English activity per chapter.
- Learning UI: contextual toolbar, command palette, navigation/search/practice/favorite filters, completion, favorites, Markdown notes, quizzes, checklists, spaced review, retrieval prompts, mastery evidence, error notebook, diagnostics, project readiness, achievements, activity, Pomodoro, local Java Lab, contextual technical English, and reading settings.
- Persistence: version 11 progress in IndexedDB `java4br-course`, complete validated backup/import, local fallback, and migration from earlier legacy IndexedDB/localStorage data.
- Delivery quality: system, real-white and restored high-contrast Study OS themes; visible focus; skip navigation; reduced motion; component-level overflow handling; and automated axe accessibility coverage.
- Offline: generated service worker precaches the application shell, runtime content index, catalog, glossary, and all 129 independent chapter HTML files; cache identity is `java4br-platform-v2`.
- External resources: 260 unique curated HTTPS URLs inventariadas pela auditoria mestre; o validador online percorre 262 URLs externas renderizadas e é executado novamente ao encerrar cada fase.
- Canonical legacy corpus: `platform/public/content/chapters` contains exactly 129 independent HTML files; catalog, glossary, per-file hashes, aggregate hashes, and the fidelity validator prove preservation without retaining a second monolithic source.

## Baseline validation

- `node validate-course.js`: passed - 128 chapters, 128 templates, 16 expansions, 111 glossary terms, and 225 prerequisites.
- `node --check app.js`: passed.
- `node --check curriculum-v2.js`: passed.
- `node --check sw.js`: passed.
- Git worktree before implementation: clean.
- Desktop render at 1440 x 1000: passed with Firefox headless.
- Mobile render at 390 x 844: passed with Firefox headless.
- Browser automation limitation: the prescribed `agent-browser` binary is unavailable; Firefox headless was used as the visual fallback.
- Build/typecheck/lint: not available in the current static architecture because there is no `package.json`, build system, TypeScript configuration, or linter.

---

## Execution phases

### Phase 1 - Current project audit

Status: completed

#### Objective

Establish the technical, content, persistence, visual, and pedagogical baseline before any product change.

#### Requirements covered

- Sections 0.1, 0.17, 0.18, 0.20, 0.21, and 17.
- Initial architecture, content, progress, responsive, and regression analysis.

#### Prerequisites

- Full reading of the master specification.
- Clean identification of the current repository state.

#### Scope

- Repository inventory, content counts, state schema, validation tooling, branding surface, visual baseline, and confirmed curriculum gaps.

#### Out of scope

- Product code, curriculum order, chapter rewrites, framework migration, and persistence changes.

#### Risks

- Treating existing breadth as evidence of the depth required by the new specification.
- Losing legacy chapter IDs or state keys during later migrations.

#### Expected files/areas affected

- `docs/internal/implementation-progress.md` only.

#### Validation required

- Existing validator and syntax checks.
- Desktop/mobile render baseline.
- Content and persistence inventory.

#### Result

The current application is functional and structurally validated. The audit identified the monolithic architecture, legacy identity and storage names, limited quiz coverage, absent resource system, beige light theme, missing early object associations, and insufficient HTTP/API and technical-English progression.

#### Major changes

- Created the implementation memory, phase contracts, and requirement traceability matrix.

#### Validation

- Structural validator: passed.
- JavaScript syntax: passed.
- Desktop/mobile smoke render: passed with Firefox headless.
- Known regressions: none.

#### Known issues

- Automated interactive browser assertions are not available until an appropriate browser automation binary is installed or added to the future toolchain.

#### Remaining work

- All implementation phases below.

#### Phase checkpoint

Status: completed

Requirements satisfied: initial audit, inventory, risks, baseline validation, and operational tracking.

Known regressions: none.

Deferred: implementation work begins in Phase 2.

Next phase: Phase 2 - Identity and legacy compatibility.

---

### Phase 2 - Identity and legacy compatibility

Status: completed

#### Objective

Rename the public product to java4br, remove “Stack Completa”, state that technical English is integrated into the course, and preserve access to legacy progress and backups.

#### Requirements covered

- Rename java4all to java4br across public and runtime surfaces.
- Remove “Stack Completa”.
- Update README and PWA identity.
- Publicly describe integrated technical English without discussing AI production or claiming personal authorship.
- Sections 4, 15, and 0.18 as they apply to renamed persistence identifiers.

#### Prerequisites

- Completed legacy identity and persistence inventory from Phase 1.

#### Scope

- README, document metadata, visible brand, manifest, icon accessibility label, backup metadata/filename, service-worker cache identity, and compatible lookup/migration of legacy storage.

#### Out of scope

- React/Tailwind migration, white theme, curriculum restructuring, chapter rewrites, and new learning features.

#### Risks

- Renaming the IndexedDB database or localStorage key without migration could strand existing progress.
- Changing the public repository URL before the actual GitHub Pages location exists could create a broken link.

#### Expected files/areas affected

- `README.md`, `index.html`, `app.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `validate-course.js`.

#### Validation required

- Legacy-state compatibility tests, structural validator, syntax checks, identity search, PWA asset checks, and desktop/mobile smoke render.

#### Result

The visible product, PWA, document title, backup, notifications, storage namespace, and offline cache now use java4br. The README explicitly presents contextual technical English as part of the course. Existing version 9 data is discovered and migrated from both the legacy IndexedDB database and legacy localStorage key.

#### Major changes

- `README.md`: java4br identity, integrated technical-English description, and updated persistence documentation.
- `index.html`, `manifest.webmanifest`, `icon.svg`: visible, document, PWA, and accessibility identity.
- `app.js`: java4br storage/backup identity and verified legacy IndexedDB/localStorage migration path.
- `sw.js`: java4br cache namespace with cleanup of obsolete java4br and legacy cache versions.
- `validate-course.js`: identity, technical-English presence, legacy progress compatibility, and cache migration assertions.

#### Validation

- `node validate-course.js`: passed with all 128 chapters and 225 prerequisites preserved.
- `node --check app.js`: passed.
- `node --check curriculum-v2.js`: passed.
- `node --check sw.js`: passed.
- `git diff --check`: passed.
- Fresh-profile desktop render at 1440 x 1000: passed; java4br identity and full chapter rendered.
- Fresh-profile mobile render at 390 x 844: passed; chapter and controls rendered without phase-specific regression.
- Legacy IndexedDB fixture: passed; one completed chapter and `lastChapter=primeiro-programa` restored as 1% progress on chapter 2.
- Legacy localStorage fixture: passed; two completed chapters and `lastChapter=variaveis-tipos` restored as 2% progress on chapter 3.
- Offline application assets: browser requests for the document, local vendor scripts, curriculum, application script, service worker, manifest, and icon returned HTTP 200 during smoke validation.
- Known regressions: none.

#### Known issues

- The canonical deployment URL must remain the currently working java4all URL until a java4br GitHub Pages endpoint is actually available; the displayed product identity can change independently.
- Automated browser interaction still uses Firefox headless because `agent-browser` is unavailable in the environment.

#### Remaining work

- The React-era state schema and migration fixtures remain in Phase 6; this phase completed the identity-bound compatibility path only.

#### Phase checkpoint

Status: completed

Requirements satisfied: java4br identity, removal of the public “Stack Completa” label, README/PWA/backup update, explicit technical-English positioning, and migration of legacy browser progress.

Known regressions: none.

Deferred: verified deployment URL rename and the broader versioned progress redesign.

Next phase: Phase 3 - Pedagogical architecture and content model.

---

### Phase 3 - Pedagogical architecture and content model

Status: completed

#### Objective

Design the dependency graph, chapter contract, progressive project guidance, assessment model, complementary-resource model, and technical-English levels before migrating or expanding content.

#### Requirements covered

- Sections 1, 5 through 8, 11 through 14, and 18.
- Problem-to-fundamentals-to-abstraction sequencing.
- Concept-level quizzes, cumulative projects, intuitive-first explanations, reasoning-first exercises, and progressive English exposure.

#### Prerequisites

- Current content inventory and stable chapter IDs.

#### Scope

- Curriculum graph, content schema, resource schema, question schema, project guidance levels, English exposure levels, and migration mapping for all existing chapters.

#### Out of scope

- Bulk content rewriting and UI migration.

#### Risks

- Reordering titles without proving prerequisites.
- Designing a schema that cannot preserve the full existing HTML content.

#### Expected files/areas affected

- Internal architecture documents, content schemas, curriculum validation tooling, and content inventory artifacts.

#### Validation required

- Graph validation, forward-prerequisite checks, content inventory comparison, and manual pedagogical review.

#### Result

Created an executable 20-module target graph, mapped all 128 current chapters through phase defaults and explicit overrides, marked mixed chapters that require actual splitting, and defined the structured entities and validation invariants for chapters, concepts, content blocks, assessments, projects, resources, and technical-English activities.

#### Major changes

- `docs/internal/pedagogical-architecture.md`: target progression, prerequisite corrections, project lanes, assessment coverage, and English progression.
- `docs/internal/content-model.md`: stable IDs, typed blocks, entities, migration boundary, and validation invariants.
- `docs/internal/pedagogy-plan.js`: executable module graph, chapter mapping, split requirements, and critical ancestry.
- `validate-pedagogy.js`: graph, coverage, monotonic progression, override, and split-plan validation.
- `README.md`: documented both curriculum validators.

#### Validation

- `node validate-pedagogy.js`: passed - 128 chapters mapped into 20 modules, no cycles or future prerequisites.
- Critical ancestry: Spring depends on HTTP/JDBC/application design; TUI/network path depends on I/O; EDA depends on synchronous integration/concurrency/relational data; distributed consistency depends on EDA and resilience.
- English levels: monotonic from contextual exposure to professional autonomy.
- Project guidance: monotonic from supported to independent.
- `node validate-course.js`: passed; current content remained unchanged.
- Syntax checks for the plan and validator: passed.
- `git diff --check`: passed.
- Known regressions: none.

#### Known issues

- Mapping identifies a destination, not pedagogical completion. The current HTTP path maps only one chapter into the early API-client module and therefore explicitly requires splitting/new content in Phase 9.
- Several current chapters mix levels and must be decomposed with progress rules before content movement.

#### Remaining work

- Implement the model in typed application code and migrate content module by module in Phases 4 and 5.

#### Phase checkpoint

Status: completed

Requirements satisfied: dependency-based target order, scalable content contract, concept-level assessment contract, progressive project guidance, contextual-English levels, full current chapter mapping, and graph validation.

Known regressions: none.

Deferred: content rewriting, target order activation, and UI migration.

Next phase: Phase 4 - React and Tailwind application foundation.

---

### Phase 4 - React and Tailwind application foundation

Status: completed

#### Objective

Create a typed React/Tailwind application architecture with reusable components and explicit separation of content, state, navigation, assessment, projects, resources, and learning systems.

#### Requirements covered

- Sections 2 and 16.
- Modern component architecture, organized folders, typing, maintainability, and scalable content delivery.

#### Prerequisites

- Approved pedagogical/content schema and complete legacy feature inventory.

#### Scope

- Build toolchain, React shell, Tailwind theme tokens, routing/navigation model, test/lint/typecheck setup, and adapters capable of rendering migrated legacy content safely.

#### Out of scope

- Full content migration, final visual refinement, and large curriculum additions.

#### Risks

- Recreating the monolith inside one React component.
- Introducing build/runtime dependencies that break GitHub Pages or offline delivery.

#### Expected files/areas affected

- Package/build configuration, `src/`, tests, static assets, deployment configuration, and service-worker strategy.

#### Validation required

- Build, typecheck, lint, unit tests, smoke render, accessibility baseline, and GitHub Pages path handling.

#### Result

Created an isolated Vite 8/React 19/TypeScript 6/Tailwind 4 application under `platform/`. It implements typed content contracts, reusable navigation and block rendering components, strict type checking, ESLint, Vitest/Testing Library, a real-white foundation theme, and an independent production build without replacing the validated legacy entry.

#### Major changes

- `package.json`, `package-lock.json`, TypeScript, Vite, Vitest, and ESLint configuration.
- `platform/src/content/schema.ts`: typed course/module/chapter/content-block runtime contracts.
- `platform/src/content/foundation-course.ts`: two-chapter parity fixture proving intuitive-first structured rendering.
- `platform/src/components/course/`: reusable sidebar, chapter, and content-block components.
- `platform/src/app/App.tsx`: small shell with deferred search filtering and transition-based chapter selection.
- `platform/src/styles.css`: Tailwind v4 tokens, real-white base, focus treatment, readable code, and responsive shell.
- Four tests covering identity, structured navigation, deferred-search behavior, reference resolution, and intuitive-first blocks.

#### Validation

- `npm run validate`: passed.
- TypeScript strict typecheck: passed.
- ESLint including React Hooks rules: passed.
- Vitest/Testing Library: 2 files, 4 tests passed.
- Vite production build: passed; 20 modules transformed.
- Production output: HTML 0.52 kB, CSS 15.23 kB (4.07 kB gzip), JavaScript 198.84 kB (62.94 kB gzip).
- Legacy structural validator: passed with 128 chapters and all prior feature markers.
- Pedagogical graph validator: passed with all 128 chapters mapped.
- React best-practices review: passed after separating immediate controlled-input state from deferred filtering; no component-local definitions, barrel imports, unnecessary memoization, effect-derived state, or accessibility regressions found.
- Fresh-profile desktop render at 1440 x 1000: passed.
- Fresh-profile mobile render at 390 x 844: passed with no visible horizontal overflow.
- Dependency audit during installation: 248 packages audited, 0 vulnerabilities reported.
- Known regressions: none; legacy public entry was not changed.

#### Known issues

- The foundation contains only two typed fixture chapters. It does not claim content or feature parity.
- PWA, progress, notes, assessment systems, and the remaining 126 chapters still run only in the legacy application.
- `agent-browser` is unavailable; Firefox headless supplied visual evidence, but automated console/network assertions remain to be added to the future test toolchain.

#### Remaining work

- Phase 5 must build a lossless migration adapter/inventory and move all content and learning features before the React entry can replace the legacy site.

#### Phase checkpoint

Status: completed

Requirements satisfied: build toolchain, typed React shell, Tailwind integration, reusable component boundaries, structured runtime content contract, test/lint/typecheck/build setup, relative static build paths, and isolated migration strategy.

Known regressions: none.

Deferred: complete content and feature migration, PWA handoff, public-entry switch, and legacy removal.

Next phase: Phase 5 - Content and feature migration.

---

### Phase 5 - Content and feature migration

Status: completed

#### Objective

Migrate every existing chapter and learning feature into the new architecture without silently losing content, IDs, navigation, or behavior.

#### Requirements covered

- Sections 0.17, 2, 5, and 16.
- Preservation of existing content and functionality during migration.

#### Prerequisites

- React foundation, content schema, before-migration inventory, and compatibility tests.

#### Scope

- All 128 current chapters, templates, glossary, exercises, quizzes, navigation, notes, Java Lab, review, diagnostics, mastery, project readiness, offline shell, and settings.

#### Out of scope

- Claiming pedagogical depth improvements merely because content was moved.

#### Risks

- Missing content hidden inside templates or injected expansions.
- Breaking hash navigation, chapter IDs, sanitized Markdown, or offline behavior.

#### Expected files/areas affected

- Structured content directories, React features/components, migration adapters, tests, and static assets.

#### Validation required

- Before/after chapter and content-block comparison, full regression suite, navigation checks, import of legacy state, and desktop/mobile browser verification.

#### Result

The one-time migration extracted all 128 legacy templates into independent, canonical HTML files. The current generator reads only those files plus the separated catalog and glossary, producing the typed React model while preserving chapter IDs, prerequisite references, exercises, quizzes, checklists, full solutions, code, and navigation order. The React application renders the complete 151-chapter course and all learning tools against the assembled model.

#### Validation

- Exact per-file and aggregate HTML/text hashes, 128-file set, 111 glossary definitions, block-by-block text equality, unique IDs, graph references, feature rendering, search, navigation, typecheck, lint, tests, and build: passed.
- The public source corpus is split by chapter; a generated runtime index avoids embedding 1.66 MB of curriculum in the JavaScript bundle and is never edited as a content source.

#### Remaining work

- None.

---

### Phase 6 - Versioned learning and progress system

Status: completed

#### Objective

Harden all progress data as a versioned, resilient, portable model with tested migrations, full backup validation, and restore safety.

#### Requirements covered

- Sections 4, 15, 0.18, and learning-system portions of 16 and 17.

#### Prerequisites

- Stable React state boundaries and proven legacy import path.

#### Scope

- State schema, migrations, validation, IndexedDB adapter, legacy key/database discovery, complete export/import, backup metadata, conflict/error handling, and test fixtures from old versions.

#### Out of scope

- Cloud accounts or remote synchronization unless separately authorized and designed.

#### Risks

- Accepting malformed imports, partial writes, destructive replacement, or incompatible future content versions.

#### Expected files/areas affected

- Progress domain, persistence adapters, import/export UI, migrations, fixtures, and tests.

#### Validation required

- Unit and integration tests across legacy and current fixtures, interrupted/invalid import cases, quota errors, and round-trip export/import.

#### Result

Implemented progress version 10 with explicit completion, favorites, notes, quiz answers, checklists, review schedule, mastery, errors, retrieval, diagnostic, project readiness, activity, settings, last chapter, and migration metadata. IndexedDB persistence, local fallback, schema migration, strict backup parsing, and complete round-trip import/export are wired into the UI. Phase 16 subsequently promotes this additive format to version 11 for English evidence and restored settings.

#### Validation

- Version 9 migration preserves legacy learning records.
- Complete version 10 backup round-trip passes; unrelated/malformed JSON is rejected.

#### Remaining work

- None.

---

### Phase 7 - Reading experience, white theme, responsiveness, and accessibility

Status: completed

#### Objective

Deliver a real-white, high-legibility reading interface and remove overflow causes across supported viewport sizes without masking them globally.

#### Requirements covered

- Sections 3, 10, 16, and visual/accessibility parts of 17.

#### Prerequisites

- Migrated component architecture and representative content fixtures.

#### Scope

- Theme tokens, typography, code, tables, callouts, quizzes, projects, navigation, focus states, contrast, prerequisite wrapping, and responsive layout.

#### Out of scope

- Curriculum depth and new advanced modules.

#### Risks

- A white theme that loses hierarchy or code contrast.
- Fixing overflow by clipping content rather than correcting component sizing.

#### Expected files/areas affected

- Design tokens, Tailwind configuration, shared UI/content components, and visual tests.

#### Validation required

- Accessibility checks, contrast review, keyboard navigation, reduced motion, and visual/overflow tests at representative mobile, tablet, and desktop widths.

#### Result

Delivered a real-white reading surface with amber/emerald hierarchy, expressive display typography, high-contrast code and callouts, responsive navigation, wrapped controls, visible focus, skip navigation, reduced motion, and comfortable-reading mode. Overflow is handled on code/table containers rather than hidden globally.

#### Validation

- Automated `axe-core` audit passes with no detectable violations; only color contrast is excluded because jsdom has no layout engine and the CSS token contrast is reviewed separately.
- Desktop and 390 px browser baselines were rendered during migration. The final asynchronous entry assets all returned HTTP 200; the unavailable `agent-browser` binary prevented a new scripted final screenshot, so DOM, accessibility, and build tests provide the final automated evidence.

#### Remaining work

- None in the implementation; future CI may add a full browser engine for pixel/overflow regression snapshots.

---

### Phase 8 - Existing curriculum and assessment improvement

Status: completed

#### Objective

Improve every existing chapter and assessment in dependency-sized curriculum batches, prioritizing JDBC, Optional, lambdas, functional programming, Set/Collections, object relationships, and reasoning about types, state, errors, and domain correctness.

#### Requirements covered

- Sections 1, 5, 7, 8, 12, 13, 14, and 14.1.

#### Prerequisites

- Stable content model, chapter contract, resource model, and validation rules.

#### Scope

- Existing content rewritten in module-sized subphases with intuitive introductions, technical depth, prediction/debugging/refactoring exercises, concept-specific quizzes, reviews, and cumulative projects.

#### Out of scope

- Treating all 128 chapters as one unreviewable bulk edit.

#### Risks

- Removing valuable original material, producing repetitive questions, or increasing complexity faster than prerequisites.

#### Expected files/areas affected

- Structured chapter, question, review, and project content plus validators.

#### Validation required

- Per-batch content review, technical checks, prerequisite checks, question-quality checks, build/typecheck/lint/tests, and before/after inventory comparison.

#### Result

Every legacy chapter now has concept-derived checks, at least two complementary resources, and a contextual English activity without discarding its original technical material. Structured additions close the required gaps in associations/cardinality/invariants, Optional/lambdas/Set/Streams semantics, JDBC internals, reasoning exercises, and cumulative project guidance.

#### Validation

- Coverage validator reports 268 quizzes and 160 exercises; every migrated chapter has assessment, resources, and English activity, and each audited phase concept has authored verification.
- The 20-module graph resolves all chapter and module prerequisite references.

#### Remaining work

- None.

---

### Phase 9 - HTTP and API curriculum

Status: completed

#### Objective

Build the central progressive HTTP/API path from protocol fundamentals and pure-Java consumption through API design, testing, documentation, integration, contract evolution, and informed REST alternatives.

#### Requirements covered

- Sections 8.2 through 8.55 and related English/project/testing requirements.

#### Prerequisites

- Exceptions, I/O, JSON, serialization, testing fundamentals, and the content/assessment architecture.

#### Scope

- HTTP anatomy and semantics, Java `HttpClient`, JSON mapping, defensive external integrations, timeout/retry/rate limits/pagination/auth/secrets, curl, API design, DTOs, validation, errors, OpenAPI, tests, contracts, evolution, caching, resilience, and progressive projects.

#### Out of scope

- Introducing EDA before synchronous integration problems have been experienced.

#### Risks

- Teaching Spring annotations as HTTP knowledge or introducing resilience abstractions before failure modes.

#### Expected files/areas affected

- Curriculum modules, projects, questions, resources, code samples, and related tests.

#### Validation required

- Technical review against current official Java/Spring/OpenAPI documentation, runnable sample validation, project dependency checks, and assessment depth review.

#### Result

Added a progressive path covering raw HTTP semantics, Java `HttpClient`, JSON, unreliable external APIs, timeout/retry/rate limits/auth/secrets, a pure-Java API integration project, REST resources/DTOs/validation/errors/concurrency contracts, and OpenAPI/testing/evolution before advanced distributed integration.

#### Validation

- Required IDs and terms are asserted by `validate-platform.mjs`.
- Technical references were checked against current Oracle, RFC, Spring, and OpenAPI documentation; all linked resources passed the live-link audit.

#### Remaining work

- None.

---

### Phase 10 - Java beyond CRUD

Status: completed

#### Objective

Distribute general-purpose Java projects across the curriculum so students build CLI, TUI, networking, concurrency, developer tools, and simplified systems only after their real prerequisites.

#### Requirements covered

- Section 9 excluding the advanced EDA-specific subphase.
- CLI, TUI/Lanterna, bots, networking, concurrency, tooling, infrastructure, and selected mini implementations.

#### Prerequisites

- Relevant language, I/O, testing, HTTP, concurrency, database, and architecture foundations per project.

#### Scope

- Progressive projects and content, including Lanterna layers/event loop/state separation when current library research confirms suitability.

#### Out of scope

- A single post-POO “technology zoo” or premature mini-Kafka/distributed systems project.

#### Risks

- Artificial difficulty, excessive frameworks, or projects requiring skills not yet practiced.

#### Expected files/areas affected

- Curriculum graph, projects, chapters, resources, questions, and sample code.

#### Validation required

- Prerequisite graph, runnable examples, project-guidance progression review, tests, and current-library documentation checks.

#### Result

Added prerequisite-positioned chapters and projects for TCP/protocol design, Lanterna terminal UI architecture, and Java developer tools, alongside the preserved CLI, concurrency, networking, I/O, and systems material.

#### Validation

- Lanterna content distinguishes Terminal, Screen, GUI2, event loop, state, rendering, and test boundaries using the current official project documentation.
- Required chapter IDs and prerequisite placement pass content validation.

#### Remaining work

- None.

---

### Phase 11 - Testing, messaging, and Event-Driven Architecture

Status: completed

#### Objective

Build the complete progression from synchronous coupling and messaging fundamentals through SNS/SQS, Kafka, delivery semantics, idempotency, retries, DLQ/redrive, Outbox/Inbox, eventual consistency, Saga, observability, security, and deterministic integration testing.

#### Requirements covered

- Sections 9.1 through 9.30, including Testcontainers, Awaitility, required EDA reference video, and progressive EDA projects.

#### Prerequisites

- HTTP/API integration, database transactions, concurrency, Docker, unit/integration testing, and synchronous multi-service failure experience.

#### Scope

- Event bus, synchronous baseline, separated synchronous services, asynchronous redesign, SNS/SQS, Kafka, failure labs, Testcontainers, LocalStack evaluation, Awaitility-style condition waiting, schemas, ordering, Outbox/Inbox, Saga, and observability.

#### Out of scope

- Buzzword coverage without failure reasoning, infrastructure prerequisites, projects, and tests.

#### Risks

- Outdated cloud/framework APIs, insecure credentials, nondeterministic tests, or misleading exactly-once claims.

#### Expected files/areas affected

- Advanced curriculum, projects, resources, tests, infrastructure examples, and validators.

#### Validation required

- Official-current documentation research, runnable/tested examples, failure scenario coverage, deterministic async tests, security review, and prerequisite audit.

#### Result

Implemented the full progression from coupled synchronous services through an in-memory event bus, queue/pub-sub semantics, SNS+SQS, delivery failure labs, visibility timeout/DLQ/redrive, Outbox/Inbox, Saga/schema/ordering, EDA observability/security, and deterministic Testcontainers/Kafka/LocalStack/Awaitility testing.

#### Validation

- AWS content uses official delivery-semantics documentation and keeps secrets out of examples.
- LocalStack is presented as the local integration-test boundary; Kafka/LocalStack container APIs and Awaitility condition waiting match current official documentation.
- The required Souza video is attached with its specified reinforcement context.

#### Remaining work

- None.

---

### Phase 12 - Complementary resources and technical English integration

Status: completed

#### Objective

Attach current, concept-specific official documentation and high-quality videos/resources to relevant content while integrating progressively harder technical English through context rather than translation.

#### Requirements covered

- Sections 6, 8.53, the resource addition after 9.30, and 18 through 18.14.

#### Prerequisites

- Stable chapter ordering and resource/English schemas.

#### Scope

- Resource research and validation, official documentation activities, concept-level video mapping, English exposure by curriculum level, English project requirements/issues/bug reports, and comprehension-based assessment.

#### Out of scope

- Generic vocabulary lists, grammar lessons, full duplicated translations, or a language selector as the primary mechanism.

#### Risks

- Link rot, outdated tutorials, overloading technical and linguistic difficulty simultaneously, or superficial resource dumping.

#### Expected files/areas affected

- Resource data, chapter content, projects, English activities, link validator, and UI components.

#### Validation required

- Live link and metadata checks, official-source priority review, concept-resource mapping, English load audit, and build/test validation.

#### Result

All 151 chapters expose curated resources and a level 0-3 contextual English activity. Activities progress from recognizing code/documentation terms to search, bug reports, issues, constraints, acceptance criteria, and trade-offs rather than isolated vocabulary lists.

#### Validation

- `npm run validate:links`: 55/55 unique HTTPS resources responded successfully on 2026-08-20.
- Two broken/stale URLs discovered by the audit were replaced before completion.

#### Remaining work

- Link health is inherently time-sensitive; rerun `npm run validate:links` before future releases.

---

### Phase 13 - Intermediate cross-cutting audit

Status: completed

#### Objective

Compare the master specification, progress record, current repository, curriculum graph, and tests after the major architecture/content milestones.

#### Requirements covered

- Sections 0.26, 0.28, 0.29, 0.30, and 0.31.

#### Prerequisites

- Completion of the migration, progress, core curriculum, APIs, Java beyond CRUD, and EDA phases.

#### Scope

- Forgotten requirements, shallow completion claims, contradictions, duplication, content loss, regressions, and advanced-topic prerequisite chains.

#### Out of scope

- Marking partial requirements complete to improve counts.

#### Risks

- Trusting this document over the repository and test evidence.

#### Expected files/areas affected

- Progress record, tests/validators, and any source/content requiring correction.

#### Validation required

- Requirement-by-requirement evidence review and full automated suite.

#### Result

Cross-checked the generated corpus, structured additions, schema, progress runtime, public identity, resource URLs, PWA files, and required curriculum terms. The audit found and corrected missing final build checks and two dead external resource URLs.

#### Validation

- `validate-content-fidelity.mjs`, `validate-pedagogy.js`, and `validate-platform.mjs` cover the exact split corpus, target graph, mandatory additions, counts, identity, persistence contracts, and built PWA artifacts.

#### Remaining work

- None.

---

### Phase 14 - Final audits and release readiness

Status: completed

#### Objective

Prove that the final java4br implementation is technically stable, pedagogically coherent, accessible, responsive, content-complete, and traceable to the master specification.

#### Requirements covered

- Sections 0.27 through 0.32 and 17.

#### Prerequisites

- All implementation phases and intermediate audit corrections complete.

#### Scope

- Build, typecheck, lint, tests, links, navigation, progress, import/export, quizzes, reviews, projects, desktop/mobile, overflow, themes, accessibility, persistence, offline behavior, content depth, prerequisites, resources, and final traceability classification.

#### Out of scope

- Declaring completion with partially implemented or unverified mandatory requirements.

#### Risks

- Compilation success masking behavioral or pedagogical regressions.

#### Expected files/areas affected

- Entire repository as dictated by audit findings and final progress evidence.

#### Validation required

- Full automated suite, browser matrix, content/link validators, backup migration fixtures, accessibility checks, and manual pedagogical audit.

#### Result

The production build, content generation, typecheck, lint, unit/integration tests, axe audit, legacy/pedagogy/platform validators, PWA precache validation, link audit, and clean-diff checks form the release gate. GitHub Pages deploys only after this gate passes.

#### Validation

- `npm run validate`: passed.
- `npm run validate:links`: passed, 55/55.
- Vitest covers content, concept-level assessments, progress migration/backup, legacy IndexedDB discovery, legacy error/mastery compatibility, application behavior, navigation, and two accessibility states.
- `npm audit`: zero known vulnerabilities at dependency installation time.

#### Remaining work

- None.

---

### Phase 15 - Full-corpus separation and repeated closure audit

Status: completed

#### Objective

Remove the former giant HTML/runtime source, preserve every byte of learning content in maintainable chapter files, and re-audit the implementation end to end until no known mandatory gap remains.

#### Result

- Materialized exactly 128 canonical chapter HTML files, a separate catalog, all 111 glossary entries, and a source inventory with individual and aggregate SHA-256 hashes.
- Removed the obsolete root `index.html`, `app.js`, `curriculum-v2.js`, duplicate PWA shell, vendored legacy sanitizers, and legacy validator after proving parity.
- Restored full exercise solutions, complete glossary, Markdown notes, review/retrieval, mastery, error correction, diagnostics, project readiness, activity, Pomodoro, Java Lab, settings, and modal keyboard behavior in React.
- Corrected realistic version 9 quiz, checklist, review, activity, settings, lab, plan, backup, localStorage, and IndexedDB migration paths.
- Added one quiz per structured concept and compatibility rendering for version 9 `term-*`, `conceptKey`, text options, and `correctIndex` evidence.

#### Validation

- `validate:fidelity` proves 128 files, 923,898 exact HTML bytes, aggregate content hashes, and all 111 definitions without summarization.
- The release gate includes generation, fidelity, strict TypeScript, ESLint, Vitest, production/PWA build, pedagogical graph, platform inventory, accessibility, import/export, and external-link audits.
- Repeated full release-gate results and final counts are recorded by the last execution, not copied from an earlier phase.

#### Remaining work

- None.

---

### Phase 16 - Study OS interface and feature-parity restoration

Status: completed

#### Objective

Restore the established Study OS visual language and every user-facing learning control that regressed during the final React split, while preserving the real-white requirement and making contextual technical English a first-class workflow.

#### Requirements covered

- Latest interface-parity, offline installation, system/white/high-contrast theme, and technical-English requirements.
- Master specification sections 3, 4, 10, 15, 16, 17, and 18.

#### Prerequisites

- Completed React content split, version 10 persistence, and exact fidelity validators.
- Direct comparison with the former `index.html` and `app.js` interface and behavior.

#### Scope

- Restored dark Study OS tokens, contextual toolbar, side navigation, command palette, filters, reading progress, achievements, focus/review modes, settings, PWA controls, local Java runner, and responsive Study Hub.
- Added the real-white theme as a distinct option while retaining system auto-selection and the original high-contrast aesthetic.
- Replaced the passive English summary with per-chapter `Read -> Notice -> Use -> Prove` practice, persisted English evidence, a level roadmap, an English hub, shortcuts, and backup coverage.

#### Out of scope

- Reintroducing the monolithic HTML/runtime or duplicating chapter content inside React components.
- Full-language translation or an English/Portuguese content switch, which the specification explicitly rejects.

#### Risks

- Restoring old CSS literally could violate the required real-white theme.
- Mounting modal tools beside chapter tools could duplicate accessible IDs.
- A synthetic Java runner could imply support for the complete Java language.

#### Result

- System, Branco (`#ffffff`) and Alto contraste themes are selectable and persisted; system mode follows dark/contrast/forced-color preferences.
- The sidebar again exposes practice and favorite filters, Study OS tools, progress and offline status. The top toolbar restores favorite, notes, English, commands and Central access plus keyboard shortcuts; visible study time, editable daily goals and back-to-top behavior are restored.
- The PWA exposes install guidance, install-prompt handling, cache refresh and offline status; the generated worker precaches all 137 production assets, including all independent chapter HTML files.
- The Java Lab saves chapter drafts and safely executes output, scalar declarations, numeric/string addition and bounded ascending `for` loops offline, while clearly directing unsupported features to a real JDK.
- Technical English is visible in every chapter and in its own Study Hub panel; evidence is versioned, migrated, backed up and tested rather than discarded as transient text.
- Removed the last public `Stack completa` label while preserving the private version 9 backup discriminator.

#### Major changes

- `platform/src/app/App.tsx`, `platform/src/styles.css`, `platform/index.html`: restored shell, themes, toolbar, shortcuts, modal entry points and visual identity.
- `platform/src/components/course`, `navigation`, `study`, and `english`: restored navigation and learning tools with responsive, accessible component boundaries.
- `platform/src/progress/schema.ts`, `platform/src/pwa/usePwa.ts`, manifest and service-worker generator: version 11 persisted settings/evidence and complete offline/install behavior, with v9/v10 migration.
- Application and progress tests now cover the restored theme, offline, English and Java Lab flows.

#### Validation

- `npm run validate`: passed after the restoration: 128 exact chapter HTML files, 923,898 preserved bytes, strict typecheck, zero-warning ESLint, 21 Vitest tests, two axe states, production build, PWA generation, pedagogical graph and platform inventory.
- Production PWA: 137 build assets in generated precache; bundle 318.72 kB JavaScript / 100.82 kB gzip and 53.99 kB CSS / 11.45 kB gzip.
- `npm run validate:links`: 55/55 HTTPS resources returned HTTP 200 on 2026-08-20.
- Firefox CLI produced desktop/mobile boot renders, but its build captured before the asynchronous catalog completed and exposed neither `agent-browser` nor a usable remote-control endpoint. Those screenshots were not misclassified as final UI evidence; DOM behavior, responsive CSS rules, axe and component tests are the automated UI evidence for this phase.

#### Known issues

- Superseded by Phase 17: Chromium/Playwright post-load interaction and responsive screenshots are now available.

#### Remaining work

- No known mandatory implementation gap. Browser-driver installation remains a tooling improvement, not an application requirement.

#### Phase checkpoint

Status: completed

Requirements satisfied: legacy Study OS aesthetic, real-white alternative, system/high-contrast selection, offline install/cache controls, restored interface tools, local Java Lab, and integrated/persisted technical English.

Known regressions: none detected by the full gate.

---

## Phase 17 - Responsive visual and legacy-interaction repair

Status: completed

Implemented and verified:

- Replaced diagram/table-derived quiz alternatives with bounded semantic facts and added generator assertions that reject diagram glyphs and oversized alternatives.
- Preserved generated code markup so all 286 migrated code blocks retain syntax highlighting instead of flattening into monochrome text.
- Restored the complete legacy visual vocabulary for headings, metadata, nine technology colors, callouts, warnings, secrets, analogies, study tips, tables, checklists, exercises and code comparisons.
- Repaired theme-safe checklist surfaces and checked states; no fixed white card remains inside the high-contrast theme.
- Restored installation tabs, before/after comparisons and copy-code controls with accessible tab/button semantics.
- Closed the 360 px global overflow caused by long chapter titles while keeping code and tables horizontally scrollable inside their own containers.
- Added Playwright Chromium coverage at 360, 768 and 1440 pixels for the reported chapters, themes, Technical English, manifest, legacy tabs, copy controls and critical axe violations.
- Added Chromium installation and end-to-end execution to the Pages CI validation gate.

Evidence:

- `npm run test:e2e`: 4/4 browser stories passing.
- Visual inspection of `pilares-profundo`, `mini-biblioteca-cli` and `javamoderno` in mobile and desktop high-contrast layouts.
- Full `npm run validate` gate, including fidelity, links, typecheck, lint, unit tests, build, pedagogy, platform and browser tests.

Known regressions: none detected.

---

## Requirement Traceability Matrix

| Requirement | Status | Phase | Evidence |
|---|---|---|---|
| Full master-spec reading and current-project audit | completed | 1 | 7,830-line specification reviewed; inventory and baseline validation recorded in this file |
| Operational progress file, phase contracts, and checkpoints | completed | 1 | `docs/internal/implementation-progress.md` |
| Rename java4all/Stack Completa to java4br | completed | 2 | README, UI, PWA, backup, storage/cache identity, and validators updated |
| Preserve legacy progress during identity and architecture changes | completed | 2, 5, 6, 15, 16 | Version 9 IndexedDB/localStorage fixtures and version 10 backups migrate to the complete version 11 model through repository/schema tests |
| Pedagogical dependency architecture | completed | 3 | Executable 20-module graph and `validate-pedagogy.js` |
| Scalable structured chapter/question/project/resource schema | completed | 3, 4 | Typed block, assessment, project, resource, English, course, and progress domains render in React |
| React and Tailwind migration | completed | 4, 5 | Vite production build and Pages workflow publish the parity-complete application |
| Preserve all existing content and learning features | completed | 5, 15, 16 | 128 canonical HTML files and exact hash/text validators preserve every chapter; the React Study OS restores solutions, quizzes, filters, notes, review, mastery/errors, diagnostics, projects, Pomodoro, Java Lab, settings and shortcuts |
| Versioned resilient progress and complete import/export | completed | 6 | Version 10 schema, IndexedDB, fallback, strict import, and round-trip tests |
| System, real-white and restored high-contrast themes | completed | 7, 16 | Persisted theme settings resolve system preferences; `#ffffff` white mode and original `#050505` amber/green Study OS mode share the reading hierarchy |
| Responsive/overflow and prerequisite wrapping audit | completed | 7, 17 | Mobile sidebar, flexible controls, browser-verified 360/768/1440 layouts, local code/table overflow and no global clipping |
| Accessibility and keyboard/focus behavior | completed | 7, 17 | Skip link, labels, landmarks, focus/reduced-motion rules, accessible legacy tabs and passing critical axe browser test |
| Deep concept-level quizzes and later reviews | completed | 8, 15, 17, 18, 19 | 268 quizzes, with malformed diagram alternatives blocked, plus spaced review, retrieval, mastery, diagnostic final review, and error notebook |
| Intuitive-first, reasoning-first chapter pedagogy | completed | 8 | Structured intuition, prediction, explanation, exercise, quiz, and project blocks |
| Deep JDBC, Optional, lambdas, Set/Collections, functional content and advanced data structures | completed | 8, 18 | SQL, PostgreSQL, migrations, JDBC, finance project, `jdbc-under-the-hood` and `estruturas-avancadas` are approved with concept graph, resources and project matrix where applicable |
| Object associations/cardinality before JPA annotations | completed | 8 | `associacoes-cardinalidade` is placed in the OOP progression |
| Progressively less-guided cumulative projects | completed | 3, 8, 9, 10, 11, 18 | Module guidance progresses from supported to guided, bounded, and independent; intermediate reservation/library projects now include evidence matrices |
| HTTP before Spring MVC | completed | 7, 9 | Wire-level HTTP, curl inspection and pure-Java client chapters precede Spring API modules |
| Pure-Java `HttpClient`, JSON, and external API consumption | completed | 7, 9 | Dedicated `HttpClient`, unreliable API and `pure-java-api-project` chapters are approved with concept graph and project matrices |
| Complete API design/integration/testing/contract curriculum | completed | 9 | REST semantics, DTOs, validation, errors, concurrency, OpenAPI, tests, and evolution |
| Java beyond CRUD curriculum | completed | 10, 13 | CLI, TCP/protocols, concurrency, TUI, and developer-tool paths |
| Lanterna/TUI curriculum | completed | 10, 13 | `lanterna-tui` covers layers, event loop, state, rendering, testing, and trade-offs |
| Testcontainers depth and deterministic async testing | completed | 11 | Kafka, LocalStack, container lifecycle, isolation, and Awaitility chapter |
| SNS/SQS curriculum | completed | 11 | Fanout, queues, delivery, visibility, retries, DLQ, redrive, security, and project context |
| Complete EDA progression and failure reasoning | completed | 11, 16, 17 | Synchronous pain through event bus, broker semantics, failure labs, outbox/inbox, saga, consistency patterns, and operations |
| Required Souza EDA reference video | completed | 11 | Required URL and reinforcement description included |
| Official documentation and high-quality videos by content | completed | 12, 13, 14, 15, 16, 17, 19 | Every chapter has at least two mapped resources; 260 curated URLs inventoried by the master audit and 262 rendered external URLs validated online |
| Gradual contextual technical English | completed | 12, 16 | Per-chapter levels 0-3, Read/Notice/Use/Prove flow, English Hub, shortcuts and persisted evidence culminate in professional bug reports/issues/trade-offs |
| Installable complete offline application | completed | 4, 14, 16 | Manifest/install prompt, offline status, cache refresh and generated service worker precache all 137 production assets |
| Intermediate depth/prerequisite audit | completed | 13 | Target graph, required terms, counts, URLs, identity, persistence, and PWA assertions pass |
| Final requirement-by-requirement audit | completed | 14, 15 | Repeated `npm run validate`, fidelity hashes, link audit, two-state axe tests, persistence integration, and traceability review |
| Final release gate and Supabase removal | completed | 20 | `validate:final-release` checks approved counts, docs, generated/public parity, required reports and absence of Supabase client/dependencies |
| GitHub Pages/PWA deployment readiness | completed | 21 | `validate:deployment` checks Pages workflow, Vite base, `dist/`, manifest and generated service worker precache |
| Maintenance drift guardrails | completed | 22 | `validate:maintenance` blocks disconnected phase sources, root monolith regressions and manual edits to generated public artifacts |
| Progress schema, IndexedDB and backup contract | completed | 23 | `validate:progress` protects schema v11, IndexedDB `java4br-course`, fallback, migration, backup and import confirmation |
| UI/accessibility contract | completed | 24 | `validate:ui` protects skip link, focus, themes, reduced motion, Study Hub, Markdown notes, axe coverage and responsive E2E markers |
| Study tools contract | completed | 25 | `validate:learning-tools` protects title-only search, multiple-choice review, glossary, diagnostic, error notebook, project readiness and Java Lab |
| Catalog/offline artifact integrity | completed | 26 | `validate:catalog` checks generated/public course parity, catalog, glossary, source inventory, hashes, dist HTMLs and service worker cache |
| Assessment integrity | completed | 27 | `validate:assessment` protects quizzes, unique alternatives, exactly one correct answer, rationales, exercises, project criteria and knowledge matrices |
| External resource integrity | completed | 28 | `validate:resources` protects HTTPS, language, publisher, verification date, relevance approval, official/normative priority and anti-generic links |
| Contextual technical English contract | completed | 29 | `validate:technical-english` protects 128 activities, level distribution, module progression, code context, saved evidence and anti-translation rules |
| Living traceability contract | completed | 30 | `validate:traceability` keeps README, progress, requirement matrix, phase reports, final-release gate and validation scripts synchronized |
| Master specification closure | completed | 31 | `validate:master-spec` cross-checks the master specification axes against approved content, schema, chapter matrix, dependency graph, E2E coverage and specialized gates |

---

## Decisions

### Decision: preserve legacy storage discovery during the java4br rename

Reason:

Existing users may have data in the IndexedDB database `stack-completa-java` or localStorage key `stack-completa:single:v1`. A direct rename would make that data appear lost even if it remained on disk.

Alternatives considered:

- Keep every runtime identifier permanently under the old brand.
- Rename identifiers immediately without compatibility lookup.

Why rejected:

- Permanent legacy branding conflicts with the new identity and complicates future maintenance.
- Immediate replacement violates the explicit no-progress-loss requirement.

### Decision: keep the currently working public GitHub Pages URL until deployment state proves a java4br URL exists

Reason:

Product branding and repository hosting paths are independent. Publishing a guessed URL would break the primary README link.

Alternatives considered:

- Replace `/java4all/` with `/java4br/` immediately.

Why rejected:

- The repository provides no evidence that the new endpoint exists yet.

### Decision: migrate content only after a structured pedagogical model exists

Reason:

Directly converting HTML fragments into arbitrary React components would reproduce the current monolith and make later curriculum growth harder.

Alternatives considered:

- Convert the current HTML file component-by-component first.

Why rejected:

- It would optimize for visible migration progress without solving content structure, traceability, or pedagogical dependencies.

### Decision: use an isolated Vite root during incremental migration (superseded after parity)

Reason:

During migration, the static application remained functional while the React entry under `platform/` was validated independently. After parity and exact corpus extraction were proven, the root fallback was removed to prevent duplicate content sources.

Alternatives considered:

- Replace the root `index.html` immediately with the Vite entry.
- Mount React directly inside the monolithic legacy document.

Why rejected:

- Immediate replacement would break content and learning features before migration.
- Mounting into the legacy document would couple React to the exact monolithic structure the migration is intended to remove.

### Decision: Vite + React TypeScript + Tailwind v4 Vite plugin

Reason:

Official React guidance recommends a build tool such as Vite for a from-scratch client application when a server framework is not needed. Official Tailwind v4 guidance recommends its dedicated Vite plugin. Vite supports a relative `base`, which keeps build asset paths portable while the final repository/deployment URL is unresolved.

Evidence reviewed on 2026-08-20:

- `https://react.dev/learn/build-a-react-app-from-scratch`
- `https://react.dev/learn/add-react-to-an-existing-project`
- `https://tailwindcss.com/docs/upgrade-guide`
- `https://tailwindcss.com/docs/functions-and-directives`
- `https://vite.dev/config/shared-options`
- `https://vite.dev/guide/static-deploy.html`

---

## Future improvements

- Add optional pixel-diff baselines for a small set of representative chapters after the visual language is intentionally frozen.
