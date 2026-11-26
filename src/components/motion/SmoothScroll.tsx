"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("motion")) return;
    // Weak devices keep native scrolling: Lenis is a nicety, not a need.
    if (html.classList.contains("perf-low")) return;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      autoRaf: false,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    if (html.classList.contains("loading")) lenis.stop();

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onMenu = (event: Event) => {
      const open = (event as CustomEvent<{ open: boolean }>).detail.open;
      if (open) lenis.stop();
      else lenis.start();
    };
    const onLoader = (event: Event) => {
      const done = (event as CustomEvent<{ done: boolean }>).detail.done;
      if (done) lenis.start();
    };

    // The governor decides mid-session that the page cannot hold its frames.
    const onPerf = (event: Event) => {
      if (!(event as CustomEvent<{ low: boolean }>).detail.low) return;
      window.removeEventListener("ap:perf", onPerf);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.refresh();
    };

    window.addEventListener("ap:menu", onMenu);
    window.addEventListener("ap:loader", onLoader);
    window.addEventListener("ap:perf", onPerf);

    return () => {
      window.removeEventListener("ap:menu", onMenu);
      window.removeEventListener("ap:loader", onLoader);
      window.removeEventListener("ap:perf", onPerf);
      if (lenisRef.current) {
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    const hash = window.location.hash;

    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    }

    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
