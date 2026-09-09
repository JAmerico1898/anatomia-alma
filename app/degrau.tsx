'use client';

import Link from 'next/link';
import { ESTRUTURA_POR_ID, SISTEMA_POR_ID } from './corpus/corpus';
import type { DegrauDaSenda } from './corpus/tipos';

/**
 * O card do degrau corrente, no mesmo lugar do detalhe de estrutura (§7.4).
 *
 * É ele que explica o que está acontecendo na figura enquanto o usuário avança
 * passo a passo: sem isto, o slider mudava a cena sem dizer por quê. Cede o
 * lugar ao `Detalhe` quando uma estrutura é selecionada, e volta ao fechá-lo.
 */
export function CartaoDoDegrau({
  degrau,
  onIrPara,
}: {
  degrau: DegrauDaSenda;
  onIrPara: (id: string) => void;
}) {
  const natural = degrau.grau === -1;
  const chave = degrau.grau === 0;

  return (
    <aside data-ocupa="painel"
      aria-label={`Degrau da senda: ${degrau.nome}`}
      className="cartao-atlas vidro pointer-events-auto flex max-h-full w-full flex-col overflow-hidden rounded-t-lg lg:max-w-sm lg:rounded-lg lg:max-h-[calc(100dvh-11rem)]"
    >
      <header className="shrink-0 border-b border-[var(--color-borda)] px-4 py-3">
        <span className="rotulo text-[var(--color-rosa)]">
          {natural ? 'Antes da senda' : chave ? 'A chave · primeira ruptura' : `Grau ${degrau.grau} de 7`}
        </span>
        <h2 className="mt-1 text-lg font-semibold leading-tight">{degrau.nome}</h2>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-texto-2)]">
          {degrau.mudancaCorporal}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <p className="text-sm leading-relaxed text-[var(--color-texto-2)]">{degrau.descricao}</p>

        <section className="mt-4">
          <h3 className="rotulo text-[var(--color-texto-3)]">No livro</h3>
          <div className="mt-2 space-y-3">
            {degrau.citacoes.map((c, i) => (
              <figure key={i} className="border-l-2 border-[var(--color-borda)] pl-3">
                <blockquote className="serifa text-sm leading-relaxed text-[var(--color-texto-2)]">
                  “{c.texto}”
                </blockquote>
                <figcaption className="mt-1 text-[11px] text-[var(--color-texto-3)]">
                  {c.capitulo}, p. {c.pagina}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {degrau.inicia.length > 0 ? (
          <section className="mt-4 pb-1">
            <h3 className="rotulo text-[var(--color-texto-3)]">
              {chave ? 'Processos que se iniciam' : 'Começa neste estado'}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {degrau.inicia.map((id) => {
                const e = ESTRUTURA_POR_ID.get(id);
                if (!e) return null;
                return (
                  <li key={id}>
                    <button
                      onClick={() => onIrPara(id)}
                      className="flex items-center gap-1.5 rounded-full border border-[var(--color-borda)] px-2.5 py-0.5 text-sm text-[var(--color-texto-2)] transition-colors hover:border-[var(--color-rosa)] hover:text-[var(--color-texto)]"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full"
                        style={{ background: SISTEMA_POR_ID.get(e.sistema)?.cor }}
                      />
                      {e.nome}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>

      <footer className="shrink-0 border-t border-[var(--color-borda)] px-4 py-2">
        <Link
          href={`/senda#grau-${degrau.grau}`}
          className="text-sm text-[var(--color-rosa)] underline underline-offset-2"
        >
          Ler o degrau inteiro em A senda
        </Link>
      </footer>
    </aside>
  );
}
