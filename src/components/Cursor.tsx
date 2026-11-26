"use client";

import { useEffect, useRef } from "react";

/**
 * The pointer gets its own printed mark: a dot that tracks exactly and a ring
 * that trails it. Positions are written straight onto the two elements as
 * transforms, and the loop parks itself once the mark has settled, so an idle
 * page does no style work at all.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !dot || !ring || !label) return;

    document.documentElement.classList.add("cursor-ready");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let dotX = -1;
    let dotY = -1;
    let ringDrawnX = -1;
    let ringDrawnY = -1;
    let frame = 0;
    let visible = false;
    let surfaceTimer = 0;

    const setSurface = (node: Element | null) => {
      const next = Boolean(
        node?.closest(".theme-signal, .route-transition, .loader-underlay"),
      );
      root.classList.toggle("is-on-signal", next);
    };

    const setSurfaceAtPointer = () => {
      setSurface(document.elementFromPoint(targetX, targetY));
    };

    const render = () => {
      frame = 0;

      if (Math.abs(targetX - dotX) > 0.05 || Math.abs(targetY - dotY) > 0.05) {
        dotX = targetX;
        dotY = targetY;
        dot.style.transform = `translate3d(${dotX.toFixed(1)}px, ${dotY.toFixed(
          1,
        )}px, 0) translate(-50%, -50%)`;
      }

      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;

      if (
        Math.abs(ringX - ringDrawnX) > 0.05 ||
        Math.abs(ringY - ringDrawnY) > 0.05
      ) {
        ringDrawnX = ringX;
        ringDrawnY = ringY;
        ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(
          1,
        )}px, 0) translate(-50%, -50%)`;
      }

      // Keep going only while the ring is still catching up.
      if (Math.abs(targetX - ringX) > 0.08 || Math.abs(targetY - ringY) > 0.08) {
        frame = requestAnimationFrame(render);
      }
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      setSurface(event.target instanceof Element ? event.target : null);
      if (!visible) {
        visible = true;
        root.classList.add("is-visible");
      }
      wake();
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      setSurface(target);
      const interactive = target.closest<HTMLElement>("[data-cursor], a, button, summary, label");
      const dataLabel = interactive?.getAttribute("data-cursor");

      root.classList.toggle("is-interactive", Boolean(interactive));
      root.classList.toggle("is-labelled", Boolean(dataLabel));
      label.textContent = dataLabel || "";
    };

    // Scrolling moves a different surface under a still pointer. Checking that
    // costs a hit test, so keep it to a few times a second at most.
    const onScroll = () => {
      if (!visible || surfaceTimer) return;
      surfaceTimer = window.setTimeout(() => {
        surfaceTimer = 0;
        setSurfaceAtPointer();
      }, 160);
    };

    const onDown = () => root.classList.add("is-down");
    const onUp = () => root.classList.remove("is-down");
    const onLeave = () => {
      visible = false;
      root.classList.remove("is-visible");
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setSurfaceAtPointer);
    wake();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (surfaceTimer) window.clearTimeout(surfaceTimer);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setSurfaceAtPointer);
      document.documentElement.classList.remove("cursor-ready");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <span ref={dotRef} className="cursor-dot" />
      <span ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </span>
    </div>
  );
}
