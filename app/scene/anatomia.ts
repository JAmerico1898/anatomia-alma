import type { Vec3 } from '../corpus/tipos';

/**
 * O corpo do atlas é anatomia REAL, não um manequim: as malhas vêm de
 * BodyParts3D 4.0 (adulto masculino de referência, CC BY 4.0), pela conversão
 * do projeto Human Atlas, e são reduzidas ao que "O novo homem" de fato nomeia
 * — pele, esterno, timo, pineal, hemisférios, medula oblonga, coluna, fígado,
 * baço, rins, suprarrenais e sacro. Nenhum outro órgão entra na cena.
 *
 * `scripts/construir-anatomia.mjs` produz `public/anatomia.{bin,json}` já na
 * escala do §6.1 (pés em y=-1.30, topo da cabeça em y=+0.50, rosa na origem).
 * Este módulo só decodifica — nada aqui toca o DOM, o que mantém a cena
 * mensurável dentro do Node por `validate-scene.mjs`.
 */

export const PES_Y = -1.3;
export const TOPO_Y = 0.5;
export const ALTURA = TOPO_Y - PES_Y;

/** A pele serve de suporte à personalidade natural e à malha nascente distinta. */
export const ID_DA_PELE = 'personalidade';
export const PAPEIS_DA_PERSONALIDADE = ['personalidade-antiga', 'personalidade-nova'] as const;

export interface ParteAnatomica {
  id: string;
  /** Nome anatômico na fonte, em inglês (`skin`, `liver`, …). */
  nome: string;
  /** Identificador FMA do conceito de origem. */
  conceito: string;
  /** Quantas malhas da fonte foram unidas nesta. */
  malhasDeOrigem: number;
  /** Já desquantizadas: o arquivo guarda Uint16 relativos à caixa da peça. */
  posicoes: Float32Array;
  normais: Int16Array;
  indices: Uint16Array | Uint32Array;
  caixa: readonly [Vec3, Vec3];
  centro: Vec3;
  /** Ponto SOBRE a malha, mais próximo do centro da caixa. */
  ancora: Vec3;
}

export interface Anatomia {
  fonte: string;
  licenca: string;
  partes: ReadonlyMap<string, ParteAnatomica>;
  /** Raios máximos em x e z, por faixa de altura, medidos na pele. */
  silhueta: readonly (readonly [number, number])[];
}

interface ManifestoParte {
  nome: string;
  conceito: string;
  malhasDeOrigem: number;
  vertices: number;
  triangulos: number;
  bitsIndices?: number;
  posicoes: number;
  normais: number;
  indices: number;
  passo: number[];
  caixa: [number[], number[]];
  centro: number[];
  ancora: number[];
}

export interface Manifesto {
  fonte: string;
  licenca: string;
  bytes: number;
  silhueta: [number, number][];
  partes: Record<string, ManifestoParte>;
}

const v3 = (a: number[]): Vec3 => [a[0]!, a[1]!, a[2]!];

export function decodificarAnatomia(manifesto: Manifesto, bin: ArrayBuffer): Anatomia {
  if (bin.byteLength !== manifesto.bytes) {
    throw new Error(
      `anatomia.bin tem ${bin.byteLength} bytes, o manifesto declara ${manifesto.bytes}`,
    );
  }
  const partes = new Map<string, ParteAnatomica>();
  for (const [id, p] of Object.entries(manifesto.partes)) {
    // Desquantização: `posicao = min + passo * inteiro`, por eixo. É o único
    // trabalho de CPU na carga, e custa três multiplicações por vértice.
    const bruto = new Uint16Array(bin, p.posicoes, p.vertices * 3);
    const posicoes = new Float32Array(bruto.length);
    for (let i = 0; i < bruto.length; i += 3) {
      posicoes[i] = p.caixa[0][0]! + bruto[i]! * p.passo[0]!;
      posicoes[i + 1] = p.caixa[0][1]! + bruto[i + 1]! * p.passo[1]!;
      posicoes[i + 2] = p.caixa[0][2]! + bruto[i + 2]! * p.passo[2]!;
    }
    partes.set(id, {
      id,
      nome: p.nome,
      conceito: p.conceito,
      malhasDeOrigem: p.malhasDeOrigem,
      posicoes,
      normais: new Int16Array(bin, p.normais, p.vertices * 3),
      indices: new (p.bitsIndices === 32 ? Uint32Array : Uint16Array)(bin, p.indices, p.triangulos * 3),
      caixa: [v3(p.caixa[0]), v3(p.caixa[1])],
      centro: v3(p.centro),
      ancora: v3(p.ancora),
    });
  }
  return {
    fonte: manifesto.fonte,
    licenca: manifesto.licenca,
    partes,
    silhueta: manifesto.silhueta,
  };
}

/**
 * O ponto está dentro do corpo? Usado por `validate-scene.mjs` para provar que
 * nenhum foco do corpus flutua fora da figura — agora contra a silhueta medida
 * da pele de verdade, e não contra um perfil desenhado à mão.
 *
 * O teste é elíptico por faixa de altura e usa o raio MÁXIMO da faixa, o que o
 * torna deliberadamente generoso: ele reprova o que está claramente fora, não o
 * que está entre o tronco e o braço.
 */
export function dentroDaFigura(a: Anatomia, p: Vec3, folga = 1.02): boolean {
  const [x, y, z] = p;
  if (y > TOPO_Y || y < PES_Y) return false;
  const n = a.silhueta.length;
  const f = Math.min(n - 1, Math.max(0, Math.floor(((y - PES_Y) / ALTURA) * n)));
  const [rx, rz] = a.silhueta[f]!;
  if (rx <= 0 || rz <= 0) return false;
  return (x / (rx * folga)) ** 2 + (z / (rz * folga)) ** 2 <= 1;
}

/** Carga no navegador. A promessa é memoizada: `/` e `/senda` montam duas cenas. */
let pendente: Promise<Anatomia> | null = null;

export function carregarAnatomia(): Promise<Anatomia> {
  pendente ??= (async () => {
    const [manifesto, bin] = await Promise.all([
      fetch('/anatomia.json').then((r) => r.json() as Promise<Manifesto>),
      fetch('/anatomia.bin').then((r) => r.arrayBuffer()),
    ]);
    return decodificarAnatomia(manifesto, bin);
  })().catch((erro) => {
    pendente = null;
    throw erro;
  });
  return pendente;
}
