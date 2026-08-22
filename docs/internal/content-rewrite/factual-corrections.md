# Correções factuais aplicadas (reconstrução editorial — agosto de 2026)

Cada entrada: o que o capítulo dizia, por que estava impreciso, o que foi
corrigido, e a base para a correção.

## 1. Spring Core — criação e injeção de beans (`spring-core.html`)

**Antes:** "primeiro o Spring escaneia e cria **todos** os beans, depois injeta
as dependências entre eles."

**Problema:** não existe um momento único em que "todos os beans já existem"
antes da injeção começar. Registro de metadata (`BeanDefinition`) e criação são
etapas distintas, mas criação e injeção acontecem entrelaçadas, bean a bean,
seguindo o grafo de dependências — criar um bean pode disparar em cascata a
criação de dependências ainda não resolvidas.

**Depois:** nova seção "Como o container realmente resolve e cria beans"
explica registro de metadata vs. criação recursiva sob demanda, e conecta isso
à causa real de `BeanCurrentlyInCreationException` em dependência circular via
construtor.

**Fonte:** Spring Framework Reference (IoC Container — Bean Overview / Instantiating Beans).

## 2. Lombok — mecanismo de geração de código (`lombok.html`)

**Antes:** "ele literalmente reescreve o `.class` gerado" via "uma API do
compilador Java chamada Annotation Processing".

**Problema:** a API pública de annotation processing (`javax.annotation.processing`)
só permite **gerar novos arquivos-fonte**, não alterar a AST de uma classe já
existente. Descrever o Lombok como usando esse contrato público é impreciso.

**Depois:** explica que o Lombok se registra como annotation processor (é
assim que `javac` o carrega), mas usa APIs internas e não documentadas do
compilador (`com.sun.source`/AST interna do `javac`) para modificar a árvore
sintática antes da geração de bytecode — não "reescreve o `.class`" depois de
pronto, muda o que o compilador vai transformar em `.class`.

**Fonte:** Project Lombok — documentação oficial ("How it works"); especificação
de Annotation Processing (JSR 269) para o contrato público de contraste.

## 3. Spring Boot DevTools — `scope=runtime` + `optional=true` (`devtools.html`)

**Antes:** "eles garantem que o DevTools nunca seja empacotado no `.jar` final
de produção".

**Problema:** `scope=runtime` só controla o classpath de *compilação*, não
impede que o artefato final contenha a dependência. Quem de fato exclui o
DevTools do jar repackaged é o plugin de empacotamento do Spring Boot
(`spring-boot-maven-plugin`/plugin Gradle equivalente), não o scope.

**Depois:** separa as três responsabilidades: `scope=runtime` (fora do
classpath de compilação do seu código), `optional=true` (evita propagação
transitiva para quem depende do seu projeto como biblioteca), e o plugin do
Spring Boot (exclusão real do jar final).

**Fonte:** Spring Boot Reference — Developer Tools; documentação do
`spring-boot-maven-plugin` (repackage goal).

## 4. Spring Kafka — profundidade, serialização e concorrência (`spring-kafka.html`)

**Antes:** ~65 linhas; JSON publicado por concatenação manual de `String`
(`"{\"id\":\"" + pedidoId + "\"}"`); `@KafkaListener` descrito como criando
"uma thread dedicada".

**Problema:** concatenação manual de JSON quebra silenciosamente com aspas,
acentos ou `null`; "uma thread dedicada" omite que `concurrency` controla
quantas threads o listener container sobe (nunca mais que o número de
partições atribuíveis), o que é essencial para entender ordenação e paralelismo.

**Depois:** capítulo reescrito (~3h de estudo) cobrindo `JsonSerializer`/DTO de
evento, `CompletableFuture` do `send()`, `ConcurrentMessageListenerContainer` e
`concurrency`, modos de ack (`BATCH`/`record`) e a garantia real (at-least-once,
não exactly-once fora de transações Kafka-para-Kafka), `DefaultErrorHandler` +
`DeadLetterPublishingRecoverer` para retry/DLT, e diferenciação entre falha
transitória (retry ajuda) e mensagem envenenada (retry não ajuda).

**Fonte:** Spring for Apache Kafka Reference (KafkaTemplate, `@KafkaListener`,
Error Handling, Dead Letter Topics).

## 5. SQL — limites das analogias com Java/Stream (`sql.html`)

**Antes:** "tabela é uma classe, linha é um objeto" e "`INNER JOIN` é
`Set.retainAll`" apresentados como equivalências diretas, com hedging mínimo.
Comparação de `WHERE`/`ORDER BY`/`SELECT` com pipeline de Stream sem
diferenciar execução declarativa de imperativa.

**Problema:** SQL `NULL` participa de lógica de três valores (não existe
equivalente direto em Java); linhas não têm identidade de objeto; `JOIN`
multiplica linhas por cardinalidade (`Set.retainAll` nunca duplica elementos);
SQL é declarativo (o otimizador decide o plano), Stream é imperativo (a ordem
das chamadas é a ordem de execução).

**Depois:** cada analogia agora vem seguida de um bloco explícito de limite
("onde essa analogia para de valer"), preservando a analogia como ponte de
intuição inicial, não como modelo mental definitivo — consistente com a regra
geral de "analogyLimit" já usada em outros capítulos do curso.

**Fonte:** ISO/IEC 9075 (SQL) para semântica de `NULL`/three-valued logic;
documentação PostgreSQL para comportamento de `JOIN`.

---

Ver também `docs/internal/content-rewrite/chapter-content-matrix.csv` para o
capítulo novo (`terminal-shell-fundamentos`) e o estado de rastreabilidade
editorial de todos os 152 capítulos.
