# Phase 18 — Advanced data structures and intermediate projects

Date: 2026-08-22

Status: completed

## Scope

Phase 18 reconstructed the remaining intermediate engineering block:

1. advanced data structures as access contracts, not decorative collections;
2. a tested reservation engine focused on behavior, invariants and test doubles at boundaries;
3. the intermediate library project as a bounded Java-only integration before professional final modules.

## Chapters approved

- `estruturas-avancadas`
- `mini-reservas-testadas`
- `projeto`

## Pedagogical corrections

- `estruturas-avancadas` now explains stack, queue, tree and graph from operation semantics, cost and failure modes.
- Every advanced data-structure code block has authored explanation and common mistakes.
- `mini-reservas-testadas` was moved after `testes` and `mockito`, eliminating hidden future prerequisites.
- The reservation project avoids requiring database/concurrency topics not yet in scope and frames true concurrent conflict as a later extension.
- The library project now has bounded requirements, vertical slices, knowledge matrix and evidence-oriented README expectations.

## Concept graph additions

Phase 18 added 9 auditable concepts:

- `lifo-stack-discipline`
- `fifo-queue-discipline`
- `tree-invariant-search-cost`
- `graph-adjacency-traversal`
- `behavior-test-matrix`
- `reservation-invariant-capacity`
- `test-double-boundary`
- `library-domain-slice`
- `project-evidence-readme`

## Current audit snapshot

- Chapters tracked: 151
- Chapters approved: 146
- Backlog chapters: 5
- Concepts registered: 375
- Exercises: 158
- Quizzes: 273
- Unique resource URLs: 256
- Missing chapter prerequisites: 0
- Future chapter prerequisites: 0
- Concept graph issues: 0

## Files changed by this phase

- `platform/content/intermediate-projects-phase-18.json`
- `scripts/generate-course-content.mjs`
- `scripts/validate-pedagogical-depth.mjs`
- `platform/src/app/App.test.tsx`
- `tests/e2e/responsive.spec.ts`
- `README.md`
- `docs/internal/content-model.md`
- `docs/internal/implementation-progress.md`

Generated outputs updated by the content generator:

- `platform/src/content/generated-course.json`
- `platform/public/course-content.json`

## Validation contract

The phase is protected by:

- `npm run validate:depth`
- the app ordering assertions for algorithms/testing-engineering
- the responsive E2E scenario covering advanced data structures, reservation project and library project
- `npm run validate:links` for audited external HTTPS resources
