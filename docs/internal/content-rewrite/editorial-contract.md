# Contrato editorial — EditorialReview

## O problema que este contrato resolve

`Chapter.audit.status === 'approved'` é um campo **autodeclarado** pelo autor
do capítulo (`platform/src/content/schema.ts`, `PedagogicalAudit`). A auditoria
automática (`scripts/audit-master-course.mjs`) só invalida essa declaração se
encontrar **flags estruturais** (falta bloco de quiz, pré-requisito futuro,
recurso genérico, etc.) — ela nunca compara o corpo do texto ao que o título e
o tempo estimado prometem ensinar. Isso cria risco real de autoaprovação
circular: um capítulo raso pode se declarar `approved`, passar por zero flags
estruturais e ser tratado pelo resto do pipeline como "revisado em profundidade".

## A camada independente: `EditorialReview`

Definida em `platform/src/content/schema.ts`, anexada opcionalmente a
`Chapter.editorialReview`:

```ts
interface EditorialReview {
  requiredTopics: string[];
  evidenceBlocks: Record<string, string[]>; // topic -> ContentBlock.id[]
  primarySources: string[];
  factualReviewedAt?: string;
  pedagogicalReviewedAt?: string;
  openIssues: string[];
}
```

Regras:

1. `requiredTopics` lista os subtemas que o capítulo se compromete a ensinar
   (não apenas mencionar de passagem).
2. `evidenceBlocks[topic]` aponta para IDs de `ContentBlock` reais que ensinam
   aquele tópico. Um tópico sem bloco associado é um "tópico fantasma" —
   prometido no título/objetivos mas nunca ensinado de fato.
3. `openIssues` — pendências conhecidas. Só um array vazio conta como "sem
   pendências"; uma pendência anotada aqui é mais honesta que um capítulo
   declarado perfeito com um problema escondido.
4. `primarySources` — fontes primárias (JLS/JVMS/Javadoc, Spring Reference,
   RFCs etc.) efetivamente consultadas para validar as afirmações técnicas.

## O que isso NÃO é

`EditorialReview` dá **rastreabilidade estrutural**, não **qualidade
editorial**. Um gate automático pode confirmar que:

- todo `requiredTopics` tem pelo menos um `evidenceBlocks` real;
- os blocos referenciados existem de fato no capítulo gerado;
- `openIssues` está vazio.

Ele **não pode** confirmar que a explicação está tecnicamente correta,
pedagogicamente bem progressiva, ou suficientemente profunda. Isso continua
exigindo leitura humana. Nenhum relatório desta reconstrução deve tratar
"`EditorialReview` presente" como sinônimo de "capítulo revisado com qualidade".

## `depthReviewed`

Em `scripts/audit-master-course.mjs`, `depthReviewed` deixou de espelhar
`audit.status === 'approved'`. Agora exige adicionalmente
`hasTraceableEditorialReview` (todo `requiredTopics` com evidência real e sem
`openIssues`). Isso é **aditivo**: não reabre retroativamente o status/flags
dos capítulos já aprovados sob o contrato anterior (evitando quebrar o release
gate de uma vez só para todo o corpus), mas marca de forma visível e honesta
quais capítulos já passaram por essa camada e quais ainda não.

O gate `npm run validate:content` (ver mais abaixo) é quem de fato bloqueia
regressão nessa camada daqui para frente.

## Exemplo de referência

`terminal-shell-fundamentos` (capítulo novo desta reconstrução) é o primeiro
capítulo com `EditorialReview` completo — ver
`platform/content/foundations-phase-2.json`, chave `terminal-shell-fundamentos`.
Use-o como modelo ao autorar `EditorialReview` para os próximos capítulos.

## Gate: `npm run validate:content`

Implementado em `scripts/validate-content-review.mjs`. Verifica:

- todo capítulo com `audit.status === 'approved'` que também declara
  `editorialReview` tem rastreabilidade íntegra (tópicos com evidência real,
  blocos existentes, sem `openIssues`);
- nenhum capítulo usa um tópico "fantasma" (declarado mas sem bloco);
- o relatório não afirma sozinho que o texto é bom — ele só impede regressão
  estrutural depois que um capítulo já passou pela revisão editorial humana.

Ver `docs/internal/content-rewrite/chapter-content-matrix.csv` para o estado
atual de cada capítulo nesta camada.
