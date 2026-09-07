'use client';

import { useEffect, useState } from 'react';
import { SENDA, SISTEMAS } from '../corpus/corpus';
import type { Grau } from '../corpus/tipos';
import { Cena } from '../scene/cena';

const TODOS = SISTEMAS.map((s) => s.id);

/**
 * Miniatura sincronizada com a seção visível de `/senda`.
 *
 * Só monta a partir de 1024px: abaixo disso ela roubaria metade da tela do
 * texto, que é o conteúdo da página, para abrir um segundo contexto WebGL num
 * aparelho que já está renderizando o explorador quando o leitor volta.
 */
export function MiniCena() {
  const [grau, setGrau] = useState<Grau>(0);
  const [montar, setMontar] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const aplicar = () => setMontar(mq.matches);
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);

  useEffect(() => {
    if (!montar) return;
    const secoes = [...document.querySelectorAll<HTMLElement>('[data-grau]')];
    if (secoes.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        // A seção mais visível manda; empate resolvido pela que está mais acima.
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setGrau(Number(visivel.target.getAttribute('data-grau')) as Grau);
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    for (const s of secoes) observador.observe(s);
    return () => observador.disconnect();
  }, [montar]);

  if (!montar) return null;

  const degrau = SENDA.find((d) => d.grau === grau)!;

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-10 hidden h-64 w-64 -translate-y-1/2 overflow-hidden rounded-xl border border-[var(--color-borda)] lg:block xl:h-80 xl:w-80"
    >
      <div className="relative size-full">
        <Cena
          grau={grau}
          sistemas={TODOS}
          separar={0}
          foco={null}
          isolar={false}
          dividida={false}
          natureza={null}
          vista="tres-quartos"
          rotacaoAutomatica
          onSelecionar={() => {}}
        />
      </div>
      <p className="rotulo absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-fundo)] to-transparent px-3 pb-2 pt-6 text-center text-[var(--color-texto-3)]">
        {grau === 0 ? 'chave' : `grau ${grau}`} · {degrau.nome}
      </p>
    </aside>
  );
}
