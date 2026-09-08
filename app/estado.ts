import { ESTRUTURA_POR_ID, SISTEMAS } from './corpus/corpus';
import type { Grau, SistemaId } from './corpus/tipos';

/**
 * Todo o estado do explorador vive na URL (§9). Não há persistência, conta nem
 * armazenamento local: um link é o estado inteiro.
 *
 * A cena tem um só eixo de tempo — a senda, de 0 a 7. O grau 0 **é** o estado
 * dialético: ele é o ponto de partida do percurso, não uma alternativa a ele.
 */

export interface EstadoUrl {
  grau: Grau;
  foco: string | null;
  isolar: boolean;
  sistemas: SistemaId[];
  separar: number;
}

const TODOS = SISTEMAS.map((s) => s.id);
const E_SISTEMA = new Set<string>(TODOS);

export const ESTADO_PADRAO: EstadoUrl = {
  grau: 0,
  foco: null,
  isolar: false,
  sistemas: TODOS,
  separar: 0,
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
    grau: inteiro(p.get('grau'), 0, 7, 0) as Grau,
    foco: foco && ESTRUTURA_POR_ID.has(foco) ? foco : null,
    isolar: p.get('isolar') === '1',
    sistemas: sistemas.length > 0 ? sistemas : TODOS,
    separar: inteiro(p.get('separar'), 0, 100, 0) / 100,
  };
}

/** Só o que difere do padrão vai para a URL — links curtos e legíveis. */
export function escreverEstado(e: EstadoUrl): string {
  const p = new URLSearchParams();
  if (e.grau !== 0) p.set('grau', String(e.grau));
  if (e.foco) p.set('foco', e.foco);
  if (e.isolar) p.set('isolar', '1');
  if (e.sistemas.length !== TODOS.length) p.set('sistemas', e.sistemas.join(','));
  if (e.separar > 0) p.set('separar', String(Math.round(e.separar * 100)));
  const q = p.toString();
  return q ? `/?${q}` : '/';
}

/** A legenda da cena, na linha central baixa (§7.3), e o `aria-label` da cena. */
export function legenda(e: EstadoUrl, nomeDoFoco: string | null, nomeDoGrau: string): string {
  if (e.isolar && nomeDoFoco) return nomeDoFoco.toUpperCase();
  if (e.separar > 0.02) return `ESTRUTURAS SEPARADAS · ${Math.round(e.separar * 100)}%`;
  return `MICROCOSMO · GRAU ${e.grau} · ${nomeDoGrau.toUpperCase()}`;
}
