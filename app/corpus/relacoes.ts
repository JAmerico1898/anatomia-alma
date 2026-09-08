/**
 * Relações direcionadas do corpus, declaradas uma vez cada.
 *
 * Origem, destino e verbo preservam a causalidade descrita pelo livro.
 */
import type { Grau, Relacao, TipoRelacao } from './tipos';

const r = (
  origem: string,
  destino: string,
  tipo: TipoRelacao = 'compoe',
  verbo = 'compõe',
  grau?: Grau,
  condicao?: string,
): Relacao => ({ origem, destino, tipo, verbo, ...(grau === undefined ? {} : { grau }), ...(condicao ? { condicao } : {}) });

export const RELACOES: readonly Relacao[] = [
  // Encaixe das quatro camadas do sistema de vida — Gloss. p. 373.
  r('campo-magnetico-septuplo', 'ser-aural'),
  r('ser-aural', 'campo-de-respiracao'),
  r('campo-de-respiracao', 'personalidade'),
  r('ser-aural', 'focos-aurais'),
  r('campo-magnetico-septuplo', 'focos-aurais'),
  r('campo-de-respiracao', 'formas-pensamento'),

  // Os três santuários são os três focos da personalidade — II-3 pp. 205–207.
  r('personalidade', 'santuario-da-cabeca'),
  r('personalidade', 'santuario-do-coracao'),
  r('personalidade', 'santuario-da-pelve'),
  r('santuario-da-cabeca', 'eteres-mentais'),
  r('santuario-do-coracao', 'eteres-astrais'),
  r('santuario-da-pelve', 'eteres-sanguineos'),
  r('eteres-sanguineos', 'baco'),
  r('eteres-astrais', 'esterno'),

  // A cadeia da rosa: rosa → timo → hormônio → pequena circulação → cabeça — I-3 p. 41.
  r('rosa-do-coracao', 'santuario-do-coracao'),
  r('rosa-do-coracao', 'timo', 'irradia-sobre', 'irradia sobre', 0, 'quando o átomo primordial passa do estado latente à vibração'),
  r('rosa-do-coracao', 'esterno'),
  r('timo', 'hormonio-do-timo', 'forma', 'produz'),
  r('hormonio-do-timo', 'pequena-circulacao', 'transporta', 'transporta a força de luz para'),
  r('pequena-circulacao', 'sangue'),
  r('pequena-circulacao', 'esterno'),
  r('pequena-circulacao', 'pineal'),
  r('sangue', 'santuario-da-cabeca', 'transporta', 'transporta a força de luz até'),

  // Santuário da cabeça — II-2 p. 195; Gloss. pp. 371, 375; III-5 p. 308.
  r('santuario-da-cabeca', 'pineal'),
  r('santuario-da-cabeca', 'hemisferio-direito'),
  r('santuario-da-cabeca', 'hemisferio-esquerdo'),
  r('pineal', 'cundalini'),
  r('pineal', 'medula-oblonga'),
  r('cundalini', 'hemisferio-direito'),

  // Sistema espinal — Gloss. pp. 371, 377; II-5 pp. 223–224.
  r('coluna-vertebral', 'medula-espinal'),
  r('coluna-vertebral', 'fogo-da-consciencia'),
  r('coluna-vertebral', 'constante-de-hidrogenio'),
  r('coluna-vertebral', 'esterno'),
  r('fogo-da-consciencia', 'sangue'),
  r('fogo-da-consciencia', 'fluido-nervoso'),
  r('fluido-nervoso', 'medula-espinal'),
  r('medula-espinal', 'cordao-pingala'),
  r('medula-espinal', 'cordao-ida'),
  r('constante-de-hidrogenio', 'quatro-alimentos-santos'),

  // Simpático — II-5 pp. 224–227.
  r('cordao-pingala', 'cordao-ida'),
  r('santuario-da-cabeca', 'cordao-pingala', 'desce-por', 'desce por', 5),
  r('cordao-pingala', 'plexo-sacro', 'encontra', 'encontra Idá em', 5),
  r('plexo-sacro', 'cordao-ida', 'sobe-por', 'sobe por', 5),
  r('cordao-pingala', 'medula-oblonga'),
  r('cordao-ida', 'medula-oblonga'),
  r('plexo-sacro', 'santuario-da-pelve'),
  r('torre-dos-misterios', 'cordao-pingala'),
  r('torre-dos-misterios', 'cordao-ida'),
  r('torre-dos-misterios', 'plexo-sacro'),
  r('torre-dos-misterios', 'santuario-da-cabeca'),
  r('cidade-das-doze-portas', 'torre-dos-misterios'),
  r('cidade-das-doze-portas', 'cordao-ida'),

  // Domínio do eu sanguíneo — I-4 pp. 50–52.
  r('eu-sanguineo', 'figado', 'sai-por', 'faz as forças saírem por'),
  r('baco', 'eu-sanguineo', 'entra-por', 'faz as forças entrarem por'),
  r('eu-sanguineo', 'rins'),
  r('eu-sanguineo', 'suprarrenais'),
  r('eu-sanguineo', 'plexo-solar'),
  r('eu-sanguineo', 'sangue', 'governa', 'governa'),
  r('eu-sanguineo', 'fluido-nervoso'),
  r('eu-sanguineo', 'fogo-da-consciencia'),
  r('figado', 'baco'),
  r('baco', 'formas-pensamento'),
  r('quatro-eteres-naturais', 'baco', 'entra-por', 'entram no corpo por'),

  // Renovação aural — III-11 pp. 355–356.
  r('focos-aurais', 'santuario-da-cabeca', 'irradia-sobre', 'irradia sobre', 5, 'à medida que o novo firmamento se forma'),
  r('santuario-da-cabeca', 'personalidade', 'transforma', 'transforma a consciência e', 5),

  // Éteres e correntes — II-3 pp. 204–208; II-5 p. 223.
  r('quatro-eteres-naturais', 'doze-energias'),
  r('doze-energias', 'eteres-mentais'),
  r('doze-energias', 'eteres-astrais'),
  r('doze-energias', 'eteres-sanguineos'),
  r('quatro-alimentos-santos', 'esterno'),
  r('quatro-alimentos-santos', 'quatro-eteres-naturais'),
  r('formas-pensamento', 'santuario-da-cabeca'),
  r('focos-aurais', 'santuario-da-pelve'),
  r('focos-aurais', 'sangue'),
];

/**
 * Verbete do Glossário -> estruturas a que ele se refere.
 * Verbetes ausentes daqui têm `estruturas: []`.
 */
export const VERBETES_DE: Readonly<Record<string, readonly string[]>> = {
  'rosa-do-coracao': ['rosa-do-coracao'],
  'atomo-centelha-do-espirito': ['rosa-do-coracao'],
  cundalini: ['cundalini', 'pineal'],
  'pineal-ou-glandula-pineal': ['pineal', 'cundalini'],
  'hemisferios-cerebrais': ['hemisferio-direito', 'hemisferio-esquerdo', 'santuario-da-cabeca'],
  'circulacao-sanguinea-pequena': ['pequena-circulacao', 'rosa-do-coracao', 'esterno'],
  'coluna-do-fogo-serpentino': ['coluna-vertebral'],
  'fogo-serpentino': ['fogo-da-consciencia', 'coluna-vertebral'],
  'sistema-do-fogo-serpentino': ['coluna-vertebral', 'medula-espinal', 'constante-de-hidrogenio'],
  simpatico: ['cordao-pingala', 'cordao-ida', 'medula-oblonga', 'plexo-sacro'],
  'ser-aural': ['ser-aural'],
  'ser-da-lipica': ['ser-aural'],
  lipica: ['ser-aural'],
  firmamento: ['ser-aural', 'focos-aurais'],
  'sistema-da-lipica': ['focos-aurais', 'ser-aural'],
  microcosmo: [
    'personalidade',
    'campo-de-respiracao',
    'ser-aural',
    'campo-magnetico-septuplo',
    'focos-aurais',
  ],
  'campo-de-manifestacao': ['campo-de-respiracao'],
  'campo-de-respiracao': ['campo-de-respiracao'],
  sistema: ['campo-magnetico-septuplo', 'personalidade'],
  'imagem-mental-do-homem-imortal': ['formas-pensamento', 'campo-de-respiracao'],
  'consciencia-cerebral-lunar': ['plexo-solar'],
  'astucia-atlante': ['plexo-solar'],
  lucifer: ['ser-aural'],
  endura: ['coluna-vertebral', 'eu-sanguineo'],
  'demolicao-do-eu': ['eu-sanguineo'],
  autodemolicao: ['eu-sanguineo'],
  'luta-contra-o-mal': ['ser-aural'],
  'ser-desejo-um-novo': ['eu-sanguineo'],
  transfiguracao: ['personalidade', 'campo-magnetico-septuplo'],
  'religiao-natural': ['sangue'],
  carma: ['ser-aural', 'focos-aurais'],
};
