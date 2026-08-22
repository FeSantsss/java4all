# Auditoria Mestre — Fase 2: fundamentos e primeiro projeto

Data: 2026-08-21

Status: concluída.

## Escopo aprovado

Os 12 primeiros capítulos foram relidos como uma única progressão para um aluno sem experiência prévia:

| Ordem | Capítulo | Pré-requisitos efetivos | Conceitos introduzidos | Decisão principal da revisão |
|---:|---|---|---|---|
| 1 | `intro` | nenhum | ciclo fonte/bytecode/runtime; JDK/JVM; terminal | Removeu POO e explicação de modificadores antes da hora; passou a validar o ambiente e o diretório. |
| 2 | `primeiro-programa` | `intro` | classe/main; stdout; categorias de falha | `main` é inicialmente um contrato de entrada, não uma sequência de palavras mágicas a decorar. |
| 3 | `variaveis-tipos` | `primeiro-programa` | tipo estático; primitivo/referência; conversão | Tornou explícito o que é copiado e onde há truncamento. |
| 4 | `operadores-expressoes` | `variaveis-tipos` | expressão; curto-circuito; identidade/conteúdo | Acrescentou ordem de avaliação e falha real por acesso antes da guarda de `null`. |
| 5 | `controle-fluxo` | `operadores-expressoes` | ramificação; ordem de condições; switch expression | Incluiu tabela de decisão e cobertura de faixas. |
| 6 | `lacos-repeticao` | `controle-fluxo` | contrato do laço; estruturas; fronteiras | Todo laço passa a ser explicado por estado, condição, progresso e prova de término. |
| 7 | `arrays-matrizes` | `lacos-repeticao` | índice/length; aliasing; array de arrays | Explicita limite exclusivo, referência compartilhada e linhas irregulares. |
| 8 | `strings-wrapper` | `arrays-matrizes` | imutabilidade; StringBuilder; wrappers/parsing | Compara valor textual, construção mutável e conversão; cobre retorno descartado e `null`. |
| 9 | `metodos-escopo` | `strings-wrapper` | contrato; passagem por valor; escopo/sobrecarga/varargs | Adiciona varargs e corrige o modelo mental de “objetos passados por referência”. |
| 10 | `entrada-console` | `metodos-escopo` | CLI/stdin/stdout; Scanner; parsing/validação/EOF | Mantém Scanner raso no início e aprofunda por camadas; arquivos, sockets e protocolos são apenas prévia definida. |
| 11 | `logica-programacao` | `metodos-escopo` | decomposição; dry run; casos-limite/invariantes | Formaliza ficha de solução e exige exemplos que revelem pressupostos errados. |
| 12 | `mini-caixa-eletronico` | `entrada-console`, `logica-programacao` | incrementos; separação I/O-regra; evidência manual | Remove exigências futuras e adiciona matriz completa requisito → conhecimento → capítulo → evidência. |

## Contrato aplicado

Cada capítulo aprovado possui:

- motivação específica baseada no problema que resolve;
- ponte intuitiva com limite explícito da analogia;
- conceitos introduzidos e reutilizados ligados ao grafo global;
- modelo mental, comparação, fluxo, tabela ou caso de erro conforme o assunto;
- explicação e erros comuns de todos os blocos de código tipados;
- exercício preservado ou projeto estruturado;
- verificação autoral de cenário, com distratores plausíveis e racional por alternativa;
- recursos oficiais específicos, verificados e ligados ao conteúdo;
- pré-requisitos existentes e anteriores na ordem efetiva.

## Grafo e projeto

- 36 conceitos fundamentais possuem capítulo introdutor, reforços, pré-requisitos, confusões e resultados observáveis.
- 0 referências de conceito ausentes.
- 0 conceitos futuros usados pelos capítulos aprovados.
- O caixa eletrônico possui cinco linhas de matriz de conhecimento e não exige coleção, banco, framework, teste automatizado, rede, retry ou timeout.
- O roteiro do projeto cobre caminho feliz, formato inválido, saldo insuficiente, capacidade do array e EOF com entrada, esperado e observado.

## Evidência automatizada

`npm run validate:depth` exige exatamente estes 12 capítulos aprovados nesta fase. Uma aprovação falha quando existir qualquer lacuna automática, recurso não auditado, dependência futura ou matriz de projeto incompleta.

Resultado após a reconstrução:

- 149 capítulos rastreados;
- 12 aprovados;
- 137 ainda reprovados na triagem e preservados como backlog explícito;
- 36 conceitos registrados;
- 0 violações no grafo de conceitos da fase;
- 12 dependências futuras restantes fora da fase, mantidas para correção posterior.

## Fontes e artefatos

- Conteúdo pedagógico estruturado da fase: `platform/content/foundations-phase-2.json`.
- Corpos legados ajustados: `intro.html` e `mini-caixa-eletronico.html`.
- Transformação: `scripts/generate-course-content.mjs`.
- Prova de origem: `platform/public/content/source-inventory.json`, atualizada somente pelo comando consciente `npm run inventory:update`.
- Relatório regenerável: `docs/internal/master-audit/phase-0-inventory.json` e `chapter-audit-matrix.csv`.

## Checklist de encerramento

- [x] Os 12 capítulos foram inspecionados em sequência.
- [x] Nenhum capítulo exige conceito futuro silencioso.
- [x] Todos os códigos tipados possuem explicação e erros comuns.
- [x] Quizzes gerados por título foram removidos da fase.
- [x] Todas as alternativas possuem racional específico.
- [x] Recursos foram substituídos por páginas oficiais específicas.
- [x] O projeto possui matriz de conhecimento e evidência reproduzível.
- [x] Fidelidade do corpus e inventário foram atualizados conscientemente.
- [x] Gate pedagógico aprova exatamente 12 capítulos.
- [ ] Demais capítulos — próximas fases curriculares.
