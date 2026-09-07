// Gera `app/corpus/glossario.ts` a partir de `livro/book.txt`.
//
// Só o par (termo, definição) é decidido aqui, e apenas na fronteira: a lista
// TERMOS abaixo declara onde o termo em negrito acaba. O corpo da definição é
// sempre o texto do livro, e a checagem `bloco === termo + separador + definicao`
// garante que nenhuma palavra minha entrou nele.
//
// Uso: node scripts/gerar-glossario.mjs
import { writeFileSync } from 'node:fs';
import { extrairBlocos } from './glossario.mjs';

/** As 68 fronteiras termo/definição, na ordem em que o livro as imprime. */
const TERMOS = [
  'Albigenses',
  'Arrependimento — humildade',
  'Astúcia atlante',
  'Átomo-centelha-do-espírito',
  'Autodemolição',
  'Campo de manifestação',
  'Campo de respiração',
  'Carma',
  'Cátaros (do gr. katharos: puros)',
  'Circulação sanguínea, pequena',
  'Coluna do fogo serpentino',
  'Consciência cerebral lunar',
  'Coração cósmico de Cristo',
  'Cundalini',
  'Demolição do eu',
  'Devakan',
  'Dialética',
  'Dispensação',
  'Divisão',
  'Doutrina Universal',
  'Eclésia, a nova',
  'Efésio',
  'Endura',
  'Éons',
  'Escola Espiritual',
  'Esfera material/esfera refletora',
  'Firmamento',
  'Fogo serpentino',
  'Fraternidade Universal',
  'Gnosis',
  'Hemisférios cerebrais',
  'Hierarquia de Cristo',
  'Hierofantes de Cristo',
  'Hierarquia dialética',
  'Humanidade adâmica',
  'Humildade',
  'Imagem mental do homem imortal',
  'Lípica',
  'Logos',
  'Lúcifer',
  'Luta contra o mal',
  'Macrocosmo',
  'Maniqueus',
  'Mantra',
  'Microcosmo',
  'Negação',
  'Núcleo pérfido de nossa região de vida',
  'Pineal ou glândula pineal',
  'Príncipes deste mundo',
  'Reinos naturais subumanos',
  'Religião natural',
  'Roda da dialética',
  'Roda do nascimento e da morte',
  'Rosa-cruzes clássicos',
  'Rosa-do-coração',
  'Senda da Sangha',
  'Ser aural',
  'Ser da lípica',
  'Ser-desejo, um novo',
  'Simpático',
  'Sistema',
  'Sistema do fogo serpentino',
  'Sistema da lípica',
  'Tao',
  'Transfiguração',
  'Transmutação',
  'Una Sancta',
  'Vácuo de Shamballa',
];

export function slugificar(termo) {
  return termo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function montarVerbetes() {
  const blocos = extrairBlocos();
  if (blocos.length !== TERMOS.length) {
    throw new Error(`${blocos.length} blocos para ${TERMOS.length} termos`);
  }
  return blocos.map((bloco, i) => {
    const termo = TERMOS[i];
    let resto = bloco.texto;
    if (!resto.startsWith(termo)) {
      throw new Error(`bloco ${i} não começa por "${termo}": ${resto.slice(0, 60)}`);
    }
    resto = resto.slice(termo.length);
    // O livro separa termo e definição por espaço; em "Eclésia, a nova:" por
    // dois-pontos. Nenhum outro separador é aceito.
    const separador = resto.startsWith(': ') ? ': ' : ' ';
    if (!resto.startsWith(separador)) throw new Error(`separador inesperado em "${termo}"`);
    return {
      slug: slugificar(termo),
      termo,
      separador,
      definicao: resto.slice(separador.length).trim(),
      paginaPrimeiraMencao: bloco.paginaPrimeiraMencao,
    };
  });
}

const esc = (s) => JSON.stringify(s);

const verbetes = montarVerbetes();
const slugs = new Set(verbetes.map((v) => v.slug));
if (slugs.size !== verbetes.length) throw new Error('slug duplicado no Glossário');

const saida = `// GERADO por scripts/gerar-glossario.mjs — não editar à mão.
// Fonte: O novo homem, 3. ed., Glossário, pp. 363–378. Transcrição verbatim
// nas palavras; hifenização de quebra de linha, cabeços e números de página
// removidos. Uma erratura da edição é corrigida no extrator, documentada lá.
import type { Verbete } from './tipos';

/** Os ${verbetes.length} verbetes, sem \`estruturas\` — preenchidas em corpus.ts. */
export const VERBETES_BRUTOS: readonly Omit<Verbete, 'estruturas'>[] = [
${verbetes
  .map(
    (v) => `  {
    slug: ${esc(v.slug)},
    termo: ${esc(v.termo)},
    definicao: ${esc(v.definicao)},
    paginaPrimeiraMencao: ${v.paginaPrimeiraMencao},
  },`,
  )
  .join('\n')}
];
`;

writeFileSync(new URL('../app/corpus/glossario.ts', import.meta.url), saida, 'utf8');
console.log(`glossario.ts: ${verbetes.length} verbetes, ${saida.length} bytes`);
