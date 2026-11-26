"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGSAP, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const splitSelector = "main h1, main h2, main h3, main .text-lede";

/** A masked line reveal. Shared by the initial pass and the resize rebuild. */
function createLineReveal(el: HTMLElement, trackTrigger: (trigger: ScrollTrigger) => void) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    aria: "none",
    autoSplit: false,
    onSplit: (self) => {
      // The CSS hide is a pre-hydration guard; split parents hand the
      // reveal to their masked lines, so clear it before animating.
      gsap.set(el, { autoAlpha: 1, y: 0 });
      const lineTl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onComplete: () => {
          gsap.set(el, { clearProps: "filter" });
          el.classList.add("is-revealed");
        },
      });

      if (lineTl.scrollTrigger) trackTrigger(lineTl.scrollTrigger);

      lineTl
        .from(self.lines, {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.07,
          ease: "expo.out",
        })
        // One filter on the heading block instead of one per line: the
        // focus pull costs a single raster per section.
        .fromTo(
          el,
          { filter: "blur(8px)" },
          { filter: "blur(0px)", duration: 0.9, ease: "power2.out" },
          0,
        );

      return lineTl;
    },
  });
}

export default function SiteMotion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("motion")) return;

      // ── Reveal: headings and blocks that are not split ─────────────
      const revealEls = gsap.utils.toArray<HTMLElement>("main [data-reveal]");
      for (const el of revealEls) {
        if (el.closest("[data-no-reveal]")) continue;

        const kind = el.dataset.reveal;
        if (kind === "hero" || kind === "pop") continue;

        const willSplit =
          el.matches("h1, h2, h3, .text-lede") &&
          el.dataset.noSplit === undefined &&
          !el.closest("[data-work-card]");

        if (willSplit || el.matches("[data-split]")) continue;

        const delay = Number(el.dataset.delay ?? 0) / 1000;

        if (kind === "media") {
          // The wipe alone reads as a print developing; the 18px blur that
          // used to ride with it re-rastered a large image every frame.
          const tl = gsap.timeline({
            delay,
            scrollTrigger: { trigger: el, start: "top 84%", once: true },
            onComplete: () => {
              gsap.set(el, { clipPath: "none" });
              el.classList.add("is-revealed");
            },
          });

          tl.fromTo(
            el,
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.15, ease: "expo.out" },
            0,
          );
          continue;
        }

        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onComplete: () => el.classList.add("is-revealed"),
          },
        );
      }

      // ── Split: one line at a time, out of a mask ────────────────────
      // Set up in its own effect (below) so the reading faces are loaded
      // first and the measuring work is spread across frames.

      // ── Parallax: CSS translate so it composes with CSS animations ──
      // Photographs deliberately stay out of this: on a grid of plates the
      // per-frame variable writes cost more than the few pixels of drift.
      const parallaxEls = gsap.utils.toArray<HTMLElement>(
        "[data-parallax], .ornament, .dot-grid",
      );
      const seen = new Set<HTMLElement>();

      for (const el of parallaxEls) {
        if (seen.has(el)) continue;
        if (
          el.closest("[data-portrait], .portrait-plate, .ticker, dialog, .loader") ||
          el.classList.contains("curve-underline") ||
          el.classList.contains("ticker-spark") ||
          el.classList.contains("inset-0")
        ) {
          continue;
        }

        seen.add(el);

        const isOrnament = el.classList.contains("ornament");
        const speed = Number.parseFloat(el.dataset.speed ?? "") || (isOrnament ? 0.14 : 0.1);
        const max = Number.parseFloat(el.dataset.max ?? "") || (isOrnament ? 60 : 34);
        const axis = el.dataset.axis;

        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const progress = (self.progress - 0.5) * 2;
            const offset = Math.max(-max, Math.min(max, progress * speed * 420));

            if (axis === "x") {
              el.style.setProperty("--parallax-x", `${offset.toFixed(1)}px`);
              el.style.setProperty("--parallax-y", "0px");
            } else if (axis === "xy") {
              el.style.setProperty("--parallax-x", `${(offset * 0.45).toFixed(1)}px`);
              el.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
            } else {
              el.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
            }
          },
        });
      }

      // ── Marquees rest while off screen ──────────────────────────────
      const pausable = gsap.utils.toArray<HTMLElement>("[data-fx-pause]");
      let pauseObserver: IntersectionObserver | undefined;
      if (pausable.length && "IntersectionObserver" in window) {
        pauseObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              entry.target.classList.toggle("is-offscreen", !entry.isIntersecting);
            }
          },
          { rootMargin: "180px 0px" },
        );
        for (const el of pausable) pauseObserver.observe(el);
      }

      // ── Keep trigger positions honest while images stream in ────────
      // One scroll can land a dozen lazy images at once. Each load used to
      // queue its own full refresh, so the same whole-document layout ran a
      // dozen times in a row - the single biggest source of stutter on the
      // first pass down a page. Coalesce them into one.
      let refreshTimer = 0;
      const scheduleRefresh = (delay = 140) => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          refreshTimer = 0;
          ScrollTrigger.refresh();
        }, delay);
      };

      const onImageLoad = (event: Event) => {
        if (event.target instanceof HTMLImageElement) scheduleRefresh();
      };

      const onResize = () => scheduleRefresh();

      document.addEventListener("load", onImageLoad, true);
      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(() => scheduleRefresh(0));

      return () => {
        pauseObserver?.disconnect();
        document.removeEventListener("load", onImageLoad, true);
        window.removeEventListener("resize", onResize);
        window.clearTimeout(refreshTimer);
      };
    },
    { dependencies: [pathname] },
  );

  // ── Split headings, after the fonts and one element per frame ───────
  // `autoSplit` re-measures every split heading whenever the browser
  // finishes a font batch, and each measure forces a full-document layout.
  // On this page a single late face (the mono's 500 cut) cost ~0.5s of main
  // thread. So: load the faces the headings need, then split once, spaced
  // across frames, and only rebuild on a real width change.
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("motion")) return;

    const els = gsap.utils
      .toArray<HTMLElement>(splitSelector)
      .filter(
        (el) =>
          el.dataset.noSplit === undefined &&
          !el.closest(
            "[data-no-split], [data-statement], [data-work-card], dialog, .loader",
          ),
      );
    if (!els.length) return;

    const splits: SplitText[] = [];
    const triggers = new Set<ScrollTrigger>();
    const trackTrigger = (trigger: ScrollTrigger) => triggers.add(trigger);
    const discard = () => {
      for (const trigger of triggers) trigger.kill();
      triggers.clear();
      for (const split of splits.splice(0)) split.revert();
    };
    let queue: HTMLElement[] = [];
    let frame = 0;
    let resizeTimer = 0;
    let cancelled = false;
    let width = window.innerWidth;

    const step = () => {
      frame = 0;
      const el = queue.shift();
      if (!el) return;
      if (el.isConnected) splits.push(createLineReveal(el, trackTrigger));
      if (queue.length) frame = requestAnimationFrame(step);
    };

    const run = () => {
      if (cancelled) return;
      queue = els.filter((el) => el.isConnected);
      if (!frame) frame = requestAnimationFrame(step);
    };

    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        discard();
        run();
      }, 240);
    };

    const faces = [
      '400 1rem "Newsreader Variable"',
      'italic 400 1rem "Newsreader Variable"',
      '400 1rem "Inter Variable"',
      '400 1rem "IBM Plex Mono"',
      '500 1rem "IBM Plex Mono"',
    ];
    const fontsReady = document.fonts
      ? Promise.all(faces.map((face) => document.fonts.load(face).catch(() => [])))
      : Promise.resolve([]);
    const fallback = new Promise((resolve) => window.setTimeout(resolve, 1600));

    Promise.race([fontsReady, fallback]).then(() => {
      if (!cancelled) run();
    });
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      discard();
    };
  }, [pathname]);

  return null;
}
