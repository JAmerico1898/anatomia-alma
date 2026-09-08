import * as THREE from 'three';
import { ESTRUTURAS, ESTRUTURA_POR_ID, RELACOES, SISTEMAS } from '../corpus/corpus';
import type { Processo, SistemaId } from '../corpus/tipos';
import type { Anatomia } from './anatomia';
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

export interface EstadoCena {
  /** 0…7, contínuo enquanto o slider é arrastado. */
  grau: number;
  sistemasVisiveis: ReadonlySet<SistemaId>;
  /** 0…1. Afasta as camadas radialmente e separa os grupos de órgãos. */
  separar: number;
  foco: string | null;
  isolar: boolean;
}

export const ESTADO_INICIAL: EstadoCena = {
  grau: -1,
  sistemasVisiveis: new Set(SISTEMAS.map((s) => s.id)),
  separar: 0,
  foco: null,
  isolar: false,
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
  /** Meia-diagonal da caixa da geometria: é o que o enquadramento de `isolar`
   * precisa saber para não deixar um fígado do tamanho de uma pineal. */
  raio: number;
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
  camadas: new THREE.Vector3(0, 0, 0),
  santuarios: new THREE.Vector3(0, 0, 1),
  focos: new THREE.Vector3(0.9, 0, 0.5),
  'fogo-i': new THREE.Vector3(0, 0, -1),
  'fogo-ii': new THREE.Vector3(-0.9, 0, -0.5),
  'figado-baco': new THREE.Vector3(-0.9, 0, 0.5),
  correntes: new THREE.Vector3(0.9, 0, -0.5),
};

/** Progresso de ativação de uma estrutura no grau corrente. */
export function progressoDoProcesso(processo: Processo, grau: number): number {
  if (processo.fim === processo.inicio) {
    return Math.min(1, Math.max(0, grau - (processo.inicio - 1)));
  }
  return Math.min(1, Math.max(0, (grau - processo.inicio) / (processo.fim - processo.inicio)));
}

/**
 * Rampa de extinção da coluna comum e do fogo da consciência. O §7.1 as situa
 * "entre os graus 6 e 7"; é essa rampa que dá ao grau 6 um estado distinto sem
 * inventar nenhuma ativação que o livro não afirme (emenda E7).
 */
export function progressoDaEstrutura(processos: readonly Processo[], grau: number): number {
  return processos
    .filter((p) => p.fase !== 'extingue')
    .reduce((maior, p) => Math.max(maior, progressoDoProcesso(p, grau)), 0);
}

export function construirCena(anatomia: Anatomia): CenaConstruida {
  const raiz = new THREE.Group();
  raiz.name = 'microcosmo';

  const nos = new Map<string, NoDeEstrutura>();
  const alvos: THREE.Object3D[] = [];
  const donoDoObjeto = new Map<THREE.Object3D, string>();
  const correntes: THREE.Points[] = [];
  const setas = new THREE.Group();
  setas.name = 'relacoes-causais';
  raiz.add(setas);

  for (const e of ESTRUTURAS) {
    const { objeto, ancora, alvos: a, materiais } = construirForma(e, anatomia);
    objeto.name = e.id;
    raiz.add(objeto);

    if ((objeto as THREE.Points).isPoints) correntes.push(objeto as THREE.Points);

    for (const m of materiais) {
      const std = m as THREE.MeshStandardMaterial;
      if (std.isMeshStandardMaterial) std.userData.opacidadeBase = std.opacity;
    }

    for (const alvo of a) {
      alvos.push(alvo);
      donoDoObjeto.set(alvo, e.id);
    }

    objeto.updateMatrixWorld(true);
    const caixa = new THREE.Box3().setFromObject(objeto);
    const raio = caixa.isEmpty() ? 0.05 : caixa.getSize(new THREE.Vector3()).length() / 2;

    nos.set(e.id, {
      id: e.id,
      sistema: e.sistema,
      raio,
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
    const vizinhas = e.relacoes.flatMap((r) => [r.origem, r.destino]);
    if (e.forma.tipo === 'abstrata') return new Set([foco, ...vizinhas]);
    return new Set([foco]);
  }

  function aplicarEstado(estado: EstadoCena): void {
    const realcadas = conjuntoRealcado(estado.foco);
    let indiceDeCamada = 0;
    for (const e of ESTRUTURAS) {
      const no = nos.get(e.id)!;

      // Visibilidade: sistema ligado e, se isolando, dentro do realce.
      const doSistema = estado.sistemasVisiveis.has(e.sistema);
      const visivel =
        doSistema && (!estado.isolar || realcadas.size === 0 || realcadas.has(e.id));
      no.objeto.visible = visivel;
      if (!visivel) continue;

      // Estado dialético → novo, derivado do grau corrente da senda.
      const t = progressoDaEstrutura(e.processos, estado.grau);
      const extincao = e.processos
        .filter((p) => p.fase === 'extingue')
        .reduce((maior, p) => Math.max(maior, progressoDoProcesso(p, estado.grau)), 0);

      // Separação de camadas.
      if (e.forma.tipo === 'camada') {
        const escala = 1 + estado.separar * (0.25 + indiceDeCamada * 0.22);
        indiceDeCamada++;
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
          // Faixa curta: sobre papel claro, emissivo alto satura para o branco
          // e a estrutura perde o matiz que a identifica. A ativação também
          // adensa o sólido, e é isso que se lê como "acendeu".
          std.emissiveIntensity = 0.05 + t * 0.4 + realce * 0.32;
          std.opacity = (std.userData.opacidadeBase as number) * (1 + t * 0.35 + realce * 0.25);
          if (e.id === 'cordao-ida') {
            // II-5, p. 224: vermelha no homem comum, violeta-ametista no
            // candidato do quinto degrau.
            std.color.copy(COR_IDA_DIALETICA).lerp(COR_IDA_NOVA, t);
            std.emissive.copy(std.color);
          } else {
            std.emissive.copy(no.corBase);
          }
          if (extincao > 0) {
            std.opacity *= 1 - extincao * 0.94;
            std.emissiveIntensity *= 1 - extincao;
          }
          std.opacity = Math.min(1, std.opacity);
        }

        const camada = m as THREE.ShaderMaterial;
        if (camada.isShaderMaterial && camada.uniforms.uIntensidade) {
          let intensidade = 0.34 + t * 0.42 + realce * 0.6;
          // I-17 p. 169: o ser aural é demolido na medida em que o eu se demole.
          if (e.id === 'ser-aural') intensidade *= 1 - 0.75 * Math.min(1, Math.max(0, (estado.grau - 5) / 2));
          camada.uniforms.uIntensidade.value = intensidade;
        }

        const pontos = m as THREE.PointsMaterial;
        if (pontos.isPointsMaterial) {
          pontos.opacity = 0.25 + t * 0.6 + realce * 0.3;
          pontos.size = 0.009 + t * 0.008;
        }

        const fisico = m as THREE.MeshPhysicalMaterial;
        if (fisico.isMeshPhysicalMaterial) {
          fisico.opacity = 0.38 + realce * 0.14;
        }
      }

      if (e.id === 'personalidade') {
        const inicio = e.processos.filter((p) => p.fase === 'inicia').reduce((v, p) => Math.max(v, progressoDoProcesso(p, estado.grau)), 0);
        const crescimento = e.processos.filter((p) => p.fase === 'cresce').reduce((v, p) => Math.max(v, progressoDoProcesso(p, estado.grau)), 0);
        no.objeto.traverse((o) => {
          const mesh = o as THREE.Mesh;
          const material = mesh.material as THREE.Material | undefined;
          if (!material) return;
          if (o.userData.papel === 'personalidade-antiga') (material as THREE.MeshPhysicalMaterial).opacity = 0.42 * (1 - crescimento * 0.42);
          if (o.userData.papel === 'personalidade-nova') (material as THREE.MeshStandardMaterial).opacity = inicio * 0.04 + crescimento * 0.48;
        });
      }
      if (e.id === 'focos-aurais') {
        no.objeto.traverse((o) => {
          const material = (o as THREE.Points).material as THREE.PointsMaterial | undefined;
          if (!material) return;
          if (o.userData.papel === 'firmamento-antigo') material.opacity = 0.75 * (1 - extincao * 0.88);
          if (o.userData.papel === 'firmamento-novo') material.opacity = t * 0.9;
        });
      }
    }

    // As setas são reconstruídas depois da separação, já entre as âncoras atuais.
    setas.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const material = m.material as THREE.Material | undefined;
      material?.dispose();
    });
    setas.clear();
    for (const r of RELACOES) {
      if (r.grau !== undefined && estado.grau < r.grau) continue;
      const a = nos.get(r.origem)?.ancora;
      const b = nos.get(r.destino)?.ancora;
      if (!a || !b || a.distanceTo(b) < 0.015) continue;
      const direcao = b.clone().sub(a);
      const seta = new THREE.ArrowHelper(direcao.clone().normalize(), a, direcao.length(), 0x6f6251, 0.025, 0.014);
      seta.userData.relacao = r;
      seta.visible = estado.foco === r.origem || estado.foco === r.destino;
      setas.add(seta);
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
