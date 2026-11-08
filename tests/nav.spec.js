const { test, expect } = require('@playwright/test');
const { isPhone } = require('./helpers');

for (const path of ['/', '/thanks']) {
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

for (const [label, id] of [['About', 'bernard'], ['How I teach', 'teach'], ['What I teach', 'exams'], ['Pricing & book', 'pricing']]) {
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

const LABELS = ['Home', 'About', 'How I teach', 'What I teach', 'Pricing & book'];

test('desktop menu lists the five sections in page order', async ({ page }) => {
  test.skip(isPhone(page), 'desktop only');
  await page.goto('/');
  await expect(page.locator('.desk-nav a')).toHaveText(LABELS);
});

test('menu fits on one line at the narrowest desktop', async ({ page }) => {
  test.skip(isPhone(page), 'desktop only');
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/');
  const tops = await page.locator('.desk-nav a').evaluateAll((l) => l.map((a) => Math.round(a.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('menu marks the section being read', async ({ page }) => {
  test.skip(isPhone(page), 'desktop only');
  await page.goto('/');
  const current = page.locator('.desk-nav a[aria-current="true"]');
  await expect(current).toHaveText('Home');
  await page.locator('.desk-nav a', { hasText: 'What I teach' }).click();
  await expect(current).toHaveText('What I teach');
  await page.locator('.desk-nav a', { hasText: 'Home' }).click();
  await expect(current).toHaveText('Home');
});

test('reaching the end of the page marks the last section', async ({ page }) => {
  test.skip(isPhone(page), 'desktop only');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.desk-nav a[aria-current="true"]')).toHaveText('Pricing & book');
});

test('phone menu lists the five sections and closes after a tap', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  await page.goto('/');
  await page.locator('.menu summary').click();
  await expect(page.locator('.menu nav a')).toHaveText(LABELS);
  await page.locator('.menu nav a', { hasText: 'What I teach' }).click();
  await expect(page).toHaveURL(/#exams$/);
  await expect(page.locator('details.menu')).not.toHaveAttribute('open', '');
});
