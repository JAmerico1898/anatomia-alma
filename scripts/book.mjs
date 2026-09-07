// Indexa o texto extraído do livro por página IMPRESSA.
// O `livro/` não é versionado (ver README); quando ausente, os consumidores
// devem pular graciosamente.
import { readFileSync, existsSync } from 'node:fs';

export const BOOK_PATH = new URL('../livro/book.txt', import.meta.url);
export const hasBook = () => existsSync(BOOK_PATH);

const PAGE_MARKER = /^\s*(\d{1,3})\s*$/;
const RUNNING_HEADS = new Set(['O novo homem', 'Glossário']);

/** Mapa página impressa -> texto bruto daquela página. */
export function readPages() {
  const raw = readFileSync(BOOK_PATH, 'utf8').split(/\r?\n/);
  const pages = new Map();
  let buf = [];
  let prev = null;
  for (const line of raw) {
    const m = line.match(PAGE_MARKER);
    if (m) {
      const n = Number(m[1]);
      // Um marcador só é número de página se dá sequência ao anterior.
      // Saltos pequenos existem: aberturas de capítulo não levam número.
      if (prev === null ? n === 17 : n > prev && n - prev <= 8) {
        const texto = buf.join('\n');
        // Páginas sem marcador (aberturas) compartilham o bloco que as contém.
        for (let k = prev === null ? n : prev + 1; k <= n; k++) pages.set(k, texto);
        prev = n;
        buf = [];
        continue;
      }
    }
    if (!RUNNING_HEADS.has(line.trim())) buf.push(line);
  }
  return pages;
}

/** Normaliza para comparação: desfaz hifenização, colapsa espaços. */
export function normalize(s) {
  return s
    .replace(/\u00ad/g, '')
    .replace(/\*/g, '')              // marcador de remiss\u00e3o ao Gloss\u00e1rio
    .replace(/-\s*\n\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .trim();
}
