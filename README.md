# anatomia-alma

Atlas interativo do microcosmo segundo *O novo homem — conhecimento, iniciação,
realização*, de J. van Rijckenborgh (Pentagrama Publicações, 3.ª ed., 2016).

Sete sistemas, 42 estruturas, a senda sétupla, e o Glossário do livro
reproduzido integralmente, sobre um corpo humano de anatomia real, em tema
claro. A especificação completa está em [`spec.md`](spec.md); as decisões
tomadas durante a construção estão no §14 do mesmo arquivo — inclusive as que
contradizem seções anteriores, que ficam no documento para preservar a
intenção.

> Este é um atlas de estudo que acompanha a leitura do livro. Não é prática, não
> é terapia, não é iniciação, e não substitui o texto. As posições
> tridimensionais são interpretativas onde o livro não as fixa.

## O texto-fonte não é versionado

`livro/` está no `.gitignore`. O PDF e o texto extraído do livro ficam apenas na
máquina de quem constrói; o que este repositório publica é o `corpus.ts`, com
trechos identificados por capítulo e página impressa — o uso descrito no §13 da
especificação.

Consequência prática: em um clone limpo, a invariante 9 (conferência das
citações contra o livro) é **pulada com aviso**, e `app/corpus/glossario.ts`,
que é gerado, já vem versionado. Quem tiver o texto-fonte pode regerá-lo:

```
node scripts/gerar-glossario.mjs
```

## O corpo é anatomia real

A figura da cena não é um manequim desenhado: são malhas de
[BodyParts3D](https://lifesciencedb.jp/bp3d/) 4.0 (adulto masculino de
referência, **CC BY 4.0**, do DBCLS), pela conversão para navegador de
[human-atlas](https://github.com/ashemag/human-atlas) (código MIT). Daquele
corpo — 2.234 malhas, 15 sistemas — este atlas usa **doze estruturas: só as que
o processo espiritual do livro nomeia**. Pele, esterno, timo, pineal, os dois
hemisférios, medula oblonga, coluna vertebral, fígado, baço, rins e
suprarrenais. Todo o resto é omitido.

O que não é órgão continua gerado por código: camadas do microcosmo, santuários,
rosa-do-coração, cundalini, medula espinal, cordões do simpático e correntes.

```
node scripts/construir-anatomia.mjs      baixa, une, simplifica e escala
```

O script baixa em `.cache/bodyparts3d/` (fora do versionamento) e escreve
`public/anatomia.{bin,json}` (versionados, ~1,4 MB): posições em Uint16
quantizadas por peça, normais em Int16, índices em Uint16. Build, validação e
deploy não dependem da rede. `validate-scene` reprova qualquer divergência entre
a `posicao` declarada no corpus e o centro medido da malha.

## Comandos

```
npm run dev                          desenvolvimento
npm run check                        tsc --noEmit
npm run validate:corpus              as 9 invariantes do corpus
npm run validate:scene               posições, rótulos, raycast, os 8 graus
npm run test:e2e                     contratos de interação, 3 viewports
npm run build
npm run audit                        4G simulado, axe-core, movimento reduzido
npm run verify                       tudo acima, em sequência
```

`npm run audit` precisa de um servidor de produção de pé (`npm run build &&
npm run start`) e aceita a URL como argumento.

Utilitário de diagnóstico, quando o texto-fonte está presente:

```
node scripts/localizar.mjs "um trecho"     em que página impressa ele ocorre
node scripts/dump.mjs 224-227              o texto de um intervalo de páginas
```

**Portão:** nada vai a produção com um comando vermelho.

## Como o corpus se defende

- `app/corpus/relacoes.ts` declara cada aresta **uma vez**; as ligações
  simétricas e a reciprocidade verbete↔estrutura são derivadas, não mantidas à
  mão nos dois lados.
- `DegrauDaSenda.ativa` é derivada de `grauDeAtivacao`.
- Toda citação é conferida **literalmente** contra o texto do livro, na página
  declarada. Uma citação inventada quebra a construção.
- O Glossário é gerado do livro: só a fronteira termo/definição é declarada, e o
  gerador falha se o bloco extraído não começar exatamente pelo termo. Nenhuma
  palavra de fora entra numa definição.

## Estado da verificação

Medido nesta máquina, não afirmado:

| Comando | Resultado |
|---|---|
| `tsc --noEmit` | limpo |
| `validate-corpus` | 42 estruturas, 7 sistemas, 68 verbetes, 8 graus, 95 citações conferidas contra o livro |
| `validate-scene` | 29 estruturas concretas alcançáveis por raycast em 4 vistas, nenhuma fora do corpo, 12 malhas casando com a `posicao` do corpus, rótulos sem colisão, 8 graus distintos e estáveis |
| `playwright` | 15/15 nos 3 viewports |
| `audit` | `/` em 2188 ms sob 4G simulado, servindo `anatomia.bin` **sem compressão** (a Vercel comprime: 1,39 MB → 0,90 MB em brotli, 1,01 MB em gzip, medidos aqui); 0 violações graves de axe (wcag2a/aa) em 4 rotas; cena estática com movimento reduzido |
| latência do slider | 7 passos de teclado em 51 ms (mediana de 8 amostras); eram 96 ms quando cada passo escrevia a URL de imediato |
| `build` | sem avisos, 5 rotas estáticas |

## O que não foi testado

- Desempenho em dispositivo físico.
- Multitouch em hardware real.
- Navegadores fora de Chromium e WebKit recentes.
- Leitores de tela além de uma passagem manual.
