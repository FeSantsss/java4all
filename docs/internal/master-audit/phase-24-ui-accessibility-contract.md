# Phase 24 — UI and accessibility contract

Date: 2026-08-22

Status: completed

## Scope

Phase 24 does not change course content. It protects the learning interface against accessibility and UX regressions.

The new gate verifies:

1. skip link and `main-content` remain present;
2. system theme still resolves from color-scheme, contrast and forced-colors media queries;
3. only System, White and High Contrast remain exposed in settings;
4. the removed coffee theme does not reappear in settings or CSS;
5. reduced motion affects body class and smooth scrolling;
6. Study Hub remains a semantic modal with focus trap, Escape close, focus restoration and tab semantics;
7. Markdown notes keep edit/split/preview, toolbar labels, tasks, code blocks and accessible textarea;
8. CSS keeps visible focus, skip-link focus behavior, overflow handling, reduced motion and theme tokens;
9. axe tests remain present for the main app and open Study Hub;
10. Playwright keeps mobile/desktop, overflow, theme, manifest and critical axe coverage.

## Final audit snapshot

- Chapters tracked: 151
- Chapters approved: 151
- Backlog chapters: 0
- Unit/accessibility test files: app axe coverage present
- Browser E2E scenarios: 21
- Required themes: `system`, `white`, `contrast`
- Removed theme guarded: coffee/café

## Files changed by this phase

- `scripts/validate-ui-accessibility-contract.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-24-ui-accessibility-contract.md`

## Validation contract

The phase is protected by:

- `npm run validate:ui`
- `npm run test`
- `npm run test:e2e`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
