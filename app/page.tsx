import type { Metadata } from 'next';
import Link from 'next/link';
import { ESTRUTURAS, SISTEMAS, estruturasDoSistema } from './corpus/corpus';

export const metadata: Metadata = {
  title: 'Anatomia da Alma — atlas do microcosmo',
  description:
    'Orbite o microcosmo, toque uma estrutura e leia o que O novo homem diz dela, em qual capítulo e página.',
};

/**
 * Fase 1: o inventário completo, sem 3D. Esta lista é também a rota de teclado
 * exigida pelo §8.4 — toda estrutura alcançável sem a cena — e permanece na
 * Fase 2 como o painel `Sistemas`.
 */
export default function Explorador() {
  return (
    <div className="min-h-dvh bg-[var(--color-fundo)]">
      <header className="border-b border-[var(--color-borda)]">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <h1 className="text-4xl font-semibold tracking-tight">Anatomia da Alma</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-texto-2)]">
            Atlas do microcosmo segundo <em>O novo homem</em>, de J. van Rijckenborgh. Sete
            sistemas, {ESTRUTURAS.length} estruturas, e o que acontece com cada uma quando o
            candidato galga a senda sétupla.
          </p>
          <nav aria-label="Seções" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link className="text-[var(--color-rosa)]" href="/senda">
              A senda sétupla →
            </Link>
            <Link className="text-[var(--color-texto-3)] hover:text-[var(--color-texto)]" href="/glossario">
              Glossário
            </Link>
            <Link className="text-[var(--color-texto-3)] hover:text-[var(--color-texto)]" href="/fontes">
              Fontes e limites
            </Link>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="mx-auto max-w-5xl px-5 py-12">
        <div className="space-y-12">
          {SISTEMAS.map((s) => {
            const estruturas = estruturasDoSistema(s.id);
            return (
              <section key={s.id} aria-labelledby={`sistema-${s.id}`}>
                <div className="flex items-baseline gap-3">
                  <span aria-hidden className="size-3 rounded-full" style={{ background: s.cor }} />
                  <h2 id={`sistema-${s.id}`} className="text-xl font-semibold">
                    {s.nome}
                  </h2>
                  <span className="rotulo text-[var(--color-texto-3)]">
                    {estruturas.length} · raio {s.raio}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-texto-2)]">
                  {s.descricao}
                </p>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {estruturas.map((e) => (
                    <li key={e.id}>
                      <Link
                        href={`/?foco=${e.id}`}
                        className="vidro block h-full rounded-lg p-4 transition-colors hover:border-[var(--color-rosa)]"
                      >
                        <span className="font-medium text-[var(--color-texto)]">{e.nome}</span>
                        {e.grauDeAtivacao !== null ? (
                          <span className="rotulo ml-2 text-[var(--color-texto-3)]">
                            grau {e.grauDeAtivacao}
                          </span>
                        ) : (
                          <span className="rotulo ml-2 text-[var(--color-texto-3)]">não muda</span>
                        )}
                        <span className="mt-2 block text-sm leading-relaxed text-[var(--color-texto-2)]">
                          {e.estadoDialetico}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
