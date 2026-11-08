const { test, expect } = require('@playwright/test');
const { isPhone } = require('./helpers');

for (const path of ['/', '/people', '/thanks']) {
  test(`no WhatsApp item in the menus on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('.desk-nav a, .menu nav a').filter({ hasText: 'WhatsApp' })).toHaveCount(0);
  });
}

test('desktop menu stays visible while scrolling', async ({ page }) => {
  test.skip(isPhone(page), 'desktop only');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1500));
  const nav = page.locator('.desk-nav');
  await expect(nav).toBeInViewport();
  expect((await nav.boundingBox()).y).toBe(0);
});

for (const [label, id] of [['Exams', 'exams'], ['Bernard', 'bernard'], ['Pricing', 'pricing']]) {
  test(`jumping to ${label} leaves its heading clear of the menu`, async ({ page }) => {
    test.skip(isPhone(page), 'desktop only');
    await page.goto('/');
    await page.locator('.desk-nav a', { hasText: label }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator('.desk-nav')).toBeInViewport();
    const nav = await page.locator('.desk-nav').boundingBox();
    const heading = await page.locator(`#${id} h2`).boundingBox();
    expect(heading.y).toBeGreaterThanOrEqual(nav.y + nav.height);
  });
}

test('opening screen offers one action, the free trial', async ({ page }) => {
  test.skip(isPhone(page), 'desktop only');
  await page.goto('/');
  const links = page.locator('.intro .actions a');
  await expect(links).toHaveCount(1);
  await expect(links).toHaveText('Book a free trial');
  await expect(links).toHaveAttribute('href', '#contact');
});
