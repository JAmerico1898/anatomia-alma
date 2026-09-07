# anatomia-alma

Atlas interativo do microcosmo segundo *O novo homem — conhecimento, iniciação,
realização*, de J. van Rijckenborgh (Pentagrama Publicações, 3.ª ed., 2016).

Sete sistemas, 42 estruturas, a senda sétupla, e o Glossário do livro
reproduzido integralmente. A especificação completa está em [`spec.md`](spec.md);
as decisões tomadas durante a construção estão no §14 do mesmo arquivo.

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
| `validate-scene` | 29 estruturas concretas alcançáveis por raycast em 4 vistas, nenhuma fora da figura, rótulos sem colisão, 8 graus distintos e estáveis |
| `playwright` | 15/15 nos 3 viewports |
| `audit` | `/` em 931 ms sob 4G simulado; 0 violações graves de axe (wcag2a/aa) em 4 rotas; cena estática com movimento reduzido |
| `build` | sem avisos, 5 rotas estáticas |

## O que não foi testado

- Desempenho em dispositivo físico.
- Multitouch em hardware real.
- Navegadores fora de Chromium e WebKit recentes.
- Leitores de tela além de uma passagem manual.
