# Auditoria Mestre — Fase 5: I/O, CLI e Process API

Data: 2026-08-22

Status: concluída.

## Escopo aprovado

A fase reconstruiu a progressão de fronteiras locais: filesystem, texto, relatórios, JSON, processos externos e o primeiro incremento do projeto Zenith. A sequência efetiva é I/O → analisador de vendas → JSON → Process API → importador de pedidos → Zenith CLI inicial.

| Ordem | Capítulo | Pré-requisito efetivo | Núcleo da reconstrução |
|---:|---|---|---|
| 1 | `java-io` | `java-21-profundo` | `Path`, `Files`, charset, leitura total versus incremental, ciclo de recurso e falhas de ambiente. |
| 2 | `mini-analisador-vendas` | `java-io` | CSV didático, parser, laços antes de Streams, relatórios determinísticos e evidência. |
| 3 | `json` | `mini-analisador-vendas` | JSON como contrato textual, DTO, Jackson, records, serialização e desserialização sem Spring prematuro. |
| 4 | `process-api-cli` | `json` | `ProcessBuilder`, argumentos separados, stdout/stderr, exit code, timeout, cleanup e risco de shell injection. |
| 5 | `mini-importador-pedidos` | `process-api-cli` e `json` | Importação tolerante, rejeições com contexto, relatório JSON e distinção entre erro de linha e falha fatal. |
| 6 | `zenith-cli-inicial` | `mini-importador-pedidos` | CLI determinística, comandos permitidos, allowlist, fixtures, relatório e limites conscientes. |

## Correções técnicas e pedagógicas

- `java-io` deixou de ser uma receita curta e passou a explicar caminho, arquivo, diretório, byte, caractere, charset e recurso aberto.
- `Files.lines` é ensinado com `try-with-resources`; o curso não sugere que GC fecha arquivo nem que `readAllLines` serve para entradas grandes.
- JSON saiu da dependência prematura de Spring/anotações e foi reposicionado como formato textual de fronteira, com DTO e validação explícita.
- Jackson é explicado por propriedades, records e configuração, sem prometer que desserialização valida regra de domínio.
- O importador diferencia rejeição de registro e falha fatal de ambiente, preservando contexto e causa.
- Process API ganhou capítulo próprio. `ProcessBuilder` não aparece mais como detalhe perdido em ferramentas futuras.
- O exemplo de processo evita shell livre, preserva stdout/stderr/exit code, usa timeout e redireciona saídas para arquivos temporários para não ensinar bloqueio por buffer.
- Zenith inicia como projeto de estudo determinístico: comandos pequenos, argumentos tipados, allowlist, fixtures e nenhuma execução arbitrária de texto livre.

## Contrato pedagógico aplicado

Os seis capítulos possuem motivação específica, objetivos verificáveis, pré-requisitos validados, conceitos introduzidos e reutilizados, blocos semânticos, quizzes com racional, práticas e recursos auditados. Projetos aprovados possuem matriz de conhecimento quando aparecem como bloco de projeto.

## Evidência automatizada

`npm run validate:depth` exige a aprovação acumulada das fases 2, 3, 4 e 5. O gate reprova aprovação falsa quando há código sem explicação, quiz sem racional, recurso genérico, dependência futura ou projeto sem matriz de conhecimentos.

Resultado regenerado:

- 151 capítulos rastreados;
- 39 aprovados;
- 112 reprovados na triagem e preservados como backlog explícito;
- 126 conceitos registrados;
- 0 violações de ordem ou referência no grafo de conceitos;
- 10 dependências futuras restantes fora das fases aprovadas;
- 445 quizzes, 157 exercícios e 119 URLs únicas inventariadas.

## Fontes normativas e oficiais consultadas

- Oracle Java 21: `Files`, `StandardCharsets`, `Process`, `ProcessBuilder`.
- RFC 8259: formato JSON.
- Jackson Databind: `ObjectMapper`, data binding, POJOs e records.
- JLS: sealed classes usadas na modelagem inicial de comandos do Zenith.

## Artefatos

- Conteúdo pedagógico: `platform/content/io-cli-phase-5.json`.
- Capítulos estruturados: `process-api-cli` e `zenith-cli-inicial` em `platform/src/content/required-chapters.ts`.
- Corpos revisados: `java-io.html`, `mini-analisador-vendas.html`, `json.html` e `mini-importador-pedidos.html`.
- Geração: `scripts/generate-course-content.mjs`.
- Gate: `scripts/validate-pedagogical-depth.mjs`.
- Inventário e matrizes: `docs/internal/master-audit/`.

## Checklist de encerramento

- [x] I/O ensina fronteira e falha antes de projeto.
- [x] JSON não depende de Spring para ser compreendido.
- [x] Process API possui capítulo próprio antes de ferramentas futuras.
- [x] Zenith v0 é determinístico, seguro por escopo e offline.
- [x] Todos os conceitos e pré-requisitos resolvem sem violação.
- [x] O gate pedagógico aprova exatamente 39 capítulos acumulados.
- [ ] Demais 112 capítulos — próximas fases curriculares.
