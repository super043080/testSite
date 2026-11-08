# wulesson.com redesign: design

Date: 2026-11-08. Status: awaiting Bernard's approval.

## Intent

wulesson.com is Bernard Wu's private tutoring site. It was written years ago and undersells him: his credentials sit on a separate page, the free trial is buried at the bottom of Program, and the homepage says only what any tutor could say. This project replaces the look completely and reorganises the content so that a parent quickly decides to get in touch.

The reader is usually a **parent, skimming on a phone**, whose child is preparing for an upcoming exam. Desktop matters but is secondary. What has persuaded families so far, in Bernard's words: his educational background, the available trial lesson, and flexibility on time, location and online lessons. Families get in touch through the contact form and WhatsApp.

## Goals

- A parent on a phone understands within one screen: which exams, which subjects, who teaches, and that the first lesson is free.
- WhatsApp and the free trial are one tap away at all times on a phone.
- The site looks clean, minimal, sophisticated, modern and hip. Style references Bernard likes: apc.fr and stripe.com.
- Enquiries keep arriving in the same Netlify form as today.

## Non-goals

- No photos of Bernard. He decided against them, and the design must not leave a gap for one.
- No testimonials, results, grade improvements or statistics. Bernard has none to show and does not want a hard sell. Do not invent any.
- GCSE, AP and DSE are not mentioned anywhere. The focus is IGCSE, IB and A-level.
- No telephone call link. Contact is email, contact form and WhatsApp only.
- No framework, CMS or build step, and no change of host.
- No changes to Netlify settings. The existing form email alert (to Bernard's Gmail) stays as it is.

## Anti-goals

The redesign has failed, even if it works technically, if:

- it reads as a loud sales page or a generic tutoring template;
- it claims "team", "we" or "our tutors": families are always taught by Bernard personally;
- the desktop and phone versions feel like two different brands;
- a parent has to hunt for how to get in touch.

## Decided by Bernard

**Visual direction: "Layout 1, classic navy".** The approved mockup is at `.superpowers/brainstorm/34951-1794125458/content/navy-vs-yellow.html` (the Navy half).

- Desktop: a navy column on the left, about a third of the width, with the wordmark at the top and the exam names stacked very large at the bottom in white condensed bold type. The rest is calm white with the navigation at top right, the main message and two buttons.
- Phone: the whole first screen is navy with the exam names huge and the one-line message below. A bar is fixed to the bottom of the screen with WhatsApp and Free trial, white with navy text.
- Navy is `#0c2340`, with white type. It is matched by eye to classic Maserati blue, and is not an official Maserati colour.
- Rejected: yellow, pink, cobalt, black, the blackboard green, a column on the right, a band across the top.

**Device approach.** One responsive site, designed phone first.

**Scope of exams and subjects.** IGCSE: Mathematics and Science (Biology, Physics, Chemistry). IB: Mathematics and Physics. A-level: Mathematics and Physics. Chemistry and Biology are offered at IGCSE only, which is narrower than the current site, so never imply otherwise.

**Contact methods.** Email, contact form, WhatsApp.

**Teacher.** Bernard personally, always. Write in the first person ("I"), or about "Bernard" by name. Never "we".

## Content order

One main scrolling page, in this order. Exact facts are listed under "Facts".

1. **Opening screen.** Exam names, then: "Maths and science, one on one with Bernard Wu, Princeton PhD." and "First lesson free."
2. **Bernard.** Type only. A short version of his story: Brown, Princeton PhD, Distinguished Teaching Assistant award, over a decade trading derivatives at UBS. Link to the full profile.
3. **How I teach.** The Vision page cut down to its sharpest ideas: the difference between knowing the name of a concept and understanding it; finding out what the student already knows and building from there; teaching topics before school reaches them; reasoning from first principles.
4. **See a worked problem.** The average speed walkthrough from `math3.html`, stepped through line by line by tapping, so a parent sees the teaching rather than reads about it.
5. **Exams and subjects.** What is covered for each of IGCSE, IB and A-level.
6. **How it works.** At home or online, English or Cantonese, times that fit the family's week, and the two free first steps.
7. **Pricing.** Plainly stated.
8. **Contact.** WhatsApp first, then email, then the form.

A separate **profile page** at the existing `/people` address holds the full record: degrees, experience, thesis, honours, publications and the Google Scholar link. Omit the "Skills" list (HTML, Solidity, and so on), which does not help a parent.

Navigation: Exams, Bernard, Pricing, WhatsApp (as in the approved mockup).

## Facts

Taken from the current site. Do not add to or alter these.

- Bernard Wu, Ph.D.
- Ph.D. Princeton 2009 (Electrical Engineering); M.A. Princeton 2004 (Electrical Engineering); A.B. Brown, magna cum laude, 2001 (Economics); Sc.B. Brown, magna cum laude, 2001 (Electrical Engineering).
- UBS, Executive Director, Equity Derivatives Trader, Hong Kong, 2010-2021 (about 10.5 years); ING, Associate, Exotic Equity Derivatives Trader, Singapore, 2008-2009; Lehman Brothers, Associate, Equity Derivatives Structuring, Hong Kong, 2007-2008.
- Distinguished Teaching Assistant award, Princeton Electrical Engineering, 2004 (Electromagnetic Field Theory and Optics, Physical Optics). Sigma Xi, Tau Beta Pi, Omicron Delta Epsilon (2001).
- Format: at the student's home or online by Zoom or Google Meet. English and Cantonese. Do not name a service area: Bernard asked for the "Gold Coast area" wording to be removed.
- Pricing: one on one HKD 1,000 for 90 minutes. Small group of 2 to 4 students, HKD 800 per student for 90 minutes.
- Free first steps: Lesson 0, a free 30-minute orientation; Lesson 1, a free 1-hour trial lesson.
- Email bernard.wu@alumni.princeton.edu. WhatsApp +852 6330 2851 (`https://wa.me/85263302851`).
- Thesis, publications and Scholar link: carry over from the repo's `people.html`, fixing the missing `)` in publication 7.

## Constraints

- **Hosting.** Netlify project `jigaesite`, serving www.wulesson.com, deploying from GitHub `super043080/testSite`, branch `master`.
- **Every push to `master` goes live immediately.** Work on a branch and use a pull request and its deploy preview. Do not merge to `master` without Bernard's say-so.
- **Form.** Keep `name="contact"` and `data-netlify="true"` so submissions continue in the same Netlify form and the existing email alert keeps working.
- **Phone field.** The current field is required and only accepts `1234-5678`, blocking normal and overseas numbers. It must accept any reasonable number.
- **Maths correction.** `math3.html` wrongly gives the final answer as `3pq/(2p + q)`. The correct answer is `3pq/(p + 2q)`. The walkthrough must use the correct result on screen and in any narration.
- **Old addresses.** `/vision`, `/program` and `/contact` must keep working by redirecting to the matching section of the main page. `/people` remains the profile page.
- **Retired pages.** `math3.html` and `practice.html` are removed with no redirects, by Bernard's decision: they were not relevant.
- **Analytics.** Keep the existing Google Analytics tag `G-N6KXV30WRK`.
- **Quality floor.** Works from 320px wide with no sideways scrolling. Tap targets at least 44px. Text contrast at least 4.5:1. Visible keyboard focus. Reduced-motion respected.

## Calls made by Claude (not agreed by Bernard; he can overrule)

- Plain HTML and CSS with a small amount of JavaScript for the walkthrough and any menu, because that is what the site already is.
- Fonts: Archivo Narrow Bold for the exam names, Schibsted Grotesk for everything else, as in the approved mockup. Both are free and self-hosted. The old Adobe Fonts kit is removed.
- Secondary text uses a muted slate on white. Buttons are navy with white text.
- On desktop, the navy column stays in view while the white side scrolls.
- The first-screen "Free trial" button goes to the contact form. WhatsApp links open with a short pre-written greeting.
- The form's subject choices are Mathematics, Physics, Chemistry and Biology, with the last two marked as IGCSE only.
- The form asks for name, email, phone, exam, subject and message, with only name, a way to reach the family (email or phone), and message required. It gets a honeypot field to reduce spam.
- The exams section lists only the exams and subjects. It names no exam boards, syllabus levels or topic lists, since none are confirmed, and it can be extended later.
- The walkthrough has no voice narration; tapping through lines is quieter and works on a silent phone.
- Headline and section wording in the mockups are drafts. Final copy should be plain, in sentence case, and contain no selling language beyond the facts.

## Left to the builder

Spacing, the type scale, breakpoints, hover and focus states, the phone menu, the form's thank-you state, page titles and meta descriptions (mentioning IGCSE, IB and A-level), and the small motion moment on load, if any.

## Done means

Viewed at 320, 375, 768, 1024 and 1440 wide, all content is present and correct against "Facts"; the form submits on the deploy preview and appears in the Netlify `contact` form; WhatsApp and email links open correctly; old addresses redirect; and Bernard has approved the preview before it goes live.
