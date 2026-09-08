import { expect, test, type Page } from '@playwright/test';

/**
 * Os cinco contratos do §11 — os que quebram em silêncio. Nada de comparação
 * de pixels: shaders e partículas tornam capturas instáveis, e congelar relógio
 * e semente para estabilizá-las é trabalho a serviço de um teste que ninguém
 * pediu.
 */

const detalhe = (p: Page) => p.getByRole('dialog', { name: /^Detalhe:/ });
const degrau = (p: Page) => p.getByRole('complementary', { name: /^Degrau da senda:/ });

// O card do degrau só existe a partir de 1024px: abaixo disso ele cobriria a
// figura que está explicando. Os contratos que o medem são, portanto, de tela
// larga — o avanço em si, pela dock, é o mesmo em toda largura.
const soEmTelaLarga = (p: Page) =>
  test.skip((p.viewportSize()?.width ?? 0) < 1024, 'card do degrau é de tela larga');

async function abrirExplorador(p: Page, query = '') {
  await p.goto(`/${query}`);
  // A cena monta o canvas assim que o cliente hidrata.
  await expect(p.locator('canvas')).toBeVisible();
}

test('1 · selecionar uma estrutura na cena abre o Sheet com o nome certo', async ({ page }) => {
  // Um sistema sozinho faz a cena rotular tudo o que couber. Usamos a própria
  // projeção do app para saber ONDE uma estrutura está na tela, e então
  // clicamos ali — o clique atravessa o raycast de verdade, sem atalho e sem
  // depender de adivinhar que o centro da tela tem alguma coisa.
  await abrirExplorador(page, '?sistemas=focos');

  // Atributo próprio: 'rotulo' é uma classe de tipografia, usada também nos
  // cards; só os rótulos projetados sobre a cena carregam este marcador.
  const rotulo = page.locator('span[data-rotulo-da-cena]').first();
  await expect(rotulo).toBeVisible();

  // Os rótulos são reprojetados a ~12 Hz, e enquanto o canvas ainda se
  // dimensiona a desconflitação pode trocar qual deles sobrevive. Espera-se a
  // projeção estabilizar antes de medir, em vez de disputar com ela.
  const instantaneo = async () => {
    const b = await rotulo.boundingBox();
    return `${(await rotulo.textContent())?.trim()}@${Math.round(b!.x)},${Math.round(b!.y)}`;
  };
  let anterior = await instantaneo();
  await expect
    .poll(async () => {
      const atual = await instantaneo();
      const estavel = atual === anterior;
      anterior = atual;
      return estavel;
    })
    .toBe(true);

  // textContent, não innerText: o rótulo é exibido em caixa alta por CSS, e o
  // título do Sheet não é.
  const nomeEsperado = (await rotulo.textContent())!.trim();
  const alvo = (await rotulo.boundingBox())!;

  // O rótulo é desenhado com `left: x` e `top: y - 7` sobre o ponto projetado;
  // desfazendo esse deslocamento chega-se ao ponto exato da estrutura.
  // Sem delay: o app trata como arrasto qualquer toque que passe de 250 ms
  // entre pressionar e soltar, e sob disputa de CPU os dois eventos sintéticos
  // já chegam separados por mais do que isso — o delay só encurtava a margem.
  await page.mouse.click(alvo.x, alvo.y + 7);

  await expect(detalhe(page)).toBeVisible();
  await expect(page).toHaveURL(/foco=/);
  await expect(detalhe(page).getByRole('heading', { name: nomeEsperado })).toBeVisible();
});

test('2 · isolar oculta o resto; limpar a seleção restaura', async ({ page }) => {
  await abrirExplorador(page, '?foco=rosa-do-coracao');
  await expect(detalhe(page).getByRole('heading', { name: 'Rosa-do-coração' })).toBeVisible();

  await page.getByRole('button', { name: 'Isolar estrutura' }).click();
  await expect(page).toHaveURL(/isolar=1/);
  await expect(page.getByRole('button', { name: 'Mostrar tudo' })).toBeVisible();

  await page.getByRole('button', { name: 'Fechar detalhe' }).click();
  await expect(detalhe(page)).toBeHidden();
  await expect(page).not.toHaveURL(/isolar=1/);
  await expect(page).not.toHaveURL(/foco=/);
});

test('3 · busca por sinônimo encontra a rosa-do-coração', async ({ page }) => {
  await abrirExplorador(page);

  await page.locator('body').press('/');
  const busca = page.getByRole('dialog', { name: 'Buscar estrutura' });
  await expect(busca).toBeVisible();

  await busca.getByRole('searchbox').fill('átomo-centelha-do-espírito');
  await busca.getByRole('button', { name: /Rosa-do-coração/ }).click();

  await expect(page).toHaveURL(/foco=rosa-do-coracao/);
  await expect(detalhe(page).getByRole('heading', { name: 'Rosa-do-coração' })).toBeVisible();
});

test('4 · estado natural precede a fé, que precede o primeiro degrau', async ({ page }) => {
  soEmTelaLarga(page);
  await abrirExplorador(page);

  const cartao = degrau(page);
  await expect(cartao.getByRole('heading', { name: 'Estado natural' })).toBeVisible();
  await expect(cartao.getByText(/rosa permanece latente/i)).toBeVisible();

  await page.getByRole('button', { name: 'Próximo degrau' }).click();
  await expect(page).toHaveURL(/grau=0/);
  await expect(cartao.getByRole('heading', { name: 'Fé' })).toBeVisible();
  await expect(cartao.getByText(/primeira ruptura/i).first()).toBeVisible();

  await page.getByRole('button', { name: 'Próximo degrau' }).click();
  await expect(page).toHaveURL(/grau=1/);
  await expect(cartao.getByRole('heading', { name: 'Virtude' })).toBeVisible();
  await expect(cartao.getByText(/vivificação do sangue/i).first()).toBeVisible();

  await page.getByRole('button', { name: 'Próximo degrau' }).click();
  await expect(page).toHaveURL(/grau=2/);
  await expect(cartao.getByRole('heading', { name: 'Conhecimento' })).toBeVisible();

  await page.getByRole('button', { name: 'Degrau anterior' }).click();
  await expect(page).toHaveURL(/grau=1/);
  await expect(cartao.getByRole('heading', { name: 'Virtude' })).toBeVisible();
});

test('5 · o card do degrau cede o lugar ao detalhe e volta ao fechá-lo', async ({ page }) => {
  soEmTelaLarga(page);
  await abrirExplorador(page, '?grau=5');
  await expect(degrau(page).getByRole('heading', { name: 'Piedade' })).toBeVisible();

  // Uma estrutura que muda neste grau, alcançada pelo próprio card.
  await degrau(page).getByRole('button', { name: 'Cordão simpático esquerdo' }).click();
  await expect(detalhe(page).getByRole('heading', { name: 'Cordão simpático esquerdo' })).toBeVisible();
  await expect(degrau(page)).toBeHidden();
  await expect(page).toHaveURL(/foco=cordao-ida/);

  await page.getByRole('button', { name: 'Fechar detalhe' }).click();
  await expect(detalhe(page)).toBeHidden();
  await expect(degrau(page).getByRole('heading', { name: 'Piedade' })).toBeVisible();
});

test('6 · não há mais escolha pelo homem dialético', async ({ page }) => {
  await abrirExplorador(page, '?modo=duas-naturezas&natureza=novo');

  await expect(page.getByRole('button', { name: 'Duas naturezas' })).toHaveCount(0);
  // Parâmetros herdados de links antigos são descartados na primeira escrita.
  await page.getByRole('button', { name: 'Próximo degrau' }).click();
  await expect(page).not.toHaveURL(/modo=|natureza=/);
});

test('7 · detalhe expõe processos graduais e relações causais direcionadas', async ({ page }) => {
  await abrirExplorador(page, '?grau=5&foco=personalidade');
  await expect(detalhe(page).getByText(/uma única pedra já inicia/i)).toBeVisible();
  await expect(detalhe(page).getByText(/cresce entre o grau 5 e o grau 7/i)).toBeVisible();

  await abrirExplorador(page, '?grau=5&foco=rosa-do-coracao');
  const fluxos = detalhe(page).getByRole('heading', { name: 'Fluxos e relações' }).locator('..');
  await expect(fluxos.getByText('irradia sobre')).toBeVisible();
  await expect(fluxos.getByRole('button', { name: 'Timo' })).toBeVisible();
});
