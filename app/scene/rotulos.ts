import * as THREE from 'three';
import { ESTRUTURA_POR_ID } from '../corpus/corpus';
import type { CenaConstruida } from './construir';

/**
 * Rótulos por projeção, com desconflitação por prioridade.
 *
 * Não se tenta rotular as 33 estruturas concretas ao mesmo tempo: não existe
 * ângulo de câmera em que 33 rótulos não colidam numa figura de 1.80 unidades
 * (emenda E8). Em colisão, o rótulo de menor prioridade **some** — nunca se
 * desloca, porque um rótulo deslocado mente sobre onde a estrutura está.
 *
 * Projeção é matemática pura: este módulo roda no Node, e é assim que o
 * validador prova que nenhum rótulo exibido colide.
 */

export interface Rotulo {
  id: string;
  nome: string;
  /** Pixels, canto superior esquerdo da viewport. */
  x: number;
  y: number;
  prioridade: number;
}

export interface OpcoesDeRotulo {
  cena: CenaConstruida;
  camera: THREE.Camera;
  largura: number;
  altura: number;
  /** Ids candidatos a rótulo — hover, seleção, sistema isolado, separação alta. */
  candidatos: Iterable<string>;
  /** Maior ganha a colisão. */
  prioridade?: (id: string) => number;
}

/** Caixa estimada de um rótulo, em pixels. 11px, caixa alta, tracking 0.08em. */
function caixa(r: Rotulo): { x0: number; y0: number; x1: number; y1: number } {
  const largura = r.nome.length * 7.6 + 18;
  return { x0: r.x - 6, y0: r.y - 9, x1: r.x + largura, y1: r.y + 9 };
}

function colide(a: Rotulo, b: Rotulo): boolean {
  const ca = caixa(a);
  const cb = caixa(b);
  return ca.x0 < cb.x1 && cb.x0 < ca.x1 && ca.y0 < cb.y1 && cb.y0 < ca.y1;
}

export function projetarRotulos(o: OpcoesDeRotulo): Rotulo[] {
  const p = new THREE.Vector3();
  const brutos: Rotulo[] = [];


  for (const id of o.candidatos) {
    const no = o.cena.nos.get(id);
    const e = ESTRUTURA_POR_ID.get(id);
    if (!no || !e || !no.objeto.visible) continue;

    p.copy(no.ancora).project(o.camera);
    // Atrás da câmera, ou fora da viewport com folga.
    if (p.z > 1 || p.x < -1.1 || p.x > 1.1 || p.y < -1.1 || p.y > 1.1) continue;

    brutos.push({
      id,
      nome: e.nome,
      x: ((p.x + 1) / 2) * o.largura,
      y: ((1 - p.y) / 2) * o.altura,
      prioridade: o.prioridade?.(id) ?? 0,
    });
  }

  // Desconflitação: maior prioridade primeiro; empate resolvido pelo que está
  // mais acima na tela, para o resultado ser estável entre frames.
  brutos.sort((a, b) => b.prioridade - a.prioridade || a.y - b.y || a.id.localeCompare(b.id));

  const mantidos: Rotulo[] = [];
  for (const r of brutos) {
    if (!mantidos.some((m) => colide(m, r))) mantidos.push(r);
  }
  return mantidos;
}
