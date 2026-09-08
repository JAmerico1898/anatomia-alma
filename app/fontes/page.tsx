import type { Metadata } from 'next';
import { PaginaTexto } from '../components/pagina-texto';

export const metadata: Metadata = {
  title: 'Fontes',
  description:
    'Edição citada, escopo, limites e créditos do atlas Anatomia da Alma, incluindo a nota sobre posições interpretativas.',
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--color-borda)] pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-texto-3)]">
        {titulo}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-texto-2)]">{children}</div>
    </section>
  );
}

export default function Fontes() {
  return (
    <PaginaTexto
      atual="/fontes"
      titulo="Fontes e limites"
      subtitulo="O que este atlas afirma, o que ele apenas enquadra, e de onde vem cada coisa."
    >
      <div className="space-y-10">
        <Secao titulo="Declaração de escopo">
          <p>
            Este é um atlas de estudo que acompanha a leitura do livro. Não é prática, não é
            exercício, não é terapia, não é diagnóstico, não é iniciação, e não substitui o texto.
          </p>
        </Secao>

        <Secao titulo="Edição citada">
          <p className="serifa">
            Rijckenborgh, J. van. <em>O novo homem: conhecimento, iniciação, realização.</em>{' '}
            Tradução de Marcus Vinicius Mesquita de Sousa. 3. ed. Jarinu, SP: Pentagrama
            Publicações, 2016. 384 p. ISBN 978-85-67992-54-9. Título original:{' '}
            <em>De komende nieuwe mens</em> (Rozekruis Pers, Haarlem, 1953).
          </p>
          <p>
            Toda citação identifica <strong>capítulo e página impressa</strong> — a paginação que o
            leitor tem em mãos, não a do arquivo digital. O Glossário (pp. 363–378) é reproduzido
            integralmente em <a className="underline" href="/glossario">/glossário</a>. Uso do
            livro autorizado pelo responsável do projeto.
          </p>
          <p>
            As 95 citações deste atlas são conferidas automaticamente contra o texto do livro, na
            página declarada, a cada verificação do projeto. Uma citação inventada, ou com a página
            errada, quebra a construção.
          </p>
        </Secao>

        <Secao titulo="As posições tridimensionais são interpretativas">
          <p>
            O livro fixa com precisão apenas algumas posições: o átomo-centelha-do-espírito no ápice
            do ventrículo direito do coração; o timo atrás do esterno; os dois cordões do simpático
            à direita e à esquerda da coluna; o plexo sacro na parte inferior da coluna vertebral; e
            o ponto de encontro acima da medula oblonga. Fora dessas, o que a cena mostra é{' '}
            <strong>enquadramento plausível para poder navegar, não afirmação da Escola.</strong>
          </p>
          <p>
            A origem das coordenadas é a rosa-do-coração, porque o Glossário (p. 376) define que ela
            coincide com o centro matemático do microcosmo. Doze estruturas, porém, não são
            posicionadas por interpretação nenhuma: pele, esterno, timo, pineal, hemisférios,
            medula oblonga, coluna vertebral, fígado, baço, rins e suprarrenais estão exatamente
            onde a anatomia de referência os põe, e a verificação do projeto reprova qualquer
            divergência entre a posição declarada no corpus e o centro medido da malha.
          </p>
          <p>
            As camadas do microcosmo envolvem o corpo inteiro e são, por isso, centradas no centro
            geométrico da figura — não na rosa, que está à altura do peito. Uma esfera centrada na
            rosa teria de ser grande demais para conter os pés, e o microcosmo acabaria maior que o
            homem que ele é.
          </p>
        </Secao>

        <Secao titulo="Uma erratura da edição">
          <p>
            No Glossário impresso, o verbete <em>Hemisférios cerebrais</em> encerra com o número da
            primeira menção sem os colchetes que o restante da lista usa. A transcrição restaura a
            marcação, sem alterar uma palavra do texto. O verbete{' '}
            <em>Príncipes deste mundo</em> traz “[370]”, número que cai dentro do próprio Glossário;
            ele é reproduzido como está impresso.
          </p>
        </Secao>

        <Secao titulo="Escopo do atlas">
          <p>
            Sete sistemas, 42 estruturas, o microcosmo fechado. O cosmo entra apenas como texto e
            como radiação que atinge a cena. Ficam de fora, deliberadamente: os dois campos
            eletromagnéticos como geometria, os doze éons como entidades navegáveis, a Parte III do
            livro, comparações com outras tradições, e qualquer paralelo que o próprio livro não
            faça.
          </p>
        </Secao>

        <Secao titulo="A anatomia">
          <p>
            O corpo desta cena é anatomia de verdade. As malhas vêm de{' '}
            <a
              className="underline"
              href="https://lifesciencedb.jp/bp3d/"
              rel="noreferrer noopener"
              target="_blank"
            >
              BodyParts3D
            </a>{' '}
            4.0, anatomia de referência de um adulto masculino, do Database Center for Life Science
            (DBCLS), licenciada{' '}
            <a
              className="underline"
              href="https://creativecommons.org/licenses/by/4.0/"
              rel="noreferrer noopener"
              target="_blank"
            >
              CC BY 4.0
            </a>
            . Elas chegam aqui pela conversão para navegador publicada em{' '}
            <a
              className="underline"
              href="https://github.com/ashemag/human-atlas"
              rel="noreferrer noopener"
              target="_blank"
            >
              human-atlas
            </a>
            , de Ashe Magalhaes (código MIT), de onde também vem o vocabulário de interação: cena em
            tela cheia, painéis translúcidos, separação por slider, isolamento de estrutura, busca.
          </p>
          <p>
            Daquele corpo inteiro — 2.234 malhas, 15 sistemas — este atlas usa doze estruturas:{' '}
            <strong>só as que o processo espiritual do livro nomeia</strong>. Todo o resto foi
            omitido, e nenhum órgão foi acrescentado por conta própria. As malhas foram unidas por
            conceito anatômico, simplificadas para a web e postas na escala da cena por{' '}
            <code>scripts/construir-anatomia.mjs</code>, que é reexecutável e registra o que fez.
          </p>
          <p>
            O que não é órgão continua sendo geometria gerada por código: as camadas do microcosmo,
            os três santuários, a rosa-do-coração, a cundalini, a medula espinal, os cordões do
            simpático e as correntes de partículas. Nada disso existe como malha porque nada disso é
            objeto de dissecação.
          </p>
          <p>
            Este é um atlas de estudo, não uma ferramenta diagnóstica ou cirúrgica. As dependências
            mantêm suas respectivas licenças.
          </p>
        </Secao>
      </div>
    </PaginaTexto>
  );
}
