import { ESTRUTURA_POR_ID, SISTEMAS } from './corpus/corpus';
import type { Grau, SistemaId } from './corpus/tipos';

/**
 * Todo o estado do explorador vive na URL (§9). Não há persistência, conta nem
 * armazenamento local: um link é o estado inteiro.
 *
 * `modo` é EXCLUSIVO. `/` abre em `senda&grau=0`, e o grau 0 **é** o estado
 * dialético — um só baseline, sem um terceiro modo fantasma.
 */

export type Modo = 'senda' | 'duas-naturezas';
export type Apresentacao = 'dividida' | 'alternada';
export type Natureza = 'dialetico' | 'novo';

export interface EstadoUrl {
  modo: Modo;
  grau: Grau;
  foco: string | null;
  isolar: boolean;
  sistemas: SistemaId[];
  separar: number;
  /** null = seguir o viewport (dividida ≥1024px, alternada abaixo). */
  apresentacao: Apresentacao | null;
  natureza: Natureza;
}

const TODOS = SISTEMAS.map((s) => s.id);
const E_SISTEMA = new Set<string>(TODOS);

export const ESTADO_PADRAO: EstadoUrl = {
  modo: 'senda',
  grau: 0,
  foco: null,
  isolar: false,
  sistemas: TODOS,
  separar: 0,
  apresentacao: null,
  natureza: 'dialetico',
};

function inteiro(v: string | null, min: number, max: number, padrao: number): number {
  const n = Number(v);
  return v !== null && Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : padrao;
}

export function lerEstado(p: URLSearchParams): EstadoUrl {
  const sistemasBrutos = p.get('sistemas');
  const sistemas = sistemasBrutos
    ? (sistemasBrutos.split(',').filter((s) => E_SISTEMA.has(s)) as SistemaId[])
    : TODOS;

  const foco = p.get('foco');

  return {
    modo: p.get('modo') === 'duas-naturezas' ? 'duas-naturezas' : 'senda',
    grau: inteiro(p.get('grau'), 0, 7, 0) as Grau,
    foco: foco && ESTRUTURA_POR_ID.has(foco) ? foco : null,
    isolar: p.get('isolar') === '1',
    sistemas: sistemas.length > 0 ? sistemas : TODOS,
    separar: inteiro(p.get('separar'), 0, 100, 0) / 100,
    apresentacao:
      p.get('apresentacao') === 'dividida'
        ? 'dividida'
        : p.get('apresentacao') === 'alternada'
          ? 'alternada'
          : null,
    natureza: p.get('natureza') === 'novo' ? 'novo' : 'dialetico',
  };
}

/** Só o que difere do padrão vai para a URL — links curtos e legíveis. */
export function escreverEstado(e: EstadoUrl): string {
  const p = new URLSearchParams();
  if (e.modo !== ESTADO_PADRAO.modo) p.set('modo', e.modo);
  if (e.modo === 'senda' && e.grau !== 0) p.set('grau', String(e.grau));
  if (e.foco) p.set('foco', e.foco);
  if (e.isolar) p.set('isolar', '1');
  if (e.sistemas.length !== TODOS.length) p.set('sistemas', e.sistemas.join(','));
  if (e.separar > 0) p.set('separar', String(Math.round(e.separar * 100)));
  if (e.modo === 'duas-naturezas') {
    if (e.apresentacao) p.set('apresentacao', e.apresentacao);
    if (e.apresentacao === 'alternada' && e.natureza !== 'dialetico') p.set('natureza', e.natureza);
  }
  const q = p.toString();
  return q ? `/?${q}` : '/';
}

/** A legenda da cena, na linha central baixa (§7.3), e o `aria-label` da cena. */
export function legenda(e: EstadoUrl, nomeDoFoco: string | null, nomeDoGrau: string): string {
  if (e.isolar && nomeDoFoco) return nomeDoFoco.toUpperCase();
  if (e.separar > 0.02) return `ESTRUTURAS SEPARADAS · ${Math.round(e.separar * 100)}%`;
  if (e.modo === 'duas-naturezas') {
    return e.apresentacao === 'alternada'
      ? `MICROCOSMO · ${e.natureza === 'novo' ? 'NOVO HOMEM' : 'HOMEM DIALÉTICO'}`
      : 'MICROCOSMO · DIALÉTICO ⇄ NOVO HOMEM';
  }
  return `MICROCOSMO · GRAU ${e.grau} · ${nomeDoGrau.toUpperCase()}`;
}
