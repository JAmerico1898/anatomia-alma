import * as THREE from 'three';

// Uma cópia de CPU compartilhada; cada renderer administra sua própria textura
// de GPU. Não se compartilha um WebGLRenderTarget entre contextos incompatíveis.
let pendente: Promise<THREE.DataTexture> | null = null;

export function carregarAmbiente(): Promise<THREE.DataTexture> {
  pendente ??= (async () => {
    const resposta = await fetch('/ambiente.bin.gz');
    if (!resposta.ok || !resposta.body) throw new Error('Falha na carga do ambiente');
    const bin = await new Response(resposta.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    const cabecalho = new DataView(bin);
    const largura = cabecalho.getUint32(0, true), altura = cabecalho.getUint32(4, true);
    if (bin.byteLength !== 8 + largura * altura * 8) throw new Error('Ambiente incompleto');
    const textura = new THREE.DataTexture(new Uint16Array(bin, 8), largura, altura, THREE.RGBAFormat, THREE.HalfFloatType);
    textura.mapping = THREE.CubeUVReflectionMapping;
    textura.minFilter = textura.magFilter = THREE.LinearFilter;
    textura.colorSpace = THREE.LinearSRGBColorSpace;
    textura.needsUpdate = true;
    return textura;
  })().catch((erro) => { pendente = null; throw erro; });
  return pendente;
}
