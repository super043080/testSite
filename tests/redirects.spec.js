const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('old addresses redirect to their new homes', () => {
  const rules = fs.readFileSync(path.join(__dirname, '../site/_redirects'), 'utf8').trim().split('\n');
  expect(rules).toEqual([
    '/vision /#teach 301',
    '/program /#exams 301',
    '/contact /#contact 301',
    '/vision.html /#teach 301',
    '/program.html /#exams 301',
    '/contact.html /#contact 301',
    '/people /#profile 301',
    '/people.html /#profile 301',
  ]);
});
