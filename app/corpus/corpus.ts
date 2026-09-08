import { ESTRUTURAS_BRUTAS } from './estruturas';
import { VERBETES_BRUTOS } from './glossario';
import { LIGACOES, VERBETES_DE } from './relacoes';
import { DEGRAUS_BRUTOS } from './senda';
import type { DegrauDaSenda, Estrutura, Grau, Sistema, SistemaId, Verbete } from './tipos';

export * from './tipos';

/** Os sete raios do sol divino (I-3, p. 40), como cor de identidade. */
export const SISTEMAS: readonly Sistema[] = [
  {
    id: 'camadas',
    nome: 'Camadas do microcosmo',
    raio: 'violeta',
    cor: '#6a5c98',
    descricao:
      'As quatro esferas concêntricas do sistema de vida: da personalidade, no centro, ao campo espiritual magnético sétuplo, na borda.',
    ordem: 1,
  },
  {
    id: 'santuarios',
    nome: 'Os três santuários',
    raio: 'índigo',
    cor: '#4a5b8a',
    descricao:
      'Cabeça, coração e pelve — os três egos naturais, que despertam nessa ordem inversa no crescimento da criança.',
    ordem: 2,
  },
  {
    id: 'focos',
    nome: 'Focos gnósticos',
    raio: 'áureo',
    cor: '#a8801f',
    descricao: 'Os centros pelos quais a luz da Gnosis entra no sistema e nele opera.',
    ordem: 3,
  },
  {
    id: 'fogo-i',
    nome: 'Fogo serpentino — sistema espinal',
    raio: 'vermelho',
    cor: '#9c4137',
    descricao:
      'O sistema coluna vertebral–cérebro, sede do fogo da consciência dialética. O que não se converte, e sim se extingue.',
    ordem: 4,
  },
  {
    id: 'fogo-ii',
    nome: 'Fogo serpentino — simpático',
    raio: 'azul',
    cor: '#3f7692',
    descricao: 'A futura segunda medula espinal: Pingalá, Idá e a torre dos mistérios.',
    ordem: 5,
  },
  {
    id: 'figado-baco',
    nome: 'Sistema fígado-baço',
    raio: 'laranja',
    cor: '#a3671f',
    descricao: 'O domínio do eu sanguíneo, do ser-desejo — que tem no corpo uma sede determinada.',
    ordem: 6,
  },
  {
    id: 'correntes',
    nome: 'Sangue, éteres e correntes',
    raio: 'verde',
    cor: '#5b7c51',
    descricao: 'O que circula: sangue, éteres, hormônios e formas-pensamento.',
    ordem: 7,
  },
];

export const SISTEMA_POR_ID: ReadonlyMap<SistemaId, Sistema> = new Map(
  SISTEMAS.map((s) => [s.id, s]),
);

// ── Derivações. Simetria e reciprocidade não são invariantes a manter: são
// consequências de LIGACOES e VERBETES_DE serem declaradas uma vez cada.

const ligacoesPorId = new Map<string, string[]>();
for (const [a, b] of LIGACOES) {
  if (a === b) throw new Error(`ligação de ${a} consigo mesma`);
  (ligacoesPorId.get(a) ?? ligacoesPorId.set(a, []).get(a)!).push(b);
  (ligacoesPorId.get(b) ?? ligacoesPorId.set(b, []).get(b)!).push(a);
}

const verbetesPorEstrutura = new Map<string, string[]>();
for (const [slug, ids] of Object.entries(VERBETES_DE)) {
  for (const id of ids) {
    (verbetesPorEstrutura.get(id) ?? verbetesPorEstrutura.set(id, []).get(id)!).push(slug);
  }
}

export const ESTRUTURAS: readonly Estrutura[] = ESTRUTURAS_BRUTAS.map((e) => ({
  ...e,
  ligacoes: [...new Set(ligacoesPorId.get(e.id) ?? [])].sort(),
  verbetes: [...new Set(verbetesPorEstrutura.get(e.id) ?? [])].sort(),
}));

export const ESTRUTURA_POR_ID: ReadonlyMap<string, Estrutura> = new Map(
  ESTRUTURAS.map((e) => [e.id, e]),
);

export const VERBETES: readonly Verbete[] = VERBETES_BRUTOS.map((v) => ({
  ...v,
  estruturas: VERBETES_DE[v.slug] ?? [],
}));

export const VERBETE_POR_SLUG: ReadonlyMap<string, Verbete> = new Map(
  VERBETES.map((v) => [v.slug, v]),
);

export const SENDA: readonly DegrauDaSenda[] = DEGRAUS_BRUTOS.map((d) => ({
  ...d,
  ativa: ESTRUTURAS.filter((e) => e.grauDeAtivacao === d.grau).map((e) => e.id),
}));

export const GRAUS: readonly Grau[] = [0, 1, 2, 3, 4, 5, 6, 7];

/** Estruturas de um sistema, na ordem do inventário. */
export function estruturasDoSistema(id: SistemaId): readonly Estrutura[] {
  return ESTRUTURAS.filter((e) => e.sistema === id);
}

/** Busca por nome, sinônimo ou termo do Glossário ligado à estrutura. */
export function buscarEstruturas(consulta: string): readonly Estrutura[] {
  const q = normalizarBusca(consulta);
  if (!q) return [];
  return ESTRUTURAS.filter((e) => {
    const campos = [e.nome, ...e.sinonimos, ...e.verbetes.map((s) => VERBETE_POR_SLUG.get(s)?.termo ?? '')];
    return campos.some((c) => normalizarBusca(c).includes(q));
  });
}

export function normalizarBusca(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
