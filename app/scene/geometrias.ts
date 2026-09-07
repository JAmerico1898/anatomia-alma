import * as THREE from 'three';
import type { Estrutura, FormaGeometrica, Vec3 } from '../corpus/tipos';
import { construirFigura } from './figura';
import {
  corDoSistema,
  materialDeCasca,
  materialDeCorrente,
  materialDeFoco,
  materialDeRegiao,
  materialDeTubo,
} from './materiais';

/**
 * Uma forma do corpus vira um Object3D. Nada aqui toca o DOM: o módulo é
 * importável no Node, que é o que permite ao validador medir a cena de verdade.
 *
 * O spec (§6.2) previa um arquivo por família de forma; como cada construtor
 * tem poucas linhas, eles vivem juntos aqui — a fronteira que importa é
 * "geometria pura, sem renderer", e ela é respeitada.
 */

export interface Construida {
  objeto: THREE.Object3D;
  /**
   * Ponto de referência para rótulo, enquadramento de câmera e raycast.
   * Não se usa `getWorldPosition`: tubos e correntes têm a geometria em
   * coordenadas de mundo e sua transform fica na origem, que não é onde a
   * estrutura está.
   */
  ancora: THREE.Vector3;
  /** O que o raycast deve testar. Vazio para formas abstratas. */
  alvos: THREE.Object3D[];
  materiais: THREE.Material[];
}

const v = (p: Vec3) => new THREE.Vector3(p[0], p[1], p[2]);

function curva(pontos: readonly Vec3[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(pontos.map(v), false, 'catmullrom', 0.4);
}

export function construirForma(e: Estrutura): Construida {
  const cor = corDoSistema(e.sistema);
  const f: FormaGeometrica = e.forma;

  switch (f.tipo) {
    case 'figura': {
      const g = construirFigura();
      g.position.copy(v(e.posicao));
      const materiais: THREE.Material[] = [];
      const alvos: THREE.Object3D[] = [];
      g.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          alvos.push(o);
          const m = (o as THREE.Mesh).material as THREE.Material;
          if (!materiais.includes(m)) materiais.push(m);
        }
      });
      return { objeto: g, ancora: v(e.posicao), alvos, materiais };
    }

    case 'casca': {
      const material = materialDeCasca(cor);
      const malha = new THREE.Mesh(new THREE.IcosahedronGeometry(f.raio, 4), material);
      malha.position.copy(v(e.posicao));
      malha.renderOrder = 10;
      // Cascas não entram no raycast: elas envolvem tudo e roubariam todo
      // clique. São selecionáveis pelo painel e pela busca.
      return { objeto: malha, ancora: v(e.posicao), alvos: [], materiais: [material] };
    }

    case 'foco': {
      const material = materialDeFoco(cor);
      const malha = new THREE.Mesh(new THREE.SphereGeometry(f.raio, 20, 14), material);
      malha.position.copy(v(e.posicao));
      return { objeto: malha, ancora: v(e.posicao), alvos: [malha], materiais: [material] };
    }

    case 'regiao': {
      const material = materialDeRegiao(cor);
      const malha = new THREE.Mesh(new THREE.SphereGeometry(f.raio, 22, 16), material);
      malha.position.copy(v(e.posicao));
      malha.renderOrder = 5;
      return { objeto: malha, ancora: v(e.posicao), alvos: [malha], materiais: [material] };
    }

    case 'anel': {
      const material = materialDeFoco(cor);
      const malha = new THREE.Mesh(
        new THREE.TorusGeometry(f.raio, f.espessura, 8, 40),
        material,
      );
      malha.position.copy(v(e.posicao));
      malha.rotation.x = Math.PI / 2;
      return { objeto: malha, ancora: v(e.posicao), alvos: [malha], materiais: [material] };
    }

    case 'par': {
      const material = materialDeFoco(cor);
      const grupo = new THREE.Group();
      const alvos: THREE.Object3D[] = [];
      for (const s of [1, -1] as const) {
        const malha = new THREE.Mesh(new THREE.SphereGeometry(f.raio, 18, 12), material);
        malha.position.copy(v(e.posicao)).addScaledVector(v(f.offset), s);
        grupo.add(malha);
        alvos.push(malha);
      }
      return { objeto: grupo, ancora: v(e.posicao), alvos, materiais: [material] };
    }

    case 'tubo': {
      const material = materialDeTubo(cor);
      const c = curva(f.curva);
      const malha = new THREE.Mesh(new THREE.TubeGeometry(c, 96, f.raio, 10, false), material);
      // A âncora é um ponto que realmente está SOBRE o tubo.
      return { objeto: malha, ancora: c.getPointAt(0.5), alvos: [malha], materiais: [material] };
    }

    case 'corrente': {
      const material = materialDeCorrente(cor);
      const c = curva(f.curva);
      const posicoes = new Float32Array(f.particulas * 3);
      const fase = new Float32Array(f.particulas);
      for (let i = 0; i < f.particulas; i++) {
        fase[i] = i / f.particulas;
        const p = c.getPointAt(fase[i]!);
        posicoes[i * 3] = p.x;
        posicoes[i * 3 + 1] = p.y;
        posicoes[i * 3 + 2] = p.z;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
      const pontos = new THREE.Points(g, material);
      pontos.userData.curva = c;
      pontos.userData.fase = fase;
      // Partículas são alvo ruim de clique; a corrente é alcançada pelo painel,
      // pela busca e pelo realce a partir das estruturas a que se liga.
      return { objeto: pontos, ancora: c.getPointAt(0.5), alvos: [], materiais: [material] };
    }

    case 'abstrata': {
      // Sem geometria própria: ao ser selecionada, realça as estruturas
      // concretas às quais se liga (ver `construirCena`).
      const marcador = new THREE.Object3D();
      marcador.position.copy(v(e.posicao));
      return { objeto: marcador, ancora: v(e.posicao), alvos: [], materiais: [] };
    }
  }
}

/** Avança as partículas de uma corrente ao longo de sua curva. */
export function avancarCorrente(pontos: THREE.Points, delta: number): void {
  const c = pontos.userData.curva as THREE.CatmullRomCurve3 | undefined;
  const fase = pontos.userData.fase as Float32Array | undefined;
  if (!c || !fase) return;
  const attr = pontos.geometry.getAttribute('position') as THREE.BufferAttribute;
  const p = new THREE.Vector3();
  for (let i = 0; i < fase.length; i++) {
    fase[i] = (fase[i]! + delta) % 1;
    c.getPointAt(fase[i]!, p);
    attr.setXYZ(i, p.x, p.y, p.z);
  }
  attr.needsUpdate = true;
}
