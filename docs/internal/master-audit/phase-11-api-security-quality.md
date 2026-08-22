# Phase 11 - API security and quality

Date: 2026-08-22

Status: completed

## Scope

Reconstructed and approved the API security and quality module after Spring/API. The phase keeps the focus on study and avoids security theater: concepts start with identity and authorization vocabulary, then move to Spring Security, OAuth2/OIDC, HTTPS, RBAC, frontend authentication state and contract evolution.

Approved chapters:

- `autenticacao-conceitos`
- `spring-security`
- `security-oidc`
- `https`
- `mini-auth-rbac`
- `auth-front-ts`
- `frontend-aplicacao`
- `api-contract-evolution`

## Pedagogical changes

- Added 18 audited concepts covering sessions, JWT, OAuth2, OIDC, PKCE, Resource Server validation, TLS, browser token storage, RBAC, frontend states and contract evolution.
- Replaced generated compatibility checks in the legacy chapters with authored multiple-choice checks and rationales.
- Added intuitive first-contact blocks before security configuration and frontend code.
- Added explanations and common mistakes for all typed code blocks seen by the audit.
- Removed a future chapter prerequisite from `auth-front-ts` by grounding it in the already-approved RBAC/API security path.
- Added a project knowledge matrix for `mini-auth-rbac`.
- Approved the structured `api-contract-evolution` chapter with explicit concept graph, audited resources and phase-level purpose.

## Validation result

After generation and master audit:

- 151 chapters tracked.
- 92 chapters approved.
- 59 chapters remain explicit backlog.
- 252 concepts registered.
- 0 missing chapter prerequisites.
- 0 concept graph issues.
- 8/8 API security/quality chapters approved.

The remaining future prerequisites are intentional backlog edges outside this phase.
