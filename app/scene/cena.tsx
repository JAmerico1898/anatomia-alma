'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ESTRUTURA_POR_ID } from '../corpus/corpus';
import type { SistemaId } from '../corpus/tipos';
import { construirCena, type CenaConstruida } from './construir';
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
  /** `dividida` desenha dois viewports no MESMO canvas, por scissor. */
  dividida: boolean;
  /** Em apresentação alternada; ignorado quando `dividida`. */
  natureza: 'dialetico' | 'novo' | null;
  vista: Vista;
  rotacaoAutomatica: boolean;
  onSelecionar: (id: string | null) => void;
}

const POSICAO_DA_VISTA: Record<Vista, [number, number, number]> = {
  'tres-quartos': [2.4, 0.9, 2.9],
  frente: [0, 0.1, 3.9],
  lado: [3.9, 0.1, 0],
  costas: [0, 0.1, -3.9],
};

const ALVO_PADRAO = new THREE.Vector3(0, -0.1, 0);

export function Cena(props: PropsDaCena) {
  const hospedeiro = useRef<HTMLDivElement>(null);
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
    const div = hospedeiro.current;
    if (!div) return;

    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x07080d, 1);
    div.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';

    const cena = new THREE.Scene();
    cena.add(new THREE.AmbientLight(0xffffff, 0.55));
    const luz = new THREE.DirectionalLight(0xdfe4ff, 1.1);
    luz.position.set(2, 3, 2.5);
    cena.add(luz);
    const contraluz = new THREE.DirectionalLight(0x6f79a8, 0.5);
    contraluz.position.set(-2, -1, -2);
    cena.add(contraluz);

    const construida = construirCena();
    cena.add(construida.raiz);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
    camera.position.set(...POSICAO_DA_VISTA['tres-quartos']);

    const controles = new OrbitControls(camera, renderer.domElement);
    controles.target.copy(ALVO_PADRAO);
    controles.enableDamping = !reduzirMovimento;
    controles.dampingFactor = 0.08;
    controles.minDistance = 0.4;
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
    let inicio: { x: number; y: number; t: number } | null = null;
    const aoPressionar = (ev: PointerEvent) => {
      inicio = { x: ev.clientX, y: ev.clientY, t: performance.now() };
    };
    const aoSoltar = (ev: PointerEvent) => {
      if (!inicio) return;
      const arrastou =
        Math.hypot(ev.clientX - inicio.x, ev.clientY - inicio.y) > 8 ||
        performance.now() - inicio.t > 250;
      inicio = null;
      if (arrastou) return;
      const id = estruturaSobPonteiro(ev);
      propsRef.current.onSelecionar(id);
    };
    const aoMover = (ev: PointerEvent) => setSobre(estruturaSobPonteiro(ev));

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.02;

    function estruturaSobPonteiro(ev: PointerEvent): string | null {
      const r = renderer.domElement.getBoundingClientRect();
      let x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      const y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      // Na apresentação dividida, cada metade é a mesma cena com outro estado:
      // o x do ponteiro é remapeado para dentro da metade em que ele está.
      if (propsRef.current.dividida) x = x < 0 ? x * 2 + 1 : x * 2 - 1;
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const acertos = raycaster.intersectObjects(construida.alvos, true);

      // Duas correções que o raycaster não faz sozinho:
      // 1) ele testa a lista de malhas que recebe sem olhar a visibilidade do
      //    objeto pai, então um sistema desligado ainda seria clicável;
      // 2) ele devolve os acertos por distância, então a prioridade mais baixa
      //    da figura precisa ser aplicada aqui, e não pela ordem do array.
      let personalidade: string | null = null;
      for (const h of acertos) {
        const id = construida.estruturaDe(h.object);
        if (!id) continue;
        if (construida.nos.get(id)?.objeto.visible !== true) continue;
        if (id === 'personalidade') {
          personalidade ??= id;
          continue;
        }
        return id;
      }
      return personalidade;
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

      const estadoBase = {
        grau: p.grau,
        sistemasVisiveis: new Set(p.sistemas),
        separar: p.separar,
        foco: p.foco,
        isolar: p.isolar,
      };

      const { clientWidth: L, clientHeight: A } = div;
      if (p.dividida) {
        renderer.setScissorTest(true);
        const meia = Math.floor(L / 2);
        for (const [i, natureza] of (['dialetico', 'novo'] as const).entries()) {
          const x = i === 0 ? 0 : meia;
          const largura = i === 0 ? meia : L - meia;
          camera.aspect = largura / A;
          camera.updateProjectionMatrix();
          renderer.setViewport(x, 0, largura, A);
          renderer.setScissor(x, 0, largura, A);
          construida.aplicarEstado({ ...estadoBase, natureza });
          renderer.render(cena, camera);
        }
        renderer.setScissorTest(false);
      } else {
        renderer.setViewport(0, 0, L, A);
        camera.aspect = L / A || 1;
        camera.updateProjectionMatrix();
        construida.aplicarEstado({ ...estadoBase, natureza: p.natureza });
        renderer.render(cena, camera);
      }

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
        largura: p.dividida ? Math.floor(L / 2) : L,
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
      controles.dispose();
      construida.dispose();
      renderer.dispose();
      div.removeChild(renderer.domElement);
      motor.current = null;
    };
  }, []);

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
      const raio = Math.max(0.35, no.objeto.scale.x * 0.4);
      m.camera.position.copy(no.ancora).addScaledVector(direcao, raio + 0.55);
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
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {rotulos.map((r) => {
          const e = ESTRUTURA_POR_ID.get(r.id);
          return (
            <span
              key={r.id}
              className="rotulo absolute whitespace-nowrap text-[var(--color-texto-2)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
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
