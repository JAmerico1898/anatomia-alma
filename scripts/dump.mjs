import { readPages, normalize } from './book.mjs';
const pages = readPages();
for (const spec of process.argv.slice(2)) {
  const [a, b] = spec.split('-').map(Number);
  for (let n = a; n <= (b ?? a); n++) {
    console.log(`\n===== p.${n} =====`);
    console.log(normalize(pages.get(n) ?? '(ausente)'));
  }
}
