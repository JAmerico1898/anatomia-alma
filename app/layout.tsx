import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import './globals.css';

const serifa = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fonte-serifa',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'Anatomia da Alma',
    template: '%s · Anatomia da Alma',
  },
  description:
    'Atlas interativo do microcosmo segundo O novo homem, de J. van Rijckenborgh. Atlas de estudo — não é prática, terapia nem iniciação.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={serifa.variable}>
      <body className="min-h-full">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--color-fundo-2)] focus:px-3 focus:py-2"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
