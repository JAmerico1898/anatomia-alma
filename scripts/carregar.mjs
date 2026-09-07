// Empacota um módulo TypeScript do app e o importa no Node.
// Necessário porque os validadores rodam fora do bundler do Next.
import { build } from 'esbuild';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function carregar(entrada) {
  const r = await build({
    entryPoints: [new URL(`../${entrada}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    external: ['three'],
    logLevel: 'silent',
  });
  const dir = mkdtempSync(join(tmpdir(), 'anatomia-'));
  const arquivo = join(dir, 'mod.mjs');
  writeFileSync(arquivo, r.outputFiles[0].text, 'utf8');
  return import(pathToFileURL(arquivo).href);
}
