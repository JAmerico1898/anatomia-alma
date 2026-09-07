import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaTexto } from '../components/pagina-texto';
import { ESTRUTURA_POR_ID, SENDA, SISTEMA_POR_ID } from '../corpus/corpus';
import { MiniCena } from './mini-cena';

export const metadata: Metadata = {
  title: 'A senda sétupla',
  description:
    'Os sete graus da senda segundo a Segunda Epístola de Pedro, tal como O novo homem os lê, e o que muda corporalmente em cada um.',
};

export default function Senda() {
  return (
    <PaginaTexto
      atual="/senda"
      titulo="A senda sétupla"
      subtitulo="A fé não é um degrau: é a chave que os abre. Os sete graus seguem a ordem da Segunda Epístola de Pedro, e cada um deles corresponde a uma mudança que o livro afirma ser corporal — não apenas mística."
    >
      <MiniCena />
      <ol className="space-y-16 lg:pr-0 xl:max-w-2xl">
        {SENDA.map((d) => (
          <li key={d.grau} id={`grau-${d.grau}`} data-grau={d.grau} className="scroll-mt-24">
            <div className="flex items-baseline gap-3">
              <span className="rotulo tabular-nums text-[var(--color-texto-3)]">
                {d.grau === 0 ? 'chave' : `grau ${d.grau}`}
              </span>
              <h2 className="text-2xl font-semibold text-[var(--color-texto)]">{d.nome}</h2>
            </div>

            <p className="mt-3 leading-relaxed text-[var(--color-texto)]">{d.mudancaCorporal}</p>
            <p className="mt-4 leading-relaxed text-[var(--color-texto-2)]">{d.descricao}</p>

            <div className="mt-6 space-y-4 border-l-2 border-[var(--color-borda)] pl-5">
              {d.citacoes.map((c, i) => (
                <figure key={i}>
                  <blockquote className="serifa leading-relaxed text-[var(--color-texto-2)]">
                    “{c.texto}”
                  </blockquote>
                  <figcaption className="mt-1 text-xs text-[var(--color-texto-3)]">
                    {c.capitulo}, p. {c.pagina}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-6">
              <p className="rotulo text-[var(--color-texto-3)]">
                {d.ativa.length === 0
                  ? 'Nenhuma estrutura muda de estado neste grau'
                  : `${d.ativa.length} estrutura${d.ativa.length > 1 ? 's mudam' : ' muda'} de estado aqui`}
              </p>
              {d.ativa.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {d.ativa.map((id) => {
                    const e = ESTRUTURA_POR_ID.get(id);
                    if (!e) return null;
                    const cor = SISTEMA_POR_ID.get(e.sistema)?.cor;
                    return (
                      <li key={id}>
                        <Link
                          href={`/?modo=senda&grau=${d.grau}&foco=${id}`}
                          className="flex items-center gap-2 rounded-full border border-[var(--color-borda)] px-3 py-1 text-sm text-[var(--color-texto-2)] transition-colors hover:border-[var(--color-rosa)] hover:text-[var(--color-texto)]"
                        >
                          <span
                            aria-hidden
                            className="size-2 rounded-full"
                            style={{ background: cor }}
                          />
                          {e.nome}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </PaginaTexto>
  );
}
