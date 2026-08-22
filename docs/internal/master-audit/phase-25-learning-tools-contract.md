# Phase 25 — Learning tools contract

Date: 2026-08-22

Status: completed

## Scope

Phase 25 protects the study tools that make the course usable day to day.

It also fixes and guards the title search regression: searching `spring` must match chapters whose titles contain Spring and must not surface unrelated chapters such as Git merely because hidden summary/context text matched.

The new gate verifies:

1. sidebar search filters chapters explicitly by title;
2. command palette chapter search also uses title-only matching;
3. practice/favorites filters and active chapter semantics remain present;
4. review keeps daily selected/deferred choices;
5. review remains multiple-choice with active recall, spaced interval updates and error capture;
6. knowledge hub keeps mastery, errors, diagnostic, projects and glossary views;
7. glossary search considers term, aliases and definitions and can open the related chapter;
8. diagnostic flow remains executable and records weak points;
9. Java Lab keeps offline execution, autosaved drafts, Ctrl/Cmd+Enter, copy, download and live console;
10. Playwright reproduces the Spring search regression and ensures Git does not appear.

## Final audit snapshot

- Chapters tracked: 151
- Chapters approved: 151
- Backlog chapters: 0
- Browser E2E scenarios: 22
- Search contract: title-only
- Review contract: multiple-choice + selected/deferred daily plan
- Java Lab: offline runner + saved drafts

## Files changed by this phase

- `platform/src/components/course/CourseSidebar.tsx`
- `platform/src/components/navigation/CommandPalette.tsx`
- `tests/e2e/responsive.spec.ts`
- `scripts/validate-learning-tools-contract.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-25-learning-tools-contract.md`

## Validation contract

The phase is protected by:

- `npm run validate:learning-tools`
- `npm run test:e2e`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
