import { readFileSync } from 'node:fs';

const exactCommentTranslations = new Map(Object.entries(JSON.parse(
  readFileSync(new URL('./english-code-comments.json', import.meta.url), 'utf8')
)).map(([source, translation]) => [source.trim(), translation.trim()]));

const wordMap = new Map(Object.entries({
  acao: 'action', adicionar: 'add', adicionaritem: 'addItem', adicionarobservador: 'addObserver',
  aluno: 'student', alunos: 'students', ano: 'year', aprovacao: 'approval', aprovado: 'approved',
  arquivo: 'file', arquivos: 'files', area: 'area', autor: 'author', autores: 'authors', atual: 'current',
  atualizar: 'update', autenticacao: 'authentication', bancario: 'bank', banco: 'bank', bancos: 'banks',
  buscar: 'find', busca: 'search', caixa: 'atm', calcular: 'calculate', caminho: 'path', campo: 'field',
  campos: 'fields', cancelar: 'cancel', chave: 'key', chaves: 'keys', classe: 'type', classes: 'types',
  cliente: 'customer', clientes: 'customers', codigo: 'code', codigos: 'codes', colecao: 'collection',
  comando: 'command', comandos: 'commands', completo: 'complete', conexao: 'connection', conexoes: 'connections',
  contador: 'counter', conta: 'account', contas: 'accounts', contar: 'count', conteudo: 'content',
  construtor: 'constructor', construtores: 'constructors', criado: 'created', criar: 'create', credito: 'credit',
  dados: 'data', data: 'date', datas: 'dates', debito: 'debit', deletar: 'delete', desconto: 'discount',
  descontos: 'discounts', desenfileirar: 'dequeue', devolver: 'return', devolucao: 'return',
  dia: 'day', dias: 'days', diferente: 'different', disponivel: 'available', disponibilidade: 'availability',
  emprestar: 'borrow', emprestado: 'borrowed', emprestimo: 'loan', endereco: 'address',
  enviar: 'send', erro: 'error', erros: 'errors', estoque: 'inventory', estrategia: 'strategy',
  estagiario: 'intern', evento: 'event', eventos: 'events', excecao: 'exception', executar: 'execute',
  exibir: 'display', externo: 'external', fabrica: 'factory', falha: 'failure', falhar: 'fail', falso: 'fake',
  fechar: 'close', finalizado: 'completed', finalizar: 'complete', forma: 'shape', frete: 'shipping',
  funcionario: 'employee', gerente: 'manager', historico: 'history', idade: 'age', invalida: 'invalid',
  invalido: 'invalid', item: 'item', itens: 'items', lancar: 'throw', ler: 'read', linha: 'line', linhas: 'lines',
  livro: 'book', livros: 'books', mensagem: 'message', mensagens: 'messages', metodo: 'method', metodos: 'methods',
  moeda: 'currency', moedas: 'currencies', nome: 'name', nomes: 'names', notificacao: 'notification',
  notificador: 'notifier', notificar: 'notify', numero: 'number', objeto: 'object', objetos: 'objects',
  observador: 'observer', operacao: 'operation', ordem: 'order', pagina: 'page', paginas: 'pages',
  pagamento: 'payment', pagamentos: 'payments', palavra: 'word', palavras: 'words', parametro: 'parameter',
  parametros: 'parameters', particao: 'partition', particoes: 'partitions', pedido: 'order', pedidos: 'orders',
  pessoa: 'person', pessoas: 'people', preco: 'price', precos: 'prices', processado: 'processed',
  processar: 'process', produto: 'product', produtos: 'products', proximo: 'next', quantidade: 'quantity',
  recusar: 'reject', repositorio: 'repository', requisicao: 'request', requisicoes: 'requests',
  reserva: 'reservation', reservas: 'reservations', reservado: 'reserved', resposta: 'response',
  resultado: 'result', resultados: 'results', saque: 'withdrawal', sacar: 'withdraw', saldo: 'balance',
  salvar: 'save', senha: 'password', servico: 'service', servicos: 'services', sessao: 'session',
  simples: 'simple', sobrenome: 'lastName', tabela: 'table', tabelas: 'tables', tamanho: 'size',
  tentativa: 'attempt', tentativas: 'attempts', teste: 'test', testes: 'tests', titulo: 'title',
  titulos: 'titles', total: 'total', todos: 'all', turma: 'classGroup', usuario: 'user', usuarios: 'users',
  validar: 'validate', valor: 'value', valores: 'values', venda: 'sale', vendas: 'sales', verdadeiro: 'real',
  versao: 'version', vizinho: 'neighbor', vizinhos: 'neighbors', vazio: 'empty',
  afetada: 'affected', afetadas: 'affected', ao: 'On', ativo: 'active', correto: 'correct',
  deve: 'should', diferentes: 'different', favorito: 'favorite', fechado: 'closed', generico: 'generic',
  indisponivel: 'unavailable', inicial: 'initial', media: 'average', minha: 'my', meu: 'my',
  negativo: 'negative', parcial: 'partial', positivos: 'positive', privado: 'private', real: 'real',
  recusado: 'declined', tratar: 'handle', urgente: 'urgent', zerar: 'reset',
  abrir: 'open', acesso: 'access', acessar: 'access', acumulado: 'accumulator', adicional: 'additional',
  altura: 'height', antigo: 'previous', aplicar: 'apply', apontado: 'referenced', aponta: 'points',
  assinatura: 'signature', atualizacao: 'update', biblioteca: 'library', cafe: 'coffee', cachorro: 'dog',
  carrinho: 'cart', carro: 'car', circulo: 'circle', configuracao: 'configuration', contato: 'contact',
  cordas: 'strings', corpo: 'body', descrever: 'describe', destino: 'recipient', direita: 'right',
  editora: 'publisher', emitir: 'emit', esquerda: 'left', fatorar: 'factor', fatorial: 'factorial',
  fim: 'end', inicio: 'start', insercao: 'insertion', inverter: 'reverse', largura: 'width',
  lista: 'list', listas: 'lists', logexecucao: 'executionLog', logica: 'logic', meio: 'middle',
  mesclar: 'merge', motor: 'engine', observadores: 'observers', ordenado: 'sorted', ordenacao: 'sorting',
  pacote: 'package', pacotes: 'packages', par: 'pair', pequeno: 'small', ponto: 'point',
  quadrado: 'square', qtd: 'quantity', raio: 'radius', retangulo: 'rectangle', resumo: 'summary',
  robo: 'robot', somar: 'sum', somadigitos: 'sumDigits', suco: 'juice', tarefa: 'task', tarefas: 'tasks',
  texto: 'text', tipo: 'type', tipos: 'types', totalcriados: 'totalCreated', validacao: 'validation',
  variavel: 'variable', variaveis: 'variables', voador: 'flyer', volume: 'volume',
  aba: 'tab', acervo: 'catalog', acelerar: 'accelerate', acoplamento: 'coupling', acontecer: 'happen',
  adicionarinteiros: 'addIntegers', aleatoria: 'random', alcancado: 'reached', alcancaveis: 'reachable',
  alugar: 'rent', aluguel: 'rental', ampliado: 'widened', analisador: 'analyzer', anotacao: 'annotation',
  anotada: 'annotated', anotado: 'annotated', aplicacao: 'application', assinado: 'signed',
  assincrono: 'asynchronous', aumentar: 'increase', bancária: 'bank', bancaria: 'bank',
  boleto: 'bankSlip', bolsa: 'grant', cabecalho: 'header', calculadora: 'calculator',
  camada: 'layer', canal: 'channel', carregar: 'load', cartao: 'card', catalogo: 'catalog',
  categoria: 'category', categorias: 'categories', celula: 'cell', celulas: 'cells', cidade: 'city',
  classificar: 'classify', cliques: 'clicks', cobra: 'snake', coletas: 'collections', combustao: 'combustion',
  comer: 'eat', comparar: 'compare', comparavel: 'comparable', compensacao: 'compensation',
  composicao: 'composition', condicao: 'condition', conectar: 'connect', consulta: 'query', consultas: 'queries',
  consumidor: 'consumer', consumidores: 'consumers', contador: 'counter', contexto: 'context',
  controlador: 'controller', converter: 'convert', coordenada: 'coordinate', copia: 'copy',
  criacao: 'creation', critica: 'critical', dado: 'data', daqui: 'fromNow', degradavel: 'degradable',
  desacoplamento: 'decoupling', descricao: 'description', desserializar: 'deserialize', detalhes: 'details',
  dinheiro: 'cash', dolar: 'dollar', dominio: 'domain', dobro: 'double', dobrar: 'double',
  duracao: 'duration', eletrico: 'electric', emailcontato: 'publisherContactEmail', encerrar: 'close',
  encontrado: 'found', enriquecer: 'enrich', equipe: 'team', errado: 'wrong', escrever: 'write',
  escrita: 'writing', esquema: 'schema', escopo: 'scope', estado: 'state', executar: 'execute',
  execucao: 'execution', expresso: 'express', externo: 'external', externos: 'external',
  fachada: 'facade', falar: 'speak', falhar: 'fail', fila: 'queue', finalizar: 'complete',
  finalizados: 'completed', flexivel: 'flexible', fluxo: 'flow', fonte: 'source', futuro: 'future',
  genero: 'genre', generos: 'genres', generico: 'generic', grafo: 'graph', gravar: 'write',
  habitantes: 'residents', hoje: 'today', holerite: 'payslip', imagem: 'image', imprimir: 'print',
  increment: 'increment', incrementar: 'increment', incremento: 'increment', injecao: 'injection',
  inteiro: 'integer', inteiros: 'integers', intermediario: 'intermediate', invalida: 'invalid',
  liberada: 'released', liberar: 'release', liberado: 'released', lider: 'leader', lixo: 'garbage',
  longa: 'long', marcar: 'mark', maximo: 'maximum', medir: 'measure', memoria: 'memory',
  mensagem: 'message', mensagensrecebidas: 'receivedMessages', metricas: 'metrics', minimo: 'minimum',
  mockados: 'mocked', modelar: 'model', modelado: 'modeled', modelo: 'model', nacionalidade: 'nationality',
  nascimento: 'birthDate', navegador: 'browser', negocio: 'business', notificacoes: 'notifications',
  nota: 'grade', notas: 'grades', numeros: 'numbers', ocorrido: 'occurred', opcionais: 'optional',
  operacional: 'operational', origem: 'source', outro: 'other', outros: 'others', ouvir: 'listen',
  painel: 'dashboard', pais: 'country', parar: 'stop', parcelas: 'installments', pecas: 'parts',
  permissao: 'permission', persistencia: 'persistence', pessoa: 'person', pessoas: 'people',
  pneu: 'tire', pneus: 'tires', promocao: 'promotion', proprietario: 'owner', pronto: 'ready',
  publicar: 'publish', publicado: 'published', publica: 'public', puro: 'plain', quimica: 'chemistry',
  raiz: 'root', reagir: 'react', recurso: 'resource', recursos: 'resources', rejeitar: 'reject',
  relacionais: 'relational', relatorio: 'report', relevantes: 'relevant', registrar: 'register',
  registros: 'records', regra: 'rule', regras: 'rules', restante: 'remaining', restantes: 'remaining',
  reprocessar: 'reprocess', resolver: 'resolve', retomar: 'resume', revisao: 'review', rodar: 'run',
  saudacao: 'greeting', salario: 'salary', salariobase: 'baseSalary', seguranca: 'security',
  secreto: 'secret', secreta: 'secret', senha: 'password', servidor: 'server', situacao: 'status',
  soma: 'sum', superclasse: 'superclass', suspensao: 'suspension', tabuleiro: 'board',
  temporario: 'temporary', titular: 'accountHolder', topico: 'topic', trabalhador: 'worker',
  trabalhar: 'work', transacao: 'transaction', transacoes: 'transactions', transferir: 'transfer',
  transladar: 'translate', truncado: 'truncated', unitario: 'unit', valida: 'validates', valido: 'valid',
  vencimento: 'dueDate', verificar: 'verify', versaoesperada: 'expectedVersion', visitados: 'visited',
  visualizacoes: 'views', vivo: 'alive', voltar: 'return',
  antes: 'Before', apos: 'After', dentro: 'Inside', fora: 'Outside', primeiro: 'First', segundo: 'Second',
  aceito: 'accepted', consultar: 'query', dificil: 'difficult', dir: 'right', esq: 'left',
  gerar: 'generate', genericos: 'generics', instancia: 'instance', instancias: 'instances',
  pagina: 'page', som: 'sound', como: 'As', confirmar: 'confirm', corretamente: 'correctly',
  depositar: 'deposit', encontrar: 'find', existe: 'exists', externa: 'external', persistente: 'persistent',
  configurar: 'configure', imprimivel: 'printable',
  chamar: 'call', finalizando: 'completing', instanciar: 'instantiate', instanciacao: 'instantiation',
  ola: 'hello', sucesso: 'success',
  imprimir: 'print', processados: 'processed', propriedades: 'properties', rejeita: 'rejects', retornar: 'return',
  por: 'By', para: 'For', com: 'With', sem: 'Without', de: 'Of', do: 'Of', da: 'Of',
  em: 'In', no: 'In', na: 'In', e: 'And', ou: 'Or', quando: 'When', onde: 'Where',
  nao: 'Not', ja: 'Already', maior: 'Greater', menor: 'Less', mesmo: 'Same', nova: 'New', novo: 'New'
}));

const phraseMap = [
  ['não encontrado', 'not found'], ['não encontrada', 'not found'], ['nao encontrado', 'not found'],
  ['saldo insuficiente', 'insufficient balance'], ['estoque insuficiente', 'insufficient inventory'],
  ['item indisponível', 'item unavailable'], ['item indisponivel', 'item unavailable'],
  ['credenciais inválidas', 'invalid credentials'], ['credenciais invalidas', 'invalid credentials'],
  ['idade inválida', 'invalid age'], ['idade invalida', 'invalid age'], ['pedido fechado', 'closed order'],
  ['pagamento recusado', 'payment declined'], ['erro interno', 'internal error'],
  ['olá, mundo', 'Hello, World'], ['olá mundo', 'Hello World'], ['seu-email', 'your-email'],
  ['nome completo', 'full name'], ['data de empréstimo', 'loan date'], ['data de emprestimo', 'loan date'],
  ['chave secreta', 'secret key'], ['serviço de', 'service for'], ['servico de', 'service for'],
  ['lista vazia', 'empty list'], ['valor inválido', 'invalid value'], ['valor invalido', 'invalid value'],
  ['processando', 'processing'], ['validando', 'validating'], ['nenhum livro', 'no book'],
  ['livro disponível', 'book available'], ['livro disponivel', 'book available'],
  ['já existe', 'already exists'], ['ja existe', 'already exists'], ['empréstimo', 'loan'],
  ['caminho feliz', 'happy path'], ['próxima tentativa', 'next attempt'], ['proxima tentativa', 'next attempt']
];

const commentPhraseMap = [
  ['a jvm interpreta/compila-jit o bytecode e executa', 'the JVM interprets or JIT-compiles the bytecode and runs it'],
  ['a jvm chama main sem criar um objeto main antes', 'the JVM calls main without creating a Main object first'],
  ['dado o array, conte quantos números são positivos', 'given the array, count how many numbers are positive'],
  ['decomposição em português antes do código', 'decomposition before writing code'],
  ['só agora traduzir para java', 'only now express the solution in Java'],
  ['encapsulamento de verdade', 'real encapsulation'],
  ['encapsulamento "de fachada"', 'superficial encapsulation'],
  ['programa contra a interface, instancie a implementação', 'program to the interface and instantiate the implementation'],
  ['sempre relance', 'always rethrow'], ['nunca registre args', 'never log args'], ['nunca use', 'never use'],
  ['não compila', 'does not compile'], ['nao compila', 'does not compile'],
  ['não retorna', 'does not return'], ['nao retorna', 'does not return'],
  ['não altera', 'does not change'], ['nao altera', 'does not change'],
  ['não existe', 'does not exist'], ['nao existe', 'does not exist'],
  ['não resolve', 'does not solve'], ['nao resolve', 'does not solve'],
  ['de verdade', 'in practice'], ['ao redor', 'around'], ['a partir de', 'from'],
  ['em vez de', 'instead of'], ['por baixo dos panos', 'under the hood'],
  ['linha de comando', 'command line'], ['código-fonte', 'source code'], ['code-fonte', 'source code'],
  ['caso base', 'base case'], ['caso recursivo', 'recursive case'],
  ['tempo de compilação', 'compile time'], ['tempo de execução', 'runtime'],
  ['uma única vez', 'only once'], ['uma unica vez', 'only once'], ['cada vez', 'each time'],
  ['qualquer subtipo', 'any subtype'], ['qualquer supertipo', 'any supertype']
];

const proseMap = new Map(Object.entries({
  a: 'the', acima: 'above', agora: 'now', ainda: 'still', alem: 'beyond', algo: 'something', algum: 'some',
  ao: 'to the', aos: 'to the', apenas: 'only', apos: 'after', aqui: 'here', as: 'the', assim: 'this way',
  ate: 'until', automaticamente: 'automatically', cada: 'each', chama: 'calls', chamar: 'call', chamado: 'called',
  classe: 'class', codigo: 'code', com: 'with', como: 'as', consegue: 'can', continuam: 'remain',
  cria: 'creates', criar: 'create', da: 'of the', das: 'of the', de: 'of', deixa: 'makes', dela: 'its',
  delas: 'their', dele: 'its', deles: 'their', dentro: 'inside', depois: 'after', deve: 'must', devem: 'must',
  devolve: 'returns', do: 'of the', dos: 'of the', durante: 'during', e: 'and', ela: 'it', elas: 'they',
  ele: 'it', eles: 'they', em: 'in', encontra: 'finds', enquanto: 'while', entao: 'then', entre: 'between',
  era: 'was', essa: 'this', essas: 'these', esse: 'this', esses: 'these', esta: 'is', estao: 'are',
  este: 'this', estes: 'these', existir: 'exist', existe: 'exists', externa: 'external', externo: 'external',
  faz: 'does', fazer: 'do', foi: 'was', fora: 'outside', garante: 'ensures', guarda: 'stores', ha: 'there is',
  independente: 'independently', instancia: 'instance', isso: 'this', isto: 'this', ja: 'already', lado: 'side',
  le: 'reads', mais: 'more', mas: 'but', mesmo: 'same', metodo: 'method', muda: 'changes', mudou: 'changed',
  muito: 'very', na: 'in the', nao: 'not', nas: 'in the', nem: 'nor', nenhuma: 'no', nenhum: 'no',
  no: 'in the', nos: 'in the', nova: 'new', novo: 'new', o: 'the', objeto: 'object', os: 'the',
  ou: 'or', para: 'to', parte: 'part', pela: 'by the', pelas: 'by the', pelo: 'by the', pelos: 'by the',
  pode: 'can', podem: 'can', por: 'by', porque: 'because', precisa: 'needs to', precisam: 'need to',
  primeiro: 'first', qual: 'which', quando: 'when', que: 'that', quem: 'who', recebe: 'receives',
  referencia: 'reference', roda: 'runs', se: 'if', sem: 'without', sempre: 'always', sendo: 'being',
  seu: 'its', seus: 'its', so: 'only', sobre: 'about', sua: 'its', suas: 'its', tambem: 'also',
  tem: 'has', termina: 'ends', tipo: 'type', todos: 'all', troca: 'changes', um: 'a', uma: 'a',
  usa: 'uses', usado: 'used', valor: 'value', veja: 'see', vez: 'time', voce: 'you', voces: 'you',
  abre: 'opens', abrir: 'open', aceita: 'accepts', aceito: 'accepted', acesso: 'access', acessar: 'access',
  adiciona: 'adds', adicionar: 'add', aguarda: 'waits for', alvo: 'target', altera: 'changes', alterado: 'changed',
  ambiguidade: 'ambiguity', amanha: 'tomorrow', antigo: 'previous', apagar: 'delete', aponta: 'points',
  apontado: 'referenced', argumentos: 'arguments', arredonda: 'round', aspecto: 'aspect', assinatura: 'signature',
  assincrono: 'asynchronous', atributo: 'field', atributos: 'fields', atualiza: 'updates', atualizacao: 'update',
  avisa: 'signals', baixo: 'below', baixe: 'download', barato: 'cheaper', bloquear: 'block', bloqueia: 'blocks',
  chamada: 'call', chamador: 'caller', chamando: 'calling', chato: 'boilerplate', cima: 'above', claro: 'clear',
  comecar: 'start', combina: 'combines', comentario: 'comment', comentarios: 'comments', compartilhado: 'shared',
  compativel: 'compatible', compilacao: 'compilation', compilado: 'compiled', compila: 'compiles',
  compilador: 'compiler', comprometida: 'compromised', condicao: 'condition', configure: 'configure',
  configuracao: 'configuration', conecta: 'connects', conectar: 'connect', considerada: 'considered',
  considerados: 'considered', constante: 'constant', contem: 'contains', conter: 'contain', continua: 'continues',
  controle: 'tracking', convencao: 'convention', correspondentes: 'corresponding', custo: 'cost', cuidado: 'warning',
  dados: 'data', decide: 'decides', declarados: 'declared', declarativo: 'declarative', delega: 'delegates',
  demais: 'remaining', dependencia: 'dependency', dependencias: 'dependencies', descrever: 'describe',
  descoberto: 'discovered', descarta: 'discards', desde: 'since', desnecessarios: 'unnecessary',
  destino: 'recipient', digitado: 'typed', digito: 'digit', dinamicamente: 'dynamically', direto: 'directly',
  distintos: 'distinct', duas: 'two', efeito: 'effect', empilhar: 'push', engolir: 'swallow', entrada: 'input',
  erro: 'error', espalhado: 'scattered', espera: 'waits for', esperada: 'expected', especificar: 'specify',
  especifico: 'specific', estatisticas: 'statistics', estrutura: 'structure', evite: 'avoid', executa: 'runs',
  existente: 'existing', existentes: 'existing', explicito: 'explicit', expoe: 'exposes', fazendo: 'doing',
  falsa: 'false', falha: 'failure', falhou: 'failed', fachada: 'superficial', feito: 'done', feliz: 'happy',
  finalizada: 'completed', finalizacao: 'completion', funciona: 'works', funcionamento: 'operation',
  gerada: 'generated', gera: 'generates', gigantes: 'huge', grave: 'serious', graves: 'serious',
  habilitado: 'enabled', herdados: 'inherited', identidade: 'identity', ignorada: 'ignored', ignora: 'ignores',
  impede: 'prevents', implicito: 'implicit', imprime: 'prints', incluindo: 'including', indice: 'index',
  ingenua: 'naive', injecao: 'injection', injeta: 'injects', injetado: 'injected', instalado: 'installed',
  instalacao: 'installation', instalador: 'installer', instale: 'install', instancias: 'instances',
  inteiro: 'entire', interpreta: 'interprets', iteracao: 'iteration', iterativa: 'iterative', juntos: 'together',
  lanca: 'throws', largura: 'width', leitura: 'reading', legivel: 'readable', licao: 'lesson', listar: 'list',
  lida: 'read', limite: 'limit', limpa: 'cleans', locais: 'local', logica: 'logic', magico: 'magic',
  maquina: 'machine', mantem: 'keeps', manualmente: 'manually', medo: 'fear', memoria: 'memory',
  metade: 'half', milhares: 'thousands', minima: 'minimum', mistura: 'mixes', modificar: 'modify',
  modificador: 'modifier', modifica: 'modifies', montagem: 'assembly', necessario: 'necessary', ninguem: 'nobody',
  nomeado: 'named', numeros: 'numbers', obrigatorio: 'required', operacoes: 'operations', ordenado: 'sorted',
  ordem: 'order', pacote: 'package', padrao: 'default', parametro: 'parameter', passada: 'pass', pena: 'worthwhile',
  perigoso: 'dangerous', pessoa: 'person', preencher: 'fill', preenchido: 'filled', primeira: 'first',
  problemas: 'problems', processamento: 'processing', producao: 'production', programacao: 'programming',
  projetos: 'projects', propria: 'own', publicos: 'public', qualquer: 'any', quebrar: 'break', quebra: 'breaks',
  reais: 'actual', reatribuicao: 'reassignment', recalcula: 'recomputes', recupera: 'recovers',
  referencias: 'references', registrar: 'log', relacionamento: 'relationship', remocao: 'removal',
  renomeado: 'renamed', responder: 'answer', responsabilidade: 'responsibility', responsabilidades: 'responsibilities',
  resto: 'remainder', retornos: 'returns', retorna: 'returns', rodar: 'run', saber: 'know', saida: 'output',
  sai: 'exits', segunda: 'second', separado: 'separate', separar: 'separate', seria: 'would be',
  silenciosamente: 'silently', soma: 'sum', sozinho: 'alone', sobrescreve: 'overrides',
  sobrescrever: 'override', substituida: 'replaced', tarefa: 'task', terminarem: 'finish', terminar: 'finish',
  texto: 'text', toca: 'touches', toda: 'every', totalmente: 'fully', trazendo: 'fetching', travar: 'block',
  travado: 'coupled', tres: 'three', unica: 'single', ultimo: 'last', usada: 'used', usando: 'using',
  util: 'useful', verdade: 'practice', verdes: 'green', velocidade: 'speed', vem: 'comes',
  versionado: 'versioned', vira: 'becomes', visivel: 'visible'
}));

const connectorWords = new Set(['ao', 'com', 'da', 'de', 'do', 'e', 'em', 'na', 'nao', 'no', 'ou', 'para', 'por', 'sem']);

const identifierOverrides = new Map(Object.entries({
  ContaBancaria: 'BankAccount', ContaBancariaTest: 'BankAccountTest', Imprimivel: 'Printable',
  dobra: 'doubleNumber', LogExecucao: 'ExecutionLog', LogExecucaoAspect: 'ExecutionLogAspect',
  ConfiguracaoApp: 'AppConfiguration', ContainerSimples: 'SimpleContainer',
  casoDeUso: 'useCase', CasoDeUso: 'UseCase', marcarComoProcessado: 'markAsProcessed',
  ProcessadorPedidoPix: 'PixOrderProcessor', PedidoInvalidoException: 'InvalidOrderException',
  LivroNaoEncontradoException: 'BookNotFoundException', UsuarioNaoEncontradoException: 'UserNotFoundException',
  LivroRepositoryEmMemoria: 'InMemoryBookRepository', LivroRepositoryDataJpaTest: 'BookRepositoryDataJpaTest',
  FalhaIntegracao: 'IntegrationFailure', RelatorioTemporario: 'TemporaryReport',
  ConexaoExternaService: 'ExternalConnectionService', conexaoPersistente: 'persistentConnection'
}));

const codeLineOverrides = new Map([
  ['as duas leram "5", as duas calcularam "6",', 'both read "5", and both calculated "6",']
]);

function normalized(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function capitalize(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

function identifierParts(token) {
  return token
    .replace(/([a-zà-ÿ0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-zà-ÿ])/g, '$1 $2')
    .replace(/([\p{L}])(\d+)/gu, '$1 $2')
    .split(/([_-])/)
    .flatMap(part => part === '_' || part === '-' ? [part] : part.split(/\s+/))
    .filter(Boolean);
}

function translatedWord(word) {
  return wordMap.get(normalized(word)) ?? word;
}

function translateIdentifier(token) {
  const override = identifierOverrides.get(token);
  if (override) return override;
  const parts = identifierParts(token);
  if (parts.length === 1 && connectorWords.has(normalized(parts[0]))) return token;
  const hasTranslation = parts.some(part => part !== '_' && part !== '-' && wordMap.has(normalized(part)));
  if (!hasTranslation) return token;
  const translated = parts.map(part => part === '_' || part === '-' ? part : translatedWord(part));
  if (token === token.toUpperCase()) return translated.join('').toUpperCase();
  if (token.includes('_') || token.includes('-')) {
    return translated.map(part => part === '_' || part === '-' ? part : part.toLowerCase()).join('');
  }
  const words = translated.filter(part => part !== '_' && part !== '-');
  const pascal = /^[A-ZÀ-Ý]/.test(token);
  return words.map((word, index) => index === 0 && !pascal ? word[0].toLowerCase() + word.slice(1) : capitalize(word)).join('');
}

function applyPhrases(value) {
  let output = value;
  for (const [source, target] of phraseMap) output = output.replaceAll(new RegExp(source, 'giu'), target);
  return output;
}

function applyCommentPhrases(value) {
  let output = applyPhrases(value);
  for (const [source, target] of commentPhraseMap) output = output.replaceAll(new RegExp(source, 'giu'), target);
  return output;
}

function preserveInitialCase(source, target) {
  return /^[A-ZÀ-Ý]/.test(source) ? capitalize(target) : target;
}

function translateProseText(value) {
  const exact = exactCommentTranslations.get(value.trim());
  if (exact) {
    const leadingWhitespace = value.match(/^\s*/)?.[0] ?? '';
    return leadingWhitespace + exact
      .replace(/[\p{L}_$][\p{L}\p{N}_$-]*/gu, translateIdentifier)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  const phrased = applyCommentPhrases(value);
  return phrased.replace(/[\p{L}_$][\p{L}\p{N}_$-]*/gu, token => {
    const prose = proseMap.get(normalized(token));
    if (prose) return preserveInitialCase(token, prose);
    const codeWord = wordMap.get(normalized(token));
    if (codeWord) return preserveInitialCase(token, codeWord);
    return translateIdentifier(token);
  }).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function translateStringText(value) {
  const quote = value.match(/^("""|"|'|`)([\s\S]*)(\1)$/);
  const delimiter = quote?.[1] ?? '';
  const content = quote?.[2] ?? value;
  if (!/[\p{L}]/u.test(content)) return value;

  const pathLike = /^(?:https?:\/\/)?[\w@./:-]+$/u.test(content);
  const properName = /^(?:[A-Z][\p{L}'-]+)(?:\s+(?:d[aeo]s?|[A-Z][\p{L}'-]+))+$/u.test(content)
    && !(content.match(/[\p{L}]+/gu) ?? []).some(token => wordMap.has(normalized(token)) && !connectorWords.has(normalized(token)));
  let translated = content;
  if (pathLike) {
    translated = content.replace(/[\p{L}_$][\p{L}\p{N}_$-]*/gu, token =>
      normalized(token) === 'com' ? token : translateIdentifier(token)
    );
  } else if (!properName) translated = translateProseText(content);
  return `${delimiter}${translated}${delimiter}`;
}

function translateCodeSegment(value) {
  const pieces = value.split(/("""[\s\S]*?"""|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g);
  return pieces.map((piece, index) => index % 2
    ? translateStringText(piece)
    : piece.replace(/[\p{L}_$][\p{L}\p{N}_$-]*/gu, translateIdentifier)
  ).join('');
}

export function translateCodeText(value) {
  let inBlockComment = false;
  return value.split('\n').map(line => {
    const lineOverride = codeLineOverrides.get(line.trim());
    if (lineOverride) return `${line.match(/^\s*/)?.[0] ?? ''}${lineOverride}`;
    if (inBlockComment) {
      inBlockComment = !line.includes('*/');
      return translateProseText(line);
    }
    const commentIndex = [line.indexOf('//'), line.indexOf('# '), line.indexOf('-- '), line.indexOf('/*')]
      .filter(index => index >= 0)
      .sort((left, right) => left - right)[0];
    const code = commentIndex === undefined ? line : line.slice(0, commentIndex);
    const comment = commentIndex === undefined ? '' : line.slice(commentIndex);
    if (comment.startsWith('/*') && !comment.includes('*/')) inBlockComment = true;
    const translatedCode = translateCodeSegment(code);
    return translatedCode + (comment ? translateProseText(comment) : '');
  }).join('\n').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function translateCodeElement(element) {
  const walker = element.ownerDocument.createTreeWalker(element, 4);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const semanticParent = node.parentElement?.closest('.com, .str');
    node.nodeValue = semanticParent?.classList.contains('com')
      ? translateProseText(node.nodeValue ?? '')
      : semanticParent?.classList.contains('str')
        ? translateStringText(node.nodeValue ?? '')
        : translateCodeText(node.nodeValue ?? '');
  });
}

const forbiddenIdentifierParts = [
  'adicionar', 'aluno', 'arquivo', 'autor', 'buscar', 'calcular', 'campo', 'cliente', 'conta', 'contador',
  'criar', 'deletar', 'desconto', 'devolver', 'disponivel', 'emprestar', 'enviar', 'estoque', 'estagiario',
  'evento', 'excecao', 'executar', 'exibir', 'funcionario', 'gerente', 'idade', 'invalido', 'livro', 'mensagem',
  'metodo', 'nome', 'notificador', 'notificar', 'objeto', 'pagamento', 'paginas', 'pedido', 'preco', 'processar',
  'produto', 'quantidade', 'recusar', 'repositorio', 'requisicao', 'resposta', 'resultado', 'sacar', 'saldo',
  'salvar', 'senha', 'servico', 'titulo', 'usuario', 'validar', 'valor', 'venda',
  'bancaria', 'biblioteca', 'caso', 'configurar', 'corretamente', 'depositar', 'encontrar', 'externa',
  'gerar', 'imprimivel', 'instancia', 'livro', 'modelo', 'paginas', 'pedido', 'persistente',
  'processados', 'propriedades', 'rejeita', 'retornar', 'salario', 'somar'
];

export function findPortugueseCodeIdentifiers(value) {
  const identifiers = value.match(/[\p{L}_$][\p{L}\p{N}_$-]*/gu) ?? [];
  return [...new Set(identifiers.filter(identifier => {
    const parts = identifierParts(identifier)
      .filter(part => part !== '_' && part !== '-')
      .map(normalized);
    return parts.some(part => forbiddenIdentifierParts.includes(part));
  }))];
}
