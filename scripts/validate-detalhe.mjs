// E29: fonte, antiga redução e distribuição atual, sob a mesma câmera e luz.
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { MeshoptSimplifier } from 'meshoptimizer';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';

const ler = (p) => readFileSync(p);
const atlas = JSON.parse(ler('.cache/bodyparts3d/atlas.json'));
const manifesto = JSON.parse(ler('public/anatomia.json'));
const ids = ['personalidade','hemisferio-direito','hemisferio-esquerdo','coluna-vertebral','figado'];
const tetos = [20000,9000,9000,16000,8000];
const partes = new Map(atlas.parts.map(p=>[p.id,p]));
const conceitos = new Map(atlas.concepts.map(c=>[c.id,c]));
const pele = conceitos.get(manifesto.partes.personalidade.conceito).elements.map(id=>partes.get(id));
const minY = Math.min(...pele.map(p=>p.bounds[0][1]));
const escala = 1.8 / (Math.max(...pele.map(p=>p.bounds[1][1]))-minY);
const base64 = a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength).toString('base64');
await MeshoptSimplifier.ready;
const fontes = {};
for (const [n,id] of ids.entries()) {
 const origem=conceitos.get(manifesto.partes[id].conceito).elements.map(id=>partes.get(id));
 const P=new Float32Array(origem.reduce((s,p)=>s+p.vertexCount*3,0));
 const N=new Int16Array(P.length);const I=new Uint32Array(origem.reduce((s,p)=>s+p.indexCount,0));
 let vo=0,io=0;
 for(const p of origem){
  const b=ler(`.cache/bodyparts3d/body-${p.chunk}.bin`);
  for(let i=0;i<p.vertexCount*3;i++){P[vo*3+i]=b.readFloatLE(p.positions+i*4)*escala+(i%3===1?-1.3-minY*escala:0);N[vo*3+i]=b.readInt16LE(p.normals+i*2);}
  for(let i=0;i<p.indexCount;i++)I[io+i]=b.readUInt32LE(p.indices+i*4)+vo;
  vo+=p.vertexCount;io+=p.indexCount;
 }
 const [reduzida,erro]=MeshoptSimplifier.simplify(I,P,3,tetos[n]*3,.05,['LockBorder']);
 fontes[id]={P:base64(P),N:base64(N),I:base64(I),reduzida:base64(reduzida),erro};
}
const bundle=await build({stdin:{resolveDir:process.cwd(),contents:`
import * as T from 'three';
import {decodificarAnatomia} from './app/scene/anatomia';
import {carregarAmbiente} from './app/scene/ambiente';
const array=(s,Tipo)=>{const b=Uint8Array.from(atob(s),c=>c.charCodeAt(0));return new Tipo(b.buffer);};
window.comparar=async(id,vista)=>{
 const fontes=await fetch('/fontes.json').then(r=>r.json());const f=fontes[id];
 const manifesto=await fetch('/anatomia.json').then(r=>r.json());const bin=await fetch('/anatomia.bin').then(r=>r.arrayBuffer());
 const parte=decodificarAnatomia(manifesto,bin).partes.get(id);
 const P=array(f.P,Float32Array),N=array(f.N,Int16Array),I=array(f.I,Uint32Array),reduzida=array(f.reduzida,Uint32Array);
 const geometria=(p,n,i)=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('normal',new T.BufferAttribute(n,3,true));g.setIndex(new T.BufferAttribute(i,1));g.computeBoundingBox();return g;};
 const gs=[geometria(P,N,reduzida),geometria(parte.posicoes,parte.normais,parte.indices),geometria(P,N,I)];
 const r=new T.WebGLRenderer({antialias:true});r.setSize(1440,900);r.setScissorTest(true);r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.12;
 document.body.replaceChildren(r.domElement);document.body.style.margin='0';
 const scene=new T.Scene();scene.background=new T.Color('#f3f4f4');scene.environment=await carregarAmbiente();scene.environmentIntensity=.45;
 const luz=new T.DirectionalLight(0xfff4e8,2.2);luz.position.set(1.6,2.4,2.6);scene.add(luz,new T.HemisphereLight(0xffffff,0xc9ccd2,.5));
 const caixa=gs[2].boundingBox,centro=caixa.getCenter(new T.Vector3());const direcao=new T.Vector3(...[[0,0,1],[1,0,0],[0,0,-1],[.63,.2,.77]][vista]).normalize();
 const camera=new T.PerspectiveCamera(42,480/900,.0001,100);const tangente=Math.tan(T.MathUtils.degToRad(21));const direita=new T.Vector3().crossVectors(camera.up,direcao).normalize();const cima=new T.Vector3().crossVectors(direcao,direita).normalize();let distancia=0;
 for(let i=0;i<P.length;i+=3){const p=new T.Vector3(P[i],P[i+1],P[i+2]).sub(centro);distancia=Math.max(distancia,Math.abs(p.dot(direita))/(tangente*480/900*.74)+p.dot(direcao),Math.abs(p.dot(cima))/(tangente*.74)+p.dot(direcao));}
 camera.position.copy(centro).addScaledVector(direcao,distancia);camera.lookAt(centro);camera.updateMatrixWorld();
 const material=new T.MeshStandardMaterial({color:'#d2a686',roughness:.68});
 for(let n=0;n<3;n++){const mesh=new T.Mesh(gs[n],material);scene.add(mesh);r.setViewport(n*480,0,480,900);r.setScissor(n*480,0,480,900);r.render(scene,camera);scene.remove(mesh);}
 // Mesmas faces: comparar cada canto projetado limita também cada aresta,
 // sem confundir uma diferença de iluminação com erro de silhueta.
 let erroPx=0;const a=new T.Vector3(),b=new T.Vector3();
 for(let i=0;i<I.length;i++){a.fromArray(P,I[i]*3).project(camera);b.fromArray(parte.posicoes,parte.indices[i]*3).project(camera);erroPx=Math.max(erroPx,Math.hypot((a.x-b.x)*240,(a.y-b.y)*450));}
 const resultado={id,vista,fonte:I.length/3,reducao:reduzida.length/3,distribuida:parte.indices.length/3,bytes:manifesto.partes[id].bytes,erroPx};
 window.limpar=()=>{gs.forEach(g=>g.dispose());material.dispose();r.dispose();};return resultado;
};`},bundle:true,write:false,format:'iife'});
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
mkdirSync('.cache/visual/detalhe',{recursive:true});const resultados=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.route('http://detalhe.test/**',route=>{const nome=new URL(route.request().url()).pathname.slice(1);return route.fulfill({body:nome==='fontes.json'?JSON.stringify(fontes):nome?ler('public/'+nome):'<html></html>'});});
 await page.goto('http://detalhe.test/');await page.addScriptTag({content:bundle.outputFiles[0].text});
 for(const id of ids)for(let vista=0;vista<4;vista++){
  const resultado=await page.evaluate(([id,vista])=>window.comparar(id,vista),[id,vista]);
  assert.equal(resultado.fonte,resultado.distribuida);assert(resultado.erroPx<=1,JSON.stringify(resultado));resultados.push(resultado);
  await page.screenshot({path:'.cache/visual/detalhe/'+id+'-'+vista+'.png'});await page.evaluate(()=>window.limpar());
 }
 writeFileSync('.cache/visual/detalhe/medidas.json',JSON.stringify(resultados,null,2));
 for(const id of ids){const rs=resultados.filter(r=>r.id===id);console.log('✓',id,JSON.stringify({...rs[0],vista:'4 vistas',erroPx:Math.max(...rs.map(r=>r.erroPx))}));}
}finally{await browser.close();}
