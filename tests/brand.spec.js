const { test, expect } = require('@playwright/test');

for (const [width, height] of [[900, 700], [1366, 768], [1440, 900], [1920, 900], [1920, 1080], [2560, 1300]]) {
  test(`exam names stay on one line inside the column at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const fit = await page.evaluate(() => {
      const side = document.querySelector('.side');
      const limit = side.getBoundingClientRect().right - parseFloat(getComputedStyle(side).paddingRight);
      return Array.from(document.querySelectorAll('.big span')).map((span) => {
        const range = document.createRange();
        range.selectNodeContents(span);
        const lineCount = new Set(Array.from(range.getClientRects()).map((r) => Math.round(r.top))).size;
        return { lineCount, fits: range.getBoundingClientRect().right <= limit + 1 };
      });
    });
    for (const line of fit) expect(line).toEqual({ lineCount: 1, fits: true });
  });
}

test('exam names are no more than 135px on a wide desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  const size = await page.locator('.big').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  expect(size).toBeLessThanOrEqual(135);
});

test('the brand name is prominent on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const size = await page.locator('.logo').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  expect(size).toBeGreaterThanOrEqual(30);
});

test('the brand name is larger on phones too', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const size = await page.locator('.logo').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  expect(size).toBeGreaterThanOrEqual(25);
});
