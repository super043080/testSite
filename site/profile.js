function initProfile(panel) {
  const close = panel.querySelector('#profile-close');
  const toggle = panel.querySelector('summary');

  function openFromAddress() {
    if (window.location.hash === '#profile') panel.open = true;
  }

  close.hidden = false;
  close.addEventListener('click', () => {
    panel.open = false;
    toggle.focus({ preventScroll: true });
    toggle.scrollIntoView({ block: 'center' });
  });
  window.addEventListener('hashchange', openFromAddress);
  openFromAddress();
}

initProfile(document.getElementById('profile'));
