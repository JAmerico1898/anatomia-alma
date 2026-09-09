// E29: pré-calcula o mesmo RoomEnvironment/PMREM que seria gerado em cada
// contexto WebGL. Half-floats e compressão sem perdas preservam a iluminação.
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const bundle = await build({
  stdin: { resolveDir: process.cwd(), contents: `
    import * as THREE from 'three';
    import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
    window.gerar = () => {
      const renderer = new THREE.WebGLRenderer();
      const gerador = new THREE.PMREMGenerator(renderer);
      const sala = new RoomEnvironment();
      const alvo = gerador.fromScene(sala);
      const pixels = new Uint16Array(alvo.width * alvo.height * 4);
      renderer.readRenderTargetPixels(alvo, 0, 0, alvo.width, alvo.height, pixels);
      const bytes = new Uint8Array(pixels.buffer);
      let texto = '';
      for (let i = 0; i < bytes.length; i += 8192) texto += String.fromCharCode(...bytes.subarray(i, i + 8192));
      const resultado = { largura: alvo.width, altura: alvo.height, pixels: btoa(texto), three: THREE.REVISION };
      alvo.dispose(); sala.dispose(); gerador.dispose(); renderer.dispose();
      return resultado;
    };` }, bundle: true, write: false, format: 'iife',
});
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage();
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const { largura, altura, pixels, three } = await page.evaluate(() => window.gerar());
  const cabecalho = Buffer.alloc(8);
  cabecalho.writeUInt32LE(largura, 0); cabecalho.writeUInt32LE(altura, 4);
  const bin = gzipSync(Buffer.concat([cabecalho, Buffer.from(pixels, 'base64')]), { level: 9 });
  writeFileSync('public/ambiente.bin.gz', bin);
  console.log(`✓ RoomEnvironment / PMREM Three r${three}: ${largura}×${altura}, RGBA half-float, ${bin.length} bytes (gzip sem perdas)`);
} finally { await browser.close(); }
