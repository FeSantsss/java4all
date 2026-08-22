# Phase 23 — Progress and backup contract

Date: 2026-08-22

Status: completed

## Scope

Phase 23 does not change course content. It protects user data by adding an explicit progress-contract gate.

The new gate verifies:

1. progress schema remains version 11;
2. all learning-state fields remain represented in the schema;
3. persisted theme choices remain `system`, `white` and `contrast`;
4. the removed coffee theme does not reappear;
5. IndexedDB identity remains `java4br-course`;
6. local fallback remains `java4br:course-state:v1`;
7. legacy IndexedDB/localStorage migration remains wired;
8. backup envelope remains `java4br-progress-backup` with `courseId: java4br`;
9. future backups are rejected safely;
10. export/import uses `createBackup` and `parseBackup`;
11. importing still asks for confirmation before replacing current data;
12. schema and repository tests continue covering v9 migration, round-trip backup, invalid JSON rejection and legacy IndexedDB discovery.

## Final audit snapshot

- Chapters tracked: 151
- Chapters approved: 151
- Backlog chapters: 0
- Progress schema version: 11
- IndexedDB database: `java4br-course`
- Object store: `course-state`
- Local fallback: `java4br:course-state:v1`
- Backup kind: `java4br-progress-backup`

## Files changed by this phase

- `scripts/validate-progress-contract.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-23-progress-contract.md`

## Validation contract

The phase is protected by:

- `npm run validate:progress`
- `npm run test`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
