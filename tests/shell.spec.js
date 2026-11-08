const { test, expect } = require('@playwright/test');
const { WHATSAPP, isPhone, noSidewaysScroll } = require('./helpers');

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('first screen states exams, teacher and free lesson', async ({ page }) => {
  const side = page.locator('.big');
  for (const name of ['IGCSE', 'IB', 'A-level']) await expect(side.getByText(name, { exact: true })).toBeVisible();
  await expect(page.getByText('Princeton PhD').first()).toBeVisible();
  await expect(page.getByText('First lesson free').first()).toBeVisible();
});

test('no sideways scroll', async ({ page }) => {
  expect(await noSidewaysScroll(page)).toBe(true);
});

test('exam names are not clipped', async ({ page }) => {
  const lines = page.locator('.big span');
  await expect(lines).toHaveCount(3);
  const width = page.viewportSize().width;
  for (const line of await lines.all()) {
    const box = await line.boundingBox();
    expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
});

test('phone bar is fixed with WhatsApp and Free trial', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  const bar = page.locator('.phone-bar');
  await expect(bar).toHaveCSS('position', 'fixed');
  await expect(bar.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', WHATSAPP);
  await expect(bar.getByRole('link', { name: 'Free trial' })).toHaveAttribute('href', '#contact');
});

test('phone bar does not cover page end', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const footer = await page.locator('footer').boundingBox();
  const bar = await page.locator('.phone-bar').boundingBox();
  expect(footer.y + footer.height).toBeLessThanOrEqual(bar.y + 1);
});

test('desktop navy column stays in view', async ({ page }) => {
  test.skip(isPhone(page), 'desktop only');
  await page.evaluate(() => { document.querySelector('.frame').style.minHeight = '4000px'; window.scrollTo(0, 1500); });
  const side = page.locator('.side');
  expect((await side.boundingBox()).y).toBe(0);
  await expect(side).toHaveCSS('background-color', 'rgb(12, 35, 64)');
});

test('keyboard users can skip to the main content', async ({ page }) => {
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
  await expect(skip).toBeInViewport();
  await expect(page.locator('main#main')).toHaveCount(1);
});

test('browser chrome matches the navy', async ({ page }) => {
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0c2340');
});

test('email field is not spellchecked', async ({ page }) => {
  await expect(page.locator('input[name="email"]')).toHaveAttribute('spellcheck', 'false');
});

test('opening message uses the agreed wording', async ({ page }) => {
  await expect(page.locator('.intro h1')).toHaveText(/A clearer understanding\.\s*Better prepared for exams\./);
  const text = await page.locator('.intro').innerText();
  expect(text).toContain('One-to-one maths and science tuition with Dr. Bernard Wu, Princeton PhD.');
  expect(text).toContain('First lesson free. At home or online, at times that suit your week.');
});

test('opening message fits above the phone bar on a small phone', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const last = await page.locator('.intro > p').last().boundingBox();
  const bar = await page.locator('.phone-bar').boundingBox();
  expect(last.y + last.height).toBeLessThanOrEqual(bar.y);
});
