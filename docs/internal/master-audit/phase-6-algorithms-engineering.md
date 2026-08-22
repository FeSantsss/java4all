# Auditoria Mestre — Fase 6: Algoritmos + Engenharia

Data: 2026-08-22

Status: concluída.

## Escopo aprovado

A fase reconstruiu a base de algoritmos e práticas iniciais de engenharia sem antecipar frameworks. A sequência efetiva cobre Big O, recursão, ordenação/busca, estruturas práticas, Git, build reproduzível, debugging, logging e testes unitários iniciais.

| Ordem | Capítulo | Pré-requisito efetivo | Núcleo da reconstrução |
|---:|---|---|---|
| 1 | `big-o` | `zenith-cli-inicial` | Crescimento assintótico, tempo/espaço e diferença entre análise, benchmark e profiling. |
| 2 | `recursao` | `big-o` | Caso base, progresso, stack frames, iteração e memoization. |
| 3 | `ordenacao-busca` | `recursao` | Busca binária, invariantes, Merge Sort, estabilidade e uso da API padrão. |
| 4 | `algoritmos-praticos` | `ordenacao-busca` | Estrutura pela operação dominante, BFS/DFS, heap/top-k, Dijkstra e benchmark. |
| 5 | `git` | `zenith-cli-inicial` | Working tree, index, commit, branch, merge/rebase, `.gitignore` e segredos. |
| 6 | `build` | `git` | Maven, Gradle, ciclo de build, dependências, escopos, versões e wrapper. |
| 7 | `debugging` | `build` | Hipótese, breakpoints, watchpoints, step, stack e inspeção de estado. |
| 8 | `logging` | `debugging` | Níveis, contexto, SLF4J, causa de exceção e configuração externa. |
| 9 | `testes` | `logging` | JUnit 5, AAA, FIRST, assertions, parametrização e TDD inicial. |

## Correções técnicas e pedagógicas

- Big O é apresentado como crescimento, não tempo absoluto.
- Benchmark e profiling foram separados de análise assintótica; medições ingênuas com uma execução curta não são vendidas como prova.
- Recursão exige caso base e progresso; stack frames e `StackOverflowError` são tratados como consequência concreta.
- Busca binária é ensinada por pré-condição e invariante de intervalo.
- Ordenação própria fica como exercício de entendimento; produção usa APIs do JDK salvo justificativa e medição.
- Estruturas são escolhidas pela operação dominante, não por moda ou nome famoso.
- Git é ensinado como histórico revisável e proteção de segredos, não apenas comandos decorados.
- Build tool é contrato de reprodução fora da IDE.
- Debugging começa por hipótese falsificável e termina em teste de regressão.
- Logging preserva contexto, nível e causa sem vazar segredo.
- Testes entram como contrato executável antes de frameworks pesados.

## Contrato pedagógico aplicado

Os nove capítulos possuem motivação específica, objetivos verificáveis, pré-requisitos validados, conceitos introduzidos e reutilizados, blocos semânticos, quizzes com racional, explicações para todos os exemplos e recursos auditados.

## Evidência automatizada

`npm run validate:depth` exige a aprovação acumulada das fases 2, 3, 4, 5 e 6.

Resultado regenerado:

- 151 capítulos rastreados;
- 48 aprovados;
- 103 reprovados na triagem e preservados como backlog explícito;
- 152 conceitos registrados;
- 0 violações de ordem ou referência no grafo de conceitos;
- 10 dependências futuras restantes fora das fases aprovadas.
- 422 quizzes, 157 exercícios e 135 URLs únicas inventariadas.

## Fontes normativas e oficiais consultadas

- Oracle Java 21: Collections, Arrays, PriorityQueue, Deque, StackOverflowError.
- JVMS: frames da JVM.
- OpenJDK JMH.
- Git SCM: Pro Git e gitignore.
- Apache Maven e Gradle.
- VS Code Java Debugging e IntelliJ IDEA Breakpoints.
- SLF4J e Logback.
- JUnit 5 e Maven Surefire.

## Artefatos

- Conteúdo pedagógico: `platform/content/algorithms-engineering-phase-6.json`.
- Geração: `scripts/generate-course-content.mjs`.
- Gate: `scripts/validate-pedagogical-depth.mjs`.
- Testes: `platform/src/app/App.test.tsx` e `tests/e2e/responsive.spec.ts`.

## Checklist de encerramento

- [x] Algoritmos não dependem de banco, Spring ou arquitetura futura.
- [x] Engenharia inicial ensina Git/build/debug/log/teste como ferramentas de evidência.
- [x] Todos os exemplos de código aprovados têm explicação e erros comuns.
- [x] Todos os conceitos e pré-requisitos resolvem sem violação.
- [x] O gate pedagógico aprova exatamente 48 capítulos acumulados.
- [ ] Demais 103 capítulos — próximas fases curriculares.
