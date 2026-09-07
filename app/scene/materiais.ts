import * as THREE from 'three';
import { SISTEMA_POR_ID } from '../corpus/corpus';
import type { SistemaId } from '../corpus/tipos';

/**
 * Tokens de material derivados da paleta do §8.1. Nada aqui toca o DOM nem o
 * WebGLRenderer: os módulos de cena precisam ser importáveis no Node, para que
 * `validate-scene.mjs` meça a cena de verdade.
 */

export const COR_ROSA = new THREE.Color('#e8c66a');
export const COR_IDA_DIALETICA = new THREE.Color('#a33c3c');
export const COR_IDA_NOVA = new THREE.Color('#9b6fc4');

export function corDoSistema(id: SistemaId): THREE.Color {
  return new THREE.Color(SISTEMA_POR_ID.get(id)?.cor ?? '#ffffff');
}

/**
 * Casca do microcosmo: fresnel puro, opaca só na borda. É isto que o §4.1 chama
 * de "modo silhueta" — não um terceiro estado do switch, e sim como uma casca se
 * parece quando ligada.
 */
export function materialDeCasca(cor: THREE.Color): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uCor: { value: cor.clone() },
      uIntensidade: { value: 0.5 },
      uPotencia: { value: 3.2 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormalMundo;
      varying vec3 vParaCamera;
      void main() {
        vec4 mundo = modelMatrix * vec4(position, 1.0);
        vNormalMundo = normalize(mat3(modelMatrix) * normal);
        vParaCamera = normalize(cameraPosition - mundo.xyz);
        gl_Position = projectionMatrix * viewMatrix * mundo;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uCor;
      uniform float uIntensidade;
      uniform float uPotencia;
      varying vec3 vNormalMundo;
      varying vec3 vParaCamera;
      void main() {
        float borda = 1.0 - abs(dot(normalize(vNormalMundo), normalize(vParaCamera)));
        float a = pow(borda, uPotencia) * uIntensidade;
        gl_FragColor = vec4(uCor * a, a);
      }
    `,
  });
}

/** Figura translúcida: precisa deixar ver as 33 estruturas que a habitam. */
export function materialDaFigura(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#7d86a8'),
    transparent: true,
    opacity: 0.16,
    roughness: 0.45,
    metalness: 0,
    transmission: 0.6,
    thickness: 0.4,
    ior: 1.2,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

/** Foco gnóstico, órgão, região: esfera emissiva com brilho interpolável. */
export function materialDeFoco(cor: THREE.Color, opacidade = 0.85): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: cor.clone(),
    emissive: cor.clone(),
    emissiveIntensity: 0.35,
    roughness: 0.5,
    metalness: 0,
    transparent: true,
    opacity: opacidade,
  });
}

/** Região difusa (santuários, hemisférios, vísceras): mais nuvem que órgão. */
export function materialDeRegiao(cor: THREE.Color): THREE.MeshStandardMaterial {
  const m = materialDeFoco(cor, 0.13);
  m.emissiveIntensity = 0.18;
  m.depthWrite = false;
  return m;
}

/** Tubo: coluna, medula, cordões simpáticos. */
export function materialDeTubo(cor: THREE.Color): THREE.MeshStandardMaterial {
  return materialDeFoco(cor, 0.9);
}

/** Corrente de partículas ao longo de uma curva. */
export function materialDeCorrente(cor: THREE.Color): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    color: cor.clone(),
    size: 0.012,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
}
