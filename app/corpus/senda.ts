import type { Citacao, Grau } from './tipos';

/**
 * A senda sétupla na ordem da Segunda Epístola de Pedro, tal como o livro a lê.
 *
 * A fé NÃO é um degrau: é a chave, a posse consciente do átomo primordial
 * (II-1 p. 191; II-2 p. 195). Ela entra como grau 0 — o estado dialético com a
 * rosa desperta, que é também o estado base da cena.
 */
export interface DegrauBruto {
  grau: Grau;
  nome: string;
  mudancaCorporal: string;
  descricao: string;
  citacoes: readonly Citacao[];
}

export const DEGRAUS_BRUTOS: readonly DegrauBruto[] = [
  {
    grau: 0,
    nome: 'Fé',
    mudancaCorporal: 'A rosa é despertada; o eu ainda governa.',
    descricao:
      'A fé não é um degrau da senda, mas a chave que os abre. O livro a define contra o uso corrente da palavra: não é aceitar uma doutrina, uma igreja ou um deus, e sim uma posse de que se tem de estar consciente, no santuário do coração. Enquanto o átomo primordial não estiver desperto, tudo o mais é falatório dialético.',
    citacoes: [
      {
        texto:
          'o átomo primordial, o átomo-centelha-do-espírito, tem de ser vivificado. Não se pode de nenhum modo falar de fé antes que esse átomo esteja desperto.',
        capitulo: 'II-1',
        pagina: 191,
      },
    ],
  },
  {
    grau: 1,
    nome: 'Virtude',
    mudancaCorporal:
      'Vivificação do sangue; o timo é reativado e a pequena circulação se acende.',
    descricao:
      'O primeiro degrau não é uma decisão moral: é uma nova estrutura sanguínea. Quando o candidato se confia ao átomo primordial em autorrendição, o sangue é vivificado, e é sobre essa base que ele se torna apto à senda. Virtude, aqui, significa seguir espontaneamente as diretrizes da Gnosis com base na nova posse sanguínea.',
    citacoes: [
      {
        texto:
          'Essa vivificação do sangue constitui o primeiro degrau da senda sétupla e é denominada, na Epístola de Pedro, virtude.',
        capitulo: 'II-2',
        pagina: 195,
      },
      {
        texto:
          'Virtude aqui significa seguir espontaneamente as diretrizes da Gnosis com base na nova posse sanguínea.',
        capitulo: 'II-2',
        pagina: 195,
      },
    ],
  },
  {
    grau: 2,
    nome: 'Conhecimento',
    mudancaCorporal:
      'O archote da pineal é inflamado; o cundalini irradia luz policromática.',
    descricao:
      'Sobre a nova base sanguínea, a vibração do átomo primordial e as funções hormonais dela resultantes realizam um processo no santuário da cabeça. O archote da pineal se inflama, e com ele abre-se uma ligação de primeira mão com a luz universal da Gnosis. Junto com os éteres mentais da natureza adentram o sistema os éteres da nova natureza: começa a segunda luta.',
    citacoes: [
      {
        texto:
          'O archote da pineal é inflamado, em consequência do que o aluno entra em ligação de primeira mão com a luz universal da Gnosis.',
        capitulo: 'II-3',
        pagina: 204,
      },
    ],
  },
  {
    grau: 3,
    nome: 'Autodomínio',
    mudancaCorporal:
      'Os hemisférios se reorientam; o pensamento e a vontade seguem a nova voz.',
    descricao:
      'Com os dois santuários abertos, o aluno passa a ter duas considerações do coração e duas ponderações do intelecto: a voz interior da Gnosis e a voz da natureza comum. O autodomínio é o que decide qual delas comanda. É o degrau em que a velha natureza cala.',
    citacoes: [
      {
        texto:
          'a voz interior da Gnosis e a voz da natureza comum',
        capitulo: 'II-3',
        pagina: 208,
      },
      {
        texto: 'Uma nova força veio a vós',
        capitulo: 'II-3',
        pagina: 208,
      },
    ],
  },
  {
    grau: 4,
    nome: 'Perseverança',
    mudancaCorporal:
      'A flama torna-se um candelabro a arder ininterruptamente; o plexo solar silencia.',
    descricao:
      'O quarto degrau não acrescenta um órgão: torna contínuo o que era intermitente. Quando a flama da nova luz se tornou um candelabro a arder ininterruptamente, uma força ígnea proveniente dos ossos aflui pelo santuário do coração rumo à cabeça — e é ela que torna possível o quinto degrau.',
    citacoes: [
      {
        texto:
          'Quando a flama da nova luz sobre o quarto degrau se tornou em um candelabro a arder ininterruptamente, pode-se falar de uma força ígnea proveniente dos ossos que aflui via santuário do coração e prossegue rumo à cabeça.',
        capitulo: 'II-5',
        pagina: 223,
      },
    ],
  },
  {
    grau: 5,
    nome: 'Piedade',
    mudancaCorporal:
      'Segundo fogo serpentino no simpático: Pingalá e Idá, o plexo sacro, novo sistema nervoso, novos hormônios, novo fluido sanguíneo, nova personalidade.',
    descricao:
      'É aqui que quinze das quarenta e duas estruturas deste atlas mudam de estado ao mesmo tempo, e o livro diz por quê: a piedade É a mudança corporal. Um segundo fogo serpentino é formado no simpático, porque o primeiro não pode receber o novo éter de hidrogênio sem explodir. Fechado o circuito da torre dos mistérios, uma personalidade inteiramente nova é erguida na velha, porém fora dela.',
    citacoes: [
      {
        texto:
          'Essa mudança corporal é que é a piedade! Ela manifesta-se no quinto degrau da senda sétupla.',
        capitulo: 'II-5',
        pagina: 222,
      },
      {
        texto:
          'Por isso é formado um segundo fogo serpentino no corpo do candidato, que, enquanto for necessário, ainda tem de viver segundo a natureza.',
        capitulo: 'II-5',
        pagina: 224,
      },
      {
        texto:
          'o simpático, tocado assim pela força gnóstica, transformar-se-á em um novo sistema nervoso, uma mudança literal do corpo acontece',
        capitulo: 'II-5',
        pagina: 226,
      },
    ],
  },
  {
    grau: 6,
    nome: 'Amor fraternal',
    mudancaCorporal:
      'Nenhuma estrutura nova se acende: o trabalho se volta para fora, e a extinção da coluna comum começa.',
    descricao:
      'O sexto degrau é o único que não ativa nenhuma estrutura, e isso é fiel ao livro: o que muda aqui não é o corpo, mas a direção. A luz que sobe pelo cordão esquerdo torna-se posse pessoal do aluno, e por isso transmissível a outros — confere um apostolado. Na cena, é onde a coluna comum e o fogo da consciência começam a se apagar, rumo à extinção do sétimo.',
    citacoes: [
      {
        texto: 'Essa nova força de luz sobe pelo cordão esquerdo do simpático.',
        capitulo: 'II-8',
        pagina: 245,
      },
      {
        texto:
          'Ela é uma força verdadeiramente divina, nascida na carne, e confere um apostolado',
        capitulo: 'II-9',
        pagina: 253,
      },
    ],
  },
  {
    grau: 7,
    nome: 'Amor',
    mudancaCorporal:
      'A coluna comum é extinta na endura; o ser aural é demolido; ergue-se a cidade com as doze portas.',
    descricao:
      'O último degrau é uma subtração, não um acréscimo. O antigo fogo serpentino se extingue de maneira completamente não forçada, no caminho da endura, e só então o fogo da renovação pode adentrar aquele sistema. O ser aural se demole na medida em que o eu se demole, e os focos pré-luciferinos, adormecidos há éons, podem reacender.',
    citacoes: [
      {
        texto:
          'quando o antigo fogo serpentino do sistema espinal comum é extinto de maneira completamente não forçada e natural no caminho da endura, e o fogo da renovação pode adentrar esse sistema',
        capitulo: 'II-5',
        pagina: 225,
      },
      {
        texto: 'ele será demolido à medida que nós mesmos nos demolirmos na endura',
        capitulo: 'I-17',
        pagina: 169,
      },
      {
        texto:
          'Mediante o maravilhoso campo do simpático torna-se possível construir a cidade com as doze portas da libertação.',
        capitulo: 'II-5',
        pagina: 227,
      },
    ],
  },
];
