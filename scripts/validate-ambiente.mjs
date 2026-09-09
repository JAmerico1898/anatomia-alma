import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';

const bundle = await build({ stdin: { resolveDir: process.cwd(), contents: `
import * as T from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {carregarAmbiente} from './app/scene/ambiente';
window.verificar = async () => {
 const [textura,segunda] = await Promise.all([carregarAmbiente(),carregarAmbiente()]);
 const r=new T.WebGLRenderer();const gerador=new T.PMREMGenerator(r);const sala=new RoomEnvironment();const original=gerador.fromScene(sala);
 const scene=new T.Scene();scene.environmentIntensity=.45;
 const camera=new T.PerspectiveCamera(42,2,.01,10);camera.position.z=3;
 for(let i=0;i<5;i++){const m=new T.Mesh(new T.SphereGeometry(.25,32,24),new T.MeshStandardMaterial({color:0xd2a686,roughness:[0,.18,.45,.68,1][i]}));m.position.x=(i-2)*.55;scene.add(m);}
 const alvo=new T.WebGLRenderTarget(256,128);r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.12;
 const ler=(env)=>{scene.environment=env;r.setRenderTarget(alvo);r.render(scene,camera);const p=new Uint8Array(256*128*4);r.readRenderTargetPixels(alvo,0,0,256,128,p);return p;};
 const a=ler(original.texture),b=ler(textura);let max=0;for(let i=0;i<a.length;i++)max=Math.max(max,Math.abs(a[i]-b[i]));
 original.dispose();sala.dispose();gerador.dispose();alvo.dispose();r.dispose();
 // O encerramento da primeira cena não invalida a textura da segunda.
 const r2=new T.WebGLRenderer();scene.environment=textura;r2.render(scene,camera);const erro=r2.getContext().getError();r2.dispose();
 scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 return {mesmaCarga:textura===segunda,maximoPorCanal:max,erroSegundoContexto:erro};
};` }, bundle: true, write: false, format: 'iife' });
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage();
 await page.route('http://ambiente.test/**',route=>route.fulfill({body:route.request().url().endsWith('.gz')?readFileSync('public/ambiente.bin.gz'):'<html></html>'}));
 await page.goto('http://ambiente.test/');await page.addScriptTag({content:bundle.outputFiles[0].text});
 const resultado=await page.evaluate(()=>window.verificar());
 assert.equal(resultado.mesmaCarga,true);assert(resultado.maximoPorCanal<=2);assert.equal(resultado.erroSegundoContexto,0);
 console.log('✓ PMREM original × distribuído, 5 rugosidades:',JSON.stringify(resultado));
}finally{await browser.close();}
