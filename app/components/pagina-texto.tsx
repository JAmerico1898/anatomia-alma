import Link from 'next/link';

const ROTAS = [
  { href: '/', rotulo: 'Explorador' },
  { href: '/senda', rotulo: 'A senda sétupla' },
  { href: '/glossario', rotulo: 'Glossário' },
  { href: '/fontes', rotulo: 'Fontes' },
] as const;

/** Moldura comum de /senda, /glossario e /fontes. O explorador tem sua dock. */
export function PaginaTexto({
  atual,
  titulo,
  subtitulo,
  children,
  largura = 'prosa',
}: {
  atual: string;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  largura?: 'prosa' | 'larga';
}) {
  return (
    <div className="min-h-dvh bg-[var(--color-fundo)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-borda)] bg-[color-mix(in_oklab,var(--color-fundo)_88%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-3 px-5 py-3">
          <Link href="/" className="text-sm font-semibold text-[var(--color-texto)]">
            Anatomia da Alma
          </Link>
          <nav aria-label="Seções" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {ROTAS.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                aria-current={r.href === atual ? 'page' : undefined}
                className={
                  r.href === atual
                    ? 'text-[var(--color-rosa)]'
                    : 'text-[var(--color-texto-3)] transition-colors hover:text-[var(--color-texto)]'
                }
              >
                {r.rotulo}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main
        id="conteudo"
        className={`mx-auto px-5 pb-28 pt-10 ${largura === 'larga' ? 'max-w-5xl' : 'max-w-2xl'}`}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-texto)]">{titulo}</h1>
        {subtitulo ? (
          <p className="mt-3 text-[var(--color-texto-2)] leading-relaxed">{subtitulo}</p>
        ) : null}
        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
}
