const { test, expect } = require('@playwright/test');
const { isPhone, noSidewaysScroll } = require('./helpers');

test.beforeEach(async ({ page }) => { await page.goto('/people'); });

test('full record is present', async ({ page }) => {
  const text = await page.locator('main').innerText();
  for (const s of ['2009', 'UBS', 'ING', 'Lehman Brothers', 'Stealth communications', 'Sigma Xi', 'Distinguished Teaching Assistant']) expect(text).toContain(s);
  await expect(page.locator('main a[href*="scholar.google.com"]')).toBeVisible();
});

test('skills list is gone', async ({ page }) => {
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/Solidity|Web3/);
});

test('publication 7 is fixed', async ({ page }) => {
  expect(await page.locator('main').innerText()).toContain('Ultrafast Phenomena (2006)');
});

test('same navy brand', async ({ page }) => {
  await expect(page.locator('.side')).toHaveCSS('background-color', 'rgb(12, 35, 64)');
});

test('phone bar leads back to the contact section', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  await expect(page.locator('.phone-bar a', { hasText: 'Free trial' })).toHaveAttribute('href', '/#contact');
});

test('no sideways scroll', async ({ page }) => {
  expect(await noSidewaysScroll(page)).toBe(true);
});
