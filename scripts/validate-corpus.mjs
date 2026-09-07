// As invariantes do corpus. Falha dura em qualquer violação.
//   node scripts/validate-corpus.mjs
import { carregar } from './carregar.mjs';
import { hasBook, readPages, normalize } from './book.mjs';

const erros = [];
const ok = (cond, msg) => { if (!cond) erros.push(msg); };

const c = await carregar('app/corpus/corpus.ts');
const { ESTRUTURAS, VERBETES, SENDA, SISTEMAS } = c;

// 1 — inventário
const ESPERADO = {
  cascas: 4, santuarios: 3, focos: 7, 'fogo-i': 5, 'fogo-ii': 6, 'figado-baco': 6, correntes: 11,
};
ok(ESTRUTURAS.length === 42, `1: ${ESTRUTURAS.length} estruturas, esperadas 42`);
for (const [sis, n] of Object.entries(ESPERADO)) {
  const c2 = ESTRUTURAS.filter((e) => e.sistema === sis).length;
  ok(c2 === n, `1: sistema ${sis} tem ${c2} estruturas, esperadas ${n}`);
}
ok(SISTEMAS.length === 7, `1: ${SISTEMAS.length} sistemas, esperados 7`);

// 2 — ids únicos e kebab-case
const vistos = new Set();
for (const e of ESTRUTURAS) {
  ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id), `2: id fora de kebab-case: ${e.id}`);
  ok(!vistos.has(e.id), `2: id duplicado: ${e.id}`);
  vistos.add(e.id);
}

// 3 — citações e intervalo de páginas
const paginaValida = (p) => (p >= 17 && p <= 358) || (p >= 363 && p <= 378);
for (const e of ESTRUTURAS) {
  ok(e.citacoes.length >= 1, `3: ${e.id} sem citação`);
  for (const ct of e.citacoes) {
    ok(paginaValida(ct.pagina), `3: ${e.id} cita p.${ct.pagina}, fora do corpo e do Glossário`);
  }
}
for (const d of SENDA) {
  ok(d.citacoes.length >= 1, `3: grau ${d.grau} sem citação`);
  for (const ct of d.citacoes) {
    ok(paginaValida(ct.pagina), `3: grau ${d.grau} cita p.${ct.pagina}, fora do intervalo`);
  }
}

// 4 — referências resolvem
for (const e of ESTRUTURAS) {
  for (const id of e.ligacoes) ok(vistos.has(id), `4: ${e.id} liga-se a id inexistente: ${id}`);
}
for (const d of SENDA) {
  for (const id of d.ativa) ok(vistos.has(id), `4: grau ${d.grau} ativa id inexistente: ${id}`);
}

// 5 — simetria das ligações
for (const e of ESTRUTURAS) {
  for (const id of e.ligacoes) {
    const outro = ESTRUTURAS.find((x) => x.id === id);
    ok(outro?.ligacoes.includes(e.id), `5: ${e.id} → ${id} sem o reverso`);
  }
  ok(e.ligacoes.length >= 1, `5: ${e.id} está isolada no grafo`);
}

// 6 — Glossário: slugs existem e a referência é recíproca
const slugs = new Set(VERBETES.map((v) => v.slug));
for (const e of ESTRUTURAS) {
  for (const s of e.verbetes) ok(slugs.has(s), `6: ${e.id} aponta verbete inexistente: ${s}`);
}
for (const v of VERBETES) {
  for (const id of v.estruturas) {
    ok(vistos.has(id), `6: verbete ${v.slug} aponta estrutura inexistente: ${id}`);
    const e = ESTRUTURAS.find((x) => x.id === id);
    ok(e?.verbetes.includes(v.slug), `6: verbete ${v.slug} → ${id} sem o reverso`);
  }
}
ok(VERBETES.length === 68, `6: ${VERBETES.length} verbetes, esperados 68`);

// 7 — grau de ativação bate com a senda, e só com ela
for (const e of ESTRUTURAS) {
  const nos = SENDA.filter((d) => d.ativa.includes(e.id));
  if (e.grauDeAtivacao === null) {
    ok(nos.length === 0, `7: ${e.id} não muda de estado mas aparece em grau(s) ${nos.map((d) => d.grau)}`);
  } else {
    ok(nos.length === 1, `7: ${e.id} aparece em ${nos.length} graus, esperado 1`);
    ok(nos[0]?.grau === e.grauDeAtivacao, `7: ${e.id} declara grau ${e.grauDeAtivacao} mas consta no grau ${nos[0]?.grau}`);
  }
}

// 8 — nenhum campo textual vazio
const textuais = ['id', 'nome', 'descricao', 'estadoDialetico', 'estadoNovo'];
for (const e of ESTRUTURAS) {
  for (const k of textuais) ok(String(e[k] ?? '').trim().length > 0, `8: ${e.id}.${k} vazio`);
  for (const ct of e.citacoes) {
    ok(ct.texto.trim().length > 0, `8: citação vazia em ${e.id}`);
    ok(ct.capitulo.trim().length > 0, `8: capítulo vazio em ${e.id}`);
  }
  for (const s of e.sinonimos) ok(s.trim().length > 0, `8: sinônimo vazio em ${e.id}`);
}
for (const v of VERBETES) {
  ok(v.termo.trim().length > 0 && v.definicao.trim().length > 0, `8: verbete ${v.slug} incompleto`);
}
for (const d of SENDA) {
  ok(d.nome.trim() && d.mudancaCorporal.trim() && d.descricao.trim(), `8: grau ${d.grau} incompleto`);
}

// 9 — toda citação ocorre no livro, na página declarada.
// Local: `livro/` não é versionado. Sem ele, a invariante é pulada com aviso.
let checadas = 0;
if (hasBook()) {
  const pages = readPages();
  // Comparação em dois níveis: normalizada, e depois sem espaços nem dígitos —
  // a extração do PDF insere espaços dentro de palavras ("mos tra") e o impresso
  // cola marcadores de nota de rodapé em palavras ("antiga2"). Nenhum dos dois é
  // erro do corpus.
  const semEspaco = (s) => normalize(s).replace(/[\s\d]/g, '');
  // Uma frase pode atravessar a quebra de página; `pagina` é onde ela COMEÇA.
  const bloco = (n) => [pages.get(n), pages.get(n + 1)].filter(Boolean).join(' ');
  const todas = [
    ...ESTRUTURAS.flatMap((e) => e.citacoes.map((ct) => [`${e.id}`, ct])),
    ...SENDA.flatMap((d) => d.citacoes.map((ct) => [`grau ${d.grau}`, ct])),
  ];
  for (const [onde, ct] of todas) {
    if (!pages.has(ct.pagina)) { erros.push(`9: p.${ct.pagina} não indexada (${onde})`); continue; }
    const bruto = bloco(ct.pagina);
    const achou = normalize(bruto).includes(normalize(ct.texto))
      || semEspaco(bruto).includes(semEspaco(ct.texto));
    ok(achou, `9: ${onde} — trecho não encontrado na p.${ct.pagina}: "${ct.texto.slice(0, 70)}…"`);
    checadas++;
  }
} else {
  console.warn('9: livro/book.txt ausente — checagem de citações PULADA (clone sem o texto-fonte).');
}

if (erros.length) {
  console.error(`\n✗ corpus: ${erros.length} violação(ões)\n`);
  for (const e of erros) console.error('  ' + e);
  process.exit(1);
}
console.log(
  `✓ corpus: 42 estruturas, 7 sistemas, ${VERBETES.length} verbetes, 8 graus, ` +
    `${checadas} citações conferidas contra o livro`,
);
