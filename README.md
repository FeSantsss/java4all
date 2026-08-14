# Stack Completa — Java e Spring

Curso interativo e offline-first de Java e Spring. O conteúdo integral está no `index.html`; a camada de estudos, instalação e cache é distribuída em pequenos arquivos locais, sem frameworks ou dependências externas.

## Acesse o curso

**[Abrir Stack Completa — Java e Spring](https://fesantsss.github.io/java4all/)**

O curso é publicado no GitHub Pages e funciona diretamente pelo navegador. Não é necessário clonar o repositório, instalar dependências, executar comandos ou configurar um servidor local para estudar.

## Estado atual

* 128 capítulos.
* 20 fases organizadas por dependência pedagógica.
* 10 mini-projetos práticos.
* Conteúdo original e estilos reunidos no `index.html`, aprofundamentos curriculares em `curriculum-v2.js` e lógica da aplicação isolada em `app.js`.
* 93 capítulos do material original preservados e reposicionados.
* 16 capítulos de aprofundamento adicionados sem alterar os identificadores usados pelo progresso antigo.
* Fundamentos adicionados antes de orientação a objetos.
* Progressão em camadas nos assuntos novos: primeiro contato executável, modelo mental, casos-limite e aprofundamento.
* Bases conceituais locais antes do primeiro código avançado, com siglas, papéis e conexões futuras explicados no próprio capítulo.
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
* Busca instantânea e precisa pelo título dos capítulos, sem diferença entre maiúsculas, minúsculas ou acentos, também disponível na paleta de comandos com `Ctrl/Cmd + K`.
* Filtro para mostrar somente mini-projetos.
* Filtro de capítulos favoritos.
* Progresso calculado por capítulos concluídos.
* Progresso e checklists salvos no IndexedDB do navegador.
* Retomada automática do último capítulo aberto.
* Navegação pelos botões anterior e próximo.
* Links entre capítulos e seus pré-requisitos.
* Exercícios com soluções reveláveis.
* Quizzes interativos com correção imediata, resposta persistente, checkpoints de projeto e estatística de acertos.
* Checklists persistentes.
* Botões para copiar exemplos de código.
* Anotações independentes por capítulo, com autosave, cópia e download em Markdown.
* Glossário contextual com 111 conceitos clicáveis, pesquisa e navegação ao capítulo relacionado.
* Java Lab com rascunho persistente, exemplos, console didático offline e download `.java`.
* Fila de repetição espaçada com questões de múltipla escolha, correção imediata, intervalos adaptativos e planejamento diário do que revisar ou adiar.
* Recuperação ativa antes da explicação de cada capítulo, sem nota e sem bloquear a leitura.
* Mapa de domínio por conceito, calculado a partir de evidências reais em diferentes tipos de atividade.
* Caderno automático de erros com contexto, correção guiada e histórico de itens pendentes ou resolvidos.
* Diagnóstico do curso completo ou de uma fase, com pontos fortes, lacunas e recomendação de onde começar.
* Projetos acompanhados por prontidão: requisitos explícitos, conclusão dos fundamentos e evidências por conceito, sem bloquear o acesso.
* Meta diária, sequência de dias, tempo focado e mapa de atividade das últimas oito semanas.
* Timer Pomodoro de 25 minutos com pausa de 5 minutos.
* Conquistas desbloqueáveis por progresso, constância, prática e quizzes.
* Tema automático que usa Claro em sistemas claros e Alto contraste em sistemas escuros, além das duas escolhas manuais.
* Controle do tamanho do texto, modo foco, revisão rápida e redução de movimentos.
* Barra de leitura do capítulo.
* Exportação e importação de um backup JSON com todos os dados de estudo.
* PWA instalável com cache integral do curso para uso sem internet.
* Detecção de conexão e indicação explícita quando o navegador está offline.
* Layout responsivo para desktop e dispositivos móveis.
* Estilo específico para impressão.

## Uso offline e instalação

Abra o [curso no GitHub Pages](https://fesantsss.github.io/java4all/) pelo menos uma vez com internet. Nessa primeira visita, o Service Worker armazena o conteúdo integral no dispositivo. Depois disso, o mesmo endereço pode ser aberto sem conexão no mesmo navegador e perfil.

Para instalar como aplicativo:

1. Acesse o curso pelo GitHub Pages.
2. Abra **Central → Preferências → Curso offline e instalável**.
3. Clique em **Instalar app** quando a opção estiver disponível.

Dependendo do navegador, a instalação também aparece na barra de endereço ou no menu como **Instalar aplicativo** ou **Adicionar à tela inicial**. A instalação não é obrigatória: o cache offline funciona no próprio navegador.

Quando houver uma nova versão do curso, conecte-se à internet e recarregue a página. A opção **Atualizar cache**, nas preferências, também solicita a atualização dos arquivos offline.

Os arquivos offline são:

* `index.html`: estrutura da aplicação e conteúdo-base do curso;
* `curriculum-v2.js`: capítulos de aprofundamento, checkpoints e critérios de qualidade dos projetos;
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
| `M`       | Abre o mapa de domínio e pontos fracos    |
| `L`       | Abre o Java Lab                           |
| `G`       | Abre o glossário contextual               |
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

Pacotes, exceções, Collections, Generics, Java moderno, records, sealed types, pattern matching, virtual threads, Lambdas, Streams e Java I/O.

Marcos práticos: analisador de vendas e importador de pedidos.

### 5. Raciocínio algorítmico

Complexidade Big O, recursão, ordenação, busca, heaps, grafos, BFS/DFS, caminhos mínimos, programação dinâmica e benchmarking.

### 6. Base profissional

Git, Maven, Gradle, anotações, Reflection, JSON, logging, SOLID, injeção de dependência manual, padrões de projeto e Clean Code.

### 7. Web e banco antes do Spring

HTTP, APIs REST, SQL, PostgreSQL, migrations, JDBC, planos de execução, MVCC, isolamento, locks e concorrência.

Marco prático: sistema de finanças pessoais com PostgreSQL e JDBC.

### 8. Spring: primeira API completa

Spring Core, Spring Boot, IoC, DI, configuração tipada, DevTools, Lombok, Spring MVC, Spring Data JPA, ciclo de vida de entidades, transações, DTOs, validação, Problem Details, idempotência, paginação, OpenAPI, N+1 e CORS.

Marco prático: API de help desk.

### 9. Testes depois da aplicação

JUnit, testes unitários, Mockito, dublês de teste e desenvolvimento de regras guiadas por testes.

Marco prático: motor de reservas testado.

### 10. Segurança da API

Sessão, JWT, OAuth 2.0, OpenID Connect, PKCE, Resource Server, Spring Security, autorização por escopo/propriedade e HTTPS.

Marco prático: autenticação e RBAC aplicados à API.

### 11. Docker e ambiente reproduzível

Containers, imagens, Dockerfile, multi-stage build e Docker Compose.

### 12. Testes de integração reais

Testcontainers e testes contra serviços reais executados em containers isolados.

### 13. NoSQL, cache e hospedagem

Conceitos NoSQL, MongoDB, Redis e estratégias de hospedagem de bancos.

### 14. Spring avançado

Resilience4j, RestClient/WebClient, Spring AOP, Spring Cache, Actuator, logs estruturados, métricas, traces e SLOs.

### 15. Produção, CI/CD e deploy

Secrets, GitHub Actions, supply chain, hardening, deploy progressivo, rollback, backup/restauração, Spring Profiles e observabilidade.

Marco prático: deploy reproduzível, observável e reversível.

### 16. Mensageria depois do monólito

Threads, fundamentos de mensageria, Kafka, Spring Kafka, schemas, retry/DLT, idempotência, outbox e exactly-once dentro de limites explícitos.

### 17. Arquitetura e sistemas distribuídos

Aprofundamento em POO, JVM, IoC, concorrência, debugging, arquitetura de software, DDD estratégico, CAP/PACELC, consistência distribuída, arquitetura orientada a eventos e testes de integração avançados.

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

O IndexedDB é o armazenamento principal dos dados de estudo. Ele oferece mais capacidade, transações e espaço para a evolução de anotações, rascunhos e histórico do que o `localStorage`.

Na primeira abertura desta versão, o sistema procura automaticamente os dados antigos na chave `stack-completa:single:v1` do `localStorage`. Quando encontra:

1. abre o banco `stack-completa-java` no IndexedDB;
2. copia o estado completo para o banco;
3. lê novamente o registro para verificar a gravação;
4. remove a cópia antiga somente depois da verificação bem-sucedida;
5. informa na tela que a migração foi concluída.

Se o IndexedDB estiver indisponível ou for bloqueado pelo navegador, o curso continua funcionando com `localStorage` em modo de compatibilidade.

O navegador armazena:

* último capítulo aberto;
* capítulos marcados como concluídos;
* estado dos checklists;
* favoritos;
* respostas e resultados dos quizzes;
* anotações por capítulo;
* rascunhos do Java Lab;
* histórico diário de estudo;
* fila, intervalos e domínio da revisão espaçada;
* plano diário da revisão, com itens escolhidos e adiados somente naquele dia;
* respostas das recuperações antes da explicação;
* pontuação, precisão, sequência e fontes de evidência de cada conceito;
* caderno automático de erros, tentativas de correção e resolução;
* diagnóstico em andamento e os 20 resultados mais recentes;
* tema, tamanho de texto, meta diária e modos de leitura.

Esses dados pertencem ao navegador e ao perfil em que o arquivo foi aberto. Limpar os dados do navegador pode apagar o progresso.

A opção **Exportar JSON** da Central de estudos cria um backup legível com todos esses dados. **Importar backup** valida o arquivo e pede confirmação antes de substituir o estado atual.

Não existe conta, banco de dados remoto ou sincronização automática entre dispositivos nesta versão. O progresso salvo no GitHub Pages pertence ao navegador e perfil utilizados. Outro navegador, perfil ou dispositivo terá uma área de armazenamento diferente. Use o backup JSON para transportar o progresso entre eles.

## Planejamento diário da revisão

A área **Central → Revisão** separa a fila vencida em três visualizações: todas, escolhidas para hoje e adiadas. Cada capítulo pode ser marcado ou desmarcado individualmente, e os botões **Selecionar todas** e **Adiar todas hoje** permitem organizar filas grandes de uma vez.

Todos os itens vencidos entram selecionados por padrão. Ao desmarcar um item, o curso grava no IndexedDB apenas a decisão de não mostrá-lo na sessão daquele dia. Isso não conta como revisão, não aumenta o domínio e não muda a data nem o intervalo calculado pela repetição espaçada. Na mudança de data, o plano diário é recriado e os itens que continuarem vencidos voltam automaticamente à seleção.

Cada item escolhido vira uma questão de múltipla escolha. O sistema prioriza checkpoints já existentes no capítulo, depois conceitos do glossário e, quando necessário, tópicos reais da própria seção. As alternativas são embaralhadas de forma determinística para que a resposta correta não permaneça sempre na mesma posição.

Ao responder, a alternativa correta é destacada e uma explicação aparece imediatamente. Um erro reduz o domínio e agenda o capítulo para o dia seguinte; um acerto aumenta o domínio e amplia progressivamente o intervalo. A tentativa, o resultado, a resposta dada e a próxima data são salvos no IndexedDB. O plano diário também faz parte da exportação e importação do backup JSON.

## Domínio, diagnóstico e caderno de erros

A área **Central → Domínio** concentra cinco mecanismos que compartilham o mesmo modelo de aprendizagem. O objetivo não é premiar cliques ou tempo de tela: abrir um capítulo e marcá-lo como concluído não aumenta sozinho o domínio de um conceito.

### Recuperação antes da explicação

Cada capítulo começa com uma questão curta antes do texto principal. Ela convida o estudante a tentar recuperar um conhecimento anterior ou prever o significado do conceito que será estudado. A atividade não vale nota, não bloqueia o capítulo e mostra a explicação imediatamente após a escolha. A resposta fica salva para não reaparecer como uma tentativa nova a cada recarregamento.

O ideal é responder antes de rolar a página, mesmo sem certeza. Um erro nessa etapa não reduz a pontuação do conceito, mas fica registrado no caderno para que a dúvida não desapareça sem correção.

### Mapa de domínio por conceito

O mapa reúne os 111 conceitos do glossário e uma competência de capítulo para as seções que não possuem termo próprio. A pontuação vai de 0 a 100 e recebe evidências com pesos diferentes:

* recuperação inicial correta: `+8`;
* diagnóstico: `+16` por acerto e `−6` por erro;
* quiz do capítulo: `+14` por acerto e `−10` por erro;
* revisão espaçada: `+20` por acerto e `−16` por erro;
* correção no caderno: `+24` por acerto e `−8` por nova tentativa incorreta.

Os estados exibidos são **Não estudado**, **Em aprendizado**, **Compreendido**, **Consolidado** e **Precisa revisar**. Uma pendência no caderno mantém o conceito em revisão mesmo que sua pontuação anterior seja alta. A tela permite pesquisar por conceito ou capítulo e filtrar por estado.

Esses números são indicadores de prática, não uma certificação. Para confirmar domínio, ainda é necessário explicar, implementar, testar e aplicar o conceito fora do exemplo visto.

### Caderno automático de erros

Respostas incorretas na recuperação inicial, nos quizzes, na revisão, no diagnóstico ou no próprio caderno são registradas automaticamente com pergunta, alternativas, escolha feita, resposta correta, explicação, capítulo e número de tentativas. Não é necessário cadastrar o erro manualmente.

Em **Central → Domínio → Caderno de erros**, escolha **Corrigir agora**, responda novamente e use **Consultar capítulo** quando precisar reconstruir a explicação. Um acerto resolve a pendência e permanece disponível na visualização **Corrigidos**; um novo erro mantém o item em **Pendentes** e permite outra tentativa. Acertar posteriormente a mesma questão em outra atividade também pode resolver o registro correspondente.

### Teste diagnóstico

O diagnóstico serve para escolher um ponto de partida ou reavaliar lacunas depois de um período de estudo. Antes de iniciar, selecione o curso completo ou uma fase. O curso completo distribui até 20 questões pelas fases; uma fase usa até 10 capítulos espaçados ao longo daquele trecho da trilha.

Cada resposta recebe correção imediata. Ao terminar, o painel mostra precisão, base demonstrada, conceitos que devem ser revisados primeiro e um capítulo sugerido. O diagnóstico atual fica salvo se a página for recarregada, e os 20 resultados concluídos mais recentes permanecem no backup. Encerrar antes do final descarta apenas o resultado agregado; as evidências das questões já respondidas continuam válidas.

O diagnóstico não marca capítulos como concluídos, não pula fundamentos automaticamente e não esconde conteúdo. Ele orienta, mas a decisão de onde estudar continua com o aluno.

### Prontidão para projetos

Em **Central → Domínio → Projetos**, cada mini-projeto ou projeto integrador mostra seus requisitos reais. Quando o capítulo possui links explícitos de pré-requisito, eles são usados; nos demais casos, o sistema seleciona os fundamentos não-projeto imediatamente anteriores.

A prontidão de cada requisito combina `65%` pela conclusão do capítulo e até `35%` pela média das evidências dos conceitos ligados a ele. O projeto aparece como preparado quando a média chega a pelo menos `70%` e todos os requisitos foram concluídos. A lista informa exatamente o que falta e permite abrir qualquer fundamento pendente.

A recomendação nunca é uma trava: **Abrir mesmo assim** mantém todos os projetos acessíveis. Ela existe para tornar explícito por que um projeto pode estar difícil e quais conhecimentos devem ser fortalecidos antes ou durante a implementação.

## Glossário contextual

Termos importantes aparecem destacados no texto dos capítulos. Ao selecionar um termo, o curso mostra uma definição curta e oferece um link para o capítulo em que o conceito é apresentado ou aprofundado.

A área **Central → Glossário** reúne os 111 conceitos em uma lista pesquisável. A pesquisa considera o nome, aliases, definição e capítulo relacionado. O glossário não modifica nem reduz o conteúdo original: ele acrescenta uma camada de consulta sobre o capítulo renderizado.

Para evitar poluição visual, cada conceito é destacado no máximo duas vezes por capítulo, com um limite geral de marcações na página. Blocos de código, links, títulos e controles interativos não são alterados.

## Limites do Java Lab

O Java Lab oferece um runner didático totalmente local para `System.out.print/println`, declarações de variáveis numéricas, `String`, operações aritméticas, concatenação e laços `for` simples. Ele foi pensado para experimentos rápidos de fundamentos sem conexão.

Recursos completos da linguagem — classes colaborando entre si, Collections, Streams, threads, bibliotecas, Maven, Spring e acesso a banco — exigem uma JVM real. O botão **Baixar `.java`** permite levar o rascunho ao JDK sem perder o trabalho.

Essa estrutura permite navegação dinâmica sem exigir framework, build ou instalação obrigatória.

## Validação do material

O script local `validate-course.js` não instala dependências nem altera arquivos. Ele verifica quantidade e ordem dos capítulos, correspondência entre catálogo e templates, IDs duplicados, pré-requisitos inexistentes, ligação dos scripts, inclusão no cache offline, versão do estado persistido, presença dos cinco mecanismos de aprendizagem e reaparecimento de trechos técnicos já corrigidos.

```bash
node validate-course.js
```

## Objetivo

A trilha foi construída para levar o estudante do primeiro programa Java até uma aplicação Spring persistente e, somente depois, introduzir testes avançados, segurança, containers, produção, Kafka e decisões arquiteturais.

O objetivo não é apenas terminar capítulos. É demonstrar domínio por meio de exercícios, projetos e capacidade de explicar as decisões tomadas.

O curso deve ser entendido como a espinha dorsal da formação. A profundidade final depende da quantidade e da qualidade da prática realizada fora da leitura: projetos executáveis, testes, investigação de falhas, documentação, revisão de código e operação de ambientes reais.
