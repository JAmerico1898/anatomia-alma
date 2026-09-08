/**
 * Esquema do corpus. Fonte canônica de tudo o que segue:
 *
 *   Rijckenborgh, J. van. O novo homem: conhecimento, iniciação, realização.
 *   Trad. Marcus Vinicius Mesquita de Sousa. 3. ed. Jarinu, SP: Pentagrama
 *   Publicações, 2016. ISBN 978-85-67992-54-9.
 *
 * Toda página é a página IMPRESSA, não a do PDF.
 */

export type SistemaId =
  | 'camadas'
  | 'santuarios'
  | 'focos'
  | 'fogo-i'
  | 'fogo-ii'
  | 'figado-baco'
  | 'correntes';

/** -1 é o estado natural, anterior à fé; 0 é a fé, chave da senda. */
export type Grau = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type FaseProcessual = 'inicia' | 'cresce' | 'substitui' | 'extingue' | 'completa';

export interface Processo {
  fase: FaseProcessual;
  inicio: Grau;
  fim: Grau;
  descricao: string;
}

export type TipoRelacao =
  | 'irradia-sobre'
  | 'transporta'
  | 'governa'
  | 'entra-por'
  | 'sai-por'
  | 'desce-por'
  | 'encontra'
  | 'sobe-por'
  | 'compoe'
  | 'alimenta'
  | 'forma'
  | 'transforma';

export interface Relacao {
  origem: string;
  destino: string;
  tipo: TipoRelacao;
  verbo: string;
  condicao?: string;
  grau?: Grau;
}

export type Vec3 = readonly [number, number, number];

export type FormaGeometrica =
  | { tipo: 'camada'; raio: number }
  | { tipo: 'foco'; raio: number }
  | { tipo: 'regiao'; raio: number }
  | { tipo: 'anel'; raio: number; espessura: number }
  | { tipo: 'tubo'; curva: readonly Vec3[]; raio: number }
  | { tipo: 'corrente'; curva: readonly Vec3[]; particulas: number }
  /**
   * Malha anatômica REAL, vinda de `public/anatomia.bin` (BodyParts3D 4.0).
   * `parte` é a chave no manifesto; `estilo` decide o material: a pele é o
   * corpo translúcido, `orgao` é víscera difusa, `foco` é glândula densa.
   */
  | { tipo: 'malha'; parte: string; estilo: 'pele' | 'personalidade-dupla' | 'orgao' | 'foco' }
  | { tipo: 'firmamento-aural'; raio: number; focos: number }
  | { tipo: 'abstrata' };

export interface Citacao {
  /** Trecho literal do livro. Conferido contra `livro/book.txt` (invariante 9). */
  texto: string;
  /** Capítulo na notação do livro: 'I-4', 'II-5', 'III-5', 'Glossário'. */
  capitulo: string;
  /** Página impressa. */
  pagina: number;
}

export interface Estrutura {
  id: string;
  nome: string;
  sistema: SistemaId;
  sinonimos: readonly string[];
  /** Centro para rótulo e enquadramento de câmera. */
  posicao: Vec3;
  forma: FormaGeometrica;
  /** 2–4 frases autorais, ancoradas no que as citações sustentam. */
  descricao: string;
  /** O que a estrutura é no homem dialético. */
  estadoDialetico: string;
  /** O que ela se torna no novo homem. */
  estadoNovo: string;
  /** Transformações graduais, inclusive substituição e extinção. */
  processos: readonly Processo[];
  citacoes: readonly Citacao[];
  /** Relações causais em que participa, preservando origem e destino. */
  relacoes: readonly Relacao[];
  /** Derivado de VERBETES_DE — recíproco por construção. */
  verbetes: readonly string[];
}

export interface Sistema {
  id: SistemaId;
  nome: string;
  /** Cor editorial de visualização; não atribui um raio divino ao sistema. */
  cor: string;
  corDeVisualizacao: string;
  descricao: string;
  ordem: number;
}

export interface Verbete {
  slug: string;
  termo: string;
  /** Texto do Glossário (pp. 363–378), verbatim nas palavras. */
  definicao: string;
  /** O número entre colchetes no Glossário: página da primeira menção. */
  paginaPrimeiraMencao: number;
  /** Derivado de VERBETES_DE. */
  estruturas: readonly string[];
}

export interface DegrauDaSenda {
  grau: Grau;
  nome: string;
  mudancaCorporal: string;
  /** Frases autorais que ligam o degrau ao que muda no corpo. */
  descricao: string;
  citacoes: readonly Citacao[];
  /** Derivado dos processos: ids cujo processo começa neste estado. */
  inicia: readonly string[];
}
