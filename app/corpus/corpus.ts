import { ESTRUTURAS_BRUTAS } from './estruturas';
import { VERBETES_BRUTOS } from './glossario';
import { RELACOES, VERBETES_DE } from './relacoes';
import { DEGRAUS_BRUTOS } from './senda';
import type { DegrauDaSenda, Estrutura, Grau, Sistema, SistemaId, Verbete } from './tipos';

export * from './tipos';
export { RELACOES } from './relacoes';

/** Paleta editorial da interface; não é uma correspondência anatômica dos sete raios. */
export const SISTEMAS: readonly Sistema[] = [
  {
    id: 'camadas',
    nome: 'Camadas do microcosmo',
    corDeVisualizacao: 'violeta',
    cor: '#6a5c98',
    descricao:
      'As quatro esferas concêntricas do sistema de vida: da personalidade, no centro, ao campo espiritual magnético sétuplo, na borda.',
    ordem: 1,
  },
  {
    id: 'santuarios',
    nome: 'Os três santuários',
    corDeVisualizacao: 'índigo',
    cor: '#4a5b8a',
    descricao:
      'Cabeça, coração e pelve — os três egos naturais, que despertam nessa ordem inversa no crescimento da criança.',
    ordem: 2,
  },
  {
    id: 'focos',
    nome: 'Focos gnósticos',
    corDeVisualizacao: 'ocre',
    cor: '#a8801f',
    descricao: 'Os centros pelos quais a luz da Gnosis entra no sistema e nele opera.',
    ordem: 3,
  },
  {
    id: 'fogo-i',
    nome: 'Fogo serpentino — sistema espinal',
    corDeVisualizacao: 'vermelho',
    cor: '#9c4137',
    descricao:
      'O sistema coluna vertebral–cérebro, sede do fogo da consciência dialética. O que não se converte, e sim se extingue.',
    ordem: 4,
  },
  {
    id: 'fogo-ii',
    nome: 'Fogo serpentino — simpático',
    corDeVisualizacao: 'azul',
    cor: '#3f7692',
    descricao: 'A futura segunda medula espinal: Pingalá, Idá e a torre dos mistérios.',
    ordem: 5,
  },
  {
    id: 'figado-baco',
    nome: 'Sistema fígado-baço',
    corDeVisualizacao: 'laranja',
    cor: '#a3671f',
    descricao: 'O domínio do eu sanguíneo, do ser-desejo — que tem no corpo uma sede determinada.',
    ordem: 6,
  },
  {
    id: 'correntes',
    nome: 'Sangue, éteres e correntes',
    corDeVisualizacao: 'verde',
    cor: '#5b7c51',
    descricao: 'O que circula: sangue, éteres, hormônios e formas-pensamento.',
    ordem: 7,
  },
];

export const SISTEMA_POR_ID: ReadonlyMap<SistemaId, Sistema> = new Map(
  SISTEMAS.map((s) => [s.id, s]),
);

const relacoesPorId = new Map<string, typeof RELACOES[number][]>();
for (const relacao of RELACOES) {
  if (relacao.origem === relacao.destino) throw new Error(`relação de ${relacao.origem} consigo mesma`);
  for (const id of [relacao.origem, relacao.destino]) {
    (relacoesPorId.get(id) ?? relacoesPorId.set(id, []).get(id)!).push(relacao);
  }
}

const verbetesPorEstrutura = new Map<string, string[]>();
for (const [slug, ids] of Object.entries(VERBETES_DE)) {
  for (const id of ids) {
    (verbetesPorEstrutura.get(id) ?? verbetesPorEstrutura.set(id, []).get(id)!).push(slug);
  }
}

export const ESTRUTURAS: readonly Estrutura[] = ESTRUTURAS_BRUTAS.map((e) => ({
  ...e,
  relacoes: relacoesPorId.get(e.id) ?? [],
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
  inicia: ESTRUTURAS.filter((e) => e.processos.some((p) => p.inicio === d.grau)).map((e) => e.id),
}));

export const GRAUS: readonly Grau[] = [-1, 0, 1, 2, 3, 4, 5, 6, 7];

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
