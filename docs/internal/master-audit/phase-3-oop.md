# Auditoria Mestre — Fase 3: orientação a objetos e modelagem

Data: 2026-08-21

Status: concluída.

## Escopo aprovado

A fase revisou os capítulos de POO como uma progressão única, começando pela diferença entre classe, objeto e referência e terminando em relações consistentes entre objetos. O projeto de biblioteca passou para depois de associações e cardinalidade.

| Ordem | Capítulo | Pré-requisito efetivo | Conceitos introduzidos | Decisão principal da revisão |
|---:|---|---|---|---|
| 1 | `classes` | `mini-caixa-eletronico` | classe/instância; identidade/referência; alcance/coleta | Separa modelo conceitual de memória de detalhes de implementação e não promete stack/heap como regra absoluta. |
| 2 | `atributos` | `classes` | estado/comportamento; campo de instância; comando/consulta | Mostra campo como memória do objeto e parâmetro/local como dados temporários. |
| 3 | `construtores` | `atributos` | construção válida; `this(...)`; construtor padrão | Ensina o caso simples antes de qualquer hierarquia e distingue construtor implícito de construtor vazio explícito. |
| 4 | `encapsulamento` | `construtores` | invariantes; controle de acesso; imutabilidade | Substitui setters automáticos por operações de domínio e esclarece que referência `final` não torna o objeto imutável. |
| 5 | `static` | `encapsulamento` | membro de classe; constante; objeto atual | Distingue estado da classe e da instância sem antecipar coleções. |
| 6 | `heranca` | `static` | subtipo; `super`; herança versus composição | Reserva `extends` para relações “é um” e pratica colaboração para relações “tem um”. |
| 7 | `polimorfismo` | `heranca` | substituição; despacho dinâmico; tipo estático/real | Explica compilação e execução separadamente sem transformar `vtable` em exigência da linguagem. |
| 8 | `abstracao` | `polimorfismo` | escolha de relevância; classe/método abstrato; fluxo obrigatório | Abstração aparece antes como decisão de modelagem; o nome de padrão futuro deixa de ser requisito. |
| 9 | `interfaces` | `abstracao` | contrato; múltiplas capacidades; métodos `default` | Usa contratos tipados e resolve conflito explicitamente, sem casts ou lambdas prematuros. |
| 10 | `pilares-profundo` | `interfaces` | cooperação entre mecanismos; custos de modelagem | Remove ranking profissional e conecta decisões por responsabilidade, contrato, variação e acoplamento. |
| 11 | `associacoes-cardinalidade` | `pilares-profundo` | direção; cardinalidade; ciclo de vida; consistência | Novo capítulo ensina relações em memória com referências, arrays e invariantes antes de ORM ou banco. |
| 12 | `mini-biblioteca-cli` | `associacoes-cardinalidade` | projeto POO incremental; evidência de invariantes | Projeto limitado ao repertório disponível, com domínio antes da CLI e verificação manual reproduzível. |

## Correções de dependência e profundidade

- A ordem efetiva do módulo agora é classes → atributos → construtores → encapsulamento → `static` → herança → polimorfismo → abstração → interfaces → integração dos pilares → associações → projeto.
- Nenhum capítulo aprovado depende de Collections, banco, ORM, frameworks, exceções personalizadas, testes automatizados, retry ou timeout.
- `Scanner` aparece no projeto somente na fronteira CLI, depois de ter sido ensinado em Fundamentos; regras do domínio permanecem executáveis sem terminal.
- Construtores não são tratados como métodos e a existência do construtor padrão é condicionada à ausência de construtores declarados.
- Despacho dinâmico é ensinado pelo comportamento exigido pela linguagem; estratégia interna da JVM não é apresentada como garantia normativa.
- Associação bidirecional não é padrão automático. Direção, mínimo, máximo, ownership e operação responsável precisam ser justificados pelo caso de uso.

## Contrato pedagógico aplicado

Cada capítulo aprovado possui motivação específica, ponte intuitiva com limite, conceitos introduzidos e reutilizados, bloco semântico adequado ao assunto, explicação de todos os códigos tipados, erros comuns, prática, quiz autoral com racional por alternativa e recursos oficiais auditados.

O capítulo de associações acrescenta:

- modelo mental de grafo de referências;
- tabela de cardinalidade `0..1`, `1` e `0..N` limitado;
- exemplo executável por raciocínio com array e contador;
- exercício em que a relação vira classe por possuir dados e regras;
- distinção entre associação, agregação e composição pelo ciclo de vida, não pelo desenho de um losango.

## Projeto de biblioteca

O projeto começa por contratos e invariantes, evolui por fatias compiláveis e adiciona o console por último. Sua matriz liga cada requisito a conceitos e capítulos anteriores:

| Requisito | Base já ensinada | Evidência |
|---|---|---|
| tipos e instâncias | classes e construtores | dois itens com identidade e estado independentes |
| estado válido | atributos e encapsulamento | segunda tentativa de empréstimo é recusada sem mudança |
| variação de itens | polimorfismo e interfaces | livro e revista respondem pelo mesmo contrato em array |
| relações | associações e cardinalidade | empréstimo liga exatamente um usuário e um item de forma coerente |
| armazenamento limitado | laços e arrays | última posição funciona; posição além da capacidade é recusada |
| CLI | entrada pelo console e primeiro projeto | entrada inválida e EOF não violam o domínio |

A verificação desta fase é manual e registra preparação, ação, resultado esperado e observado. Automação de testes só passa a ser exigida depois do capítulo que a ensina.

## Evidência automatizada

`npm run validate:depth` exige a aprovação exata dos 12 capítulos da Fase 2 e dos 12 capítulos desta fase. O gate rejeita aprovação com lacuna, dependência futura, recurso não auditado, quiz sem racional, código sem explicação ou projeto sem matriz de conhecimento.

Resultado da auditoria pedagógica:

- 149 capítulos rastreados;
- 24 aprovados;
- 125 reprovados na triagem e preservados como backlog explícito;
- 71 conceitos registrados;
- 0 violações de ordem ou referência no grafo de conceitos;
- 12 dependências futuras restantes fora da fase.

## Fontes e artefatos

- Conteúdo pedagógico da fase: `platform/content/oop-phase-3.json`.
- Novo capítulo estruturado: `platform/src/content/required-chapters.ts`.
- Corpos legados revisados: `classes.html` até `mini-biblioteca-cli.html` no escopo da fase.
- Transformação e ordenação: `scripts/generate-course-content.mjs` e `platform/src/content/course.ts`.
- Prova de origem: `platform/public/content/source-inventory.json`.
- Relatórios regeneráveis: `phase-0-inventory.json`, `chapter-audit-matrix.csv` e grafos em `docs/internal/master-audit/`.

## Checklist de encerramento

- [x] Os 12 capítulos foram inspecionados em sequência.
- [x] Associações antecedem o projeto que precisa delas.
- [x] Nenhum capítulo aprovado usa conceito futuro silencioso.
- [x] Todos os códigos tipados possuem explicação e erros comuns.
- [x] Quizzes de compatibilidade por título foram removidos da fase.
- [x] Todas as alternativas possuem racional específico.
- [x] Recursos oficiais são específicos e possuem relevância declarada.
- [x] O projeto contém matriz de conhecimento e evidência reproduzível.
- [x] O grafo contém 0 violações nos 71 conceitos registrados.
- [x] O gate pedagógico aprova exatamente 24 capítulos acumulados.
- [ ] Demais 125 capítulos — próximas fases curriculares.
