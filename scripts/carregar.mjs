// Empacota um módulo TypeScript do app e o importa no Node.
// Necessário porque os validadores rodam fora do bundler do Next.
import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// O bundle é escrito DENTRO do projeto (`.cache/`, ignorado pelo git) e não no
// temp do sistema: `three` fica externo ao bundle, e precisa ser resolvível a
// partir do node_modules deste repositório.
const CACHE = fileURLToPath(new URL('../.cache/', import.meta.url));

export async function carregar(entrada) {
  const r = await build({
    entryPoints: [fileURLToPath(new URL(`../${entrada}`, import.meta.url))],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    external: ['three'],
    logLevel: 'silent',
  });
  mkdirSync(CACHE, { recursive: true });
  const arquivo = join(CACHE, entrada.replace(/[\/.]/g, '_') + '.mjs');
  writeFileSync(arquivo, r.outputFiles[0].text, 'utf8');
  return import(pathToFileURL(arquivo).href);
}
