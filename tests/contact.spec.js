const { test, expect } = require('@playwright/test');
const { WHATSAPP, isPhone } = require('./helpers');

const form = (page) => page.locator('form[name="contact"]');
const valid = (page) => form(page).evaluate((f) => f.checkValidity());

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('WhatsApp comes before email before the form', async ({ page }) => {
  const order = await page.locator('#contact').evaluate((c) => {
    const pos = (s) => Array.from(c.querySelectorAll('*')).indexOf(c.querySelector(s));
    return [pos(`a[href^="https://wa.me"]`), pos('a[href^="mailto:"]'), pos('form')];
  });
  expect(order[0]).toBeGreaterThanOrEqual(0);
  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);
  await expect(page.locator('#contact a[href^="https://wa.me"]')).toHaveAttribute('href', WHATSAPP);
  await expect(page.locator('#contact a[href="mailto:bernard.wu@alumni.princeton.edu"]')).toBeVisible();
});

test('form is wired to Netlify', async ({ page }) => {
  await expect(form(page)).toHaveAttribute('data-netlify', 'true');
  await expect(form(page)).toHaveAttribute('netlify-honeypot', 'company');
  await expect(form(page)).toHaveAttribute('method', /post/i);
  await expect(form(page)).toHaveAttribute('action', '/thanks');
  const honeypot = form(page).locator('[name="company"]');
  await expect(honeypot).toBeHidden();
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
});

for (const number of ['91234567', '9123 4567', '+44 7700 900123']) {
  test(`phone format accepted: ${number}`, async ({ page }) => {
    const phone = form(page).locator('[name="phone"]');
    await phone.fill(number);
    expect(await phone.evaluate((p) => p.validity.valid)).toBe(true);
  });
}

test('needs a way to reach the family', async ({ page }) => {
  await form(page).locator('[name="name"]').fill('A Parent');
  await form(page).locator('[name="message"]').fill('Hello');
  expect(await valid(page)).toBe(false);
  await form(page).locator('[name="phone"]').fill('91234567');
  expect(await valid(page)).toBe(true);
  await form(page).locator('[name="phone"]').fill('');
  expect(await valid(page)).toBe(false);
  await form(page).locator('[name="email"]').fill('parent@example.com');
  expect(await valid(page)).toBe(true);
});

test('subject options', async ({ page }) => {
  const options = await form(page).locator('[name="subject"] option').allTextContents();
  expect(options.filter((o) => !/^Choose/.test(o))).toEqual(['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology']);
});

test('exam options', async ({ page }) => {
  const options = await form(page).locator('[name="exam"] option').allTextContents();
  expect(options.filter((o) => !/^Choose/.test(o))).toEqual(['IGCSE', 'IB', 'A-level']);
});

test('every field has a visible label', async ({ page }) => {
  for (const name of ['name', 'email', 'phone', 'exam', 'subject', 'message']) {
    const id = await form(page).locator(`[name="${name}"]`).getAttribute('id');
    await expect(form(page).locator(`label[for="${id}"]`)).toBeVisible();
  }
});

test('phone bar does not cover submit', async ({ page }) => {
  test.skip(!isPhone(page), 'phone only');
  const submit = form(page).locator('button[type="submit"]');
  await submit.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const s = await submit.boundingBox();
  const bar = await page.locator('.phone-bar').boundingBox();
  expect(s.y + s.height).toBeLessThanOrEqual(bar.y);
});

test('form has no JS dependency to submit', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  await expect(form(page).locator('button[type="submit"]')).toBeEnabled();
  await expect(form(page)).toHaveAttribute('method', /post/i);
  await context.close();
});

test('thanks page confirms and offers the way back', async ({ page }) => {
  await page.goto('/thanks');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/message/i);
  await expect(page.locator('main a[href="/"]')).toBeVisible();
});
