'use client';

import Link from 'next/link';
import {
  ESTRUTURA_POR_ID,
  SENDA,
  SISTEMA_POR_ID,
  VERBETE_POR_SLUG,
} from './corpus/corpus';

/**
 * Sheet de detalhe (§7.4). Ordem fixa: sistema → nome → sinônimos → descrição →
 * estados lado a lado → grau de ativação → citações → ligações → verbetes.
 */
export function Detalhe({
  id,
  isolando,
  onIsolar,
  onIrPara,
  onFechar,
}: {
  id: string;
  isolando: boolean;
  onIsolar: (v: boolean) => void;
  onIrPara: (id: string) => void;
  onFechar: () => void;
}) {
  const e = ESTRUTURA_POR_ID.get(id);
  if (!e) return null;
  const sistema = SISTEMA_POR_ID.get(e.sistema);
  const degrau = SENDA.find((d) => d.grau === e.grauDeAtivacao);

  return (
    <aside
      role="dialog"
      aria-label={`Detalhe: ${e.nome}`}
      className="vidro pointer-events-auto flex max-h-full w-full flex-col overflow-hidden rounded-t-lg lg:max-w-xs lg:rounded-lg lg:max-h-[calc(100dvh-11rem)]"
    >
      <header className="flex items-start justify-between gap-3 border-b border-[var(--color-borda)] px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="size-2 rounded-full" style={{ background: sistema?.cor }} />
            <span className="rotulo text-[var(--color-texto-3)]">{sistema?.nome}</span>
          </div>
          <h2 className="mt-1 text-lg font-semibold leading-tight">{e.nome}</h2>
          {e.sinonimos.length > 0 ? (
            <p className="mt-0.5 text-xs italic text-[var(--color-texto-3)]">
              {e.sinonimos.join(' · ')}
            </p>
          ) : null}
        </div>
        <button
          onClick={onFechar}
          aria-label="Fechar detalhe"
          className="shrink-0 rounded p-1 text-[var(--color-texto-3)] transition-colors hover:text-[var(--color-texto)]"
        >
          ✕
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <p className="text-sm leading-relaxed text-[var(--color-texto-2)]">{e.descricao}</p>

        <div className="mt-4 grid gap-2">
          <div className="rounded-md border border-[var(--color-borda)] p-2.5">
            <p className="rotulo text-[var(--color-texto-3)]">Homem dialético</p>
            <p className="mt-1 text-xs leading-relaxed">{e.estadoDialetico}</p>
          </div>
          <div className="rounded-md border border-[var(--color-rosa)]/30 bg-[var(--color-rosa)]/[0.04] p-2.5">
            <p className="rotulo text-[var(--color-rosa)]">Novo homem</p>
            <p className="mt-1 text-xs leading-relaxed">{e.estadoNovo}</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-[var(--color-texto-2)]">
          {e.grauDeAtivacao === null ? (
            <span className="text-[var(--color-texto-3)]">
              Não muda de estado em grau nenhum da senda.
            </span>
          ) : (
            <>
              Muda no{' '}
              <Link
                href={`/senda#grau-${e.grauDeAtivacao}`}
                className="text-[var(--color-rosa)] underline underline-offset-2"
              >
                grau {e.grauDeAtivacao} · {degrau?.nome}
              </Link>
              .
            </>
          )}
        </p>

        <section className="mt-4">
          <h3 className="rotulo text-[var(--color-texto-3)]">No livro</h3>
          <div className="mt-2 space-y-3">
            {e.citacoes.map((c, i) => (
              <figure key={i} className="border-l-2 border-[var(--color-borda)] pl-3">
                <blockquote className="serifa text-xs leading-relaxed text-[var(--color-texto-2)]">
                  “{c.texto}”
                </blockquote>
                <figcaption className="mt-1 text-[11px] text-[var(--color-texto-3)]">
                  {c.capitulo}, p. {c.pagina}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {e.ligacoes.length > 0 ? (
          <section className="mt-4">
            <h3 className="rotulo text-[var(--color-texto-3)]">Liga-se a</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {e.ligacoes.map((outro) => {
                const o = ESTRUTURA_POR_ID.get(outro);
                if (!o) return null;
                return (
                  <li key={outro}>
                    <button
                      onClick={() => onIrPara(outro)}
                      className="flex items-center gap-1.5 rounded-full border border-[var(--color-borda)] px-2.5 py-0.5 text-xs text-[var(--color-texto-2)] transition-colors hover:border-[var(--color-rosa)] hover:text-[var(--color-texto)]"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full"
                        style={{ background: SISTEMA_POR_ID.get(o.sistema)?.cor }}
                      />
                      {o.nome}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {e.verbetes.length > 0 ? (
          <section className="mt-4 pb-1">
            <h3 className="rotulo text-[var(--color-texto-3)]">No Glossário</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {e.verbetes.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/glossario#${slug}`}
                    className="serifa rounded-full border border-[var(--color-borda)] px-2.5 py-0.5 text-xs text-[var(--color-texto-2)] transition-colors hover:border-[var(--color-rosa)] hover:text-[var(--color-texto)]"
                  >
                    {VERBETE_POR_SLUG.get(slug)?.termo ?? slug}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <footer className="border-t border-[var(--color-borda)] px-4 py-2">
        <button
          onClick={() => onIsolar(!isolando)}
          aria-pressed={isolando}
          className={`w-full rounded-md border px-3 py-1.5 text-xs transition-colors ${
            isolando
              ? 'border-[var(--color-rosa)] bg-[var(--color-rosa)]/10 text-[var(--color-rosa)]'
              : 'border-[var(--color-borda)] text-[var(--color-texto-2)] hover:text-[var(--color-texto)]'
          }`}
        >
          {isolando ? 'Mostrar tudo' : 'Isolar estrutura'}
        </button>
      </footer>
    </aside>
  );
}
