import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Estrutura, FormaGeometrica, Vec3 } from '../corpus/tipos';
import type { Anatomia } from './anatomia';
import {
  corDoSistema,
  materialDaFigura,
  materialDaNovaPersonalidade,
  materialDeCamada,
  materialDeCorrente,
  materialDeEstrelasAurais,
  materialDeFoco,
  materialDeOrgao,
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

export function construirForma(e: Estrutura, anatomia: Anatomia): Construida {
  const cor = corDoSistema(e.sistema);
  const f: FormaGeometrica = e.forma;

  switch (f.tipo) {
    case 'malha': {
      // Anatomia de verdade: a malha vem pronta, em coordenadas de mundo já na
      // escala do §6.1. Não há transform a aplicar — e por isso, como nos tubos,
      // a âncora tem de vir do arquivo e não de `getWorldPosition`.
      const parte = anatomia.partes.get(f.parte);
      if (!parte) throw new Error(`anatomia não tem a parte "${f.parte}" (${e.id})`);

      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(parte.posicoes, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(parte.normais, 3, true));
      g.setIndex(new THREE.BufferAttribute(parte.indices, 1));
      g.computeBoundingSphere();

      const material =
        f.estilo === 'pele' || f.estilo === 'personalidade-dupla'
          ? materialDaFigura()
          : f.estilo === 'orgao'
            ? materialDeOrgao(cor)
            : materialDeFoco(cor);
      const malha = new THREE.Mesh(g, material);
      // A pele envolve tudo: desenhá-la por último evita que ela apague o que
      // há dentro dela quando o depth test decide a ordem sozinho.
      if (f.estilo === 'pele' || f.estilo === 'personalidade-dupla') malha.renderOrder = 8;
      else if (f.estilo === 'orgao') malha.renderOrder = 5;
      if (f.estilo === 'personalidade-dupla') {
        malha.userData.papel = 'personalidade-antiga';
        // "erguida na velha personalidade da natureza, porém FORA dela"
        // (II-5, p.226): a casca envolve a pele, não se esconde sob ela.
        // O escalonamento é em torno do centro da caixa, senão a figura
        // inteira sobe — a origem da malha não é o centro do corpo.
        const nova = new THREE.Mesh(g, materialDaNovaPersonalidade());
        const k = 1.022;
        const centro = new THREE.Vector3();
        g.computeBoundingBox();
        g.boundingBox?.getCenter(centro);
        nova.scale.setScalar(k);
        nova.position.copy(centro).multiplyScalar(1 - k);
        nova.renderOrder = 9;
        nova.userData.papel = 'personalidade-nova';
        nova.material.userData.papel = 'casca-nova';
        const grupo = new THREE.Group();
        grupo.add(malha, nova);
        // A casca NÃO é alvo de clique: por estar por fora, ela cobriria toda a
        // figura no raycast, e a prioridade que dá a vez às estruturas internas
        // só resolve o empate depois. A personalidade continua sendo alcançada
        // pela pele.
        return { objeto: grupo, ancora: v(parte.ancora), alvos: [malha], materiais: [material, nova.material] };
      }
      return { objeto: malha, ancora: v(parte.ancora), alvos: [malha], materiais: [material] };
    }

    case 'camada': {
      const material = materialDeCamada(cor);
      // Detalhe 5: com o Fresnel apertado, a facetagem do icosaedro de detalhe
      // 4 aparecia como anéis sobre o papel claro.
      const malha = new THREE.Mesh(new THREE.IcosahedronGeometry(f.raio, 5), material);
      malha.position.copy(v(e.posicao));
      malha.renderOrder = 10;
      // Camadas não entram no raycast: elas envolvem tudo e roubariam todo
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
        mergeGeometries(Array.from({ length: 28 }, (_, i) => {
          const a = i * Math.PI * 2 / 28;
          return new THREE.SphereGeometry(f.espessura * 0.82, 10, 8)
            .translate(Math.cos(a) * f.raio, Math.sin(a) * f.raio, 0);
        })),
        material,
      );
      malha.position.copy(v(e.posicao));
      malha.rotation.x = Math.PI / 2;
      // A âncora é um ponto SOBRE o anel: o centro dele é o furo, e um raio
      // mirado ali atravessa o vazio sem nunca tocar a geometria.
      const ancora = v(e.posicao).add(new THREE.Vector3(f.raio, 0, 0));
      return { objeto: malha, ancora, alvos: [malha], materiais: [material] };
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
      pontos.userData.largura = e.id === 'formas-pensamento' ? 0.075 : 0.006;
      avancarCorrente(pontos, 0);
      // Partículas são alvo ruim de clique; a corrente é alcançada pelo painel,
      // pela busca e pelo realce a partir das estruturas a que se liga.
      return { objeto: pontos, ancora: c.getPointAt(0.5), alvos: [], materiais: [material] };
    }

    case 'firmamento-aural': {
      const antigas = materialDeEstrelasAurais(new THREE.Color('#7d4242'), 0.05);
      // "Um novo céu e uma nova terra": as luzes que se inflamam no mesmo
      // firmamento são o sol latente e extinto que reacende — douradas, e mais
      // largas que as antigas, porque o novo céu se impõe ao velho.
      const novas = materialDeEstrelasAurais(new THREE.Color('#f2c14e'), 0.066);
      const criar = (defasagem: number) => {
        const pos = new Float32Array(f.focos * 3);
        // Ordem em que cada luz se inflama, espalhada pela esfera em vez de
        // seguir a espiral: o novo firmamento acende disperso, e não de cima
        // para baixo.
        const ordem = new Float32Array(f.focos);
        for (let i = 0; i < f.focos; i++) {
          const y = 1 - 2 * ((i + 0.5) / f.focos);
          const a = i * 2.399963 + defasagem;
          const xz = Math.sqrt(1 - y * y);
          const raio = f.raio * (0.84 + 0.16 * (0.5 + 0.5 * Math.sin(i * 7.13)));
          pos.set([e.posicao[0] + raio * xz * Math.cos(a), e.posicao[1] + raio * y, e.posicao[2] + raio * xz * Math.sin(a)], i * 3);
          const h = Math.sin((i + 1) * 12.9898 + defasagem) * 43758.5453;
          ordem[i] = h - Math.floor(h);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('ordem', new THREE.BufferAttribute(ordem, 1));
        return g;
      };
      const grupo = new THREE.Group();
      const velhos = new THREE.Points(criar(0), antigas);
      const novos = new THREE.Points(criar(0.9), novas);
      velhos.userData.papel = 'firmamento-antigo';
      novos.userData.papel = 'firmamento-novo';
      grupo.add(velhos, novos);
      return { objeto: grupo, ancora: v(e.posicao).add(new THREE.Vector3(f.raio, 0, 0)), alvos: [], materiais: [antigas, novas] };
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
    const largura = (pontos.userData.largura as number) * Math.sin(Math.PI * fase[i]!) ** 0.5;
    const concentracao = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(fase[i]! * Math.PI * 12));
    p.x += Math.sin(i * 12.9898) * largura * concentracao;
    p.y += Math.sin(i * 7.233) * largura * concentracao;
    p.z += Math.cos(i * 4.137) * largura * concentracao;
    attr.setXYZ(i, p.x, p.y, p.z);
  }
  attr.needsUpdate = true;
}
