"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Links wrap decorative chrome (index numbers, arrows, year stamps), so raw
// textContent reads like "01Work06 projects". Prefer real labels, then fall
// back to visible text with the decoration stripped.
const labelSelector = [
  ".menu-item-label",
  ".rail-card-title",
  ".index-row-title",
  ".photo-frame-caption > span:first-child",
  "[data-transition-title]",
].join(",");

function readLabel(anchor: HTMLAnchorElement) {
  const explicit = anchor.dataset.transitionLabel?.trim();
  if (explicit) return explicit;

  const labelled = anchor.querySelector<HTMLElement>(labelSelector)?.textContent?.trim();
  if (labelled) return labelled;

  const clone = anchor.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll(
      "[aria-hidden='true'], .sr-only, .menu-item-index, .menu-item-meta, .rail-card-meta, .rail-card-index, .index-row-number, .index-row-side, .photo-frame-caption, .button-arrow",
    )
    .forEach((node) => node.remove());

  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

export default function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const animating = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("route-changing");
    };
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!animating.current) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const label = labelRef.current;
    if (!overlay || !panel || !label) return;

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        overlay.classList.remove("is-active");
        document.documentElement.classList.remove("route-changing");
        gsap.set(overlay, { autoAlpha: 0 });
        // Drop the full-screen filter as soon as the curtain is gone so no
        // blurred layer stays alive behind the page.
        gsap.set(panel, { filter: "none" });
      },
    });

    tl.to(label, {
      autoAlpha: 0,
      y: -18,
      filter: "blur(10px)",
      duration: 0.25,
      ease: "power2.in",
    }).to(panel, {
      yPercent: -100,
      // No filter on the sheet: a full-screen blur costs a re-raster per
      // frame on the exit and reads as nothing on flat ink.
      duration: 0.7,
      ease: "expo.inOut",
    });
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.target || anchor.hasAttribute("download") || anchor.dataset.noTransition !== undefined) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (href.startsWith("#") || href === pathname || href === `${pathname}/`) return;
      if (href.includes("#")) return;
      if (animating.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const overlay = overlayRef.current;
      const panel = panelRef.current;
      const label = labelRef.current;
      if (!overlay || !panel || !label) return;

      event.preventDefault();
      event.stopPropagation();
      animating.current = true;

      const text = (readLabel(anchor) || "Next page").replace(/\s+/g, " ").slice(0, 64);
      label.textContent = text || "Next page";

      overlay.classList.add("is-active");
      document.documentElement.classList.add("route-changing");
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(panel, { yPercent: 100 });
      gsap.set(label, { autoAlpha: 0, y: 24, filter: "blur(12px)" });

      gsap
        .timeline()
        .to(panel, { yPercent: 0, duration: 0.62, ease: "expo.inOut" })
        .to(
          label,
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
          "-=0.25",
        );

      window.setTimeout(() => {
        router.push(href);
      }, 550);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  return (
    <div ref={overlayRef} className="route-transition" aria-hidden="true">
      <div ref={panelRef} className="route-transition-panel">
        <div className="route-transition-grid" />
        <span className="route-transition-kicker">Portfolio / Navigating</span>
        <span ref={labelRef} className="route-transition-label">
          Next page
        </span>
        <span className="route-transition-foot">Yogyakarta — 2026</span>
      </div>
    </div>
  );
}
