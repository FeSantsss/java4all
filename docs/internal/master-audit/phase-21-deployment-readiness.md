# Phase 21 — Deployment and PWA readiness

Date: 2026-08-22

Status: completed

## Scope

Phase 21 does not change the curriculum. It protects delivery of the already approved course by adding a deployment-specific validation gate.

The new gate verifies:

1. GitHub Pages workflow identity, permissions, branch, concurrency and manual dispatch;
2. Node.js version alignment between `package.json` and CI;
3. reproducible install and full `npm run validate` before deployment;
4. Pages artifact upload from `dist/`;
5. Vite root, relative base and output directory for repository Pages hosting;
6. PWA manifest identity, language, scope, start URL and maskable icon;
7. generated service worker cache identity, old-cache cleanup and offline cache command;
8. build output contains application shell, course JSON, catalog, glossary and chapter HTML files;
9. README documents the deployment readiness gate.

## Final audit snapshot

- Chapters tracked: 151
- Chapters approved: 151
- Backlog chapters: 0
- Concepts registered: 384
- Exercises: 160
- Quizzes: 268
- Unique curated resource URLs: 260
- Rendered external URLs validated online: 262
- GitHub Pages artifact: `dist/`
- PWA cache identity: `java4br-platform-v2`

## Files changed by this phase

- `scripts/validate-deployment-readiness.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-20-final-release-hardening.md`
- `docs/internal/master-audit/phase-21-deployment-readiness.md`

## Validation contract

The phase is protected by:

- `npm run validate:deployment`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
