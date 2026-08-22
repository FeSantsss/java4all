# Phase 20 — Final release hardening

Date: 2026-08-22

Status: completed

## Scope

Phase 20 is not a new curriculum expansion. The master specification's curricular sequence is complete after Phase 19. This phase hardens the release so the completed state cannot silently drift.

The phase adds an executable final gate that checks:

1. the master audit summary remains at the approved final numbers;
2. every chapter remains approved, reviewed, dependency-valid and resource-audited;
3. generated and public course artifacts stay aligned;
4. every phase report from discovery through final hardening exists;
5. README, content model and implementation progress mention the final state coherently;
6. Supabase does not reappear in critical client/package surfaces after its removal;
7. `npm run validate` executes the final release gate before E2E.
8. after Phase 21, deployment/PWA readiness remains part of the complete validation pipeline.

## Final audit snapshot

- Chapters tracked: 151
- Chapters approved: 151
- Backlog chapters: 0
- Concepts registered: 384
- Exercises: 160
- Quizzes: 268
- Unique curated resource URLs: 260
- Rendered external URLs validated online: 262
- Missing chapter prerequisites: 0
- Future chapter prerequisites: 0
- Concept graph issues: 0

## Files changed by this phase

- `scripts/validate-final-release.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-20-final-release-hardening.md`

## Validation contract

The phase is protected by:

- `npm run validate:final-release`
- `npm run validate:deployment`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
