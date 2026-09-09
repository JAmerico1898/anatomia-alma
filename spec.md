# Anatomia da Alma — especificação

Atlas interativo do microcosmo segundo a Rosacruz Áurea, construído sobre
*O novo homem — conhecimento, iniciação, realização*, de J. van Rijckenborgh
(Pentagrama Publicações, 3.ª ed., 2016).

Inspirado na forma de interação de [human-atlas](https://github.com/ashemag/human-atlas)
— cena 3D em tela cheia, painéis flutuantes, seleção direta, isolamento, busca —
e **não** em seu conteúdo, seus dados ou sua geometria.

---

## 1. Visão

Um leitor de *O novo homem* deve poder **orbitar o microcosmo**, tocar uma
estrutura, e ler o que o livro diz dela — em qual capítulo e página — vendo ao
mesmo tempo onde ela fica, a que sistema pertence, com o que se liga, e o que
acontece com ela quando o candidato galga a senda sétupla.

O livro afirma repetidamente que o processo é literal e corporal, não apenas
místico: *"não apenas misticamente, mas também estrutural, biológica, portanto,
corporalmente"* (I-2, p. 30). O site leva essa afirmação a sério: a anatomia da
alma tem **posições**, e elas são o eixo da navegação.

### Não-objetivos

- Não é prática, exercício, terapia, diagnóstico nem iniciação.
- Não é doutrina comparada: nenhum paralelo com chakras, cabala ou outras
  tradições, exceto os que o próprio livro faz (Pingalá/Idá, o "andarilho das
  estrelas", os cátaros).
- Não reproduz o livro. Reproduz o Glossário e cita trechos; não serve o PDF.
- Não tem contas, login, persistência, comentários, favoritos nem compartilhamento
  social. Estado é URL.
- Não tem áudio, narração nem o canto mântrico dos sete raios.
- Não tem versão em inglês.

---

## 2. Decisões travadas

| Eixo | Decisão |
|---|---|
| Público | Aluno/leitor do livro. Registro interno e afirmativo, vocabulário da Escola sem diluição. |
| Objeto 3D | Figura humana translúcida no centro de camadas concêntricas do microcosmo. |
| Eixos de estado | Dois **modos independentes**: `senda` (0…7 graus, transformação contínua) e `duas-naturezas` (comparação/ruptura). |
| Escopo | Microcosmo fechado. 7 sistemas, 42 estruturas. Cosmo entra só como texto e como radiação que atinge a cena. |
| Direitos | Livre uso do livro (declarado pelo proprietário do projeto). Glossário verbatim permitido. |
| Geometria | Híbrida: malhas BodyParts3D carregadas por `app/scene/anatomia.ts` de `public/anatomia.bin`, com campos, tubos, correntes e focos gerados em three.js. |
| Stack | Next.js 16 (App Router) + React 19 + Tailwind 4 + shadcn/ui + three.js → Vercel. |
| Idioma | pt-BR apenas. Sem infraestrutura de i18n. |
| Estética | Escuro sideral; paleta dos sete raios como codificação de sistema; cor é informação. |
| Rotas | `/`, `/senda`, `/glossario`, `/fontes`. |

---

## 3. Fonte canônica

Todas as afirmações do corpus vêm de:

> Rijckenborgh, J. van. **O novo homem: conhecimento, iniciação, realização.**
> Trad. Marcus Vinicius Mesquita de Sousa. 3. ed. Jarinu, SP: Pentagrama
> Publicações, 2016. 384 p. ISBN 978-85-67992-54-9.
> Título original: *De komende nieuwe mens* (Rozekruis Pers, Haarlem, 1953).

Toda citação no corpus referencia **capítulo + página impressa** (ex.: `II-5, p. 224`).
As páginas do PDF em `livro/` estão deslocadas em relação à paginação impressa;
o corpus usa **sempre a paginação impressa**, que é a que o leitor tem em mãos.

O Glossário (pp. 363–378) é reproduzido integralmente em `/glossario` e é a
camada de definição canônica: quando Glossário e corpo do livro divergem em
ênfase, o corpus segue o Glossário para a definição e o corpo do livro para o
processo.

---

## 4. Ontologia

### 4.1 Os sete sistemas

Ordem de exibição no painel `Sistemas`, com uma cor editorial de visualização.
As cores não atribuem cada raio do sol divino a um sistema anatômico
(I-3, p. 40); são apenas identidade visual.

| # | id | Nome | Cor de visualização | O que reúne |
|---|---|---|---|---|
| 1 | `camadas` | Camadas do microcosmo | violeta | As quatro esferas concêntricas do sistema de vida (Glossário, p. 373) |
| 2 | `santuarios` | Os três santuários | índigo | Cabeça, coração, pelve — os três focos da personalidade (II-3, pp. 205–207) |
| 3 | `focos` | Focos gnósticos | áureo | Os centros pelos quais a luz da Gnosis entra e opera |
| 4 | `fogo-i` | Fogo serpentino — sistema espinal | vermelho | Coluna–cérebro, sede do fogo da consciência dialética (Glossário, p. 377) |
| 5 | `fogo-ii` | Fogo serpentino — simpático | azul | A segunda medula espinal, Pingalá e Idá (II-5, pp. 224–227) |
| 6 | `figado-baco` | Sistema fígado-baço | laranja | O domínio do eu sanguíneo, do ser-desejo (I-4, p. 51) |
| 7 | `correntes` | Sangue, éteres e correntes | verde | O que circula: sangue, éteres, hormônios, formas-pensamento |

Visíveis por padrão: todos exceto `camadas` (que começa em modo *silhueta*, para
não obstruir a figura) — ver §7.3.

### 4.2 Inventário — 42 estruturas

Colunas: **estado D** = no homem dialético · **estado N** = no novo homem ·
**grau** = grau da senda em que a estrutura muda de estado (`—` = não muda).
Posições em §6.3.

#### Sistema 1 · Camadas do microcosmo (4)

| id | Nome | Sinônimos | Estado D | Estado N | Grau | Fonte |
|---|---|---|---|---|---|---|
| `personalidade` | Personalidade | figura quádrupla; microplaneta | Núcleo desfigurado de um microcosmo degenerado; consciência limitada ao próprio campo de existência | Nova personalidade erguida *na* velha, porém *fora* dela | 5 | Gloss. p. 373; II-5 p. 226 |
| `campo-de-respiracao` | Campo de respiração | campo de manifestação | Povoado pelas formas-pensamento do criador; atrai e repele substâncias em harmonia com a personalidade | Recebe a imagem mental do homem imortal, criada pela consciência jupiteriana | 0 | Gloss. pp. 373–374; I-3 p. 44 |
| `ser-aural` | Ser aural | firmamento; lípica; eu superior; deus ígneo | Firmamento de centros sensoriais, centros de força e focos; portador do carma; Lúcifer dos mistérios; relâmpago vermelho-escuro | Demolido na medida em que o eu se demole; focos pré-luciferinos readormecidos podem reacender; o sol latente se inflama | 7 | I-17 pp. 166–171; Gloss. p. 377 |
| `campo-magnetico-septuplo` | Campo espiritual magnético sétuplo | camada externa do microcosmo | Sintonizado com o campo eletromagnético da terra; mantém o sistema preso | Sintonizado com o campo da Fraternidade Universal; atrai materiais de construção não desta natureza | 1 | Gloss. p. 373; I-6 pp. 72–73 |

#### Sistema 2 · Os três santuários (3)

| id | Nome | Sinônimos | Estado D | Estado N | Grau | Fonte |
|---|---|---|---|---|---|---|
| `santuario-da-cabeca` | Santuário da cabeça | — | Terceiro ego natural; pensamento, vontade, memória, imaginação, via éteres mentais | Archote da pineal inflamado; ligação direta com o Livro da Vida | 2 | II-3 p. 207; II-2 p. 195 |
| `santuario-do-coracao` | Santuário do coração | — | Segundo ego natural; vida de sentimentos e desejos, via éteres astrais captados pelo esterno | Assimila simultaneamente as duas naturezas — "guerra no imo", a espada na alma | 1 | II-3 pp. 206–208 |
| `santuario-da-pelve` | Santuário da pelve | centro cerebral da pelve | Primeiro ego natural; base sanguínea onde o carma aural se manifesta | Plexo sacro torna-se plexo santificador; câmara terrena da torre dos mistérios | 5 | II-3 p. 205; II-5 p. 225 |

#### Sistema 3 · Focos gnósticos (7)

| id | Nome | Sinônimos | Estado D | Estado N | Grau | Fonte |
|---|---|---|---|---|---|---|
| `rosa-do-coracao` | Rosa-do-coração | átomo-centelha-do-espírito; átomo primordial; átomo de Cristo; semente-Jesus; joia na flor de lótus; altar | Latente e enclausurada no ápice do ventrículo direito; não pode ser despertada pela qualidade sanguínea comum | Desperta, vibra, abre um dos sete ventrículos do coração e irradia sobre o timo | 0 | Gloss. p. 376; I-2 p. 31; I-3 p. 41 |
| `timo` | Timo | glândula timo | Atrofia após a infância; depósito de forças preenchido pelos pais | Reativado; depósito preenchido pelas vibrações do átomo primordial; seu hormônio projeta o fogo no santuário da cabeça | 1 | I-3 p. 41; II-5 p. 225 |
| `esterno` | Esterno | "o irradiante" | Doze pares de vias de entrada e saída ligados ao fogo serpentino, mais um órgão atrativo e um irradiante; irradia desejo cobiçante | O mesmo aparelho passa a captar os quatro alimentos santos; irradia o anseio de outra natureza, o suspiro dos ossos | 1 | II-3 pp. 206–207 |
| `pineal` | Pineal | glândula pineal; trono do raio de Cristo | Portal fechado; opera apenas o pensamento natural | Archote inflamado; portal aberto pelo qual a sabedoria de Deus é transmitida diretamente | 2 | Gloss. p. 375; II-2 p. 195 |
| `cundalini` | Cundalini | círculo ígneo da pineal | Anel de grânulos semelhantes a ervilhas em torno da pineal, atuando como fusível protetor | Irradia luz policromática, crescente em intensidade conforme a pineal se abre | 2 | Gloss. p. 366; I-3 p. 42 |
| `hemisferio-direito` | Hemisfério cerebral direito | — | Foco principal da faculdade do pensamento | Pensamento posto a serviço da nova voz interior | 3 | Gloss. p. 371 |
| `hemisferio-esquerdo` | Hemisfério cerebral esquerdo | — | Foco principal da vontade | Nova vontade; abandono da pressão da natureza | 3 | Gloss. p. 371; III-5 p. 308 |

#### Sistema 4 · Fogo serpentino — sistema espinal (5)

| id | Nome | Sinônimos | Estado D | Estado N | Grau | Fonte |
|---|---|---|---|---|---|---|
| `coluna-vertebral` | Coluna do fogo serpentino | coluna vertebral; torre | Canal do fogo serpentino comum | Extinta *sem forçar*, no caminho da endura; só então o fogo da renovação pode adentrá-la | 7 | Gloss. p. 365; II-5 p. 224 |
| `medula-espinal` | Medula espinal | — | Via de circulação da força volitiva da consciência biológica | Substituída em função pelo duplo cordão simpático, a "futura segunda medula espinal" | 5 | Gloss. p. 371; II-5 p. 224 |
| `constante-de-hidrogenio` | Constante de hidrogênio | — | Sede da consciência no sistema do fogo serpentino; é da natureza comum | Não é convertida: o novo éter de hidrogênio **não pode** ser transferido para cá — causaria fermentação e explosão | — | II-5 p. 223 |
| `fluido-nervoso` | Fluido nervoso | — | Governado pelo ser-desejo, junto com o sangue e o fogo da consciência | Novo fluido nervoso, ao qual reage um novo grupo de hormônios | 5 | I-4 p. 50; II-5 p. 226 |
| `fogo-da-consciencia` | Fogo da consciência | fogo anímico | Força criativa e volitiva da consciência biológica; controla toda a manifestação dialética via nervos | Extinto com a coluna; a consciência migra para o novo sistema | 7 | Gloss. p. 371 |

#### Sistema 5 · Fogo serpentino — simpático (6)

| id | Nome | Sinônimos | Estado D | Estado N | Grau | Fonte |
|---|---|---|---|---|---|---|
| `cordao-pingala` | Cordão simpático direito | Pingalá; Ananias; campo da graça divina | Cordão nervoso à direita da coluna, fora do controle da vontade | Campo criador, impulsionador, masculino; conduz a força do santuário da cabeça ao plexo sacro | 5 | II-5 p. 224 |
| `cordao-ida` | Cordão simpático esquerdo | Idá; Safira; campo da beleza maravilhosa | Cordão à esquerda; irradiação vermelha no homem comum | Campo manifestador, reagente, feminino; irradia todo o espectro, violeta-ametista no candidato do quinto grau; conduz de volta ao santuário da cabeça | 5 | II-5 p. 224 |
| `plexo-sacro` | Plexo sacro | plexo santificador; câmara terrena | Quase totalmente isolado do fogo serpentino comum | Ponto de encontro onde Pingalá é confrontada com Idá; de onde sobe a corrente de louvor | 5 | II-5 p. 225 |
| `medula-oblonga` | Medula oblonga | ponto de encontro | Ponto acima do qual concorrem os dois cordões e a esfera de influência da pineal | Fecho do circuito da nova circulação gnóstica | 5 | II-5 p. 224 |
| `torre-dos-misterios` | Torre dos mistérios | — | — (não existe no estado dialético) | O trajeto completo cabeça → Pingalá → plexo sacro → Idá → cabeça; a "lira de Deus" tangida pela Gnosis | 5 | II-5 pp. 225–226 |
| `cidade-das-doze-portas` | Cidade com as doze portas | Christianopolis | — | O que se constrói mediante o campo do simpático; a duodécima porta com refulgência de ametista | 7 | II-5 p. 227 |

#### Sistema 6 · Sistema fígado-baço (6)

| id | Nome | Sinônimos | Estado D | Estado N | Grau | Fonte |
|---|---|---|---|---|---|---|
| `figado` | Fígado | o vivente | Órgão supremo de que os homens vivem | Perde a primazia; a vida deixa de proceder daqui | 5 | I-4 p. 51 |
| `baco` | Baço | sede do eu | Abriga o núcleo do ser-eu, enrolado em espiral na vigília; sai durante o sono e se desenrola como fita de nuvem; principal porta de entrada das forças etéricas | Neutralizado na endura; a porta etérica cede lugar à captação pelo esterno | 5 | I-4 pp. 51–52 |
| `rins` | Rins | — | Parte do domínio do eu sanguíneo | Idem ao sistema | 5 | I-4 p. 51 |
| `suprarrenais` | Suprarrenais | — | Parte do domínio do eu sanguíneo | Idem ao sistema | 5 | I-4 p. 51 |
| `plexo-solar` | Plexo solar | centro cerebral da pelve | Sede da consciência cerebral lunar, a astúcia atlante | Silenciado | 4 | I-4 p. 51; Gloss. p. 366 |
| `eu-sanguineo` | Eu sanguíneo | ser-desejo; alma terrena; eu inferior | Núcleo interior da existência dialética; governa sangue, fluido nervoso e fogo serpentino; remove do sangue toda força de luz não desta natureza | Deve morrer — não é convertível: "carne e sangue não podem herdar o reino de Deus" | — | I-4 pp. 50–52 |

#### Sistema 7 · Sangue, éteres e correntes (11)

| id | Nome | Sinônimos | Estado D | Estado N | Grau | Fonte |
|---|---|---|---|---|---|---|
| `sangue` | Sangue | — | Raiz do arqui-instinto; carrega as imagens da religião natural, do ocultismo, do humanismo, do materialismo | Vivificação sanguínea — o primeiro degrau, chamado *virtude* na Epístola de Pedro | 1 | I-4 pp. 49–50; II-2 p. 195 |
| `pequena-circulacao` | Pequena circulação | rio Jordão; circulação pulmonar | Circulação pulmonar comum | Corrente de força de luz atraída pela rosa; penetra pelo esterno e atinge o santuário da cabeça, ligando diretamente coração e cabeça | 1 | Gloss. pp. 365–366; I-3 p. 41 |
| `hormonio-do-timo` | Hormônio do timo | — | Praticamente inativo | Conduz a força de luz da rosa à pequena circulação; recurso temporário, como na infância | 1 | I-3 p. 41; II-5 p. 225 |
| `quatro-eteres-naturais` | Quatro éteres naturais | quatro alimentos dialéticos | Sustentam a manifestação nesta ordem de natureza | Continuam necessários — sua interrupção súbita causaria morte imediata; o candidato vive duas vidas | — | II-5 p. 223; I-11 p. 113 |
| `eteres-sanguineos` | Éteres sanguíneos | — | Acolhidos pelo sistema do baço; asseguram os impulsos primários e as atividades motoras vitais | Substituídos progressivamente | 5 | II-3 p. 205 |
| `eteres-astrais` | Éteres astrais | — | Acolhidos pelo esterno; satisfazem o desejo pessoal individualizado | O esterno passa a captar também os alimentos santos | 1 | II-3 p. 206 |
| `eteres-mentais` | Éteres mentais | — | Sustentam pensamento, vontade, memória, imaginação | Adentram o sistema os éteres da nova natureza, ao lado dos naturais: a segunda luta | 2 | II-3 pp. 207–208 |
| `doze-energias` | Doze energias | doze pães; doze éons; doze apóstolos; doze patriarcas | Quatro éteres em três grupos; o homem adulto come dos doze pães e é guiado pelo ser aural através deles | A fortaleza da aliança duodécupla é atacada no centro, no coração | 1 | II-3 pp. 204–207 |
| `quatro-alimentos-santos` | Quatro alimentos santos | — | Inacessíveis | Substância etérica quádrupla de natureza inteiramente diversa; ligação estabelecida no quinto degrau | 5 | II-5 pp. 222–223; I-9 p. 100 |
| `formas-pensamento` | Formas-pensamento | seres-pensamentos; imagens-pensamentos; fantasmas mentais | Criaturas vivas que circulam no campo de respiração — sobem à direita, na altura da cintura, passam acima da cabeça e descem à esquerda; exigem ser nutridas e acabam por hipnotizar o criador | Cedem lugar à imagem mental do homem imortal | 0 | I-4 pp. 47–49 |
| `focos-aurais` | Focos aurais | luzes; estrelas do firmamento microcósmico | Focos magnéticos que determinam a qualidade do campo magnético e, com isso, a natureza da personalidade | Antigos focos do período pré-luciferino, adormecidos há éons, podem reacender; o sol latente no ser aural se inflama | 7 | Gloss. p. 373; I-17 p. 169; I-18 p. 179 |

### 4.3 A senda sétupla

Fé **não é um degrau** — é a chave, a posse consciente do átomo primordial
(II-1, p. 191; II-2, p. 195). Os sete graus, na ordem da Segunda Epístola de Pedro
tal como o livro a lê:

| Grau | Nome | O que muda corporalmente | Fonte |
|---|---|---|---|
| 0 | *(base)* Fé | A rosa é despertada; o eu ainda governa | II-1 p. 191 |
| 1 | Virtude | Vivificação do sangue; timo reativado; pequena circulação acesa | II-2 p. 195 |
| 2 | Conhecimento | Archote da pineal inflamado; cundalini irradia policromático | II-2 p. 195 |
| 3 | Autodomínio | Seguir a nova voz; hemisférios reorientados; a velha natureza cala | II-3 p. 208 |
| 4 | Perseverança | A flama torna-se candelabro a arder ininterruptamente; plexo solar silencia | II-4 p. 211; II-5 p. 222 |
| 5 | Piedade | **A mudança corporal.** Segundo fogo serpentino no simpático; Pingalá e Idá; plexo sacro; novo sistema nervoso, novos hormônios, novo fluido sanguíneo; nova personalidade erguida | II-5 pp. 222–226 |
| 6 | Amor fraternal | O trabalho se volta para fora; pescador de homens | II-8 p. 245 |
| 7 | Amor | Coluna comum extinta na endura; ser aural demolido; cidade das doze portas | II-9 p. 253; II-5 p. 227 |

---

## 5. Schema de dados

Arquivo único `app/corpus/corpus.ts`, importado estaticamente (sem fetch, sem
`atlas.json`, sem chunks binários — o corpus inteiro cabe folgadamente no bundle).

```ts
export type SistemaId =
  | 'camadas' | 'santuarios' | 'focos'
  | 'fogo-i' | 'fogo-ii' | 'figado-baco' | 'correntes';

export type Grau = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type FormaGeometrica =
  | { tipo: 'camada'; raio: number }
  | { tipo: 'foco'; raio: number }
  | { tipo: 'regiao'; raio: number }            // santuários: esfera difusa
  | { tipo: 'tubo'; curva: Vec3[]; raio: number }
  | { tipo: 'corrente'; curva: Vec3[]; particulas: number }
  | { tipo: 'abstrata' };                       // sem geometria própria

export type Vec3 = readonly [number, number, number];

export interface Citacao {
  /** Trecho literal do livro. */
  texto: string;
  /** Capítulo na notação do livro: 'I-4', 'II-5', 'III-1', 'Glossário'. */
  capitulo: string;
  /** Página impressa. */
  pagina: number;
}

export interface Estrutura {
  id: string;
  nome: string;
  sistema: SistemaId;
  sinonimos: string[];
  /** Centro para rótulo e enquadramento de câmera. */
  posicao: Vec3;
  forma: FormaGeometrica;
  /** 2–4 frases autorais. */
  descricao: string;
  /** Uma frase. O que a estrutura é no homem dialético. */
  estadoDialetico: string;
  /** Uma frase. O que ela se torna no novo homem. */
  estadoNovo: string;
  /** Grau em que muda de estado; null = não muda (ver `constante-de-hidrogenio`). */
  processos: Processo[];            // fases e intervalos: inicia/cresce/substitui/extingue/completa
  citacoes: Citacao[];              // ≥ 1
  relacoes: Relacao[];              // origem, destino, tipo, verbo, condição e grau opcionais
  /** Termos do Glossário relacionados (slug do verbete). */
  verbetes: string[];
}

export interface Sistema {
  id: SistemaId;
  nome: string;
  cor: string;                      // token editorial de visualização
  corDeVisualizacao: string;        // nome editorial; não é correspondência doutrinária
  descricao: string;
  ordem: number;
}

export interface Verbete {                 // Glossário, pp. 363–378
  slug: string;
  termo: string;
  /** Texto do Glossário, verbatim. */
  definicao: string;
  paginaPrimeiraMencao: number;      // o número entre colchetes no Glossário
  estruturas: string[];              // ids relacionados
}

export interface DegrauDaSenda {
  grau: Grau;
  nome: string;
  mudancaCorporal: string;
  citacoes: Citacao[];
  ativa: string[];                   // ids que mudam de estado neste grau
}
```

Invariantes (verificadas por `validate-corpus.mjs`, §11):

1. `estruturas.length === 42`; 4 · 3 · 7 · 5 · 6 · 6 · 11 por sistema.
2. Todo `id` é único e kebab-case.
3. Toda estrutura tem ≥ 1 citação; toda citação tem `pagina` entre 17 e 358
   (corpo do livro) ou entre 363 e 378 (Glossário).
4. Toda origem e destino de `Relacao` e todo id em `DegrauDaSenda.inicia` existem.
5. Cada relação possui direção, tipo e verbo; nenhum reverso é inferido.
6. Todo slug em `verbetes` existe no Glossário; todo verbete com `estruturas`
   não-vazio é referenciado de volta.
7. Todo processo tem fase e intervalo válidos e aparece em `inicia` no estado
   correspondente ao começo do intervalo.
8. Nenhum campo textual vazio.

---

## 6. Cena 3D

### 6.1 Sistema de coordenadas

**A origem `(0,0,0)` é a rosa-do-coração.** Isto não é convenção arbitrária: o
Glossário (p. 376) define que o átomo-centelha-do-espírito "coincide com o centro
matemático do microcosmo". As camadas concêntricas são, portanto, centradas na rosa,
não no centro do corpo. Toda a cena decorre disso.

- `+y` = para cima (cabeça). `+x` = lado **esquerdo do sujeito**. `+z` = frente.
- Unidade: altura da figura = `1.80`. Rosa a ≈ 0.72 da altura → topo da cabeça
  em `y ≈ +0.50`, pés em `y ≈ −1.30`.
- Consequência anatômica a respeitar: Pingalá (cordão **direito**) fica em `x < 0`;
  Idá (cordão **esquerdo**) em `x > 0`. A rosa, no ventrículo direito, em `x ≈ −0.03`.

### 6.2 Módulos de geometria

```
app/scene/
  scene.tsx              orquestração, câmera, raycasting, seleção
  shells.ts              4 camadas: IcosahedronGeometry + ShaderMaterial fresnel
  figure.ts              figura low-poly gerada por código, MeshPhysicalMaterial
  spine.ts               coluna: TubeGeometry sobre CatmullRomCurve3
  sympathetic.ts         2 tubos espelhados em x, convergindo na medula oblonga
  foci.ts                focos: esfera emissiva + halo (sprite)
  currents.ts            Points animados ao longo de curvas
  labels.ts              rótulos HTML posicionados por projeção, com desconflito
  materials.ts           tokens de material derivados da paleta (§8)
  state.ts               estado da cena; deriva de searchParams
```

Nenhum arquivo `.glb`, `.bin`, `.obj`. Nenhum script de conversão. Se a figura
precisar de mais fidelidade no futuro, isso é uma decisão nova, não um gancho a
deixar pronto agora.

### 6.3 Posições

Valores iniciais; ajustáveis na Fase 2, travados por `validate-scene.mjs` depois.

| Estrutura | Posição | Forma |
|---|---|---|
| `campo-magnetico-septuplo` | `[0,0,0]` | camada r=2.00 |
| `ser-aural` | `[0,0,0]` | camada r=1.55 |
| `campo-de-respiracao` | `[0,0,0]` | camada r=1.15 |
| `personalidade` | `[0,-0.10,0]` | a própria figura |
| `santuario-da-cabeca` | `[0,0.42,0]` | região r=0.12 |
| `santuario-do-coracao` | `[0,0.03,0.02]` | região r=0.16 |
| `santuario-da-pelve` | `[0,-0.28,0]` | região r=0.18 |
| `rosa-do-coracao` | `[-0.03,0,0.02]` | foco r=0.018 |
| `timo` | `[0,0.10,0.06]` | foco r=0.022 |
| `esterno` | `[0,0.06,0.09]` | foco r=0.030 |
| `pineal` | `[0,0.42,-0.02]` | foco r=0.014 |
| `cundalini` | `[0,0.42,-0.02]` | anel r=0.035 |
| `hemisferio-direito` | `[-0.05,0.44,0]` | região r=0.055 |
| `hemisferio-esquerdo` | `[0.05,0.44,0]` | região r=0.055 |
| `coluna-vertebral` | curva `[0,-0.55,-0.08] → [0,0.34,-0.06]` | tubo r=0.012 |
| `medula-espinal` | mesma curva | tubo r=0.006 |
| `cordao-pingala` | curva espelhada, `x ≈ -0.030` | tubo r=0.007 |
| `cordao-ida` | curva espelhada, `x ≈ +0.030` | tubo r=0.007 |
| `plexo-sacro` | `[0,-0.52,-0.07]` | foco r=0.026 |
| `medula-oblonga` | `[0,0.34,-0.05]` | foco r=0.018 |
| `figado` | `[-0.09,-0.20,0.03]` | região r=0.070 |
| `baco` | `[0.10,-0.19,-0.01]` | região r=0.040 |
| `rins` | `[±0.07,-0.30,-0.06]` | par, r=0.035 |
| `suprarrenais` | `[±0.07,-0.25,-0.06]` | par, r=0.018 |
| `plexo-solar` | `[0,-0.22,0.02]` | foco r=0.030 |
| `pequena-circulacao` | rosa → esterno → frente do tórax → pineal | corrente, 220 partículas |
| `torre-dos-misterios` | cabeça → Pingalá → plexo sacro → Idá → cabeça | corrente, 320 partículas |
| `formas-pensamento` | anel em torno da figura: sobe em `x>0` na altura da cintura, passa acima da cabeça, desce em `x<0` | corrente, 400 partículas |

`eu-sanguineo`, `fogo-da-consciencia`, `constante-de-hidrogenio`, `fluido-nervoso`,
os éteres, `doze-energias`, `quatro-alimentos-santos`, `focos-aurais`,
`cidade-das-doze-portas` são `abstrata`: selecionáveis pela busca e pelo painel,
e ao serem selecionadas **realçam as estruturas concretas às quais se ligam** em
vez de acender geometria própria. Exceção: `focos-aurais` acende as luzes na
superfície interna da camada `ser-aural`.

Nota de honestidade que vai no `/fontes`: **estas posições são interpretativas.**
O livro fixa com precisão o ápice do ventrículo direito, o timo atrás do esterno,
os cordões à direita e à esquerda da coluna, o plexo sacro na parte inferior da
coluna e o ponto de encontro acima da medula oblonga. O resto é enquadramento
plausível para poder navegar, não afirmação da Escola.

---

## 7. Modos e controles

### 7.1 Modo `senda`

Controle principal na dock: slider discreto de 8 paradas (0…7), rotulado com o
nome do grau. Arrastar interpola o estado da cena:

- Materiais dos focos interpolam entre `corDialetica` e `corNova`.
- Correntes ganham densidade e velocidade de partículas.
- `cordao-ida` interpola sua emissiva de vermelho (grau ≤ 4) a violeta-ametista
  (grau 5), conforme II-5, p. 224.
- `coluna-vertebral` e `fogo-da-consciencia` **desaparecem** entre os graus 6 e 7
  (extinção na endura), com o simpático assumindo o brilho.
- `ser-aural` perde focos progressivamente a partir do grau 5; no grau 7 restam
  apenas os focos pré-luciferinos reacesos.
- Ao parar em um grau, um cartão discreto mostra o nome do grau, a mudança
  corporal e a citação — sem bloquear a cena.

Transições animadas por interpolação de uniforms; nenhuma máquina de estados
elaborada. Ao arrastar rápido, a cena acompanha sem enfileirar animações.

### 7.2 Modo `duas-naturezas`

Duas apresentações, ambas disponíveis ao usuário em qualquer viewport:

- **Dividida** (padrão em `≥ 1024px`): duas cenas lado a lado, câmeras
  sincronizadas (orbitar uma orbita a outra), seleção pareada. O painel de
  detalhe mostra `estadoDialetico` e `estadoNovo` em colunas.
- **Alternada** (padrão em `< 1024px`): uma cena, um toggle
  `dialético ⇄ novo homem` com crossfade de material.

Alternar entre as duas apresentações é um botão na dock; a escolha do usuário
sobrepõe o padrão do viewport e vai para a URL.

Não há wipe/cortina arrastável: sugeriria continuidade entre os dois campos,
que o livro nega frontalmente (I-5, "Não há ligação entre o homem natural e o
homem espiritual").

### 7.3 Controles compartilhados

Espelham o human-atlas, com os nomes deste domínio:

| Controle | Comportamento |
|---|---|
| Painel `Sistemas` | Switch por sistema; contagem de estruturas; clique no nome isola aquele sistema. Presets: **Tudo**, **Só a figura**, **Só as camadas**, **Só as correntes**. |
| Slider `Separar camadas` | 0–100%. Afasta as quatro camadas radialmente e depois separa os grupos de órgãos. Substitui o "Explode anatomy". |
| Busca (`/`) | Combobox sobre nome + sinônimos + termos do Glossário. Sem consulta, sugere: rosa-do-coração, ser aural, timo, esterno, baço, pineal, plexo sacro, Pingalá. |
| Vistas | `¾ · Frente · Lado · Costas` + rotação automática + reset. Rotação e vistas oblíquas desabilitadas acima de 80% de separação, como na referência. |
| `Isolar estrutura` | No Sheet de detalhe. Oculta tudo o mais; a câmera enquadra a estrutura. |
| Legenda da cena | Linha central baixa: nome do estado atual (`MICROCOSMO · GRAU 5 · PIEDADE`, `ESTRUTURAS SEPARADAS`, nome da estrutura isolada). |

### 7.4 Sheet de detalhe

Conteúdo, na ordem: sistema (com o acento colorido) → nome → sinônimos →
descrição → **estado dialético / estado novo** lado a lado → grau de ativação
(com link para `/senda#grau-N`) → citações com capítulo e página → ligações
(botões que navegam para a estrutura ligada) → verbetes do Glossário.

---

## 8. Design

### 8.1 Paleta

Fundo `#07080d`. Painéis *glass* (`backdrop-blur`, borda 1px a 8% de branco).

Os sete raios, dessaturados para conviverem numa cena só:

| Sistema | Raio | Hex | Uso |
|---|---|---|---|
| `camadas` | violeta | `#8a7fb0` | manto dos reis-sacerdotes |
| `santuarios` | índigo | `#5f6f9e` | a nuvem do Senhor |
| `focos` | áureo | `#d8b565` | o áureo coração da glória solar |
| `fogo-i` | vermelho | `#b0574e` | a aliança sanguínea |
| `fogo-ii` | azul | `#5b8ba6` | a amplidão azul |
| `figado-baco` | laranja | `#c08a52` | o esplendor alaranjado do prana |
| `correntes` | verde | `#7e9a76` | o verde país da esperança |

Dois acentos de estado, usados só onde o livro os nomeia:
`--ida-dialetica: #a33c3c` (vermelho) e `--ida-nova: #9b6fc4` (violeta-ametista).
A rosa desperta usa `--rosa: #e8c66a` com bloom.

Tema escuro fixo. Sem alternador claro/escuro — a cena é luz sobre trevas e não
sobrevive a inversão sem recalibrar todos os shaders, o que ninguém pediu.

### 8.2 Tipografia

- Interface: system sans (o mesmo stack do reset do host), pesos 400/500/600.
- Citações e verbetes do Glossário: uma serifa (`Source Serif 4` via Google Fonts,
  com `Georgia, serif` de fallback real), ecoando o Adobe Garamond do miolo impresso.
- Rótulos na cena: sans, 11px, `letter-spacing 0.08em`, caixa alta.

### 8.3 Responsivo

Réplica da estratégia da referência, adaptada:

- `< 1024px`: painel `Sistemas` vira drawer acionado pela dock; modo
  `duas-naturezas` cai para *alternada*; dock compacta; Sheet de detalhe ocupa
  a metade inferior e a câmera reenquadra a estrutura isolada para o espaço restante.
- Alvos de toque ≥ 44px. Distinção tap-vs-drag com limiar de 8px e 250ms, como
  em `pointer-tap.ts` da referência.
- Viewports de teste: 390×844, 320×568, 844×390.

### 8.4 Acessibilidade

- Toda estrutura alcançável por teclado sem a cena: o painel `Sistemas` e a busca
  são a rota de teclado completa; `Tab`/`Enter` selecionam; `Esc` fecha.
- A cena tem `role="img"` com `aria-label` descrevendo o estado atual.
- `prefers-reduced-motion`: desliga rotação automática e animação de partículas;
  correntes viram linhas estáticas com gradiente.
- Contraste AA em todo texto sobre glass.

---

## 9. Rotas

| Rota | Conteúdo |
|---|---|
| `/` | Explorador. Estado inteiramente em `searchParams`: `?modo=senda&grau=5&foco=rosa-do-coracao&sistemas=focos,fogo-ii&separar=30&apresentacao=dividida` |
| `/senda` | Os sete graus em sequência, com a cena em miniatura sincronizada por seção. Texto da Parte II. Âncoras `#grau-1` … `#grau-7`. |
| `/glossario` | Os ~60 verbetes verbatim, busca por prefixo, link cruzado para as estruturas. Âncoras por slug. |
| `/fontes` | Edição citada, escopo e limites (incluindo a nota sobre posições interpretativas do §6.3), crédito ao human-atlas como inspiração de forma, licenças de dependências. |

Metadata/OG por rota. Sem sitemap dinâmico, sem analytics.

---

## 10. Fases de implementação

Fatias verticais: cada fase produz algo visível e verificável. Nenhuma fase
começa antes de a anterior estar verde.

**Fase 1 — Corpus e esqueleto**
Rotas, layout, tokens, `corpus.ts` com as 42 estruturas preenchidas (descrição,
estados, citações, ligações) e o Glossário transcrito. Sem 3D.
*Verificar:* `npm run check` limpo · `validate-corpus.mjs` passa as 8 invariantes ·
`/glossario` lista todos os verbetes e todo link cruzado resolve.

**Fase 2 — Cena estática**
Figura, camadas, coluna, simpático, focos, rótulos. Órbita, zoom, seleção por
clique, Sheet de detalhe, isolar. Estado dialético apenas.
*Verificar:* `validate-scene.mjs` — nenhum foco fora da figura, nenhuma
sobreposição de rótulos em 4 ângulos de câmera, toda estrutura não-abstrata tem
geometria e é alcançável por raycast · clicar em cada uma das 33 estruturas
concretas abre o detalhe correto.

**Fase 3 — Sistemas, separação, busca**
Painel de sistemas com switches e presets, slider `Separar camadas`, busca `/`,
vistas, reset, deep links.
*Verificar:* toda combinação de sistemas visíveis renderiza sem erro · em 100%
de separação, nenhuma estrutura sobrepõe outra nos 3 viewports · todo deep link
de §9 restaura exatamente o estado.

**Fase 4 — Modo senda**
Slider de 9 paradas (estado natural, fé e sete degraus), interpolação de materiais,
correntes animadas, cartão de estado. *Verificar:* cada estado produz resultado
distinto e estável · todo processo respeita seu intervalo · arrastar rápido de
-1 a 7 e voltar não deixa material preso.

**Fase 5 — Modo duas naturezas**
Apresentação dividida com câmeras sincronizadas; apresentação alternada; troca
automática por viewport e sobreposição manual.
*Verificar:* orbitar a cena da esquerda move a da direita em sincronia · seleção
pareada · abaixo de 1024px o padrão é alternada · a escolha manual persiste na URL.

**Fase 6 — `/senda`, `/fontes`, acabamento**
Scrollytelling dos sete graus, página de fontes, `prefers-reduced-motion`,
revisão de acessibilidade, README.
*Verificar:* suíte Playwright completa verde nos 3 viewports · `npm run build`
sem avisos · deploy de preview na Vercel carrega em < 3s em 4G simulado.

---

## 11. Verificação

Mínimo que de fato prova o comportamento. Nada de cerimônia.

```
npm run check                        tsc --noEmit
node scripts/validate-corpus.mjs     as 8 invariantes do §5
node scripts/validate-scene.mjs      posições, rótulos, alcance por raycast, 8 graus
npx playwright test                  contratos de interação, 3 viewports
npm run build
```

`playwright/` cobre exatamente cinco contratos — os que quebram em silêncio:

1. Selecionar uma estrutura na cena abre o Sheet com o nome certo.
2. `Isolar` oculta o resto e reenquadra; `Limpar seleção` restaura.
3. Busca por sinônimo (`"átomo-centelha-do-espírito"`) encontra `rosa-do-coracao`.
4. Trocar de modo preserva a estrutura selecionada e atualiza a URL.
5. Abaixo de 1024px o modo `duas-naturezas` renderiza *alternada*, não dividida.

Nenhum eval de fidelidade visual por diferença de pixels: shaders e partículas
tornam capturas instáveis, e congelar relógio e seed para estabilizá-las é
trabalho considerável a serviço de um teste que ninguém pediu.

**Portão:** nada vai a produção com um comando vermelho.

**O README declara o que não foi testado:** desempenho em dispositivo físico,
multitouch em hardware real, navegadores fora de Chromium/WebKit recentes,
e leitores de tela além de uma passagem manual com NVDA.

---

## 12. Fora de escopo (registrado, não construído)

Itens plausíveis que ficam **de fora** desta versão. Se um deles for desejado,
é uma decisão nova — não há gancho, abstração nem "flexibilidade" preparada para eles.

- Versão em inglês.
- Ambiente cósmico: dois campos eletromagnéticos, sete raios como geometria,
  esfera refletora, os doze éons como entidades navegáveis.
- Parte III do livro: os nove dons, as cinco tarefas, os três ministérios.
- Áudio, narração, o canto mântrico dos sete raios.
- Contas, favoritos, anotações, compartilhamento.
- Exportação de imagem, modo apresentação, VR.
- Comparação com outras tradições.

---

## 13. Fontes e créditos

- **Conteúdo:** Rijckenborgh, J. van. *O novo homem*. 3. ed. Jarinu: Pentagrama
  Publicações, 2016. Uso autorizado pelo responsável do projeto. Glossário
  (pp. 363–378) reproduzido integralmente; demais citações identificadas por
  capítulo e página.
- **Inspiração de forma:** [human-atlas](https://github.com/ashemag/human-atlas)
  de Ashe Magalhaes, MIT. Nenhum código, dado ou geometria reaproveitado — apenas
  o vocabulário de interação (cena em tela cheia, painéis glass, separação por
  slider, isolamento, busca com `/`).
- **Sem dados de terceiros.** Toda a geometria é gerada por código neste repositório.
- Dependências mantêm suas respectivas licenças.

**Declaração de escopo, exibida em `/fontes` e no Sheet "Sobre":**
este é um atlas de estudo que acompanha a leitura do livro. Não é prática, não é
terapia, não é iniciação, e não substitui o texto. As posições tridimensionais
são interpretativas onde o livro não as fixa — ver §6.3.

---

## 14. Emendas de implementação

Alterações decididas durante a construção, cada uma com sua razão. Onde uma
emenda contradiz uma seção anterior, **a emenda prevalece** — a seção original
fica no documento para preservar a intenção.

### E1 · `FormaGeometrica` ganha `anel`, `par` e `figura` (§5)

O §6.3 descreve a cundalini como *anel* e rins/suprarrenais como *par*, formas
que a união do §5 não representava; `personalidade` era "a própria figura", que
também não tinha variante. A cundalini é um anel por conteúdo, não por enfeite:
o Glossário (p. 366) a define como "anel circular em torno da pineal formado de
inúmeros grânulos". Para o `par`, `posicao` guarda o ponto médio e `offset` o
deslocamento, de modo que rótulo e enquadramento de câmera seguem operando com
um único ponto.

### E2 · Relações e verbetes derivados (§5; relações revistas por E26)

As relações são declaradas uma única vez em `app/corpus/relacoes.ts`, e a
relação verbete↔estrutura numa única tabela. `Estrutura.relacoes`,
`Estrutura.verbetes` e `Verbete.estruturas` são derivados em `corpus.ts`.
Desde E26, as relações têm direção e tipo, e `DegrauDaSenda.inicia` deriva do
início dos intervalos de `Estrutura.processos`.

### E3 · Invariante 9 — toda citação é conferida contra o livro (§11)

As oito invariantes originais checam formato, não veracidade: uma citação
inventada com página plausível passaria por todos os comandos do §11. A nona
invariante exige que cada `citacao.texto` ocorra literalmente no texto do livro,
na página declarada. `livro/` não é versionado, então a checagem roda onde o
texto-fonte existe e é pulada com aviso em um clone limpo.

A comparação normaliza três artefatos da extração do PDF, nenhum deles erro do
corpus: asteriscos de remissão ao Glossário (`imagem* mental`), espaços dentro
de palavras (`mos tra`), marcadores de nota de rodapé colados (`antiga2`). Uma
frase pode atravessar a quebra de página; `pagina` é onde ela **começa**.

Estado atual: **95 citações conferidas**.

### E4 · Correções ao §6.3, verificadas contra o próprio texto

- **Camadas cortavam a figura.** Com os eixos do §6.1 (pés em `y=-1.30`), uma
  camada de raio 1.15 centrada na rosa deixaria as pernas fora do campo de
  respiração. Raios corrigidos para 1.45 (respiração), 1.75 (aural) e 2.10
  (magnético sétuplo).
- **Cluster pélvico caía fora da pelve.** `plexo-sacro` em `y=-0.52` ficava a
  0.78 do chão — altura de coxa, abaixo do santuário que deveria contê-lo.
  Corrigidos: `santuario-da-pelve` `-0.35`, `plexo-sacro` `-0.40`, base da
  coluna `-0.44`, `medula-oblonga` `+0.29`.
- **Vísceras ~12 cm baixas.** `figado` `-0.15`, `baco` `-0.14`, `rins` `-0.15`,
  `suprarrenais` `-0.10`, `plexo-solar` `-0.12`.
- **`formas-pensamento` estava espelhada.** O §6.3 as fazia subir em `x>0`, que
  pelo §6.1 é o lado *esquerdo* do sujeito; I-4, p. 48 diz que elas "surgem do
  lado direito do corpo, à altura da cintura". Corrigido para `x<0` na subida.

### E5 · Páginas do Glossário corrigidas contra o livro (§4.2)

Três referências do inventário estavam com um número a menos. O livro é a fonte
da verdade: *Hemisférios cerebrais* p. 371–372 (a frase atravessa a quebra),
*Consciência cerebral lunar* p. 366, *Microcosmo* — trecho das luzes — p. 374.

### E6 · O Glossário tem 68 verbetes, não ~60 (§9)

Contagem real da extração, dos quais 18 são remissivas ("Ver X"). Elas são
verbetes de pleno direito, como no impresso, e servem também de sinônimo na
busca. Duas anomalias do impresso ficam registradas em `/fontes`.

### E7 · O grau 6 não ativa estrutura alguma (§7.1, §10 Fase 4)

Nenhuma das 42 linhas do §4.2 tem grau 6, coerentemente com o §4.3, que descreve
o Amor fraternal como voltar-se para fora. Em vez de inventar uma ativação, o
grau 6 é onde **começa a rampa de extinção** que o §7.1 já situava "entre os
graus 6 e 7": a coluna e o fogo da consciência perdem emissão, e o simpático
ganha o brilho que eles perdem. O critério da Fase 4 passa a aceitar rampa como
distinção, em vez de exigir uma ativação nova em cada grau.

### E8 · Política de rótulos (§7.3, §10 Fase 2)

"Nenhuma sobreposição de rótulos em 4 ângulos de câmera" é insatisfazível com 33
estruturas concretas aglomeradas em três regiões pequenas. Rótulos passam a ser
sob demanda: hover, seleção, sistema isolado, e tudo o que couber acima de certo
grau de separação. A desconflitação é por prioridade — em colisão, o rótulo de
menor prioridade some, não se desloca. O validador passa a exigir que **nenhum
rótulo exibido colida** e que toda estrutura seja alcançável por raycast ou pelo
painel `Sistemas`.

### E9 · Decisões de arquitetura

- **three.js puro**, sem react-three-fiber: `scene.tsx` é o único client
  component e monta o canvas; todo o resto é imperativo, como o §6.2 desenha.
- **`buildScene()` sem DOM**: os módulos de `app/scene/` não tocam `document`,
  `window` nem `WebGLRenderer`, de modo que `validate-scene.mjs` mede a cena de
  verdade no Node — posições, raycast, projeção de rótulos, os 8 graus.
- **Figura procedural**: manequim abstrato (torso por `LatheGeometry`, membros
  por cápsula), deliberadamente não-anatômico, para não cair no vale da
  estranheza nem competir com as estruturas que ela deve deixar ver.
- **Apresentação dividida**: um único `WebGLRenderer` desenhando dois viewports
  por `setScissorTest`, e não duas cenas. Geometria compartilhada, um contexto
  WebGL, e câmeras sincronizadas por serem literalmente a mesma câmera.
- **`modo` era exclusivo** (`senda` | `duas-naturezas`). Essa decisão histórica
  foi substituída por E22 e o baseline natural separado foi introduzido em E26.
- **`/senda` é montada só do corpus**, sem reproduzir a Parte II.
- **`livro/` não é versionado.** O texto-fonte fica local; o que sobe é o
  `corpus.ts`, com trechos identificados por capítulo e página.

### E10 · São 29 estruturas concretas, não 33 (§10 Fase 2)

O critério da Fase 2 falava em "as 33 estruturas concretas", número que nunca
fechou com o próprio §6.3: aquela tabela lista 28 entradas posicionadas. Com a
`constante-de-hidrogenio` promovida a `foco` — o livro lhe dá sede determinada
no sistema do fogo serpentino (II-5, p. 223) —, o inventário real é de **29
concretas e 13 abstratas**. O validador trava esse número.

### E11 · Contraste: `--color-texto-3` subiu de `#6f7385` para `#82869b`

O §8.4 exige AA em todo texto sobre glass. O cinza original rendia 4.26:1 sobre
o fundo e 4.10:1 sobre os painéis — reprovado. O novo rende 5.56:1 e 5.35:1.
A auditoria (`npm run audit`) mede isso com axe-core em vez de afirmar.

### E12 · Três defeitos que só a verificação encontrou

Registrados porque explicam decisões de código que, lidas isoladamente,
pareceriam excesso de zelo:

1. **O raycast ignorava a visibilidade do objeto pai.** Ao receber uma lista
   explícita de malhas, o three não consulta `visible` na cadeia de pais — logo,
   clicar na cena selecionava estruturas de sistemas desligados. A filtragem é
   feita ao consumir os acertos.
2. **A prioridade mais baixa da figura não pode vir da ordem do array de
   alvos**, porque o raycaster devolve os acertos ordenados por distância. Ela
   também é aplicada ao consumir os acertos.
3. **`updateMatrixWorld` faltando fazia o validador passar por acaso.** Sem
   ele, toda a cena é tratada como estando na origem, e um raio pelo centro do
   corpo acerta quase tudo. `aplicarEstado` agora fecha atualizando as matrizes.

### E13 · A miniatura de `/senda` só monta a partir de 1024px

Abaixo disso ela tomaria metade da tela do texto — que é o conteúdo da página —
para abrir um segundo contexto WebGL.

### E14 · A figura é anatomia real, não um manequim (§5, §6.1, §6.2)

O §6.2 previa uma figura procedural — um manequim abstrato, deliberadamente
não-anatômico. Ela foi substituída por **malhas anatômicas de verdade**:
BodyParts3D 4.0 (adulto masculino de referência, CC BY 4.0, DBCLS), pela
conversão para navegador de `human-atlas` (MIT).

Doze estruturas do corpus deixam de ser desenhadas e passam a ser a malha real
do órgão: `personalidade` (a pele), `esterno`, `timo`, `pineal`, os dois
hemisférios, `medula-oblonga`, `coluna-vertebral`, `figado`, `baco`, `rins` e
`suprarrenais`. `FormaGeometrica` ganha a variante `malha` e perde `par` e
`figura`, que existiam só para aproximar o que agora vem medido.

O corte é o critério do atlas: daquele corpo — 2.234 malhas, 15 sistemas — entra
**só o que o processo espiritual do livro nomeia**, e nada é acrescentado por
conta própria. O sacro foi considerado e recusado: seria um osso exibido com o
nome de um plexo. O que não é órgão continua gerado por código, porque não é
objeto de dissecação: camadas, santuários, rosa-do-coração, cundalini, medula
espinal, cordões do simpático e correntes de partículas.

Três consequências:

1. A `posicao` dessas doze passa a ser o **centro medido** da malha, e o
   validador reprova qualquer divergência maior que 1 cm. Notavelmente, as
   posições que o autor havia estimado à mão erravam por poucos centímetros —
   esterno e pineal casaram quase exatamente.
2. `dentroDaFigura` deixa de ser um perfil desenhado e passa a ser a
   **silhueta medida da pele**, em 72 faixas de altura, escrita pelo próprio
   script de construção.
3. A cena passa a ter uma dependência assíncrona. `construirCena` recebe a
   anatomia como argumento; `cena.tsx` a carrega antes de montar o WebGL, e o
   validador a lê do disco. A disciplina do E9 (nada em `app/scene` toca o DOM)
   continua valendo.

### E15 · O microcosmo encolheu e foi recentrado no corpo (§6.1, §7.3)

As camadas tinham raio 1,45 / 1,75 / 2,10 centradas na rosa-do-coração, que fica
à altura do peito. Uma esfera centrada ali precisa ser enorme só para alcançar
os pés, e o resultado é um microcosmo que engole o homem que ele é.

As camadas passam a ser centradas no **centro geométrico da figura** (y=-0,40) e
os raios caem para 1,08 / 1,24 / 1,42 — o suficiente para conter o corpo inteiro
e o trajeto das formas-pensamento, que foi baixado de y=0,70 para y=0,60 para
continuar circulando dentro do campo de respiração. A câmera se aproxima de 3,9
para 3,2 e mira o centro do corpo: a figura passa a ocupar cerca de três quartos
da vertical, contra três quintos antes.

A origem das coordenadas continua na rosa: o que mudou foi o centro das camadas,
não o do sistema.

### E16 · A URL deixa de estar no caminho crítico do slider (§9)

O §9 mantém todo o estado do explorador na URL. Isso continua verdadeiro, mas a
escrita passou a ser **adiada em 180 ms**: cada `router.replace` é uma navegação
do App Router, e a 60 Hz um slider arrastado disparava uma por evento. O estado
agora vive no componente e espelha-se na URL; a leitura da URL só volta a mandar
quando a mudança veio de fora (link colado, voltar/avançar).

Medido: sete passos de teclado no slider da senda caem de 96 ms para 51 ms de
mediana em produção. No mesmo espírito, o raycast de *hover* passou a rodar uma
vez por quadro em vez de uma vez por evento de ponteiro, e `/` pré-carrega
`anatomia.bin` no HTML — 2568 ms para 2105 ms sob 4G simulado.

### E17 · O limiar tap-vs-arrasto mede o gesto, não o relógio do renderizador

O §7.2 fixa 8 px e 250 ms para separar toque de arrasto. A implementação media
os 250 ms com `performance.now()` de dentro dos handlers — isto é, o instante em
que o navegador **conseguiu rodar** o handler, não o instante em que o dedo
agiu. Num quadro pesado a diferença passa dos 250 ms sozinha, e um toque
legítimo era descartado como arrasto. O defeito castiga exatamente quem tem o
aparelho mais lento, e ficou mais provável com a cena anatômica.

A medida passa a vir de `ev.timeStamp`, que está no mesmo relógio mas marca o
evento de entrada. Encontrado por um teste que falhava em ~7% das execuções sob
contenção de CPU; depois da correção, 18 execuções seguidas verdes.

### E18 · "Cascas" passa a chamar-se "camadas"

O vocabulário do atlas chamava de *cascas* as quatro esferas concêntricas do
sistema de vida. A palavra não vem do livro — uma busca em `livro/book.txt` não
encontra nenhuma ocorrência dela — e sugere invólucro rígido e descartável, que
é o oposto do que o Glossário (p. 373) descreve. Passam a ser **camadas**, em
todo lugar: `SistemaId`, `FormaGeometrica`, tokens de cor, painel e prosa.

Nenhuma citação foi tocada, precisamente porque nenhuma delas continha a
palavra. Efeito colateral aceito: uma URL antiga com `?sistemas=cascas` perde o
filtro e volta a mostrar tudo, em vez de mostrar nada.

### E19 · O tema passa de escuro para claro (§8.1)

O §8.1 fixava fundo `#07080d` e declarava que a cena "é luz sobre trevas e não
sobrevive a inversão sem recalibrar todos os shaders". A inversão foi pedida, e
os shaders foram recalibrados. O fundo é `#f3f4f4`, o mesmo papel do Human
Atlas, com um horizonte discreto vindo do CSS atrás de um canvas transparente.

O que a inversão exigiu, item a item:

1. **Nada de blending aditivo.** Somar luz ao branco dá branco. As camadas do
   microcosmo e as correntes de partículas passam a alfa normal.
2. **Alfa pré-multiplicado.** O renderer compõe em alfa pré-multiplicado; os
   dois shaders escreviam a cor cheia. No escuro isso passava por brilho; no
   claro lavava tudo para branco, e foi o que fez a sombra de contato parecer
   não existir. O fragmento agora escreve `cor * a`.
3. **Emissivo em faixa curta.** De `0.18…1.13` para `0.05…0.45`: passar disso
   satura para o branco e a estrutura perde o matiz que a identifica. A ativação
   de um degrau também adensa o sólido, e é isso que se lê como "acendeu".
4. **Os sete raios escurecem.** O matiz é o que o livro nomeia (I-3, p. 40) e
   não mudou; a luminosidade caiu, para que os sete continuem legíveis sobre
   papel. `--color-texto-3` foi para `#5e6771` (5,21:1) e a rosa da interface
   para `#7a5a0c` (5,78:1) — medidos, e confirmados pelo axe nas quatro rotas.
5. **Painéis deixam de ser vidro e viram cartão**: branco quase opaco, hairline
   e sombra baixa. É a sombra, não a borda, que os separa do fundo.
6. **Luz de estúdio**: hemisférica para volume, chave quente à frente,
   preenchimento frio atrás.

### E20 · A senda pode se percorrer sozinha

Um botão ao lado do slider avança a senda um degrau a cada 2,2 s, do grau
corrente até o sétimo, e para. `Esc` interrompe, trocar de modo interrompe, e
apertar no sétimo grau recomeça do zero. O relógio é um `setTimeout` por
degrau, e não um intervalo: assim ele é recriado a cada mudança de grau e o
leitor pode arrastar o slider no meio do percurso sem que os dois briguem.

### E21 · A figura ganha pele, luz e chão (§6.2)

Três acabamentos que fazem a anatomia do E14 ler como um corpo, e não como um
conjunto de malhas:

- **Pele cerosa** (`#d2a686`, 42% de alfa, `sheen`), densa o bastante para
  fechar a silhueta e aberta o bastante para deixar ver as vísceras. Sem
  `transmission`: ela obriga o three a desenhar a cena inteira uma segunda vez
  por quadro e só duplicaria uma translucidez que o alfa já resolve.
- **Vísceras com contorno.** Uma região é nuvem e não escreve profundidade; um
  órgão tem contorno, escreve, e ocupa lugar — de modo que a coluna passe à
  frente do fígado como passa no corpo.
- **Sombra de contato**, um disco com queda radial sob os pés. Ela é JUSTA à
  pegada de propósito: a câmera olha o chão de uns 28°, e uma elipse larga
  projeta um leque enorme cujo miolo — a única parte escura — cai embaixo do
  corpo e some atrás das pernas.

### E22 · O modo `duas-naturezas` sai; resta a senda (§4, §7.2, §9, §11)

O explorador tinha dois eixos de estado exclusivos: a senda de 0 a 7 e um modo
`duas-naturezas` que congelava a cena no homem dialético ou no novo homem, lado
a lado ou alternando. Ele foi removido inteiro — modo, apresentação
(`dividida` | `alternada`), o parâmetro `natureza`, o divisor central com os
dois rótulos e o duplo viewport por scissor em `cena.tsx`.

O que resta não perde nada do argumento do livro: o grau 7 aponta ao novo homem.
E26 posteriormente separa o estado natural (`-1`) da fé (`0`). A comparação continua disponível onde
ela é lida com calma — no card de detalhe, que segue mostrando os dois estados
de cada estrutura lado a lado. O que sai é a escolha de *parar* no homem
dialético como se fosse um destino.

Consequências no código: `EstadoUrl` perde `modo`, `apresentacao` e `natureza`;
`EstadoCena` perde `natureza` e o `t` de ativação volta a ser sempre
`progressoDeAtivacao(grau)`; `PropsDaCena` perde `dividida` e `natureza`. Links
antigos com `?modo=…&natureza=…` continuam abrindo — os parâmetros são
simplesmente ignorados e some da URL na primeira escrita.

### E23 · O card do degrau explica o que a figura está fazendo (§7.4)

Avançar passo a passo pela senda mudava a cena sem dizer por quê: o card da
direita só existia quando havia uma estrutura selecionada. Agora, quando nada
está selecionado, esse mesmo lugar mostra o **degrau corrente** — nome, mudança
corporal, as frases autorais, as citações do livro e as estruturas que mudam de
estado neste grau, cada uma clicável. Selecionar uma estrutura troca o card
pelo detalhe; fechar o detalhe devolve o degrau.

A dock ganhou os botões ‹ e › ao lado do slider: o avanço passo a passo era
possível só arrastando ou pelas setas do teclado com o slider em foco.

Abaixo de 1024px o card do degrau não é montado. Ali ele cobriria justamente a
figura que está explicando, e a legenda central da cena já nomeia o grau.

### E24 · O atraso da URL vale só para os sliders (§9, emenda E16)

O E16 pôs toda escrita de URL atrás de 180 ms para tirar `router.replace` do
caminho crítico do slider. O atraso passou a valer só para as mudanças
contínuas — os dois sliders, `grau` e `separar`. Toda mudança discreta (uma
seleção na cena, um degrau pelos botões, um sistema no painel) escreve na hora:
adiar o link não compra fluidez nenhuma ali, e deixava a URL atrás do que já
estava na tela.

### E25 · Cards menores, figura maior (§7.3, §7.4)

O painel de sistemas passou de 288 px para 224 px, o card da direita de 448 px
para 320 px, e a dock encolheu de `py-3`/`text-sm` para `py-2`/`text-xs`. Os
alvos de toque caíram de 44 px para 36 px, acima do mínimo confortável e abaixo
do que a recomendação pede: é uma troca deliberada por área de figura, num
atlas em que o assunto é o que se vê, não os controles. O card da direita ganhou
teto de altura explícito (`calc(100dvh-11rem)`) e rola por dentro, em vez de
correr por baixo da dock quando o texto é longo.

### E26 · Fidelidade processual e causal

O eixo da cena passa a ter nove estados: `-1` é o **estado natural**, com o átomo
primordial latente; `0` é a **fé**, chave e primeira ruptura; `1…7` são os
degraus. A presença do átomo não é confundida com sua posse consciente.

`grauDeAtivacao` deixa de existir. Cada estrutura declara `processos`, compostos
por fase (`inicia`, `cresce`, `substitui`, `extingue`, `completa`) e intervalo.
No quinto degrau, a nova personalidade aparece como uma segunda malha, e o grau
em que um processo começa já tem de mostrar que ele começou — quem deitou apenas
uma pedra já iniciou a construção (II-5 p. 226). É `progressoComEstreia` que
garante isso: uma rampa 5→7 crua valeria zero exatamente no grau 5, que é onde o
livro situa a mudança corporal.

As conexões deixam de ser arestas simétricas. `Relacao` preserva `origem`,
`destino`, `tipo`, verbo e, quando cabível, condição e grau. O detalhe lê esses
verbos e a cena desenha setas ao selecionar os participantes. Isso inclui a
cadeia rosa → timo → hormônio → pequena circulação → cabeça, a entrada pelo baço
e saída pelo fígado, e o circuito cabeça → Pingalá → plexo sacro → Idá → cabeça.

O ser aural não apenas desaparece: focos antigos se apagam e focos azuis novos
se inflamam gradualmente, ligados ao santuário da cabeça, à nova consciência e à
personalidade nascente (III-11 pp. 355–356). O firmamento em si, porém, **não
nasce no quinto degrau**: a lipika já arde no estado natural, e o que a senda faz
é renová-la — um novo céu e uma nova terra. As estrelas velhas partem acesas; o
que muda de 5 a 7 é qual das duas famílias arde.

O espectro sétuplo permanece como doutrina textual do capítulo I-3, mas a paleta
dos sistemas é editorial. `Sistema` não possui mais `raio`; possui
`corDeVisualizacao`.

### E27 · A mudança do quinto degrau não pode apagar o interior

A nova personalidade foi, primeiro, um wireframe do corpo inteiro desenhado por
dentro da pele. Era evidente e estava errado: nos graus 5 a 7 as arestas de toda
a malha caíam sobre coluna, fígado e rins, e o atlas perdia justamente o que ele
existe para mostrar, e perdia mais quanto mais avançava a senda.

Ela passa a ser uma **casca fresnel** com a forma do corpo, erguida por FORA da
pele (escala 1.022 em torno do centro da caixa) — "na velha personalidade da
natureza, porém fora dela" (II-5 p. 226). Opaca só na silhueta, transparente de
frente: o contorno dourado fecha e o interior continua legível no grau 7. O aro é
largo (`uPotencia` 3.2 contra os 9.0 das camadas) e ela tem forma humana, e é
isso que a impede de ser lida como mais um anel do microcosmo. A pele velha
esvai de 0.42 a 0.08, sem nunca sumir: o candidato ainda tem de viver segundo a
natureza (II-5 p. 224).

A casca **não entra no raycast**. Por estar por fora, ela cobriria a figura
inteira, e a prioridade que dá a vez às estruturas internas só resolve o empate
depois do acerto. A personalidade continua alcançável pela pele.

As estrelas do firmamento ganham shader próprio: adensadas para 120, elas
envolvem a figura, e as que se projetam sobre o tronco esconderiam os órgãos. O
vértice mede o afastamento do ponto em relação ao eixo do corpo, na direção
perpendicular à da câmera — quem cai sobre o corpo esmaece a 14%, quem está
livre arde cheio. Como depende da câmera, o cálculo vive no shader.

A invariante 8 de `validate-scene.mjs` trava tudo isso: nada na figura é
wireframe, a casca não é alvo de raycast, ela é nula no grau 4 e evidente no 5,
a pele esvai sem sumir, e o firmamento já arde antes da fé.

### E28 · A composição transparente passa a ter um contrato único

`app/scene/materiais.ts` e `app/scene/cena.tsx` passam a distinguir explicitamente o alfa do canvas do alfa dos materiais. Os shaders personalizados adotam saída pré-multiplicada e materiais configurados para o blending correspondente; nenhuma cor recebe multiplicação duplicada. A saída de cor dos shaders segue o mesmo tratamento de espaço de cor e tone mapping dos materiais iluminados. Esta emenda corrige a premissa técnica da E19 existente sem desfazer o papel claro, a paleta ou a ausência de tema escuro.

A correção é verificada primeiro por composição numérica de fragmentos de cor conhecida sobre fundos conhecidos, com tolerância máxima de dois níveis por canal em uma leitura de 8 bits, sem tone mapping nesse teste. Depois são recalibrados camadas, personalidade, estrelas e sombra na cena completa. A conclusão exige capturas dos estados −1, 0, 4, 5 e 7, nas quatro vistas, sem aros quase negros produzidos pela composição e sem perda da distinção entre personalidade antiga e nova. Os órgãos devem continuar legíveis no grau 7. A aprovação não pode decorrer apenas de diminuir arbitrariamente a opacidade até o problema desaparecer.

### E29 · Órgãos recuperam matéria e detalhe comprovável

`app/scene/materiais.ts` passa a definir tratamentos distintos para órgãos, suporte corporal e focos. Órgãos não recebem transparência indiscriminada; quando uma estrutura interna precisar ser revelada, a atenuação de seu envoltório será localizada e ligada à exploração. Seleção e processo deixam de depender exclusivamente de aumentar emissividade e opacidade. A pele permanece suporte translúcido e a personalidade nova mantém presença separada, em conformidade com II-5, p. 226.

`app/scene/cena.tsx` passa a usar ambiente de estúdio e tone mapping explicitamente configurados, calibrados em conjunto com os shaders da emenda anterior. Mantêm-se as cores de identificação dos sistemas; iluminação não serve para substituí-las pela paleta anatômica da referência.

`scripts/construir-anatomia.mjs` ganha orçamento de simplificação orientado pela inspeção das peças compartilhadas. Hemisférios, fígado, coluna e pele são comparados com as geometrias do clone antes de se fixar uma redução. A representação de índices em `anatomia.ts` e nos arquivos produzidos deve comportar o resultado escolhido, sem truncamento. A verificação usa peças idênticas, mesma câmera, mesmo material e mesma luz: silhueta e relevos principais da versão distribuída não podem apresentar desvio superior a um pixel CSS nas vistas de inspeção aprovadas. O relatório de geração registra triângulos, vértices, tamanho e erro escolhido por estrutura. Não se acrescentam sistemas anatômicos para preencher visualmente o corpo.

O ambiente é gerado por `scripts/construir-ambiente.mjs` e distribuído em `public/ambiente.bin.gz`: o mesmo PMREM de `RoomEnvironment`, 768×1024, RGBA half-float, com compressão sem perdas. `ambiente.ts` compartilha a carga de CPU; cada renderer mantém seus próprios recursos de GPU. Não há convolução por montagem. `validate-ambiente.mjs` compara cinco rugosidades contra a geração original e verifica duas cenas e o descarte de um contexto: diferença máxima observada de zero níveis por canal.

A inspeção reproduzível em `scripts/validate-detalhe.mjs` compara redução anterior, distribuição e fonte nas quatro vistas, com câmera, material e iluminação iguais. Mantêm-se as faces da fonte nas cinco peças: pele 44.744 (543.288 bytes), hemisfério direito 55.452 (727.572 bytes), esquerdo 54.920 (719.532 bytes), coluna 95.804 (2.055.120 bytes) e fígado 59.642 (835.980 bytes). A redução anterior alterava contornos e relevos, especialmente sulcos cerebrais, vértebras e concavidades hepáticas. Os desvios máximos projetados de quantização são, respectivamente, 0,0064, 0,0381, 0,0343, 0,0094 e 0,0115 px CSS. Esses valores limitam os cantos das mesmas faces, sem tratar diferenças de iluminação como erro geométrico. Relatórios e capturas ficam em `.cache/visual/detalhe/`.

### E30 · Campos, santuários e firmamento passam a compartilhar profundidade, não a mesma primitiva

`app/scene/geometrias.ts` e `app/scene/materiais.ts` passam a representar campos como distribuições tênues de densidade, santuários como regiões locais sem membrana rígida e focos aurais como concentrações individualizáveis em um conjunto envolvente. Preserva-se a organização esférica do microcosmo descrita no Glossário, p. 373. O novo tratamento não cria órgãos nem equipara campos a tecidos físicos conhecidos.

Os focos antigos e novos continuam separados no estado e na apresentação, mantendo apagamento e inflamação conforme os processos já existentes e a passagem de III-11, p. 356. O shader deve produzir profundidade por distribuição espacial, paralaxe e atenuação, sem substituir o firmamento por estrelas decorativas independentes do corpo. A configuração é determinística para comparação de capturas.

A verificação exige órbita frontal, lateral e posterior, com e sem personalidade visível. Os santuários não podem produzir discos com borda dura na vista inicial; os campos devem continuar distinguíveis quando selecionados; focos aurais dianteiros e posteriores devem apresentar variação espacial perceptível durante a órbita. Na cena composta, cabeça e órgãos do tronco não podem perder legibilidade. A diferença entre estados −1, 5 e 7 deve permanecer reconhecível sem aumentar indiscriminadamente o número ou brilho de partículas.

### E31 · Cada forma procedural passa a respeitar a natureza do que representa

`app/scene/geometrias.ts`, `materiais.ts` e os parâmetros geométricos de `app/corpus/estruturas.ts` passam a distinguir fluxo, região, foco, cordão anatômico e agregado granular. Textos, relações e intervalos de processos permanecem congelados. As formas-pensamento deixam de ser partículas coincidentes com uma única linha: passam a concentrações tênues com seção espacial e dissolução nas extremidades, preservando o percurso descrito em I-4, pp. 47–48. Correntes internas conservam direção e participantes, com transporte visível de intensidade ou partículas em vez de aparência de cabo estático.

A cundalini passa a um agregado de grânulos em torno da pineal, conforme o Glossário, p. 366; não é suficiente adicionar brilho ao toro. A rosa permanece um foco localizado, sem pétalas ou anatomia inventada. Medula e cordões são tratados separadamente: a adoção de malha depende de identificação anatômica verificável na fonte; uma alternativa procedural exige suporte para trajetos e variações de forma. O circuito mantém descida direita e retorno esquerdo, conforme II-5, p. 225. Formas abstratas continuam representadas por suas relações, sem ganhar órgãos decorativos.

A conclusão exige inspeções isoladas da rosa, cundalini, medula, cordões e formas-pensamento, além do circuito montado nas vistas frontal e posterior. Os grânulos devem ser individualizáveis no isolamento; a corrente verde não pode voltar a formar uma linha uniforme em repouso ou movimento; direita e esquerda devem corresponder ao sujeito. As anotações causais de `construir.ts` conservam seus extremos e direção, mas sua aparência não pode ser confundida com a matéria da estrutura.

Limite da implementação: a fonte associa `FMA7647` (spinal cord) apenas a `FJ1737`, identificado como canal central, com 160 triângulos e aproximadamente 3,6 cm de extensão vertical na fonte. Isso não identifica uma malha da medula inteira; não foi encontrada malha de tronco simpático no atlas. Medula e cordões conservam os trajetos procedurais existentes. Não se acrescentam variações de calibre ou gânglios sem suporte anatômico verificável. A cundalini granular e as correntes com seção espacial são implementadas; a reconstrução anatômica detalhada desses nervos fica de fora por esse limite de evidência.

### E32 · A câmera enquadra o espaço disponível e o conjunto realmente inspecionado

`app/scene/cena.tsx` passa a receber ou medir os retângulos ocupados pela interface de `app/explorador.tsx`. O enquadramento inicial considera o corpo e o espaço livre entre cabeçalho, painéis e controles. A seleção comum preserva a orientação escolhida, compensando a ocupação do painel sem obrigar uma aproximação. O isolamento usa a caixa atual da estrutura ou da união de participantes visíveis, com margem de 10% a 15%, em vez de uma distância fixa independente da interface.

O cálculo é reaplicado após carga da anatomia, mudança de foco isolado, abertura ou fechamento de painel e redimensionamento. A saída do isolamento restaura a vista anterior. Objetos muito pequenos são ampliados pela câmera, nunca por alteração de suas dimensões no corpus. Planos de corte e limites de órbita devem permitir essa inspeção. A sombra corporal deixa de aparecer quando a personalidade não pertence ao conjunto mostrado.

A verificação reproduz primeiro a sequência da captura `nosso-1440-f-foco-isolado.png`, registrando o que impedia a aproximação. URLs diretas com foco e isolamento devem funcionar também em carga fria. Corpo inteiro no telefone, rosa, pineal, fígado, cordões e uma entidade abstrata devem caber no retângulo útil sem interseção com painéis. No isolamento de uma peça, sua maior dimensão projetada ocupa entre 60% e 80% da dimensão correspondente disponível, salvo limite explicitamente justificado para conjuntos abstratos. A câmera permanece estável após resize e ao voltar à cena completa.

### E33 · A interface deixa de comprimir conteúdo para preservar a figura

`app/explorador.tsx`, `detalhe.tsx`, `degrau.tsx` e `globals.css` passam a adotar uma composição responsiva explícita. No telefone, identidade e busca deixam de disputar uma linha com larguras inflexíveis. O texto “Buscar estrutura” permanece acessível, inclusive se o botão assumir apresentação por ícone. A senda ocupa uma linha própria; sua legenda pode quebrar em outra, integralmente. Separação e vistas têm posições planejadas, sem depender do transbordamento de um flex genérico.

A seleção de vista, a ação de isolamento e os controles de reprodução passam a usar formas e estados visuais consistentes. Símbolos sujeitos a apresentação como emoji são substituídos por ícones controlados, preservando nomes acessíveis. Os alvos de toque principais têm pelo menos 44×44 px. O painel de sistemas passa a distinguir expansão editorial de visibilidade na cena; recolher uma lista não desliga seu sistema.

Os cartões mantêm cabeçalho e ações disponíveis, com corpo rolável para todo o conteúdo existente. A largura desktop pode crescer até 384 px em 1440 px, desde que a câmera compense o espaço. Estados, citações e sinônimos permanecem completos, sem reticências impostas para viabilizar o layout. Texto de leitura nos cartões não fica abaixo de 14 px CSS; metadados podem ser menores, desde que legíveis.

A conclusão exige ausência de overflow horizontal em 390, 768, 1024 e 1440 px, leitura integral por rolagem dos detalhes mais longos e acesso por teclado a todas as 42 estruturas. Nenhuma descrição, citação ou verbete pode diferir do conteúdo anterior.

### E34 · Transições apresentam a mudança sem alterar seu significado

`app/scene/cena.tsx` passa a manter uma apresentação visual transitória separada do grau semântico da URL. Botões, legenda, cartão e URL respondem imediatamente; materiais e distribuições visuais convergem ao destino em 320 ms, com curva suave e sem ultrapassagem. A interpolação ocorre entre propriedades visuais calculadas para os estados válidos, evitando que um grau intermediário artificial dispare processos do corpus.

`app/detalhe.tsx`, `degrau.tsx` e `globals.css` passam a usar entrada e saída de até 200 ms, com deslocamento máximo de 12 px e opacidade. Trocas entre conteúdos no mesmo cartão não movimentam desnecessariamente o painel inteiro. Uma nova interação interrompe e redireciona a transição a partir da apresentação corrente. A carga inicial de URL mostra diretamente seu estado final. Redução de movimento elimina deslocamentos e interpolação temporal.

A verificação registra sequências com timestamps conhecidos em 0, 80, 160, 240, 320 e 400 ms. A passagem 4→5 deve apresentar estados visuais intermediários e terminar dentro do prazo; 5→4 durante a transição deve retornar exatamente ao destino. Repetição rápida, autoplay, mudança de seleção e isolamento não podem deixar materiais presos, alterar processos ou atrasar o estado da URL.

As mudanças discretas usam `history.replaceState`, integrado a `useSearchParams` pelo Next.js instalado, sem aguardar uma navegação RSC. O laço gráfico mantém no máximo um quadro pendente na GPU por meio de uma fence WebGL2 consultada sem espera bloqueante: não reduz detalhe, ambiente ou resolução para recuperar responsividade. O raycast filtra os sistemas invisíveis antes de testar as malhas, conservando a prioridade das estruturas internas.

### E35 · As rotas editoriais compartilham acabamento e preservam sua forma de leitura

`app/components/pagina-texto.tsx` e `globals.css` passam a compartilhar com o explorador o tratamento da identidade, foco, links, bordas, cores e espaçamentos. `/glossario` preserva definição serifada, termo, página e ligação ao atlas; `/fontes` preserva suas seções e a distinção entre prosa e referência bibliográfica. Nenhuma dessas páginas é convertida em uma coleção de cartões estreitos.

`app/senda/page.tsx` e `mini-cena.tsx` passam a reservar uma coluna real para a miniatura quando houver espaço suficiente. A miniatura acompanha a leitura com posicionamento sticky dentro dessa coluna, em vez de flutuar sobre uma região não reservada. Em larguras insuficientes, mantém-se sua ausência; o texto continua com leitura linear. A miniatura herda materiais corrigidos e enquadramento adequado ao seu próprio contêiner.

A verificação cobre 390, 1024, 1280 e 1440 px, navegação por âncoras e rolagem do início ao fim. A miniatura nunca intercepta o texto, as citações mantêm todos os caracteres e a ordem de leitura permanece igual. `/glossario` e `/fontes` só recebem alterações visuais demonstravelmente necessárias à coerência; o acabamento já satisfatório dessas páginas deve ser preservado.

### E36 · A cor volta a ser informação depois da travessia

`app/scene/materiais.ts` passa a compensar a travessia entre o matiz nomeado no livro e o pixel composto. O token da paleta permanece a fonte da matiz; o que se corrige é a saturação perdida no tonemapping ACES e na composição de um véu de alfa baixo sobre papel quase branco. As camadas do microcosmo são pintadas com a mesma matiz saturada e escurecida, e não com o token cru; a nova personalidade segue a mesma regra em ouro. Focos, órgãos, tubos, regiões e correntes recebem a saturação equivalente na tinta e no emissivo.

A pele passa a ler como carne, não como névoa: matiz mais quente e opacidade suficiente para dar volume, sem deixar de mostrar coluna, fígado, baço e rins. Os três santuários deixam de ser invisíveis, permanecendo nuvens sem contorno. Nenhuma matiz é trocada por outra, e a pré-multiplicação continua acontecendo uma única vez, pelo `premultiplied_alpha_fragment`, preservando a correção do alfa verificada em `validate-visual.mjs`.

A conclusão exige que os sete raios sejam distinguíveis entre si sobre o papel claro, que o firmamento dourado e o ouro da nova personalidade permaneçam como estão, e que nenhuma estrutura interna deixe de ser legível através da pele ou sob as camadas.

### E37 · A figura ocupa o quadro que lhe cabe

`app/scene/cena.tsx` passa a enquadrar a figura em 86% da área livre, e não em 74%, e a deslocá-la 5% para cima dentro dessa área. O viés é aplicado ao deslocamento da janela de projeção, e não ao alvo dos controles: mover o alvo deslocaria o eixo da órbita, e a figura passaria a girar em torno de um ponto que não é o seu centro. As camadas mais externas transbordam do quadro, como já previa o enquadramento; cabeça e pés permanecem dentro dele em todas as quatro vistas.

### E38 · A dock apertada devolve altura à figura

`app/globals.css` passa a comprimir espaçamentos, alturas de botão e entrelinha da dock apenas onde há ponteiro fino e largura de desktop. Os 44×44 px de alvo de toque exigidos por E33 continuam valendo em toda largura estreita e em qualquer dispositivo de toque. Nenhum controle sai da dock, nenhuma legenda é removida e nenhuma linha é truncada; o que encolhe é o espaço em volta dos controles.

### E39 · Só se isola o que tem forma a isolar

`app/corpus/corpus.ts` passa a expor `podeIsolar`, e `app/detalhe.tsx` deixa de renderizar o rodapé de isolamento para as estruturas que não a satisfazem. Uma estrutura `abstrata` não tem geometria na cena; uma `regiao` tem, mas é uma nuvem sem contorno, e isolá-la deixa na tela um borrão que não ensina onde ela está. Nos dois casos não há estrutura a isolar, e o botão não existe — nem visível e inerte, nem substituído por uma explicação.

`app/explorador.tsx` passa a concentrar a troca de foco num único caminho, que desliga o isolamento ao saltar para uma estrutura sem forma isolável: sem isso o usuário ficaria com a cena isolada e sem o botão que a restauraria. O isolamento por URL continua funcionando para qualquer estrutura, inclusive as abstratas, preservando as capturas de `validate-visual.mjs`.

`app/explorador.tsx` também remove o botão de recolher listas do painel de sistemas. Ele exibia um traço que se lia como separador, não como controle, e a distinção entre expansão editorial e visibilidade na cena — exigida por E33 — permanece garantida pela caixa de seleção de cada sistema, que continua sendo o único controle de visibilidade.
