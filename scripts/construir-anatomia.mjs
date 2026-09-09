/**
 * Constrói `public/anatomia.bin` + `public/anatomia.json`: as malhas ANATÔMICAS
 * REAIS que o atlas usa no lugar do manequim procedural que havia aqui antes.
 *
 * A fonte é BodyParts3D 4.0 (anatomia de referência de adulto masculino,
 * CC BY 4.0), na conversão já pronta para navegador publicada pelo projeto
 * Human Atlas (github.com/ashemag/human-atlas, código MIT). Deste corpo inteiro
 * — 2.234 malhas, 15 sistemas — só entram aqui as estruturas que o processo
 * espiritual de "O novo homem" de fato nomeia. Todo o resto fica de fora.
 *
 *   node scripts/construir-anatomia.mjs
 *
 * O download fica em `.cache/bodyparts3d/`, fora do versionamento; a saída em
 * `public/` é versionada, para que build, validação e deploy não dependam da
 * rede.
 */
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MeshoptSimplifier } from 'meshoptimizer';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(RAIZ, '.cache', 'bodyparts3d');
const BASE = 'https://raw.githubusercontent.com/ashemag/human-atlas/main/public/models';

/**
 * A escala do §6.1: pés em y=-1.30, topo da cabeça em y=+0.50. BodyParts3D vem
 * em metros com os pés em y=0; +x é o lado ESQUERDO do sujeito e +z é a frente,
 * que são exatamente as convenções do corpus — nenhum espelhamento é preciso.
 */
const PES_Y = -1.3;
const TOPO_Y = 0.5;

/**
 * De estrutura do corpus para conceito anatômico (identificadores FMA, como no
 * `atlas.json`). `tris` é o orçamento de triângulos depois da simplificação:
 * Cinco peças de inspeção conservam a fonte (E29); as demais mantêm seu teto.
 */
const MAPA = [
  { id: 'personalidade', conceito: 'FMA7163', tris: 20000 }, // pele
  { id: 'esterno', conceito: 'FMA7485', tris: 4000 },
  { id: 'timo', conceito: 'FMA9607', tris: 1600 },
  { id: 'pineal', conceito: 'FMA62033', tris: 600 },
  { id: 'hemisferio-direito', conceito: 'FMA67292', tris: 9000 },
  { id: 'hemisferio-esquerdo', conceito: 'FMA61819', tris: 9000 },
  { id: 'medula-oblonga', conceito: 'FMA62004', tris: 2000 },
  { id: 'coluna-vertebral', conceito: 'FMA13478', tris: 16000 },
  { id: 'figado', conceito: 'FMA7197', tris: 8000 },
  { id: 'baco', conceito: 'FMA7196', tris: 1200 },
  { id: 'rins', conceito: 'FMA7203', tris: 3000 },
  { id: 'suprarrenais', conceito: 'FMA9604', tris: 3000 },
];
// Fora da lista de propósito: o plexo sacro e a rosa-do-coração não são órgãos,
// e o sacro que os abriga seria um osso com o nome de um plexo. Eles seguem
// como focos luminosos posicionados sobre a anatomia real.

const ID_DA_PELE = 'personalidade';

async function baixar(nome) {
  mkdirSync(CACHE, { recursive: true });
  const destino = join(CACHE, nome);
  if (existsSync(destino)) return readFileSync(destino);
  const comprimido = nome.endsWith('.bin');
  const url = `${BASE}/${nome}${comprimido ? '.gz' : ''}`;
  process.stdout.write(`  ↓ ${url}\n`);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  const bruto = Buffer.from(await r.arrayBuffer());
  const dados = comprimido ? gunzipSync(bruto) : bruto;
  writeFileSync(destino, dados);
  return dados;
}

// ── 1. Atlas e seleção das partes -------------------------------------------

const atlas = JSON.parse((await baixar('atlas.json')).toString('utf8'));
const partePorId = new Map(atlas.parts.map((p) => [p.id, p]));
const conceitoPorId = new Map(atlas.concepts.map((c) => [c.id, c]));

const selecao = MAPA.map((m) => {
  const c = conceitoPorId.get(m.conceito);
  if (!c) throw new Error(`conceito ${m.conceito} (${m.id}) não existe no atlas`);
  const partes = c.elements.map((e) => partePorId.get(e)).filter(Boolean);
  if (partes.length === 0) throw new Error(`conceito ${m.conceito} não tem malha`);
  return { ...m, nome: c.name, partes };
});

const chunksNecessarios = [...new Set(selecao.flatMap((s) => s.partes.map((p) => p.chunk)))].sort();
console.log(`Anatomia: ${selecao.length} estruturas, ${chunksNecessarios.length} blocos de origem.`);

const blocos = new Map();
for (const n of chunksNecessarios) {
  blocos.set(n, await baixar(`body-${n}.bin`));
}

// ── 2. Junção, transformação e simplificação --------------------------------

await MeshoptSimplifier.ready;

/** Um `Buffer` do Node vira `ArrayBuffer` alinhado para as views tipadas. */
function view(bloco, Tipo, byteOffset, comprimento) {
  const inicio = bloco.byteOffset + byteOffset;
  if (inicio % Tipo.BYTES_PER_ELEMENT === 0) {
    return new Tipo(bloco.buffer, inicio, comprimento);
  }
  const copia = Buffer.from(bloco.subarray(byteOffset, byteOffset + comprimento * Tipo.BYTES_PER_ELEMENT));
  return new Tipo(copia.buffer, copia.byteOffset, comprimento);
}

const ESCALA = (TOPO_Y - PES_Y) / alturaDaPele();

function alturaDaPele() {
  const pele = selecao.find((s) => s.id === ID_DA_PELE);
  const ys = pele.partes.flatMap((p) => [p.bounds[0][1], p.bounds[1][1]]);
  return Math.max(...ys) - Math.min(...ys);
}

const DESLOCAMENTO_Y = PES_Y - Math.min(
  ...selecao.find((s) => s.id === ID_DA_PELE).partes.map((p) => p.bounds[0][1]),
) * ESCALA;

const construidas = [];

for (const s of selecao) {
  // Junta todas as malhas do conceito num só buffer indexado.
  let nVerts = 0;
  let nIdx = 0;
  for (const p of s.partes) {
    nVerts += p.vertexCount;
    nIdx += p.indexCount;
  }
  const posicoes = new Float32Array(nVerts * 3);
  const normais = new Float32Array(nVerts * 3);
  const indices = new Uint32Array(nIdx);

  let vo = 0;
  let io = 0;
  for (const p of s.partes) {
    const bloco = blocos.get(p.chunk);
    const pos = view(bloco, Float32Array, p.positions, p.vertexCount * 3);
    const nor = view(bloco, Int16Array, p.normals, p.vertexCount * 3);
    const idx = view(bloco, Uint32Array, p.indices, p.indexCount);
    for (let i = 0; i < p.vertexCount; i++) {
      posicoes[(vo + i) * 3] = pos[i * 3] * ESCALA;
      posicoes[(vo + i) * 3 + 1] = pos[i * 3 + 1] * ESCALA + DESLOCAMENTO_Y;
      posicoes[(vo + i) * 3 + 2] = pos[i * 3 + 2] * ESCALA;
      normais[(vo + i) * 3] = nor[i * 3] / 32767;
      normais[(vo + i) * 3 + 1] = nor[i * 3 + 1] / 32767;
      normais[(vo + i) * 3 + 2] = nor[i * 3 + 2] / 32767;
    }
    for (let i = 0; i < p.indexCount; i++) indices[io + i] = idx[i] + vo;
    vo += p.vertexCount;
    io += p.indexCount;
  }

  // E29: preserva silhueta e relevos nas cinco peças comparadas por
  // validate-detalhe.mjs. A quantização permanece mensurada, sem perda de faces.
  const alvo = Math.min(nIdx, s.tris * 3);
  const preservar = ['personalidade', 'hemisferio-direito', 'hemisferio-esquerdo', 'coluna-vertebral', 'figado'].includes(s.id);
  const [simplificados, erro] = preservar ? [indices, 0] : MeshoptSimplifier.simplify(indices, posicoes, 3, alvo, 0.05, ['LockBorder']);

  // Compactação: só os vértices que sobraram vão para o arquivo.
  const remapa = new Int32Array(nVerts).fill(-1);
  let usados = 0;
  for (const i of simplificados) if (remapa[i] === -1) remapa[i] = usados++;
  const P = new Float32Array(usados * 3);
  const N = new Int16Array(usados * 3);
  for (let i = 0; i < nVerts; i++) {
    const d = remapa[i];
    if (d === -1) continue;
    for (let k = 0; k < 3; k++) {
      P[d * 3 + k] = posicoes[i * 3 + k];
      N[d * 3 + k] = Math.max(-32767, Math.min(32767, Math.round(normais[i * 3 + k] * 32767)));
    }
  }
  const I = new Uint32Array(simplificados.length);
  for (let i = 0; i < simplificados.length; i++) I[i] = remapa[simplificados[i]];

  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < usados; i++) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], P[i * 3 + k]);
      max[k] = Math.max(max[k], P[i * 3 + k]);
    }
  }

  // Posições em Uint16 dentro da caixa da própria peça: com uma caixa de 20 cm,
  // um passo vale 3 micrômetros. O arquivo encolhe pela metade e nada do que a
  // cena mostra muda. Índices em Uint16 quando cabem, Uint32 nas peças maiores.
  const passo = max.map((v, k) => (v - min[k]) / 65535 || 1);
  const Pq = new Uint16Array(usados * 3);
  for (let i = 0; i < usados * 3; i++) {
    const k = i % 3;
    Pq[i] = Math.max(0, Math.min(65535, Math.round((P[i] - min[k]) / passo[k])));
  }
  if (usados > 4294967295) throw new Error(`${s.id}: ${usados} vértices não cabem em Uint32`);

  // Âncora: o BARICENTRO do triângulo mais próximo do centro da caixa. Rótulo,
  // enquadramento e raycast precisam de um ponto sobre a malha — num par de
  // órgãos (rins, suprarrenais) o centro da caixa cai no vazio entre os dois.
  // Um vértice não serve: ele fica na quina da silhueta, e um raio mirado ali
  // passa raspando. O meio de uma face é sempre atingido.
  const centro = min.map((v, k) => (v + max[k]) / 2);
  let ancora = centro;
  let melhor = Infinity;
  for (let t = 0; t < I.length; t += 3) {
    const c = [0, 0, 0];
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) c[k] += P[I[t + j] * 3 + k] / 3;
    }
    const d = (c[0] - centro[0]) ** 2 + (c[1] - centro[1]) ** 2 + (c[2] - centro[2]) ** 2;
    if (d < melhor) {
      melhor = d;
      ancora = c;
    }
  }

  construidas.push({
    id: s.id,
    ancora,
    nome: s.nome,
    conceito: s.conceito,
    malhasDeOrigem: s.partes.length,
    trisOriginais: nIdx / 3,
    P: Pq,
    passo,
    N,
    I: usados > 65536 ? I : new Uint16Array(I),
    erro,
    posicoesFlutuantes: P,
    caixa: [min, max],
    centro,
  });

  console.log(
    `  ${s.id.padEnd(22)} ${String(nIdx / 3).padStart(6)} → ${String(I.length / 3).padStart(6)} tris  (${s.nome})`,
  );
}

// ── 3. Silhueta da pele, para `dentroDaFigura` ------------------------------
// Faixas em y com o raio máximo em x e em z. É o teste que prova que nenhum
// foco do corpus flutua fora do corpo — agora contra o corpo de verdade.

const FAIXAS = 72;
const pele = construidas.find((c) => c.id === ID_DA_PELE);
const silhueta = Array.from({ length: FAIXAS }, () => [0, 0]);
const alturaFaixa = (TOPO_Y - PES_Y) / FAIXAS;
const pontosDaPele = pele.posicoesFlutuantes;
for (let i = 0; i < pontosDaPele.length / 3; i++) {
  const y = pontosDaPele[i * 3 + 1];
  const f = Math.min(FAIXAS - 1, Math.max(0, Math.floor((y - PES_Y) / alturaFaixa)));
  silhueta[f][0] = Math.max(silhueta[f][0], Math.abs(pontosDaPele[i * 3]));
  silhueta[f][1] = Math.max(silhueta[f][1], Math.abs(pontosDaPele[i * 3 + 2]));
}
// Faixas vazias (nenhum vértice caiu nelas) herdam a vizinha de baixo.
for (let f = 1; f < FAIXAS; f++) {
  if (silhueta[f][0] === 0) silhueta[f] = [...silhueta[f - 1]];
}

// ── 4. Escrita --------------------------------------------------------------

const pedacos = [];
let deslocamento = 0;
const manifesto = {};

function anexar(typedArray) {
  const buf = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
  const inicio = deslocamento;
  pedacos.push(buf);
  deslocamento += buf.length;
  const resto = deslocamento % 4;
  if (resto) {
    const enchimento = Buffer.alloc(4 - resto);
    pedacos.push(enchimento);
    deslocamento += enchimento.length;
  }
  return inicio;
}

for (const c of construidas) {
  const posicoes = anexar(c.P);
  const normais = anexar(c.N);
  const indices = anexar(c.I);
  manifesto[c.id] = {
    nome: c.nome,
    conceito: c.conceito,
    malhasDeOrigem: c.malhasDeOrigem,
    vertices: c.P.length / 3,
    triangulos: c.I.length / 3,
    triangulosFonte: c.trisOriginais,
    erroSimplificacao: c.erro,
    bytes: c.P.byteLength + c.N.byteLength + c.I.byteLength,
    bitsIndices: c.I.BYTES_PER_ELEMENT * 8,
    posicoes,
    normais,
    indices,
    passo: c.passo,
    caixa: c.caixa.map((v) => v.map((n) => Number(n.toFixed(5)))),
    centro: c.centro.map((n) => Number(n.toFixed(5))),
    ancora: [...c.ancora].map((n) => Number(n.toFixed(5))),
  };
}

const bin = Buffer.concat(pedacos);
const json = {
  fonte: 'BodyParts3D 4.0 — anatomia de referência de adulto masculino',
  licenca: 'CC BY 4.0',
  conversao: 'https://github.com/ashemag/human-atlas (MIT)',
  escala: Number(ESCALA.toFixed(6)),
  pesY: PES_Y,
  topoY: TOPO_Y,
  bytes: bin.length,
  sha256: createHash('sha256').update(bin).digest('hex').slice(0, 16),
  silhueta: silhueta.map(([x, z]) => [Number(x.toFixed(4)), Number(z.toFixed(4))]),
  partes: manifesto,
};

mkdirSync(join(RAIZ, 'public'), { recursive: true });
writeFileSync(join(RAIZ, 'public', 'anatomia.bin'), bin);
writeFileSync(join(RAIZ, 'public', 'anatomia.json'), JSON.stringify(json, null, 1));

const totalTris = construidas.reduce((s, c) => s + c.I.length / 3, 0);
console.log(
  `\n✓ public/anatomia.bin  ${(bin.length / 1e6).toFixed(2)} MB · ` +
    `${construidas.length} estruturas · ${totalTris.toLocaleString('pt-BR')} triângulos`,
);
