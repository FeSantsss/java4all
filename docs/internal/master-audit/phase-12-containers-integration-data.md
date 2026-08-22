# Phase 12 - Containers, integration tests and advanced data

Date: 2026-08-22

Status: completed

## Scope

Reconstructed and approved the containers/integration/data module, plus `mockito` as a supporting prerequisite for the testing strategy chapter. The phase keeps the study path practical: dublês de teste before integration tests, Docker before Compose/Testcontainers, NoSQL concepts before MongoDB/Redis, and operational concerns before database hosting decisions.

Approved chapters:

- `mockito`
- `docker-conceitos`
- `dockerfile`
- `compose`
- `testcontainers`
- `estrategia-testes`
- `nosql`
- `mongodb`
- `redis`
- `nosql-operacional`
- `hospedagem-db`

## Pedagogical changes

- Added 21 audited concepts covering test doubles, Mockito, Docker images/volumes, Dockerfile, Compose, Testcontainers, deterministic integration tests, NoSQL access patterns, MongoDB modeling/indexing, Redis cache/structures, operational NoSQL and database hosting.
- Replaced generated compatibility checks in the phase with authored multiple-choice checks and rationales.
- Added intuitive first-contact blocks before container commands, test infrastructure and NoSQL operation.
- Added explanations and common mistakes for all typed code blocks seen by the audit.
- Added a structured exercise to `nosql`, which previously had no practice block.
- Corrected `mockito` prerequisites so the chapter no longer depends on future DI/patterns content.
- Approved all resources with concept-specific official/reference links.

## Validation result

After generation and master audit:

- 151 chapters tracked.
- 103 chapters approved.
- 48 chapters remain explicit backlog.
- 273 concepts registered.
- 0 missing chapter prerequisites.
- 0 concept graph issues.
- 11/11 phase-scope chapters approved.

The remaining future prerequisites are intentional backlog edges outside this phase.
