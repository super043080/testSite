# wulesson.com Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace wulesson.com with a phone-first, navy, single-page site plus a profile page, on the existing Netlify project.

**Architecture:** Static HTML, one stylesheet, and two small scripts in `site/`. A repo-level `netlify.toml` publishes only `site/`, so tests and docs are never served. Work happens on branch `redesign` and reaches the public only through a merge Bernard approves.

**Tech Stack:** HTML, CSS, vanilla JS, self-hosted Archivo Narrow and Schibsted Grotesk, Netlify Forms and `_redirects`. Playwright with `serve` in `tests/` for verification only.

**Spec:** `docs/superpowers/specs/2026-11-08-wulesson-redesign-design.md`

## Global Constraints

- Navy `#0c2340`, white type on navy. Layout per the Navy half of `.superpowers/brainstorm/34951-1794125458/content/navy-vs-yellow.html`.
- Exams and subjects: IGCSE: Mathematics, Science (Biology, Physics, Chemistry). IB: Mathematics, Physics. A-level: Mathematics, Physics.
- Never present: `GCSE` as a standalone word, `AP`, `DSE`, `Gold Coast`, `tel:` links, photos, testimonials, results, statistics, "we", "our team".
- First person ("I") or "Bernard". Sentence case. No selling language beyond the facts in the spec's "Facts" section, which must not be altered.
- Correct answer of the walkthrough is `3pq/(p + 2q)`. `3pq/(2p + q)` must appear nowhere.
- WhatsApp URL: `https://wa.me/85263302851?text=Hello%20Bernard%2C%20I%27d%20like%20to%20ask%20about%20lessons.` Email: `bernard.wu@alumni.princeton.edu`.
- Form keeps `name="contact"` and `data-netlify="true"`.
- Google Analytics tag `G-N6KXV30WRK` on every page.
- No page may scroll sideways at 320px. Tap targets at least 44px. Text contrast at least 4.5:1. Visible keyboard focus. `prefers-reduced-motion` respected.
- Nothing is merged to `master`, and no dashboard setting is changed, without Bernard's say-so. Every push to `master` goes live.

## Review Focus

- Normal phone formats (`91234567`, `9123 4567`, `+44 7700 900123`) are accepted by the form. Task 4.
- The fixed phone bar never hides the form's submit button or the end of the page when scrolled to the bottom. Task 1 and Task 4.
- With JavaScript off, every walkthrough line is readable and the form still submits. Task 3 and Task 4.
- The huge exam names fit a 320px screen without clipping or sideways scroll. Task 1.
- Chemistry and Biology are offered only at IGCSE, on the page and in the form. Task 2 and Task 4.

---

### Task 1: Workspace, tooling and the page shell

**Files:**
- Create: `netlify.toml`, `site/index.html`, `site/styles.css`, `site/fonts/*.woff2`, `tests/package.json`, `tests/playwright.config.js`, `tests/shell.spec.js`
- Modify: `.gitignore`
- Move: `images/favicon.png` to `site/images/favicon.png`

**Interfaces:**
- Produces: `#exams #bernard #teach #worked #how #pricing #contact` empty `<section>`s in `site/index.html`; CSS variables `--navy`, `--ink`, `--muted`, `--space-*`; `.big` (exam names); `.phone-bar`; test server on port 4173 with clean URLs.

- [ ] **Step 1: Attach the repo without disturbing the folder.** In `/mnt/d/wulesson`: `git init -b redesign-temp`, `git remote add origin https://github.com/super043080/testSite.git`, `git fetch origin master`, `git checkout -b redesign origin/master`. Add `.superpowers/`, `.playwright-mcp/`, `tests/node_modules/`, `tests/test-results/` to `.gitignore`.

- [ ] **Step 2: Install test tools.** `tests/package.json` has devDependencies `@playwright/test` and `serve` only. Config: `webServer` runs `npx serve ../site -l 4173`, projects at 320x640, 375x812 and 1440x900. Run `npm install` in `tests/`. It sits outside the repo root deliberately, so Netlify does not try to install it on Node 16.

- [ ] **Step 3: Write failing tests in `tests/shell.spec.js`.**

```js
test('first screen states exams, teacher and free lesson', ...)
  // visible: 'IGCSE', 'IB', 'A-level', 'Princeton PhD', 'First lesson free'
test('no sideways scroll', ...)
  // documentElement.scrollWidth <= window.innerWidth
test('exam names are not clipped', ...)
  // each .big line: right edge <= viewport width
test('phone bar is fixed with WhatsApp and Free trial', ...)  // width < 768 only
  // position fixed; WhatsApp href equals the Global Constraints URL; Free trial href '#contact'
test('phone bar does not cover page end', ...)  // width < 768
  // scroll to bottom; footer bottom <= phone bar top
test('desktop navy column stays in view', ...)  // width >= 1024
  // after scrolling 1500px, .side top === 0, background rgb(12, 35, 64)
```

- [ ] **Step 4: Run and confirm failure.** `cd tests && npx playwright test shell` fails because `site/index.html` is missing.

- [ ] **Step 5: Build the shell.** `netlify.toml` contains `[build]` with `publish = "site"` and `command = ""`. Download latin woff2 for Archivo Narrow 700 and Schibsted Grotesk 400, 500, 700 into `site/fonts/`, using `@font-face` with `font-display: swap`. Include the analytics tag, viewport meta, title and description naming IGCSE, IB and A-level. Phone menu is a `<details>` element with no script. Theme text selection and focus rings from the palette.

- [ ] **Step 6: Run and confirm pass.** `npx playwright test shell` passes in all three projects. Screenshot 375 and 1440 and compare with the approved mockup.

- [ ] **Step 7: Commit.** `git add netlify.toml .gitignore site tests/package.json tests/package-lock.json tests/playwright.config.js tests/shell.spec.js && git commit -m "feat: add navy page shell and test harness"`

### Task 2: Content sections

**Files:**
- Modify: `site/index.html`, `site/styles.css`
- Create: `tests/content.spec.js`

**Interfaces:**
- Consumes: section ids from Task 1.
- Produces: link to `/people` from `#bernard`.

- [ ] **Step 1: Write failing tests.**

```js
test('sections appear in the agreed order', ...)
  // ids in DOM order: bernard, teach, worked, exams, how, pricing, contact
test('each exam lists exactly its subjects', ...)
  // [data-exam=igcse] has Mathematics, Biology, Physics, Chemistry
  // [data-exam=ib] and [data-exam=a-level] have Mathematics, Physics; no Chemistry, no Biology
test('pricing is exact', ...)
  // 'HKD 1,000', 'HKD 800', '90 minutes', '2 to 4 students'
test('both free first steps are named', ...)
  // '30-minute orientation', '1-hour trial'
test('format facts are present', ...)
  // 'Zoom', 'Google Meet', 'English', 'Cantonese'
test('forbidden content is absent', ...)
  // body text fails /\bGCSE\b|\bAP\b|\bDSE\b|Gold Coast|our team|\bwe\b/i
  // no a[href^="tel:"], no <img> outside favicon
test('Bernard links to the profile', ...)  // a[href="/people"] within #bernard
```

- [ ] **Step 2: Run and confirm failure.** `npx playwright test content`.

- [ ] **Step 3: Write the sections in the spec's order, on the white side.** Use the spec's "Content order" and "Facts". Exams section uses `data-exam` on each block, with no boards or syllabus levels. Do not use uniform cards or small all-caps labels above headings.

- [ ] **Step 4: Run and confirm pass.** `npx playwright test content`.

- [ ] **Step 5: Commit.** `git commit -am "feat: add main page content"` after `git add tests/content.spec.js`.

### Task 3: Worked problem

**Files:**
- Create: `site/walkthrough.js`, `tests/worked.spec.js`
- Modify: `site/index.html`, `site/styles.css`

**Interfaces:**
- Consumes: `#worked`.
- Produces: `#worked ol li` (one per line), `#worked-next` button.

Question: "A cyclist rides 40 km at p km/h, then 20 km at q km/h. Find the average speed for the whole journey." Lines: `Total distance = 60 km`; `Total time = 40/p + 20/q`; `Average speed = 60 ÷ (40/p + 20/q)`; `= 60 ÷ ((40q + 20p)/pq)`; `= 60pq/(40q + 20p)`; `= 3pq/(p + 2q)`.

- [ ] **Step 1: Write failing tests.**

```js
test('starts with one line and reveals one per tap', ...)
test('final line is the correct answer', ...)  // last li contains '3pq/(p + 2q)'; page lacks '3pq/(2p + q)'
test('button starts over after the last line', ...)  // label becomes 'Start again'; one line again
test('reveals are announced', ...)  // ol or wrapper has aria-live="polite"
test('without JavaScript every line is visible', ...)  // context javaScriptEnabled:false; all 6 visible; #worked-next hidden
```

- [ ] **Step 2: Run and confirm failure.** `npx playwright test worked`.

- [ ] **Step 3: Implement `initWalkthrough(root: HTMLElement): void` in `site/walkthrough.js`.** All lines are visible in the HTML; the script hides all but the first on load and un-hides the button. Math variables in italic via `<i>`.

- [ ] **Step 4: Run and confirm pass.** `npx playwright test worked`.

- [ ] **Step 5: Commit.** `git add site tests/worked.spec.js && git commit -m "feat: add worked problem"`

### Task 4: Contact

**Files:**
- Create: `site/contact.js`, `site/thanks.html`, `tests/contact.spec.js`
- Modify: `site/index.html`, `site/styles.css`

**Interfaces:**
- Consumes: `#contact`, WhatsApp URL.
- Produces: form `name="contact"`, `action="/thanks"`, `netlify-honeypot="company"`.

- [ ] **Step 1: Write failing tests.**

```js
test('WhatsApp comes before email before the form', ...)
test('form is wired to Netlify', ...)
  // name=contact, data-netlify present, honeypot input name=company hidden from view and from tab order
test('common phone formats are accepted', ...)
  // for 91234567, '9123 4567', '+44 7700 900123': phone input validity.valid === true
test('needs a way to reach the family', ...)
  // name+message only: form invalid and message visible; adding email OR phone: valid
test('subject options', ...)
  // Mathematics, Physics, Chemistry (IGCSE only), Biology (IGCSE only); no other subject
test('every field has a visible label', ...)
test('phone bar does not cover submit', ...)  // width < 768; scroll submit into view; submit bottom <= bar top
test('form has no JS dependency to submit', ...)  // JS off: submit is enabled; method POST
test('thanks page confirms and offers the way back', ...)
```

- [ ] **Step 2: Run and confirm failure.** `npx playwright test contact`.

- [ ] **Step 3: Build the section, `site/thanks.html` and `validateReach(form: HTMLFormElement): boolean` in `site/contact.js`.** Required: name, message. `validateReach` uses `setCustomValidity` on email when both email and phone are blank. Phone input is `type="tel"` with no `pattern`. Exam select: IGCSE, IB, A-level. Add `scroll-margin-top` to anchored sections and bottom padding at the phone bar's height.

- [ ] **Step 4: Run and confirm pass.** `npx playwright test contact`.

- [ ] **Step 5: Commit.** `git add site tests/contact.spec.js && git commit -m "feat: add contact section and form"`

### Task 5: Profile page

**Files:**
- Create: `site/people.html`, `tests/profile.spec.js`
- Source: root `people.html`

**Interfaces:**
- Consumes: shell and CSS from Task 1, WhatsApp URL.

- [ ] **Step 1: Write failing tests.**

```js
test('full record is present', ...)
  // '2009', 'UBS', 'ING', 'Lehman Brothers', 'Stealth communications', 'Sigma Xi', Google Scholar link
test('skills list is gone', ...)  // no 'Solidity', 'Web3'
test('publication 7 is fixed', ...)  // contains 'Ultrafast Phenomena (2006)'
test('same navy brand and phone bar', ...)
test('no sideways scroll', ...)
```

- [ ] **Step 2: Run and confirm failure.** `npx playwright test profile`.

- [ ] **Step 3: Build `site/people.html`** reusing the shell. The navy column carries the name instead of the exam names.

- [ ] **Step 4: Run and confirm pass.** `npx playwright test profile`.

- [ ] **Step 5: Commit.** `git add site tests/profile.spec.js && git commit -m "feat: add profile page"`

### Task 6: Redirects, retiring old files and review

**Files:**
- Create: `site/_redirects`, `tests/redirects.spec.js`
- Delete: root `index.html`, `vision.html`, `people.html`, `program.html`, `contact.html`, `math3.html`, `practice.html`, `styles.css`, `images/`

- [ ] **Step 1: Write failing test.** `tests/redirects.spec.js` reads `site/_redirects` and asserts these rules exactly: `/vision /#teach 301`, `/program /#exams 301`, `/contact /#contact 301`, `/math3 / 301`, `/practice / 301`.

- [ ] **Step 2: Run and confirm failure.** `npx playwright test redirects`.

- [ ] **Step 3: Add `site/_redirects` and delete the old root files.**

- [ ] **Step 4: Run the whole suite.** `npx playwright test` passes in all projects.

- [ ] **Step 5: Run the design and accessibility checks.** `/root/.claude/skills/impeccable/scripts/impeccable detect --json site/index.html site/people.html`, and the `web-design-guidelines` skill against `site/`. Fix what they find, rerun the suite.

- [ ] **Step 6: Commit.** `git add -A site tests && git rm -r --cached --ignore-unmatch images && git commit -m "chore: retire old pages and add redirects"`

### Task 7: Preview and handover

- [ ] **Step 1: Push and open a pull request.** `git push -u origin redesign`; `gh pr create --base master --head redesign`. Confirm with Bernard before pushing.

- [ ] **Step 2: Check the deploy preview.** Against the preview URL, confirm with `curl -sI` that each old address returns 301 to its target and `/people` returns 200, and that `/tests/` and `/docs/` return 404.

- [ ] **Step 3: Check the real form, with Bernard's agreement.** Send one clearly labelled test submission on the preview. Expected: it appears in the Netlify `contact` form and an alert reaches Bernard's Gmail. Tell him it is coming.

- [ ] **Step 4: Screenshot and hand over.** Screenshots at 320, 375, 768, 1024 and 1440. Give Bernard the preview link. Do not merge until he approves.
