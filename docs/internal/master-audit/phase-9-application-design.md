# Phase 9 — Application design before frameworks

Date: 2026-08-22

## Scope

Phase 9 reconstructs the application-design module before the Spring API path:

- Java annotations and reflection as observable metadata/introspection.
- SOLID as pressure from change, not file-count theater.
- Manual dependency injection, composition root and a didactic IoC container.
- Design patterns as named trade-offs: Strategy, Factory, Adapter.
- Clean code and refactoring with behavioral safety.
- A pre-Spring mini-framework project with annotations, reflection, DI and dispatcher.
- IoC lifecycle and circular dependency reasoning before Spring Core formalization.
- Architecture boundaries: layers, ports/adapters and modular monolith trade-offs.
- DDD tactical modeling: ubiquitous language, Entity, Value Object, Aggregate and Bounded Context.

## Approved chapters

| Chapter | Source | Result |
|---|---|---|
| `anotacoes` | legacy HTML + authored phase override | approved |
| `solid` | legacy HTML + authored phase override | approved |
| `di` | legacy HTML + authored phase override | approved |
| `padroes` | legacy HTML + authored phase override | approved |
| `clean-code` | legacy HTML + authored phase override | approved |
| `projetospring` | legacy HTML + authored phase override | approved |
| `di-ioc-profundo` | legacy HTML + authored phase override | approved |
| `arquitetura-software` | legacy HTML + authored phase override | approved |
| `ddd` | legacy HTML + authored phase override | approved |

## New concept graph

Phase 9 adds 25 audited concepts:

- `annotation-metadata-contract`
- `reflection-runtime-introspection`
- `srp-coesao-motivo-mudanca`
- `ocp-polimorfismo-extensao`
- `lsp-contrato-substituicao`
- `isp-interface-pequena`
- `dip-dependencia-abstracao`
- `di-composicao-raiz`
- `ioc-container-registro-resolucao`
- `strategy-policy-object`
- `factory-criacao-invariante`
- `adapter-fronteira-externa`
- `nome-intencao-codigo`
- `funcao-pequena-nivel-abstracao`
- `refatoracao-rede-seguranca`
- `mini-framework-dispatcher`
- `ioc-lifecycle-bean`
- `dependencia-circular-grafo`
- `camadas-direcao-dependencia`
- `hexagonal-port-adapter`
- `monolito-modular-tradeoff`
- `linguagem-ubiqua`
- `entidade-value-object`
- `agregado-consistencia`
- `bounded-context-fronteira`

The generated audit reports zero concept-order/reference violations after this phase.

## Pedagogical decisions

- `anotacoes` now explicitly teaches that annotations are metadata and behavior requires a reader.
- `solid` is framed as diagnosis under change pressure, not an obligation to create abstractions everywhere.
- `di` requires manual composition before any framework container.
- `projetospring` is presented as a microscope for framework mechanisms, not a production replacement.
- `di-ioc-profundo` is repositioned as a conceptual container/lifecycle chapter before formal Spring Core.
- `arquitetura-software` no longer requires Kafka/deploy knowledge; microservices are a future trade-off, while layered/hexagonal modular design is taught now.
- `ddd` starts from language and consistency boundaries instead of JPA annotations or microservice fashion.

## Evidence

Latest master audit after Phase 9:

- 151 chapters tracked.
- 69 chapters approved.
- 82 chapters still explicit backlog.
- 210 concepts registered.
- 0 missing chapter prerequisites.
- 0 concept graph violations.

Commands used:

```bash
npm run generate:content
npm run audit:master
```

