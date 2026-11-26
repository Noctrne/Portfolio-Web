"use client";

import { usePathname } from "next/navigation";
import { useGSAP, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

export default function SiteMotion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("motion")) return;

      const splits: SplitText[] = [];
      const refreshTimers: number[] = [];

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
          // Two tracks: the wipe is snappy, the focus pull is softer, so the
          // image resolves out of depth instead of snapping into place.
          const tl = gsap.timeline({
            delay,
            scrollTrigger: { trigger: el, start: "top 84%", once: true },
            onComplete: () => gsap.set(el, { clipPath: "none", filter: "none" }),
          });

          tl.fromTo(
            el,
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.15, ease: "expo.out" },
            0,
          ).fromTo(
            el,
            { filter: "blur(18px)" },
            { filter: "blur(0px)", duration: 1.35, ease: "power2.out" },
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
          },
        );
      }

      // ── Split: one line at a time, out of a mask ────────────────────
      const splitEls = gsap.utils.toArray<HTMLElement>(
        "main h1, main h2, main h3, main .text-lede",
      );
      for (const el of splitEls) {
        if (
          el.dataset.noSplit !== undefined ||
          el.closest("[data-no-split], [data-statement], [data-work-card], dialog, .loader")
        ) {
          continue;
        }

        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          aria: "none",
          autoSplit: true,
          onSplit: (self) => {
            // The CSS hide is a pre-hydration guard; split parents hand the
            // reveal to their masked lines, so clear it before animating.
            gsap.set(el, { autoAlpha: 1, y: 0 });
            const lineTl = gsap.timeline({
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              onComplete: () => gsap.set(el, { clearProps: "filter" }),
            });

            lineTl
              .from(self.lines, {
                yPercent: 115,
                duration: 0.9,
                stagger: 0.07,
                ease: "expo.out",
              })
              // One filter on the heading block instead of one per line:
              // the focus pull costs a single raster per section.
              .fromTo(
                el,
                { filter: "blur(8px)" },
                { filter: "blur(0px)", duration: 0.9, ease: "power2.out" },
                0,
              );

            return lineTl;
          },
        });
        splits.push(split);
      }

      // ── Parallax: CSS translate so it composes with CSS animations ──
      const parallaxEls = gsap.utils.toArray<HTMLElement>(
        "[data-parallax], [data-parallax-media], .ornament, .dot-grid",
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

        const media = el.hasAttribute("data-parallax-media");
        const isOrnament = el.classList.contains("ornament");
        const speed = Number.parseFloat(el.dataset.speed ?? "") || (media ? 0.08 : isOrnament ? 0.14 : 0.1);
        const max =
          Number.parseFloat(el.dataset.max ?? "") || (media ? 24 : isOrnament ? 60 : 34);
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

      // ── Keep trigger positions honest while images stream in ────────
      const scheduleRefresh = () => {
        const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
        refreshTimers.push(timer);
      };

      const onImageLoad = (event: Event) => {
        if (event.target instanceof HTMLImageElement) scheduleRefresh();
      };

      document.addEventListener("load", onImageLoad, true);
      window.addEventListener("resize", scheduleRefresh);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        document.removeEventListener("load", onImageLoad, true);
        window.removeEventListener("resize", scheduleRefresh);
        for (const timer of refreshTimers) window.clearTimeout(timer);
        for (const split of splits) split.revert();
      };
    },
    { dependencies: [pathname] },
  );

  return null;
}
