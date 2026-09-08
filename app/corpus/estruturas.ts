import type { Estrutura, Vec3 } from './tipos';

/**
 * As 42 estruturas, sem `ligacoes` nem `verbetes` — ambas são derivadas em
 * corpus.ts a partir de relacoes.ts, e por isso simétricas por construção.
 *
 * Sistema de coordenadas (§6.1 do spec): origem na rosa-do-coração, que o
 * Glossário (p. 376) situa no centro matemático do microcosmo. +y para cima,
 * +x para o lado ESQUERDO do sujeito, +z para a frente. Figura de 1.80 de
 * altura, pés em y=-1.30, topo da cabeça em y=+0.50.
 *
 * As estruturas de forma `malha` NÃO são desenhadas: são as malhas anatômicas
 * reais de `public/anatomia.bin`, e a `posicao` delas é o centro medido da
 * malha. `validate-scene.mjs` prova que as duas não divergem.
 */

type Bruta = Omit<Estrutura, 'ligacoes' | 'verbetes'>;

/** Coluna do sacro ao atlas, com a lordose lombar e a cifose torácica. */
const CURVA_ESPINAL: readonly Vec3[] = [
  [0, -0.44, -0.055],
  [0, -0.30, -0.035],
  [0, -0.14, -0.055],
  [0, 0.04, -0.082],
  [0, 0.20, -0.075],
  [0, 0.29, -0.048],
];

/** Cordão simpático: paralelo à coluna, deslocado em x, convergindo no alto. */
const cordao = (lado: 1 | -1): readonly Vec3[] =>
  CURVA_ESPINAL.map(([, y, z], i, a): Vec3 => [
    // Os dois cordões convergem para o ponto de encontro acima da medula oblonga.
    lado * 0.030 * (1 - (i / (a.length - 1)) ** 3),
    y,
    z + 0.014,
  ]);

export const ESTRUTURAS_BRUTAS: readonly Bruta[] = [
  // ─────────────────────────── 1 · Camadas do microcosmo (4)
  {
    id: 'personalidade',
    nome: 'Personalidade',
    sistema: 'camadas',
    sinonimos: ['figura quádrupla', 'microplaneta', 'eu inferior'],
    posicao: [-0.001, -0.4, 0.001],
    forma: { tipo: 'malha', parte: 'personalidade', estilo: 'pele' },
    descricao:
      'A mais interna das quatro esferas do sistema de vida, e a única que o mundo chama de "homem". O livro insiste que ela não é o microcosmo, mas seu núcleo desfigurado. É quádrupla: corpo material, corpo etérico, corpo de desejos e faculdade mental.',
    estadoDialetico:
      'Núcleo desfigurado de um microcosmo degenerado, com uma consciência que só alcança o campo de existência a que pertence.',
    estadoNovo:
      'Uma personalidade inteiramente nova é erguida na velha personalidade da natureza, porém fora dela.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'O que, neste mundo é entendido pelo conceito de "homem" é apenas a personalidade desfigurada de um microcosmo degenerado.',
        capitulo: 'Glossário',
        pagina: 373,
      },
      {
        texto:
          'uma personalidade inteiramente nova é erguida na velha personalidade da natureza, porém fora dela',
        capitulo: 'II-5',
        pagina: 226,
      },
    ],
  },
  {
    id: 'campo-de-respiracao',
    nome: 'Campo de respiração',
    sistema: 'camadas',
    sinonimos: ['campo de manifestação'],
    posicao: [0, -0.4, 0],
    forma: { tipo: 'camada', raio: 1.08 },
    descricao:
      'O campo de força imediato que torna possível a vida da personalidade, e o elo entre ela e o ser aural. É nele que circulam as formas-pensamento do criador, e é dele que a personalidade atrai e nele que repele substâncias. Por isso a imagem mental do homem imortal tem de nascer aqui, ao lado do candidato.',
    estadoDialetico:
      'Povoado pelas formas-pensamento de seu criador; atrai e repele substâncias em plena harmonia com a personalidade.',
    estadoNovo:
      'Recebe a imagem mental do homem celeste imortal, formada como concepção mental nascida da força da luz.',
    grauDeAtivacao: 0,
    citacoes: [
      {
        texto:
          'O campo de manifestação ou campo de respiração é o campo de força imediato em que a vida da personalidade é possibilitada.',
        capitulo: 'Glossário',
        pagina: 374,
      },
      {
        texto:
          'Convosco, a vosso lado, em vosso campo de manifestação, deve nascer a imagem mental do homem celeste imortal',
        capitulo: 'I-3',
        pagina: 44,
      },
    ],
  },
  {
    id: 'ser-aural',
    nome: 'Ser aural',
    sistema: 'camadas',
    sinonimos: ['firmamento', 'lípica', 'eu superior', 'deus ígneo', 'Lúcifer dos mistérios'],
    posicao: [0, -0.4, 0],
    forma: { tipo: 'camada', raio: 1.24 },
    descricao:
      'O firmamento do microcosmo: um campo organizado de modo sétuplo, feito de centros sensoriais, centros de força e focos, que carrega o carma de todas as personalidades passadas. O livro o identifica sem rodeios como o Lúcifer dos mistérios — não um inimigo externo, mas o criador de que o eu depende e que depende do eu. É o terceiro e menos conhecido dos obstáculos da senda.',
    estadoDialetico:
      'Firmamento de centros sensoriais, centros de força e focos; portador do carma, que se arroja pelo espaço qual relâmpago vermelho-escuro.',
    estadoNovo:
      'Demolido na medida em que o próprio eu se demole na endura; nele, um princípio-centelha-do-espírito jaz como sol latente e extinto.',
    grauDeAtivacao: 7,
    citacoes: [
      {
        texto:
          'O ser aural é, entre outras coisas, um firmamento de centros sensoriais, centros de força e focos.',
        capitulo: 'I-17',
        pagina: 168,
      },
      {
        texto:
          'O ser ígneo da aura é o Lúcifer dos mistérios, nome esse que elucida o que acabamos de relatar.',
        capitulo: 'I-17',
        pagina: 169,
      },
      {
        texto: 'ele será demolido à medida que nós mesmos nos demolirmos na endura',
        capitulo: 'I-17',
        pagina: 169,
      },
    ],
  },
  {
    id: 'campo-magnetico-septuplo',
    nome: 'Campo espiritual magnético sétuplo',
    sistema: 'camadas',
    sinonimos: ['camada externa do microcosmo'],
    posicao: [0, -0.4, 0],
    forma: { tipo: 'camada', raio: 1.42 },
    descricao:
      'A camada mais externa do sistema de vida, e a que decide de que o microcosmo se alimenta: sua sintonia determina quais energias e substâncias o sistema atrai da atmosfera. No homem dialético ela está afinada com o campo eletromagnético desta natureza, e é isso que o mantém preso. A transfiguração, diz o livro, é por isso uma questão de novas leis eletromagnéticas.',
    estadoDialetico:
      'Sintonizado com o campo magnético central desta natureza, que mantém o sistema encerrado nesta ordem.',
    estadoNovo:
      'Sintonizado com o campo eletromagnético da Fraternidade Universal, atraindo materiais de construção não originários desta natureza.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'Existem dois campos eletromagnéticos neste cosmo terrestre, ambos com seu centro no coração da terra.',
        capitulo: 'I-6',
        pagina: 72,
      },
      {
        texto:
          'Assim, descobrimos que a transfiguração é, de fato, uma questão de novas leis eletromagnéticas.',
        capitulo: 'I-6',
        pagina: 73,
      },
    ],
  },

  // ─────────────────────────── 2 · Os três santuários (3)
  {
    id: 'santuario-da-cabeca',
    nome: 'Santuário da cabeça',
    sistema: 'santuarios',
    sinonimos: [],
    posicao: [0, 0.42, 0],
    forma: { tipo: 'regiao', raio: 0.12 },
    descricao:
      'O terceiro ego natural, e o último a despertar no crescimento da criança. Trabalha com os éteres mentais e neles sustenta pensamento, vontade, memória e imaginação. No segundo degrau da senda é aqui que o archote da pineal se inflama, abrindo ligação de primeira mão com a luz universal da Gnosis.',
    estadoDialetico:
      'Terceiro ego natural: pensamento, vontade, memória e imaginação, movidos pelos éteres mentais.',
    estadoNovo:
      'O archote da pineal é inflamado e o aluno entra em ligação de primeira mão com a luz universal da Gnosis.',
    grauDeAtivacao: 2,
    citacoes: [
      {
        texto:
          'Pensamento, vontade, memória, imaginação e outros aspectos do santuário da cabeça manifestam-se com o auxílio de uma terceira categoria dos quatro éteres, os éteres mentais.',
        capitulo: 'II-3',
        pagina: 207,
      },
      {
        texto:
          'O archote da pineal é inflamado, em consequência do que o aluno entra em ligação de primeira mão com a luz universal da Gnosis.',
        capitulo: 'II-3',
        pagina: 204,
      },
    ],
  },
  {
    id: 'santuario-do-coracao',
    nome: 'Santuário do coração',
    sistema: 'santuarios',
    sinonimos: [],
    posicao: [0, 0.03, 0.02],
    forma: { tipo: 'regiao', raio: 0.16 },
    descricao:
      'O segundo ego natural, que desperta na infância quando a vida de sentimentos toma forma. Trabalha com os éteres astrais, captados pelo esterno. É também onde a fé tem de fazer morada, porque é aqui que está a rosa — e por isso é aqui que a guerra entre as duas naturezas começa.',
    estadoDialetico:
      'Segundo ego natural: vida de sentimentos e de desejos, alimentada pelos éteres astrais que o esterno capta.',
    estadoNovo:
      'Assimila ao mesmo tempo as duas naturezas — "guerra no imo", a espada na alma.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'O santuário do coração preenche pois duas funções: a assimilação etérica astral desta natureza e a da natureza divina.',
        capitulo: 'II-3',
        pagina: 208,
      },
      {
        texto: 'Ele significa "guerra no imo", a espada em nossa alma.',
        capitulo: 'II-3',
        pagina: 208,
      },
    ],
  },
  {
    id: 'santuario-da-pelve',
    nome: 'Santuário da pelve',
    sistema: 'santuarios',
    sinonimos: ['centro cerebral da pelve'],
    posicao: [0, -0.35, 0],
    forma: { tipo: 'regiao', raio: 0.18 },
    descricao:
      'O primeiro ego natural, dominante nos primeiros anos de vida. Trabalha com os éteres sanguíneos, acolhidos pelo sistema do baço, e é sobre ele que se assenta a base sanguínea em que o carma acumulado do ser aural se manifesta. No quinto degrau, é aqui que o plexo sacro se torna o plexo santificador.',
    estadoDialetico:
      'Primeiro ego natural: a base sanguínea em que todo o carma acumulado do ser aural se manifesta.',
    estadoNovo:
      'Câmara terrena da torre dos mistérios, onde o plexo sacro se torna o plexo santificador.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'Essa base de vida é a base sanguínea em que todo o carma acumulado do ser aural se manifesta.',
        capitulo: 'II-3',
        pagina: 205,
      },
      {
        texto:
          'a torrente da graça da Gnosis preenche todo o ser e desce, ao longo da torre dos mistérios, até a câmara terrena do plexo sacro',
        capitulo: 'II-5',
        pagina: 225,
      },
    ],
  },

  // ─────────────────────────── 3 · Focos gnósticos (7)
  {
    id: 'rosa-do-coracao',
    nome: 'Rosa-do-coração',
    sistema: 'focos',
    sinonimos: [
      'átomo-centelha-do-espírito',
      'átomo primordial',
      'átomo original',
      'átomo de Cristo',
      'semente-Jesus',
      'joia maravilhosa na flor de lótus',
      'altar',
    ],
    posicao: [-0.03, 0, 0.02],
    forma: { tipo: 'foco', raio: 0.018 },
    descricao:
      'O resquício da vida divina primordial, alojado no ápice do ventrículo direito do coração — e, segundo o Glossário, coincidente com o centro matemático do microcosmo. É por isso a origem deste atlas. Não é um degrau da senda, mas sua chave: sem sua posse consciente, diz o livro, não se pode falar de fé.',
    estadoDialetico:
      'Latente e de tal modo enclausurada que não pode ser despertada pela qualidade sanguínea do homem comum.',
    estadoNovo:
      'Desperta e vibra: um dos sete ventrículos do coração se abre, o fogo nele contido se inflama e irradia sobre o timo.',
    grauDeAtivacao: 0,
    citacoes: [
      {
        texto:
          'Designação mística para o átomo-centelha-do-espírito, localizado no ápice do ventrículo direito do coração e coincidindo com o centro matemático do microcosmo.',
        capitulo: 'Glossário',
        pagina: 376,
      },
      {
        texto:
          'um dos sete ventrículos do coração se abre, o fogo nele contido se inflama, e uma luz brilhante é irradiada sobre o timo',
        capitulo: 'I-3',
        pagina: 41,
      },
      {
        texto:
          'o átomo primordial, o átomo-centelha-do-espírito, tem de ser vivificado. Não se pode de nenhum modo falar de fé antes que esse átomo esteja desperto.',
        capitulo: 'II-1',
        pagina: 191,
      },
    ],
  },
  {
    id: 'timo',
    nome: 'Timo',
    sistema: 'focos',
    sinonimos: ['glândula timo'],
    posicao: [-0.002, 0.136, 0.041],
    forma: { tipo: 'malha', parte: 'timo', estilo: 'foco' },
    descricao:
      'Pequena glândula situada atrás do esterno, que na infância é um depósito de forças para o crescimento posterior — depósito preenchido pelos pais. No aluno acontece o mesmo, com uma diferença decisiva: quem o preenche agora são as vibrações do átomo primordial. É por isso um recurso temporário, e o livro diz isso com todas as letras.',
    estadoDialetico:
      'Atrofia após a infância, quando se esgota o depósito de forças preenchido pelos pais da criança.',
    estadoNovo:
      'Reativado; seu hormônio providencia a projeção do fogo gnóstico no santuário da cabeça.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'uma luz brilhante é irradiada sobre o timo, pequena glândula situada atrás do esterno',
        capitulo: 'I-3',
        pagina: 41,
      },
      {
        texto:
          'o hormônio do timo providencia, em primeira instância, a projeção desse fogo no santuário da cabeça. Esse hormônio é apenas um recurso temporário, como também é na infância.',
        capitulo: 'II-5',
        pagina: 225,
      },
    ],
  },
  {
    id: 'esterno',
    nome: 'Esterno',
    sistema: 'focos',
    sinonimos: ['o irradiante'],
    posicao: [0, 0.085, 0.076],
    forma: { tipo: 'malha', parte: 'esterno', estilo: 'foco' },
    descricao:
      'O livro lê o nome latino como "irradiante" e descreve um aparelho de doze pares de vias de entrada e saída ligadas ao fogo serpentino, mais dois pontos magnéticos: um órgão atrativo e um irradiante. No homem comum ele irradia desejo e capta o que satisfaz o desejo. O mesmo aparelho, sem trocar de peça, é o que passa a captar os quatro alimentos santos.',
    estadoDialetico:
      'Irradia um desejo, uma radiação buscadora e cobiçante, e com sua faculdade atrativa acolhe as energias que a satisfarão.',
    estadoNovo:
      'Emite um anseio de outra natureza — o suspiro dos ossos — e por ele o candidato é alimentado.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'Ele possui doze pares de vias de entrada e saída, ligados diretamente com o fogo serpentino, e dois pontos magnéticos, um órgão atrativo e um órgão irradiante.',
        capitulo: 'II-3',
        pagina: 206,
      },
      {
        texto:
          'Em consequência disso o esterno irradia um desejo, uma radiação buscadora, cobiçante.',
        capitulo: 'II-3',
        pagina: 206,
      },
      {
        texto: 'senão provém do suspiro dos ossos, necessariamente é respondida',
        capitulo: 'II-3',
        pagina: 208,
      },
    ],
  },
  {
    id: 'pineal',
    nome: 'Pineal',
    sistema: 'focos',
    sinonimos: ['glândula pineal', 'trono do raio de Cristo'],
    posicao: [-0.001, 0.398, -0.037],
    forma: { tipo: 'malha', parte: 'pineal', estilo: 'foco' },
    descricao:
      'O Glossário a chama de trono do raio de Cristo e portal aberto pelo qual a sabedoria de Deus é transmitida diretamente ao ser humano. Ela só reage quando inflamada pela luz da Gnosis através da rosa, do timo e do sangue — nunca por esforço próprio. Sua abertura é o segundo degrau da senda, o conhecimento.',
    estadoDialetico:
      'Portal fechado; opera apenas o pensamento natural, junto com o cundalini que a protege.',
    estadoNovo:
      'Archote inflamado: trono do raio de Cristo, portal aberto pelo qual a sabedoria de Deus é transmitida diretamente.',
    grauDeAtivacao: 2,
    citacoes: [
      {
        texto:
          'a pineal forma o trono do raio de Cristo, da iluminação interior, o portal aberto pelo qual a sabedoria de Deus é transmitida diretamente ao ser humano',
        capitulo: 'Glossário',
        pagina: 375,
      },
    ],
  },
  {
    id: 'cundalini',
    nome: 'Cundalini',
    sistema: 'focos',
    sinonimos: ['círculo ígneo da pineal'],
    posicao: [0, 0.42, -0.02],
    forma: { tipo: 'anel', raio: 0.035, espessura: 0.006 },
    descricao:
      'Um anel circular em torno da pineal, formado de inúmeros grânulos semelhantes a ervilhas, cada um com uma atividade específica. No homem comum ele funciona como fusível: o livro compara sua extinção à queima de um fusível num circuito elétrico, e é isso que a contemplação de bola de cristal provoca. Tocado pela nova corrente, os mesmos grânulos passam a irradiar luz policromática.',
    estadoDialetico:
      'Luz protetora em torno da glândula pineal, que se apaga como um fusível queimado quando forçada pelo ocultismo.',
    estadoNovo:
      'Os grânulos irradiam uma luz policromática, cuja força cresce continuamente à medida que a pineal se abre.',
    grauDeAtivacao: 2,
    citacoes: [
      {
        texto:
          'Anel circular em torno da pineal formado de inúmeros grânulos semelhantes a ervilhas, cada um com uma atividade específica.',
        capitulo: 'Glossário',
        pagina: 366,
      },
      {
        texto:
          'esses grânulos começam a irradiar uma luz policromática, o círculo ígneo da pineal',
        capitulo: 'Glossário',
        pagina: 366,
      },
    ],
  },
  {
    id: 'hemisferio-direito',
    nome: 'Hemisfério cerebral direito',
    sistema: 'focos',
    sinonimos: [],
    posicao: [-0.037, 0.427, -0.021],
    forma: { tipo: 'malha', parte: 'hemisferio-direito', estilo: 'orgao' },
    descricao:
      'Visto microcosmologicamente, o santuário da cabeça consiste em dois hemisférios, e este é o foco mais importante da faculdade do pensamento. É o primeiro a ser mudado pela atividade do círculo ígneo do cundalini. Ele fica à direita do sujeito, portanto em x negativo neste atlas.',
    estadoDialetico: 'Foco mais importante da faculdade do pensamento na consciência dialética.',
    estadoNovo:
      'Mudado pela atividade do círculo ígneo do cundalini; o pensamento passa a servir à nova voz interior.',
    grauDeAtivacao: 3,
    citacoes: [
      {
        texto:
          'O direito é o foco mais importante da faculdade do pensamento; o esquerdo, o foco mais importante da vontade.',
        capitulo: 'Glossário',
        pagina: 371,
      },
      {
        texto:
          'Pela atividade do círculo ígneo do cundalini é mudado, primeiro, o hemisfério cerebral direito',
        capitulo: 'III-5',
        pagina: 308,
      },
    ],
  },
  {
    id: 'hemisferio-esquerdo',
    nome: 'Hemisfério cerebral esquerdo',
    sistema: 'focos',
    sinonimos: [],
    posicao: [0.036, 0.427, -0.021],
    forma: { tipo: 'malha', parte: 'hemisferio-esquerdo', estilo: 'orgao' },
    descricao:
      'O foco mais importante da vontade. O livro liga a mudança de sua constelação ao quarto dom do mestre, o que traz ao aluno uma nova vontade. É o terceiro degrau da senda — o autodomínio — visto por dentro do crânio.',
    estadoDialetico: 'Foco mais importante da vontade, a serviço da pressão da natureza.',
    estadoNovo:
      'Uma constelação modificada traz ao aluno uma nova vontade, e o abandono da pressão da natureza.',
    grauDeAtivacao: 3,
    citacoes: [
      {
        texto:
          'O direito é o foco mais importante da faculdade do pensamento; o esquerdo, o foco mais importante da vontade.',
        capitulo: 'Glossário',
        pagina: 371,
      },
      {
        texto:
          'Ele traz ao aluno uma nova vontade.',
        capitulo: 'III-5',
        pagina: 308,
      },
    ],
  },

  // ─────────────────────────── 4 · Fogo serpentino, sistema espinal (5)
  {
    id: 'coluna-vertebral',
    nome: 'Coluna do fogo serpentino',
    sistema: 'fogo-i',
    sinonimos: ['coluna vertebral', 'torre'],
    posicao: [0.004, -0.033, -0.044],
    forma: { tipo: 'malha', parte: 'coluna-vertebral', estilo: 'orgao' },
    descricao:
      'O canal do fogo serpentino comum, sede da consciência biológica. O livro é categórico sobre o que não se pode fazer com ele: o éter de hidrogênio dos quatro alimentos santos não pode ser transferido para cá, sob pena de fermentação e explosão. Por isso o novo fogo não o converte — espera que ele se extinga de maneira completamente não forçada, no caminho da endura.',
    estadoDialetico: 'Canal do fogo serpentino comum, no qual circula o fogo da consciência dialética.',
    estadoNovo:
      'Extinto de maneira completamente não forçada e natural no caminho da endura; só então o fogo da renovação pode adentrá-lo.',
    grauDeAtivacao: 7,
    citacoes: [
      {
        texto:
          'quando o antigo fogo serpentino do sistema espinal comum é extinto de maneira completamente não forçada e natural no caminho da endura, e o fogo da renovação pode adentrar esse sistema',
        capitulo: 'II-5',
        pagina: 225,
      },
      {
        texto: 'O sistema coluna vertebral–cérebro, sede da alma ou do fogo da consciência.',
        capitulo: 'Glossário',
        pagina: 377,
      },
    ],
  },
  {
    id: 'medula-espinal',
    nome: 'Medula espinal',
    sistema: 'fogo-i',
    sinonimos: [],
    posicao: [0, -0.07, -0.06],
    forma: { tipo: 'tubo', curva: CURVA_ESPINAL, raio: 0.006 },
    descricao:
      'A via pela qual circula a força criativa e volitiva da consciência biológica, e por onde ela controla, através dos nervos, toda a manifestação dialética. Sua substituição não é uma metáfora: a sabedoria antiga chama o nervo simpático de futura segunda medula espinal, e é ela que assume a função.',
    estadoDialetico:
      'Sistema por onde circula a força volitiva da consciência biológica, controlando os nervos.',
    estadoNovo:
      'Substituída em função pelo duplo cordão simpático, indicado na sabedoria antiga como a futura segunda medula espinal.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'É uma força que circula através do sistema da medula e, assim, através dos nervos controla toda a manifestação dialética.',
        capitulo: 'Glossário',
        pagina: 371,
      },
      {
        texto: 'o nervo simpático é indicado na sabedoria antiga como a futura segunda medula espinal',
        capitulo: 'II-5',
        pagina: 224,
      },
    ],
  },
  {
    id: 'constante-de-hidrogenio',
    nome: 'Constante de hidrogênio',
    sistema: 'fogo-i',
    sinonimos: [],
    posicao: [0, 0.04, -0.082],
    forma: { tipo: 'foco', raio: 0.01 },
    descricao:
      'A sede da consciência dentro do sistema do fogo serpentino, e da natureza comum. É a razão técnica pela qual a senda exige um segundo fogo serpentino em vez da conversão do primeiro: forçar o novo éter de hidrogênio para dentro dela causaria fermentação, envenenamento, explosão. É a única estrutura deste atlas que não muda em grau nenhum.',
    estadoDialetico:
      'Sede da consciência no sistema do fogo serpentino, e é a constante de hidrogênio da natureza comum.',
    estadoNovo:
      'Não é convertida: o novo éter de hidrogênio não pode ser transferido para cá sem causar fermentação, envenenamento e explosão.',
    grauDeAtivacao: null,
    citacoes: [
      {
        texto:
          'Sabeis que no sistema do fogo serpentino está presente, como sede da consciência, uma constante de hidrogênio.',
        capitulo: 'II-5',
        pagina: 223,
      },
      {
        texto: 'Isso causaria uma fermentação, um envenenamento, uma explosão.',
        capitulo: 'II-5',
        pagina: 223,
      },
    ],
  },
  {
    id: 'fluido-nervoso',
    nome: 'Fluido nervoso',
    sistema: 'fogo-i',
    sinonimos: [],
    posicao: [0, -0.2, -0.06],
    forma: { tipo: 'abstrata' },
    descricao:
      'Um dos três que o ser-desejo governa, junto com o sangue e o fogo da consciência. O livro trata os três como um bloco: quem manda neles manda no homem inteiro. No quinto degrau surge um novo fluido nervoso, e com ele um grupo de hormônios que só reage a este.',
    estadoDialetico:
      'Governado pelo ser-desejo, junto com o sangue e o fogo da consciência, e dele se origina.',
    estadoNovo:
      'Um novo grupo de hormônios, que reagem unicamente ao novo fluido nervoso, é liberado no sangue.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'sabemos que esse fogo da consciência está intimamente ligado ao sangue e ao fluido nervoso',
        capitulo: 'I-4',
        pagina: 50,
      },
      {
        texto:
          'Um novo grupo de hormônios, que reagem unicamente ao novo fluido nervoso, é liberado no sangue.',
        capitulo: 'II-5',
        pagina: 226,
      },
    ],
  },
  {
    id: 'fogo-da-consciencia',
    nome: 'Fogo da consciência',
    sistema: 'fogo-i',
    sinonimos: ['fogo anímico'],
    posicao: [0, -0.07, -0.06],
    forma: { tipo: 'abstrata' },
    descricao:
      'A força criativa e volitiva da consciência biológica, que através dos nervos controla toda a manifestação dialética. Não é uma faculdade a aperfeiçoar: é o que se extingue quando a coluna se extingue. A consciência então já não tem onde arder no sistema antigo.',
    estadoDialetico:
      'Força criativa e volitiva da consciência biológica, controlando toda a manifestação dialética pelos nervos.',
    estadoNovo:
      'Extinto junto com a coluna comum, no caminho da endura; a manifestação passa ao novo sistema nervoso.',
    grauDeAtivacao: 7,
    citacoes: [
      {
        texto:
          'sede do fogo anímico ou fogo da consciência, é a força criativa e volitiva da consciência biológica',
        capitulo: 'Glossário',
        pagina: 371,
      },
    ],
  },

  // ─────────────────────────── 5 · Fogo serpentino, simpático (6)
  {
    id: 'cordao-pingala',
    nome: 'Cordão simpático direito',
    sistema: 'fogo-ii',
    sinonimos: ['Pingalá', 'Ananias', 'campo da graça divina'],
    posicao: [-0.03, -0.07, -0.045],
    forma: { tipo: 'tubo', curva: cordao(-1), raio: 0.007 },
    descricao:
      'O campo criador do simpático, situado à direita da medula espinal — portanto em x negativo neste atlas. Os antigos Árias o chamavam Pingalá; Atos dos Apóstolos, Ananias, nome que significa campo da graça divina. Por ele desce a força inflamada no santuário da cabeça até o plexo sacro.',
    estadoDialetico:
      'Cordão nervoso à direita da coluna, funcionando de modo automático, fora do controle da vontade.',
    estadoNovo:
      'Campo criador, impulsionador, masculino: por ele a luz divina inflamada no santuário da cabeça aflui até o plexo sacro.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'Um campo, situado à direita da medula espinal, é criador; o outro, situado à esquerda da medula espinal, é manifestador.',
        capitulo: 'II-5',
        pagina: 224,
      },
      {
        texto:
          'essa força aflui pelo cordão direito do simpático até o plexo sacro, situado na parte inferior da coluna vertebral',
        capitulo: 'II-5',
        pagina: 225,
      },
    ],
  },
  {
    id: 'cordao-ida',
    nome: 'Cordão simpático esquerdo',
    sistema: 'fogo-ii',
    sinonimos: ['Idá', 'Safira', 'campo da beleza maravilhosa'],
    posicao: [0.03, -0.07, -0.045],
    forma: { tipo: 'tubo', curva: cordao(1), raio: 0.007 },
    descricao:
      'O campo manifestador, reagente, feminino, à esquerda da medula espinal. Sua irradiação abrange todas as cores do espectro, como acontece com as safiras: vermelha no ser humano comum da massa, e de um maravilhoso violeta de ametista no candidato do quinto degrau. É por ele que a corrente sobe de volta à cabeça — e é essa subida que constitui posse pessoal.',
    estadoDialetico:
      'Cordão à esquerda da coluna; no ser humano comum da massa sua cor de irradiação é vermelha.',
    estadoNovo:
      'Campo manifestador e reagente: no candidato do quinto degrau irradia um maravilhoso violeta, tal qual nas ametistas.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'No ser humano comum da massa sua cor de irradiação é vermelha, no candidato do quinto degrau ela é de um maravilhoso violeta, tal qual nas ametistas.',
        capitulo: 'II-5',
        pagina: 224,
      },
      {
        texto:
          'Enquanto o fluido da Gnosis desce pelo cordão direito do simpático, não se pode falar de uma posse pessoal.',
        capitulo: 'II-8',
        pagina: 245,
      },
    ],
  },
  {
    id: 'plexo-sacro',
    nome: 'Plexo sacro',
    sistema: 'fogo-ii',
    sinonimos: ['plexo santificador', 'câmara terrena'],
    posicao: [0, -0.4, -0.06],
    forma: { tipo: 'foco', raio: 0.026 },
    descricao:
      'Situado na parte inferior da coluna vertebral, e quase totalmente isolado do fogo serpentino comum — é justamente esse isolamento que o torna utilizável. Nele Pingalá é confrontada com Idá, e o campo impulsionador é ligado ao campo reagente. Os iniciados originais o chamavam plexo santificador.',
    estadoDialetico:
      'Quase totalmente isolado no que concerne ao fogo serpentino comum.',
    estadoNovo:
      'Câmara terrena onde Pingalá é confrontada com Idá, e de onde sobe a corrente de louvor e gratidão.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'O plexo sacro, no que concerne ao fogo serpentino comum, está quase totalmente isolado.',
        capitulo: 'II-5',
        pagina: 225,
      },
      {
        texto: 'Nele Pingalá é confrontada com Idá.',
        capitulo: 'II-5',
        pagina: 225,
      },
    ],
  },
  {
    id: 'medula-oblonga',
    nome: 'Medula oblonga',
    sistema: 'fogo-ii',
    sinonimos: ['ponto de encontro'],
    posicao: [-0.001, 0.336, -0.034],
    forma: { tipo: 'malha', parte: 'medula-oblonga', estilo: 'foco' },
    descricao:
      'O simpático parte de um ponto situado acima da medula oblonga, e é ali que concorrem os dois cordões e a esfera de influência imediata da pineal. É o fecho do circuito: o que desce por Pingalá e sobe por Idá se encontra aqui em cima, e não em baixo.',
    estadoDialetico:
      'Ponto acima do qual concorrem os dois cordões do simpático e a esfera de influência imediata da pineal.',
    estadoNovo: 'Fecho do circuito da nova circulação gnóstica, ponto de encontro no santuário da cabeça.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'Ele parte de um ponto, situado acima da medula oblonga, para onde concorrem os dois cordões do simpático e a esfera de influência imediata da pineal.',
        capitulo: 'II-5',
        pagina: 224,
      },
    ],
  },
  {
    id: 'torre-dos-misterios',
    nome: 'Torre dos mistérios',
    sistema: 'fogo-ii',
    sinonimos: ['lira de Deus'],
    posicao: [0, -0.07, -0.03],
    forma: {
      tipo: 'corrente',
      curva: [
        [0, 0.29, -0.048],
        [-0.026, 0.1, -0.062],
        [-0.03, -0.14, -0.041],
        [-0.02, -0.35, -0.05],
        [0, -0.4, -0.06],
        [0.02, -0.35, -0.05],
        [0.03, -0.14, -0.041],
        [0.026, 0.1, -0.062],
        [0, 0.29, -0.048],
      ],
      particulas: 320,
    },
    descricao:
      'Não é um órgão, mas um trajeto: cabeça → Pingalá → plexo sacro → Idá → cabeça. A força gnóstica impulsionadora corre para baixo, e o simpático impulsiona para cima sua resposta. É por essa circulação que os antigos sábios chamavam o simpático de lira de Deus, o instrumento musical tangido pela Gnosis.',
    estadoDialetico: 'Não existe no estado dialético: o circuito ainda não está fechado.',
    estadoNovo:
      'O trajeto completo da circulação gnóstica, que os antigos sábios chamavam de lira de Deus.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'A força gnóstica impulsionadora corre para baixo; o simpático reage e impulsiona para cima sua resposta, sua oferenda, seu filho da graça.',
        capitulo: 'II-5',
        pagina: 226,
      },
      {
        texto:
          'os antigos sábios denominarem o simpático de "lira de Deus", o instrumento musical tangido pela Gnosis',
        capitulo: 'II-5',
        pagina: 226,
      },
    ],
  },
  {
    id: 'cidade-das-doze-portas',
    nome: 'Cidade com as doze portas',
    sistema: 'fogo-ii',
    sinonimos: ['Christianopolis'],
    posicao: [0, 0, 0],
    forma: { tipo: 'abstrata' },
    descricao:
      'O que se torna possível construir mediante o campo do simpático. O livro a nomeia como Christianopolis e destaca uma porta entre as doze: a duodécima, com refulgência de ametista — a mesma cor que Idá assume no quinto degrau. É a última coisa que o capítulo da piedade diz antes de calar.',
    estadoDialetico: 'Não existe: nada dela pode ser edificado sobre o fogo serpentino comum.',
    estadoNovo:
      'Construída mediante o maravilhoso campo do simpático; sua duodécima porta luz com refulgência de ametista.',
    grauDeAtivacao: 7,
    citacoes: [
      {
        texto:
          'Mediante o maravilhoso campo do simpático torna-se possível construir a cidade com as doze portas da libertação.',
        capitulo: 'II-5',
        pagina: 227,
      },
      {
        texto: 'Possa a duodécima porta, com sua refulgência de ametista, logo luzir em vós!',
        capitulo: 'II-5',
        pagina: 227,
      },
    ],
  },

  // ─────────────────────────── 6 · Sistema fígado-baço (6)
  {
    id: 'figado',
    nome: 'Fígado',
    sistema: 'figado-baco',
    sinonimos: ['o vivente'],
    posicao: [-0.012, -0.062, 0.023],
    forma: { tipo: 'malha', parte: 'figado', estilo: 'orgao' },
    descricao:
      'O órgão supremo de que os homens vivem, e o livro chama a atenção para o nome: em alemão e inglês, fígado é literalmente "o vivente". É por ele que saem do corpo as forças que entram pelo baço. Perde a primazia quando a vida deixa de proceder desta natureza.',
    estadoDialetico: 'O órgão supremo de que os homens vivem, saída do canal das forças etéricas.',
    estadoNovo: 'Perde a primazia: a vida deixa de proceder daqui.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto: 'O fígado é o órgão supremo de que os homens vivem.',
        capitulo: 'I-4',
        pagina: 51,
      },
      {
        texto: 'entram no corpo pelo baço e saem pelo fígado',
        capitulo: 'I-4',
        pagina: 52,
      },
    ],
  },
  {
    id: 'baco',
    nome: 'Baço',
    sistema: 'figado-baco',
    sinonimos: ['sede do ser-eu'],
    posicao: [0.089, -0.081, -0.007],
    forma: { tipo: 'malha', parte: 'baco', estilo: 'orgao' },
    descricao:
      'Duas coisas ao mesmo tempo: a sede do núcleo do ser-eu e a principal porta de entrada das forças etéricas no corpo. Na vigília o núcleo permanece ali enrolado qual uma espiral; no sono ele sai, a espiral se desenrola, e uma fita de aparência de nuvem aparece no campo de respiração. É o órgão pelo qual o ser-desejo se alimenta e, assim, controla todo o sistema corpóreo.',
    estadoDialetico:
      'Abriga o núcleo do ser-eu, enrolado qual uma espiral na vigília, e é a principal porta de entrada das forças etéricas.',
    estadoNovo:
      'Neutralizado na demolição do eu; a captação etérica passa ao esterno e aos quatro alimentos santos.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'Durante nosso estado de vigília, ele aí permanece enrolado qual uma espiral. Durante o sono, porém, ele sai do baço, a espiral desenrola-se, e uma fita de aparência de nuvem aparece.',
        capitulo: 'I-4',
        pagina: 51,
      },
      {
        texto:
          'O baço, além de sede do ser-eu, é também a principal porta de entrada das forças etéricas no corpo.',
        capitulo: 'I-4',
        pagina: 52,
      },
    ],
  },
  {
    id: 'rins',
    nome: 'Rins',
    sistema: 'figado-baco',
    sinonimos: [],
    posicao: [0.001, -0.141, -0.015],
    forma: { tipo: 'malha', parte: 'rins', estilo: 'orgao' },
    descricao:
      'Parte do domínio do eu sanguíneo. O livro os nomeia sem descrevê-los em separado: junto com o fígado, o baço e as suprarrenais, e com o plexo solar, eles formam o domínio do ser-desejo. Seu destino é o do sistema inteiro.',
    estadoDialetico: 'Parte do domínio do eu sanguíneo, do ser-desejo.',
    estadoNovo: 'Seguem o sistema fígado-baço: perdem o comando junto com o eu sanguíneo.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'O fígado, o baço, os rins e as suprarrenais, junto com o plexo solar — o conhecido centro cerebral da pelve — formam o domínio do eu sanguíneo, do ser-desejo.',
        capitulo: 'I-4',
        pagina: 51,
      },
    ],
  },
  {
    id: 'suprarrenais',
    nome: 'Suprarrenais',
    sistema: 'figado-baco',
    sinonimos: [],
    posicao: [0.007, -0.091, -0.018],
    forma: { tipo: 'malha', parte: 'suprarrenais', estilo: 'foco' },
    descricao:
      'Como os rins, nomeadas pelo livro como parte do domínio do eu sanguíneo, sem descrição própria. Estão aqui porque o livro as inclui na lista, e a honestidade do atlas exige que o que ele nomeia apareça.',
    estadoDialetico: 'Parte do domínio do eu sanguíneo, do ser-desejo.',
    estadoNovo: 'Seguem o sistema fígado-baço: perdem o comando junto com o eu sanguíneo.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'O fígado, o baço, os rins e as suprarrenais, junto com o plexo solar — o conhecido centro cerebral da pelve — formam o domínio do eu sanguíneo, do ser-desejo.',
        capitulo: 'I-4',
        pagina: 51,
      },
    ],
  },
  {
    id: 'plexo-solar',
    nome: 'Plexo solar',
    sistema: 'figado-baco',
    sinonimos: ['centro cerebral da pelve'],
    posicao: [0, -0.12, 0.02],
    forma: { tipo: 'foco', raio: 0.03 },
    descricao:
      'O centro cerebral da pelve, e a sede daquilo que o Glossário chama de consciência cerebral lunar: uma consciência muito primitiva, própria da humanidade atlante, que se apoia em alguns centros do santuário da cabeça dirigidos pela lua. Sua marca é uma astúcia extremamente primitiva, ainda hoje ativa em muitas pessoas.',
    estadoDialetico:
      'Sede da consciência cerebral lunar: uma astúcia extremamente primitiva, ainda hoje ativa em muitas pessoas.',
    estadoNovo: 'Silenciado, quando a flama do quarto degrau arde ininterruptamente.',
    grauDeAtivacao: 4,
    citacoes: [
      {
        texto:
          'Consciência muito primitiva, localizada no plexo solar, que se apoia apenas em alguns centros do santuário da cabeça dirigidos pela lua.',
        capitulo: 'Glossário',
        pagina: 366,
      },
    ],
  },
  {
    id: 'eu-sanguineo',
    nome: 'Eu sanguíneo',
    sistema: 'figado-baco',
    sinonimos: ['ser-desejo', 'alma terrena', 'eu inferior'],
    posicao: [0.1, -0.14, -0.01],
    forma: { tipo: 'abstrata' },
    descricao:
      'O núcleo interior da existência dialética material — e o livro insiste que ele tem sede corporal, não apenas figurada. Governa o sangue, o fluido nervoso e o fogo serpentino, e remove do sangue toda força de luz que não se origine desta natureza. Não é convertível: por ser originário exclusivamente desta natureza, ele tem de morrer.',
    estadoDialetico:
      'O núcleo interior de nossa existência dialética material, que governa sangue, fluido nervoso e fogo serpentino a partir do sistema fígado-baço.',
    estadoNovo:
      'Não se converte: o eu da natureza não pode tornar-se suscetível à vida superior, e tem de morrer.',
    grauDeAtivacao: null,
    citacoes: [
      {
        texto:
          'O ser-desejo, de fato, é o núcleo interior de nossa existência dialética material, é o eu, o eu sanguíneo, a alma terrena.',
        capitulo: 'I-4',
        pagina: 51,
      },
      {
        texto:
          'O eu da natureza não pode tornar-se suscetível à vida superior. Ele tem de morrer',
        capitulo: 'I-4',
        pagina: 52,
      },
      {
        texto:
          'Todas as forças de luz, e seus efeitos hormonais, que não se originam desta natureza são, por isso, removidos do sangue por esse mesmo sistema.',
        capitulo: 'I-4',
        pagina: 51,
      },
    ],
  },

  // ─────────────────────────── 7 · Sangue, éteres e correntes (11)
  {
    id: 'sangue',
    nome: 'Sangue',
    sistema: 'correntes',
    sinonimos: [],
    posicao: [0, -0.05, 0.04],
    forma: { tipo: 'abstrata' },
    descricao:
      'A causa que o livro aponta para a torrente de pensamentos que escapa ao controle: a dialética está fundamentalmente enraizada no sangue. Não adianta refreá-lo pela cultura da vontade — mais tarde ele se fará valer mais forte do que nunca. Por isso o primeiro degrau da senda é uma vivificação sanguínea, e não uma decisão moral.',
    estadoDialetico:
      'Raiz do arqui-instinto: a dialética está fundamentalmente enraizada em nosso sangue.',
    estadoNovo:
      'Vivificação do sangue — o primeiro degrau da senda sétupla, denominado virtude na Epístola de Pedro.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto: 'A dialética está fundamentalmente enraizada em nosso sangue.',
        capitulo: 'I-4',
        pagina: 49,
      },
      {
        texto:
          'Essa vivificação do sangue constitui o primeiro degrau da senda sétupla e é denominada, na Epístola de Pedro, virtude.',
        capitulo: 'II-2',
        pagina: 195,
      },
    ],
  },
  {
    id: 'pequena-circulacao',
    nome: 'Pequena circulação',
    sistema: 'correntes',
    sinonimos: ['rio Jordão', 'circulação pulmonar'],
    posicao: [0, 0.2, 0.06],
    forma: {
      tipo: 'corrente',
      curva: [
        [-0.03, 0, 0.02],
        [0, 0.06, 0.09],
        [0, 0.1, 0.06],
        [0, 0.22, 0.05],
        [0, 0.36, 0.01],
        [0, 0.42, -0.02],
      ],
      particulas: 220,
    },
    descricao:
      'Em sentido material é a circulação pulmonar. Em sentido espiritual, é uma corrente de força de luz atraída pela rosa que, como um raio, penetra pelo esterno e atinge o santuário da cabeça. O Evangelho a designa como o rio Jordão, porque foi pelo batismo em suas águas que Jesus se tornou Cristo.',
    estadoDialetico: 'A circulação do sangue entre o coração e o pulmão, e de volta.',
    estadoNovo:
      'Corrente de força de luz atraída pela rosa-do-coração, que penetra pelo esterno e liga diretamente coração e cabeça.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'a pequena circulação sanguínea é uma corrente de força de luz atraída pela rosa-do-coração. Como um raio, ela penetra pelo esterno e atinge o santuário da cabeça.',
        capitulo: 'Glossário',
        pagina: 365,
      },
      {
        texto:
          'Essa circulação sanguínea espiritual, que liga diretamente o coração à cabeça, é designada no Evangelho como "o rio Jordão"',
        capitulo: 'Glossário',
        pagina: 365,
      },
    ],
  },
  {
    id: 'hormonio-do-timo',
    nome: 'Hormônio do timo',
    sistema: 'correntes',
    sinonimos: [],
    posicao: [0, 0.1, 0.06],
    forma: { tipo: 'abstrata' },
    descricao:
      'O veículo que conduz a força de luz da rosa até a pequena circulação sanguínea, e daí a todos os centros cerebrais. O livro é claro quanto a seu caráter provisório: é apenas um recurso temporário, como também é na infância.',
    estadoDialetico: 'Praticamente inativo após a infância, com a atrofia do timo.',
    estadoNovo:
      'Conduz a força de luz da rosa à pequena circulação sanguínea, como recurso temporário para um novo crescimento espiritual.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'o hormônio do timo conduz essa força de luz à pequena circulação sanguínea',
        capitulo: 'I-3',
        pagina: 41,
      },
    ],
  },
  {
    id: 'quatro-eteres-naturais',
    nome: 'Quatro éteres naturais',
    sistema: 'correntes',
    sinonimos: ['quatro alimentos dialéticos'],
    posicao: [0, -0.1, 0.16],
    forma: { tipo: 'abstrata' },
    descricao:
      'Hidrogênio, oxigênio, nitrogênio e carbono, adaptados por transformação para o uso do ser humano dentro deste campo isolado. O candidato não pode dispensá-los: se a corrente etérica comum fosse subitamente interrompida, isso acarretaria a morte imediata. Por isso ele vive, temporariamente, duas vidas.',
    estadoDialetico:
      'Os quatro alimentos adaptados desta ordem de natureza, que sustentam toda a manifestação dialética.',
    estadoNovo:
      'Continuam necessários: o candidato vive duas vidas, uma que sempre diminui e outra que cresce sempre.',
    grauDeAtivacao: null,
    citacoes: [
      {
        texto:
          'Se a corrente etérica comum da natureza fosse subitamente interrompida pela ligação com os quatro alimentos santos, isso acarretaria a morte imediata.',
        capitulo: 'II-5',
        pagina: 223,
      },
      {
        texto:
          'esse homem, embora temporariamente, vive duas vidas — uma vida que sempre diminui, e outra que cresce sempre, continuamente',
        capitulo: 'II-5',
        pagina: 223,
      },
    ],
  },
  {
    id: 'eteres-sanguineos',
    nome: 'Éteres sanguíneos',
    sistema: 'correntes',
    sinonimos: [],
    posicao: [0.1, -0.2, -0.01],
    forma: { tipo: 'abstrata' },
    descricao:
      'O grupo de quatro éteres que colabora exclusivamente com o santuário da pelve. São acolhidos pelo sistema do baço e afinam-se com a natureza do homem — é por eles que os impulsos primários e as atividades motoras vitais ficam assegurados.',
    estadoDialetico:
      'Acolhidos pelo sistema do baço, asseguram os impulsos primários e as atividades motoras vitais.',
    estadoNovo: 'Substituídos progressivamente, à medida que o baço é neutralizado.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'os éteres naturais, que são acolhidos pelo sistema do baço, afinam-se com a natureza deste homem. Desse modo os impulsos primários, as atividades motoras vitais, são assegurados.',
        capitulo: 'II-3',
        pagina: 205,
      },
    ],
  },
  {
    id: 'eteres-astrais',
    nome: 'Éteres astrais',
    sistema: 'correntes',
    sinonimos: ['éteres elétricos'],
    posicao: [0, 0.06, 0.12],
    forma: { tipo: 'abstrata' },
    descricao:
      'O grupo que colabora exclusivamente com o santuário do coração, captado pelo esterno. O livro faz questão de dizer que suas vibrações mais sutis não os tornam de uma classe mais elevada que a dos éteres sanguíneos: são apenas um grupo diferente, para funções novas na criança que cresce.',
    estadoDialetico:
      'Acolhidos pelo esterno, satisfazem o desejo pessoal dirigido individualmente.',
    estadoNovo:
      'O mesmo esterno passa a captar, ao lado deles, as irradiações santificadoras da Gnosis.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'esses éteres astrais, coadjuvantes com o santuário do coração, embora de vibrações mais sutis, não são de uma classe mais elevada do que a dos éteres sanguíneos',
        capitulo: 'II-3',
        pagina: 206,
      },
    ],
  },
  {
    id: 'eteres-mentais',
    nome: 'Éteres mentais',
    sistema: 'correntes',
    sinonimos: [],
    posicao: [0, 0.42, 0.08],
    forma: { tipo: 'abstrata' },
    descricao:
      'A terceira categoria dos quatro éteres, com que o santuário da cabeça manifesta pensamento, vontade, memória e imaginação. O livro corrige aqui a literatura ocultista: não é o éter refletor sozinho que provoca a atividade do pensamento, mas um grupo completo de quatro. Quando os éteres da nova natureza entram ao lado deles, começa a segunda luta.',
    estadoDialetico:
      'Sustentam pensamento, vontade, memória e imaginação — um grupo completo de quatro, não um éter isolado.',
    estadoNovo:
      'Junto com os éteres mentais da natureza, adentram o sistema os éteres da nova natureza: uma segunda luta força seu caminho.',
    grauDeAtivacao: 2,
    citacoes: [
      {
        texto:
          'junto com os éteres mentais da natureza, adentram o sistema os éteres da nova natureza',
        capitulo: 'II-3',
        pagina: 208,
      },
      {
        texto:
          'Um grupo completo de quatro éteres impele à atividade do pensamento e às outras funções do santuário da cabeça',
        capitulo: 'II-3',
        pagina: 204,
      },
    ],
  },
  {
    id: 'doze-energias',
    nome: 'Doze energias',
    sistema: 'correntes',
    sinonimos: ['doze pães', 'doze éons', 'doze apóstolos', 'doze patriarcas'],
    posicao: [0, -0.1, 0],
    forma: { tipo: 'abstrata' },
    descricao:
      'Quatro éteres, cada um em três vibrações: doze influências etéricas, sempre em grupo, nunca isoladas. O livro as identifica com os doze patriarcas, os doze apóstolos, os doze Dhyânis, as doze hierarquias. O homem adulto come dos doze pães e é guiado pelo ser aural através deles — e é essa fortaleza que a Gnosis ataca pelo centro.',
    estadoDialetico:
      'O homem adulto come dos doze pães, e o ser aural o guia completamente por esses doze apóstolos.',
    estadoNovo:
      'A fortaleza da aliança duodécupla do Velho Testamento é atacada no centro, no coração.',
    grauDeAtivacao: 1,
    citacoes: [
      {
        texto:
          'Após atingir a fase adulta, o homem pode, no pleno sentido da palavra, comer dos doze pães.',
        capitulo: 'II-3',
        pagina: 207,
      },
      {
        texto:
          'A fortaleza das doze energias naturais, a fortaleza da aliança duodécupla do Velho Testamento, é atacada no centro, no coração.',
        capitulo: 'II-3',
        pagina: 208,
      },
    ],
  },
  {
    id: 'quatro-alimentos-santos',
    nome: 'Quatro alimentos santos',
    sistema: 'correntes',
    sinonimos: ['quatro senhores do destino'],
    posicao: [0, 0.06, 0.14],
    forma: { tipo: 'abstrata' },
    descricao:
      'Uma substância etérica quádrupla de natureza completamente diversa da que se conhece na dialética. A ligação com eles se estabelece quando a flama do quarto degrau se tornou um candelabro a arder ininterruptamente. É essa ligação que obriga à construção de um segundo fogo serpentino, porque o antigo não a suporta.',
    estadoDialetico: 'Inacessíveis: o sistema comum não pode recebê-los sem se destruir.',
    estadoNovo:
      'Substância etérica quádrupla de natureza completamente diversa, à qual o candidato do quinto degrau é ligado.',
    grauDeAtivacao: 5,
    citacoes: [
      {
        texto:
          'Essa força ígnea da Gnosis relaciona-se com uma substância etérica quádrupla de natureza completamente diversa da que conhecemos na dialética.',
        capitulo: 'II-5',
        pagina: 223,
      },
      {
        texto: 'Por conseguinte, o candidato é ligado aos quatro alimentos santos.',
        capitulo: 'II-5',
        pagina: 223,
      },
    ],
  },
  {
    id: 'formas-pensamento',
    nome: 'Formas-pensamento',
    sistema: 'correntes',
    sinonimos: ['seres-pensamentos', 'imagens-pensamentos', 'fantasmas mentais'],
    posicao: [0, 0.1, 0],
    forma: {
      tipo: 'corrente',
      // Sobem do lado DIREITO do corpo (x<0), à altura da cintura, passam acima
      // da cabeça e descem à esquerda (x>0) — I-4, p. 48.
      curva: [
        [-0.34, -0.22, 0.1],
        [-0.4, 0.05, 0],
        [-0.34, 0.36, -0.06],
        [-0.17, 0.55, 0],
        [0, 0.6, 0.04],
        [0.17, 0.55, 0],
        [0.34, 0.36, -0.06],
        [0.4, 0.05, 0],
        [0.34, -0.22, 0.1],
      ],
      particulas: 400,
    },
    descricao:
      'Criaturas vivas, não metáforas: combinações de substâncias tênues, passíveis de serem averiguadas e pesadas. Circulam pelo campo de respiração subindo do lado direito do corpo à altura da cintura, passando acima da cabeça e descendo à esquerda. Precisam ser nutridas com a mesma força cerebral que as criou, e acabam por hipnotizar o criador.',
    estadoDialetico:
      'Nutridas pelo criador, emanam de seus olhos uma influência cada vez mais poderosa, hipnotizante.',
    estadoNovo:
      'Cedem lugar à imagem mental do homem celeste imortal, formada no mesmo campo de respiração.',
    grauDeAtivacao: 0,
    citacoes: [
      {
        texto:
          'percebemos claramente como essas nuvens de pensamentos surgem do lado direito do corpo, à altura da cintura, erguem-se acima da cabeça para, em seguida, descerem e desaparecerem no lado esquerdo do corpo à mesma altura da cintura',
        capitulo: 'I-4',
        pagina: 48,
      },
      {
        texto:
          'Assim, hipnotizado por suas próprias criações mentais, esse ser humano é arrastado à ação',
        capitulo: 'I-4',
        pagina: 48,
      },
    ],
  },
  {
    id: 'focos-aurais',
    nome: 'Focos aurais',
    sistema: 'correntes',
    sinonimos: ['luzes', 'estrelas do firmamento microcósmico'],
    posicao: [0, 0, 0],
    forma: { tipo: 'abstrata' },
    descricao:
      'As luzes do firmamento microcósmico: focos magnéticos que determinam a qualidade do campo espiritual magnético e, com isso, a natureza do que o sistema atrai da atmosfera. A personalidade corresponde à natureza dessas luzes — não o contrário. Os focos do período pré-luciferino estão adormecidos há éons porque não podem arder no fogo ímpio.',
    estadoDialetico:
      'Focos magnéticos que determinam a qualidade do campo magnético e, com isso, a natureza da personalidade.',
    estadoNovo:
      'Os antigos focos do período pré-luciferino podem reacender, e o sol latente e extinto do firmamento se inflama.',
    grauDeAtivacao: 7,
    citacoes: [
      {
        texto:
          'Essas luzes são focos magnéticos que determinam, em concordância com sua natureza, a qualidade do campo espiritual magnético',
        capitulo: 'Glossário',
        pagina: 374,
      },
      {
        texto:
          'Os antigos focos do período pré-luciferino estão adormecidos há éons, pois não podem arder no fogo ímpio.',
        capitulo: 'I-17',
        pagina: 170,
      },
      {
        texto:
          'existe um princípio-centelha-do-espírito no firmamento, qual latente e extinto sol',
        capitulo: 'I-17',
        pagina: 171,
      },
    ],
  },
];
