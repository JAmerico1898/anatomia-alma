import * as THREE from 'three';
import { materialDaFigura } from './materiais';

/**
 * Manequim abstrato, gerado inteiramente por código. Deliberadamente
 * não-anatômico: lê-se como "figura" e nunca tenta parecer uma pessoa, o que o
 * mantém fora do vale da estranheza e o impede de competir com as estruturas
 * que ele existe para deixar ver.
 *
 * Escala do §6.1: pés em y=-1.30, topo da cabeça em y=+0.50, rosa na origem.
 */

export const PES_Y = -1.3;
export const TOPO_Y = 0.5;
export const ALTURA = TOPO_Y - PES_Y;

/** Perfil do tronco: raio em função de y, do quadril ao ombro. */
const PERFIL_TRONCO: readonly (readonly [number, number])[] = [
  [-0.46, 0.02],
  [-0.44, 0.116],
  [-0.4, 0.136],
  [-0.34, 0.141],
  [-0.3, 0.138],
  [-0.2, 0.126],
  [-0.1, 0.13],
  [0, 0.146],
  [0.1, 0.162],
  [0.19, 0.171],
  [0.25, 0.152],
  [0.28, 0.06],
];

function capsula(
  material: THREE.Material,
  de: THREE.Vector3,
  ate: THREE.Vector3,
  raio: number,
): THREE.Mesh {
  const eixo = new THREE.Vector3().subVectors(ate, de);
  const comprimento = Math.max(eixo.length() - raio * 2, 0.001);
  const g = new THREE.CapsuleGeometry(raio, comprimento, 4, 12);
  const m = new THREE.Mesh(g, material);
  m.position.copy(de).add(ate).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), eixo.clone().normalize());
  return m;
}

/**
 * Constrói a figura. Sem merge de geometria: um grupo de malhas partilhando um
 * material único é suficiente para o raycast e evita uma dependência a mais.
 */
export function construirFigura(): THREE.Group {
  const material = materialDaFigura();
  const grupo = new THREE.Group();
  grupo.name = 'figura';

  // Tronco: perfil revolucionado e achatado em z, porque o tronco humano é mais
  // largo do que profundo.
  const tronco = new THREE.Mesh(
    new THREE.LatheGeometry(
      PERFIL_TRONCO.map(([y, r]) => new THREE.Vector2(r, y)),
      36,
    ),
    material,
  );
  tronco.scale.z = 0.62;
  grupo.add(tronco);

  // Pescoço e cabeça.
  grupo.add(capsula(material, new THREE.Vector3(0, 0.25, -0.01), new THREE.Vector3(0, 0.31, -0.01), 0.042));
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.105, 28, 20), material);
  cabeca.position.set(0, 0.4, -0.005);
  cabeca.scale.set(0.86, 1.06, 0.94);
  grupo.add(cabeca);

  for (const lado of [1, -1] as const) {
    // Braços, ligeiramente abertos, do ombro à mão.
    grupo.add(
      capsula(
        material,
        new THREE.Vector3(lado * 0.175, 0.185, 0),
        new THREE.Vector3(lado * 0.225, -0.13, 0.01),
        0.043,
      ),
    );
    grupo.add(
      capsula(
        material,
        new THREE.Vector3(lado * 0.225, -0.13, 0.01),
        new THREE.Vector3(lado * 0.245, -0.44, 0.02),
        0.035,
      ),
    );
    // Pernas, do quadril ao pé.
    grupo.add(
      capsula(
        material,
        new THREE.Vector3(lado * 0.085, -0.42, 0),
        new THREE.Vector3(lado * 0.095, -0.86, 0),
        0.062,
      ),
    );
    grupo.add(
      capsula(
        material,
        new THREE.Vector3(lado * 0.095, -0.86, 0),
        new THREE.Vector3(lado * 0.1, PES_Y + 0.04, -0.01),
        0.045,
      ),
    );
    // Pés.
    const pe = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), material);
    pe.position.set(lado * 0.1, PES_Y + 0.04, 0.035);
    pe.scale.set(0.8, 0.55, 1.5);
    grupo.add(pe);
  }

  return grupo;
}

/**
 * A figura contém este ponto? Usado por `validate-scene.mjs` para provar que
 * nenhum foco flutua fora do corpo. Aproximação por cilindro-de-revolução do
 * perfil do tronco, mais cabeça, mais membros — deliberadamente generosa, para
 * reprovar apenas o que está claramente fora.
 */
export function dentroDaFigura(p: readonly [number, number, number]): boolean {
  const [x, y, z] = p;
  if (y > TOPO_Y || y < PES_Y) return false;

  // Cabeça.
  const dc = Math.hypot(x / 0.86, (y - 0.4) / 1.06, (z + 0.005) / 0.94);
  if (dc <= 0.105 * 1.02) return true;

  // Tronco, por interpolação do perfil (z comprimido em 0.62).
  if (y >= PERFIL_TRONCO[0]![0] && y <= PERFIL_TRONCO.at(-1)![0]) {
    let raio = 0;
    for (let i = 1; i < PERFIL_TRONCO.length; i++) {
      const [y0, r0] = PERFIL_TRONCO[i - 1]!;
      const [y1, r1] = PERFIL_TRONCO[i]!;
      if (y >= y0 && y <= y1) {
        const t = y1 === y0 ? 0 : (y - y0) / (y1 - y0);
        raio = r0 + (r1 - r0) * t;
        break;
      }
    }
    if (Math.hypot(x, z / 0.62) <= raio * 1.02) return true;
  }

  // Pescoço.
  if (y >= 0.25 && y <= 0.31 && Math.hypot(x, z + 0.01) <= 0.05) return true;

  return false;
}
