const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver: IntersectionObserver | null = null;
let cleanupHeader: (() => void) | null = null;
let cleanupParallax: (() => void) | null = null;

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

function initParallax() {
  cleanupParallax?.();
  cleanupParallax = null;

  const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-scene]'));
  if (scenes.length === 0 || reduceMotion.matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let frame = 0;

  const setPosition = (event: PointerEvent) => {
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const mx = (event.clientX - rect.left) / rect.width - 0.5;
      const my = (event.clientY - rect.top) / rect.height - 0.5;

      scene.style.setProperty('--mx', Math.max(-1, Math.min(1, mx * 2)).toFixed(3));
      scene.style.setProperty('--my', Math.max(-1, Math.min(1, my * 2)).toFixed(3));
    }
    frame = 0;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (frame) return;
    frame = requestAnimationFrame(() => setPosition(event));
  };

  const reset = () => {
    for (const scene of scenes) {
      scene.style.setProperty('--mx', '0');
      scene.style.setProperty('--my', '0');
    }
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('mouseleave', reset);
  cleanupParallax = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('mouseleave', reset);
    reset();
  };
}

let cleanupTilt: (() => void) | null = null;

function initTilt() {
  cleanupTilt?.();
  cleanupTilt = null;

  if (reduceMotion.matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const plates = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
  if (plates.length === 0) return;

  const cleanups: Array<() => void> = [];

  for (const plate of plates) {
    let frame = 0;
    let nx = 0;
    let ny = 0;

    const apply = () => {
      plate.style.setProperty('--rx', `${(-ny * 4).toFixed(2)}deg`);
      plate.style.setProperty('--ry', `${(nx * 5).toFixed(2)}deg`);
      plate.style.setProperty('--px', `${(-nx * 15).toFixed(2)}px`);
      plate.style.setProperty('--py', `${(-ny * 11).toFixed(2)}px`);
      frame = 0;
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      nx = 0;
      ny = 0;
      plate.classList.remove('is-hover');
      plate.style.removeProperty('--rx');
      plate.style.removeProperty('--ry');
      plate.style.removeProperty('--px');
      plate.style.removeProperty('--py');
    };

    const onEnter = () => plate.classList.add('is-hover');

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;

      const rect = plate.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      nx = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5));
      ny = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5));

      if (!frame) frame = requestAnimationFrame(apply);
    };

    plate.addEventListener('pointerenter', onEnter);
    plate.addEventListener('pointermove', onMove, { passive: true });
    plate.addEventListener('pointerleave', reset);

    cleanups.push(() => {
      reset();
      plate.removeEventListener('pointerenter', onEnter);
      plate.removeEventListener('pointermove', onMove);
      plate.removeEventListener('pointerleave', reset);
    });
  }

  cleanupTilt = () => {
    for (const cleanup of cleanups) cleanup();
  };
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

function applyGalleryFilter(value: string) {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-card]'));
  if (cards.length === 0) return;

  for (const card of cards) {
    const matches = value === 'all' || card.dataset.medium === value;
    card.hidden = !matches;
    if (matches) card.classList.add('is-visible');
  }

  for (const button of document.querySelectorAll<HTMLElement>('[data-gallery-filter]')) {
    const active = button.dataset.galleryFilter === value;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-active', active);
  }

  const visible = cards.filter((card) => !card.hidden).length;
  const count = document.querySelector<HTMLElement>('[data-gallery-count]');
  if (count) count.textContent = String(visible).padStart(2, '0');
}

type GalleryState = {
  items: HTMLElement[];
  index: number;
  trigger: HTMLElement | null;
};

let galleryState: GalleryState | null = null;

function visibleGalleryItems() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-item]')).filter((item) => {
    const card = item.closest<HTMLElement>('[data-gallery-card]');
    return !card?.hidden;
  });
}

function renderGallery() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-gallery-lightbox]');
  if (!dialog || !galleryState) return;

  const current = galleryState.items[galleryState.index];
  if (!current) return;

  const setText = (selector: string, value: string | undefined) => {
    const node = dialog.querySelector<HTMLElement>(selector);
    if (node) node.textContent = value ?? '';
  };

  const total = String(galleryState.items.length).padStart(2, '0');
  setText('[data-lb-counter]', `${current.dataset.plate ?? '01'} / ${total}`);
  setText('[data-lb-medium]', current.dataset.medium);
  setText('[data-lb-title]', current.dataset.title);
  setText('[data-lb-year]', current.dataset.year);
  setText('[data-lb-description]', current.dataset.description);

  const description = dialog.querySelector<HTMLElement>('[data-lb-description]');
  if (description) description.hidden = !current.dataset.description;

  const media = dialog.querySelector<HTMLElement>('[data-lb-media]');
  if (!media) return;
  media.replaceChildren();

  if (current.dataset.video) {
    const video = document.createElement('video');
    video.src = current.dataset.video;
    video.poster = current.dataset.poster ?? current.dataset.src ?? '';
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-label', current.dataset.title ?? 'Video');
    media.append(video);
  } else if (current.dataset.src) {
    const image = document.createElement('img');
    image.src = current.dataset.src;
    image.alt = current.dataset.alt ?? '';
    media.append(image);
  }

  const single = galleryState.items.length <= 1;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]');
  const next = dialog.querySelector<HTMLButtonElement>('[data-lb-next]');
  if (prev) prev.disabled = single;
  if (next) next.disabled = single;
}

function openGallery(trigger: HTMLElement) {
  const dialog = document.querySelector<HTMLDialogElement>('[data-gallery-lightbox]');
  if (!dialog) return;

  const items = visibleGalleryItems();
  const index = items.indexOf(trigger);

  galleryState = { items, index: index < 0 ? 0 : index, trigger };
  renderGallery();

  if (!dialog.open) dialog.showModal();
  document.body.classList.add('no-scroll');
  dialog.querySelector<HTMLElement>('[data-lb-close]')?.focus();
}

function stepGallery(delta: number) {
  if (!galleryState || galleryState.items.length === 0) return;
  const total = galleryState.items.length;
  galleryState.index = (galleryState.index + delta + total) % total;
  renderGallery();
}

function closeGallery() {
  document.querySelector<HTMLDialogElement>('[data-gallery-lightbox]')?.close();
}

function initGallery() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-gallery-lightbox]');
  if (!dialog || dialog.dataset.bound === 'true') return;
  dialog.dataset.bound = 'true';

  dialog.querySelector('[data-lb-close]')?.addEventListener('click', closeGallery);
  dialog.querySelector('[data-lb-prev]')?.addEventListener('click', () => stepGallery(-1));
  dialog.querySelector('[data-lb-next]')?.addEventListener('click', () => stepGallery(1));

  dialog.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    const media = dialog.querySelector<HTMLElement>('[data-lb-media]');
    media?.replaceChildren();
    const trigger = galleryState?.trigger;
    galleryState = null;
    trigger?.focus();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLElement && event.target.closest('video')) return;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepGallery(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepGallery(-1);
    }
  });
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

  const galleryTrigger = target.closest<HTMLElement>('[data-gallery-item]');
  if (galleryTrigger) {
    event.preventDefault();
    openGallery(galleryTrigger);
    return;
  }

  const galleryFilter = target.closest<HTMLElement>('[data-gallery-filter]');
  if (galleryFilter?.dataset.galleryFilter) {
    applyGalleryFilter(galleryFilter.dataset.galleryFilter);
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
  initParallax();
  initTilt();
  initGallery();
  setMenu(false);
});

document.addEventListener('astro:before-swap', () => {
  cleanupHeader?.();
  cleanupParallax?.();
  cleanupTilt?.();
  closeGallery();
  setMenu(false);
});

window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

reduceMotion.addEventListener('change', () => {
  initReveal();
  initParallax();
  initTilt();
});

initReveal();
initHeader();
initParallax();
initTilt();
initGallery();
