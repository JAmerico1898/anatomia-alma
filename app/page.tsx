import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ESTRUTURAS, SISTEMAS, estruturasDoSistema } from './corpus/corpus';
import { Explorador } from './explorador';

export const metadata: Metadata = {
  title: 'Anatomia da Alma — atlas do microcosmo',
  description:
    'Orbite o microcosmo, toque uma estrutura e leia o que O novo homem diz dela, em qual capítulo e página.',
};

export default function Pagina() {
  return (
    <>
      <Suspense fallback={<Carregando />}>
        <Explorador />
      </Suspense>
      {/* Sem JavaScript, o inventário completo continua legível e navegável. */}
      <noscript>
        <div className="mx-auto max-w-3xl px-5 py-12">
          <h1 className="text-3xl font-semibold">Anatomia da Alma</h1>
          <p className="mt-3 text-[var(--color-texto-2)]">
            A cena tridimensional precisa de JavaScript. O inventário das {ESTRUTURAS.length}{' '}
            estruturas, a senda e o Glossário continuam disponíveis.
          </p>
          {SISTEMAS.map((s) => (
            <section key={s.id} className="mt-8">
              <h2 className="font-semibold">{s.nome}</h2>
              <ul className="mt-2 list-disc pl-5 text-[var(--color-texto-2)]">
                {estruturasDoSistema(s.id).map((e) => (
                  <li key={e.id}>
                    {e.nome} — {e.estadoDialetico}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </noscript>
    </>
  );
}

function Carregando() {
  return (
    <div className="flex h-dvh items-center justify-center bg-[var(--color-fundo)]">
      <p className="rotulo text-[var(--color-texto-3)]">Montando o microcosmo…</p>
    </div>
  );
}
