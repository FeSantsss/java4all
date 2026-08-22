# Phase 7 — HTTP and integration

Date: 2026-08-22

## Scope

Phase 7 reconstructs the HTTP/API client progression before Spring:

- HTTP messages, resources, methods, status codes, headers, body and representation negotiation.
- `curl` as wire-level inspection, not as a magic downloader.
- Java `HttpClient`, request/response boundaries, timeouts and JSON mapping without framework abstractions.
- Defensive integration: retry, backoff, jitter, rate limits, pagination, secrets and partial failure.
- A pure-Java API integration project with deterministic local HTTP stubs and explicit knowledge matrix.

## Approved chapters

| Chapter | Source | Result |
|---|---|---|
| `http` | legacy HTML + authored phase override | approved |
| `http-wire-contract` | structured TypeScript | approved |
| `java-httpclient-json` | structured TypeScript | approved |
| `unreliable-api-client` | structured TypeScript | approved |
| `pure-java-api-project` | structured TypeScript | approved |

## New concept graph

Phase 7 adds 15 audited concepts:

- `http-mensagem-recurso`
- `http-metodo-semantica`
- `http-status-classe`
- `http-idempotencia-seguranca`
- `http-header-body-negociacao`
- `curl-inspecao-http`
- `httpclient-reuso-timeout`
- `http-response-bodyhandler`
- `dto-mapping-fronteira`
- `timeout-deadline-cancelamento-http`
- `retry-backoff-jitter`
- `rate-limit-paginacao`
- `secrets-integracao`
- `stub-http-deterministico`
- `falha-parcial-cache-stale`

The generated audit reports zero concept-order/reference violations after this phase.

## Pedagogical decisions

- The legacy `http` chapter remains the first contact. It now introduces HTTP shallowly through message anatomy, method semantics, status classes and `Accept`/`Content-Type` directionality before deeper Java integration appears.
- `http-wire-contract` forces protocol inspection with `curl` before Java code, so the student sees method, URI, headers, body and status as observable facts.
- `java-httpclient-json` uses standard Java first. The student configures `HttpClient`, builds `HttpRequest`, evaluates `HttpResponse` and maps JSON at the boundary before any Spring abstraction.
- `unreliable-api-client` makes failure normal: timeout, deadline, retry, backoff, jitter, `429`, pagination and secrets are treated as part of the contract.
- `pure-java-api-project` consolidates integration with local stubs, partial result modeling and stale fallback instead of depending on live internet for tests.

## Evidence

Latest master audit after Phase 7:

- 151 chapters tracked.
- 53 chapters approved.
- 98 chapters still explicit backlog.
- 167 concepts registered.
- 0 missing chapter prerequisites.
- 0 concept graph violations.

Commands used:

```bash
npm run generate:content
npm run audit:master
```

