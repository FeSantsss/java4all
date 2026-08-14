# Stack Completa — Java e Spring

Curso interativo e offline-first de Java e Spring. O conteúdo integral está no `index.html`; a camada de estudos, instalação e cache é distribuída em pequenos arquivos locais, sem frameworks ou dependências externas.

## Acesse o curso

**[Abrir Stack Completa — Java e Spring](https://fesantsss.github.io/java4all/)**

O curso é publicado no GitHub Pages e funciona diretamente pelo navegador. Não é necessário clonar o repositório, instalar dependências, executar comandos ou configurar um servidor local para estudar.

## Estado atual

* 112 capítulos.
* 20 fases organizadas por dependência pedagógica.
* 10 mini-projetos práticos.
* Conteúdo e estilos reunidos no `index.html`, com a lógica da aplicação isolada em `app.js`.
* 93 capítulos do material original preservados e reposicionados.
* Fundamentos adicionados antes de orientação a objetos.
* Spring concluído antes de testes avançados, Docker, Kafka e arquitetura.
* Nenhum capítulo aponta para um pré-requisito localizado adiante na trilha.

## Nível e expectativas

Esta é uma trilha ampla e aprofundada, construída para oferecer uma sequência coerente desde o primeiro programa em Java até aplicações Spring, dados, segurança, containers, mensageria, produção e arquitetura. Ela funciona muito bem como mapa de aprendizado, material de consulta, revisão e guia para projetos.

Entretanto, nenhum material de leitura, isoladamente, produz domínio profundo de todas essas tecnologias. O curso entrega explicações, exemplos, exercícios, decisões técnicas e projetos; o domínio aparece quando o estudante também executa, erra, depura, testa, mede e entrega sistemas reais.

Para considerar um assunto realmente aprendido, o estudante deve conseguir:

* explicar o conceito sem consultar o capítulo;
* implementar um exemplo partindo de um projeto vazio;
* reconhecer casos em que a tecnologia não deve ser usada;
* diagnosticar erros sem depender de copiar uma solução pronta;
* escrever testes para o comportamento implementado;
* justificar decisões e alternativas técnicas;
* consultar e interpretar a documentação oficial;
* aplicar o conhecimento em um projeto diferente do exemplo apresentado.

## Recursos

* Navegação por capítulo sem recarregar a página.
* Sumário dividido por fases.
* Busca instantânea em todo o conteúdo e paleta de comandos com `Ctrl/Cmd + K`.
* Filtro para mostrar somente mini-projetos.
* Filtro de capítulos favoritos.
* Progresso calculado por capítulos concluídos.
* Progresso e checklists salvos no `localStorage` do navegador.
* Retomada automática do último capítulo aberto.
* Navegação pelos botões anterior e próximo.
* Links entre capítulos e seus pré-requisitos.
* Exercícios com soluções reveláveis.
* Quizzes interativos com correção imediata, resposta persistente e estatística de acertos.
* Checklists persistentes.
* Botões para copiar exemplos de código.
* Anotações independentes por capítulo, com autosave, cópia e download em Markdown.
* Java Lab com rascunho persistente, exemplos, console didático offline e download `.java`.
* Fila de repetição espaçada com quatro níveis de lembrança e intervalos adaptativos.
* Meta diária, sequência de dias, tempo focado e mapa de atividade das últimas oito semanas.
* Timer Pomodoro de 25 minutos com pausa de 5 minutos.
* Conquistas desbloqueáveis por progresso, constância, prática e quizzes.
* Temas escuro, claro e alto contraste.
* Controle do tamanho do texto, modo foco, revisão rápida e redução de movimentos.
* Barra de leitura do capítulo.
* Exportação e importação de um backup JSON com todos os dados de estudo.
* PWA instalável com cache integral do curso para uso sem internet.
* Detecção de conexão e indicação explícita quando o navegador está offline.
* Layout responsivo para desktop e dispositivos móveis.
* Estilo específico para impressão.

## Uso offline e instalação

Abra o [curso no GitHub Pages](https://fesantsss.github.io/java-study-poo-claude/) pelo menos uma vez com internet. Nessa primeira visita, o Service Worker armazena o conteúdo integral no dispositivo. Depois disso, o mesmo endereço pode ser aberto sem conexão no mesmo navegador e perfil.

Para instalar como aplicativo:

1. Acesse o curso pelo GitHub Pages.
2. Abra **Central → Preferências → Curso offline e instalável**.
3. Clique em **Instalar app** quando a opção estiver disponível.

Dependendo do navegador, a instalação também aparece na barra de endereço ou no menu como **Instalar aplicativo** ou **Adicionar à tela inicial**. A instalação não é obrigatória: o cache offline funciona no próprio navegador.

Quando houver uma nova versão do curso, conecte-se à internet e recarregue a página. A opção **Atualizar cache**, nas preferências, também solicita a atualização dos arquivos offline.

Os arquivos offline são:

* `index.html`: aplicação e conteúdo integral do curso;
* `app.js`: sistema de estudos e persistência;
* `sw.js`: cache offline, atualização e fallback de navegação;
* `manifest.webmanifest`: metadados do aplicativo instalável;
* `icon.svg`: ícone vetorial do curso.

O Service Worker usa uma estratégia de rede primeiro para os arquivos locais, atualizando o cache quando existe conexão e usando a última cópia armazenada como fallback quando a rede não está disponível.

## Atalhos

| Atalho    | Ação                                      |
| --------- | ----------------------------------------- |
| `/`       | Abre o menu e posiciona o cursor na busca |
| `Ctrl/Cmd + K` | Abre a paleta de comandos e capítulos |
| `Alt + ←` | Abre o capítulo anterior                  |
| `Alt + →` | Abre o próximo capítulo                   |
| `F`       | Favorita ou remove o capítulo dos favoritos |
| `N`       | Abre as anotações do capítulo             |
| `R`       | Abre a fila de revisão espaçada           |
| `L`       | Abre o Java Lab                           |
| `C`       | Marca ou desmarca o capítulo como concluído |
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

## Como estudar para alcançar profundidade

Cada capítulo deve ser tratado como um ciclo de aprendizagem, não como uma página a ser marcada rapidamente:

1. Leia o conteúdo e execute os exemplos no ambiente real.
2. Reescreva os exemplos sem copiar, alterando nomes, regras e casos de entrada.
3. Resolva o exercício antes de revelar a solução.
4. Explique em voz alta o que acontece em memória, no runtime ou na infraestrutura.
5. Registre dúvidas e decisões nas anotações do capítulo.
6. Marque o capítulo como concluído somente após conseguir reproduzir o conceito.
7. Use a fila de repetição espaçada e seja honesto ao avaliar a lembrança.
8. Aplique o assunto no mini-projeto correspondente.

Para tecnologias de aplicação e infraestrutura, os exemplos do navegador devem ser levados para ferramentas reais:

* Java deve ser compilado e executado com um JDK real;
* dependências e builds devem passar por Maven ou Gradle;
* APIs Spring devem ser iniciadas, testadas e observadas localmente;
* PostgreSQL, MongoDB e Redis devem receber dados e consultas reais;
* Docker e Compose devem criar ambientes reproduzíveis;
* Kafka deve ser praticado com produtores, consumidores, falhas e reprocessamento;
* testes devem ser executados automaticamente e fazer parte do fluxo de Git;
* aplicações devem ser configuradas e implantadas em um ambiente separado do desenvolvimento.

### Evidências de domínio

Concluir a trilha significa produzir evidências verificáveis, não apenas atingir 100% na barra de progresso:

* repositórios separados para os projetos principais;
* histórico de commits compreensível;
* README de cada projeto com arquitetura e instruções de execução;
* testes unitários e de integração automatizados;
* banco versionado por migrations;
* decisões relevantes registradas em ADRs;
* pipeline de integração contínua;
* logs, métricas e procedimentos básicos de diagnóstico;
* pelo menos um deploy reproduzível;
* capacidade de apresentar o sistema e defender seus trade-offs.

### Prática complementar necessária

Para aprofundamento profissional, use este curso em conjunto com documentação oficial, projetos próprios, leitura de código, code review, debugging e manutenção contínua. Bibliotecas, frameworks, práticas de segurança e plataformas de deploy evoluem; portanto, exemplos devem ser confrontados com a documentação da versão realmente usada no projeto.

## Persistência local

O navegador armazena localmente:

* último capítulo aberto;
* capítulos marcados como concluídos;
* estado dos checklists;
* favoritos;
* respostas e resultados dos quizzes;
* anotações por capítulo;
* rascunhos do Java Lab;
* histórico diário de estudo;
* fila, intervalos e domínio da revisão espaçada;
* tema, tamanho de texto, meta diária e modos de leitura.

Esses dados pertencem ao navegador e ao perfil em que o arquivo foi aberto. Limpar os dados do navegador pode apagar o progresso.

A opção **Exportar JSON** da Central de estudos cria um backup legível com todos esses dados. **Importar backup** valida o arquivo e pede confirmação antes de substituir o estado atual.

Não existe conta, banco de dados remoto ou sincronização automática entre dispositivos nesta versão. O progresso salvo no GitHub Pages pertence ao navegador e perfil utilizados. Outro navegador, perfil ou dispositivo terá uma área de armazenamento diferente. Use o backup JSON para transportar o progresso entre eles.

## Limites do Java Lab

O Java Lab oferece um runner didático totalmente local para `System.out.print/println`, declarações de variáveis numéricas, `String`, operações aritméticas, concatenação e laços `for` simples. Ele foi pensado para experimentos rápidos de fundamentos sem conexão.

Recursos completos da linguagem — classes colaborando entre si, Collections, Streams, threads, bibliotecas, Maven, Spring e acesso a banco — exigem uma JVM real. O botão **Baixar `.java`** permite levar o rascunho ao JDK sem perder o trabalho.

Essa estrutura permite navegação dinâmica sem exigir framework, build ou instalação obrigatória.

## Objetivo

A trilha foi construída para levar o estudante do primeiro programa Java até uma aplicação Spring persistente e, somente depois, introduzir testes avançados, segurança, containers, produção, Kafka e decisões arquiteturais.

O objetivo não é apenas terminar capítulos. É demonstrar domínio por meio de exercícios, projetos e capacidade de explicar as decisões tomadas.

O curso deve ser entendido como a espinha dorsal da formação. A profundidade final depende da quantidade e da qualidade da prática realizada fora da leitura: projetos executáveis, testes, investigação de falhas, documentação, revisão de código e operação de ambientes reais.
