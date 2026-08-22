# Auditoria Mestre — Fase 0: descoberta

Data da auditoria: 2026-08-21

Status: concluída como descoberta; nenhuma fase curricular está aprovada.

## Decisão de aceite

O curso está tecnicamente funcional e possui bastante conteúdo, mas **não atende ainda ao novo contrato de profundidade pedagógica**. A validação anterior confundia preservação, quantidade e presença de termos com ensino comprovado. Nesta nova auditoria, nenhum dos 149 capítulos foi aprovado sem leitura humana pelo critério do aluno que conhece somente os pré-requisitos declarados.

Resultado da triagem reproduzível:

- 149 capítulos inventariados: 128 legados e 21 estruturados;
- 20 módulos;
- 155 exercícios, 511 quizzes e 11 projetos detectados;
- 55 URLs externas únicas;
- 268 relações declaradas entre capítulos;
- 12 relações apontam para conteúdo posicionado adiante na ordem efetiva;
- 149 capítulos reprovados na triagem automática;
- 0 capítulos aprovados pedagogicamente.

Os números acima são inventário, não prova de qualidade.

## Artefatos desta fase

- `scripts/audit-master-course.mjs`: lê as duas fontes de conteúdo, monta a ordem efetiva e regenera a auditoria.
- `phase-0-inventory.json`: inventário detalhado, sinais automáticos e mapa de fontes.
- `chapter-audit-matrix.csv`: matriz com uma linha para cada um dos 149 capítulos.
- `dependency-graph.json`: nós e arestas declarados de módulos e capítulos, inclusive referências futuras.

O campo `depthReviewed` permanece `false` em todas as linhas. O script não tem permissão conceitual para converter presença de blocos em aprovação humana.

## Fontes de verdade comprovadas

| Conteúdo | Fonte de verdade | Derivado/consumidor |
|---|---|---|
| Corpo dos 128 capítulos legados | `platform/public/content/chapters/<id>.html` | `generated-course.json` e `course-content.json` |
| Ordem e metadados legados originais | `platform/public/content/catalog.json` | gerador e navegação |
| 21 capítulos adicionais | `platform/src/content/required-chapters.ts` | montagem em `course.ts` |
| Grafo e destino dos módulos | `docs/internal/pedagogy-plan.js` | gerador e `validate-pedagogy.js` |
| Glossário | `platform/public/content/glossary.json` | conteúdo gerado |
| Contrato de tipos | `platform/src/content/schema.ts` | renderizadores e capítulos estruturados |
| Transformação legado → React | `scripts/generate-course-content.mjs` | dois JSONs gerados |
| Montagem final de 149 capítulos | `platform/src/content/course.ts` | aplicação React |
| Persistência | `platform/src/progress/schema.ts` e `repository.ts` | hooks e painéis de estudo |
| Renderização | `platform/src/components/course/*` | aplicação pública |
| Artefatos publicados | `dist/` | gerados pelo build; nunca editar diretamente |

Regra de alteração estabelecida: capítulos legados são corrigidos em seus HTMLs canônicos; capítulos adicionais, em `required-chapters.ts`; metadados derivados, no gerador ou no schema. Os JSONs e `dist/` nunca são fontes autorais.

## Arquitetura encontrada

O projeto usa React 19, TypeScript estrito, Vite, Tailwind, Vitest, Playwright, IndexedDB e PWA gerado. A separação entre conteúdo, renderização e progresso é válida e deve ser preservada.

A cadeia de conteúdo é:

```text
128 HTMLs + catálogo + glossário + plano de módulos
                       │
                       ▼
          generate-course-content.mjs
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
generated-course.json      public/course-content.json
          │
          └────── + 21 capítulos TypeScript ──────► course.ts ─► React
```

Essa cadeia preserva o corpus, mas o gerador também inventa metadados pedagógicos. Preservação e autoria estão misturadas e precisam ser separadas na Fase 1.

## Reprovações estruturais comprovadas

### 1. Motivação fictícia

Os 128 capítulos legados recebem automaticamente a frase:

> Este capítulo introduz ... quando seus pré-requisitos já permitem discutir decisões, limites e uso real.

Ela não explica o problema, a ausência da ferramenta nem o uso real específico. O campo existe, mas a motivação não foi escrita.

### 2. Quizzes artificiais

O gerador transforma cada `h3` em uma pergunta do formato “qual afirmação descreve corretamente o conceito?”. As alternativas são parágrafos de outras seções. Isso produziu 128 capítulos com quizzes gerados por título e não comprova compreensão, previsão, debugging ou decisão.

Além disso:

- todos os 149 capítulos possuem ao menos um quiz sem racional por alternativa;
- o renderizador ignora `option.explanation` mesmo quando ela existe;
- o feedback visual é uma frase genérica, não explica o erro conceitual;
- os validadores cobram contagem e unicidade, não a plausibilidade dos distratores.

### 3. Contrato documentado diferente do schema real

`docs/internal/content-model.md` promete blocos de modelo mental, comparação, erro, diagrama, tabela, explicação de código, recursos e referências. O union type atual não contém `mental-model`, `comparison`, `error-case`, `diagram`, `table`, `resource-group`, `question-ref` nem explicação estruturada em `CodeBlock`.

Consequências:

- explicações permanecem escondidas em HTML sem semântica verificável;
- 113 capítulos têm bloco de código tipado sem campo de explicação;
- não é possível validar cobertura de erros, comparações ou trade-offs por conceito;
- o schema atual não consegue representar integralmente o contrato solicitado.

### 4. Recursos externos de preenchimento

O gerador atribui o mesmo perfil de duas URLs a módulos inteiros. A triagem encontrou:

- canal genérico `youtube.com/@java` em 75 capítulos;
- canal genérico `youtube.com/@SpringSourceDev` em 34 capítulos;
- canal genérico `youtube.com/@atomicjar` em 10 capítulos;
- página geral `dev.java/learn/` em 19 capítulos;
- 133 capítulos reutilizam em massa uma mesma URL;
- 125 capítulos possuem ao menos um recurso genericamente associado.

O validador de links prova somente resposta HTTP. Ele não prova relevância, seção específica, idioma, nível nem atualidade técnica.

### 5. Grafo de capítulo inválido

O grafo de módulos é acíclico, mas o validador anterior não verificava a ordem efetiva das relações entre capítulos. Foram encontrados 12 arcos futuros em 10 capítulos:

| Capítulo | Pré-requisito futuro declarado |
|---|---|
| `json` | `anotacoes` |
| `jdbc` | `padroes` |
| `mockito` | `di`, `padroes` |
| `webclient` | `resilience` |
| `hardening-producao` | `observabilidade-pratica` |
| `di-ioc-profundo` | `spring-core` |
| `jvm-profundo` | `threads` |
| `arquitetura-software` | `kafka`, `deploy-backend` |
| `auth-front-ts` | `conectando-front-back` |
| `websockets` | `conectando-front-back` |

O problema não deve ser “corrigido” removendo links. Cada relação precisa ser analisada: mover, dividir, criar uma introdução anterior ou retirar a dependência real do texto.

### 6. Não existe grafo real de conceitos

`conceptIds` são derivados de títulos e não há entidade `Concept` implementada com `introducedIn`, `reinforcedIn`, `prerequisiteConceptIds`, confusões e resultados. Também não há declaração dos conceitos **utilizados** por um capítulo. Portanto, o repositório só consegue provar referências de capítulos, não a regra:

```text
conceito utilizado -> capítulo anterior que o ensinou
```

Essa limitação bloqueia uma auditoria honesta de projetos e assuntos prematuros.

### 7. Projetos sem matriz de conhecimento

Os 11 projetos estruturados possuem requisitos e critérios, porém nenhum possui a matriz obrigatória:

```text
requisito -> conceito necessário -> capítulo anterior -> evidência esperada
```

O painel de prontidão usa somente `prerequisiteChapterIds` do capítulo. Ele não prova que cada requisito do projeto foi ensinado.

### 8. Conteúdo obrigatório ausente ou comprimido

- Não existe capítulo completo de Process API. `ProcessBuilder` aparece como um dos três conceitos de `developer-tools-java`; `Process`, `ProcessHandle`, PID, stdin, stdout, stderr, exit code, lifecycle, timeout, encerramento, redirecionamento, shell expansion, quoting, portabilidade e command injection não formam uma sequência ensinável completa.
- Não existe o projeto Zenith/interface determinística de linguagem natural com evolução por pré-requisitos.
- Lanterna está concentrado em quatro parágrafos conceituais, um exercício e um projeto. Não ensina progressivamente instalação, imports, inicialização, terminal, screen, lifecycle, input, componentes, layouts, janelas, redraw e encerramento antes de cobrar a aplicação.
- `functional-semantics-lab` comprime Optional, Set, lambdas e Streams em quatro parágrafos; não satisfaz as APIs e decisões obrigatórias da especificação.
- HTTP, JDBC, concorrência, redes e mensageria possuem bons fragmentos, mas a presença desses fragmentos ainda precisa ser confrontada item a item com o contrato mestre.

### 9. Conteúdo legado e estruturado se sobrepõem

Os 21 capítulos foram adicionados para compensar lacunas, mas vários dependem de capítulos que já apresentam o mesmo assunto superficialmente. Isso cria repetição sem uma política clara de “primeiro contato → aprofundamento”. Exemplos: HTTP, JDBC, programação funcional, mensageria e consistência.

A próxima fase precisa decidir, para cada assunto, qual capítulo introduz, qual aprofunda e qual pratica. Não se deve simplesmente acrescentar um terceiro capítulo.

### 10. Recursos válidos que devem ser preservados

- IDs estáveis e migrações de progresso;
- 128 fontes legadas separadas e validação de fidelidade;
- navegação React e PWA offline;
- IndexedDB e backup versionado;
- notas, revisão, domínio, diagnóstico, Java Lab e acessibilidade;
- testes unitários, Playwright e CI;
- identidade visual e responsividade.

Há uma ressalva funcional a auditar: o editor atual implementa manualmente apenas um subconjunto de Markdown. Isso não deve ser alterado durante a reconstrução pedagógica, mas precisa de teste de paridade com o comportamento prometido antes da auditoria final.

## Limites dos validadores atuais

| Validador | O que prova | O que não prova |
|---|---|---|
| `validate-content-fidelity` | HTML preservado byte/textualmente | qualidade ou progressão |
| `validate-pedagogy` | grafo de módulos e mapeamento | ordem real entre capítulos e conceitos usados |
| `validate-platform` | contagens, marcadores e build | profundidade, distratores e projetos ensináveis |
| `validate-links` | URL alcançável | relevância e especificidade |
| `validate-english` | formato e alguns padrões | atividade contextual não repetitiva |
| Vitest/Playwright | comportamento da plataforma | qualidade do currículo |

Todos permanecem úteis; nenhum pode ser usado isoladamente como aprovação pedagógica.

## Fases de reconstrução aprovadas após a descoberta

Cada fase altera somente fontes autorais, regenera derivados e termina com geração, fidelidade, typecheck, lint, testes, build, validadores, inspeção humana e verificação do grafo.

1. **Infraestrutura pedagógica:** alinhar schema/documentação/renderizador; criar Concept, usos, resultados, erros, comparações, explicações de código, matrizes de projeto e estados de auditoria; impedir metadados fictícios.
2. **Orientação e fundamentos:** capítulos 1–12 da ordem efetiva.
3. **POO:** capítulos 13–24, incluindo associação antes de persistência.
4. **Java Core:** capítulos 25–33, separando igualdade, Collections, Set, Optional, lambdas, funções, Streams, Date/Time e Java moderno quando necessário.
5. **I/O, CLI e Process API:** capítulos 34–37 mais novos capítulos Process API e Zenith incremental.
6. **Algoritmos e engenharia:** algoritmos, Git, build, debugging, logging e testes iniciais; corrigir a posição de Mockito/DI.
7. **HTTP e integração Java:** protocolo, curl, HttpClient, JSON e falhas antes de clientes Spring.
8. **Dados relacionais:** SQL, PostgreSQL, migrations e JDBC completo antes de ORM.
9. **Design antes do framework:** SOLID, DI manual e padrões sem dependência futura de Spring/Kafka/deploy.
10. **Spring:** Core, Boot, MVC, JPA e primeira API com fundamentos anteriores comprovados.
11. **Segurança e qualidade:** autenticação, autorização, contratos e testes.
12. **Containers e integração:** Docker, Compose e Testcontainers.
13. **Concorrência, redes e TUI:** processo/thread, memória, executors, futures, virtual threads, TCP/UDP, WebSockets e Lanterna progressivo.
14. **Produção:** secrets, CI/CD, deploy e observabilidade básica em ordem válida.
15. **Integração síncrona e resiliência:** experimentar coupling/falha antes de retry/circuit breaker.
16. **Mensageria e EDA:** event bus, queue/pub-sub, broker, SNS/SQS e Kafka.
17. **Sistemas distribuídos:** falha parcial, consistência, CAP, Outbox/Inbox e Saga.
18. **Projetos profissionais:** reconstruir matrizes, remover dependências futuras e graduar autonomia.
19. **Auditoria final integral:** segunda leitura dos 149+ capítulos e matriz final sem lacunas conhecidas.

## Checklist operacional

- [x] Repositório e toolchain inventariados.
- [x] Fontes autorais e artefatos gerados separados.
- [x] 149 capítulos e 20 módulos inventariados.
- [x] Grafo declarado de módulos e capítulos materializado.
- [x] Referências futuras detectadas.
- [x] Schema, renderizadores, persistência, PWA, testes e validadores localizados.
- [x] Recursos e repetição de URLs quantificados.
- [x] Projetos e ausência das matrizes de conhecimento identificados.
- [x] Process API e Zenith classificados como lacunas.
- [x] Fases de reconstrução definidas somente após a descoberta.
- [ ] Schema e validadores pedagógicos corrigidos — Fase 1.
- [ ] Auditoria humana capítulo por capítulo — Fases 2–19.
- [ ] Recursos auditados por relevância — por fase.
- [ ] Matriz final aprovada — Fase 19.

## Comando de reprodução

```bash
npm run audit:master
```

O comando regenera os três artefatos. Uma execução bem-sucedida não significa que o curso passou; ela apenas garante que a lista de reprovações e pendências está atualizada.
