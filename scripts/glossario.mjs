// Extrai os verbetes do Glossário (pp. 363–378) do texto do livro.
// Devolve blocos "termo + definição" ainda unidos: a fronteira entre os dois
// não é decidível mecanicamente (a definição também começa em maiúscula), então
// ela é declarada no corpus e conferida contra estes blocos pelo validador.
import { readFileSync } from 'node:fs';
import { BOOK_PATH } from './book.mjs';

const INICIO = /Albigenses Nome dado aos cátaros/;

export function extrairBlocos() {
  const linhas = readFileSync(BOOK_PATH, 'utf8').split(/\r?\n/);
  // O Glossário é o último bloco do livro antes do colofão; sua nota de
  // abertura é a única ocorrência dessa frase no texto.
  const abertura = linhas.findIndex((l) =>
    l.includes('Para que o leitor tenha uma melhor compreensão'),
  );
  if (abertura < 0) throw new Error('abertura do Glossário não encontrada');
  const texto = linhas
    .slice(abertura)
    .map((l) => l.trim())
    .filter((l) => l && l !== 'O novo homem' && l !== 'Glossário' && !/^\d{1,3}$/.test(l))
    .join(' ')
    .replace(/\u00ad\s*/g, '')       // hífen suave da hifenização
    .replace(/-\s+-/g, '-')          // hifenização dentro de palavra já hifenizada
    .replace(/(\p{Ll})-\s+(\p{Ll})/gu, '$1$2')
    .replace(/\s+/g, ' ');

  // Erratura da 3.ª edição: o verbete "Hemisférios cerebrais" (p. 371) encerra
  // com "306" sem colchetes, o que faria a marcação do verbete seguinte ser
  // lida como sua. Restaura-se a marcação, sem alterar uma palavra do texto.
  const corrigido = texto.replace(
    'o foco mais importante da vontade. 306 Hierarquia de Cristo',
    'o foco mais importante da vontade. [306] Hierarquia de Cristo',
  );

  const inicio = corrigido.search(INICIO);
  if (inicio < 0) throw new Error('início do Glossário não encontrado');

  const blocos = [];
  let resto = corrigido.slice(inicio);
  const TERMINADOR = /\[(\d{1,3})\]/;
  for (;;) {
    const m = resto.match(TERMINADOR);
    if (!m) break;
    blocos.push({
      texto: resto.slice(0, m.index).trim(),
      paginaPrimeiraMencao: Number(m[1]),
    });
    resto = resto.slice(m.index + m[0].length);
  }
  return blocos;
}
