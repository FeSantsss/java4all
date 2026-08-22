# Phase 27 — Assessment integrity

Date: 2026-08-22

Status: completed

## Scope

Phase 27 protects the learning assessment layer from becoming decorative or ambiguous.

The new gate verifies:

1. the final audit baseline keeps 268 checks, 160 exercises and 23 projects;
2. every approved chapter has at least one verification;
3. every approved chapter has practice through exercise or project;
4. each generated quiz has an ID, prompt, concept/review trace, at least three alternatives, exactly one correct answer and unique option labels;
5. every quiz option has an explanation/rationale;
6. generated concept checks do not turn diagrams into answer alternatives;
7. every generated exercise has a title, substantial prompt, valid difficulty and at least two acceptance criteria;
8. every generated project has requirements, acceptance criteria, guidance and a knowledge matrix;
9. every project knowledge-matrix row links requirement, concepts, chapters and expected evidence;
10. structured-chapter generation still creates concept quizzes, manual quizzes, exercises, project acceptance criteria and project knowledge matrices;
11. content tests still protect structured quiz coverage and advanced English project contracts.

## Final audit snapshot

- Final checks: 268
- Final exercises: 160
- Final projects: 23
- Generated legacy quizzes: 157
- Generated legacy exercises: 137
- Generated legacy projects: 11
- Approved chapters without backlog: 151
- Required answer rationales: every quiz option

## Files changed by this phase

- `scripts/validate-assessment-integrity.mjs`
- `package.json`
- `README.md`
- `docs/internal/implementation-progress.md`
- `docs/internal/master-audit/phase-27-assessment-integrity.md`
- `scripts/validate-final-release.mjs`
- `scripts/validate-ui-accessibility-contract.mjs`
- `scripts/validate-learning-tools-contract.mjs`
- `scripts/validate-catalog-integrity.mjs`

## Validation contract

The phase is protected by:

- `npm run validate:assessment`
- `npm run validate:final-release`
- `npm run validate`
- `npm run validate:links`
- `git diff --check`
