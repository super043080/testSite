const { test, expect } = require('@playwright/test');

const lines = (page) => page.locator('#worked ol li');
const visibleCount = (page) => page.locator('#worked ol li:visible').count();

test('starts with one line and reveals one per tap', async ({ page }) => {
  await page.goto('/');
  expect(await visibleCount(page)).toBe(1);
  await page.locator('#worked-next').click();
  expect(await visibleCount(page)).toBe(2);
});

test('final line is the correct answer', async ({ page }) => {
  await page.goto('/');
  await expect(lines(page)).toHaveCount(6);
  expect(await lines(page).last().textContent()).toContain('3pq/(p + 2q)');
  expect(await page.locator('#worked').textContent()).not.toContain('3pq/(2p + q)');
});

test('button starts over after the last line', async ({ page }) => {
  await page.goto('/');
  const next = page.locator('#worked-next');
  for (let i = 0; i < 5; i++) await next.click();
  await expect(next).toHaveText('Start again');
  await next.click();
  expect(await visibleCount(page)).toBe(1);
  await expect(next).toHaveText('Show the next line');
});

test('reveals are announced', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#worked ol')).toHaveAttribute('aria-live', 'polite');
});

test('without JavaScript every line is visible', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  expect(await visibleCount(page)).toBe(6);
  await expect(page.locator('#worked-next')).toBeHidden();
  await context.close();
});
