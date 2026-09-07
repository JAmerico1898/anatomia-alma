// Auditoria da Fase 6: desempenho sob 4G simulado, acessibilidade (axe) e o
// caminho de `prefers-reduced-motion`. Não é um teste de contrato — é a
// evidência que o §10 pede para fechar a fase.
//
//   node scripts/auditar.mjs [http://127.0.0.1:3000]
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000';
const ROTAS = ['/', '/senda', '/glossario', '/fontes'];

// 4G regular: ~9 Mbps de descida, 1.5 Mbps de subida, 85 ms de latência.
const REDE_4G = {
  offline: false,
  downloadThroughput: (9 * 1024 * 1024) / 8,
  uploadThroughput: (1.5 * 1024 * 1024) / 8,
  latency: 85,
};

const navegador = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

let falhas = 0;

// ── Desempenho: carregar em menos de 3 s sob 4G simulado.
console.log('desempenho (4G simulado, cache frio)');
for (const rota of ROTAS) {
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await contexto.newPage();
  const cdp = await contexto.newCDPSession(pagina);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', REDE_4G);

  const inicio = Date.now();
  await pagina.goto(BASE + rota, { waitUntil: 'load' });
  const carregou = Date.now() - inicio;

  // Em `/`, o que importa é quando a cena aparece, não só o `load`.
  let pronto = carregou;
  if (rota === '/') {
    await pagina.locator('canvas').waitFor({ state: 'visible', timeout: 20_000 });
    pronto = Date.now() - inicio;
  }

  const ok = pronto < 3000;
  if (!ok) falhas++;
  console.log(`  ${ok ? '✓' : '✗'} ${rota.padEnd(11)} ${pronto} ms`);
  await contexto.close();
}

// ── Acessibilidade
console.log('\nacessibilidade (axe-core, wcag2a + wcag2aa)');
for (const rota of ROTAS) {
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE + rota, { waitUntil: 'load' });
  if (rota === '/') await pagina.locator('canvas').waitFor({ state: 'visible' });

  const r = await new AxeBuilder({ page: pagina })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const graves = r.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  if (graves.length > 0) falhas++;
  console.log(`  ${graves.length === 0 ? '✓' : '✗'} ${rota.padEnd(11)} ${graves.length} violação(ões) grave(s)`);
  for (const v of graves) {
    console.log(`      ${v.id} (${v.impact}) — ${v.nodes.length}×: ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) console.log(`        ${n.target.join(' ')}`);
  }
  await contexto.close();
}

// ── prefers-reduced-motion: a cena tem de montar e ficar parada.
console.log('\nprefers-reduced-motion: reduce');
{
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE + '/', { waitUntil: 'load' });
  await pagina.locator('canvas').waitFor({ state: 'visible' });

  // Duas amostras separadas: sem animação, a cena renderizada é idêntica.
  const amostra = () => pagina.locator('canvas').screenshot();
  const a = await amostra();
  await pagina.waitForTimeout(1200);
  const b = await amostra();
  const parada = Buffer.compare(a, b) === 0;
  if (!parada) falhas++;
  console.log(`  ${parada ? '✓' : '✗'} cena estática com movimento reduzido`);
  await contexto.close();
}

await navegador.close();

if (falhas > 0) {
  console.error(`\n✗ auditoria: ${falhas} critério(s) reprovado(s)`);
  process.exit(1);
}
console.log('\n✓ auditoria: desempenho, acessibilidade e movimento reduzido aprovados');
