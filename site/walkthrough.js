function initWalkthrough(root) {
  const lines = Array.from(root.querySelectorAll('ol li'));
  const next = root.querySelector('#worked-next');
  let shown = 1;

  function render() {
    lines.forEach((line, index) => { line.hidden = index >= shown; });
    next.textContent = shown >= lines.length ? 'Start again' : 'Show the next line';
  }

  next.addEventListener('click', () => {
    shown = shown >= lines.length ? 1 : shown + 1;
    render();
  });

  next.hidden = false;
  render();
}

initWalkthrough(document.getElementById('worked'));
