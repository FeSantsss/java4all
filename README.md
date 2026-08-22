# java4br

Plataforma offline-first para aprender Java, backend e fundamentos de computação por uma trilha progressiva. Inglês técnico aparece gradualmente em código, mensagens de erro, documentação, pesquisas, issues e projetos, sempre dentro do contexto técnico.

**[Abrir o java4br](https://fesantsss.github.io/java4all/)**

O endereço mantém o nome histórico do repositório enquanto o produto, o PWA e os dados usam a identidade java4br.

## O curso

- 151 capítulos distribuídos em 20 módulos ordenados por pré-requisitos.
- 23 capítulos estruturados para associações em POO, JDBC, HTTP/API, Java além do CRUD, Lanterna, SNS/SQS, EDA, consistência e testes assíncronos.
- 160 exercícios, 268 verificações interativas atualmente inventariadas e projetos progressivamente menos guiados. A auditoria diferencia existência, compatibilidade e aprovação pedagógica.
- Os 151 capítulos estão reconstruídos e aprovados no novo contrato pedagógico: Fundamentos, POO, Java Core, I/O/CLI/Process API, Algoritmos, Estruturas de Dados Avançadas, projetos intermediários, HTTP/integração, SQL/JDBC, Design de Aplicação, Spring/API, Segurança/Qualidade de APIs, Containers/Testes/Dados avançados, Concorrência/Redes/TUI, Produção/CI/CD, Integração Síncrona, Resiliência/Observabilidade, Mensageria, SNS/SQS, Kafka, EDA, Consistência Distribuída, Outbox/Inbox, Saga e fechamento profissional.
- Documentação e recursos complementares associados a todos os capítulos.
- Atividade contextual de inglês técnico em quatro níveis de autonomia.

A sequência começa por problema e modelo mental, chega à API apenas quando a necessidade existe e cobra previsão, implementação, validação, diagnóstico, refatoração e justificativa. Spring é parte importante da trilha, mas HTTP, integração, CLI, TUI, redes, concorrência e mensageria também são praticados fora do framework.

## Plataforma

A aplicação usa React 19, TypeScript estrito, Tailwind CSS 4 e Vite. Conteúdo, apresentação e progresso ficam separados em `platform/src/content`, `platform/src/components` e `platform/src/progress`.

O progresso versionado inclui conclusões, favoritos, notas, evidências em inglês, rascunhos Java, quizzes, revisão, domínio, erros, recuperação ativa, diagnósticos, prontidão de projetos, atividade e preferências. A versão 11 migra os formatos anteriores e oferece backup JSON completo com validação antes da restauração.

O build gera um PWA com cache dos artefatos versionados. O GitHub Pages é publicado pelo workflow em `.github/workflows/deploy-pages.yml`.

## Desenvolvimento

Requer Node.js 22.22.2 ou superior.

```bash
npm ci
npm run dev
```

Validação completa:

```bash
npm run validate
```

Esse comando regenera o modelo React a partir dos 128 arquivos HTML independentes, prova a fidelidade integral do conteúdo, executa a auditoria de profundidade, typecheck, lint, testes, build/PWA e os validadores do grafo. O gate impede aprovações pedagógicas falsas; revisão humana continua obrigatória.

Prontidão de deploy:

```bash
npm run validate:deployment
```

Esse gate confere se o workflow do GitHub Pages, Vite, `dist/`, manifesto PWA e service worker continuam coerentes para publicação offline-first.

Guardrails de manutenção:

```bash
npm run validate:maintenance
```

Esse gate impede deriva estrutural: fontes autorais de fase precisam estar conectadas ao gerador e à documentação, capítulos canônicos precisam continuar casados com o catálogo, monólitos legados não podem reaparecer na raiz e `generated-course.json` e `course-content.json` são artefatos gerados, não fonte autoral.

Contrato de progresso:

```bash
npm run validate:progress
```

Esse gate protege schema v11, IndexedDB `java4br-course`, fallback local, migração legada, exportação/importação de backup e confirmação antes de substituição dos dados.

Contrato de UI e acessibilidade:

```bash
npm run validate:ui
```

Esse gate protege skip link, foco visível, temas Sistema/Branco/Alto contraste, redução de movimento, modal da Central, anotações Markdown, cobertura axe e cenários responsivos.

Contrato das ferramentas de estudo:

```bash
npm run validate:learning-tools
```

Esse gate protege a busca explícita por título, revisão por múltipla escolha com seleção/deferimento diário, glossário contextual, diagnóstico, caderno de erros, prontidão de projetos e Java Lab.

Integridade do catálogo e offline:

```bash
npm run validate:catalog
```

Esse gate protege a consistência entre `generated-course.json`, `course-content.json`, `catalog.json`, glossário público, inventário de hashes dos HTMLs legados, arquivos copiados para `dist/` e precache do service worker. Ele impede capítulo fantasma, título divergente, HTML sem cache offline e artefato público fora de sincronia com a fonte gerada.

Integridade das avaliações:

```bash
npm run validate:assessment
```

Esse gate protege quizzes, exercícios e projetos contra regressão pedagógica: cada quiz precisa de enunciado, alternativas únicas, exatamente uma resposta correta e racional por alternativa; exercícios precisam de critérios de aceite; projetos precisam de requisitos, critérios e matriz de conhecimento com evidência esperada.

Integridade dos recursos:

```bash
npm run validate:resources
```

Esse gate protege os recursos externos para estudo: exige HTTPS, idioma, publisher, nível esperado, data de verificação, aprovação de relevância, propósito pedagógico em `reinforces`, prioridade a fontes oficiais/normativas e bloqueio contra links genéricos ou repetidos em massa.

Contrato de inglês técnico contextual:

```bash
npm run validate:technical-english
```

Esse gate protege as 128 atividades contextuais de inglês técnico geradas para os capítulos legados: mantém quatro níveis de autonomia, progressão por módulo, pistas de código, leitura sem tradução solta, produção de evidência em inglês, persistência em backup e integração com a Central/atalhos do curso.

Contrato de rastreabilidade viva:

```bash
npm run validate:traceability
```

Esse gate protege a coerência entre README, progresso interno, matriz de requisitos, relatórios de auditoria e scripts de validação. Ele impede fase documentada sem relatório, relatório sem menção pública, gate fora do `npm run validate` ou evidência crítica que não esteja rastreada.

Contrato de fechamento da especificação mestre:

```bash
npm run validate:master-spec
```

Esse gate cruza a especificação mestre inteira com conteúdo, schema, matriz de capítulos, grafo de dependências, E2E e gates especializados. Ele protege que Java fundamental, Process API, Zenith, HTTP antes de Spring, JDBC, testes, Lanterna/TUI, redes, mensageria, EDA, sistemas distribuídos, recursos, inglês técnico, projetos e auditoria final continuem cobertos sem backlog conhecido.

Auditoria mestre reproduzível:

```bash
npm run audit:master
```

Os relatórios ficam em `docs/internal/master-audit/` e mantêm explícitos os estados históricos de cada fase e o estado final aprovado da trilha.

As reconstruções concluídas estão documentadas em `docs/internal/master-audit/phase-0-discovery.md`, `docs/internal/master-audit/phase-1-infrastructure.md`, `docs/internal/master-audit/phase-2-foundations.md`, `docs/internal/master-audit/phase-3-oop.md`, `docs/internal/master-audit/phase-4-java-core.md`, `docs/internal/master-audit/phase-5-io-cli-process.md`, `docs/internal/master-audit/phase-6-algorithms-engineering.md`, `docs/internal/master-audit/phase-7-http-integration.md`, `docs/internal/master-audit/phase-8-relational-data-jdbc.md`, `docs/internal/master-audit/phase-9-application-design.md`, `docs/internal/master-audit/phase-10-spring-api.md`, `docs/internal/master-audit/phase-11-api-security-quality.md`, `docs/internal/master-audit/phase-12-containers-integration-data.md`, `docs/internal/master-audit/phase-13-concurrency-network-tui.md`, `docs/internal/master-audit/phase-14-production-delivery.md`, `docs/internal/master-audit/phase-15-sync-resilience.md`, `docs/internal/master-audit/phase-16-messaging-eda.md`, `docs/internal/master-audit/phase-17-distributed-consistency.md`, `docs/internal/master-audit/phase-18-intermediate-projects.md`, `docs/internal/master-audit/phase-19-professional-final.md`, `docs/internal/master-audit/phase-20-final-release-hardening.md`, `docs/internal/master-audit/phase-21-deployment-readiness.md`, `docs/internal/master-audit/phase-22-maintenance-guardrails.md`, `docs/internal/master-audit/phase-23-progress-contract.md`, `docs/internal/master-audit/phase-24-ui-accessibility-contract.md`, `docs/internal/master-audit/phase-25-learning-tools-contract.md`, `docs/internal/master-audit/phase-26-catalog-integrity.md`, `docs/internal/master-audit/phase-27-assessment-integrity.md`, `docs/internal/master-audit/phase-28-resource-integrity.md`, `docs/internal/master-audit/phase-29-technical-english-contract.md`, `docs/internal/master-audit/phase-30-traceability-contract.md` e `docs/internal/master-audit/phase-31-master-spec-closure.md`. O grafo auditável possui 384 conceitos e os projetos aprovados incluem matrizes explícitas de conhecimento e evidência quando aparecem como blocos de projeto.

Auditoria online dos recursos externos:

```bash
npm run validate:links
```

## Estrutura

```text
platform/
  public/content/  catálogo, glossário e um HTML completo por capítulo legado
  public/          manifesto e ícone do PWA
  src/
    app/           composição da aplicação
    components/    curso e sistemas de estudo
    content/       schema, curso gerado e capítulos estruturados
    progress/      estado v11, migração, persistência e backup
scripts/           geração do modelo, fidelidade de conteúdo, links e service worker
docs/internal/     arquitetura pedagógica, modelo e auditorias
```

Cada capítulo legado possui um arquivo próprio em `platform/public/content/chapters`. O inventário registra hashes individuais e agregados da extração original; `npm run validate:fidelity` compara cada bloco com o modelo React para impedir resumos ou perdas silenciosas. Conteúdo novo deve entrar no modelo tipado ou em seu HTML de capítulo, nunca em um monólito.
