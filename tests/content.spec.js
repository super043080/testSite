const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('sections appear in the agreed order', async ({ page }) => {
  const ids = await page.locator('main section[id]').evaluateAll((s) => s.map((e) => e.id));
  expect(ids).toEqual(['bernard', 'teach', 'exams', 'pricing']);
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
  const text = await page.locator('#pricing').innerText();
  expect(text).toContain('1-hour trial');
  expect(text).toContain('75-minute lessons');
  expect(await page.locator('#pricing .steps li').count()).toBe(2);
});

test('orientation is gone from the whole page', async ({ page }) => {
  expect(await page.locator('body').innerText()).not.toMatch(/orientation/i);
});

test('format facts sit with what I teach', async ({ page }) => {
  const text = await page.locator('#exams').innerText();
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

test('how I teach uses the agreed wording', async ({ page }) => {
  const section = page.locator('#teach');
  await expect(section.locator('h2')).toHaveText('How I teach');
  await expect(section.locator('h3')).toHaveText([
    'Start with what your child knows.',
    'Teach ahead, so school makes more sense.',
    'Build understanding from first principles.',
    'Practise with purpose.',
  ]);
  const text = await section.innerText();
  for (const s of [
    'I identify gaps in understanding and work through them before building on what your child already knows.',
    'I introduce topics before they come up at school, giving your child time to understand the ideas before revisiting them in class.',
    'I teach students to ask why, connect ideas, and work through unfamiliar problems—not simply memorise steps.',
    'I use the syllabus and past papers to guide original practice questions, with AI supporting my analysis. Practice targets gaps, reinforces key skills, and builds towards exam-style problems. The aim is to help your child enter the exam hall confident, prepared, and ready to think independently.',
  ]) expect(text).toContain(s);
});

test('booking lives inside pricing', async ({ page }) => {
  await expect(page.locator('#pricing #contact form[name="contact"]')).toHaveCount(1);
});
