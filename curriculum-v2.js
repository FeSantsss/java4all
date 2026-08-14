(() => {
  'use strict';

  const chapter = ({ id, title, technology, className = '', difficulty = 'Avançado', time = '2h', prerequisites = [], body }) => {
    const links = prerequisites.length
      ? prerequisites.map(item => `<a class="prereq-tag" href="#${item.id}">${item.title}</a>`).join(', ')
      : '<span class="prereq-none">nenhum</span>';
    return `<template id="template-${id}"><section class="section ${className}" id="${id}">
      <div class="section-head"><span class="section-num">+</span><h2 class="section-title">${title}</h2></div>
      <div class="topic-meta"><span class="tech-badge ${technology.className}">${technology.label}</span><div class="meta-item">Dificuldade: <b>${difficulty}</b></div><div class="time-est">⏱ <b>~${time}</b> de estudo e prática</div><div class="meta-item">Pré-requisitos: ${links}</div></div>
      ${body}
    </section></template>`;
  };

  const JAVA = { label: 'Java', className: 'tech-java' };
  const DB = { label: 'Banco de dados', className: 'tech-db' };
  const NOSQL = { label: 'NoSQL', className: 'tech-nosql' };
  const SPRING = { label: 'Spring', className: 'tech-spring' };
  const SECURITY = { label: 'Segurança', className: 'tech-security' };
  const DEVOPS = { label: 'Produção', className: 'tech-devops' };
  const KAFKA = { label: 'Kafka', className: 'tech-kafka' };
  const FRONT = { label: 'Front-end', className: 'tech-front' };

  const conceptFoundation = (title, introduction, items) => `<aside class="concept-foundation">
    <div class="concept-foundation-head"><span class="concept-level">base antes do aprofundamento</span><h3>${title}</h3></div>
    <p>${introduction}</p>
    <dl class="concept-grid">${items.map(([term, definition]) => `<div class="concept-card"><dt>${term}</dt><dd>${definition}</dd></div>`).join('')}</dl>
  </aside>`;

  const learningLayers = (items) => `<ol class="learning-layers">${items.map(([level, title, description]) => `<li><span>${level}</span><div><strong>${title}</strong><p>${description}</p></div></li>`).join('')}</ol>`;

  const additions = [
    {
      after: 'metodos-escopo', id: 'entrada-console', title: 'Entrada pelo console, parsing e validação', phaseId: 'fundamentals', phaseTitle: 'Fundamentos da linguagem',
      html: chapter({ id: 'entrada-console', title: 'Entrada pelo console, parsing e validação', technology: JAVA, className: 'tk-java', difficulty: 'Iniciante', time: '3h', prerequisites: [{ id: 'metodos-escopo', title: 'Métodos e escopo' }], body: `
      <p>Neste capítulo você começa com o menor programa interativo possível e o evolui em camadas. Primeiro leremos texto; depois entenderemos o caminho percorrido pelos caracteres; somente então entraremos em conversão, validação, término da entrada e valores monetários.</p>
      ${learningLayers([
        ['1', 'Fazer funcionar', 'Ler nome e idade como texto e imprimir uma resposta.'],
        ['2', 'Entender', 'Distinguir terminal, CLI, entrada, saída, linha e buffer.'],
        ['3', 'Tornar resistente', 'Converter, validar e repetir a pergunta sem encerrar o programa.'],
        ['4', 'Aprofundar', 'Tratar EOF, dinheiro, formatos regionais e propriedade de recursos.']
      ])}
      ${conceptFoundation('Antes do código: o que é um programa de console?', 'Estes nomes descrevem o ambiente no qual o programa conversa com a pessoa. Nenhum conhecimento de rede é necessário para começar.', [
        ['Terminal', 'A janela textual que mostra a saída do processo e encaminha a ele o que foi digitado.'],
        ['CLI', '<em>Command-line interface</em>, ou interface de linha de comando: uma interface controlada por texto, argumentos e comandos, em vez de botões. Um menu textual simples já é uma CLI.'],
        ['Entrada padrão', 'Canal de entrada do processo, representado em Java por <code>System.in</code>. No uso comum, recebe o que é digitado no terminal.'],
        ['Saída padrão', 'Canal normal de saída, representado por <code>System.out</code>. <code>System.err</code> é um canal separado para erros e diagnóstico.'],
        ['Fluxo de dados', 'Uma sequência de dados que chega ou sai ao longo do tempo. Aqui “fluxo” não é a API <code>Stream</code> de coleções.']
      ])}
      <h3>Camada 1 — seu primeiro uso de Scanner</h3>
      <p><code>Scanner</code> é uma classe da biblioteca padrão que ajuda a separar a entrada em linhas ou partes menores. O <code>import</code> informa ao compilador onde a classe está. <code>new Scanner(System.in)</code> cria um leitor ligado à entrada padrão, e <code>nextLine()</code> espera até receber uma linha terminada por Enter.</p>
      <pre class="code"><span class="kw">import</span> java.util.Scanner;

<span class="kw">public class</span> Saudacao {
    <span class="kw">public static void</span> main(String[] args) {
        Scanner scanner = <span class="kw">new</span> Scanner(System.in);

        System.out.print(<span class="str">"Qual é o seu nome? "</span>);
        String nome = scanner.nextLine();

        System.out.println(<span class="str">"Olá, "</span> + nome + <span class="str">"!"</span>);
    }
}</pre>
      <div class="callout"><b>Leia o programa de cima para baixo:</b> importar a classe → iniciar o programa → criar o leitor → mostrar a pergunta → aguardar uma linha → guardar a linha em <code>nome</code> → imprimir a resposta. Copie, compile e execute esta versão antes de continuar.</div>
      <h3>Camada 2 — linha, token e buffer</h3>
      <p>Ao pressionar Enter, os caracteres digitados e uma marca de fim de linha entram no canal. O <strong>buffer</strong> é uma pequena área temporária que guarda dados já recebidos, mas ainda não consumidos pelo programa. Uma <strong>linha</strong> termina nessa marca; um <strong>token</strong> é apenas uma parte separada normalmente por espaço.</p>
      <table class="cmp"><tr><th>Método</th><th>O que consome</th><th>Exemplo</th></tr><tr><td><code>nextLine()</code></td><td>o restante da linha, incluindo sua terminação</td><td><code>"Ana Maria"</code></td></tr><tr><td><code>next()</code></td><td>o próximo token</td><td><code>"Ana"</code></td></tr><tr><td><code>nextInt()</code></td><td>o próximo token interpretado como inteiro</td><td><code>21</code></td></tr></table>
      <p>Se <code>nextInt()</code> lê o número de <code>21⏎</code>, a marca de fim de linha pode continuar no buffer. O <code>nextLine()</code> seguinte encontra essa marca e devolve uma linha vazia. Para manter um único modelo mental, o curso adotará esta regra: <strong>leia sempre a linha inteira e depois converta o texto</strong>.</p>
      <h3>Camada 3 — ler, normalizar, converter e validar</h3>
      <p>Essas são quatro operações diferentes. <strong>Ler</strong> obtém texto. <strong>Normalizar</strong> remove apenas variações permitidas, como espaços externos com <code>strip()</code>. <strong>Parsing</strong> converte a representação textual para um tipo, como <code>int</code>. <strong>Validar</strong> verifica a regra do domínio: <code>"200"</code> é um inteiro válido, mas não uma idade humana aceita pelo programa.</p>
      <pre class="code">System.out.print(<span class="str">"Idade: "</span>);
String texto = scanner.nextLine().strip();
<span class="kw">int</span> idade = Integer.parseInt(texto);

<span class="kw">if</span> (idade &lt; 0 || idade &gt; 130) {
    System.out.println(<span class="str">"A idade deve estar entre 0 e 130."</span>);
}</pre>
      <p><code>Integer.parseInt</code> não consegue converter <code>"vinte"</code>. Nesse caso ele sinaliza uma <code>NumberFormatException</code>. Uma <strong>exceção</strong> é um objeto que representa uma interrupção do fluxo normal; <code>try</code> delimita a tentativa e <code>catch</code> escolhe como reagir àquele tipo de falha. O capítulo <a href="#excecoes">Exceções, try/catch e recursos</a> aprofundará propagação, hierarquia e criação de exceções.</p>
      <pre class="code"><span class="kw">static int</span> lerInteiro(Scanner scanner, String pergunta, <span class="kw">int</span> minimo, <span class="kw">int</span> maximo) {
    <span class="kw">while</span> (<span class="kw">true</span>) {
        System.out.print(pergunta);
        String texto = scanner.nextLine().strip();

        <span class="kw">try</span> {
            <span class="kw">int</span> valor = Integer.parseInt(texto);
            <span class="kw">if</span> (valor &gt;= minimo &amp;&amp; valor &lt;= maximo) {
                <span class="kw">return</span> valor;
            }
            System.out.printf(<span class="str">"Use um valor entre %d e %d.%n"</span>, minimo, maximo);
        } <span class="kw">catch</span> (NumberFormatException erro) {
            System.out.println(<span class="str">"Digite um número inteiro, como 18."</span>);
        }
    }
}</pre>
      <p>No <code>printf</code>, <code>%d</code> é substituído por um inteiro e <code>%n</code> produz a quebra de linha adequada ao sistema operacional. O laço repete somente a coleta; a regra de negócio pode continuar em outro método, sem conhecer teclado ou mensagens.</p>
      <h3>Camada 4 — quando a entrada termina</h3>
      <p><strong>EOF</strong> significa <em>end of file</em>, ou fim da entrada: não existe outra linha para ler. Isso pode acontecer ao redirecionar um arquivo ou quando a pessoa sinaliza o fim com <kbd>Ctrl</kbd>+<kbd>D</kbd> em Linux/macOS ou <kbd>Ctrl</kbd>+<kbd>Z</kbd> e Enter no Windows. <code>hasNextLine()</code> permite verificar antes de chamar <code>nextLine()</code>.</p>
      <pre class="code"><span class="kw">while</span> (scanner.hasNextLine()) {
    String comando = scanner.nextLine().strip();
    <span class="kw">if</span> (comando.equalsIgnoreCase(<span class="str">"sair"</span>)) <span class="kw">break</span>;
    System.out.println(<span class="str">"Recebido: "</span> + comando);
}
System.out.println(<span class="str">"Entrada encerrada."</span>);</pre>
      <p>EOF não é automaticamente um erro: em um programa que lê arquivo pela entrada padrão, é o encerramento esperado. Em um formulário interativo, pode significar que a operação ficou incompleta. O contrato do programa decide como reagir.</p>
      <h3>Aprofundamento — dinheiro e formato regional</h3>
      <p><code>double</code> representa números em formato binário e vários decimais comuns, como 0,1, não possuem representação exata. <code>BigDecimal</code> armazena um decimal com precisão controlada, por isso é apropriado quando centavos precisam ser exatos. Construa-o a partir do texto, nunca a partir de um <code>double</code> já aproximado.</p>
      <p><strong>Locale</strong> é o conjunto de convenções regionais de idioma e formatação. No Brasil, <code>123,45</code> é comum; em formatos técnicos, <code>123.45</code> é comum. O <strong>contrato de entrada</strong> deve declarar qual aceita. Não troque vírgulas e pontos indiscriminadamente, pois <code>1.234</code> pode significar um inteiro com milhar ou um decimal.</p>
      <pre class="code"><span class="kw">import</span> java.math.BigDecimal;
<span class="kw">import</span> java.math.RoundingMode;

<span class="kw">static</span> BigDecimal converterReais(String texto) {
    BigDecimal valor = <span class="kw">new</span> BigDecimal(texto.strip()); <span class="com">// contrato: 123.45</span>
    <span class="kw">if</span> (valor.signum() &lt;= 0) {
        <span class="kw">throw new</span> IllegalArgumentException(<span class="str">"O valor deve ser positivo."</span>);
    }
    <span class="kw">return</span> valor.setScale(2, RoundingMode.HALF_EVEN);
}</pre>
      <p><code>setScale(2, ...)</code> fixa duas casas decimais. <code>HALF_EVEN</code> é uma regra de arredondamento: no empate exato, escolhe o último dígito par, reduzindo viés em muitas operações. Em um sistema real, a regra deve vir do domínio, e erros de formato devem ser convertidos em mensagens úteis na fronteira da CLI.</p>
      <h3>Depois do Scanner: arquivos, sockets e protocolos</h3>
      ${conceptFoundation('Uma prévia, não um pré-requisito', 'Os conceitos abaixo não são usados no exercício. Eles explicam apenas por que uma API conveniente para teclado não é a resposta para toda fonte de dados.', [
        ['Arquivo', 'Uma sequência persistida de bytes. Arquivos grandes costumam ser processados aos poucos para não ocupar toda a memória.'],
        ['Socket', 'Uma extremidade de comunicação entre processos, normalmente através da rede. Ele entrega bytes; sozinho não diz onde termina uma mensagem.'],
        ['Protocolo', 'O acordo que dá significado aos bytes: formato, ordem das mensagens, limites, erros e encerramento. HTTP é um protocolo.'],
        ['API bufferizada', 'Leitor que agrupa acessos ao recurso em uma memória temporária, reduzindo operações pequenas e permitindo leitura eficiente.'],
        ['Recurso', 'Algo externo ao objeto Java, como arquivo, conexão ou socket, que possui ciclo de vida e geralmente precisa ser fechado.']
      ])}
      <p>Um <code>Scanner</code> é ótimo para exercícios e CLIs pequenas. Para texto de arquivo, você conhecerá <code>BufferedReader</code> em <a href="#java-io">Arquivos e Java I/O</a>. Para rede, HTTP e formato das mensagens, avance até <a href="#http">HTTP</a>. A regra de propriedade é: quem cria ou recebe responsabilidade explícita por um recurso decide quando fechá-lo. <code>System.in</code> pertence ao processo; código reutilizável de biblioteca não deve fechá-lo e surpreender o restante da aplicação.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório em quatro etapas — menu resistente a erros</h4><span class="exercise-tag m">médio</span></div><p>1) leia e repita um nome; 2) adicione um menu textual; 3) converta a opção e repita a pergunta quando ela for inválida; 4) acrescente depósito, saque, extrato, saída e término por EOF. Só depois troque os valores monetários por <code>BigDecimal</code>. Separe leitura, regra de negócio e impressão.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><ul><li>Cada etapa compila e funciona antes da próxima.</li><li>Entrada inválida produz orientação e permite nova tentativa, sem stack trace.</li><li>EOF encerra o programa conscientemente.</li><li>Dinheiro usa <code>BigDecimal</code> com formato de entrada documentado.</li><li>A opção de saída termina o laço explicitamente.</li><li>A classe da conta não conhece <code>Scanner</code> nem imprime mensagens.</li></ul></div></div>` })
    },
    {
      after: 'javamoderno', id: 'java-21-profundo', title: 'Java 21: records, sealed types, pattern matching e virtual threads', phaseId: 'core', phaseTitle: 'Java essencial',
      html: chapter({ id: 'java-21-profundo', title: 'Java 21: records, sealed types, pattern matching e virtual threads', technology: JAVA, className: 'tk-java', difficulty: 'Avançado', time: '3h', prerequisites: [{ id: 'javamoderno', title: 'Java moderno' }, { id: 'interfaces', title: 'Interfaces' }], body: `
      <p>Java 21 é uma versão LTS e reúne recursos que mudam a forma de modelar dados, representar hierarquias fechadas e escrever concorrência orientada a tarefas. O objetivo não é usar sintaxe nova por moda, mas tornar estados inválidos menos representáveis e o fluxo mais explícito.</p>
      ${conceptFoundation('Primeiro contato com os quatro recursos', 'Veja o problema que cada recurso resolve antes de estudar suas restrições e APIs avançadas.', [
        ['LTS', '<em>Long-Term Support</em>: versão para a qual fornecedores costumam oferecer manutenção prolongada. Não significa que toda funcionalidade experimental virou estável.'],
        ['Record', 'Forma compacta de declarar uma classe cujo foco é carregar um conjunto fixo de dados.'],
        ['Sealed type', 'Classe ou interface que declara quais tipos podem estendê-la ou implementá-la.'],
        ['Pattern matching', 'Sintaxe que testa o formato ou tipo de um valor e já disponibiliza suas partes para uso.'],
        ['Thread', 'Linha de execução de instruções. Uma aplicação pode ter várias tarefas progredindo concorrentemente.'],
        ['Virtual thread', 'Thread gerenciada pela JVM com custo baixo de criação, útil principalmente quando muitas tarefas passam tempo aguardando entrada e saída.']
      ])}
      <h3>Records como portadores de dados imutáveis</h3>
      <pre class="code"><span class="kw">public record</span> Dinheiro(BigDecimal valor, Currency moeda) {
    <span class="kw">public</span> Dinheiro {
        Objects.requireNonNull(valor);
        Objects.requireNonNull(moeda);
        <span class="kw">if</span> (valor.signum() &lt; 0) <span class="kw">throw new</span> IllegalArgumentException(<span class="str">"valor negativo"</span>);
        valor = valor.setScale(moeda.getDefaultFractionDigits(), RoundingMode.HALF_EVEN);
    }
}</pre>
      <p>Um record gera acessores, construtor canônico, <code>equals</code>, <code>hashCode</code> e <code>toString</code> a partir dos componentes. Isso não o torna profundamente imutável: se um componente referencia uma lista mutável, a mutabilidade continua existindo. Faça cópias defensivas no construtor.</p>
      <h3>Hierarquias seladas e pattern matching</h3>
      <pre class="code"><span class="kw">sealed interface</span> Pagamento <span class="kw">permits</span> Pix, Cartao, Boleto {}
<span class="kw">record</span> Pix(String chave) <span class="kw">implements</span> Pagamento {}
<span class="kw">record</span> Cartao(String token, <span class="kw">int</span> parcelas) <span class="kw">implements</span> Pagamento {}
<span class="kw">record</span> Boleto(LocalDate vencimento) <span class="kw">implements</span> Pagamento {}

<span class="kw">static</span> String descricao(Pagamento pagamento) {
    <span class="kw">return switch</span> (pagamento) {
        <span class="kw">case</span> Pix(String chave) -> <span class="str">"PIX "</span> + chave;
        <span class="kw">case</span> Cartao(<span class="kw">var</span> token, <span class="kw">var</span> parcelas) -> parcelas + <span class="str">"x"</span>;
        <span class="kw">case</span> Boleto(LocalDate vencimento) -> <span class="str">"vence em "</span> + vencimento;
    };
}</pre>
      <p>Como a hierarquia é fechada, o compilador verifica exaustividade. Quando um novo subtipo é permitido, pontos de decisão incompletos deixam de compilar. Use isso para resultados, comandos e estados finitos; não sele hierarquias que precisam ser extensíveis por plugins.</p>
      <h3>Virtual threads: primeiro o caso mínimo</h3>
      <pre class="code">Thread tarefa = Thread.startVirtualThread(() ->
    System.out.println(<span class="str">"Executando em outra thread"</span>)
);
tarefa.join(); <span class="com">// aguarda a tarefa terminar</span></pre>
      <p>Concorrência significa que tarefas podem progredir em períodos sobrepostos; não significa necessariamente executar no mesmo instante. <strong>I/O</strong>, ou entrada e saída, inclui esperar rede, arquivo e banco. Enquanto uma virtual thread espera I/O bloqueante, a JVM pode liberar a thread do sistema operacional que a executava para atender outra tarefa. O capítulo <a href="#threads">Threads e concorrência</a> constrói sincronização e visibilidade de memória; <a href="#concorrencia-profunda">Concorrência profunda</a> trata cancelamento, limites e medição.</p>
      <h3>Aprofundamento — executor, resultado, timeout e cancelamento</h3>
      <pre class="code"><span class="kw">try</span> (<span class="kw">var</span> executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List&lt;Future&lt;Resposta&gt;&gt; tarefas = ids.stream()
        .map(id -> executor.submit(() -> cliente.buscar(id)))
        .toList();
    <span class="kw">for</span> (<span class="kw">var</span> tarefa : tarefas) {
        <span class="kw">try</span> { processar(tarefa.get(2, TimeUnit.SECONDS)); }
        <span class="kw">catch</span> (TimeoutException e) { tarefa.cancel(<span class="kw">true</span>); }
    }
}</pre>
      <p><code>Executor</code> recebe tarefas; <code>Future</code> representa um resultado que pode chegar depois; timeout limita a espera e cancelamento solicita a interrupção. Virtual threads não tornam CPU mais rápida nem eliminam <strong>race conditions</strong> — resultados que dependem da ordem imprevisível de acessos compartilhados. Não crie um pool pequeno de virtual threads para limitar concorrência: limite o recurso escasso com <code>Semaphore</code>, pool de conexões ou rate limiter. Bloqueios longos dentro de <code>synchronized</code> e algumas chamadas nativas podem prender uma thread de plataforma; <strong>JFR</strong>, Java Flight Recorder, ajuda a observar esse comportamento.</p>
      <div class="warn"><b>Versões e previews:</b> o curso usa apenas recursos finalizados no Java 21 neste capítulo. Recursos preview exigem flags de compilação e execução e não devem aparecer silenciosamente em código de produção.</div>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — processador concorrente</h4><span class="exercise-tag d">difícil</span></div><p>Consuma 1.000 URLs simuladas com virtual threads. Adicione timeout, cancelamento, limite de 30 chamadas simultâneas por <code>Semaphore</code>, contagem de falhas e encerramento correto. Compare com um pool fixo e registre a metodologia, não apenas o tempo final.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>A solução deve sempre liberar o semáforo em <code>finally</code>, preservar interrupção, distinguir timeout de erro funcional e não criar um pool de virtual threads.</p></div></div>` })
    },
    {
      after: 'ordenacao-busca', id: 'algoritmos-praticos', title: 'Estruturas e algoritmos essenciais na prática', phaseId: 'algorithms', phaseTitle: 'Raciocínio algorítmico',
      html: chapter({ id: 'algoritmos-praticos', title: 'Estruturas e algoritmos essenciais na prática', technology: JAVA, className: 'tk-java', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'ordenacao-busca', title: 'Ordenação e busca' }, { id: 'colecoes', title: 'Coleções' }], body: `
      <p>Escolher uma estrutura é escolher quais operações serão baratas e quais custos serão aceitos. Analise tempo, memória, pior caso, custo amortizado, localidade de cache e características reais da entrada.</p>
      ${conceptFoundation('Como ler custos e estruturas', 'Comece pela operação que o problema repete. A estrutura ideal para buscar pode ser ruim para inserir, ordenar ou percorrer.', [
        ['O(1), O(log n), O(n)', 'Descrevem como o trabalho cresce com a entrada: constante, logarítmico ou linear. Não são tempos em segundos.'],
        ['Custo amortizado', 'Média garantida ao distribuir uma operação ocasionalmente cara por uma sequência de operações, como o crescimento interno de um ArrayList.'],
        ['Localidade de cache', 'Dados próximos na memória tendem a ser lidos de forma mais eficiente pelo processador. Duas estruturas com a mesma ordem assintótica podem ter desempenho real diferente.'],
        ['Grafo', 'Conjunto de vértices ligados por arestas. Cidades podem ser vértices; estradas, arestas.'],
        ['Peso', 'Custo associado a uma aresta, como distância ou tempo. Grafo não ponderado trata cada travessia com o mesmo custo.'],
        ['Benchmark', 'Experimento controlado para medir desempenho, com cenário, parâmetros, aquecimento e repetição documentados.']
      ])}
      <table class="cmp"><tr><th>Estrutura</th><th>Operações principais</th><th>Uso típico</th></tr><tr><td><code>ArrayList</code></td><td>índice O(1), inserir no meio O(n)</td><td>sequência e leitura</td></tr><tr><td><code>HashMap</code></td><td>busca/inserção O(1) em média</td><td>índice por chave</td></tr><tr><td><code>TreeMap</code></td><td>O(log n)</td><td>chaves ordenadas e consultas por faixa</td></tr><tr><td><code>ArrayDeque</code></td><td>extremos O(1) amortizado</td><td>fila e pilha</td></tr><tr><td><code>PriorityQueue</code></td><td>consultar mínimo O(1), inserir/remover O(log n)</td><td>agendamento e top-k</td></tr></table>
      <h3>Busca em grafos</h3>
      <pre class="code"><span class="kw">static</span> Set&lt;String&gt; bfs(Map&lt;String, List&lt;String&gt;&gt; grafo, String origem) {
    Set&lt;String&gt; visitados = <span class="kw">new</span> LinkedHashSet&lt;&gt;();
    Deque&lt;String&gt; fila = <span class="kw">new</span> ArrayDeque&lt;&gt;();
    fila.add(origem);
    <span class="kw">while</span> (!fila.isEmpty()) {
        String atual = fila.removeFirst();
        <span class="kw">if</span> (!visitados.add(atual)) <span class="kw">continue</span>;
        grafo.getOrDefault(atual, List.of()).stream()
            .filter(vizinho -> !visitados.contains(vizinho))
            .forEach(fila::addLast);
    }
    <span class="kw">return</span> visitados;
}</pre>
      <p><strong>BFS</strong> (<em>breadth-first search</em>, busca em largura) explora por camadas e encontra o menor número de arestas em grafos não ponderados. <strong>DFS</strong> (<em>depth-first search</em>, busca em profundidade) segue um caminho antes de voltar e é útil para componentes, ciclos e ordenação topológica. <strong>Dijkstra</strong> escolhe repetidamente o menor custo conhecido e resolve menores caminhos com pesos não negativos usando uma fila de prioridade. Para pesos negativos, essa escolha deixa de ser segura e outro algoritmo é necessário.</p>
      <h3>Padrões de resolução</h3>
      <ul><li><strong>Dois ponteiros:</strong> percorre uma sequência ordenada sem testar todos os pares.</li><li><strong>Janela deslizante:</strong> mantém estatísticas de um intervalo contíguo.</li><li><strong>Backtracking:</strong> explora escolhas e desfaz estado; poda caminhos impossíveis.</li><li><strong>Programação dinâmica:</strong> identifica subproblemas sobrepostos e reutiliza seus resultados.</li><li><strong>Union-find:</strong> mantém componentes disjuntos com compressão de caminho e união por rank.</li><li><strong>Top-k:</strong> usa heap de tamanho k em vez de ordenar toda a entrada.</li></ul>
      <h3>Benchmark sem autoengano</h3>
      <p><code>System.currentTimeMillis()</code> não é uma metodologia de microbenchmark. O <strong>JIT</strong> compila e otimiza código durante a execução; o <strong>GC</strong> recupera memória; ambos mudam uma medição curta. <strong>JMH</strong> é o Java Microbenchmark Harness, ferramenta que organiza aquecimento, repetição e consumo do resultado. Um <strong>fork</strong> executa o benchmark em um novo processo JVM para reduzir interferência de execuções anteriores. Registre distribuição, parâmetros e ambiente.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — rota de entregas</h4><span class="exercise-tag d">difícil</span></div><p>Modele cidades e estradas ponderadas. Implemente BFS, DFS, detecção de ciclo, ordenação topológica para dependências e Dijkstra para menor custo. Crie testes para grafo vazio, desconectado, ciclo e múltiplos caminhos com mesmo custo.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>Separe representação do algoritmo; rejeite pesos negativos em Dijkstra; retorne caminho e custo; documente complexidade em função de vértices e arestas.</p></div></div>` })
    },
    {
      after: 'postgres', id: 'postgres-concorrencia', title: 'PostgreSQL avançado: planos, MVCC, isolamento e locks', phaseId: 'web-data', phaseTitle: 'Web e banco antes do Spring',
      html: chapter({ id: 'postgres-concorrencia', title: 'PostgreSQL avançado: planos, MVCC, isolamento e locks', technology: DB, className: 'tk-db', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'postgres', title: 'PostgreSQL' }, { id: 'sql', title: 'SQL' }], body: `
      <p>Um banco relacional não é apenas armazenamento: ele coordena concorrência, aplica invariantes e escolhe planos físicos para consultas declarativas. Dominar PostgreSQL exige observar o que ocorre quando muitas transações disputam as mesmas linhas.</p>
      ${conceptFoundation('Vocabulário antes da disputa', 'A consulta SQL declara o resultado; o banco decide como obtê-lo e como isolar operações concorrentes.', [
        ['Invariante', 'Regra que precisa permanecer verdadeira, como saldo nunca negativo. Uma constraint permite ao próprio banco protegê-la.'],
        ['Plano de execução', 'Estratégia física escolhida pelo banco: quais índices ler, em que ordem unir tabelas e onde ordenar.'],
        ['MVCC', '<em>Multi-Version Concurrency Control</em>: mantém versões de linhas para criar visões consistentes e reduzir bloqueio entre leitura e escrita.'],
        ['Snapshot', 'Visão das versões de dados que uma operação pode enxergar em determinado momento lógico.'],
        ['Lock', 'Reserva que restringe operações concorrentes sobre um recurso.'],
        ['Deadlock', 'Ciclo de espera: cada transação segura algo de que a outra precisa; o banco aborta uma para romper o ciclo.']
      ])}
      <h3>Modelagem e constraints primeiro</h3>
      <pre class="code"><span class="kw">CREATE TABLE</span> conta (
    id <span class="kw">bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY</span>,
    saldo <span class="kw">numeric</span>(19,2) <span class="kw">NOT NULL CHECK</span> (saldo &gt;= 0),
    versao <span class="kw">bigint NOT NULL DEFAULT</span> 0
);

<span class="kw">CREATE UNIQUE INDEX</span> uq_usuario_email_normalizado
    <span class="kw">ON</span> usuario (lower(email));</pre>
      <p>Constraints protegem o dado contra qualquer cliente, não somente contra a aplicação atual. Normalize para evitar dependências e anomalias; desnormalize quando uma medição justificar e documente como a duplicação ficará consistente.</p>
      <h3>MVCC e níveis de isolamento</h3>
      <p>O PostgreSQL mantém versões de linhas para que leitores e escritores interfiram menos. <code>READ COMMITTED</code> cria um novo snapshot por comando; <code>REPEATABLE READ</code> mantém uma visão estável na transação; <code>SERIALIZABLE</code> detecta execuções que não podem equivaler a alguma ordem serial e pode abortar uma delas. Uma aplicação correta precisa saber repetir a transação inteira quando recebe uma falha de serialização.</p>
      <pre class="code"><span class="kw">BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE</span>;
<span class="kw">SELECT</span> saldo <span class="kw">FROM</span> conta <span class="kw">WHERE</span> id = 10 <span class="kw">FOR UPDATE</span>;
<span class="kw">UPDATE</span> conta <span class="kw">SET</span> saldo = saldo - 50 <span class="kw">WHERE</span> id = 10;
<span class="kw">UPDATE</span> conta <span class="kw">SET</span> saldo = saldo + 50 <span class="kw">WHERE</span> id = 20;
<span class="kw">COMMIT</span>;</pre>
      <p>Adquira locks de múltiplas contas sempre na mesma ordem para reduzir deadlocks. Um deadlock ainda pode ocorrer; trate a exceção e repita com limite. <strong>Jitter</strong> é uma pequena variação aleatória no tempo de espera, usada para evitar que todos repitam juntos. Não mantenha uma transação aberta durante chamadas HTTP ou interação humana.</p>
      <h3>Planos de execução</h3>
      <pre class="code"><span class="kw">EXPLAIN (ANALYZE, BUFFERS, VERBOSE)</span>
<span class="kw">SELECT</span> p.id, <span class="kw">sum</span>(i.quantidade * i.preco)
<span class="kw">FROM</span> pedido p <span class="kw">JOIN</span> item_pedido i <span class="kw">ON</span> i.pedido_id = p.id
<span class="kw">WHERE</span> p.criado_em &gt;= current_date - interval <span class="str">'30 days'</span>
<span class="kw">GROUP BY</span> p.id;</pre>
      <p><code>ANALYZE</code> executa a consulta: não o use despreocupadamente em comandos mutáveis. Compare linhas estimadas e reais, buffers lidos, tipo de join e ordenações em disco. Um índice tem custo de escrita e só ajuda quando combina com filtros, ordem, seletividade e estatísticas.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — reserva sem venda dupla</h4><span class="exercise-tag d">difícil</span></div><p>Implemente reserva concorrente de estoque por atualização condicional: decremente somente se a quantidade for suficiente e valide o número de linhas alteradas. Compare com <code>SELECT FOR UPDATE</code> e optimistic locking.</p><button class="reveal-btn">Ver solução-base</button><div class="solution"><pre class="code"><span class="kw">UPDATE</span> produto
<span class="kw">SET</span> estoque = estoque - :qtd, versao = versao + 1
<span class="kw">WHERE</span> id = :id <span class="kw">AND</span> estoque &gt;= :qtd;</pre><p>Zero linhas alteradas significa estoque insuficiente ou disputa perdida. Não faça primeiro um <code>SELECT</code> desprotegido e depois um <code>UPDATE</code>.</p></div></div>` })
    },
    {
      after: 'spring-core', id: 'spring-boot-fundamentos', title: 'Spring Boot por dentro: bootstrap, auto-configuração e configuração tipada', phaseId: 'spring', phaseTitle: 'Spring: primeira API completa',
      html: chapter({ id: 'spring-boot-fundamentos', title: 'Spring Boot por dentro: bootstrap, auto-configuração e configuração tipada', technology: SPRING, className: 'tk-spring', difficulty: 'Intermediário', time: '3h', prerequisites: [{ id: 'spring-core', title: 'Spring Core' }, { id: 'build', title: 'Maven e Gradle' }], body: `
      <p>Spring Framework fornece o contêiner e os módulos; Spring Boot fornece convenções, auto-configuração, starters, servidor embutido, configuração externa e ferramentas operacionais para iniciar uma aplicação coerente rapidamente.</p>
      ${conceptFoundation('O que acontece quando a aplicação inicia', 'Antes das anotações, conecte cada termo a uma etapa simples do início da aplicação.', [
        ['Bootstrap', 'Sequência que cria e prepara a aplicação: lê configuração, monta o contexto e inicia o servidor.'],
        ['Bean', 'Objeto criado e administrado pelo contêiner Spring.'],
        ['Component scanning', 'Busca classes marcadas como componentes nos pacotes configurados para registrá-las como beans.'],
        ['Starter', 'Dependência agregadora que traz um conjunto coerente de bibliotecas para uma capacidade, como web ou validação.'],
        ['Auto-configuração', 'Configuração padrão ativada somente quando condições de classes, propriedades e beans são satisfeitas.'],
        ['Servidor embutido', 'Servidor HTTP empacotado com a aplicação, iniciado pelo próprio processo em vez de receber um WAR externo.']
      ])}
      <pre class="code"><span class="annotation">@SpringBootApplication</span>
<span class="annotation">@ConfigurationPropertiesScan</span>
<span class="kw">public class</span> Aplicacao {
    <span class="kw">public static void</span> main(String[] args) {
        SpringApplication.run(Aplicacao.class, args);
    }
}</pre>
      <p><code>@SpringBootApplication</code> combina configuração, component scanning e habilitação da auto-configuração. As auto-configurações são condicionais: observam classes presentes, propriedades e beans já definidos. Declarar seu próprio bean costuma fazer a configuração padrão recuar, mas isso precisa ser verificado com o relatório de condições e testes.</p>
      <h3>Configuração tipada</h3>
      <pre class="code"><span class="annotation">@ConfigurationProperties</span>(<span class="str">"pagamentos"</span>)
<span class="kw">public record</span> PagamentoProperties(
    <span class="annotation">@NotBlank</span> String baseUrl,
    <span class="annotation">@DurationMin</span>(millis = 100) Duration timeout,
    <span class="annotation">@Min</span>(1) <span class="kw">int</span> tentativas) {}</pre>
      <pre class="code">pagamentos:
  base-url: \${PAGAMENTOS_BASE_URL}
  timeout: 2s
  tentativas: 3</pre>
      <p><strong>Configuração externa</strong> mantém valores que variam por ambiente fora do código. O <code>@ConfigurationProperties</code> agrupa esses valores em um tipo Java; as anotações de validação impedem a aplicação de iniciar com configuração inválida. Prefira isso a espalhar <code>@Value</code>. Nunca forneça segredo real como padrão. <strong>Profiles</strong> ativam conjuntos nomeados de configuração e devem representar diferenças legítimas de ambiente, não combinações incontáveis de comportamento.</p>
      <h3>Starters e versões</h3>
      <p>Use o BOM/dependency management da versão de Spring Boot adotada e evite fixar versões individuais de bibliotecas gerenciadas sem motivo. O curso assume <strong>Java 21</strong>; a versão exata do Spring Boot deve estar registrada no projeto e no README, porque compatibilidade de springdoc, Testcontainers e plugins depende dela.</p>
      <div class="warn"><b>JSON e ObjectMapper:</b> Jackson é a biblioteca que o Boot normalmente usa para converter objetos Java e JSON; <code>ObjectMapper</code> é seu objeto central de configuração e conversão. Declarar um <code>new ObjectMapper()</code> isolado pode perder módulos e customizações do Boot. Prefira customizadores, módulos Jackson como beans ou injete o mapper auto-configurado.</div>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — explique o bootstrap</h4><span class="exercise-tag m">médio</span></div><p>Crie uma API pelo Initializr com Web, Validation e Actuator. Rode com <code>--debug</code>, encontre a auto-configuração do servidor, sobrescreva uma propriedade tipada e escreva um teste que falha quando a configuração é inválida.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>O relatório deve distinguir condições positivas e negativas; a aplicação não deve acessar variável de ambiente diretamente dentro da regra de negócio.</p></div></div>` })
    },
    {
      after: 'spring-jpa', id: 'jpa-transacoes', title: 'JPA profundo e transações Spring', phaseId: 'spring', phaseTitle: 'Spring: primeira API completa',
      html: chapter({ id: 'jpa-transacoes', title: 'JPA profundo e transações Spring', technology: SPRING, className: 'tk-spring', difficulty: 'Avançado', time: '6h', prerequisites: [{ id: 'spring-jpa', title: 'Spring Data JPA' }, { id: 'postgres-concorrencia', title: 'Concorrência no PostgreSQL' }], body: `
      <p>JPA mantém uma unidade de trabalho chamada persistence context. Dentro dela, cada identidade de banco corresponde a uma instância gerenciada; alterações nessa instância podem ser detectadas e sincronizadas no <code>flush</code>. Entender esse ciclo evita SQL inesperado, entidades desatualizadas e transações gigantes.</p>
      ${conceptFoundation('O mapa mínimo entre objetos e banco', 'JPA não é o banco e uma entidade não é apenas uma linha. Estes termos explicam quem acompanha as mudanças e quando elas viram SQL.', [
        ['JPA', 'Especificação Java de persistência objeto-relacional. Hibernate é uma implementação comum dessa especificação.'],
        ['Entidade', 'Objeto persistente com identidade própria, normalmente mapeado a uma tabela.'],
        ['Persistence context', 'Conjunto de entidades que o EntityManager acompanha durante uma unidade de trabalho.'],
        ['Dirty checking', 'Detecção automática de alterações em entidades gerenciadas.'],
        ['Flush', 'Sincronização das mudanças pendentes com SQL; não confirma a transação por si só.'],
        ['Commit', 'Confirma a transação como unidade; rollback descarta seus efeitos ainda não confirmados.']
      ])}
      <table class="cmp"><tr><th>Estado</th><th>Significado</th></tr><tr><td>transient</td><td>objeto novo, ainda não associado ao contexto</td></tr><tr><td>managed</td><td>rastreado; mudanças participam de dirty checking</td></tr><tr><td>detached</td><td>já teve identidade persistente, mas não é mais rastreado</td></tr><tr><td>removed</td><td>marcado para remoção no flush</td></tr></table>
      <pre class="code"><span class="annotation">@Transactional</span>
<span class="kw">public</span> Pedido confirmar(Long id, Long versaoEsperada) {
    Pedido pedido = repositorio.findById(id).orElseThrow(PedidoNaoEncontrado::new);
    pedido.confirmar(); <span class="com">// dirty checking: não precisa chamar save em entidade já gerenciada</span>
    <span class="kw">return</span> pedido;
}</pre>
      <h3>Flush não é commit</h3>
      <p><code>flush</code> sincroniza alterações pendentes com o banco para executar SQL e verificar parte das constraints; a transação ainda pode sofrer rollback. O commit encerra a unidade atômica. Uma consulta pode provocar flush automático antes de ser executada.</p>
      <h3>Propagação, isolamento e rollback</h3>
      <p><code>REQUIRED</code> participa da transação existente ou cria uma. <code>REQUIRES_NEW</code> suspende a atual e cria outra; use raramente, pois o efeito interno pode ser confirmado mesmo quando a operação externa falha. <code>NESTED</code> depende de savepoints e do gerenciador. Isolamento é uma propriedade do banco, não um substituto para invariantes.</p>
      <pre class="code"><span class="annotation">@Transactional</span>(
    isolation = Isolation.READ_COMMITTED,
    timeout = 5,
    rollbackFor = FalhaIntegracao.class)
<span class="kw">public void</span> transferir(Long origem, Long destino, BigDecimal valor) { ... }</pre>
      <p>Por padrão, o modelo declarativo tradicional faz rollback automático para exceções não verificadas; checked exceptions precisam de regra explícita quando representam falha atômica. <code>readOnly=true</code> é uma dica de otimização, não uma barreira universal contra escrita.</p>
      <h3>O limite do proxy</h3>
      <p><code>@Transactional</code> normalmente é aplicado por <strong>proxy</strong>: um objeto intermediário criado pelo Spring intercepta a chamada, abre a transação, chama o serviço e confirma ou reverte. Uma chamada de um método para outro no mesmo objeto não atravessa esse intermediário; métodos privados também não formam bons limites declarativos. Coloque a transação em um serviço público orientado ao caso de uso e mantenha chamadas lentas de rede fora dela.</p>
      <h3>Relacionamentos e igualdade</h3>
      <ul><li>Use <code>cascade</code> somente quando o ciclo de vida realmente pertence ao agregado.</li><li><code>orphanRemoval</code> expressa propriedade forte e remove filhos retirados da coleção.</li><li>Evite incluir associações lazy em <code>toString</code>, <code>equals</code> e serialização.</li><li>Uma implementação ingênua baseada apenas em ID gerado falha enquanto o ID é nulo. Defina igualdade conforme a identidade do domínio e teste entidades antes e depois da persistência.</li><li>Use <code>@Version</code> para optimistic locking e trate conflito como resultado esperado.</li></ul>
      <pre class="code"><span class="annotation">@Version</span>
<span class="kw">private long</span> versao;</pre>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — empréstimo concorrente</h4><span class="exercise-tag d">difícil</span></div><p>Escreva um teste com duas transações tentando emprestar o mesmo exemplar. Implemente uma versão com optimistic locking e outra com lock pessimista. Verifique que exatamente uma vence e que a outra recebe conflito traduzido para HTTP 409.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>O teste deve usar duas transações reais e sincronizar o ponto de disputa; um teste sequencial não comprova concorrência. Registre o trade-off entre contenção pessimista e repetição otimista.</p></div></div>` })
    },
    {
      after: 'paginacao-swagger', id: 'api-design-avancado', title: 'Contratos HTTP: idempotência, concorrência e evolução de APIs', phaseId: 'spring', phaseTitle: 'Spring: primeira API completa',
      html: chapter({ id: 'api-design-avancado', title: 'Contratos HTTP: idempotência, concorrência e evolução de APIs', technology: SPRING, className: 'tk-spring', difficulty: 'Avançado', time: '4h', prerequisites: [{ id: 'spring-mvc', title: 'Spring MVC' }, { id: 'validacao-erros', title: 'Validação e erros' }], body: `
      <p>Uma API é um contrato público: método, URI, headers, status, corpo e semântica de repetição formam uma unidade. Uma resposta válida não é apenas JSON que o cliente conseguiu desserializar.</p>
      ${conceptFoundation('A requisição como contrato completo', 'Comece identificando as peças visíveis pelo cliente; depois acrescente garantias de repetição e concorrência.', [
        ['Método e URI', 'O método expressa a intenção HTTP; a URI identifica o recurso sobre o qual ela atua.'],
        ['Header', 'Metadado da mensagem, como tipo do conteúdo, autenticação ou condição de versão.'],
        ['Status', 'Código que resume o resultado HTTP; clientes não deveriam deduzi-lo lendo uma frase.'],
        ['Idempotência', 'Propriedade em que repetir a mesma intenção não produz efeitos adicionais indevidos.'],
        ['ETag', 'Identificador da versão de uma representação; com If-Match permite rejeitar atualização baseada em versão antiga.'],
        ['Correlation ID', 'Identificador seguro para localizar a mesma operação em logs e serviços, sem expor detalhes internos.']
      ])}
      <table class="cmp"><tr><th>Operação</th><th>Resposta típica</th><th>Detalhe</th></tr><tr><td>criar</td><td>201</td><td>inclua <code>Location</code> do novo recurso</td></tr><tr><td>substituir</td><td>200/204</td><td><code>PUT</code> deve ser idempotente</td></tr><tr><td>alterar parcialmente</td><td>200/204</td><td>defina semântica de PATCH e campos ausentes</td></tr><tr><td>conflito</td><td>409</td><td>invariante, versão ou idempotency key conflitante</td></tr><tr><td>pré-condição</td><td>412</td><td><code>If-Match</code>/<code>ETag</code> não corresponde</td></tr><tr><td>assíncrono</td><td>202</td><td>ofereça recurso para consultar estado</td></tr></table>
      <h3>Problem Details</h3>
      <pre class="code"><span class="annotation">@ExceptionHandler</span>(SaldoInsuficienteException.class)
ProblemDetail saldoInsuficiente(SaldoInsuficienteException e) {
    ProblemDetail problema = ProblemDetail.forStatus(HttpStatus.CONFLICT);
    problema.setTitle(<span class="str">"Saldo insuficiente"</span>);
    problema.setDetail(e.getMessage());
    problema.setProperty(<span class="str">"codigo"</span>, <span class="str">"conta.saldo-insuficiente"</span>);
    <span class="kw">return</span> problema;
}</pre>
      <p>Nunca devolva stack trace, nome de tabela ou segredo. Forneça um código estável legível por máquina, detalhes seguros e um correlation ID. Erros de validação precisam indicar campo e regra sem ecoar dados sensíveis.</p>
      <h3>Idempotência e concorrência otimista HTTP</h3>
      <p>Para criação ou pagamento sujeito a <strong>retry</strong> — nova tentativa após falha ou resposta perdida — aceite <code>Idempotency-Key</code>. Persista chave, escopo, <strong>hash</strong> da requisição (resumo determinístico usado para comparar o conteúdo) e resposta na mesma transação da operação. Repetir a mesma intenção devolve o resultado original; reutilizar a chave com outro corpo é conflito.</p>
      <pre class="code">ETag: "pedido-42-v7"
If-Match: "pedido-42-v7"

<span class="com">// se a versão atual for 8: 412 Precondition Failed</span></pre>
      <h3>Paginação e evolução</h3>
      <p>Na paginação por <strong>offset</strong>, o cliente pede para pular N linhas; é simples, mas fica caro e pode duplicar ou omitir itens se houver alterações. Na paginação por <strong>keyset/cursor</strong>, o cliente envia uma posição opaca derivada da última chave ordenada, como data e ID; a próxima consulta continua dali. Limite o tamanho no servidor e imponha ordem estável com desempate por ID. Mudanças aditivas costumam ser compatíveis, desde que clientes ignorem campos desconhecidos. Mudanças de significado exigem versão, transição e política de depreciação.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — endpoint de pagamento repetível</h4><span class="exercise-tag d">difícil</span></div><p>Desenhe e implemente <code>POST /pagamentos</code> com idempotency key, Problem Details, 201 + Location e teste para duas requisições concorrentes com a mesma chave.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>Uma constraint única deve decidir a disputa. Não confie em um <code>if</code> em memória; ele falha com múltiplas threads ou instâncias.</p></div></div>` })
    },
    {
      after: 'spring-security', id: 'security-oidc', title: 'OAuth 2.0, OpenID Connect e Resource Server seguros', phaseId: 'security', phaseTitle: 'Segurança da API',
      html: chapter({ id: 'security-oidc', title: 'OAuth 2.0, OpenID Connect e Resource Server seguros', technology: SECURITY, className: 'tk-security', difficulty: 'Avançado', time: '6h', prerequisites: [{ id: 'spring-security', title: 'Spring Security' }, { id: 'http', title: 'HTTP' }], body: `
      <p>OAuth 2.0 delega autorização; OpenID Connect acrescenta autenticação e identidade. Um access token autoriza uma API, um ID token descreve a autenticação ao cliente e um refresh token permite obter novos tokens. Trocar esses papéis abre vulnerabilidades.</p>
      ${conceptFoundation('Quem é quem no fluxo de identidade', 'Não decore siglas antes de identificar os participantes e o propósito de cada artefato.', [
        ['Pessoa/Resource Owner', 'Dona dos dados que autoriza determinado acesso.'],
        ['Client', 'Aplicação que solicita autorização; pode ser navegador, app móvel ou backend.'],
        ['Authorization Server', 'Sistema que autentica, obtém consentimento e emite tokens. Também é chamado de provedor de identidade em cenários OIDC.'],
        ['Resource Server', 'API que protege recursos e valida o access token antes de atender.'],
        ['OAuth 2.0', 'Framework de autorização delegada: permite conceder acesso limitado sem entregar a senha ao cliente.'],
        ['OpenID Connect (OIDC)', 'Camada de identidade sobre OAuth 2.0 que padroniza autenticação do usuário e ID token.']
      ])}
      <h3>Authorization Code com PKCE</h3>
      <ol><li>O cliente cria <code>code_verifier</code>, deriva o challenge e redireciona o usuário ao authorization server.</li><li>Após autenticação e consentimento, recebe um código curto.</li><li>Troca código e verifier por tokens diretamente no endpoint seguro.</li><li>A API valida assinatura, algoritmo permitido, issuer, audience, expiração e escopos.</li></ol>
      <p><strong>PKCE</strong> (<em>Proof Key for Code Exchange</em>) faz o cliente criar um segredo temporário para cada tentativa de login. O servidor recebe primeiro um derivado e exige o valor original na troca; assim, um código de autorização interceptado não basta. O navegador não deve receber <em>client secret</em> permanente embutido.</p>
      <h3>Proteções do navegador usadas no exemplo</h3>
      ${conceptFoundation('Quatro mecanismos que não são equivalentes', 'O código abaixo menciona CSRF e CORS; conheça seu papel antes de interpretar por que uma proteção pode ou não ser desativada.', [
        ['Cookie HttpOnly', 'Cookie inacessível ao JavaScript da página, embora ainda seja enviado automaticamente pelo navegador.'],
        ['CSRF', '<em>Cross-Site Request Forgery</em>: outra página induz o navegador autenticado a enviar uma ação não desejada.'],
        ['CORS', '<em>Cross-Origin Resource Sharing</em>: política do navegador que controla quais origens podem ler respostas; não autentica o chamador.'],
        ['XSS', '<em>Cross-Site Scripting</em>: execução de JavaScript não confiável na origem da aplicação.'],
        ['CSP', '<em>Content Security Policy</em>: política que restringe de onde scripts e outros recursos podem ser carregados.']
      ])}
      <pre class="code"><span class="annotation">@Bean</span>
SecurityFilterChain api(HttpSecurity http) <span class="kw">throws</span> Exception {
    <span class="kw">return</span> http
        .csrf(csrf -> csrf.disable()) <span class="com">// somente para API Bearer stateless; não copie para autenticação por cookie</span>
        .cors(Customizer.withDefaults())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(<span class="str">"/actuator/health"</span>).permitAll()
            .requestMatchers(HttpMethod.POST, <span class="str">"/pedidos/**"</span>).hasAuthority(<span class="str">"SCOPE_pedidos:write"</span>)
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
        .build();
}</pre>
      <p>O <strong>issuer</strong> identifica quem emitiu o token; a <strong>audience</strong> identifica para qual API ele foi criado. <strong>JWK Set</strong> é o conjunto publicado de chaves com que a API verifica assinaturas, inclusive durante rotação. Uma <strong>allowlist</strong> é a lista explícita de algoritmos aceitos. Rejeite token de outro emissor, destinado a outra API ou assinado por algoritmo não autorizado.</p>
      <h3>Cookies e tokens mudam o risco</h3>
      <p>Cookies <code>HttpOnly</code> reduzem roubo por JavaScript, mas são enviados automaticamente e portanto exigem proteção CSRF. Tokens no <code>localStorage</code> não são enviados automaticamente, porém ficam acessíveis a XSS. Não existe armazenamento mágico: reduza XSS com escaping, CSP e dependências auditadas; use cookies <code>Secure</code>, <code>SameSite</code> e CSRF conforme a arquitetura.</p>
      <p>CORS não autentica ninguém. O wildcard de origem não pode ser combinado com credenciais pelo navegador. Como o preflight ocorre antes da autenticação, CORS deve ser processado antes da cadeia de segurança e configurado por origens explícitas.</p>
      <h3>Ameaças que o capítulo básico não cobre sozinho</h3>
      <ul><li><strong>SSRF — Server-Side Request Forgery:</strong> entrada controlada pelo atacante faz o servidor acessar destinos indevidos; restrinja endereços, protocolos, DNS e redirecionamentos.</li><li><strong>Mass assignment:</strong> vinculação automática aceita campos que o cliente não deveria controlar; use DTOs com allowlist.</li><li><strong>Broken access control:</strong> autorização ausente ou incompleta; confira propriedade e escopo do recurso, não apenas papel global.</li><li><strong>Session fixation:</strong> atacante tenta fazer a vítima usar uma sessão já conhecida; rotacione o identificador ao autenticar e defina logout/revogação.</li><li><strong>PII — informação pessoal identificável:</strong> dados capazes de identificar uma pessoa; não registre tokens, senhas nem requisições inteiras.</li><li><strong>Supply chain:</strong> risco herdado de dependências, plugins e processo de build; inventarie componentes e priorize vulnerabilidades realmente alcançáveis.</li></ul>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — matriz de autorização</h4><span class="exercise-tag d">difícil</span></div><p>Crie testes para endpoint público, token ausente, expirado, issuer errado, audience errada, escopo insuficiente, dono correto e usuário tentando acessar recurso alheio.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>Inclua testes em nível HTTP e em método. Habilite method security explicitamente quando usar <code>@PreAuthorize</code>. Cada negação deve retornar 401 ou 403 conforme o caso, sem revelar a existência de recurso sensível.</p></div></div>` })
    },
    {
      after: 'testcontainers', id: 'estrategia-testes', title: 'Estratégia de testes: slices, contratos, concorrência e qualidade', phaseId: 'integration-testing', phaseTitle: 'Testes de integração reais',
      html: chapter({ id: 'estrategia-testes', title: 'Estratégia de testes: slices, contratos, concorrência e qualidade', technology: SPRING, className: 'tk-spring', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'testcontainers', title: 'Testcontainers' }, { id: 'mockito', title: 'Mockito' }], body: `
      <p>Uma suíte útil oferece feedback rápido e confiança proporcional ao risco. Testes unitários isolam regras; slices verificam uma camada com infraestrutura reduzida; integração verifica fronteiras reais; end-to-end cobre poucos fluxos críticos. Nenhuma única categoria substitui as outras.</p>
      ${conceptFoundation('Da unidade à jornada completa', 'O tamanho de um teste é definido pelo que ele integra, não pelo número de linhas do método.', [
        ['Unitário', 'Verifica uma unidade de comportamento com dependências simples ou substituídas; deve localizar falhas rapidamente.'],
        ['Slice', 'Carrega uma fatia do Spring, como MVC ou JPA, evitando o contexto completo.'],
        ['Integração', 'Verifica a colaboração com fronteiras reais relevantes, como PostgreSQL ou Kafka.'],
        ['Contrato', 'Verifica que consumidor e provedor concordam sobre mensagens, campos e semântica.'],
        ['End-to-end (E2E)', 'Exercita uma jornada por várias camadas do sistema; é valioso, porém mais lento e difícil de diagnosticar.'],
        ['Mutation testing', 'Altera deliberadamente o código e verifica se os testes detectam a mudança; mutante sobrevivente revela uma asserção fraca ou ausência de cenário.']
      ])}
      <table class="cmp"><tr><th>Ferramenta</th><th>Escopo</th></tr><tr><td>JUnit + AssertJ</td><td>regra pura, exemplos e testes parametrizados</td></tr><tr><td><code>@WebMvcTest</code></td><td>contrato MVC, JSON, validation e security web</td></tr><tr><td><code>@DataJpaTest</code></td><td>mapeamento, queries, constraints e locks</td></tr><tr><td><code>@SpringBootTest</code></td><td>integração ampla; use quando precisa do contexto completo</td></tr><tr><td>Testcontainers</td><td>serviço real descartável, não isolamento automático dos dados</td></tr></table>
      <pre class="code"><span class="annotation">@WebMvcTest</span>(PedidoController.class)
<span class="kw">class</span> PedidoControllerTest {
    <span class="annotation">@Autowired</span> MockMvc mvc;
    <span class="annotation">@MockitoBean</span> CriarPedido casoDeUso;

    <span class="annotation">@Test</span> <span class="kw">void</span> rejeitaQuantidadeInvalida() <span class="kw">throws</span> Exception {
        mvc.perform(post(<span class="str">"/pedidos"</span>).contentType(APPLICATION_JSON)
            .content(<span class="str">"{\"produtoId\":1,\"quantidade\":0}"</span>))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath(<span class="str">"$.status"</span>).value(400));
    }
}</pre>
      <p>Em versões atuais do Spring Boot, prefira <code>@MockitoBean</code> ao antigo <code>@MockBean</code>. Para Testcontainers integrado ao Boot, <code>@ServiceConnection</code> reduz configuração manual. Um container estático pode ser compartilhado pela classe; limpe dados, use rollback ou bancos/schemas exclusivos quando os testes exigirem isolamento.</p>
      <h3>Assíncrono, contratos e mutação</h3>
      <p>Não use <code>Thread.sleep</code> como sincronização. Espere uma condição observável com timeout. Testes de contrato verificam compatibilidade entre consumidor e provedor; testes de migration partem da versão anterior do schema; mutation testing revela testes que executam código sem realmente distinguir comportamento.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — pirâmide de confiança</h4><span class="exercise-tag d">difícil</span></div><p>Para o fluxo criar pedido, escreva testes de domínio, MVC, repository com PostgreSQL real, migration e evento Kafka. Introduza propositalmente uma duplicata e comprove a idempotência.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>A suíte deve ser repetível em qualquer ordem, não depender de portas fixas, ter timeouts explícitos e produzir diagnóstico útil quando falhar.</p></div></div>` })
    },
    {
      after: 'actuator', id: 'observabilidade-pratica', title: 'Observabilidade com logs, métricas, traces e SLOs', phaseId: 'spring-advanced', phaseTitle: 'Spring avançado',
      html: chapter({ id: 'observabilidade-pratica', title: 'Observabilidade com logs, métricas, traces e SLOs', technology: DEVOPS, className: 'tk-devops', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'actuator', title: 'Actuator' }, { id: 'logging', title: 'Logging' }], body: `
      <p>Observabilidade é a capacidade de investigar o estado interno por sinais externos. Actuator expõe pontos de integração; ainda é necessário produzir, exportar, armazenar, correlacionar e consultar logs, métricas e traces.</p>
      ${conceptFoundation('Os três sinais antes das ferramentas', 'Comece pela pergunta operacional; escolha o sinal que melhor a responde e correlacione-os quando necessário.', [
        ['Log', 'Registro discreto de um acontecimento com contexto, como uma recusa de pagamento.'],
        ['Métrica', 'Série numérica agregável ao longo do tempo, boa para taxa, erro, duração e saturação.'],
        ['Trace', 'Caminho de uma requisição por operações e serviços, dividido em spans com duração e relação causal.'],
        ['Cardinalidade', 'Quantidade de valores distintos de um campo ou tag. IDs criam cardinalidade praticamente ilimitada e custo operacional alto.'],
        ['Micrometer', 'Camada de instrumentação usada pelo ecossistema Spring para registrar métricas em diferentes backends.'],
        ['OpenTelemetry', 'Padrão e conjunto de ferramentas para gerar e exportar traces, métricas e logs de forma interoperável.']
      ])}
      <h3>Logs estruturados</h3>
      <pre class="code">{
  <span class="str">"timestamp"</span>: <span class="str">"2026-08-14T12:00:00Z"</span>,
  <span class="str">"level"</span>: <span class="str">"WARN"</span>,
  <span class="str">"event"</span>: <span class="str">"pagamento_recusado"</span>,
  <span class="str">"traceId"</span>: <span class="str">"9f2..."</span>,
  <span class="str">"pedidoId"</span>: 42,
  <span class="str">"motivo"</span>: <span class="str">"limite"</span>
}</pre>
      <p>Use campos estáveis e cardinalidade controlada. Não registre senha, token, cartão, corpo integral nem <strong>PII</strong> — informação pessoal identificável — desnecessária. Um correlation/trace ID permite seguir a mesma operação entre serviços.</p>
      <h3>Métricas e cardinalidade</h3>
      <pre class="code">Counter.builder(<span class="str">"pedidos.criados"</span>).tag(<span class="str">"canal"</span>, canal).register(registry).increment();
Timer.Sample sample = Timer.start(registry);
<span class="kw">try</span> { processar(); }
<span class="kw">finally</span> { sample.stop(registry.timer(<span class="str">"pedidos.duracao"</span>)); }</pre>
      <p>Nunca use <code>usuarioId</code>, URL inteira ou mensagem de erro como tag: séries sem limite podem derrubar o backend de métricas. Meça taxa, erros, duração e saturação. Métrica diz que existe um padrão; trace mostra o caminho de uma requisição; log fornece detalhes discretos.</p>
      <h3>SLI, SLO e alertas</h3>
      <p><strong>SLI</strong> (<em>service level indicator</em>) é a medida, como proporção de requisições válidas abaixo de 300 ms. <strong>SLO</strong> (<em>service level objective</em>) é a meta, como 99,9% em 30 dias. O <strong>error budget</strong> é a parcela de falha permitida pela meta. <strong>Burn rate</strong> mede a velocidade de consumo desse orçamento. Alerte por impacto sustentado e consumo acelerado, não por todo pico momentâneo de CPU.</p>
      <h3>Readiness e liveness</h3>
      <p>Liveness responde se o processo precisa ser reiniciado; não deve cair apenas porque uma dependência externa está indisponível. Readiness responde se a instância pode receber tráfego. Misturar as duas transforma uma falha de banco em tempestade de reinícios.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — diagnosticar sem abrir o código</h4><span class="exercise-tag d">difícil</span></div><p>Instrumente um endpoint com Micrometer e tracing OpenTelemetry, provoque lentidão no banco e demonstre como dashboard, trace e log correlacionado conduzem à causa. Defina um SLO e um alerta de burn rate.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>O dashboard precisa separar latência por percentil, taxa e erro; IDs não podem virar tags; dados sensíveis devem ser redigidos.</p></div></div>` })
    },
    {
      after: 'praticas-producao', id: 'hardening-producao', title: 'Hardening, entrega segura e recuperação operacional', phaseId: 'production', phaseTitle: 'Produção, CI/CD e deploy',
      html: chapter({ id: 'hardening-producao', title: 'Hardening, entrega segura e recuperação operacional', technology: DEVOPS, className: 'tk-devops', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'dockerfile', title: 'Dockerfile' }, { id: 'cicd', title: 'CI/CD' }, { id: 'observabilidade-pratica', title: 'Observabilidade' }], body: `
      <p>Produção exige uma cadeia verificável: construir uma vez, testar o mesmo artefato, promover por digest, observar, reverter e recuperar dados. Um deploy que funcionou uma vez não é uma estratégia operacional.</p>
      ${conceptFoundation('Da imagem ao serviço recuperável', 'Hardening reduz possibilidades desnecessárias de ataque e operação. Entrega segura mantém identidade e rastreabilidade do artefato.', [
        ['Artefato', 'Saída imutável do build que será implantada, como um JAR ou imagem de container.'],
        ['Digest', 'Hash que identifica exatamente o conteúdo de uma imagem; ao contrário de uma tag, não muda para apontar a outra versão.'],
        ['Hardening', 'Redução da superfície de ataque por configuração mínima, menos privilégios e remoção do que não é necessário.'],
        ['SBOM', '<em>Software Bill of Materials</em>: inventário de componentes e versões presentes no artefato.'],
        ['Rollback', 'Retorno controlado a uma versão anterior da aplicação. Não reverte automaticamente dados já migrados.'],
        ['Runbook', 'Procedimento operacional reproduzível para diagnosticar, mitigar ou recuperar um serviço.']
      ])}
      <h3>Imagem mínima e processo correto</h3>
      <pre class="code"><span class="kw">FROM</span> eclipse-temurin:21-jdk <span class="kw">AS</span> build
<span class="kw">WORKDIR</span> /workspace
<span class="kw">COPY</span> .mvn/ .mvn/
<span class="kw">COPY</span> mvnw pom.xml ./
<span class="kw">RUN</span> ./mvnw -B -DskipTests dependency:go-offline
<span class="kw">COPY</span> src/ src/
<span class="kw">RUN</span> ./mvnw -B package

<span class="kw">FROM</span> eclipse-temurin:21-jre
<span class="kw">RUN</span> useradd --system --uid 10001 app
<span class="kw">WORKDIR</span> /app
<span class="kw">COPY</span> --from=build /workspace/target/*.jar app.jar
<span class="kw">USER</span> 10001
<span class="kw">ENTRYPOINT</span> [<span class="str">"java"</span>,<span class="str">"-jar"</span>,<span class="str">"/app/app.jar"</span>]</pre>
      <p>Fixe a imagem base por digest no pipeline real, gere SBOM, escaneie dependências e imagem, execute como usuário sem privilégios e prefira filesystem somente leitura com diretórios temporários explícitos. <strong>Capabilities</strong> são permissões específicas do kernel Linux; removê-las evita conceder poderes que o processo não usa.</p>
      <h3>Deploy e rollback</h3>
      <ul><li>Migrations devem ser compatíveis com a versão anterior durante rolling deploy: primeiro expanda, migre dados, depois contraia.</li><li>Blue-green troca todo o tráfego após validação; canary expõe gradualmente e exige métricas automáticas.</li><li>Rollback de aplicação não desfaz automaticamente migrations destrutivas.</li><li>Configure graceful shutdown, tempo máximo e tratamento de sinais.</li><li>Separe readiness de liveness e teste o comportamento durante indisponibilidade.</li></ul>
      <h3>Backup não é recuperação</h3>
      <p>Defina <strong>RPO</strong> (<em>Recovery Point Objective</em>) — quanto dado pode ser perdido, medido como distância até o ponto recuperável — e <strong>RTO</strong> (<em>Recovery Time Objective</em>) — quanto tempo a recuperação pode levar. Faça backup criptografado, com retenção e cópia fora do mesmo domínio de falha. Restaure periodicamente em ambiente isolado e verifique integridade; somente então existe evidência de recuperação.</p>
      <div class="warn"><b>Compose não vira produção apenas por estar em uma VM.</b> Não exponha a porta do banco publicamente, não grave senha no arquivo, configure limites, atualização, TLS, firewall, monitoramento e responsabilidade operacional.</div>
      <div class="exercise"><div class="exercise-head"><h4>Game day — falha controlada</h4><span class="exercise-tag d">difícil</span></div><p>Derrube uma instância, interrompa o banco, entregue uma versão incompatível e restaure um backup. Registre detecção, impacto, rollback, RPO/RTO observado e ações preventivas.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>O exercício só termina quando existe runbook executável por outra pessoa, evidência de restauração e uma ação corretiva priorizada.</p></div></div>` })
    },
    {
      after: 'spring-kafka', id: 'kafka-confiavel', title: 'Kafka confiável: schemas, retries, DLT, outbox e exactly-once', phaseId: 'messaging', phaseTitle: 'Mensageria depois do monólito',
      html: chapter({ id: 'kafka-confiavel', title: 'Kafka confiável: schemas, retries, DLT, outbox e exactly-once', technology: KAFKA, className: 'tk-kafka', difficulty: 'Avançado', time: '7h', prerequisites: [{ id: 'spring-kafka', title: 'Spring Kafka' }, { id: 'jpa-transacoes', title: 'Transações' }], body: `
      <p>Mensagens podem duplicar, atrasar, chegar fora da ordem esperada ou falhar permanentemente. Confiabilidade vem de contratos evolutivos, observabilidade e processamento idempotente, não da expectativa de entrega perfeita.</p>
      ${conceptFoundation('O caminho mínimo de uma mensagem', 'Visualize primeiro produtor → tópico/partição → consumidor. As técnicas seguintes protegem pontos diferentes desse caminho.', [
        ['Evento', 'Registro imutável de algo que aconteceu, nomeado no passado, como PedidoCriado.'],
        ['Schema', 'Contrato estrutural e de tipos da mensagem, com regras de evolução entre versões.'],
        ['Partição', 'Log ordenado dentro de um tópico; Kafka preserva ordem por partição, não globalmente.'],
        ['Offset', 'Posição de uma mensagem dentro de uma partição e progresso registrado pelo consumidor.'],
        ['Idempotência', 'Capacidade de processar repetição sem aplicar o efeito de negócio outra vez.'],
        ['DLT', '<em>Dead-letter topic</em>: tópico separado para mensagens que não puderam ser processadas após a política definida.']
      ])}
      <h3>Schema e evolução</h3>
      <p>Não produza JSON por concatenação. Um <strong>serializer</strong> transforma o objeto em bytes conforme o contrato. Avro, Protocol Buffers (Protobuf) e JSON Schema são alternativas para descrever dados e evolução. Adições opcionais com valor padrão tendem a ser compatíveis; renomear ou mudar significado exige transição. <strong>Correlation ID</strong> agrupa mensagens da mesma operação; <strong>causation ID</strong> aponta qual mensagem causou diretamente a atual.</p>
      <pre class="code"><span class="kw">public record</span> PedidoCriado(
    UUID eventId,
    <span class="kw">int</span> schemaVersion,
    UUID pedidoId,
    Instant occurredAt,
    List&lt;ItemEvento&gt; itens) {}</pre>
      <h3>Retry e dead-letter topic</h3>
      <p>Erros transitórios podem receber retries limitados com backoff e jitter. Erros permanentes, como schema inválido, não devem bloquear a partição indefinidamente: envie à DLT com causa e metadados, gere alerta e ofereça reprocessamento auditável. Retry topics podem alterar a ordem relativa; declare se a ordem é requisito.</p>
      <h3>Idempotent consumer</h3>
      <pre class="code"><span class="kw">BEGIN</span>;
<span class="kw">INSERT INTO</span> mensagem_processada(consumer, event_id)
<span class="kw">VALUES</span> (:consumer, :eventId)
<span class="kw">ON CONFLICT DO NOTHING</span>;
<span class="com">-- continue somente quando uma linha foi inserida</span>
<span class="kw">UPDATE</span> estoque <span class="kw">SET</span> reservado = reservado + :qtd <span class="kw">WHERE</span> produto_id = :id;
<span class="kw">COMMIT</span>;</pre>
      <p>A deduplicação e o efeito devem estar na mesma transação local. Idempotência do produtor Kafka não torna automaticamente o banco do consumidor idempotente.</p>
      <h3>Transactional outbox</h3>
      <p>Grave mudança de domínio e linha de <strong>outbox</strong> — uma tabela de eventos pendentes — na mesma transação. Um <strong>relay</strong> lê e publica essa tabela; outra opção é <strong>CDC</strong> (<em>Change Data Capture</em>), que observa o log de mudanças do banco. A publicação ainda pode repetir após falha, portanto consumidores continuam idempotentes. Uma <strong>inbox</strong> registra mensagens recebidas e aplica o mesmo princípio na entrada.</p>
      <h3>Exactly-once: limite da garantia</h3>
      <p>Transações Kafka podem coordenar leitura, escrita em tópicos e offsets dentro do Kafka. Elas não incluem automaticamente um PostgreSQL ou uma API de pagamento. Descreva sempre o limite: exactly-once em qual sistema e para qual efeito?</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — falhas reais</h4><span class="exercise-tag d">difícil</span></div><p>Implemente outbox, relay, consumidor idempotente, retry e DLT. Mate o processo depois de publicar e antes de marcar a outbox; confirme que a repetição não duplica estoque.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>Meça consumer lag, conte DLTs, preserve event ID e prove o comportamento após restart. O teste deve falhar se a constraint de deduplicação for removida.</p></div></div>` })
    },
    {
      after: 'ddd', id: 'ddd-estrategico', title: 'DDD estratégico, context mapping e integração entre domínios', phaseId: 'architecture', phaseTitle: 'Arquitetura e sistemas distribuídos',
      html: chapter({ id: 'ddd-estrategico', title: 'DDD estratégico, context mapping e integração entre domínios', technology: DEVOPS, className: 'tk-devops', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'ddd', title: 'DDD' }, { id: 'arquitetura-software', title: 'Arquitetura' }], body: `
      <p>DDD tático organiza entidades e agregados; DDD estratégico decide onde um modelo é válido, como times se relacionam e quais integrações merecem proteção. Um bounded context é uma fronteira semântica e de consistência, não sinônimo automático de microsserviço.</p>
      ${conceptFoundation('Primeiro: modelo, linguagem e fronteira', 'DDD é uma forma de tornar conhecimento de negócio explícito no modelo e na colaboração, não uma coleção obrigatória de classes.', [
        ['DDD', '<em>Domain-Driven Design</em>: abordagem para software complexo guiada pelo conhecimento e pela linguagem do domínio.'],
        ['Linguagem ubíqua', 'Vocabulário compartilhado por especialistas e equipe, usado em conversa, código e testes dentro de um contexto.'],
        ['Bounded context', 'Fronteira dentro da qual termos e regras de um modelo têm significado consistente.'],
        ['Upstream', 'Contexto fornecedor que influencia um contrato ou dado consumido por outro.'],
        ['Downstream', 'Contexto consumidor afetado pelas decisões do fornecedor.'],
        ['Context map', 'Mapa das fronteiras e das relações técnicas, organizacionais e de poder entre contextos.']
      ])}
      <h3>Context map</h3>
      <table class="cmp"><tr><th>Relação</th><th>Quando ocorre</th></tr><tr><td>Customer/Supplier — cliente/fornecedor</td><td>downstream negocia necessidades com upstream</td></tr><tr><td>Conformist — conformista</td><td>downstream adota o modelo externo conscientemente</td></tr><tr><td>Anti-Corruption Layer (ACL)</td><td>camada traduz o modelo externo e impede que ele contamine o domínio interno</td></tr><tr><td>Published Language</td><td>linguagem/contrato de integração estável e documentado</td></tr><tr><td>Open Host Service</td><td>serviço com protocolo público atende múltiplos consumidores</td></tr></table>
      <h3>Agregados e transações</h3>
      <p>Um agregado protege invariantes que precisam ser consistentes imediatamente e é alterado pela raiz. Referencie outro agregado por identidade; coordene mudanças entre agregados com caso de uso, evento e consistência explicitamente escolhida. Agregados enormes geram contenção e carregamento excessivo.</p>
      <h3>Serviços, fábricas e repositórios</h3>
      <p>Comportamento que não pertence naturalmente a uma entidade pode viver em um domain service, desde que continue expressando linguagem do negócio. Fábricas encapsulam criação complexa e repositórios oferecem a ilusão de coleção de raízes de agregado. Application services orquestram entrada, transação e portas externas; não concentram regras do domínio.</p>
      <div class="exercise"><div class="exercise-head"><h4>Workshop — event storming e mapa</h4><span class="exercise-tag d">difícil</span></div><p><strong>Event storming</strong> é uma dinâmica visual que parte de eventos de domínio para descobrir comandos, políticas, dúvidas e fronteiras. Mapeie Pedido, Estoque, Pagamento e Entrega: comandos, eventos, políticas, invariantes, contextos, donos e relações. Escolha onde uma ACL é necessária e registre a decisão em um <strong>ADR</strong>, documento curto de decisão arquitetural com contexto, escolha e consequências.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>Não comece por tabelas ou serviços. O mapa deve revelar linguagens diferentes, limite transacional e responsabilidade de cada contrato.</p></div></div>` })
    },
    {
      after: 'sistemas-distribuidos', id: 'consistencia-distribuida', title: 'Consistência distribuída: CAP correto, PACELC, tempo e resiliência', phaseId: 'architecture', phaseTitle: 'Arquitetura e sistemas distribuídos',
      html: chapter({ id: 'consistencia-distribuida', title: 'Consistência distribuída: CAP correto, PACELC, tempo e resiliência', technology: DEVOPS, className: 'tk-devops', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'sistemas-distribuidos', title: 'Sistemas distribuídos' }, { id: 'resilience', title: 'Resiliência' }], body: `
      <p>Comece com duas cópias do mesmo dado em máquinas diferentes. Se a rede entre elas falhar, cada lado precisa decidir entre recusar algumas operações para preservar uma visão única ou continuar respondendo mesmo sem confirmar o estado do outro lado. É nesse cenário específico que CAP ajuda a raciocinar.</p>
      ${conceptFoundation('Base para falar de consistência', 'As palavras abaixo descrevem falhas ou garantias distintas. Não use “consistente” sem dizer qual delas.', [
        ['Sistema distribuído', 'Componentes em processos ou máquinas diferentes que se comunicam por rede e podem falhar separadamente.'],
        ['Réplica', 'Cópia coordenada de dados mantida em outro nó para disponibilidade, leitura ou recuperação.'],
        ['Partição de rede', 'Falha de comunicação que impede grupos de nós de trocar mensagens, mesmo que continuem executando.'],
        ['Disponibilidade em CAP', 'Toda requisição recebida por um nó não falho obtém resposta, ainda que ela não contenha a gravação mais recente.'],
        ['Linearizabilidade', 'Cada operação parece ocorrer em um único ponto entre chamada e resposta, respeitando a ordem observada no mundo real.'],
        ['Latência', 'Tempo entre iniciar uma operação e receber sua resposta.']
      ])}
      <p><strong>CAP</strong> descreve a decisão durante uma partição em um sistema replicado: preservar consistência linearizável ou manter disponibilidade. Não classifique um banco local, um cache TTL ou uma entrega <em>at-least-once</em> isoladamente como CP/AP; são eixos diferentes.</p>
      <h3>PACELC e modelos de consistência</h3>
      <p><strong>PACELC</strong> acrescenta a decisão em operação normal: se houver partição (<em>Partition</em>), disponibilidade ou consistência; caso contrário (<em>Else</em>), latência ou consistência.</p>
      <table class="cmp"><tr><th>Garantia</th><th>O que promete</th></tr><tr><td>linearizabilidade</td><td>leituras respeitam a ordem real das operações concluídas</td></tr><tr><td>serializabilidade</td><td>transações concorrentes equivalem a alguma execução sequencial válida</td></tr><tr><td>consistência causal</td><td>operações relacionadas por causa são vistas nessa ordem</td></tr><tr><td>leitura monotônica</td><td>depois de ver uma versão, o mesmo cliente não volta a uma versão mais antiga</td></tr><tr><td>consistência eventual</td><td>sem novas escritas, réplicas convergem; não define quão recente é uma leitura durante a convergência</td></tr></table>
      <p>Uma transação serializável não implica automaticamente leitura linearizável entre réplicas: uma garantia ordena transações; a outra também relaciona operações ao tempo real observado.</p>
      <h3>Tempo, falha parcial e retries</h3>
      <p><strong>Timeout</strong> limita quanto uma etapa espera, mas não prova que a operação falhou; prova apenas que a resposta não chegou no prazo. O servidor pode ter confirmado o pagamento. Uma <strong>deadline</strong> é o instante limite para toda a operação e deve ser propagada às dependências. <strong>Backoff exponencial</strong> aumenta a pausa entre tentativas; <strong>jitter</strong> adiciona variação aleatória para evitar repetição sincronizada. Operações repetíveis também precisam de idempotency key, consulta de estado e limite total.</p>
      <h3>Proteções complementares</h3>
      <ul><li>Circuit breaker reduz pressão sobre dependência doente.</li><li>Bulkhead impede que um recurso esgotado consuma toda a aplicação.</li><li>Rate limiter protege capacidade, mas precisa de política por identidade.</li><li>Lease possui validade temporal e não é um mutex perfeito sob pausas e relógios.</li><li>Fencing token permite ao recurso rejeitar dono antigo de lock distribuído.</li></ul>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório mental — resposta perdida</h4><span class="exercise-tag d">difícil</span></div><p>Modele o que acontece quando um pagamento é confirmado, mas a resposta se perde. Defina estados, idempotência, consulta, reconciliação e métricas. Depois repita o raciocínio para reserva de estoque.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>A solução não pode inferir falha pelo timeout nem cobrar novamente sem chave. Deve haver estado desconhecido, reconciliação e trilha auditável.</p></div></div>` })
    },
    {
      after: 'auth-front-ts', id: 'frontend-aplicacao', title: 'Front-end aplicado: estado, formulários, acessibilidade e testes', phaseId: 'integration', phaseTitle: 'Integração com front-end',
      html: chapter({ id: 'frontend-aplicacao', title: 'Front-end aplicado: estado, formulários, acessibilidade e testes', technology: FRONT, className: 'tk-front', difficulty: 'Intermediário', time: '6h', prerequisites: [{ id: 'auth-front-ts', title: 'Autenticação no front' }, { id: 'api-design-avancado', title: 'Contratos HTTP' }], body: `
      <p>Uma integração front-end robusta distingue estado remoto, estado de formulário, estado de navegação e estado puramente visual. Misturar tudo em variáveis globais cria telas inconsistentes e difíceis de testar.</p>
      ${conceptFoundation('Primeiro contato com a tela reativa', 'O exemplo usa React com TypeScript, mas os princípios de estado, efeito e acessibilidade valem para outros frameworks.', [
        ['Componente', 'Função ou unidade de interface que recebe dados e descreve o que deve aparecer.'],
        ['Estado', 'Dados que podem mudar e alterar a interface, como valor do campo ou resultado carregado.'],
        ['Renderização', 'Produção da interface correspondente ao estado atual.'],
        ['Hook', 'Função do React, como useState, que conecta o componente a recursos do framework.'],
        ['Efeito', 'Sincronização com algo externo à renderização, como rede, timer ou evento do navegador.'],
        ['Cleanup', 'Função de limpeza que cancela ou desfaz um efeito quando ele deixa de valer.']
      ])}
      <h3>Camada 1 — um estado local simples</h3>
      <pre class="code"><span class="kw">import</span> { useState } <span class="kw">from</span> <span class="str">'react'</span>;

<span class="kw">function</span> Contador() {
  <span class="kw">const</span> [total, setTotal] = useState(0);
  <span class="kw">return</span> &lt;button onClick={() =&gt; setTotal(total + 1)}&gt;
    Cliques: {total}
  &lt;/button&gt;;
}</pre>
      <p><code>useState(0)</code> guarda o valor atual e fornece uma função para atualizá-lo. Ao chamar <code>setTotal</code>, o React renderiza novamente o componente. A marcação dentro do JavaScript é <strong>JSX</strong>, uma sintaxe transformada em chamadas que descrevem elementos.</p>
      <h3>Camada 2 — estados remotos explícitos</h3>
      <pre class="code"><span class="kw">type</span> Estado&lt;T&gt; =
  | { status: <span class="str">'carregando'</span> }
  | { status: <span class="str">'erro'</span>; mensagem: string }
  | { status: <span class="str">'vazio'</span> }
  | { status: <span class="str">'pronto'</span>; dados: T };

<span class="kw">function</span> Pedidos() {
  <span class="kw">const</span> [estado, setEstado] = useState&lt;Estado&lt;Pedido[]&gt;&gt;({ status: <span class="str">'carregando'</span> });
  <span class="com">// renderize cada estado deliberadamente; não deixe erro parecer lista vazia</span>
}</pre>
      <p><strong>Estado remoto</strong> é a cópia local de dados cuja autoridade está no servidor. Efeitos de busca precisam de cleanup e cancelamento: uma resposta antiga não deve sobrescrever a busca mais recente. Bibliotecas de <em>server state</em> ajudam com cache, deduplicação e invalidação — marcar dados antigos para nova busca — mas ainda exigem chaves e políticas corretas.</p>
      <h3>Formulários e acessibilidade</h3>
      <ul><li>Associe <code>label</code> ao controle; placeholder não substitui rótulo.</li><li>Mostre erro próximo ao campo, relacione com <code>aria-describedby</code> e mova foco para o resumo quando necessário.</li><li>Não desabilite zoom nem dependa somente de cor.</li><li>Use elementos semânticos e interação completa por teclado.</li><li>Validação do cliente melhora experiência, mas o servidor continua sendo autoridade.</li></ul>
      <h3>Autenticação no navegador</h3>
      <p>Retome o fluxo e as ameaças do capítulo <a href="#security-oidc">OAuth 2.0 e OpenID Connect</a>. <strong>Backend for Frontend (BFF)</strong> é um backend dedicado à interface que pode guardar tokens fora do JavaScript e expor ao navegador uma sessão por cookie. Prefira Authorization Code com PKCE ou BFF conforme o risco. Se usar cookie, implemente CSRF; se usar Bearer acessível ao JavaScript, minimize vida útil e superfície XSS. Nunca coloque client secret no bundle. Renove sessão de forma serializada para evitar uma tempestade de tentativas simultâneas.</p>
      <h3>Testes</h3>
      <p>Teste comportamento observável com <strong>Testing Library</strong>: o usuário preenche, envia, percebe carregamento e recebe sucesso ou erro. <strong>Mock Service Worker (MSW)</strong> intercepta requisições e simula a fronteira HTTP sem acoplar o teste à implementação do cliente. Mantenha poucos testes <strong>E2E</strong>, de ponta a ponta, para jornadas críticas.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — tela de pedidos completa</h4><span class="exercise-tag d">difícil</span></div><p>Implemente listagem por cursor, criação idempotente, estados de carregamento/erro/vazio, formulário acessível, sessão expirada e atualização por WebSocket com reconexão.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>Inclua testes de teclado, erro 422/409, duplicação de clique, resposta fora de ordem e reconexão. O bundle não pode conter segredo.</p></div></div>` })
    },
    {
      after: 'redis', id: 'nosql-operacional', title: 'MongoDB e Redis operacionais: índices, consistência, persistência e escala', phaseId: 'advanced-data', phaseTitle: 'NoSQL, cache e hospedagem',
      html: chapter({ id: 'nosql-operacional', title: 'MongoDB e Redis operacionais: índices, consistência, persistência e escala', technology: NOSQL, className: 'tk-nosql', difficulty: 'Avançado', time: '5h', prerequisites: [{ id: 'mongodb', title: 'MongoDB' }, { id: 'redis', title: 'Redis' }], body: `
      <p>NoSQL não significa ausência de schema ou transações. Significa escolher outro modelo e outro conjunto de trade-offs. MongoDB oferece validação de schema, índices, replica sets e transações; Redis possui persistência, replicação e políticas de remoção. A configuração determina a garantia real.</p>
      ${conceptFoundation('Do modelo à operação', 'Antes das opções específicas, separe formato, cópia, durabilidade e cache: cada decisão responde a uma falha diferente.', [
        ['Documento', 'Registro hierárquico de campos e arrays armazenado como unidade no MongoDB.'],
        ['Replica set', 'Grupo de instâncias MongoDB que mantém cópias e elege um primário para tolerar falhas.'],
        ['Persistência', 'Mecanismo que permite reconstruir dados após reinício ou falha do processo.'],
        ['Cache-aside', 'Aplicação consulta o cache; em falta, busca a fonte, devolve e armazena o resultado por um período.'],
        ['TTL', '<em>Time to live</em>: duração após a qual uma chave expira.'],
        ['Eviction', 'Remoção de chaves pelo Redis quando a política de memória exige liberar espaço.']
      ])}
      <h3>MongoDB: modelo orientado ao acesso</h3>
      <p>Embuta dados que mudam e são lidos como unidade; referencie dados grandes, compartilhados ou com ciclo de vida independente. Documentos sem limite podem ultrapassar tamanho e aumentar <strong>write amplification</strong>: uma pequena mudança lógica causa uma quantidade muito maior de bytes reescritos, replicados ou indexados.</p>
      <pre class="code">db.pedidos.createIndex({ clienteId: 1, criadoEm: -1 })
db.pedidos.find({ clienteId: UUID(<span class="str">"..."</span>) })
  .sort({ criadoEm: -1 })
  .explain(<span class="str">"executionStats"</span>)</pre>
      <p>A ordem do índice composto importa. Compare documentos examinados, retornados e estágio do plano. Use validação JSON Schema para impedir documentos estruturalmente inválidos. <strong>Write concern</strong> define quais confirmações de escrita são exigidas antes da resposta; <strong>read concern</strong> define a garantia de visibilidade da leitura. Não presuma consistência pela aparência da API.</p>
      <h3>Redis: cache não é banco descartável por definição</h3>
      <p><strong>RDB</strong> cria snapshots periódicos do conjunto de dados; <strong>AOF</strong> (<em>append-only file</em>) registra operações para reprodução. Eles oferecem trocas diferentes de durabilidade, espaço e recuperação. Replicação copia dados; <strong>Sentinel</strong> monitora e coordena failover sem particionar o conjunto; <strong>Cluster</strong> distribui chaves entre nós. Se uma chave não pode ser perdida, teste reinício, failover e restauração em vez de chamá-la apenas de cache.</p>
      <table class="cmp"><tr><th>Risco</th><th>O que significa</th><th>Mitigação</th></tr><tr><td>stampede</td><td>muitos clientes perdem a mesma chave e atingem a fonte ao mesmo tempo</td><td>TTL com jitter, single-flight/lock limitado e stale-while-revalidate</td></tr><tr><td>penetração</td><td>consultas repetidas por dados inexistentes atravessam o cache</td><td>validação, cache negativo curto ou filtro probabilístico</td></tr><tr><td>hot key</td><td>uma chave recebe parcela desproporcional do tráfego</td><td>particionamento lógico, réplica de leitura ou cache local controlado</td></tr><tr><td>memória cheia</td><td>novos dados excedem o limite configurado</td><td>maxmemory, eviction policy coerente e alertas</td></tr><tr><td>dados incompatíveis</td><td>versões da aplicação interpretam o valor de formas diferentes</td><td>versão no valor/chave e estratégia de migração</td></tr></table>
      <p><strong>Single-flight</strong> deixa apenas uma chamada reconstruir a chave enquanto as demais aguardam. <strong>Stale-while-revalidate</strong> serve por pouco tempo uma cópia expirada enquanto a atualiza em segundo plano. Um <strong>filtro probabilístico</strong>, como Bloom filter, responde rapidamente que certos itens definitivamente não existem, aceitando alguns falsos positivos.</p>
      <h3>Locks e coordenação</h3>
      <p><code>SET chave valor NX PX tempo</code> fornece aquisição condicional com expiração, mas pausas e rede podem fazer um dono antigo continuar agindo. Para recursos críticos, use fencing token crescente aceito pelo recurso protegido. Nunca libere um lock sem verificar que o valor ainda pertence ao solicitante.</p>
      <div class="exercise"><div class="exercise-head"><h4>Laboratório — cache sob pressão</h4><span class="exercise-tag d">difícil</span></div><p>Implemente cache-aside com TTL aleatório, cache negativo e métricas de hit/miss. Simule 100 requisições simultâneas após expiração e impeça 100 consultas iguais ao banco. Reinicie Redis e documente o efeito da política de persistência.</p><button class="reveal-btn">Ver critérios</button><div class="solution"><p>O teste deve medir chamadas ao banco, não apenas tempo. A aplicação precisa continuar correta quando Redis estiver indisponível e não deve armazenar erro transitório como resultado válido.</p></div></div>` })
    }
  ];

  const dataElement = document.getElementById('course-data');
  if (!dataElement) return;
  const chapters = JSON.parse(dataElement.textContent);
  additions.forEach(addition => {
    const referenceIndex = chapters.findIndex(item => item.id === addition.after);
    const insertAt = referenceIndex >= 0 ? referenceIndex + 1 : chapters.length;
    chapters.splice(insertAt, 0, {
      id: addition.id,
      title: addition.title,
      phaseId: addition.phaseId,
      phaseTitle: addition.phaseTitle
    });
    dataElement.insertAdjacentHTML('beforebegin', addition.html);
  });

  chapters.forEach((item, index) => { item.index = index; });
  dataElement.textContent = JSON.stringify(chapters);

  const projectQuestions = {
    'template-mini-caixa-eletronico': ['Qual separação deixa o caixa eletrônico mais testável?', 'A regra de saque recebe valores e retorna um resultado, sem ler Scanner nem imprimir.', 'Colocar Scanner, saldo e impressão no mesmo método.', 'Usar campos globais para qualquer operação.'],
    'template-mini-biblioteca-cli': ['Onde deve ficar a regra que impede emprestar exemplar indisponível?', 'No modelo/caso de uso que protege a invariante, não apenas no menu.', 'Somente na mensagem impressa pelo menu.', 'Em um getter que altera o estado.'],
    'template-mini-analisador-vendas': ['Qual uso de Stream é seguro?', 'Operações sem efeitos colaterais compartilhados e coleta explícita do resultado.', 'Alterar uma ArrayList externa dentro de parallelStream.', 'Reutilizar o mesmo Stream depois de uma operação terminal.'],
    'template-mini-importador-pedidos': ['Como tratar uma linha inválida do arquivo?', 'Registrar contexto seguro, separar o erro e continuar ou abortar conforme contrato explícito.', 'Ignorar silenciosamente toda exceção.', 'Importar metade da linha para não perder dados.'],
    'template-mini-financas-jdbc': ['O que torna uma transferência atômica?', 'Débito e crédito na mesma transação, com rollback e controle de concorrência.', 'Dois UPDATEs em conexões independentes.', 'Executar o crédito alguns segundos depois.'],
    'template-mini-helpdesk-api': ['Qual resposta representa criação bem-sucedida?', '201 Created com representação ou Location do recurso.', '200 para qualquer situação.', '500 quando o título for inválido.'],
    'template-mini-reservas-testadas': ['Qual teste comprova uma disputa concorrente?', 'Duas transações reais sincronizadas no ponto de conflito e uma única vencedora.', 'Chamar o método duas vezes sequencialmente.', 'Mockar o lock e assumir que funcionou.'],
    'template-mini-auth-rbac': ['Autenticação por papel é suficiente para proteger um chamado?', 'Não; também é preciso verificar propriedade/escopo do recurso.', 'Sim; qualquer usuário com papel USER acessa tudo.', 'Sim, desde que o JWT seja longo.'],
    'template-mini-deploy-observavel': ['O que demonstra que um backup é confiável?', 'Uma restauração periódica verificada contra RPO e RTO.', 'O job de backup terminar com exit code zero.', 'O arquivo existir na mesma máquina do banco.'],
    'template-mini-pedidos-eventos': ['Como impedir efeito duplicado no consumidor?', 'Deduplicação e efeito na mesma transação local, usando event ID.', 'Confiar que at-least-once nunca repete.', 'Remover a chave da mensagem.']
  };

  try {
    document.querySelectorAll('template[id^="template-mini-"], #template-projeto, #template-projeto-integrador').forEach(projectTemplate => {
      const section = projectTemplate.content.querySelector('.section');
      if (!section || section.querySelector('.project-quality-gate')) return;
      const question = projectQuestions[projectTemplate.id];
      if (question) section.insertAdjacentHTML('beforeend', `<h3>Checkpoint antes de concluir</h3><div class="quiz"><p class="q">${question[0]}</p><div class="quiz-opts"><div class="quiz-opt" data-correct="true">${question[1]}</div><div class="quiz-opt" data-correct="false">${question[2]}</div><div class="quiz-opt" data-correct="false">${question[3]}</div></div><div class="quiz-feedback"></div></div>`);
      section.insertAdjacentHTML('beforeend', `<div class="project-quality-gate">
      <h3>Execução guiada e evidências</h3>
      <p>Este projeto não termina quando o caminho feliz funciona. Construa em incrementos pequenos, mantenha o sistema executável a cada etapa e produza evidências que outra pessoa consiga reproduzir.</p>
      <h4 class="sub">Marcos obrigatórios</h4>
      <ol>
        <li><strong>Contrato:</strong> escreva regras, entradas, saídas, invariantes e casos-limite antes da implementação.</li>
        <li><strong>Caminho mínimo:</strong> entregue uma fatia vertical executável com um teste de aceitação.</li>
        <li><strong>Falhas:</strong> implemente validação, mensagens úteis, cleanup e comportamento após interrupção.</li>
        <li><strong>Qualidade:</strong> automatize testes, formatação e build; remova segredos e dados pessoais dos logs.</li>
        <li><strong>Operação:</strong> documente como executar, diagnosticar, atualizar e recuperar o projeto.</li>
      </ol>
      <h4 class="sub">Matriz mínima de testes</h4>
      <table class="cmp"><tr><th>Categoria</th><th>Evidência</th></tr><tr><td>caminho feliz</td><td>resultado e estado final esperados</td></tr><tr><td>limites</td><td>vazio, mínimo, máximo, duplicado e formato inválido</td></tr><tr><td>falha</td><td>dependência indisponível, timeout ou exceção sem corrupção de estado</td></tr><tr><td>repetição</td><td>retry ou execução duplicada não produz efeito indevido</td></tr><tr><td>regressão</td><td>bug corrigido ganha teste que falhava antes</td></tr></table>
      <ul class="checklist"><li><input type="checkbox"><span>README contém requisitos, arquitetura, decisões e comandos reproduzíveis.</span></li><li><input type="checkbox"><span>Build e testes executam do zero sem passos secretos.</span></li><li><input type="checkbox"><span>Casos-limite e falhas foram demonstrados, não apenas descritos.</span></li><li><input type="checkbox"><span>Existe uma retrospectiva com dívida técnica e próximo incremento.</span></li></ul>
      <div class="warn"><b>Regra de conclusão:</b> captura de tela não prova comportamento. Entregue código, testes, dados de exemplo, comandos e resultados verificáveis. Se uma tecnologia externa for necessária, fixe versões e forneça um ambiente reproduzível.</div>
      </div>`);
    });

    const integrator = document.getElementById('template-projeto-integrador')?.content.querySelector('.section');
    integrator?.insertAdjacentHTML('beforeend', `<h3>Arquitetura de referência verificável</h3>
      <pre class="code">cliente web
  └── HTTPS / OIDC
        └── API Spring Boot
              ├── domínio + casos de uso
              ├── PostgreSQL + Flyway + optimistic locking
              ├── outbox ──► Kafka ──► consumidor idempotente + DLT
              ├── Redis cache-aside degradável
              └── logs JSON + métricas + traces

pipeline: build → testes → SBOM/scan → imagem por digest → migration compatível
          → canary/health → promoção ou rollback
operação: SLO → alertas → runbook → backup restaurado → post-mortem</pre>
      <h4 class="sub">Fases de entrega</h4><ol><li>Domínio puro, invariantes e testes unitários.</li><li>API HTTP com Problem Details, idempotência e contrato OpenAPI.</li><li>Persistência com migrations, transações e teste de concorrência.</li><li>Resource Server OIDC, escopos, propriedade e testes negativos.</li><li>Outbox/Kafka, deduplicação, retry, DLT e reprocessamento.</li><li>Cache tolerante a falha e limites de cardinalidade.</li><li>Imagem hardened, CI, observabilidade e deploy progressivo.</li><li>Game day, restauração, revisão de segurança e apresentação dos trade-offs.</li></ol>
      <h4 class="sub">Critérios eliminatórios</h4><ul><li>O projeto não é concluído se depender de segredo versionado, <code>ddl-auto=update</code>, testes manuais como única evidência ou banco exposto publicamente.</li><li>Falha de Kafka ou Redis não pode corromper o estado transacional.</li><li>Uma requisição repetida não pode cobrar, reservar ou publicar efeito de negócio duas vezes.</li><li>O artefato implantado precisa ser exatamente o artefato testado.</li><li>Backup precisa ter sido restaurado; health check precisa distinguir readiness e liveness.</li></ul>`);

    const introMeta = document.getElementById('template-intro')?.content.querySelector('.topic-meta');
    introMeta?.insertAdjacentHTML('afterend', `<div class="rules-box"><h4>Baseline verificável do curso</h4><ul>
    <li><strong>Java:</strong> JDK 21 LTS; recursos preview ficam explicitamente identificados e não são exigidos.</li>
    <li><strong>Spring:</strong> exemplos tradicionais são compatíveis com a linha Spring Boot 3.5 / Framework 6.2; notas indicam diferenças relevantes do Framework 7, como a preferência por <code>RestClient</code>.</li>
    <li><strong>Dados e infraestrutura:</strong> PostgreSQL 16 nos exemplos, Redis 7 e imagens fixadas no projeto executável. Para Kafka, Springdoc e Testcontainers, use a versão administrada pelo BOM adotado e registre a imagem por tag e digest.</li>
    <li><strong>Última revisão técnica integral:</strong> agosto de 2026. Antes de copiar dependências, confira a matriz oficial de compatibilidade da versão do projeto.</li>
    </ul></div>`);
  } catch (error) {
    console.error('A trilha principal foi carregada, mas um enriquecimento complementar falhou.', error);
  }
})();
