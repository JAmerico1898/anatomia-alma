'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ESTRUTURAS,
  ESTRUTURA_POR_ID,
  SENDA,
  SISTEMAS,
  buscarEstruturas,
  estruturasDoSistema,
} from './corpus/corpus';
import type { Grau, SistemaId } from './corpus/tipos';
import { Detalhe } from './detalhe';
import { escreverEstado, lerEstado, legenda, type EstadoUrl } from './estado';
import { Cena, type Vista } from './scene/cena';

const TODOS = SISTEMAS.map((s) => s.id);

const PRESETS: { rotulo: string; sistemas: SistemaId[] }[] = [
  { rotulo: 'Tudo', sistemas: TODOS },
  { rotulo: 'Só a figura', sistemas: ['santuarios', 'focos', 'fogo-i', 'fogo-ii', 'figado-baco'] },
  { rotulo: 'Só as cascas', sistemas: ['cascas'] },
  { rotulo: 'Só as correntes', sistemas: ['correntes'] },
];

const SUGESTOES = [
  'rosa-do-coracao',
  'ser-aural',
  'timo',
  'esterno',
  'baco',
  'pineal',
  'plexo-sacro',
  'cordao-pingala',
];

const VISTAS: { id: Vista; rotulo: string }[] = [
  { id: 'tres-quartos', rotulo: '¾' },
  { id: 'frente', rotulo: 'Frente' },
  { id: 'lado', rotulo: 'Lado' },
  { id: 'costas', rotulo: 'Costas' },
];

export function Explorador() {
  const router = useRouter();
  const params = useSearchParams();
  const estado = useMemo(() => lerEstado(new URLSearchParams(params.toString())), [params]);

  const [vista, setVista] = useState<Vista>('tres-quartos');
  const [rotacao, setRotacao] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [painelAberto, setPainelAberto] = useState(false);
  const [telaLarga, setTelaLarga] = useState(true);
  // Em telas estreitas o Sheet ocupa a metade inferior e cobriria a dock,
  // deixando os controles inalcançáveis. A altura da dock é medida, não
  // chutada, porque ela muda de altura ao quebrar linha.
  const dock = useRef<HTMLDivElement>(null);
  const [alturaDaDock, setAlturaDaDock] = useState(0);

  useEffect(() => {
    const el = dock.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setAlturaDaDock(e!.contentRect.height));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const aplicar = () => setTelaLarga(mq.matches);
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);

  const atualizar = useCallback(
    (mudanca: Partial<EstadoUrl>) => {
      router.replace(escreverEstado({ ...estado, ...mudanca }), { scroll: false });
    },
    [estado, router],
  );

  // Busca com `/`, fechar com Esc.
  useEffect(() => {
    const aoTeclar = (ev: KeyboardEvent) => {
      const emCampo =
        ev.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA'].includes(ev.target.tagName);
      if (ev.key === '/' && !emCampo) {
        ev.preventDefault();
        setBuscaAberta(true);
      }
      if (ev.key === 'Escape') {
        if (buscaAberta) setBuscaAberta(false);
        else if (painelAberto) setPainelAberto(false);
        else if (estado.foco) atualizar({ foco: null, isolar: false });
      }
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [buscaAberta, painelAberto, estado.foco, atualizar]);

  // A apresentação segue o viewport, salvo escolha explícita do usuário.
  const apresentacao = estado.apresentacao ?? (telaLarga ? 'dividida' : 'alternada');
  const dividida = estado.modo === 'duas-naturezas' && apresentacao === 'dividida';

  const degrau = SENDA.find((d) => d.grau === estado.grau)!;
  const foco = estado.foco ? ESTRUTURA_POR_ID.get(estado.foco) : null;
  const textoLegenda = legenda(estado, foco?.nome ?? null, degrau.nome);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[var(--color-fundo)]">
      <div
        role="img"
        aria-label={`Microcosmo em três dimensões. ${textoLegenda}. ${
          foco ? `Estrutura selecionada: ${foco.nome}.` : 'Nenhuma estrutura selecionada.'
        } Use o painel Sistemas ou a busca para navegar sem a cena.`}
        className="absolute inset-0"
      >
        <Cena
          grau={estado.modo === 'senda' ? estado.grau : 0}
          sistemas={estado.sistemas}
          separar={estado.separar}
          foco={estado.foco}
          isolar={estado.isolar}
          dividida={dividida}
          natureza={estado.modo === 'duas-naturezas' ? estado.natureza : null}
          vista={vista}
          rotacaoAutomatica={rotacao}
          onSelecionar={(id) => atualizar({ foco: id, isolar: id ? estado.isolar : false })}
        />
      </div>

      {dividida ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 flex w-px -translate-x-px justify-center bg-[var(--color-borda)]"
        >
          <span className="rotulo absolute top-20 right-3 text-[var(--color-texto-3)]">
            dialético
          </span>
          <span className="rotulo absolute top-20 left-3 text-[var(--color-rosa)]">novo homem</span>
        </div>
      ) : null}

      {/* ── Cabeçalho */}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <div className="vidro pointer-events-auto rounded-lg px-4 py-2.5">
          <p className="text-sm font-semibold">Anatomia da Alma</p>
          <nav aria-label="Seções" className="mt-1 flex gap-3 text-xs">
            <Link className="text-[var(--color-texto-3)] hover:text-[var(--color-texto)]" href="/senda">
              A senda
            </Link>
            <Link className="text-[var(--color-texto-3)] hover:text-[var(--color-texto)]" href="/glossario">
              Glossário
            </Link>
            <Link className="text-[var(--color-texto-3)] hover:text-[var(--color-texto)]" href="/fontes">
              Fontes
            </Link>
          </nav>
        </div>

        <button
          onClick={() => setBuscaAberta(true)}
          className="vidro pointer-events-auto flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm text-[var(--color-texto-3)] transition-colors hover:text-[var(--color-texto)]"
        >
          Buscar estrutura
          <kbd className="rounded border border-[var(--color-borda)] px-1.5 py-0.5 text-xs">/</kbd>
        </button>
      </header>

      {/* ── Painel Sistemas */}
      <div
        className={`absolute bottom-0 left-0 top-0 z-20 flex w-72 max-w-[85vw] flex-col p-4 pt-24 transition-transform lg:translate-x-0 ${
          painelAberto ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        <PainelSistemas
          sistemas={estado.sistemas}
          foco={estado.foco}
          onSistemas={(s) => atualizar({ sistemas: s })}
          onFoco={(id) => atualizar({ foco: id, isolar: false })}
        />
      </div>

      {/* ── Dock */}
      <div
        ref={dock}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 p-4"
      >
        <p className="rotulo text-center text-[var(--color-texto-3)]">{textoLegenda}</p>

        <div className="vidro pointer-events-auto flex w-full max-w-3xl flex-wrap items-center gap-x-5 gap-y-3 rounded-xl px-4 py-3">
          <button
            onClick={() => setPainelAberto((v) => !v)}
            aria-expanded={painelAberto}
            className="min-h-11 rounded-lg border border-[var(--color-borda)] px-3 text-sm text-[var(--color-texto-2)] lg:hidden"
          >
            Sistemas
          </button>

          <div className="flex min-w-0 grow items-center gap-3">
            {estado.modo === 'senda' ? (
              <>
                <label htmlFor="grau" className="rotulo shrink-0 text-[var(--color-texto-3)]">
                  Senda
                </label>
                <input
                  id="grau"
                  type="range"
                  min={0}
                  max={7}
                  step={1}
                  value={estado.grau}
                  onChange={(ev) => atualizar({ grau: Number(ev.target.value) as Grau })}
                  className="min-w-32 grow accent-[var(--color-rosa)]"
                />
                <span className="w-36 shrink-0 text-sm text-[var(--color-texto-2)]">
                  {estado.grau === 0 ? 'chave' : `grau ${estado.grau}`} · {degrau.nome}
                </span>
              </>
            ) : (
              <>
                <span className="rotulo shrink-0 text-[var(--color-texto-3)]">Apresentação</span>
                <div className="flex gap-1">
                  {(['dividida', 'alternada'] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => atualizar({ apresentacao: a })}
                      aria-pressed={apresentacao === a}
                      className={`min-h-11 rounded-lg px-3 text-sm ${
                        apresentacao === a
                          ? 'bg-[var(--color-rosa)]/15 text-[var(--color-rosa)]'
                          : 'text-[var(--color-texto-3)]'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                {apresentacao === 'alternada' ? (
                  <button
                    onClick={() =>
                      atualizar({ natureza: estado.natureza === 'novo' ? 'dialetico' : 'novo' })
                    }
                    className="min-h-11 rounded-lg border border-[var(--color-borda)] px-3 text-sm"
                  >
                    {estado.natureza === 'novo' ? 'novo homem' : 'dialético'} ⇄
                  </button>
                ) : null}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="separar" className="rotulo shrink-0 text-[var(--color-texto-3)]">
              Separar
            </label>
            <input
              id="separar"
              type="range"
              min={0}
              max={100}
              value={Math.round(estado.separar * 100)}
              onChange={(ev) => atualizar({ separar: Number(ev.target.value) / 100 })}
              className="w-24 accent-[var(--color-rosa)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {VISTAS.map((v) => (
              <button
                key={v.id}
                onClick={() => setVista(v.id)}
                aria-pressed={vista === v.id}
                disabled={estado.separar >= 0.8 && v.id === 'tres-quartos'}
                className={`min-h-11 rounded-lg px-2.5 text-sm disabled:opacity-30 ${
                  vista === v.id ? 'text-[var(--color-rosa)]' : 'text-[var(--color-texto-3)]'
                }`}
              >
                {v.rotulo}
              </button>
            ))}
            <button
              onClick={() => setRotacao((r) => !r)}
              aria-pressed={rotacao}
              disabled={estado.separar >= 0.8}
              className={`min-h-11 rounded-lg px-2.5 text-sm disabled:opacity-30 ${
                rotacao ? 'text-[var(--color-rosa)]' : 'text-[var(--color-texto-3)]'
              }`}
            >
              ↻
            </button>
          </div>

          <button
            onClick={() =>
              atualizar({
                modo: estado.modo === 'senda' ? 'duas-naturezas' : 'senda',
              })
            }
            className="min-h-11 rounded-lg border border-[var(--color-borda)] px-3 text-sm text-[var(--color-texto-2)]"
          >
            {estado.modo === 'senda' ? 'Duas naturezas' : 'Senda'}
          </button>
        </div>
      </div>

      {/* ── Sheet de detalhe */}
      {estado.foco ? (
        <div
          style={telaLarga ? undefined : { bottom: alturaDaDock }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex max-h-[45dvh] justify-end p-0 lg:inset-y-0 lg:bottom-auto lg:max-h-none lg:p-4 lg:pb-32 lg:pt-24">
          <Detalhe
            id={estado.foco}
            isolando={estado.isolar}
            onIsolar={(v) => atualizar({ isolar: v })}
            onIrPara={(id) => atualizar({ foco: id })}
            onFechar={() => atualizar({ foco: null, isolar: false })}
          />
        </div>
      ) : null}

      {buscaAberta ? (
        <Busca
          onEscolher={(id) => {
            atualizar({ foco: id });
            setBuscaAberta(false);
          }}
          onFechar={() => setBuscaAberta(false)}
        />
      ) : null}
    </div>
  );
}

function PainelSistemas({
  sistemas,
  foco,
  onSistemas,
  onFoco,
}: {
  sistemas: readonly SistemaId[];
  foco: string | null;
  onSistemas: (s: SistemaId[]) => void;
  onFoco: (id: string) => void;
}) {
  const ligados = new Set(sistemas);
  return (
    <nav
      aria-label="Sistemas"
      className="vidro pointer-events-auto flex min-h-0 flex-col rounded-xl"
    >
      <div className="flex flex-wrap gap-1 border-b border-[var(--color-borda)] p-3">
        {PRESETS.map((p) => (
          <button
            key={p.rotulo}
            onClick={() => onSistemas(p.sistemas)}
            className="rounded-full border border-[var(--color-borda)] px-2.5 py-1 text-xs text-[var(--color-texto-3)] transition-colors hover:text-[var(--color-texto)]"
          >
            {p.rotulo}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {SISTEMAS.map((s) => {
          const estruturas = estruturasDoSistema(s.id);
          const ligado = ligados.has(s.id);
          return (
            <div key={s.id} className="px-1 py-1.5">
              <div className="flex items-center gap-2">
                <input
                  id={`sw-${s.id}`}
                  type="checkbox"
                  checked={ligado}
                  onChange={(ev) =>
                    onSistemas(
                      ev.target.checked
                        ? [...sistemas, s.id]
                        : sistemas.filter((x) => x !== s.id),
                    )
                  }
                  className="size-4 accent-[var(--color-rosa)]"
                />
                <button
                  onClick={() => onSistemas([s.id])}
                  title={`Isolar ${s.nome}`}
                  className="flex min-w-0 items-center gap-2 text-left text-sm"
                >
                  <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: s.cor }} />
                  <span className={ligado ? '' : 'text-[var(--color-texto-3)]'}>{s.nome}</span>
                  <span className="shrink-0 text-xs text-[var(--color-texto-3)]">
                    {estruturas.length}
                  </span>
                </button>
                <label htmlFor={`sw-${s.id}`} className="sr-only">
                  Mostrar {s.nome}
                </label>
              </div>

              {ligado ? (
                <ul className="mt-1 ml-6 space-y-0.5">
                  {estruturas.map((e) => (
                    <li key={e.id}>
                      <button
                        onClick={() => onFoco(e.id)}
                        aria-current={foco === e.id ? 'true' : undefined}
                        className={`w-full rounded px-1.5 py-1 text-left text-sm transition-colors ${
                          foco === e.id
                            ? 'bg-[var(--color-rosa)]/10 text-[var(--color-rosa)]'
                            : 'text-[var(--color-texto-2)] hover:text-[var(--color-texto)]'
                        }`}
                      >
                        {e.nome}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="border-t border-[var(--color-borda)] px-3 py-2 text-xs text-[var(--color-texto-3)]">
        {ESTRUTURAS.length} estruturas · todas alcançáveis por aqui
      </p>
    </nav>
  );
}

function Busca({
  onEscolher,
  onFechar,
}: {
  onEscolher: (id: string) => void;
  onFechar: () => void;
}) {
  const [consulta, setConsulta] = useState('');
  const achados = consulta.trim()
    ? buscarEstruturas(consulta).slice(0, 10)
    : SUGESTOES.map((id) => ESTRUTURA_POR_ID.get(id)!).filter(Boolean);

  return (
    <div
      className="absolute inset-0 z-40 flex items-start justify-center bg-black/50 p-4 pt-24"
      onClick={onFechar}
    >
      <div
        role="dialog"
        aria-label="Buscar estrutura"
        className="vidro w-full max-w-lg overflow-hidden rounded-xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <input
          autoFocus
          type="search"
          value={consulta}
          onChange={(ev) => setConsulta(ev.target.value)}
          placeholder="nome, sinônimo ou termo do Glossário…"
          className="w-full border-b border-[var(--color-borda)] bg-transparent px-4 py-3.5 text-lg outline-none placeholder:text-[var(--color-texto-3)]"
        />
        <ul className="max-h-80 overflow-y-auto p-2">
          {achados.length === 0 ? (
            <li className="px-3 py-3 text-sm text-[var(--color-texto-3)]">Nada encontrado.</li>
          ) : (
            achados.map((e) => (
              <li key={e.id}>
                <button
                  onClick={() => onEscolher(e.id)}
                  className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-sm">{e.nome}</span>
                  {e.sinonimos.length > 0 ? (
                    <span className="ml-2 text-xs italic text-[var(--color-texto-3)]">
                      {e.sinonimos[0]}
                    </span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
