const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('sections appear in the agreed order', async ({ page }) => {
  const ids = await page.locator('main section[id]').evaluateAll((s) => s.map((e) => e.id));
  expect(ids).toEqual(['bernard', 'teach', 'exams', 'how', 'pricing', 'contact']);
});

const subjects = {
  igcse: { has: ['Mathematics', 'Biology', 'Physics', 'Chemistry'], not: [] },
  ib: { has: ['Mathematics', 'Physics'], not: ['Chemistry', 'Biology'] },
  'a-level': { has: ['Mathematics', 'Physics'], not: ['Chemistry', 'Biology'] },
};
for (const [exam, { has, not }] of Object.entries(subjects)) {
  test(`${exam} lists exactly its subjects`, async ({ page }) => {
    const text = await page.locator(`[data-exam="${exam}"]`).innerText();
    for (const s of has) expect(text).toContain(s);
    for (const s of not) expect(text).not.toContain(s);
  });
}

test('pricing is exact', async ({ page }) => {
  const text = await page.locator('#pricing').innerText();
  expect(text).toContain('HKD 1,000');
  expect(text).toContain('75 minutes');
  expect(await page.locator('body').innerText()).not.toMatch(/90[- ]minute/);
  expect(text).not.toMatch(/HKD 800|small group|2 to 4 students/);
});

test('lessons run as a free trial then 75-minute lessons', async ({ page }) => {
  const text = await page.locator('#how').innerText();
  expect(text).toContain('1-hour trial');
  expect(text).toContain('75-minute lessons');
  expect(await page.locator('#how .steps li').count()).toBe(2);
});

test('orientation is gone from the whole page', async ({ page }) => {
  expect(await page.locator('body').innerText()).not.toMatch(/orientation/i);
});

test('format facts are present', async ({ page }) => {
  const text = await page.locator('#how').innerText();
  for (const s of ['Zoom', 'Google Meet', 'English']) expect(text).toContain(s);
  expect(await page.content()).not.toContain('Cantonese');
});

test('forbidden content is absent', async ({ page }) => {
  const text = await page.locator('body').innerText();
  expect(text.length).toBeGreaterThan(800);
  expect(text).not.toMatch(/\bGCSE\b|\bAP\b|\bDSE\b|Gold Coast|our team|\bwe\b/i);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('main img, header img')).toHaveCount(0);
});
