"use client";

import { useEffect } from "react";

/**
 * Watches the first real scrolling a visitor does. If frames are consistently
 * missing, the page steps down to the low-power tier: decorative motion and
 * smooth scrolling are dropped, everything else stays. One decision per
 * session, made from measured frames rather than assumptions about hardware.
 */
export default function PerfGovernor() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("motion")) return;
    if (html.classList.contains("perf-low")) return;

    const mountedAt = performance.now();
    let active = false;
    let raf = 0;
    let last = 0;
    let stopTimer = 0;
    let downgraded = false;
    let deltas: number[] = [];

    const downgrade = () => {
      if (downgraded) return;
      downgraded = true;
      html.classList.add("perf-low");
      window.dispatchEvent(new CustomEvent("ap:perf", { detail: { low: true } }));
    };

    const tick = (now: number) => {
      if (last) deltas.push(now - last);
      last = now;
      raf = window.requestAnimationFrame(tick);
    };

    const settle = () => {
      // Let the first moments after load pass: image decode and font swap
      // look like jank on every machine.
      if (performance.now() - mountedAt < 3200) return;
      if (deltas.length < 45) return;

      const sorted = [...deltas].sort((a, b) => a - b);
      const p60 = sorted[Math.floor(sorted.length * 0.6)];
      const slow = sorted.filter((d) => d > 34).length / sorted.length;

      if (p60 > 24 || slow > 0.35) downgrade();
    };

    const onScroll = () => {
      if (!active) {
        active = true;
        deltas = [];
        last = 0;
        raf = window.requestAnimationFrame(tick);
      }
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        active = false;
        window.cancelAnimationFrame(raf);
        settle();
      }, 240);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(stopTimer);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
