'use client';

import { useEffect, useState, type ReactNode } from 'react';

/** Mantém o cartão durante sua saída, sem atrasar o estado ou a URL. */
export function Presenca({ children }: { children: ReactNode }) {
  const [retido, setRetido] = useState(children);
  useEffect(() => {
    if (children) { setRetido(children); return; }
    const prazo = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
    const timer = setTimeout(() => setRetido(null), prazo);
    return () => clearTimeout(timer);
  }, [children]);
  return <div className={children ? 'contents' : 'contents cartao-saindo'} aria-hidden={!children || undefined}>{children || retido}</div>;
}
