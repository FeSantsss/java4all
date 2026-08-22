# Phase 16 — Messaging, SNS/SQS, Kafka and EDA

Date: 2026-08-22

Status: completed

## Scope

Phase 16 reconstructed the messaging and event-driven architecture progression so the learner starts with the simplest mental model before touching cloud services or Kafka:

1. message, envelope, event, command, queue, pub/sub and at-least-once;
2. in-memory event bus in Java as a local dispatch lab;
3. broker/backlog/backpressure and delivery semantics;
4. SNS + SQS fan-out, policies, receipt handles, visibility timeout and FIFO limits;
5. failure policy with retry, DLQ, redrive and poison messages;
6. EDA observability/security with correlation, causation, async traces, metrics and IAM;
7. deterministic async testing with Testcontainers, LocalStack boundaries and Awaitility;
8. Kafka as a partitioned log, Spring Kafka, reliable consumers, schema evolution, retry/DLT, replay and advanced integration testing.

## Chapters approved

- `mensageria`
- `in-memory-event-bus`
- `messaging-model`
- `aws-sns-sqs`
- `delivery-failure-lab`
- `eda-observability-security`
- `async-integration-tests`
- `kafka`
- `spring-kafka`
- `kafka-confiavel`
- `event-driven-profundo`
- `testes-integracao-avancados`

## Pedagogical corrections

- Mensageria now begins shallowly: message, intent, channel and duplication before broker internals.
- Kafka no longer appears as the first serious explanation of messaging.
- SNS/SQS has explicit code explanation for `receiveMessage`, `receiptHandle` and `deleteMessage`.
- Async tests explain why condition-based waiting is different from `Thread.sleep`.
- All approved projects include requirement-to-concept-to-chapter knowledge matrices.
- All approved chapters have audited resources, no generic resource flags, no missing/future prerequisites and no concept-graph violations.

## Concept graph additions

Phase 16 added 28 auditable concepts, including:

- `message-envelope-payload-metadata`
- `event-command-message-intent`
- `queue-work-competing-consumers`
- `pubsub-fanout-subscription`
- `delivery-at-least-once-idempotency`
- `broker-backlog-backpressure`
- `sns-topic-fanout-policy`
- `sqs-queue-visibility-receipt`
- `dlq-redrive-policy`
- `kafka-topic-partition-offset`
- `consumer-group-rebalance-offset`
- `spring-kafka-listener-template`
- `kafka-schema-evolution-contract`
- `kafka-idempotent-consumer`
- `eda-correlation-causality`
- `async-awaitility-eventual-assertion`

## Current audit snapshot

- Chapters tracked: 151
- Chapters approved: 138
- Backlog chapters: 13
- Concepts registered: 352
- Exercises: 158
- Quizzes: 285
- Unique resource URLs: 255
- Missing chapter prerequisites: 0
- Future chapter prerequisites: 0
- Concept graph issues: 0

## Files changed by this phase

- `platform/content/messaging-eda-phase-16.json`
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
- the app ordering test for `messaging-eda`
- the responsive E2E scenario covering messaging basics, SNS/SQS, failure, observability, async tests, Kafka and advanced integration tests
- `npm run validate:links` for audited external HTTPS resources
