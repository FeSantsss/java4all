# Phase 17 — Distributed consistency, Outbox/Inbox and Saga

Date: 2026-08-22

Status: completed

## Scope

Phase 17 reconstructed the distributed-consistency block after the messaging/EDA phase:

1. distributed-system failure boundaries and CAP without caricature;
2. PACELC, read models and timeout uncertainty;
3. Transactional Outbox and Inbox as local transactional guarantees;
4. Saga choreography/orchestration, compensation, schema evolution and ordering;
5. an event-driven orders project focused on reproducible evidence under failure.

## Chapters approved

- `sistemas-distribuidos`
- `consistencia-distribuida`
- `outbox-inbox`
- `saga-schema-ordering`
- `mini-pedidos-eventos`

## Pedagogical corrections

- CAP is now introduced only after the learner has already studied HTTP failure, resiliência, messaging, database hosting and EDA.
- CAP is framed as a partition-time trade-off, not a “choose any two” slogan.
- PACELC and read models explain normal-operation latency/consistency trade-offs.
- Timeout is explicitly treated as uncertainty, not proof that a remote effect failed.
- Outbox/Inbox and Saga received auditable concept graphs, project knowledge matrices and approved resources.
- The orders event-driven project now requires reproducible evidence for crash, duplication, replay, compensation and observability.

## Concept graph additions

Phase 17 added 14 auditable concepts:

- `distributed-system-failure-boundary`
- `cap-partition-tradeoff`
- `consistency-availability-scope`
- `eventual-consistency-reconciliation`
- `pacelc-latency-consistency`
- `read-consistency-models`
- `time-timeout-uncertainty`
- `outbox-atomic-publish-intent`
- `inbox-dedup-effect-transaction`
- `relay-retry-duplication-window`
- `saga-choreography-orchestration`
- `compensating-action-domain-state`
- `event-schema-ordering-evolution`
- `event-driven-project-evidence`

## Current audit snapshot

- Chapters tracked: 151
- Chapters approved: 143
- Backlog chapters: 8
- Concepts registered: 366
- Exercises: 158
- Quizzes: 278
- Unique resource URLs: 256
- Missing chapter prerequisites: 0
- Future chapter prerequisites: 0
- Concept graph issues: 0

## Files changed by this phase

- `platform/content/distributed-consistency-phase-17.json`
- `platform/src/content/required-chapters.ts`
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
- the app ordering test for `distributed-consistency`
- the responsive E2E scenario covering CAP/PACELC, Outbox/Inbox, Saga and the event-driven orders project
- `npm run validate:links` for audited external HTTPS resources
