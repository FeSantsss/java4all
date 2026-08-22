# Phase 22 — Maintenance guardrails

Date: 2026-08-22

Status: completed

## Scope

Phase 22 does not add curriculum content. It protects the now-complete course against common maintenance regressions:

1. adding a phase content file without wiring it into the generator;
2. forgetting to document a new source-of-truth file;
3. editing generated JSON as if it were authorial content;
4. letting root legacy monolith files reappear;
5. letting catalog chapters and canonical chapter HTML files diverge;
6. losing source-inventory hashes that prove content fidelity;
7. omitting late audit reports from README and final gates.

## Final audit snapshot

- Chapters tracked: 151
- Chapters approved: 151
- Backlog chapters: 0
- Concepts registered: 384
- Exercises: 160
- Quizzes: 268
- Phase content sources: 18
- Canonical legacy chapter HTML files: 128
- Root legacy monoliths allowed: 0

## Files changed by this phase

- `scripts/validate-maintenance-guardrails.mjs`
- `package.json`
- `README.md`
- `docs/internal/content-model.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-22-maintenance-guardrails.md`

## Validation contract

The phase is protected by:

- `npm run validate:maintenance`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
