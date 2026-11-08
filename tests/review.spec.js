const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { isPhone } = require('./helpers');

const css = () => fs.readFileSync(path.join(__dirname, '../site/styles.css'), 'utf8');

test('old .html addresses redirect as well', () => {
  const rules = fs.readFileSync(path.join(__dirname, '../site/_redirects'), 'utf8');
  for (const rule of ['/vision.html /#teach 301', '/program.html /#exams 301', '/contact.html /#contact 301']) expect(rules).toContain(rule);
});

test('missing pages offer a way home', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('main a[href="/"]')).toBeVisible();
});

for (const [url, selector] of [
  ['/', '#contact a[href^="mailto:"]'],
  ['/thanks', 'main a[href="/"]'],
]) {
  test(`tap target is large enough: ${selector}`, async ({ page }) => {
    await page.goto(url);
    expect((await page.locator(selector).boundingBox()).height).toBeGreaterThanOrEqual(44);
  });
}

for (const selector of ['a[href*="scholar.google.com"]', 'a[href*="proquest.com"]', 'details#profile > summary']) {
  test(`profile tap target is large enough: ${selector}`, async ({ page }) => {
    await page.goto('/');
    await page.locator('details#profile > summary').click();
    expect((await page.locator(selector).boundingBox()).height).toBeGreaterThanOrEqual(44);
  });
}

test('copy stays within the facts', async ({ page }) => {
  await page.goto('/');
  const home = await page.locator('main').innerText();
  expect(home).not.toMatch(/quickest|never seen|first trial lesson|After that I/);
  expect(await page.locator('details#profile').textContent()).not.toMatch(/I then worked/);
});

test('search listing does not imply sciences at every level', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/maths and physics/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /biology and chemistry at IGCSE/);
});

test('thanks page keeps the phone bar', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  await page.goto('/thanks');
  await expect(page.locator('.phone-bar a', { hasText: 'WhatsApp' })).toBeVisible();
});

test('focus ring shows on the navy thanks panel', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  await page.goto('/thanks');
  const link = page.locator('main a[href="/"]');
  await link.focus();
  expect(await link.evaluate((a) => getComputedStyle(a).outlineColor)).toBe('rgb(255, 255, 255)');
});

test('every svh rule has a vh fallback for older phones', () => {
  const lines = css().match(/[a-z-]+:[^;{}]*svh[^;{}]*;/g);
  expect(lines.length).toBeGreaterThan(0);
  for (const rule of lines) expect(css()).toContain(`${rule.replace(/svh/g, 'vh')} ${rule}`);
});
