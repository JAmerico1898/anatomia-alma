import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  // WebGL por software é pesado: cinco cenas simultâneas tornam os testes
  // instáveis por disputa de CPU, não por defeito do app.
  fullyParallel: true,
  workers: 2,
  // Renderizar por software é lento; as esperas padrão de 5s produzem falhas
  // por disputa de CPU, não por defeito do app.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    // WebGL por SwiftShader: sem isto, o navegador headless não cria contexto e
    // a cena simplesmente não monta.
    launchOptions: {
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: false } },
    { name: 'landscape', use: { ...devices['Desktop Chrome'], viewport: { width: 844, height: 390 } } },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
