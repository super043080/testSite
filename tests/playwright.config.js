const { defineConfig } = require('@playwright/test');

const phone = (name, width, height) => ({ name, use: { viewport: { width, height } } });

module.exports = defineConfig({
  testDir: '.',
  timeout: 20000,
  reporter: 'line',
  use: { baseURL: 'http://localhost:4173' },
  projects: [phone('w320', 320, 640), phone('w375', 375, 812), phone('w1440', 1440, 900)],
  webServer: {
    command: 'npx serve ../site -l 4173 --no-clipboard',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
