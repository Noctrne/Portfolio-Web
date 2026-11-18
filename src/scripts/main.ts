const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver: IntersectionObserver | null = null;

function initReveal() {
  revealObserver?.disconnect();

  const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );

  items.forEach((item) => revealObserver?.observe(item));
}

function closeMenu() {
  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');

  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-open');
  }

  if (menu) menu.hidden = true;

  document.body.classList.remove('no-scroll');
}

function applyFilter(value: string) {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-work]'));
  if (items.length === 0) return;

  for (const item of items) {
    const matches = value === 'all' || item.dataset.category === value;
    item.hidden = !matches;
    if (matches) item.classList.add('is-visible');
  }

  for (const button of document.querySelectorAll<HTMLElement>('[data-filter]')) {
    const active = button.dataset.filter === value;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-active', active);
  }

  const visible = items.filter((item) => !item.hidden).length;
  const count = document.querySelector<HTMLElement>('[data-work-count]');
  if (count) count.textContent = String(visible).padStart(2, '0');
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const toggle = target.closest<HTMLElement>('[data-menu-toggle]');
  if (toggle) {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;

    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.classList.toggle('is-open', !isOpen);
    menu.hidden = isOpen;
    document.body.classList.toggle('no-scroll', !isOpen);
    return;
  }

  const filter = target.closest<HTMLElement>('[data-filter]');
  if (filter?.dataset.filter) {
    applyFilter(filter.dataset.filter);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.addEventListener('astro:page-load', () => {
  initReveal();
  closeMenu();
});

document.addEventListener('astro:before-swap', closeMenu);

reduceMotion.addEventListener('change', initReveal);

initReveal();
