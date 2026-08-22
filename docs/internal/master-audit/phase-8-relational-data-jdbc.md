# Phase 8 — Relational data and JDBC

Date: 2026-08-22

## Scope

Phase 8 reconstructs the relational data path before ORM/Spring Data:

- SQL as a relational contract, not spreadsheet syntax.
- PostgreSQL types, constraints, query plans, MVCC, isolation and locks.
- Versioned schema evolution through migrations.
- JDBC resource ownership: driver, connection, `PreparedStatement`, `ResultSet`, pool, commit and rollback.
- A finance ledger project with migrations, decimal money, SQL aggregation and explicit transaction evidence.

## Approved chapters

| Chapter | Source | Result |
|---|---|---|
| `sql` | legacy HTML + authored phase override | approved |
| `postgres` | legacy HTML + authored phase override | approved |
| `postgres-concorrencia` | legacy HTML + authored phase override | approved |
| `migrations` | legacy HTML + authored phase override | approved |
| `jdbc` | legacy HTML + authored phase override | approved |
| `mini-financas-jdbc` | legacy HTML + authored phase override | approved |
| `jdbc-under-the-hood` | structured TypeScript | approved |

## New concept graph

Phase 8 adds 18 audited concepts:

- `modelo-relacional-tabela-chave`
- `ddl-schema-constraint`
- `dml-crud-sql`
- `join-cardinalidade-sql`
- `agregacao-groupby-sql`
- `sql-transacao-atomicidade`
- `indice-plano-custo`
- `postgres-tipo-dado-dominio`
- `postgres-explain-analyze`
- `mvcc-isolamento-lock`
- `migration-versionada-checksum`
- `migration-expand-contract`
- `jdbc-driver-connection`
- `preparedstatement-parametro`
- `resultset-mapeamento`
- `pool-conexao-backpressure`
- `jdbc-transacao-rollback`
- `financas-ledger-invariante`

The generated audit reports zero concept-order/reference violations after this phase.

## Pedagogical decisions

- `sql` starts with tables, keys, constraints, CRUD, joins, aggregation, transactions and indexes as a shared data contract.
- `postgres` introduces a real database surface: domain-aware types, `EXPLAIN` and observable planner behavior.
- `postgres-concorrencia` makes concurrency visible through MVCC, isolation, locks and failure reproduction before frameworks hide the database.
- `migrations` treats schema history like code history, with checksum and expand/contract thinking before Spring/JPA.
- `jdbc` removes the future prerequisite on design patterns and focuses on what is already taught: SQL, exceptions, resources and configuration.
- `mini-financas-jdbc` becomes an auditable project with a requirement-to-concept-to-evidence matrix.
- `jdbc-under-the-hood` is now a reinforcing structured chapter rather than a pending extra.

## Evidence

Latest master audit after Phase 8:

- 151 chapters tracked.
- 60 chapters approved.
- 91 chapters still explicit backlog.
- 185 concepts registered.
- 0 missing chapter prerequisites.
- 0 concept graph violations.

Commands used:

```bash
npm run generate:content
npm run audit:master
```

