# Phase 29 — Technical English Contract

Status: completed

Date: 2026-08-22

## Objective

Convert the contextual technical-English system into an executable release contract. The course must keep English as a study aid inside Java practice, not as a separate translation track.

## Scope

- 128 generated legacy chapters with one contextual technical-English activity each.
- Four autonomy levels: context first, guided reading, applied comprehension, and professional use.
- Module-level progression from level 0 to level 3.
- UI entry points in the chapter toolbar, sidebar, command palette, and Study Hub.
- Evidence persistence through `englishEvidence`, migration, backup, and import.
- Documentation in README and internal progress notes.

## Contract implemented

Added `scripts/validate-technical-english-contract.mjs` and wired it into `npm run validate` as `npm run validate:technical-english`.

The validator now fails the release if:

- the 128 generated chapters do not all contain useful `englishActivity` data;
- level distribution changes from `23/41/45/19` without deliberate review;
- module English levels stop progressing monotonically from 0 to 3;
- a chapter diverges between `englishLevel` and `englishActivity.level`;
- labels no longer match the expected progression;
- compatibility aliases `instruction` and `prompt` drift from `readPassage` and `productionTask`;
- activities become translation exercises or isolated vocabulary work;
- level 0 stops being shallow/contextual, level 1 loses guided search/reading, level 2 loses applied failure/contract comprehension, or level 3 stops producing professional English artifacts;
- `EnglishActivity` schema fields disappear;
- `validate:english` stops checking all 414 code examples and anti-Portuguese-code rules;
- `englishEvidence` stops being part of progress, migration, and backup;
- the English Lab or Study Hub loses meaning-first UX, code context, success check, saved evidence, or roadmap;
- toolbar/sidebar/command-palette entry points disappear;
- README/internal progress stop documenting the contract.

## Evidence

- Generated activities: 128.
- Level distribution: `23/41/45/19`.
- Labels: `Context first`, `Guided reading`, `Applied comprehension`, `Professional use`.
- Persistence key: `englishEvidence`.
- Primary gate: `npm run validate:technical-english`.
- Base linguistic/code gate preserved: `npm run validate:english`.

## Result

The course remains focused on studying Java. Technical English is protected as contextual practice connected to code, documentation, errors, contracts, issues, requirements, acceptance criteria, and trade-offs — without becoming a detached language course.
