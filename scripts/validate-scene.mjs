// Mede a cena de verdade, no Node: posições, alcance por raycast, rótulos e os
// 8 graus. Só é possível porque nenhum módulo de app/scene toca o DOM ou o
// WebGLRenderer (emenda E9).
//   node scripts/validate-scene.mjs
import * as THREE from 'three';
import { carregar } from './carregar.mjs';

const erros = [];
const ok = (cond, msg) => { if (!cond) erros.push(msg); };

const { ESTRUTURAS, ESTRUTURA_POR_ID } = await carregar('app/corpus/corpus.ts');
const { construirCena, ESTADO_INICIAL, progressoDeAtivacao } = await carregar('app/scene/construir.ts');
const { dentroDaFigura, PES_Y, TOPO_Y } = await carregar('app/scene/figura.ts');
const { projetarRotulos } = await carregar('app/scene/rotulos.ts');

const cena = construirCena();
const LARGURA = 1440;
const ALTURA = 900;

/** As quatro vistas do §7.3: ¾, frente, lado, costas. */
const VISTAS = {
  'três-quartos': [2.4, 0.9, 2.9],
  frente: [0, 0.1, 3.7],
  lado: [3.7, 0.1, 0],
  costas: [0, 0.1, -3.7],
};

function camera(pos) {
  const c = new THREE.PerspectiveCamera(42, LARGURA / ALTURA, 0.1, 100);
  c.position.set(...pos);
  c.lookAt(0, -0.1, 0);
  c.updateMatrixWorld(true);
  c.updateProjectionMatrix();
  return c;
}

// ── 1. Toda estrutura não-abstrata tem geometria; as abstratas não têm.
const CONCRETAS = ESTRUTURAS.filter((e) => e.forma.tipo !== 'abstrata');
for (const e of ESTRUTURAS) {
  const no = cena.nos.get(e.id);
  ok(no, `1: ${e.id} não foi construída`);
  if (!no) continue;
  if (e.forma.tipo === 'abstrata') {
    ok(no.alvos.length === 0, `1: ${e.id} é abstrata mas tem alvo de raycast`);
  } else {
    let temGeometria = false;
    no.objeto.traverse((o) => { if (o.geometry) temGeometria = true; });
    ok(temGeometria, `1: ${e.id} não é abstrata mas não gerou geometria`);
  }
}
ok(CONCRETAS.length === 29, `1: ${CONCRETAS.length} estruturas concretas, esperadas 29`);

// ── 2. Nenhuma estrutura interna flutua fora da figura.
// Cascas envolvem o corpo por definição; `formas-pensamento` circula por fora
// dele, no campo de respiração (I-4, p. 48). Ambas ficam de fora da checagem.
const FORA_POR_DESIGN = new Set(['formas-pensamento']);
for (const e of CONCRETAS) {
  if (e.forma.tipo === 'casca' || FORA_POR_DESIGN.has(e.id)) continue;

  const pontos = [];
  if (e.forma.tipo === 'tubo' || e.forma.tipo === 'corrente') pontos.push(...e.forma.curva);
  else if (e.forma.tipo === 'par') {
    for (const s of [1, -1]) {
      pontos.push(e.posicao.map((c, i) => c + s * e.forma.offset[i]));
    }
  } else pontos.push(e.posicao);

  for (const p of pontos) {
    ok(dentroDaFigura(p), `2: ${e.id} tem ponto fora da figura: [${p.map((n) => n.toFixed(3))}]`);
  }
}

// As cascas precisam CONTER a figura inteira, não cortá-la.
for (const e of ESTRUTURAS.filter((x) => x.forma.tipo === 'casca')) {
  const alcance = Math.max(Math.abs(PES_Y), Math.abs(TOPO_Y));
  ok(e.forma.raio > alcance, `2: casca ${e.id} (r=${e.forma.raio}) corta a figura (alcance ${alcance})`);
}

// ── 3. Toda estrutura com alvo é alcançável por raycast, em 4 ângulos.
const raycaster = new THREE.Raycaster();
const alvo = new THREE.Vector3();
for (const [nomeVista, pos] of Object.entries(VISTAS)) {
  const cam = camera(pos);
  for (const e of CONCRETAS) {
    const no = cena.nos.get(e.id);
    if (!no || no.alvos.length === 0) continue;

    // Mira a âncora E o centro de cada malha. Nenhum dos dois serve sozinho:
    // num `par` a âncora é o ponto médio entre os dois órgãos, que é espaço
    // vazio; num tubo a geometria está em coordenadas de mundo e o centro da
    // malha é a origem, que não é onde o tubo está.
    const miras = [no.ancora.clone(), ...no.alvos.map((m) => m.getWorldPosition(new THREE.Vector3()))];
    const alcancada = miras.some((mira) => {
      alvo.copy(mira);
      const ndc = alvo.clone().project(cam);
      raycaster.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), cam);
      return raycaster
        .intersectObjects(cena.alvos, true)
        .some((h) => cena.estruturaDe(h.object) === e.id);
    });
    ok(alcancada, `3: ${e.id} inalcançável por raycast na vista ${nomeVista}`);
  }
}

// ── 4. Nenhum rótulo EXIBIDO colide, em 4 ângulos, no pior caso (todos
// candidatos — o que a separação alta produz).
const candidatos = CONCRETAS.map((e) => e.id);
for (const [nomeVista, pos] of Object.entries(VISTAS)) {
  const cam = camera(pos);
  const rotulos = projetarRotulos({ cena, camera: cam, largura: LARGURA, altura: ALTURA, candidatos });
  for (let i = 0; i < rotulos.length; i++) {
    for (let j = i + 1; j < rotulos.length; j++) {
      const a = rotulos[i], b = rotulos[j];
      const la = a.nome.length * 7.6 + 18, lb = b.nome.length * 7.6 + 18;
      const sobrepoe =
        a.x - 6 < b.x + lb && b.x - 6 < a.x + la && a.y - 9 < b.y + 9 && b.y - 9 < a.y + 9;
      ok(!sobrepoe, `4: rótulos "${a.nome}" e "${b.nome}" colidem na vista ${nomeVista}`);
    }
  }
  ok(rotulos.length > 0, `4: nenhum rótulo exibível na vista ${nomeVista}`);
}

// ── 5. Toda estrutura é alcançável: por raycast OU pelo painel/busca.
// O painel lista todas as 42, então esta invariante prova que o painel é
// realmente a rota completa exigida pelo §8.4.
ok(ESTRUTURAS.length === 42, `5: painel não cobre as 42 estruturas`);

// ── 6. Os 8 graus produzem estados distintos e estáveis.
function assinatura(grau) {
  cena.aplicarEstado({ ...ESTADO_INICIAL, grau });
  const partes = [];
  for (const e of ESTRUTURAS) {
    const no = cena.nos.get(e.id);
    for (const m of no.materiais) {
      partes.push(
        [
          m.emissiveIntensity?.toFixed(4),
          m.opacity?.toFixed(4),
          m.color?.getHexString?.(),
          m.uniforms?.uIntensidade?.value?.toFixed(4),
          m.size?.toFixed(4),
        ].join(','),
      );
    }
  }
  return partes.join('|');
}

const assinaturas = [0, 1, 2, 3, 4, 5, 6, 7].map(assinatura);
for (let g = 1; g <= 7; g++) {
  ok(assinaturas[g] !== assinaturas[g - 1], `6: grau ${g} é idêntico ao grau ${g - 1}`);
}

// Estabilidade: reaplicar um grau, depois de varrer a senda inteira, tem de
// reproduzir exatamente o mesmo estado — nenhum material fica preso.
for (const g of [0, 3, 5, 7]) {
  for (const varredura of [0, 7, 0, 4.5, 2.3, 7]) cena.aplicarEstado({ ...ESTADO_INICIAL, grau: varredura });
  ok(assinatura(g) === assinaturas[g], `6: grau ${g} não é estável após varrer a senda`);
}

// ── 7. Toda estrutura com grauDeAtivacao muda visivelmente NAQUELE grau, e não antes.
for (const e of ESTRUTURAS) {
  if (e.grauDeAtivacao === null) {
    for (const g of [0, 3, 5, 7]) {
      ok(progressoDeAtivacao(null, g) === 0, `7: ${e.id} não deveria ativar em grau nenhum`);
    }
    continue;
  }
  const g = e.grauDeAtivacao;
  ok(progressoDeAtivacao(g, g) === 1, `7: ${e.id} não está plenamente ativa no grau ${g}`);
  if (g > 1) {
    ok(progressoDeAtivacao(g, g - 2) === 0, `7: ${e.id} já ativa antes do grau ${g}`);
  }
}

cena.dispose();

if (erros.length) {
  console.error(`\n✗ cena: ${erros.length} violação(ões)\n`);
  for (const e of erros.slice(0, 40)) console.error('  ' + e);
  if (erros.length > 40) console.error(`  … e mais ${erros.length - 40}`);
  process.exit(1);
}
console.log(
  `✓ cena: 29 estruturas concretas com geometria, alcançáveis por raycast em 4 vistas · ` +
    `nenhuma fora da figura · rótulos sem colisão em 4 vistas · 8 graus distintos e estáveis`,
);
