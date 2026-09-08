import * as THREE from 'three';
import { SISTEMA_POR_ID } from '../corpus/corpus';
import type { SistemaId } from '../corpus/tipos';

/**
 * Tokens de material derivados da paleta do §8.1. Nada aqui toca o DOM nem o
 * WebGLRenderer: os módulos de cena precisam ser importáveis no Node, para que
 * `validate-scene.mjs` meça a cena de verdade.
 */

export const COR_ROSA = new THREE.Color('#c8901a');
export const COR_IDA_DIALETICA = new THREE.Color('#9c3535');
export const COR_IDA_NOVA = new THREE.Color('#6f4b9c');
export const COR_NOVA_PERSONALIDADE = new THREE.Color('#d09b2c');
export const COR_NOVO_FIRMAMENTO = new THREE.Color('#3f86a8');

export function corDoSistema(id: SistemaId): THREE.Color {
  return new THREE.Color(SISTEMA_POR_ID.get(id)?.cor ?? '#ffffff');
}

/**
 * Camada do microcosmo: fresnel puro, opaca só na borda. É isto que o §4.1 chama
 * de "modo silhueta" — não um terceiro estado do switch, e sim como uma camada se
 * parece quando ligada.
 *
 * Sobre papel claro o blending aditivo não existe: somar luz ao branco dá
 * branco. A borda passa a ser desenhada por alfa normal, o que a torna uma
 * auréola de tinta em vez de uma de luz.
 *
 * O `* a` no fragmento não é enfeite: o renderer usa alfa PRÉ-MULTIPLICADO, e
 * sem ele o blend soma a cor cheia ao fundo — o que sobre branco lava tudo.
 */
export function materialDeCamada(cor: THREE.Color): THREE.ShaderMaterial {
  // Composto sobre papel quase branco, um violeta médio a 28% de alfa devolve
  // cinza. O aro é desenhado com a MESMA matiz, saturada e escurecida, que é o
  // que a faz sobreviver à composição.
  const hsl = { h: 0, s: 0, l: 0 };
  cor.getHSL(hsl);
  const doAro = new THREE.Color().setHSL(hsl.h, Math.min(1, hsl.s * 1.7), Math.min(hsl.l, 0.4));
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uCor: { value: doAro },
      uIntensidade: { value: 0.5 },
      uPotencia: { value: 9.0 },
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
        float a = clamp(pow(borda, uPotencia) * uIntensidade, 0.0, 0.42);
        gl_FragColor = vec4(uCor * a, a);
      }
    `,
  });
}

/**
 * A pele. Precisa resolver duas exigências opostas: ler como um corpo humano de
 * verdade — quente, iluminado, com volume — e ainda assim deixar ver os órgãos
 * que ela contém, que são o assunto do atlas. O acordo é uma superfície cerosa,
 * translúcida a 38%, que o Fresnel adensa nas bordas: a silhueta fecha, o meio
 * abre.
 */
export function materialDaFigura(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d2a686'),
    transparent: true,
    opacity: 0.42,
    roughness: 0.62,
    metalness: 0,
    // Sem `transmission`: ela obriga o three a alocar um render target e a
    // desenhar a cena inteira uma segunda vez por quadro, e aqui só duplicaria
    // uma translucidez que o alfa já resolve.
    ior: 1.35,
    sheen: 0.5,
    sheenColor: new THREE.Color('#f0d3bd'),
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

/** Corpo nascente: distinto da pele natural e inicialmente quase invisível. */
export function materialDaNovaPersonalidade(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: COR_NOVA_PERSONALIDADE,
    emissive: COR_NOVA_PERSONALIDADE,
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: 0,
    roughness: 0.35,
    depthWrite: false,
    wireframe: true,
  });
}

/**
 * Foco gnóstico, órgão, região: sólido colorido com um emissivo interpolável.
 * No claro o emissivo trabalha numa faixa curta — passar disso satura para o
 * branco e a estrutura perde justamente o matiz que a identifica.
 */
export function materialDeFoco(cor: THREE.Color, opacidade = 0.92): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: cor.clone(),
    emissive: cor.clone(),
    emissiveIntensity: 0.12,
    roughness: 0.45,
    metalness: 0,
    transparent: true,
    opacity: opacidade,
  });
}

/** Região difusa (os três santuários): nuvem, e não órgão — não tem contorno. */
export function materialDeRegiao(cor: THREE.Color): THREE.MeshStandardMaterial {
  const m = materialDeFoco(cor, 0.14);
  m.emissiveIntensity = 0.04;
  m.roughness = 0.8;
  m.depthWrite = false;
  return m;
}

/**
 * Víscera: malha anatômica real. Diferente de uma região, um órgão TEM
 * contorno — escreve profundidade e ocupa lugar, de modo que a coluna passe
 * à frente do fígado como passa no corpo.
 */
export function materialDeOrgao(cor: THREE.Color): THREE.MeshStandardMaterial {
  const m = materialDeFoco(cor, 0.82);
  m.emissiveIntensity = 0.07;
  m.roughness = 0.55;
  return m;
}

/** Tubo: coluna, medula, cordões simpáticos. */
export function materialDeTubo(cor: THREE.Color): THREE.MeshStandardMaterial {
  return materialDeFoco(cor, 0.9);
}

/** Corrente de partículas ao longo de uma curva. Tinta, não luz — ver acima. */
export function materialDeCorrente(cor: THREE.Color): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    color: cor.clone(),
    size: 0.012,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    sizeAttenuation: true,
  });
}

/**
 * A sombra de contato no chão. Não é sombra calculada: é um disco com queda
 * radial, deitado sob os pés. Custa uma malha e é o que ancora a figura no
 * espaço em vez de deixá-la flutuando sobre o papel.
 */
export function materialDeSombra(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uOpacidade: { value: 0.3 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacidade;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float a = pow(1.0 - clamp(d, 0.0, 1.0), 1.5) * uOpacidade;
        gl_FragColor = vec4(vec3(0.09, 0.11, 0.15) * a, a);
      }
    `,
  });
}
