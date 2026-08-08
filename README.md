# Java, Spring & Produção: do zero ao sistema completo

Esta documentação detalha a metodologia de ensino, a arquitetura pedagógica e a estrutura programática completa do curso, projetada para guiar o estudante desde a lógica de programação e fundamentos do Java até tópicos avançados de engenharia de software, arquiteturas distribuídas e ecossistema Spring Boot em nível sênior.

!! Cada capítulo traz pré-requisitos completos, dificuldade, tempo estimado de estudo, analogias, segredos e exercícios com solução.

---

### 📚 Módulos Didáticos

---

### 🟢 Módulo 1: Fundamentos da Linguagem

> **Foco:** Configuração do ambiente, sintaxe essencial e primeiros passos na linguagem Java.

- `00` **Introdução & ambiente:** Instalação do JDK, configuração de variáveis de ambiente (`JAVA_HOME`) e estrutura de um projeto Java.
- `01` **Classes e objetos:** Conceito de blueprints, instanciação com `new` e alocação de memória.
- `02` **Atributos e métodos:** Declaração de variáveis de estado, assinaturas de métodos e retorno de valores.
- `03` **Construtores:** Inicialização de objetos, sobrecarga de construtores e uso de blocos de inicialização.
- `04` **Encapsulamento:** Modificadores de acesso (`public`, `private`, `protected`), getters/setters e proteção de estado.

---

### 🟡 Módulo 2: Os Pilares da Orientação a Objetos

> **Foco:** Domínio dos conceitos fundamentais de modelagem de software em Java.

- `05` **Herança:** Reutilização de código com `extends`, sobrescrita de métodos (`@Override`) e a classe base `Object`.
- `06` **Polimorfismo:** Acoplamento fraco, amarração dinâmica (_dynamic binding_) e coerção de tipos.
- `07` **Classes abstratas:** Contratos parciais, métodos abstratos e diferenças operacionais para herança concreta.
- `08` **Interfaces:** Contratos 100% abstratos, métodos `default`, campos `static` e herança múltipla de interfaces.
- `09` **static, final & this:** Contexto de classe vs instância, constantes, imutabilidade e referência própria.
- `10` **Exceções:** Tratamento de erros, pilha de chamadas (_stack trace_), exceções checadas (_checked_) vs não-checadas (_unchecked_) e bloco `try-catch-finally`.

---

### 🔵 Módulo 3: Java Aplicado & Prático

> **Foco:** Estruturas de dados, concorrência e testes essenciais do dia a dia.

- `11` **Coleções & ArrayList:** Manipulação de dados dinâmicos com a _Collections Framework_ (`List`, `Set`, `Map`).
- `12` **Generics:** Parametrização de tipos, _wildcards_ (`? extends T`, `? super T`) e _type erasure_.
- `13` **Lambdas & Streams:** Programação funcional, interfaces funcionais (`Function`, `Predicate`, `Consumer`) e operações de pipeline.
- `14` **Threads & concorrência:** Execução paralela, ciclo de vida de Threads, `ExecutorService`, concorrência e prevenção de _race conditions_.
- `15` **Testes unitários:** Automação de testes de unidade utilizando **JUnit 5**, estrutura AAA (Arrange, Act, Assert) e suíte de asserções.

---

### 🟣 Módulo 4: Fechamento POO

> **Foco:** Consolidação dos princípios de código limpo e arquitetura de objetos.

- `16` **SOLID & boas práticas:** Os 5 princípios da arquitetura orientada a objetos aplicados para redução de acoplamento.
- `17` **Projeto final POO:** Construção de um sistema Java Vanilla consolidando todos os conceitos do bloco básico/intermediário.

---

### 🔴 Módulo 5: Rumo ao Spring & Engenharia de Software

> **Foco:** A transição entre o Java puro e a arquitetura corporativa moderna.

- `18` **Pacotes & projeto:** Organização modular do código e convenções de nomenclatura.
- `19` **Maven & Gradle:** Gerenciamento de dependências, arquivo `pom.xml`/`build.gradle` e ciclo de vida de _build_.
- `20` **Anotações & Reflection:** Metadados em tempo de execução, inspecionando classes via API de _Reflection_.
- `21` **Java moderno:** Recursos das versões recentes (Records, Pattern Matching, Sealed Classes, Text Blocks, Var).
- `22` **Injeção de dependência:** Conceituação manual do padrão IoC/DI antes do Spring.
- `23` **Padrões de projeto:** Estudo prático de _Design Patterns_ do GoF (Factory, Builder, Singleton, Strategy, Observer).
- `24` **JDBC & banco de dados:** Conexão direta via drivers, execução de queries, `PreparedStatement` e manipulação de `ResultSet`.
- `25` **JSON & serialização:** Conversão de objetos Java em JSON e vice-versa usando Jackson/Gson.
- `26` **HTTP & APIs REST:** Verbos HTTP (GET, POST, PUT, DELETE), cabeçalhos, status codes e arquitetura RESTful.
- `27` **Logging & configuração:** Utilização de SLF4J/Logback, níveis de log e leitura de arquivos de propriedades (`.properties`/`.yml`).
- `28` **Projeto final pré-Spring:** Aplicação Java web nativa integrando banco de dados, JSON e padrão MVC sem frameworks.

---

### 🟠 Módulo 6: Ferramentas & Versionamento

> **Foco:** Controle de versão corporativo e fluxo de trabalho em equipe.

- `29` **Git & fluxo de trabalho:** Comandos essenciais, resolução de conflitos, estratégias de _branching_ (Gitflow, Trunk-Based) e uso do GitHub.

---

### 🐳 Módulo 7: Containers & Virtualização

> **Foco:** Padronização e isolamento de ambientes de desenvolvimento e produção.

- `30` **Docker — conceitos:** Diferença entre MVs e Containers, imagens, registros, volumes e redes.
- `31` **Dockerfile & multi-stage:** Criação de imagens customizadas, otimização de tamanho e builds em múltiplas etapas.
- `32` **Docker Compose:** Orquestração local de múltiplos containers (App + Banco + Cache) em um único arquivo.

---

### 🐬 Módulo 8: Banco de Dados Relacional

> **Foco:** Modelagem, persistência e manipulação SQL robusta.

- `33` **SQL fundamentos:** DDL, DML, DQL, Joins, Agrupamentos e Índices.
- `34` **PostgreSQL na prática:** Instalação via container, tipos avançados e otimização de consultas.
- `35` **Migrations:** Controle de versão de esquema de banco de dados com **Flyway**.

---

### 🍃 Módulo 9: NoSQL & Estratégias de Cache

> **Foco:** Alta performance e estruturas de dados não-relacionais.

- `36` **NoSQL — conceitos:** Teorema CAP, modelo de consistência e famílias NoSQL.
- `37` **MongoDB na prática:** Operações CRUD, documentos JSON/BSON e coleções.
- `38` **Redis:** Armazenamento chave-valor em memória, estratégias de cache (_Cache-Aside_, _TTL_) e invalidação.
- `39` **Onde hospedar o banco:** Comparativo de serviços gerenciados em nuvem (RDS, Atlas, Supabase).

---

### 📨 Módulo 10: Arquitetura Orientada a Eventos & Mensageria

> **Foco:** Comunicação assíncrona e desacoplamento de serviços.

- `40` **Mensageria — conceitos:** Padrões Pub/Sub vs Queues, consistência eventual e idempotência.
- `41` **Kafka na prática:** Tópicos, partições, produtores, consumidores, grupos de consumo e _offsets_.
- `42` **Spring Kafka:** Integração da mensageria Kafka com o ecossistema Spring usando `@KafkaListener` e `KafkaTemplate`.

---

### 🌿 Módulo 11: Ecossistema Spring Framework

> **Foco:** Construção profissional de APIs e microsserviços.

- `43` **Spring Core (IoC/DI):** O container Spring, Inversão de Controle, Injeção de Dependências, `@Component`, `@Service`, `@Repository` e escopo de Beans.
- `44` **Spring Web/MVC:** Controladores REST (`@RestController`), mapeamento de rotas (`@GetMapping`, `@PostMapping`), `@RequestBody` e `@PathVariable`.
- `45` **Spring Data JPA:** Mapeamento Objeto-Relacional (ORM) com Hibernate, entidades (`@Entity`), repositórios (`JpaRepository`) e métodos de consulta (_Derived Queries_).
- `46` **Problema N+1:** Diagnóstico e resolução do gargalo de performance no JPA usando `JOIN FETCH`, `@EntityGraph` e DTOs.
- `47` **DTO Mapping:** Padrão Data Transfer Object e isolamento do domínio utilizando ferramentas de mapeamento como **MapStruct**.
- `48` **Validation & erros:** Validação de dados de entrada com Bean Validation (`@NotNull`, `@Valid`) e tratamento global de exceções com `@RestControllerAdvice`.
- `49` **Paginação & Swagger:** Paginação/ordenação de resultados com `Pageable` e documentação interativa da API via OpenAPI 3 / Swagger UI.
- `50` **CORS & rate limiting:** Políticas de origem cruzada e proteção contra abuso de requisições.

---

### 🔒 Módulo 12: Segurança & Autenticação

> **Foco:** Proteção e controle de acesso a nível de produção.

- `51` **Sessão vs JWT vs OAuth2:** Comparativo de arquiteturas de autenticação stateless vs stateful.
- `52` **Spring Security:** Configuração da cadeia de filtros (_SecurityFilterChain_), autenticação e autorização por roles (`@PreAuthorize`).
- `53` **HTTPS & certificados:** Comunicação segura, TLS/SSL e terminação HTTPS.

---

### 🧪 Módulo 13: Testes Avançados & Resiliência

> **Foco:** Garantia de qualidade, testes com containers e tolerância a falhas.

- `54` **Testcontainers:** Execução de testes de integração automatizados subindo instâncias reais de bancos e serviços via Docker durante a suíte de testes.
- `55` **Circuit Breaker:** Implementação de padrões de resiliência (Circuit Breaker, Retry, Rate Limiter) com **Resilience4j**.

---

### 📊 Módulo 14: Observabilidade & Práticas DevOps

> **Foco:** Monitoramento, automação e práticas de produção.

- `56` **Actuator & health checks:** Exposição de métricas da aplicação, verificação de saúde e estado dos componentes em tempo de execução.
- `57` **Secrets em produção:** Gestão segura de senhas e chaves de API sem expor dados no código fonte.
- `58` **CI/CD (GitHub Actions):** Construção de pipelines automatizadas para execução de testes, build e deploy.
- `59` **Práticas de produção:** Checklist para entrada em produção (Graceful Shutdown, limites de memória da JVM, configurações de pool de conexões HikariCP).

---

### 🌐 Módulo 15: Deploy Real

> **Foco:** Publicação da infraestrutura backend em provedores Cloud.

- `60` **Deploy do back-end:** Publicação e configuração da aplicação Spring em serviços de nuvem (AWS, Render, Railway, Fly.io).
- `61` **Deploy do front & monorepo:** Estratégias de hospedagem de aplicações estáticas/SPAs (Vercel, Netlify) e organização de repositórios.

---

### 💻 Módulo 16: Front-end Consumindo Tudo

> **Foco:** Integração ponta a ponta com clientes Web.

- `62` **Conectando front e back:** Consumo de APIs RESTful usando Axios/Fetch, manipulação de CORS e gerenciamento de estado HTTP.
- `63` **Auth no front & TypeScript:** Fluxo de login, armazenamento seguro de tokens JWT (HttpOnly Cookies vs LocalStorage) e contratos fortemente tipados.
- `64` **WebSockets:** Comunicação bidirecional em tempo real entre o front-end e o Spring Boot via STOMP/SockJS.

---

### 🛠️ Módulo 17: Ferramentas Spring

> **Foco:** Produtividade, programação orientada a aspectos e utilitários do ecossistema Spring.

- `65` **Lombok:** Redução de código boilerplate com anotações (`@Data`, `@Getter`, `@Setter`, `@AllArgsConstructor`, `@Builder`).
- `66` **Spring Boot DevTools:** Recarregamento rápido (_LiveReload_, _Hot Swapping_) durante o desenvolvimento.
- `67` **Spring AOP:** Programação Orientada a Aspectos (Aspects, JoinPoints, Pointcuts, Advice) para log, auditoria e transações cross-cutting.
- `68` **Spring Cache Abstraction:** Abstrações de cache com `@Cacheable`, `@CacheEvict` e integração com Redis.
- `69` **WebClient & RestTemplate:** Consumo de APIs HTTP externas de forma síncrona e reativa/assíncrona.
- `70` **Spring Profiles avançado:** Configurações dinâmicas por ambiente (`dev`, `test`, `prod`) e propriedades externalizadas.

---

### 📐 Módulo 18: Engenharia de Software

> **Foco:** Qualidade de código, arquitetura corporativa e metodologias de desenvolvimento.

- `71` **Clean Code & Refatoração:** Code smells, nomes significativos, funções pequenas, princípio da responsabilidade única e técnicas de refatoração.
- `72` **Arquitetura de Software:** Arquitetura em Camadas, Hexagonal (Ports & Adapters) e Clean Architecture.
- `73` **Domain-Driven Design (DDD):** Linguagem Ubíqua, Bounded Contexts, Entidades, Objetos de Valor (VOs), Agregados e Repositórios.
- `74` **Code Review & ADRs:** Práticas de revisão de código de alto nível e documentação de decisões arquiteturais via Architecture Decision Records.
- `75` **Metodologias Ágeis:** Framework Scrum, Kanban, métricas de fluxo (Lead Time, Cycle Time) e estimativas.

---

### 🧩 Módulo 19: Lógica & Algoritmos

> **Foco:** Fundamentação em ciência da computação, estruturas de dados e análise de complexidade.

- `76` **Lógica de programação:** Raciocínio algorítmico, condicionais avançadas, laços e manipulação de vetores/matrizes.
- `77` **Complexidade (Big O):** Análise de tempo e espaço $O(1)$, $O(n)$, $O(\log n)$, $O(n^2)$.
- `78` **Recursão:** Pilha de chamadas recursivas, caso base, caso recursivo e estouro de pilha (_StackOverflowError_).
- `79` **Estruturas de dados avançadas:** Árvores (BST, AVL), Grafos, Matrizes de Adjacência e Tabelas Hash.
- `80` **Ordenação & busca:** Algoritmos de ordenação (QuickSort, MergeSort) e busca (Busca Binária).
- `81` **Sistemas distribuídos (CAP):** Teorema CAP (Consistência, Disponibilidade, Tolerância a Partição) e consistência eventual.

---

### 🎓 Módulo 20: Aprofundamento Sênior

> **Foco:** Funcionamento interno da JVM, conceitos abstratos e arquiteturas avançadas.

- `82` **JVM, Bytecode & GC:** Estrutura interna da JVM, compilação JIT, interpretação de Bytecode, alocação em Heap/Stack e algoritmos de Garbage Collection (G1, ZGC).
- `83` **Os 4 Pilares — aprofundado:** Análise detalhada dos impactos de memória, acoplamento e performance na aplicação de Abstração, Encapsulamento, Herança e Polimorfismo.
- `84` **DI, IoC & ciclo de vida:** Ciclo de vida interno dos Spring Beans (`BeanFactory`, `ApplicationContext`, `@PostConstruct`, `@PreDestroy`, BeanPostProcessors).
- `85` **Concorrência — aprofundado:** `Volatile`, `AtomicVariables`, modelo de memória do Java (JMM), locks explícitos (`ReentrantLock`) e Virtual Threads (Project Loom).
- `86` **Event-Driven & Kafka interno:** Arquitetura interna do Kafka (Commit Log, Zookeeper/KRaft, semânticas de entrega _at-least-once_, _exactly-once_).

---

### 🧪 Módulo 21: Testes & Debugging

> **Foco:** Táticas avançadas de testes unitários/integrados e engenharia reversa via debugger.

- `87` **Mockito — mocks & dublês:** Mocks, Spies, Stubs, ArgumentCaptor, verificação de comportamentos e testes de exceções.
- `88` **Testes de integração avançados:** Testes end-to-end com `@SpringBootTest`, isolamento de banco de dados e testes de perfil com Testcontainers.
- `89` **Debugging na prática:** Uso avançado de breakpoints (condicionais, watchpoints), navegação pela call stack, avaliação de expressões em tempo de execução e análise de heap dumps.

---

### 🏁 Módulo 22: Fechamento

> **Foco:** Consolidação sistêmica, avaliação integradora e encerramento do programa.

- `90` **Mapa do sistema:** Diagrama arquitetural completo relacionando todos os módulos do curso.
- `91` **Projeto final integrador:** Construção da aplicação final combinando front-end, microsserviços Spring, mensageria e pipeline DevOps.
- `92` **Quiz de revisão:** Bateria de validação de conhecimento abordando todo o conteúdo do curso.

---
