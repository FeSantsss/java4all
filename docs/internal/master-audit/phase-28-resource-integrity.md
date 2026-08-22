# Phase 28 — Resource integrity

Date: 2026-08-22

Status: completed

## Scope

Phase 28 protects external learning resources from silent quality drift.

This is separate from link health: `npm run validate:links` proves that URLs respond; this phase proves that the resources remain pedagogically usable and traceable.

The new gate verifies:

1. the final audit keeps 260 curated unique resource URLs;
2. the 128 generated legacy chapters keep 256 typed resources and 231 unique typed URLs;
3. every generated resource has ID, title, publisher, language, expected level, `verifiedAt`, `auditStatus` and a meaningful `reinforces` purpose;
4. every generated resource uses HTTPS;
5. every generated resource is approved for relevance;
6. every generated resource is in English for contextual technical-English exposure;
7. every generated chapter keeps at least two resources;
8. every generated chapter keeps at least one official or normative resource;
9. the course keeps priority on official/normative sources;
10. generic channel links are rejected;
11. URLs repeated in mass are rejected;
12. the audit model keeps flags for generic and over-repeated resources;
13. the README and content model keep the resource-quality contract visible.

## Final audit snapshot

- Curated unique resource URLs: 260
- Generated legacy resources: 256
- Generated legacy unique URLs: 231
- Generated resource languages: English
- Resource audit status: approved
- Generic resources in approved chapters: 0
- Mass-repeated resources in approved chapters: 0
- Online rendered URL check: 262 URLs via `npm run validate:links`

## Files changed by this phase

- `scripts/validate-resource-integrity.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-28-resource-integrity.md`
- `scripts/validate-final-release.mjs`
- `scripts/validate-ui-accessibility-contract.mjs`
- `scripts/validate-learning-tools-contract.mjs`
- `scripts/validate-catalog-integrity.mjs`
- `scripts/validate-assessment-integrity.mjs`

## Validation contract

The phase is protected by:

- `npm run validate:resources`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
