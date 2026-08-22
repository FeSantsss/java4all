# Auditoria Mestre — Fase 4: Java Core

Data: 2026-08-22

Status: concluída.

## Escopo aprovado

A fase reconstruiu Java Core como uma progressão de contratos da linguagem e das APIs, sem começar por receitas. A sequência efetiva é pacotes → exceções → Collections → generics → Streams → Java moderno → laboratório semântico → JVM → Java 21.

| Ordem | Capítulo | Pré-requisito efetivo | Núcleo da reconstrução |
|---:|---|---|---|
| 1 | `pacotes` | `mini-biblioteca-cli` | Namespace, nome qualificado, importação, visibilidade de pacote, classpath e compilação com `-d`. |
| 2 | `excecoes` | `pacotes` | Hierarquia de falhas, checked/unchecked, propagação, causa, `finally` e `try-with-resources`. |
| 3 | `colecoes` | `excecoes` | Escolha por contrato, igualdade, hashing, ordem, mutabilidade, cópia e visão não modificável. |
| 4 | `generics` | `colecoes` | Invariância, limites, PECS, curingas, apagamento de tipos e restrições de tipos reificáveis. |
| 5 | `streams` | `generics` | Pipeline lazy e de uso único, não interferência, cardinalidade, redução e coleta. |
| 6 | `javamoderno` | `streams` | `var`, Optional, API temporal, records, text blocks e escolhas de modelagem modernas. |
| 7 | `functional-semantics-lab` | `javamoderno` | Decisão entre Optional, Set, lambda, loop e Stream pela cardinalidade, efeito e evidência. |
| 8 | `jvm-profundo` | laboratório semântico | Semântica versus implementação, bytecode, JIT, áreas de execução, alcançabilidade e coletores. |
| 9 | `java-21-profundo` | `jvm-profundo` | Records, sealed types, pattern matching e virtual threads com limites explícitos. |

## Correções técnicas e pedagógicas

- Pacote é namespace da linguagem; a árvore de diretórios é o mapeamento esperado pelas ferramentas e pelo ambiente de hospedagem, não a definição do conceito.
- `import` permite usar nomes simples: não copia classes, não carrega bytecode e não importa subpacotes.
- Exceção checked é uma categoria sujeita à verificação de compilação; isso não prova recuperabilidade. O curso separa falha de domínio, erro de programação e condição externa.
- `finally` é apresentado como mecanismo de finalização normal ou abrupta dentro do fluxo da JVM, sem a promessa falsa de execução em qualquer encerramento de processo.
- Igualdade lógica vem antes de `HashSet` e `HashMap`; o contrato entre `equals` e `hashCode`, colisões e chaves mutáveis é demonstrado antes da API.
- `List<Integer>` não é subtipo de `List<Number>`. `? extends T` e `? super T` são ensinados pelos limites seguros de leitura e escrita, sem chamar o primeiro de absolutamente somente leitura.
- Streams são pipelines lazy, não estruturas de dados reutilizáveis. O curso exige ausência de interferência e distingue `map`, `flatMap`, `reduce` e `collect` por semântica.
- Optional representa zero ou um resultado; não substitui indiscriminadamente campos, parâmetros ou coleções. `orElse` e `orElseGet` são comparados pela avaliação do fallback.
- Records não são confundidos com imutabilidade profunda; cópias defensivas continuam necessárias para componentes mutáveis.
- Conceitos de JVM são separados de decisões do HotSpot. Alocação na stack, ordem exata de compilação JIT, layout geracional e momento da coleta não são garantias da linguagem.
- Virtual threads são apresentadas para grande quantidade de tarefas bloqueantes independentes, não como aceleração de CPU ou redução automática da latência. Estado compartilhado, cancelamento e limitação de recursos ficam para a fase de concorrência.

## Contrato pedagógico aplicado

Os nove capítulos possuem motivação específica, objetivos verificáveis, pré-requisitos validados, conceitos introduzidos e reutilizados, ponte intuitiva com limite declarado, blocos semânticos, explicações para todos os exemplos tipados, cenários de erro, prática e quiz autoral com racional por alternativa. Os recursos foram associados ao conceito concreto e marcados como auditados somente após inspeção de relevância.

O laboratório semântico estruturado força o aluno a declarar antes do código:

1. quantos resultados podem existir;
2. se ordem e duplicidade fazem parte do contrato;
3. se a operação transforma, filtra, achata ou apenas produz efeito;
4. qual evidência demonstra que a escolha preserva o comportamento;
5. em que ponto um loop explícito comunica melhor que um pipeline.

## Evidência automatizada

`npm run validate:depth` exige a aprovação dos 12 capítulos de Fundamentos, 12 de POO e 9 desta fase. O gate reprova qualquer capítulo aprovado com lacuna, dependência futura, recurso não auditado, código sem explicação ou quiz sem racional.

Resultado regenerado:

- 149 capítulos rastreados;
- 33 aprovados;
- 116 reprovados na triagem e preservados como backlog explícito;
- 111 conceitos registrados;
- 0 violações de ordem ou referência no grafo de conceitos;
- 11 dependências futuras restantes fora das fases aprovadas;
- 444 quizzes, 155 exercícios e 112 URLs únicas inventariadas.

## Fontes normativas e oficiais consultadas

- Java Language Specification: packages, exceções e demais contratos da linguagem.
- Dev.java: Collections Framework, generics e Stream API.
- Oracle Java 21: mudanças da linguagem e guia de virtual threads.

As URLs exatas e o propósito de cada material ficam nos recursos auditados dos capítulos e no relatório mestre regenerável.

## Artefatos

- Conteúdo pedagógico: `platform/content/java-core-phase-4.json`.
- Laboratório estruturado: `platform/src/content/required-chapters.ts`.
- Corpos revisados: `pacotes.html`, `excecoes.html`, `colecoes.html`, `generics.html`, `streams.html`, `javamoderno.html`, `jvm-profundo.html` e `java-21-profundo.html`.
- Geração: `scripts/generate-course-content.mjs`.
- Gate: `scripts/validate-pedagogical-depth.mjs`.
- Inventário e matrizes: `docs/internal/master-audit/`.

## Checklist de encerramento

- [x] A ordem ensina organização e falhas antes das estruturas de API.
- [x] Igualdade e hashing antecedem Set e Map.
- [x] Generics antecedem Streams.
- [x] Optional e lambdas aparecem rasos antes do laboratório de decisão aprofundado.
- [x] JVM separa contrato observável de detalhe de implementação.
- [x] Java 21 não antecipa concorrência compartilhada.
- [x] Todos os conceitos e pré-requisitos resolvem sem violação.
- [x] O gate pedagógico aprova exatamente 33 capítulos acumulados.
- [ ] Demais 116 capítulos — próximas fases curriculares.
