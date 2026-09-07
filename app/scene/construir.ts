import * as THREE from 'three';
import { ESTRUTURAS, ESTRUTURA_POR_ID, SISTEMAS } from '../corpus/corpus';
import type { Grau, SistemaId } from '../corpus/tipos';
import { avancarCorrente, construirForma } from './geometrias';
import { COR_IDA_DIALETICA, COR_IDA_NOVA, COR_ROSA, corDoSistema } from './materiais';

/**
 * Constrói a cena inteira, uma única vez, e devolve `aplicarEstado` para
 * atualizá-la. Não há máquina de estados nem fila de animações: arrastar o
 * slider de 0 a 7 e voltar é só reaplicar uniforms, e por isso nunca deixa um
 * material preso.
 *
 * NENHUMA linha deste módulo (ou dos que ele importa) toca `document`,
 * `window` ou `WebGLRenderer`. É essa disciplina que permite ao
 * `validate-scene.mjs` medir a cena real dentro do Node.
 */

export type Natureza = 'dialetico' | 'novo';

export interface EstadoCena {
  /** 0…7, contínuo enquanto o slider é arrastado. */
  grau: number;
  sistemasVisiveis: ReadonlySet<SistemaId>;
  /** 0…1. Afasta as cascas radialmente e separa os grupos de órgãos. */
  separar: number;
  foco: string | null;
  isolar: boolean;
  /** Em `duas-naturezas`, força o estado em vez de derivá-lo do grau. */
  natureza: Natureza | null;
}

export const ESTADO_INICIAL: EstadoCena = {
  grau: 0,
  sistemasVisiveis: new Set(SISTEMAS.map((s) => s.id)),
  separar: 0,
  foco: null,
  isolar: false,
  natureza: null,
};

interface NoDeEstrutura {
  id: string;
  sistema: SistemaId;
  objeto: THREE.Object3D;
  alvos: THREE.Object3D[];
  materiais: THREE.Material[];
  /** Posição de repouso; a separação desloca a partir daqui. */
  repouso: THREE.Vector3;
  /** Âncora de repouso, sobre a geometria (ver `Construida.ancora`). */
  ancoraRepouso: THREE.Vector3;
  /** Âncora corrente, já com a separação aplicada. Rótulos e câmera usam esta. */
  ancora: THREE.Vector3;
  /** Emissiva base, para não acumular ao reaplicar o estado. */
  corBase: THREE.Color;
}

export interface CenaConstruida {
  raiz: THREE.Group;
  nos: ReadonlyMap<string, NoDeEstrutura>;
  /** Malhas testáveis por raycast, na ordem de prioridade de seleção. */
  alvos: THREE.Object3D[];
  /** Qual estrutura um objeto atingido representa. */
  estruturaDe(objeto: THREE.Object3D): string | null;
  aplicarEstado(e: EstadoCena): void;
  animar(delta: number, grau: number): void;
  dispose(): void;
}

/** Direção em que cada sistema se afasta quando as camadas são separadas. */
const DIRECAO_SEPARACAO: Record<SistemaId, THREE.Vector3> = {
  cascas: new THREE.Vector3(0, 0, 0),
  santuarios: new THREE.Vector3(0, 0, 1),
  focos: new THREE.Vector3(0.9, 0, 0.5),
  'fogo-i': new THREE.Vector3(0, 0, -1),
  'fogo-ii': new THREE.Vector3(-0.9, 0, -0.5),
  'figado-baco': new THREE.Vector3(-0.9, 0, 0.5),
  correntes: new THREE.Vector3(0.9, 0, -0.5),
};

/** Progresso de ativação de uma estrutura no grau corrente. */
export function progressoDeAtivacao(grauDeAtivacao: Grau | null, grau: number): number {
  if (grauDeAtivacao === null) return 0;
  if (grauDeAtivacao === 0) return 1;
  return Math.min(1, Math.max(0, grau - (grauDeAtivacao - 1)));
}

/**
 * Rampa de extinção da coluna comum e do fogo da consciência. O §7.1 as situa
 * "entre os graus 6 e 7"; é essa rampa que dá ao grau 6 um estado distinto sem
 * inventar nenhuma ativação que o livro não afirme (emenda E7).
 */
export function progressoDeExtincao(grau: number): number {
  return Math.min(1, Math.max(0, grau - 6));
}

const EXTINGUEM = new Set(['coluna-vertebral', 'medula-espinal', 'fogo-da-consciencia']);

export function construirCena(): CenaConstruida {
  const raiz = new THREE.Group();
  raiz.name = 'microcosmo';

  const nos = new Map<string, NoDeEstrutura>();
  const alvos: THREE.Object3D[] = [];
  const donoDoObjeto = new Map<THREE.Object3D, string>();
  const correntes: THREE.Points[] = [];

  for (const e of ESTRUTURAS) {
    const { objeto, ancora, alvos: a, materiais } = construirForma(e);
    objeto.name = e.id;
    raiz.add(objeto);

    if ((objeto as THREE.Points).isPoints) correntes.push(objeto as THREE.Points);

    for (const alvo of a) {
      alvos.push(alvo);
      donoDoObjeto.set(alvo, e.id);
    }

    nos.set(e.id, {
      id: e.id,
      sistema: e.sistema,
      objeto,
      alvos: a,
      materiais,
      repouso: objeto.position.clone(),
      ancoraRepouso: ancora.clone(),
      ancora: ancora.clone(),
      corBase: e.id === 'rosa-do-coracao' ? COR_ROSA.clone() : corDoSistema(e.sistema),
    });
  }

  // A prioridade da figura (clicar nela seleciona `personalidade`, mas
  // qualquer estrutura interna sempre ganha) NÃO pode ser expressa pela ordem
  // deste array: o raycaster devolve os acertos por distância. Ela é aplicada
  // por quem consome os acertos — ver `cena.tsx`.

  function estruturaDe(objeto: THREE.Object3D): string | null {
    let o: THREE.Object3D | null = objeto;
    while (o) {
      const id = donoDoObjeto.get(o);
      if (id) return id;
      o = o.parent;
    }
    return null;
  }

  /** Estruturas realçadas: a selecionada e, se abstrata, as que ela liga. */
  function conjuntoRealcado(foco: string | null): Set<string> {
    if (!foco) return new Set();
    const e = ESTRUTURA_POR_ID.get(foco);
    if (!e) return new Set();
    if (e.forma.tipo === 'abstrata') return new Set([foco, ...e.ligacoes]);
    return new Set([foco]);
  }

  function aplicarEstado(estado: EstadoCena): void {
    const realcadas = conjuntoRealcado(estado.foco);
    const extincao = progressoDeExtincao(estado.grau);

    let indiceDeCasca = 0;
    for (const e of ESTRUTURAS) {
      const no = nos.get(e.id)!;

      // Visibilidade: sistema ligado e, se isolando, dentro do realce.
      const doSistema = estado.sistemasVisiveis.has(e.sistema);
      const visivel =
        doSistema && (!estado.isolar || realcadas.size === 0 || realcadas.has(e.id));
      no.objeto.visible = visivel;
      if (!visivel) continue;

      // Estado dialético → novo.
      const t =
        estado.natureza === null
          ? progressoDeAtivacao(e.grauDeAtivacao, estado.grau)
          : estado.natureza === 'novo' && e.grauDeAtivacao !== null
            ? 1
            : 0;

      // Separação de camadas.
      if (e.forma.tipo === 'casca') {
        const escala = 1 + estado.separar * (0.25 + indiceDeCasca * 0.22);
        indiceDeCasca++;
        no.objeto.scale.setScalar(escala);
        no.ancora.copy(no.ancoraRepouso).multiplyScalar(escala);
      } else {
        const deslocamento = DIRECAO_SEPARACAO[e.sistema]
          .clone()
          .multiplyScalar(estado.separar * 0.95);
        no.objeto.position.copy(no.repouso).add(deslocamento);
        no.ancora.copy(no.ancoraRepouso).add(deslocamento);
      }

      const realce = realcadas.has(e.id) ? 1 : 0;

      for (const m of no.materiais) {
        const std = m as THREE.MeshStandardMaterial;
        if (std.isMeshStandardMaterial) {
          std.emissiveIntensity = 0.18 + t * 0.95 + realce * 0.9;
          if (e.id === 'cordao-ida') {
            // II-5, p. 224: vermelha no homem comum, violeta-ametista no
            // candidato do quinto degrau.
            std.color.copy(COR_IDA_DIALETICA).lerp(COR_IDA_NOVA, t);
            std.emissive.copy(std.color);
          } else {
            std.emissive.copy(no.corBase);
          }
          if (EXTINGUEM.has(e.id)) {
            std.opacity = 0.9 * (1 - extincao * 0.94);
            std.emissiveIntensity *= 1 - extincao;
          }
        }

        const casca = m as THREE.ShaderMaterial;
        if (casca.isShaderMaterial && casca.uniforms.uIntensidade) {
          let intensidade = 0.45 + t * 0.5 + realce * 0.8;
          // I-17 p. 169: o ser aural é demolido na medida em que o eu se demole.
          if (e.id === 'ser-aural') intensidade *= 1 - 0.75 * Math.min(1, Math.max(0, (estado.grau - 5) / 2));
          casca.uniforms.uIntensidade.value = intensidade;
        }

        const pontos = m as THREE.PointsMaterial;
        if (pontos.isPointsMaterial) {
          pontos.opacity = 0.25 + t * 0.6 + realce * 0.3;
          pontos.size = 0.009 + t * 0.008;
        }

        const fisico = m as THREE.MeshPhysicalMaterial;
        if (fisico.isMeshPhysicalMaterial) {
          fisico.opacity = 0.16 + realce * 0.1;
        }
      }
    }

    atualizarMatrizes();
  }

  /**
   * Fecha `aplicarEstado`. Sem isto, `matrixWorld` fica obsoleta e tanto o
   * raycast quanto as âncoras passam a responder como se tudo estivesse na
   * origem — o que faz um raio pelo centro do corpo acertar quase tudo e um
   * teste de alcance passar por acaso.
   */
  function atualizarMatrizes(): void {
    raiz.updateMatrixWorld(true);
  }

  function animar(delta: number, grau: number): void {
    // Correntes ganham velocidade conforme a senda avança; o simpático assume
    // o brilho que a coluna perde na rampa de extinção.
    const velocidade = delta * (0.02 + 0.05 * (grau / 7));
    for (const p of correntes) if (p.visible) avancarCorrente(p, velocidade);
  }

  function dispose(): void {
    raiz.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
    });
    for (const no of nos.values()) for (const m of no.materiais) m.dispose();
  }

  aplicarEstado(ESTADO_INICIAL);
  return { raiz, nos, alvos, estruturaDe, aplicarEstado, animar, dispose };
}
