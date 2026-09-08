/**
 * As relações do corpus, declaradas UMA vez cada.
 *
 * `Estrutura.ligacoes` e `Estrutura.verbetes` (e `Verbete.estruturas`) são
 * derivadas daqui em corpus.ts. Simetria e reciprocidade passam a ser
 * verdadeiras por construção, e não invariantes a manter à mão nos dois lados.
 */

/** Arestas não direcionadas entre estruturas, com a fonte no livro ao lado. */
export const LIGACOES: readonly (readonly [string, string])[] = [
  // Encaixe das quatro camadas do sistema de vida — Gloss. p. 373.
  ['campo-magnetico-septuplo', 'ser-aural'],
  ['ser-aural', 'campo-de-respiracao'],
  ['campo-de-respiracao', 'personalidade'],
  ['ser-aural', 'focos-aurais'],
  ['campo-magnetico-septuplo', 'focos-aurais'],
  ['campo-de-respiracao', 'formas-pensamento'],

  // Os três santuários são os três focos da personalidade — II-3 pp. 205–207.
  ['personalidade', 'santuario-da-cabeca'],
  ['personalidade', 'santuario-do-coracao'],
  ['personalidade', 'santuario-da-pelve'],
  ['santuario-da-cabeca', 'eteres-mentais'],
  ['santuario-do-coracao', 'eteres-astrais'],
  ['santuario-da-pelve', 'eteres-sanguineos'],
  ['eteres-sanguineos', 'baco'],
  ['eteres-astrais', 'esterno'],

  // A cadeia da rosa: rosa → timo → hormônio → pequena circulação → cabeça — I-3 p. 41.
  ['rosa-do-coracao', 'santuario-do-coracao'],
  ['rosa-do-coracao', 'timo'],
  ['rosa-do-coracao', 'esterno'],
  ['timo', 'hormonio-do-timo'],
  ['hormonio-do-timo', 'pequena-circulacao'],
  ['pequena-circulacao', 'sangue'],
  ['pequena-circulacao', 'esterno'],
  ['pequena-circulacao', 'pineal'],
  ['sangue', 'santuario-da-cabeca'],

  // Santuário da cabeça — II-2 p. 195; Gloss. pp. 371, 375; III-5 p. 308.
  ['santuario-da-cabeca', 'pineal'],
  ['santuario-da-cabeca', 'hemisferio-direito'],
  ['santuario-da-cabeca', 'hemisferio-esquerdo'],
  ['pineal', 'cundalini'],
  ['pineal', 'medula-oblonga'],
  ['cundalini', 'hemisferio-direito'],

  // Sistema espinal — Gloss. pp. 371, 377; II-5 pp. 223–224.
  ['coluna-vertebral', 'medula-espinal'],
  ['coluna-vertebral', 'fogo-da-consciencia'],
  ['coluna-vertebral', 'constante-de-hidrogenio'],
  ['coluna-vertebral', 'esterno'],
  ['fogo-da-consciencia', 'sangue'],
  ['fogo-da-consciencia', 'fluido-nervoso'],
  ['fluido-nervoso', 'medula-espinal'],
  ['medula-espinal', 'cordao-pingala'],
  ['medula-espinal', 'cordao-ida'],
  ['constante-de-hidrogenio', 'quatro-alimentos-santos'],

  // Simpático — II-5 pp. 224–227.
  ['cordao-pingala', 'cordao-ida'],
  ['cordao-pingala', 'plexo-sacro'],
  ['cordao-ida', 'plexo-sacro'],
  ['cordao-pingala', 'medula-oblonga'],
  ['cordao-ida', 'medula-oblonga'],
  ['plexo-sacro', 'santuario-da-pelve'],
  ['torre-dos-misterios', 'cordao-pingala'],
  ['torre-dos-misterios', 'cordao-ida'],
  ['torre-dos-misterios', 'plexo-sacro'],
  ['torre-dos-misterios', 'santuario-da-cabeca'],
  ['cidade-das-doze-portas', 'torre-dos-misterios'],
  ['cidade-das-doze-portas', 'cordao-ida'],

  // Domínio do eu sanguíneo — I-4 pp. 50–52.
  ['eu-sanguineo', 'figado'],
  ['eu-sanguineo', 'baco'],
  ['eu-sanguineo', 'rins'],
  ['eu-sanguineo', 'suprarrenais'],
  ['eu-sanguineo', 'plexo-solar'],
  ['eu-sanguineo', 'sangue'],
  ['eu-sanguineo', 'fluido-nervoso'],
  ['eu-sanguineo', 'fogo-da-consciencia'],
  ['figado', 'baco'],
  ['baco', 'formas-pensamento'],
  ['baco', 'quatro-eteres-naturais'],

  // Éteres e correntes — II-3 pp. 204–208; II-5 p. 223.
  ['quatro-eteres-naturais', 'doze-energias'],
  ['doze-energias', 'eteres-mentais'],
  ['doze-energias', 'eteres-astrais'],
  ['doze-energias', 'eteres-sanguineos'],
  ['quatro-alimentos-santos', 'esterno'],
  ['quatro-alimentos-santos', 'quatro-eteres-naturais'],
  ['formas-pensamento', 'santuario-da-cabeca'],
  ['focos-aurais', 'santuario-da-pelve'],
  ['focos-aurais', 'sangue'],
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
