const SECTION_LINE = 120;

function initMenu() {
  const links = Array.from(document.querySelectorAll('.desk-nav a, .menu nav a'));
  const menu = document.querySelector('details.menu');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  let queued = false;

  function currentId() {
    const root = document.documentElement;
    if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) return sections[sections.length - 1].id;
    const passed = sections.filter((section) => section.getBoundingClientRect().top <= SECTION_LINE);
    return passed.length ? passed[passed.length - 1].id : 'top';
  }

  function mark() {
    queued = false;
    const id = currentId();
    links.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function queue() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(mark);
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  links.forEach((link) => link.addEventListener('click', () => { menu.open = false; }));
  mark();
}

initMenu();
