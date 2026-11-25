"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    const root = rootRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !ring || !label) return;

    document.documentElement.classList.add("cursor-ready");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;
    let visible = false;

    const render = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      root.style.setProperty("--cursor-x", `${targetX.toFixed(1)}px`);
      root.style.setProperty("--cursor-y", `${targetY.toFixed(1)}px`);
      root.style.setProperty("--ring-x", `${ringX.toFixed(1)}px`);
      root.style.setProperty("--ring-y", `${ringY.toFixed(1)}px`);
      frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        root.classList.add("is-visible");
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest<HTMLElement>("[data-cursor], a, button, summary, label");
      const dataLabel = interactive?.getAttribute("data-cursor");

      root.classList.toggle("is-interactive", Boolean(interactive));
      root.classList.toggle("is-labelled", Boolean(dataLabel));
      label.textContent = dataLabel || "";
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
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("cursor-ready");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </span>
    </div>
  );
}
