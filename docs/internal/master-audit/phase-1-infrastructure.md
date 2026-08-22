# Auditoria Mestre — Fase 1: infraestrutura pedagógica

Data: 2026-08-21

Status: concluída.

## Objetivo

Fazer o modelo, o gerador, o renderizador e os validadores representarem o contrato pedagógico real antes de reescrever qualquer módulo.

## Resultado

A plataforma agora distingue três coisas que antes eram misturadas:

1. conteúdo autoral;
2. conteúdo legado preservado;
3. conteúdo gerado apenas para compatibilidade durante a migração.

Nenhum bloco gerado para compatibilidade pode sustentar aprovação pedagógica. Os 149 capítulos permanecem disponíveis, porém carregam `pending` ou `needs-revision`; nenhum foi aprovado automaticamente.

## Contratos implementados

- `PedagogicalAudit` com `pending`, `in-review`, `needs-revision` e `approved`;
- proveniência por bloco: `authored`, `legacy-preserved` ou `generated-compatibility`;
- `Concept` com introdução, reforços, pré-requisitos, confusões e resultados;
- `introducedConceptIds` e `usedConceptIds` separados dos candidatos legados;
- blocos `mental-model`, `comparison`, `error-case`, `diagram` e `table`;
- explicação progressiva e erros comuns em blocos de código;
- racional específico por alternativa de quiz exibido na interface;
- matriz de projeto `requisito -> conceitos -> capítulos -> evidência`;
- metadados de recurso para publisher, oficialidade, nível, verificação e auditoria;
- arquivo autoral `platform/content/pedagogy-overrides.json` para enriquecer capítulos legados sem editar artefatos gerados.

## Gate de aprovação

`npm run validate:depth` regenera o inventário antes de validar. Um capítulo declarado `approved` falha o gate se possuir qualquer uma destas condições:

- lacuna automática conhecida;
- pré-requisito inexistente ou futuro;
- recurso ainda não auditado por relevância;
- projeto sem matriz de conhecimentos.

O gate aceita capítulos pendentes durante a reconstrução. Isso permite trabalhar módulo por módulo sem chamar backlog de aprovação e sem derrubar a publicação tecnicamente estável.

## Renderização e acessibilidade

Os novos blocos possuem HTML semântico:

- fluxos e ciclos usam listas ordenadas;
- ownership usa lista explícita;
- comparações e matrizes usam tabelas com `scope`;
- falhas usam pares `dt/dd` e passos de diagnóstico;
- diagramas textuais possuem nome acessível;
- tabelas permanecem roláveis em telas estreitas;
- feedback de quiz usa o racional da alternativa selecionada.

Testes de componente cobrem todos os novos tipos, explicações de código, racional de quiz e matriz de projeto.

## Backlog preservado, não escondido

- 149 capítulos reprovados na triagem;
- 0 aprovados;
- 12 dependências futuras;
- conceitos utilizados/introduzidos ainda precisam ser declarados durante as fases curriculares;
- recursos genéricos continuam publicados até serem substituídos e auditados por módulo;
- projetos atuais continuam sem matriz até sua fase de reconstrução;
- quizzes gerados continuam funcionando, mas estão marcados como compatibilidade.

## Fontes alteráveis daqui em diante

- Corpo legado: `platform/public/content/chapters/<id>.html`.
- Metadados auditados do legado: `platform/content/pedagogy-overrides.json`.
- Capítulos estruturados: `platform/src/content/required-chapters.ts` até sua futura separação por arquivo.
- Schema: `platform/src/content/schema.ts`.
- Transformação: `scripts/generate-course-content.mjs`.

`generated-course.json`, `course-content.json` e `dist/` são derivados.

## Critério de encerramento

- [x] Schema alinhado ao contrato.
- [x] Renderizador implementa todos os novos blocos.
- [x] Proveniência e status de auditoria persistem no conteúdo final.
- [x] Override autoral separado do artefato gerado.
- [x] Gate impede aprovação falsa.
- [x] Auditoria continua cobrindo 149 capítulos.
- [x] Testes dos componentes semânticos passam.
- [x] Barreira técnica completa passa.
- [x] Capítulos de fundamentos revisados — Fase 2 (`phase-2-foundations.md`).
