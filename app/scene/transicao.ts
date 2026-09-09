import * as THREE from 'three';
import type { CenaConstruida } from './construir';

type Valor = number | THREE.Color;
type Canal = { ler: () => Valor; escrever: (valor: Valor) => void };

/** Interpola somente propriedades renderizadas; nunca graus ou processos. */
export function transicaoVisual(cena: CenaConstruida) {
  const canais: Canal[] = [];
  for (const no of cena.nos.values()) for (const material of no.materiais) {
    const std = material as THREE.MeshStandardMaterial;
    if (std.isMeshStandardMaterial) {
      for (const chave of ['opacity', 'emissiveIntensity', 'roughness'] as const) {
        canais.push({ ler: () => std[chave], escrever: (v) => { std[chave] = v as number; } });
      }
      for (const chave of ['color', 'emissive'] as const) {
        canais.push({ ler: () => std[chave].clone(), escrever: (v) => { std[chave].copy(v as THREE.Color); } });
      }
    }
    const shader = material as THREE.ShaderMaterial;
    if (shader.isShaderMaterial) for (const uniform of Object.values(shader.uniforms)) {
      if (typeof uniform.value === 'number') canais.push({ ler: () => uniform.value, escrever: (v) => { uniform.value = v; } });
    }
    const pontos = material as THREE.PointsMaterial;
    if (pontos.isPointsMaterial) for (const chave of ['opacity', 'size'] as const) {
      canais.push({ ler: () => pontos[chave], escrever: (v) => { pontos[chave] = v as number; } });
    }
  }
  let grau: number | undefined;
  let inicio = 0;
  let origem: Valor[] = [];
  let ultimo: Valor[] = [];
  return (destino: number, agora: number, reduzir: boolean) => {
    const valores = canais.map((c) => c.ler());
    if (grau !== destino) {
      origem = ultimo.length ? ultimo : valores;
      inicio = grau === undefined || reduzir ? agora - 320 : agora;
      grau = destino;
    }
    const t = reduzir ? 1 : Math.min(1, (agora - inicio) / 320);
    const suave = t * t * (3 - 2 * t);
    ultimo = valores.map((v, i) => typeof v === 'number'
      ? THREE.MathUtils.lerp(origem[i] as number, v, suave)
      : (origem[i] as THREE.Color).clone().lerp(v, suave));
    canais.forEach((c, i) => c.escrever(ultimo[i]!));
  };
}
