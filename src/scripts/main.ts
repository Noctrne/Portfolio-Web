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

let cleanupPortrait: (() => void) | null = null;

function initPortrait() {
  cleanupPortrait?.();
  cleanupPortrait = null;

  const plate = document.querySelector<HTMLElement>('[data-portrait]');
  if (!plate) return;
  if (reduceMotion.matches) return;

  const frame = plate.querySelector<HTMLElement>('[data-portrait-frame]');
  if (!frame) return;

  const coarseQuery = window.matchMedia('(hover: none), (pointer: coarse)');

  type Key = 'rx' | 'ry' | 'tx' | 'ty' | 'ox' | 'oy';

  const keys: Key[] = ['rx', 'ry', 'tx', 'ty', 'ox', 'oy'];
  const units: Record<Key, string> = {
    rx: 'deg',
    ry: 'deg',
    tx: 'px',
    ty: 'px',
    ox: 'px',
    oy: 'px',
  };

  const target: Record<Key, number> = { rx: 0, ry: 0, tx: 0, ty: 0, ox: 0, oy: 0 };
  const current = { ...target };

  let near = 0;
  let nearTarget = 0;
  let open = 0;
  let openTarget = 0;
  let focusing = false;
  let raf = 0;

  let autoOn = false;
  let autoStart = 0;
  let autoDelay = 0;
  let isVisible = false;
  let touching = false;
  let touchId = -1;
  let userTookOver = false;

  const apply = () => {
    for (const key of keys) {
      plate.style.setProperty(`--${key}`, `${current[key].toFixed(3)}${units[key]}`);
    }
    plate.style.setProperty('--near', near.toFixed(3));
    plate.style.setProperty('--open', open.toFixed(3));
    plate.style.setProperty('--zoom', (1 + open * 0.18).toFixed(3));
  };

  const tick = () => {
    let moving = false;

    if (autoOn) {
      const seconds = (performance.now() - autoStart) / 1000;
      const mx = 50 + 15 * Math.sin(seconds * 0.45);
      const my = 43 + 10 * Math.sin(seconds * 0.62);
      plate.style.setProperty('--mx', `${mx.toFixed(2)}%`);
      plate.style.setProperty('--my', `${my.toFixed(2)}%`);
      openTarget = 0.76 + 0.16 * Math.sin(seconds * 0.85 + 0.4);
      moving = true;
    }

    for (const key of keys) {
      const delta = target[key] - current[key];
      if (Math.abs(delta) > 0.002) {
        current[key] += delta * 0.16;
        moving = true;
      } else {
        current[key] = target[key];
      }
    }

    const deltaNear = nearTarget - near;
    if (Math.abs(deltaNear) > 0.002) {
      near += deltaNear * 0.16;
      moving = true;
    } else {
      near = nearTarget;
    }

    const deltaOpen = openTarget - open;
    if (Math.abs(deltaOpen) > 0.002) {
      open += deltaOpen * 0.16;
      moving = true;
    } else {
      open = openTarget;
    }

    apply();

    if (moving || autoOn) {
      raf = requestAnimationFrame(tick);
      return;
    }

    raf = 0;
    if (near === 0 && !focusing) plate.classList.remove('is-near');
  };

  const start = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const setLoupePoint = (x: number, y: number) => {
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const lx = Math.min(Math.max(x, rect.left), rect.right);
    const ly = Math.min(Math.max(y, rect.top), rect.bottom);
    plate.style.setProperty('--mx', `${(((lx - rect.left) / rect.width) * 100).toFixed(2)}%`);
    plate.style.setProperty('--my', `${(((ly - rect.top) / rect.height) * 100).toFixed(2)}%`);
  };

  const stopAuto = () => {
    autoOn = false;
  };

  const startAuto = () => {
    if (!coarseQuery.matches || reduceMotion.matches) return;
    if (!isVisible || touching || autoOn || userTookOver) return;

    autoOn = true;
    autoStart = performance.now();
    nearTarget = 0;
    focusing = false;
    plate.classList.remove('is-focus');
    openTarget = 0.8;
    start();
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    if (coarseQuery.matches) return;
    if (autoOn) stopAuto();

    const rect = frame.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const { clientX: x, clientY: y } = event;
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    const gapX = Math.max(rect.left - x, 0, x - rect.right);
    const gapY = Math.max(rect.top - y, 0, y - rect.bottom);
    const distance = Math.hypot(gapX, gapY);

    nearTarget = Math.max(0, 1 - distance / 320);
    if (nearTarget > 0.01) plate.classList.add('is-near');

    const nx = Math.max(-0.5, Math.min(0.5, (x - rect.left) / rect.width - 0.5));
    const ny = Math.max(-0.5, Math.min(0.5, (y - rect.top) / rect.height - 0.5));

    target.rx = -ny * 2.6 * nearTarget;
    target.ry = nx * 3.4 * nearTarget;
    target.tx = nx * 13 * nearTarget;
    target.ty = ny * 10 * nearTarget;
    target.ox = -nx * 16 * nearTarget;
    target.oy = -ny * 13 * nearTarget;

    if (nearTarget > 0.001) setLoupePoint(x, y);

    openTarget = inside ? 1 : nearTarget;

    if (inside) {
      focusing = true;
      plate.classList.add('is-focus');
    } else {
      focusing = false;
      plate.classList.remove('is-focus');
    }

    start();
  };

  const onTouchStart = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return;
    if (touching) return;

    touching = true;
    touchId = event.pointerId;
    userTookOver = true;
    stopAuto();
    if (autoDelay) {
      clearTimeout(autoDelay);
      autoDelay = 0;
    }

    setLoupePoint(event.clientX, event.clientY);
    openTarget = 1;
    nearTarget = 1;
    focusing = true;
    plate.classList.add('is-near', 'is-focus');
    start();
  };

  const onTouchMove = (event: PointerEvent) => {
    if (!touching || event.pointerId !== touchId) return;
    setLoupePoint(event.clientX, event.clientY);
    start();
  };

  const onTouchEnd = () => {
    if (!touching) return;

    touching = false;
    touchId = -1;
    focusing = false;
    nearTarget = 0;
    plate.classList.remove('is-focus');
  };

  const reset = () => {
    if (touching || autoOn) return;

    nearTarget = 0;
    openTarget = 0;
    focusing = false;
    plate.classList.remove('is-focus');
    plate.classList.remove('is-near');
    for (const key of keys) target[key] = 0;
    start();
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') reset();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        isVisible = entry.isIntersecting;

        if (!isVisible) {
          stopAuto();
          userTookOver = false;
          if (autoDelay) {
            clearTimeout(autoDelay);
            autoDelay = 0;
          }
          continue;
        }

        if (autoDelay) clearTimeout(autoDelay);
        autoDelay = window.setTimeout(() => {
          autoDelay = 0;
          if (!touching) startAuto();
        }, 700);
      }
    },
    { threshold: 0.35 },
  );
  observer.observe(plate);

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('blur', reset);
  document.addEventListener('pointerleave', onPointerLeave);
  frame.addEventListener('pointerdown', onTouchStart, { passive: true });
  frame.addEventListener('pointermove', onTouchMove, { passive: true });
  frame.addEventListener('pointerup', onTouchEnd);
  frame.addEventListener('pointercancel', onTouchEnd);

  cleanupPortrait = () => {
    if (raf) cancelAnimationFrame(raf);
    if (autoDelay) clearTimeout(autoDelay);
    autoOn = false;
    observer.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('blur', reset);
    document.removeEventListener('pointerleave', onPointerLeave);
    frame.removeEventListener('pointerdown', onTouchStart);
    frame.removeEventListener('pointermove', onTouchMove);
    frame.removeEventListener('pointerup', onTouchEnd);
    frame.removeEventListener('pointercancel', onTouchEnd);
    plate.classList.remove('is-focus', 'is-near');
    for (const key of keys) plate.style.removeProperty(`--${key}`);
    plate.style.removeProperty('--mx');
    plate.style.removeProperty('--my');
    plate.style.removeProperty('--near');
    plate.style.removeProperty('--open');
    plate.style.removeProperty('--zoom');
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
  initPortrait();
  initGallery();
  setMenu(false);
});

document.addEventListener('astro:before-swap', () => {
  cleanupHeader?.();
  cleanupParallax?.();
  cleanupTilt?.();
  cleanupPortrait?.();
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
  initPortrait();
});

initReveal();
initHeader();
initParallax();
initTilt();
initPortrait();
initGallery();
