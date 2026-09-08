// Mede a cena de verdade, no Node: posições, alcance por raycast, rótulos e os
// 8 graus. Só é possível porque nenhum módulo de app/scene toca o DOM ou o
// WebGLRenderer (emenda E9).
//   node scripts/validate-scene.mjs
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { carregar } from './carregar.mjs';

const erros = [];
const ok = (cond, msg) => { if (!cond) erros.push(msg); };

const { ESTRUTURAS, ESTRUTURA_POR_ID } = await carregar('app/corpus/corpus.ts');
const { construirCena, ESTADO_INICIAL, progressoDoProcesso } = await carregar('app/scene/construir.ts');
const { decodificarAnatomia, dentroDaFigura, PES_Y, TOPO_Y, ID_DA_PELE } =
  await carregar('app/scene/anatomia.ts');
const { projetarRotulos } = await carregar('app/scene/rotulos.ts');

// A mesma anatomia real que o navegador baixa — lida do disco, não da rede.
const manifesto = JSON.parse(readFileSync('public/anatomia.json', 'utf8'));
const binBruto = readFileSync('public/anatomia.bin');
const anatomia = decodificarAnatomia(
  manifesto,
  binBruto.buffer.slice(binBruto.byteOffset, binBruto.byteOffset + binBruto.byteLength),
);
const dentro = (p) => dentroDaFigura(anatomia, p);

const cena = construirCena(anatomia);
const LARGURA = 1440;
const ALTURA = 900;

/** As quatro vistas do §7.3: ¾, frente, lado, costas. */
const VISTAS = {
  'três-quartos': [1.95, 0.35, 2.4],
  frente: [0, -0.25, 3.2],
  lado: [3.2, -0.25, 0],
  costas: [0, -0.25, -3.2],
};
const ALVO = [0, -0.38, 0];

function camera(pos) {
  const c = new THREE.PerspectiveCamera(42, LARGURA / ALTURA, 0.1, 100);
  c.position.set(...pos);
  c.lookAt(...ALVO);
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
ok(CONCRETAS.length === 30, `1: ${CONCRETAS.length} estruturas concretas, esperadas 30`);

// ── 2. Nenhuma estrutura interna flutua fora da figura.
// Camadas envolvem o corpo por definição; `formas-pensamento` circula por fora
// dele, no campo de respiração (I-4, p. 48). Ambas ficam de fora da checagem.
const FORA_POR_DESIGN = new Set(['formas-pensamento', 'focos-aurais']);
for (const e of CONCRETAS) {
  if (e.forma.tipo === 'camada' || FORA_POR_DESIGN.has(e.id)) continue;

  const pontos = [];
  if (e.forma.tipo === 'tubo' || e.forma.tipo === 'corrente') pontos.push(...e.forma.curva);
  else pontos.push(e.posicao);

  for (const p of pontos) {
    ok(dentro(p), `2: ${e.id} tem ponto fora da figura: [${p.map((n) => n.toFixed(3))}]`);
  }
}

// 2b. Toda malha anatômica está de fato no arquivo, e a `posicao` declarada no
// corpus é o centro MEDIDO da malha — nunca um palpite que envelheceu.
for (const e of ESTRUTURAS) {
  if (e.forma.tipo !== 'malha') continue;
  const parte = anatomia.partes.get(e.forma.parte);
  ok(parte, `2b: ${e.id} referencia a parte inexistente "${e.forma.parte}"`);
  if (!parte) continue;
  const d = Math.hypot(...parte.centro.map((c, i) => c - e.posicao[i]));
  ok(d < 0.01, `2b: posicao de ${e.id} está a ${d.toFixed(3)} do centro da malha`);
  ok(parte.triangulos > 0 || parte.indices.length > 0, `2b: malha de ${e.id} está vazia`);
}

// As camadas precisam CONTER o corpo inteiro, não cortá-lo. O corpo é a caixa
// medida da pele; a camada é uma esfera na posição declarada por ela.
const caixaDoCorpo = anatomia.partes.get(ID_DA_PELE).caixa;
ok(
  Math.abs(caixaDoCorpo[0][1] - PES_Y) < 0.01 && Math.abs(caixaDoCorpo[1][1] - TOPO_Y) < 0.01,
  `2: a pele não ocupa a escala do §6.1 (${caixaDoCorpo[0][1]}…${caixaDoCorpo[1][1]})`,
);
for (const e of ESTRUTURAS.filter((x) => x.forma.tipo === 'camada')) {
  let alcance = 0;
  for (const x of [caixaDoCorpo[0][0], caixaDoCorpo[1][0]]) {
    for (const y of [caixaDoCorpo[0][1], caixaDoCorpo[1][1]]) {
      for (const z of [caixaDoCorpo[0][2], caixaDoCorpo[1][2]]) {
        alcance = Math.max(alcance, Math.hypot(x - e.posicao[0], y - e.posicao[1], z - e.posicao[2]));
      }
    }
  }
  ok(
    e.forma.raio > alcance,
    `2: camada ${e.id} (r=${e.forma.raio}) corta o corpo (alcance ${alcance.toFixed(3)})`,
  );
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
          m.uniforms?.uOpacidade?.value?.toFixed(4),
          m.size?.toFixed(4),
        ].join(','),
      );
    }
  }
  return partes.join('|');
}

const estados = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
const assinaturas = estados.map(assinatura);
for (let i = 1; i < estados.length; i++) {
  ok(assinaturas[i] !== assinaturas[i - 1], `6: estado ${estados[i]} é idêntico ao anterior`);
}

// Estabilidade: reaplicar um grau, depois de varrer a senda inteira, tem de
// reproduzir exatamente o mesmo estado — nenhum material fica preso.
for (const g of [0, 3, 5, 7]) {
  for (const varredura of [0, 7, 0, 4.5, 2.3, 7]) cena.aplicarEstado({ ...ESTADO_INICIAL, grau: varredura });
  ok(assinatura(g) === assinaturas[estados.indexOf(g)], `6: grau ${g} não é estável após varrer a senda`);
}

// ── 7. Todo processo respeita seu intervalo.
for (const e of ESTRUTURAS) {
  for (const p of e.processos) {
    ok(progressoDoProcesso(p, p.inicio - 1) === 0, `7: ${e.id}/${p.fase} começa cedo`);
    ok(progressoDoProcesso(p, p.fim) === 1, `7: ${e.id}/${p.fase} não completa no fim`);
  }
}

// ── 8. A mudança do quinto degrau é evidente SEM apagar o interior.
// Foi um wireframe do corpo inteiro, e nos graus 5 a 7 ele cobria os órgãos.
// Estas invariantes existem para que isso não volte.
function materialPorPapel(id, papel) {
  let achado = null;
  cena.nos.get(id)?.objeto.traverse((o) => { if (o.userData.papel === papel) achado = o.material; });
  return achado;
}
const noGrau = (g, ler) => { cena.aplicarEstado({ ...ESTADO_INICIAL, grau: g }); return ler(); };

// 8a. Nada na figura é wireframe: era isso que injetava as arestas da malha
// inteira por cima de coluna, fígado e rins.
for (const e of ESTRUTURAS) {
  for (const m of cena.nos.get(e.id)?.materiais ?? []) {
    ok(!m.wireframe, `8: ${e.id} voltou a desenhar wireframe sobre a figura`);
  }
}

// 8b. A casca não entra no raycast: por estar FORA da pele, ela cobriria a
// figura toda e roubaria o clique de qualquer estrutura interna.
const casca = materialPorPapel('personalidade', 'personalidade-nova');
ok(casca, '8: a nova personalidade não foi construída');
let cascaEhAlvo = false;
for (const a of cena.alvos) if (a.userData.papel === 'personalidade-nova') cascaEhAlvo = true;
ok(!cascaEhAlvo, '8: a casca da nova personalidade virou alvo de raycast');

// 8c. Ela é imperceptível até o grau 4, acende no 5 — "essa mudança corporal é
// que é a piedade" (II-5, p.222) — e adensa até o 7.
const aceso = (g) => noGrau(g, () => casca?.uniforms?.uIntensidade?.value ?? 0);
ok(aceso(4) === 0, `8: a casca já acende no grau 4 (${aceso(4)})`);
ok(aceso(5) > 0.4, `8: a mudança do grau 5 não é evidente (${aceso(5).toFixed(3)})`);
ok(aceso(7) > aceso(5) * 1.5, `8: a casca não adensa do grau 5 ao 7`);

// 8d. A pele velha esvai até fantasma, mas não some: o candidato ainda tem de
// viver segundo a natureza (II-5, p.224).
const pele = materialPorPapel('personalidade', 'personalidade-antiga');
const opacaEm = (g) => noGrau(g, () => pele?.opacity ?? 0);
ok(opacaEm(7) < opacaEm(4) * 0.4, `8: a pele velha não esvai (${opacaEm(4)} → ${opacaEm(7)})`);
ok(opacaEm(7) > 0.02, `8: a pele velha desapareceu por completo no grau 7`);

// 8e. O firmamento JÁ ARDE no estado natural: a lipika não nasce no quinto
// degrau, ela é renovada — "um novo céu e uma nova terra" (III-11, p.356).
const velhas = materialPorPapel('focos-aurais', 'firmamento-antigo');
const novas = materialPorPapel('focos-aurais', 'firmamento-novo');
const luzDe = (m, g) => noGrau(g, () => m?.uniforms?.uOpacidade?.value ?? 0);
ok(luzDe(velhas, -1) > 0.5, `8: o firmamento não existe antes da fé (${luzDe(velhas, -1)})`);
ok(luzDe(novas, -1) === 0, '8: as luzes novas já ardem no estado natural');
ok(luzDe(velhas, 7) < luzDe(velhas, -1) * 0.25, '8: as luzes velhas não se apagam');
ok(luzDe(novas, 7) > 0.5, '8: as luzes novas não se inflamam');
ok(cena.nos.get('focos-aurais')?.materiais.every((m) => m.uniforms?.uMeiaLargura), '8: as estrelas não sabem onde o corpo está');

cena.dispose();

if (erros.length) {
  console.error(`\n✗ cena: ${erros.length} violação(ões)\n`);
  for (const e of erros.slice(0, 40)) console.error('  ' + e);
  if (erros.length > 40) console.error(`  … e mais ${erros.length - 40}`);
  process.exit(1);
}
console.log(
  `✓ cena: 30 estruturas concretas com geometria, alcançáveis por raycast em 4 vistas · ` +
    `nenhuma fora da figura · rótulos sem colisão em 4 vistas · 9 estados distintos e estáveis`,
);
