# java4br - Structured Content Model

## Purpose

The React migration must not convert arbitrary HTML fragments into arbitrary components. Content becomes structured, versioned data rendered by a small set of deliberate components. Raw HTML may exist only in a temporary migration adapter and cannot be the final authoring format.

## Stable identity

- Every course, module, chapter, concept, question, exercise, project, resource, and migration has a stable string ID.
- Existing chapter IDs remain stable through migration so hashes, notes, completion, review, mastery, and imports continue to resolve.
- Reordering changes `order`, never identity.
- Splitting a chapter preserves the old ID on the primary successor and records aliases or explicit progress rules for additional successors.
- Content and progress versions are independent. Editing a paragraph must not force a browser-state migration.

## Core entities

### Course

- `id`, `contentVersion`, `title`, `description`, `moduleIds`, `defaultLocale`, `progressSchemaVersion`.

### Module

- `id`, `title`, `summary`, `order`, `prerequisiteModuleIds`, `chapterIds`, `englishLevel`, `projectGuidance`, and `outcomes`.

### Chapter

- `id`, `moduleId`, `order`, `title`, `summary`, `objectives`, `whyItExists`, `prerequisiteChapterIds`, `conceptIds`, `introducedConceptIds`, `usedConceptIds`, `estimatedMinutes`, `englishLevel`, `blocks`, `resources`, `englishActivity` and `audit`.
- `whyItExists` and the first explanatory block are mandatory. A chapter cannot begin with framework configuration or advanced code before the intuitive bridge.
- `conceptIds` from the legacy generator are candidates only. The auditable graph uses `introducedConceptIds` and `usedConceptIds`.
- `audit.status` is `pending`, `in-review`, `needs-revision` or `approved`. Only `approved` means the minimum-prerequisite student review was completed.
- Legacy metadata is authored in `platform/content/pedagogy-overrides.json`; phase-specific audited content lives beside it, atualmente em `platform/content/foundations-phase-2.json`, `platform/content/oop-phase-3.json`, `platform/content/java-core-phase-4.json`, `platform/content/io-cli-phase-5.json`, `platform/content/algorithms-engineering-phase-6.json`, `platform/content/http-integration-phase-7.json`, `platform/content/relational-data-phase-8.json`, `platform/content/application-design-phase-9.json`, `platform/content/spring-api-phase-10.json`, `platform/content/api-security-quality-phase-11.json`, `platform/content/containers-integration-data-phase-12.json`, `platform/content/concurrency-network-tui-phase-13.json`, `platform/content/production-delivery-phase-14.json`, `platform/content/sync-resilience-phase-15.json`, `platform/content/messaging-eda-phase-16.json`, `platform/content/distributed-consistency-phase-17.json`, `platform/content/intermediate-projects-phase-18.json` e `platform/content/professional-final-phase-19.json`. Generated JSON files are never edited directly.

### Content blocks

Blocks use a discriminated `type` and contain typed fields. Initial supported types:

- `intuition`: simplified first contact, analogy limits, and links to known concepts.
- `concept`: technically correct explanation and terminology.
- `mental-model`: state/type/data-flow representation.
- `code`: language, source, caption, runnable status, expected output, and explanation.
- `prediction`: code or scenario that must be reasoned about before revealing the result.
- `comparison`: alternatives compared by semantics, contract, trade-offs, and misuse cases.
- `error-case`: compile, runtime, logic, domain, integration, or distributed failure.
- `callout`: note, warning, security, performance, or domain invariant.
- `diagram`: accessible textual description plus diagram source.
- `table`: structured headers and cells with a responsive rendering strategy.
- `exercise-ref`, `question-ref`, `resource-group`, and `english-activity-ref`.

## Concept and assessment model

### Concept

- `id`, `name`, `aliases`, `introducedIn`, `reinforcedIn`, `prerequisiteConceptIds`, `commonConfusions`, and `outcomes`.

### Question

- `id`, `conceptIds`, `chapterId`, `placement`, `skill`, `difficulty`, optional `code`, `prompt`, `options`, `correctOptionId`, `explanation`, `reviewAfterChapterIds`, and `englishLevel`.
- `placement`: `retrieval`, `inline`, `chapter-quiz`, `review`, `diagnostic`, or `project-checkpoint`.
- `skill`: `explain`, `predict-type`, `predict-behavior`, `compile-error`, `runtime-error`, `logic-error`, `domain-correctness`, `choose-contract`, `debug`, `edge-case`, `trade-off`, or `architecture-failure`.
- Every option has an ID, text, and rationale. Distractors must correspond to plausible misconceptions; obviously absurd alternatives fail validation/review.
- Multi-concept chapters require coverage per concept, not merely a total question count.

### Exercise

- `id`, `chapterId`, `conceptIds`, `kind`, `prompt`, `constraints`, `edgeCases`, `hints`, `solution`, `refactoringPrompts`, and `validation`.
- Help is progressive. Early exercises may expose ordered hints; advanced exercises expose requirements, invariants, and failure scenarios without a free architecture.

## Project model

- `id`, `title`, `referenceProduct`, `moduleId`, `guidanceLevel`, `prerequisiteChapterIds`, `accumulatedConceptIds`, `problem`, `requirements`, `invariants`, `failureScenarios`, `constraints`, `deliverables`, `acceptanceCriteria`, `rubric`, `optionalHints`, and `resourceIds`.
- Guidance levels are monotonic: `supported`, `guided`, `bounded`, then `independent`.
- Every project must reuse prior knowledge and state which earlier concepts it deliberately exercises.
- Advanced projects describe the problem, constraints, states, invariants, and failures; they do not reveal the full architecture.

## Complementary resources

### Resource

- `id`, `kind`, `title`, `url`, `publisher`, `language`, `conceptIds`, `purpose`, `official`, `verifiedAt`, optional `videoSegments`, optional `versionScope`, and optional `notes`.
- `kind`: `official-doc`, `specification`, `video`, `article`, `tool`, or `reference-project`.
- A resource group states exactly which concept it reinforces. A generic module link does not satisfy concept-level resource coverage.
- Official documentation is preferred and current version scope is recorded. Links require automated validation plus manual relevance review.

## Technical English model

### English levels

- Level 0 - contextual tokens: API names, identifiers, errors, and short phrases with explicit support.
- Level 1 - short comprehension: technical sentences and documentation lookup with questions about meaning, never translation.
- Level 2 - applied reading: documentation sections, API descriptions, issues, and partial project requirements.
- Level 3 - professional autonomy: requirements, bug reports, design constraints, documentation, and research primarily in English.

### English activity

- `id`, `chapterId`, `level`, `context`, `sourceText`, `question`, `expectedUnderstanding`, `technicalLoad`, and `languageLoad`.
- Technical and linguistic novelty cannot both jump sharply in the same activity.
- Translation questions and isolated vocabulary lists are invalid.

## Validation invariants

- All IDs are unique and every reference resolves.
- Module and chapter prerequisite graphs are acyclic and point backward in the learning order.
- Every chapter begins with an intuitive bridge before its technical explanation.
- Every introduced concept has assessment evidence in its chapter and later reinforcement.
- Projects never require chapters or concepts positioned later.
- Guidance and English exposure progress monotonically at module level.
- Advanced topics declare and inherit the complete prerequisite chain that makes their problem understandable.
- Code examples declare validation status; runnable examples are compiled/tested outside the browser content renderer.
- Resource links record verification dates and concept-specific purpose.
- Before/after migration inventories must match existing chapter IDs and content blocks or document an intentional split/merge.

## Migration boundary

The legacy renderer remains available until structured content has parity. Migration proceeds module by module:

1. inventory legacy template blocks;
2. map them to typed blocks without summarizing;
3. compare before/after counts and text coverage;
4. validate references and chapter IDs;
5. render both forms in tests;
6. remove the legacy form only after parity is proven.

Every block may declare `authorship` as `authored`, `legacy-preserved`, or `generated-compatibility`. Compatibility content keeps the application usable during reconstruction but can never satisfy an approval requirement by itself.

## Approval boundary

`npm run validate:depth` regenerates the complete audit and rejects an invalid approval. An approved chapter must have no known triage flag, no missing/future prerequisite and all of its resources manually approved for relevance. An approved project must also provide a requirement-to-concept-to-chapter knowledge matrix.

`npm run validate:maintenance` protects the maintenance boundary: phase content files in `platform/content/` must be read by the generator and documented here, canonical chapter HTML files must match the catalog, legacy monoliths must not reappear at the repository root, and generated JSON artifacts are treated only as build outputs.

The gate allowed pending chapters to remain published during phased reconstruction. After Phase 19 it must report zero backlog, because all 151 chapters are approved under the audit contract.
