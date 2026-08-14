# Stack Completa — Java e Spring

Curso interativo de Java e Spring distribuído como uma aplicação autônoma em um único arquivo HTML.

## Estado atual

* 112 capítulos.
* 20 fases organizadas por dependência pedagógica.
* 10 mini-projetos práticos.
* HTML, CSS e JavaScript reunidos em um único arquivo.
* 93 capítulos do material original preservados e reposicionados.
* Fundamentos adicionados antes de orientação a objetos.
* Spring concluído antes de testes avançados, Docker, Kafka e arquitetura.
* Nenhum capítulo aponta para um pré-requisito localizado adiante na trilha.

## Recursos

* Navegação por capítulo sem recarregar a página.
* Sumário dividido por fases.
* Busca em todo o conteúdo.
* Filtro para mostrar somente mini-projetos.
* Progresso calculado por capítulos concluídos.
* Progresso e checklists salvos no `localStorage` do navegador.
* Retomada automática do último capítulo aberto.
* Navegação pelos botões anterior e próximo.
* Links entre capítulos e seus pré-requisitos.
* Exercícios com soluções reveláveis.
* Quizzes interativos com correção imediata.
* Checklists persistentes.
* Botões para copiar exemplos de código.
* Layout responsivo para desktop e dispositivos móveis.
* Estilo específico para impressão.

## Atalhos

| Atalho    | Ação                                      |
| --------- | ----------------------------------------- |
| `/`       | Abre o menu e posiciona o cursor na busca |
| `Alt + ←` | Abre o capítulo anterior                  |
| `Alt + →` | Abre o próximo capítulo                   |
| `Esc`     | Fecha o menu lateral                      |

## Trilha de estudo

### 1. Comece aqui

Preparação do ambiente, funcionamento do JDK, compilação, bytecode, JVM e primeiro programa executável.

### 2. Fundamentos da linguagem

Variáveis, tipos, memória, operadores, decisões, laços, arrays, matrizes, Strings, wrappers, métodos, escopo e lógica de programação.

Marco prático: caixa eletrônico no terminal.

### 3. Orientação a objetos

Classes, atributos, métodos, construtores, encapsulamento, `static`, `final`, `this`, herança, polimorfismo, abstração e interfaces.

Marco prático: biblioteca orientada a objetos.

### 4. Java essencial

Pacotes, exceções, Collections, Generics, Java moderno, Lambdas, Streams e Java I/O.

Marcos práticos: analisador de vendas e importador de pedidos.

### 5. Raciocínio algorítmico

Complexidade Big O, recursão, ordenação e busca.

### 6. Base profissional

Git, Maven, Gradle, anotações, Reflection, JSON, logging, SOLID, injeção de dependência manual, padrões de projeto e Clean Code.

### 7. Web e banco antes do Spring

HTTP, APIs REST, SQL, PostgreSQL, migrations e JDBC.

Marco prático: sistema de finanças pessoais com PostgreSQL e JDBC.

### 8. Spring: primeira API completa

Spring Core, IoC, DI, DevTools, Lombok, Spring MVC, Spring Data JPA, DTOs, validação, tratamento de erros, paginação, OpenAPI, N+1 e CORS.

Marco prático: API de help desk.

### 9. Testes depois da aplicação

JUnit, testes unitários, Mockito, dublês de teste e desenvolvimento de regras guiadas por testes.

Marco prático: motor de reservas testado.

### 10. Segurança da API

Sessão, JWT, OAuth2, Spring Security, autorização por papéis e HTTPS.

Marco prático: autenticação e RBAC aplicados à API.

### 11. Docker e ambiente reproduzível

Containers, imagens, Dockerfile, multi-stage build e Docker Compose.

### 12. Testes de integração reais

Testcontainers e testes contra serviços reais executados em containers isolados.

### 13. NoSQL, cache e hospedagem

Conceitos NoSQL, MongoDB, Redis e estratégias de hospedagem de bancos.

### 14. Spring avançado

Resilience4j, WebClient, Spring AOP, Spring Cache e Actuator.

### 15. Produção, CI/CD e deploy

Secrets, GitHub Actions, práticas de produção, deploy do back-end, Spring Profiles e observabilidade.

Marco prático: deploy reproduzível, observável e reversível.

### 16. Mensageria depois do monólito

Threads, fundamentos de mensageria, Kafka e Spring Kafka.

### 17. Arquitetura e sistemas distribuídos

Aprofundamento em POO, JVM, IoC, concorrência, debugging, arquitetura de software, DDD, sistemas distribuídos, arquitetura orientada a eventos e testes de integração avançados.

Marco prático: sistema de pedidos orientado a eventos.

### 18. Estruturas avançadas

Árvores, grafos, matrizes de adjacência e tabelas hash.

### 19. Trabalho profissional em equipe

Code review, Architecture Decision Records, Scrum e Kanban.

### 20. Integração, projeto final e revisão

Integração entre front-end e back-end, autenticação no cliente, WebSockets, deploy do front-end, mapa do sistema, projeto integrador e quiz final.

## Mini-projetos

1. Caixa eletrônico no terminal.
2. Biblioteca orientada a objetos.
3. Importador de pedidos.
4. Analisador de vendas com Streams.
5. Motor de reservas guiado por testes.
6. Finanças pessoais com PostgreSQL e JDBC.
7. API de help desk com Spring.
8. Autenticação e autorização por papéis.
9. Pedidos orientados a eventos com Kafka.
10. Deploy reproduzível e observável.

Os mini-projetos apresentam requisitos, restrições, casos-limite, entregáveis e critérios de conclusão. Eles não fornecem uma implementação completa pronta.

## Persistência local

O navegador armazena localmente:

* último capítulo aberto;
* capítulos marcados como concluídos;
* estado dos checklists.

Esses dados pertencem ao navegador e ao perfil em que o arquivo foi aberto. Limpar os dados do navegador pode apagar o progresso.

Essa estrutura permite navegação dinâmica sem exigir framework ou processo de instalação.

## Objetivo

A trilha foi construída para levar o estudante do primeiro programa Java até uma aplicação Spring persistente e, somente depois, introduzir testes avançados, segurança, containers, produção, Kafka e decisões arquiteturais.

O objetivo não é apenas terminar capítulos. É demonstrar domínio por meio de exercícios, projetos e capacidade de explicar as decisões tomadas.
