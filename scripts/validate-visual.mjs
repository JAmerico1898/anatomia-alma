// Verificações adicionais das emendas visuais; não substituem npm run verify.
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import { carregar } from './carregar.mjs';

const { construirCena, ESTADO_INICIAL } = await carregar('app/scene/construir.ts');
const { decodificarAnatomia } = await carregar('app/scene/anatomia.ts');
const { transicaoVisual } = await carregar('app/scene/transicao.ts');
const manifesto = JSON.parse(readFileSync('public/anatomia.json', 'utf8'));
const bin = readFileSync('public/anatomia.bin');
const cena = construirCena(decodificarAnatomia(manifesto, bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)));
const apresentar = transicaoVisual(cena);
const casca = cena.nos.get('personalidade').materiais.find(m => m.userData.papel === 'casca-nova');
const valor = () => casca.uniforms.uIntensidade.value;
const quadro = (grau, ms, reduzir = false) => {
  cena.aplicarEstado({ ...ESTADO_INICIAL, grau });
  apresentar(grau, ms, reduzir);
  return valor();
};
assert.equal(quadro(4, 0), 0);
const amostras = [0,80,160,240,320,400].map(ms => [ms, quadro(5, ms)]);
assert.equal(amostras[0][1], 0);
for (let i=1;i<5;i++) assert(amostras[i][1] > amostras[i-1][1]);
assert.equal(amostras[4][1], amostras[5][1]);
quadro(4, 500); quadro(4, 580); quadro(5, 600); quadro(5, 920);
assert.equal(valor(), amostras[5][1]);
quadro(4, 1000, true); assert.equal(valor(), 0);
console.log('Transição 4→5 (ms, intensidade):', JSON.stringify(amostras));
console.log('✓ reversão interrompível e redução de movimento');
cena.dispose();

const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bundle = await build({ stdin: { contents: String.raw`
    import * as THREE from 'three';
    import {materialDeCamada,materialDaNovaPersonalidade,materialDeEstrelasAurais,materialDeSombra} from './app/scene/materiais';
    window.testarAlfa = () => {
      const renderer = new THREE.WebGLRenderer();
      renderer.toneMapping = THREE.NoToneMapping;
      const alvo = new THREE.WebGLRenderTarget(1,1);
      const cena = new THREE.Scene();
      cena.background = new THREE.Color(0.1,0.3,0.7);
      const camera = new THREE.OrthographicCamera(-1,1,1,-1,0.1,10);
      camera.position.z = 1;
      const materiais = [materialDeCamada(new THREE.Color()),materialDaNovaPersonalidade(),materialDeEstrelasAurais(new THREE.Color(),1),materialDeSombra()];
      const resultados = [];
      for (const m of materiais) {
        m.vertexShader = 'void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';
        m.fragmentShader = 'void main(){gl_FragColor=vec4(0.8,0.2,0.1,0.25);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n#include <premultiplied_alpha_fragment>\n}';
        const malha = new THREE.Mesh(new THREE.PlaneGeometry(2,2),m);
        cena.add(malha); renderer.setRenderTarget(alvo); renderer.render(cena,camera);
        const pixel = new Uint8Array(4); renderer.readRenderTargetPixels(alvo,0,0,1,1,pixel);
        resultados.push([...pixel]); cena.remove(malha); malha.geometry.dispose();m.dispose();
      }
      alvo.dispose();renderer.dispose();return resultados;
    };`, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, write: false, format: 'iife', logLevel: 'silent' });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const pixels = await page.evaluate(() => window.testarAlfa());
  const esperado = [0.275,0.275,0.55].map(v => Math.round(v*255));
  for (const pixel of pixels) for(let i=0;i<3;i++) assert(Math.abs(pixel[i]-esperado[i])<=2, JSON.stringify({pixel,esperado}));
  console.log('✓ alfa: 4 materiais, RGB esperado', esperado, 'obtido', JSON.stringify(pixels));
  if (process.argv.includes('--capturas')) {
    const pasta = '.cache/visual'; mkdirSync(pasta,{recursive:true});
    // Congela o instante fotografado, sem disputar a captura com novos quadros
    // WebGL. A animação volta a correr entre capturas e interações.
    await page.clock.install();
    const capturar = async (path) => {
      await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 100);
      try { await page.screenshot({ path, animations: 'disabled' }); }
      finally { await page.clock.resume(); }
    };
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    page.on('console', m => { if(m.type()==='error') erros.push(m.text()); });
    const abrir = async (url) => {
      await page.goto((process.env.VISUAL_URL ?? 'http://127.0.0.1:3000')+url);
      await page.locator('canvas').waitFor({timeout:30000});
      await page.waitForTimeout(600);
    };
    for (const grau of [-1,0,4,5,7]) {
      await abrir('/?grau='+grau);
      for (const vista of ['¾','Frente','Lado','Costas']) {
        await page.getByRole('button',{name:vista,exact:true}).click();
        await page.waitForTimeout(200);
        await capturar(pasta+'/grau-'+grau+'-'+(['¾','Frente','Lado','Costas'].indexOf(vista))+'.png');
      }
      console.log('✓ capturas grau',grau,'4 vistas');
    }
    for(const width of [390,768,1024,1440]) {
      await page.setViewportSize({width,height:844});
      await abrir('/');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await capturar(pasta+'/natural-'+width+'.png');
      for(const foco of ['rosa-do-coracao','pineal','figado','cordao-ida','torre-dos-misterios','cundalini','medula-espinal','formas-pensamento']) {
        await abrir('/?foco='+foco+'&isolar=1');
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await capturar(pasta+'/'+foco+'-'+width+'.png');
      }
      console.log('✓ carga fria / isolamento e overflow',width);
    }
    for(const width of [390,1024,1280,1440]) {
      await page.setViewportSize({width,height:900});
      for(const rota of ['senda','glossario','fontes']) {
        await page.goto((process.env.VISUAL_URL ?? 'http://127.0.0.1:3000')+'/'+rota);
        await page.waitForTimeout(400);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await capturar(pasta+'/'+rota+'-'+width+'.png');
        await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
        await capturar(pasta+'/'+rota+'-'+width+'-fim.png');
      }
      console.log('✓ rotas editoriais',width);
    }
    writeFileSync(pasta+'/erros.json',JSON.stringify(erros,null,2));
    assert.deepEqual(erros,[]);
  }
} finally { await browser.close(); }
