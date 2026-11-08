const { test, expect } = require('@playwright/test');
const { noSidewaysScroll } = require('./helpers');

const panel = (page) => page.locator('details#profile');
const toggle = (page) => page.locator('details#profile > summary');
const open = (page) => toggle(page).click();

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('profile starts collapsed with a clear label', async ({ page }) => {
  await expect(toggle(page)).toHaveText('Read my full profile', { useInnerText: true });
  await expect(page.locator('#profile a[href*="proquest"]')).toBeHidden();
});

test('expands in place without leaving the page', async ({ page }) => {
  await open(page);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#profile a[href*="proquest"]')).toBeVisible();
  await expect(toggle(page)).toHaveText('Hide full profile', { useInnerText: true });
});

test('collapses again from the top control', async ({ page }) => {
  await open(page);
  await open(page);
  await expect(page.locator('#profile a[href*="proquest"]')).toBeHidden();
  await expect(toggle(page)).toHaveText('Read my full profile', { useInnerText: true });
});

test('collapses from the control at the end and returns to the toggle', async ({ page }) => {
  await open(page);
  await page.locator('#profile-close').click();
  await expect(page.locator('#profile a[href*="proquest"]')).toBeHidden();
  await expect(toggle(page)).toBeInViewport();
});

test('full record is present', async ({ page }) => {
  await open(page);
  const text = await panel(page).innerText();
  for (const s of ['2009', 'UBS', 'ING', 'Lehman Brothers', 'Stealth communications', 'Sigma Xi', 'Distinguished Teaching Assistant', 'Ultrafast Phenomena (2006)']) expect(text).toContain(s);
  await expect(panel(page).locator('a[href*="scholar.google.com"]')).toBeVisible();
  expect(text).not.toMatch(/Solidity|Web3/);
});

test('an old /people link can open the profile directly', async ({ page }) => {
  await page.goto('/#profile');
  await expect(panel(page)).toHaveAttribute('open', '');
});

test('still opens and closes without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  await open(page);
  await expect(page.locator('#profile a[href*="proquest"]')).toBeVisible();
  await expect(page.locator('#profile-close')).toBeHidden();
  await open(page);
  await expect(page.locator('#profile a[href*="proquest"]')).toBeHidden();
  await context.close();
});

test('no sideways scroll when expanded', async ({ page }) => {
  await open(page);
  expect(await noSidewaysScroll(page)).toBe(true);
});

test('research sentence uses the agreed wording', async ({ page }) => {
  await open(page);
  await expect(page.locator('.full-profile-body > p').first()).toHaveText('At Princeton, my doctoral research explored ways to make fiber-optic networks more secure using optical steganography—a technique for concealing information within optical signals.');
});
