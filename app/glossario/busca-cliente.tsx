'use client';

import { useMemo, useState } from 'react';
import { normalizarBusca } from '../corpus/corpus';

/** Busca por prefixo sobre os termos do Glossário (§9 do spec). */
export function BuscaGlossario({
  verbetes,
}: {
  verbetes: readonly { slug: string; termo: string }[];
}) {
  const [consulta, setConsulta] = useState('');

  const achados = useMemo(() => {
    const q = normalizarBusca(consulta);
    if (!q) return [];
    return verbetes.filter((v) => normalizarBusca(v.termo).startsWith(q)).slice(0, 12);
  }, [consulta, verbetes]);

  return (
    <div className="vidro rounded-lg p-4">
      <label htmlFor="busca-glossario" className="rotulo block text-[var(--color-texto-3)]">
        Buscar termo
      </label>
      <input
        id="busca-glossario"
        type="search"
        autoComplete="off"
        value={consulta}
        onChange={(e) => setConsulta(e.target.value)}
        placeholder="rosa, ser aural, simpático…"
        className="mt-2 w-full bg-transparent text-lg text-[var(--color-texto)] outline-none placeholder:text-[var(--color-texto-3)]"
      />
      {consulta.trim() ? (
        <ul className="mt-3 flex flex-wrap gap-2" aria-live="polite">
          {achados.length === 0 ? (
            <li className="text-sm text-[var(--color-texto-3)]">Nenhum verbete começa por isso.</li>
          ) : (
            achados.map((v) => (
              <li key={v.slug}>
                <a
                  href={`#${v.slug}`}
                  className="rounded-full border border-[var(--color-borda)] px-3 py-1 text-sm text-[var(--color-texto-2)] transition-colors hover:border-[var(--color-rosa)] hover:text-[var(--color-texto)]"
                >
                  {v.termo}
                </a>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
