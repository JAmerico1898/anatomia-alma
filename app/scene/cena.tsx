'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ESTRUTURA_POR_ID } from '../corpus/corpus';
import type { SistemaId } from '../corpus/tipos';
import { carregarAnatomia, type Anatomia } from './anatomia';
import { construirCena, type CenaConstruida } from './construir';
import { PES_Y } from './anatomia';
import { materialDeSombra } from './materiais';
import { projetarRotulos, type Rotulo } from './rotulos';

/**
 * O ÚNICO client component com three.js. Tudo que ele monta vem de
 * `construirCena()`, que não conhece o DOM — é essa separação que permite ao
 * `validate-scene.mjs` medir a mesma cena dentro do Node.
 */

export type Vista = 'tres-quartos' | 'frente' | 'lado' | 'costas';

export interface PropsDaCena {
  grau: number;
  sistemas: readonly SistemaId[];
  separar: number;
  foco: string | null;
  isolar: boolean;
  vista: Vista;
  rotacaoAutomatica: boolean;
  onSelecionar: (id: string | null) => void;
}

/**
 * Enquadramento: o assunto é o CORPO, não a aura. As distâncias são calibradas
 * para que a figura (1.80 de altura) ocupe cerca de três quartos da vertical,
 * deixando as camadas transbordarem um pouco do quadro em vez de encolherem o
 * corpo para caberem inteiras.
 */
const POSICAO_DA_VISTA: Record<Vista, [number, number, number]> = {
  'tres-quartos': [1.95, 0.35, 2.4],
  frente: [0, -0.25, 3.2],
  lado: [3.2, -0.25, 0],
  costas: [0, -0.25, -3.2],
};

/** O centro geométrico da figura, não a origem — a rosa fica na altura do peito. */
const ALVO_PADRAO = new THREE.Vector3(0, -0.38, 0);

/**
 * Estruturas que CONTÊM outras: a pele e as vísceras. Um clique só cai nelas se
 * não houver nada mais específico atrás do ponteiro.
 */
const INVOLUCROS = new Set(
  [...ESTRUTURA_POR_ID.values()]
    .filter((e) => e.forma.tipo === 'malha' && e.forma.estilo !== 'foco')
    .map((e) => e.id),
);

export function Cena(props: PropsDaCena) {
  const hospedeiro = useRef<HTMLDivElement>(null);
  // A anatomia real vem de `public/anatomia.bin`; nada pode ser montado antes.
  const [anatomia, setAnatomia] = useState<Anatomia | null>(null);
  const [falha, setFalha] = useState(false);
  const [rotulos, setRotulos] = useState<Rotulo[]>([]);
  const [sobre, setSobre] = useState<string | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  // Lido de dentro do laço de render sem obrigar a recriá-lo.
  const sobreRef = useRef<string | null>(null);
  sobreRef.current = sobre;

  // Referências vivas do motor, criadas uma única vez.
  const motor = useRef<{
    renderer: THREE.WebGLRenderer;
    cena: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controles: OrbitControls;
    construida: CenaConstruida;
  } | null>(null);

  useEffect(() => {
    let vivoAqui = true;
    carregarAnatomia().then(
      (a) => { if (vivoAqui) setAnatomia(a); },
      () => { if (vivoAqui) setFalha(true); },
    );
    return () => { vivoAqui = false; };
  }, []);

  useEffect(() => {
    const div = hospedeiro.current;
    if (!div || !anatomia) return;

    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Canvas transparente: o papel e o horizonte vêm do CSS atrás dele, o que
    // dá o degradê sem custar um plano a mais na cena.
    renderer.setClearAlpha(0);
    div.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';

    // Luz de estúdio, não de cripta: hemisférica para o volume geral, uma chave
    // quente à frente e um preenchimento frio atrás, de modo que a figura tenha
    // relevo sem que nada estoure sobre o fundo claro.
    const cena = new THREE.Scene();
    cena.add(new THREE.HemisphereLight(0xffffff, 0xc9ccd2, 1.15));
    const luz = new THREE.DirectionalLight(0xfff4e8, 1.35);
    luz.position.set(1.6, 2.4, 2.6);
    cena.add(luz);
    const contraluz = new THREE.DirectionalLight(0xcfd8ea, 0.55);
    contraluz.position.set(-2.2, 0.6, -2.4);
    cena.add(contraluz);

    // Sombra de contato: ancora a figura no chão em vez de deixá-la boiando.
    // A elipse é JUSTA à pegada dos pés de propósito. A câmera olha o plano do
    // chão de uns 28° apenas; uma elipse larga projeta um leque enorme cujo
    // miolo — a única parte escura — cai bem embaixo do corpo e some atrás das
    // pernas, deixando à vista só a periferia, que é transparente.
    const sombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialDeSombra());
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.set(0, PES_Y - 0.004, 0.02);
    sombra.scale.set(0.85, 0.38, 1);
    sombra.renderOrder = -1;
    cena.add(sombra);

    const construida = construirCena(anatomia);
    cena.add(construida.raiz);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
    camera.position.set(...POSICAO_DA_VISTA['tres-quartos']);

    const controles = new OrbitControls(camera, renderer.domElement);
    controles.target.copy(ALVO_PADRAO);
    controles.enableDamping = !reduzirMovimento;
    controles.dampingFactor = 0.08;
    controles.minDistance = 0.15;
    controles.maxDistance = 9;
    controles.enablePan = false;
    controles.update();

    motor.current = { renderer, cena, camera, controles, construida };

    // ── Dimensionamento
    const redimensionar = () => {
      const { clientWidth: l, clientHeight: a } = div;
      if (l === 0 || a === 0) return;
      // updateStyle ligado: com devicePixelRatio > 1, deixar o canvas sem
      // tamanho em CSS o faria ocupar o dobro do contêiner.
      renderer.setSize(l, a);
      camera.aspect = l / a;
      camera.updateProjectionMatrix();
    };
    const observador = new ResizeObserver(redimensionar);
    observador.observe(div);
    redimensionar();

    // ── Tap vs. arrasto: 8px e 250ms, como na referência.
    // O tempo vem de `ev.timeStamp`, não de `performance.now()`: os dois estão
    // no mesmo relógio, mas o do evento é o instante em que o dedo agiu, e o
    // outro é o instante em que o navegador conseguiu rodar o handler. Num
    // quadro pesado a diferença passa de 250 ms sozinha, e um toque legítimo
    // era descartado como arrasto — justamente em quem tem o aparelho mais
    // lento.
    let inicio: { x: number; y: number; t: number } | null = null;
    const aoPressionar = (ev: PointerEvent) => {
      inicio = { x: ev.clientX, y: ev.clientY, t: ev.timeStamp };
    };
    const aoSoltar = (ev: PointerEvent) => {
      if (!inicio) return;
      const arrastou =
        Math.hypot(ev.clientX - inicio.x, ev.clientY - inicio.y) > 8 ||
        ev.timeStamp - inicio.t > 250;
      inicio = null;
      if (arrastou) return;
      const id = estruturaSobPonteiro(ev);
      propsRef.current.onSelecionar(id);
    };
    // O raycast do hover é caro e não precisa rodar a cada evento de ponteiro:
    // o mouse emite muito mais eventos do que a tela desenha quadros. Um por
    // quadro basta, e é o que impede um arrasto de virar uma fila de raycasts.
    let moveuPara: PointerEvent | null = null;
    let quadroDeHover = 0;
    const aoMover = (ev: PointerEvent) => {
      moveuPara = ev;
      quadroDeHover ||= requestAnimationFrame(() => {
        quadroDeHover = 0;
        if (moveuPara) setSobre(estruturaSobPonteiro(moveuPara));
      });
    };

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.02;

    function estruturaSobPonteiro(ev: PointerEvent): string | null {
      const r = renderer.domElement.getBoundingClientRect();
      const x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const acertos = raycaster.intersectObjects(construida.alvos, true);

      // Duas correções que o raycaster não faz sozinho:
      // 1) ele testa a lista de malhas que recebe sem olhar a visibilidade do
      //    objeto pai, então um sistema desligado ainda seria clicável;
      // 2) ele devolve os acertos por distância, então a prioridade mais baixa
      //    dos INVÓLUCROS — a pele e as vísceras, que contêm os focos — precisa
      //    ser aplicada aqui, e não pela ordem do array. Sem isso, clicar na
      //    rosa selecionaria a pele, e clicar na cundalini, o hemisfério.
      let invólucro: string | null = null;
      for (const h of acertos) {
        const id = construida.estruturaDe(h.object);
        if (!id) continue;
        if (construida.nos.get(id)?.objeto.visible !== true) continue;
        if (INVOLUCROS.has(id)) {
          invólucro ??= id;
          continue;
        }
        return id;
      }
      return invólucro;
    }

    renderer.domElement.addEventListener('pointerdown', aoPressionar);
    renderer.domElement.addEventListener('pointerup', aoSoltar);
    renderer.domElement.addEventListener('pointermove', aoMover);

    // ── Laço
    // Delta próprio: THREE.Clock está depreciado e THREE.Timer tem outro
    // ciclo de vida; um `performance.now()` resolve sem depender de nenhum.
    let ultimoInstante = performance.now();
    let vivo = true;
    let acumuladoRotulos = 0;

    const desenhar = () => {
      if (!vivo) return;
      requestAnimationFrame(desenhar);
      const agora = performance.now();
      const delta = Math.min((agora - ultimoInstante) / 1000, 0.1);
      ultimoInstante = agora;
      const p = propsRef.current;

      if (p.rotacaoAutomatica && !reduzirMovimento && p.separar < 0.8) {
        controles.autoRotate = true;
        controles.autoRotateSpeed = 0.5;
      } else {
        controles.autoRotate = false;
      }
      // Acima de 80% de separação, a órbita é travada, como na referência.
      controles.enableRotate = p.separar < 0.8;
      controles.update();

      if (!reduzirMovimento) construida.animar(delta, p.grau);

      const { clientWidth: L, clientHeight: A } = div;
      renderer.setViewport(0, 0, L, A);
      camera.aspect = L / A || 1;
      camera.updateProjectionMatrix();
      construida.aplicarEstado({
        grau: p.grau,
        sistemasVisiveis: new Set(p.sistemas),
        separar: p.separar,
        foco: p.foco,
        isolar: p.isolar,
      });
      renderer.render(cena, camera);

      // Rótulos a ~12 Hz: recalcular a cada frame não muda nada visível.
      acumuladoRotulos += delta;
      if (acumuladoRotulos > 0.08) {
        acumuladoRotulos = 0;
        atualizarRotulos(L, A);
      }
    };

    function atualizarRotulos(L: number, A: number) {
      const p = propsRef.current;
      const candidatos = new Set<string>();
      if (p.foco) candidatos.add(p.foco);
      if (sobreRef.current) candidatos.add(sobreRef.current);
      // Um sistema sozinho, ou camadas bem separadas, pedem rótulos de tudo o
      // que couber; a desconflitação decide o que sobra (emenda E8).
      if (p.sistemas.length === 1 || p.separar > 0.35) {
        for (const [id, no] of construida.nos) if (no.objeto.visible) candidatos.add(id);
      }
      const lista = projetarRotulos({
        cena: construida,
        camera,
        largura: L,
        altura: A,
        candidatos,
        prioridade: (id) => (id === p.foco ? 3 : id === sobreRef.current ? 2 : 1),
      });
      setRotulos(lista);
    }

    desenhar();

    return () => {
      vivo = false;
      observador.disconnect();
      renderer.domElement.removeEventListener('pointerdown', aoPressionar);
      renderer.domElement.removeEventListener('pointerup', aoSoltar);
      renderer.domElement.removeEventListener('pointermove', aoMover);
      if (quadroDeHover) cancelAnimationFrame(quadroDeHover);
      controles.dispose();
      sombra.geometry.dispose();
      sombra.material.dispose();
      construida.dispose();
      renderer.dispose();
      div.removeChild(renderer.domElement);
      motor.current = null;
    };
  }, [anatomia]);

  // Vista: reposiciona a câmera sem recriar nada.
  useEffect(() => {
    const m = motor.current;
    if (!m) return;
    m.camera.position.set(...POSICAO_DA_VISTA[props.vista]);
    m.controles.target.copy(ALVO_PADRAO);
    m.controles.update();
  }, [props.vista]);

  // Isolar enquadra a estrutura; limpar o isolamento devolve o enquadramento.
  useEffect(() => {
    const m = motor.current;
    if (!m) return;
    const no = props.foco ? m.construida.nos.get(props.foco) : null;
    if (props.isolar && no) {
      m.controles.target.copy(no.ancora);
      const direcao = m.camera.position.clone().sub(no.ancora).normalize();
      // 2.6 ≈ 1/tan(21°), a meia-abertura vertical da câmera, mais folga.
      const distancia = Math.max(0.3, no.raio * 3.1);
      m.camera.position.copy(no.ancora).addScaledVector(direcao, distancia);
    } else {
      m.controles.target.copy(ALVO_PADRAO);
      if (m.camera.position.length() < 1.2) {
        m.camera.position.set(...POSICAO_DA_VISTA[props.vista]);
      }
    }
    m.controles.update();
  }, [props.foco, props.isolar, props.vista]);

  return (
    <div ref={hospedeiro} className="absolute inset-0">
      {anatomia ? null : (
        <p className="rotulo absolute inset-0 flex items-center justify-center text-[var(--color-texto-3)]">
          {falha ? 'A anatomia não pôde ser carregada.' : 'Carregando a anatomia…'}
        </p>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {rotulos.map((r) => {
          const e = ESTRUTURA_POR_ID.get(r.id);
          return (
            <span
              key={r.id}
              data-rotulo-da-cena
              className="rotulo absolute whitespace-nowrap text-[var(--color-texto)] [text-shadow:0_0_3px_#f3f4f4,0_0_6px_#f3f4f4,0_1px_2px_#f3f4f4]"
              style={{ left: r.x, top: r.y - 7 }}
            >
              {e?.nome}
            </span>
          );
        })}
      </div>
    </div>
  );
}
