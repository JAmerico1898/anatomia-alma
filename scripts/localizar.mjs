// Diagnóstico: em que página impressa um trecho realmente ocorre.
//   node scripts/localizar.mjs "trecho" ["outro trecho" …]
import { readPages, normalize } from './book.mjs';

const pages = readPages();
const sem = (s) => normalize(s).replace(/\s/g, '');
for (const agulha of process.argv.slice(2)) {
  const hits = [...pages.keys()].filter((n) => sem(pages.get(n)).includes(sem(agulha)));
  console.log(`${(hits.join(', ') || 'NENHUMA').padEnd(12)} ← "${agulha.slice(0, 52)}"`);
}
