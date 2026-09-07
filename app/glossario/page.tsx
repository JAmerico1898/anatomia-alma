import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaTexto } from '../components/pagina-texto';
import { ESTRUTURA_POR_ID, VERBETES } from '../corpus/corpus';
import { BuscaGlossario } from './busca-cliente';

export const metadata: Metadata = {
  title: 'Glossário',
  description:
    'Os 68 verbetes do Glossário de O novo homem (pp. 363–378), reproduzidos verbatim, com link cruzado para as estruturas do atlas.',
};

export default function Glossario() {
  return (
    <PaginaTexto
      atual="/glossario"
      titulo="Glossário"
      subtitulo="Os 68 verbetes das páginas 363–378 de O novo homem, reproduzidos integralmente. O número ao lado de cada termo é a página em que ele é mencionado pela primeira vez, tal como o livro a registra."
    >
      <BuscaGlossario
        verbetes={VERBETES.map((v) => ({ slug: v.slug, termo: v.termo }))}
      />

      <dl className="mt-10 space-y-9">
        {VERBETES.map((v) => (
          <div key={v.slug} id={v.slug} className="scroll-mt-24">
            <dt className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-lg font-semibold text-[var(--color-texto)]">{v.termo}</span>
              <span className="text-xs tabular-nums text-[var(--color-texto-3)]">
                p. {v.paginaPrimeiraMencao}
              </span>
            </dt>
            <dd className="serifa mt-2 leading-relaxed text-[var(--color-texto-2)]">
              {v.definicao}
            </dd>
            {v.estruturas.length > 0 ? (
              <dd className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rotulo text-[var(--color-texto-3)]">No atlas</span>
                {v.estruturas.map((id) => {
                  const e = ESTRUTURA_POR_ID.get(id);
                  if (!e) return null;
                  return (
                    <Link
                      key={id}
                      href={`/?foco=${id}`}
                      className="rounded-full border border-[var(--color-borda)] px-3 py-1 text-xs text-[var(--color-texto-2)] transition-colors hover:border-[var(--color-rosa)] hover:text-[var(--color-texto)]"
                    >
                      {e.nome}
                    </Link>
                  );
                })}
              </dd>
            ) : null}
          </div>
        ))}
      </dl>
    </PaginaTexto>
  );
}
