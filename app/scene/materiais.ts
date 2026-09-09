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
 * Cor é informação (§8.1): o matiz é o que o livro nomeia, e satura-lo não o
 * muda. O que ele compensa é a travessia — ACES desatura tudo o que passa por
 * ele, e um véu de alfa baixo sobre papel quase branco devolve cinza. Estes
 * fatores existem para que o violeta chegue violeta ao olho, e não para
 * inventar uma cor que o livro não diz.
 */
function saturar(cor: THREE.Color, fator: number, tetoDeLuz = 1): THREE.Color {
  const hsl = { h: 0, s: 0, l: 0 };
  cor.getHSL(hsl);
  return new THREE.Color().setHSL(hsl.h, Math.min(1, hsl.s * fator), Math.min(hsl.l, tetoDeLuz));
}

/**
 * Camada do microcosmo: fresnel de tinta, opaca só perto da borda.
 *
 * Alfa do material explícito — a cor vai crua e o `premultiplied_alpha_fragment`
 * a pré-multiplica uma vez só, que é o que impede a lavagem por alfa duplo.
 *
 * O aro NÃO é pintado com o token da paleta: composto a alfa baixo sobre papel
 * quase branco, um violeta médio devolve cinza. É a mesma matiz, saturada e
 * escurecida, que sobrevive à composição — e sem ela os sete raios chegam ao
 * olho como sete anéis iguais.
 */
export function materialDeCamada(cor: THREE.Color): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: {
      uCor: { value: saturar(cor, 1.9, 0.38) },
      uIntensidade: { value: 0.5 },
      uPotencia: { value: 2.3 },
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
        float a = clamp((0.05 + 0.72 * pow(borda, uPotencia)) * sqrt(max(0.0, 1.0 - borda)) * uIntensidade, 0.0, 0.42);
        gl_FragColor = vec4(uCor, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <premultiplied_alpha_fragment>
      }
    `,
  });
}

/**
 * A pele. Precisa resolver duas exigências opostas: ler como um corpo humano de
 * verdade — quente, iluminado, com volume — e ainda assim deixar ver os órgãos
 * que ela contém, que são o assunto do atlas. O acordo é uma superfície cerosa e
 * carnada, meio translúcida, que o Fresnel adensa nas bordas: a silhueta fecha,
 * o meio abre.
 */
export function materialDaFigura(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d99a72'),
    transparent: true,
    opacity: 0.5,
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

/**
 * A nova personalidade: uma casca erguida FORA da velha (II-5, p.226).
 *
 * Foi wireframe do corpo inteiro, e era isso que apagava o interior: nos graus
 * 5 a 7 as arestas de toda a malha caíam por cima dos órgãos. Aqui ela é
 * fresnel, opaca só na silhueta — de frente o candidato continua transparente,
 * e coluna, fígado e rins seguem legíveis no grau 7.
 *
 * A densidade ocupa a superfície e reforça suavemente a silhueta. A forma
 * humana e o ouro distinguem a personalidade das camadas esféricas.
 */
export function materialDaNovaPersonalidade(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: {
      uCor: { value: saturar(COR_NOVA_PERSONALIDADE, 1.5, 0.42) },
      uIntensidade: { value: 0 },
      uPotencia: { value: 1.6 },
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
        float a = clamp((0.14 + 0.44 * pow(borda, uPotencia)) * uIntensidade, 0.0, 0.55);
        gl_FragColor = vec4(uCor, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <premultiplied_alpha_fragment>
      }
    `,
  });
}

/**
 * Estrelas do firmamento microcósmico (a lipika).
 *
 * O firmamento não nasce no quinto degrau: ele já existe, e o que a senda faz é
 * renová-lo — um novo céu e uma nova terra (III-11, p.356). Por isso as estrelas
 * velhas ardem desde o estado natural, e nos graus 5 a 7 apagam enquanto as
 * novas se inflamam NO MESMO firmamento.
 *
 * O fade não é enfeite: adensado, o firmamento envolve a figura, e as estrelas
 * que caem sobre o tronco escondem justamente os órgãos. O vértice mede o
 * afastamento do ponto em relação ao eixo do corpo, na direção perpendicular à
 * da câmera; quem se projeta sobre o corpo esmaece, quem está livre arde cheio.
 * Como depende da câmera, o cálculo tem de estar no shader, e não no material.
 */
export function materialDeEstrelasAurais(cor: THREE.Color, tamanho: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    uniforms: {
      uCor: { value: cor.clone() },
      uOpacidade: { value: 0 },
      uTamanho: { value: tamanho },
      /** Quanto o núcleo da estrela arde acima da própria cor (0 = apagado). */
      uBrilho: { value: 0 },
      /**
       * Fração das estrelas já inflamadas. O novo firmamento se forma
       * "paulatinamente" (III-11, p.356): o que cresce grau a grau é o número
       * de luzes acesas, não o brilho de cada uma — a que acende já arde
       * inteira.
       */
      uAcesas: { value: 1 },
      /** Base do eixo vertical do corpo, em mundo. */
      uEixo: { value: new THREE.Vector3() },
      /** Meia-largura do corpo e faixa de altura que ele ocupa. */
      uMeiaLargura: { value: 0.22 },
      uAlturaMin: { value: -1 },
      uAlturaMax: { value: 1 },
    },
    vertexShader: /* glsl */ `
      uniform float uTamanho;
      uniform vec3 uEixo;
      uniform float uMeiaLargura;
      uniform float uAlturaMin;
      uniform float uAlturaMax;
      uniform float uAcesas;
      attribute float ordem;
      varying float vLivre;
      varying float vAcesa;
      void main() {
        vAcesa = step(ordem, uAcesas);
        vec4 mundo = modelMatrix * vec4(position, 1.0);

        // Direção horizontal da câmera e a perpendicular a ela: é sobre esta
        // que se mede o quanto a estrela escapa do corpo na tela.
        vec2 paraCamera = normalize(cameraPosition.xz - uEixo.xz);
        vec2 lateral = vec2(-paraCamera.y, paraCamera.x);
        float desvio = abs(dot(mundo.xz - uEixo.xz, lateral));

        float dentroDaAltura =
          smoothstep(uAlturaMin - 0.12, uAlturaMin + 0.12, mundo.y) *
          (1.0 - smoothstep(uAlturaMax - 0.12, uAlturaMax + 0.12, mundo.y));
        float sobrepoe = (1.0 - smoothstep(uMeiaLargura * 0.7, uMeiaLargura * 1.5, desvio)) * dentroDaAltura;
        vLivre = mix(1.0, 0.14, sobrepoe);

        vec4 vista = viewMatrix * mundo;
        gl_PointSize = uTamanho * 300.0 / max(0.001, -vista.z);
        gl_Position = projectionMatrix * vista;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uCor;
      uniform float uOpacidade;
      uniform float uBrilho;
      varying float vLivre;
      varying float vAcesa;
      void main() {
        if (vAcesa < 0.5) discard;
        // Ponto redondo: o quadrado padrão do GL vira grade visível quando o
        // firmamento adensa.
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float a = uOpacidade * vLivre * exp(-18.0 * d * d) * (1.0 - smoothstep(0.4, 0.5, d));
        // O sol latente que se inflama não muda só de matiz: acende. O núcleo
        // arde acima da própria cor, e é isso que faz a estrela nova ler como
        // luz, e não como um ponto pintado de dourado.
        float nucleo = 1.0 - smoothstep(0.0, 0.3, d);
        gl_FragColor = vec4(uCor * (1.0 + uBrilho * nucleo * 1.9), a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <premultiplied_alpha_fragment>
      }
    `,
  });
}

/**
 * Foco gnóstico, órgão, região: sólido colorido com um emissivo interpolável.
 * No claro o emissivo trabalha numa faixa curta — passar disso satura para o
 * branco e a estrutura perde justamente o matiz que a identifica.
 */
export function materialDeFoco(cor: THREE.Color, opacidade = 0.92): THREE.MeshStandardMaterial {
  const tinta = saturar(cor, 1.35);
  return new THREE.MeshStandardMaterial({
    color: tinta,
    emissive: tinta.clone(),
    emissiveIntensity: 0.16,
    roughness: 0.45,
    metalness: 0,
    transparent: true,
    opacity: opacidade,
  });
}

/** Região difusa (os três santuários): nuvem, e não órgão — não tem contorno. */
export function materialDeRegiao(cor: THREE.Color): THREE.MeshStandardMaterial {
  const m = materialDeFoco(cor, 0.26);
  m.emissiveIntensity = 0.08;
  m.roughness = 0.8;
  m.depthWrite = false;
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vRegiaoNormal;\nvarying vec3 vRegiaoVista;');
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvRegiaoNormal = normalize(normalMatrix * normal);\nvRegiaoVista = normalize(-mvPosition.xyz);');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vRegiaoNormal;\nvarying vec3 vRegiaoVista;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', '#include <alphamap_fragment>\nfloat densidade = max(0.0, dot(normalize(vRegiaoNormal), normalize(vRegiaoVista)));\ndiffuseColor.a *= pow(densidade, 2.4);');
  };
  return m;
}

/**
 * Víscera: malha anatômica real. Diferente de uma região, um órgão TEM
 * contorno — escreve profundidade e ocupa lugar, de modo que a coluna passe
 * à frente do fígado como passa no corpo.
 */
export function materialDeOrgao(cor: THREE.Color): THREE.MeshStandardMaterial {
  const m = materialDeFoco(cor, 1);
  m.transparent = false;
  m.userData.orgao = true;
  m.emissiveIntensity = 0.12;
  m.roughness = 0.68;
  return m;
}

/** Tubo: coluna, medula, cordões simpáticos. */
export function materialDeTubo(cor: THREE.Color): THREE.MeshStandardMaterial {
  return materialDeFoco(cor, 0.9);
}

/** Corrente de partículas ao longo de uma curva. Tinta, não luz — ver acima. */
export function materialDeCorrente(cor: THREE.Color): THREE.PointsMaterial {
  const material = new THREE.PointsMaterial({
    color: saturar(cor, 1.3),
    size: 0.012,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    sizeAttenuation: true,
  });
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_particle_fragment>', '#include <map_particle_fragment>\nfloat d = length(gl_PointCoord - vec2(0.5));\ndiffuseColor.a *= exp(-20.0*d*d) * (1.0-smoothstep(0.35,0.5,d));');
  };
  return material;
}

/**
 * A sombra de contato no chão. Não é sombra calculada: é um disco com queda
 * radial, deitado sob os pés. Custa uma malha e é o que ancora a figura no
 * espaço em vez de deixá-la flutuando sobre o papel.
 */
export function materialDeSombra(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    uniforms: { uOpacidade: { value: 0.22 } },
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
        gl_FragColor = vec4(vec3(0.09, 0.11, 0.15), a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <premultiplied_alpha_fragment>
      }
    `,
  });
}
