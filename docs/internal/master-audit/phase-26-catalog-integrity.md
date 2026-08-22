# Phase 26 — Catalog and offline integrity

Date: 2026-08-22

Status: completed

## Scope

Phase 26 protects the public catalog, generated artifacts and offline cache from silent drift.

The new gate verifies:

1. `platform/public/course-content.json` remains byte-for-byte equivalent to `platform/src/content/generated-course.json`;
2. `platform/public/content/glossary.json` remains equivalent to the generated glossary;
3. module, chapter, concept, glossary, block and per-chapter resource IDs stay unique;
4. module ordering, chapter ordering and prerequisite references remain coherent;
5. every generated chapter remains approved and keeps at least two audited resources;
6. `catalog.json` keeps the same order, IDs, titles and phase metadata as the generated course;
7. `source-inventory.json` keeps the same chapter and glossary counts as the generated model;
8. every legacy chapter HTML file still matches its recorded byte count and SHA-256 hash;
9. every legacy chapter HTML file exists in `dist/`;
10. the generated service worker precaches the public course JSON, catalog, glossary, source inventory, manifest, icon and all 128 legacy chapter HTML files.

## Final audit snapshot

- Legacy chapters protected by catalog/offline gate: 128
- Total approved chapters in course: 151
- Concepts tracked: 384
- Glossary terms protected: 111
- HTML files hash-checked: 128
- Offline cache: app shell + public catalog + glossary + source inventory + every legacy chapter HTML

## Files changed by this phase

- `scripts/validate-catalog-integrity.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-26-catalog-integrity.md`
- `scripts/validate-final-release.mjs`

## Validation contract

The phase is protected by:

- `npm run validate:catalog`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
