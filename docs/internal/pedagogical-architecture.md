# java4br - Pedagogical Architecture

## Learning contract

Every subject follows the same causal progression:

> problem -> intuitive bridge -> fundamental mechanism -> simple attempt -> limitation -> abstraction/tool -> trade-offs -> real application -> failure analysis -> refactoring and justification

The student must repeatedly predict types, states, behavior, errors, and domain consequences before running code. “Compiled” is never treated as equivalent to “correct”; syntax, type/compilation, runtime behavior, and domain correctness remain separate dimensions.

## Target progression

The executable module graph lives in `docs/internal/pedagogy-plan.js` and is validated by `validate-pedagogy.js`. Its high-level progression is:

1. Orientation and environment.
2. Programming fundamentals.
3. OOP, object modeling, associations, and cardinality.
4. Java core, Collections, Generics, Optional, lambdas, Streams, and functional reasoning.
5. I/O, serialization, CLI, and cumulative Java applications.
6. Algorithms and data structures.
7. Build, Git, debugging, and testing fundamentals.
8. HTTP, JSON, curl, Java `HttpClient`, and defensive consumption of external APIs.
9. Relational modeling, SQL, PostgreSQL, deep JDBC, and transactions.
10. SOLID, manual DI, patterns, and application design before Spring.
11. Spring and the first complete API after HTTP and JDBC are understood.
12. API contracts, security, authorization, documentation, and API quality.
13. Docker, real integration tests, Testcontainers foundations, NoSQL, and cache.
14. Concurrency, networking, WebSockets, CLI/TUI evolution, and Lanterna when validated.
15. Production delivery and operation.
16. Synchronous service integration and its concrete failure/coupling problems.
17. Resilience and observability after those failures have been experienced.
18. Messaging and EDA from an in-memory event bus through queues/pub-sub, SNS/SQS, and Kafka.
19. Distributed consistency, Outbox/Inbox, ordering, schema evolution, and Saga.
20. Team practice and a less-guided integrator project.

This is a dependency order, not a promise that each item is exactly one chapter. Large subjects are split; small related subjects may share a module.

## Critical prerequisite corrections

- Object association, ownership, and one-to-one/one-to-many/many-to-many cardinality move into POO. JPA later maps an already-understood model to foreign keys and annotations.
- Unit tests, debugging, and test doubles move before the first Spring API. Testcontainers remains after integration-test limitations and Docker.
- Synchronous Java `HttpClient` and external API consumption appear before Spring clients. Asynchronous clients wait for concurrency prerequisites.
- JDBC is taught before JPA as connection/resource ownership, statements, mapping, transactions, failures, pooling boundaries, and the mechanism later abstracted by ORM.
- Foundational concurrency moves before networks, WebSockets, messaging, and async tests. Virtual threads are removed from a mixed “Java 21” first contact and revisited here.
- Resilience4j appears only after a real synchronous integration exhibits timeouts, transient/permanent failures, retry duplication, latency, and temporal coupling.
- EDA appears only after the synchronous system works and fails observably. Kafka, SNS/SQS, Outbox, Saga, and distributed consistency cannot be introduced as isolated configuration recipes.

## Distributed project lanes

“Java beyond CRUD” is not one late module. Projects are placed where their prerequisites become available:

- Early: CLI, parsers, file tools, importers, and pure-Java HTTP clients.
- Intermediate: TUI task manager/file explorer, TCP chat, simple HTTP server, WebSocket client, scheduler, cache, and developer tools.
- Late: system monitor, database TUI, mini-Redis, mini-message-broker, synchronous multi-service system, SNS/SQS, Kafka, mini-log, Outbox, and distributed failure exercises.

Mini implementations teach internal mechanisms and explicitly state what they omit. They do not pretend to reproduce production systems.

## Project guidance progression

- `supported`: explicit steps, structure suggestions, small examples, and frequent checkpoints.
- `guided`: requirements plus optional staged hints; the student chooses some representations and methods.
- `bounded`: product reference, requirements, invariants, constraints, edge cases, and acceptance tests; no full architecture.
- `independent`: problem, non-negotiable invariants, failure scenarios, deliverables, and rubric. Multiple defensible architectures are expected and trade-offs must be justified.

Guidance never increases again after a later level is reached. A difficult new technology may receive conceptual scaffolding without giving away the project architecture.

## Assessment coverage

Each concept is assessed in at least three moments when appropriate:

- retrieval or prediction before/during first contact;
- concept-specific chapter assessment;
- later review or cumulative project checkpoint.

Questions prioritize type prediction, behavior, compilation/runtime/domain distinctions, information loss, debugging, edge cases, and trade-offs. Question count alone is not a quality metric.

## Technical English progression

English exposure is attached to module levels in the executable plan. It begins with contextual identifiers and errors, progresses through short comprehension and official documentation lookup, then moves to issues, API contracts, requirements, bug reports, and advanced technical research. Translation questions and duplicated full-language versions are excluded.

When technical novelty is high, language remains simpler. Linguistic complexity increases after the technical model is stable.

## Phase 3 migration decisions

- All 128 current chapters receive a target module through a legacy-phase default plus explicit overrides.
- Mapping is not equivalent to completion. `splitRequirements` marks mixed chapters that must be decomposed or substantially reorganized.
- Existing IDs remain stable until a documented split rule and progress migration exist.
- The current 20 visual phases remain untouched during this architecture phase; UI order changes only after the structured schema and migration tests exist.
