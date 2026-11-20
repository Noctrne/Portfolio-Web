const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver: IntersectionObserver | null = null;
let cleanupHeader: (() => void) | null = null;

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

function setMenu(open: boolean) {
  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-mobile-panel]');
  const label = toggle?.querySelector<HTMLElement>('[data-menu-text]');

  toggle?.classList.toggle('is-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  if (label) label.textContent = open ? 'Close' : 'Menu';

  if (panel) {
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
  }

  document.body.classList.toggle('no-scroll', open);
}

function initHeader() {
  cleanupHeader?.();

  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  let ticking = false;

  const update = () => {
    const y = Math.max(window.scrollY, 0);
    header.dataset.condensed = String(y > 8);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanupHeader = () => window.removeEventListener('scroll', onScroll);
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
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
    return;
  }

  const filter = target.closest<HTMLElement>('[data-filter]');
  if (filter?.dataset.filter) {
    applyFilter(filter.dataset.filter);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

document.addEventListener('astro:page-load', () => {
  initReveal();
  initHeader();
  setMenu(false);
});

document.addEventListener('astro:before-swap', () => {
  cleanupHeader?.();
  setMenu(false);
});

window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

reduceMotion.addEventListener('change', initReveal);

initReveal();
initHeader();
