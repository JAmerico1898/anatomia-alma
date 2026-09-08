import { carregar } from './carregar.mjs';
import { hasBook, readPages, normalize } from './book.mjs';

const erros = [];
const ok = (cond, msg) => { if (!cond) erros.push(msg); };
const { ESTRUTURAS, VERBETES, SENDA, SISTEMAS, RELACOES } = await carregar('app/corpus/corpus.ts');
const esperado = { camadas: 4, santuarios: 3, focos: 7, 'fogo-i': 5, 'fogo-ii': 6, 'figado-baco': 6, correntes: 11 };
// O corpo do livro vai de 17 a 358; o Glossario, de 363 a 378. Citar fora disso
// e sempre erro de transcricao, nao uma pagina que o indice nao alcanca.
const paginaValida = (p) => (p >= 17 && p <= 358) || (p >= 363 && p <= 378);
const cheio = (v) => String(v ?? '').trim().length > 0;

ok(ESTRUTURAS.length === 42, `inventário: ${ESTRUTURAS.length} estruturas`);
ok(SISTEMAS.length === 7, `inventário: ${SISTEMAS.length} sistemas`);
ok(SENDA.length === 9 && SENDA[0]?.grau === -1 && SENDA[1]?.grau === 0, 'estado natural e fé não estão separados');
for (const [sistema, n] of Object.entries(esperado)) ok(ESTRUTURAS.filter((e) => e.sistema === sistema).length === n, `${sistema}: contagem incorreta`);
for (const s of SISTEMAS) ok(!('raio' in s) && s.corDeVisualizacao, `${s.id}: cor ainda afirma correspondência com raio`);

const ids = new Set();
for (const e of ESTRUTURAS) {
  ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id) && !ids.has(e.id), `id inválido/duplicado: ${e.id}`);
  ids.add(e.id);
  ok(e.citacoes.length > 0, `${e.id}: sem citação`);
  for (const k of ['nome', 'descricao', 'estadoDialetico', 'estadoNovo']) ok(cheio(e[k]), `${e.id}.${k} vazio`);
  for (const s of e.sinonimos) ok(cheio(s), `${e.id}: sinônimo vazio`);
  for (const ct of e.citacoes) {
    ok(paginaValida(ct.pagina), `${e.id}: cita p.${ct.pagina}, fora do corpo e do Glossário`);
    ok(cheio(ct.texto) && cheio(ct.capitulo), `${e.id}: citação incompleta`);
  }
  ok(e.relacoes.length > 0, `${e.id}: isolada do grafo`);
  for (const p of e.processos) {
    ok(['inicia', 'cresce', 'substitui', 'extingue', 'completa'].includes(p.fase), `${e.id}: fase inválida`);
    ok(p.inicio >= 0 && p.fim <= 7 && p.inicio <= p.fim && p.descricao.trim(), `${e.id}: processo inválido`);
    ok(SENDA.find((d) => d.grau === p.inicio)?.inicia.includes(e.id), `${e.id}: início não derivado na senda`);
  }
}
for (const d of SENDA) {
  ok(d.citacoes.length > 0, `estado ${d.grau}: sem citação`);
  for (const ct of d.citacoes) ok(paginaValida(ct.pagina), `estado ${d.grau}: cita p.${ct.pagina}, fora do intervalo`);
  ok(cheio(d.nome) && cheio(d.mudancaCorporal) && cheio(d.descricao), `estado ${d.grau} incompleto`);
}
for (const r of RELACOES) {
  ok(ids.has(r.origem) && ids.has(r.destino), `relação não resolve: ${r.origem} → ${r.destino}`);
  ok(r.origem !== r.destino && r.tipo && r.verbo, `relação inválida: ${r.origem} → ${r.destino}`);
}
for (const e of ESTRUTURAS) ok(e.relacoes.every((r) => r.origem === e.id || r.destino === e.id), `${e.id}: relação alheia`);

const slugs = new Set(VERBETES.map((v) => v.slug));
ok(VERBETES.length === 68, `${VERBETES.length} verbetes, esperados 68`);
for (const e of ESTRUTURAS) for (const s of e.verbetes) ok(slugs.has(s), `${e.id}: verbete inexistente ${s}`);
for (const v of VERBETES) {
  ok(cheio(v.termo) && cheio(v.definicao), `verbete ${v.slug} incompleto`);
  for (const id of v.estruturas) {
    ok(ids.has(id), `${v.slug}: estrutura inexistente ${id}`);
    ok(ESTRUTURAS.find((x) => x.id === id)?.verbetes.includes(v.slug), `verbete ${v.slug} → ${id} sem o reverso`);
  }
}

let checadas = 0;
if (hasBook()) {
  const pages = readPages();
  const semEspaco = (s) => normalize(s).replace(/[\s\d]/g, '');
  const bloco = (n) => [pages.get(n), pages.get(n + 1)].filter(Boolean).join(' ');
  const citacoes = [...ESTRUTURAS.flatMap((e) => e.citacoes.map((ct) => [e.id, ct])), ...SENDA.flatMap((d) => d.citacoes.map((ct) => [`estado ${d.grau}`, ct]))];
  for (const [onde, ct] of citacoes) {
    if (!pages.has(ct.pagina)) { erros.push(`${onde}: p.${ct.pagina} não indexada`); continue; }
    const bruto = bloco(ct.pagina);
    ok(normalize(bruto).includes(normalize(ct.texto)) || semEspaco(bruto).includes(semEspaco(ct.texto)), `${onde}: citação não encontrada na p.${ct.pagina}`);
    checadas++;
  }
} else console.warn('livro/book.txt ausente — citações não conferidas');

if (erros.length) {
  console.error(`\n✗ corpus: ${erros.length} violação(ões)`);
  for (const erro of erros) console.error('  ' + erro);
  process.exit(1);
}
console.log(`✓ corpus: 42 estruturas, 7 sistemas, ${VERBETES.length} verbetes, 9 estados, ${RELACOES.length} relações direcionadas, ${checadas} citações conferidas contra o livro`);
