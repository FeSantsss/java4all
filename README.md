# java4br

Plataforma offline-first para aprender Java, backend e fundamentos de computação por uma trilha progressiva. Inglês técnico aparece gradualmente em código, mensagens de erro, documentação, pesquisas, issues e projetos, sempre dentro do contexto técnico.

**[Abrir o java4br](https://fesantsss.github.io/java4all/)**

O endereço mantém o nome histórico do repositório enquanto o produto, o PWA e os dados usam a identidade java4br.

## O curso

- 149 capítulos distribuídos em 20 módulos ordenados por pré-requisitos.
- 128 capítulos anteriores preservados por um gerador reproduzível, sem trocar seus IDs.
- 21 capítulos estruturados para associações em POO, JDBC, HTTP/API, Java além do CRUD, Lanterna, SNS/SQS, EDA, consistência e testes assíncronos.
- 155 exercícios, 493 quizzes interativos e projetos progressivamente menos guiados.
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

Esse comando regenera o modelo React a partir dos 128 arquivos HTML independentes, prova a fidelidade integral do conteúdo, executa typecheck, lint, testes, build/PWA e os validadores do grafo pedagógico.

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
