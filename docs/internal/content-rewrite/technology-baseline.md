# Baseline tecnológica do java4br

Este documento formaliza a baseline já declarada em `platform/public/content/chapters/intro.html`
(bloco "Baseline verificável do curso") e a estende com regras explícitas para a
reconstrução editorial. Ele é a referência única para "qual versão o curso ensina" —
qualquer capítulo que divergir dele precisa ser corrigido ou ter a divergência
marcada explicitamente como nota versionada.

## Versão principal ensinada (baseline executável)

| Tecnologia | Versão principal | Observação |
|---|---|---|
| Java | JDK 21 LTS | Todo exemplo declarado "runnable" deve compilar e rodar em Java 21. |
| Spring Boot | 3.5.x | |
| Spring Framework | 6.2.x | |
| PostgreSQL | 16 | |
| Redis | 7 | Onde usado (cache/rate limiting). |
| Kafka, Springdoc, Testcontainers | versão administrada pelo BOM do projeto executável | Fixar por tag + digest nas imagens Docker. |

## Versão mínima suportada

Java 21 é o piso: nenhum capítulo pode exigir uma feature de Java 25 (ou de
qualquer versão posterior) para que um projeto declarado "Java 21" compile.

## Onde versões posteriores podem aparecer

Java 25 e Spring Framework 7 podem aparecer **somente** como nota versionada
explícita ("a partir da versão X, isto muda para Y"), nunca como pré-requisito
para entender ou rodar o conteúdo principal. Dois exemplos já corretos no corpus
(auditados nesta reconstrução):

- `intro.html`: "notas indicam diferenças relevantes do Framework 7, como a
  preferência por `RestClient`" — nota, não baseline.
- `webclient.html`: explica que `RestTemplate` só entra em depreciação **no**
  Spring Framework 7, mantendo a baseline (Framework 6) como o que os exemplos
  principais seguem.

Busca por "Java 25" em todo o corpus de capítulos não encontrou nenhuma
ocorrência — o risco descrito no briefing original (conteúdo Java 25 misturado
sem aviso) **não se confirmou** nesta auditoria. Deve ser reconfirmado a cada
fase futura, já que novos capítulos podem introduzir o problema.

## Regra de não-mistura silenciosa

Nenhum capítulo pode assumir uma versão diferente da tabela acima sem:

1. declarar explicitamente qual versão está usando naquele trecho;
2. explicar a diferença relevante para a baseline;
3. deixar claro que a baseline continua sendo a executável.

## Aplicação em `EditorialReview`

Todo capítulo com `editorialReview.primarySources` referenciando Javadoc,
Spring Reference ou qualquer documentação oficial deve citar a versão exata
consultada (ex.: "Spring Framework Reference 6.2", não apenas "Spring Docs").
Isso evita que uma fonte correta hoje se torne uma citação ambígua quando a
documentação oficial mudar de versão.
