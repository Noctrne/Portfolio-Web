"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const phases = [
  { at: 0, label: "Calibrating signal" },
  { at: 32, label: "Loading field notes" },
  { at: 64, label: "Framing the image" },
  { at: 92, label: "Signal acquired" },
];

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("loading")) return;

    const loader = loaderRef.current;
    const panel = panelRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    const status = statusRef.current;

    if (!loader || !panel || !count || !bar || !status) {
      html.classList.remove("loading");
      return;
    }

    const state = { n: 0 };
    let phaseIndex = -1;
    const regions = Array.from(
      document.querySelectorAll<HTMLElement>("header.site-header, main, footer, .skip-link"),
    );
    regions.forEach((region) => {
      region.inert = true;
    });

    const paint = () => {
      const value = Math.round(state.n);
      count.textContent = String(value).padStart(3, "0");
      bar.style.transform = `scaleX(${(value / 100).toFixed(4)})`;

      let next = 0;
      phases.forEach((phase, index) => {
        if (value >= phase.at) next = index;
      });
      if (next !== phaseIndex) {
        phaseIndex = next;
        status.textContent = phases[next].label;
      }
    };

    paint();

    const finish = () => {
      regions.forEach((region) => {
        region.inert = false;
      });
      html.classList.remove("loading");
      ScrollTrigger.refresh();
      window.dispatchEvent(new CustomEvent("ap:loader", { detail: { done: true } }));
    };

    const tl = gsap.timeline({ onComplete: finish });

    tl.fromTo(
      ".loader-top > *",
      { y: -14, autoAlpha: 0, filter: "blur(6px)" },
      { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.08, ease: "expo.out" },
      0,
    )
      .fromTo(
        ".loader-orbit",
        { autoAlpha: 0, scale: 0.86, filter: "blur(10px)" },
        { autoAlpha: 0.55, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "expo.out" },
        0,
      )
      .fromTo(
        ".loader-glyph",
        { autoAlpha: 0, y: 26, scale: 0.72, rotate: -10, filter: "blur(12px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.07,
          ease: "expo.out",
        },
        0.12,
      )
      .fromTo(
        ".loader-signature, .loader-word--small, .loader-readout, .loader-bar, .loader-coord",
        { autoAlpha: 0, y: 16, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.05, ease: "expo.out" },
        0.35,
      )
      .to(state, { n: 34, duration: 0.6, ease: "power2.out", onUpdate: paint }, 0.15)
      .to(state, { n: 68, duration: 0.5, ease: "power1.inOut", onUpdate: paint }, 0.8)
      .to(state, { n: 100, duration: 0.75, ease: "power2.inOut", onUpdate: paint }, 1.35)
      .to(
        ".loader-glyph",
        {
          y: -18,
          autoAlpha: 0,
          scale: 0.9,
          filter: "blur(10px)",
          duration: 0.45,
          stagger: 0.035,
          ease: "expo.in",
        },
        2.3,
      )
      .to(".loader-signature", { autoAlpha: 0, y: -8, filter: "blur(8px)", duration: 0.3 }, 2.4)
      .to(".loader-top, .loader-bottom", { autoAlpha: 0, filter: "blur(6px)", duration: 0.3 }, 2.45)
      .to(panel, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, 2.5)
      .fromTo(
        ".loader-underlay-name",
        { yPercent: 45, autoAlpha: 0, filter: "blur(14px)" },
        { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.55, ease: "expo.out" },
        2.62,
      )
      .to(loader, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, 3.1)
      .set(loader, { display: "none" });

    const skip = () => tl.progress(1);
    const skipButton = loader.querySelector<HTMLElement>("[data-loader-skip]");
    skipButton?.addEventListener("click", skip);

    return () => {
      tl.kill();
      regions.forEach((region) => {
        region.inert = false;
      });
      skipButton?.removeEventListener("click", skip);
    };
  }, []);

  return (
    <div ref={loaderRef} className="loader" data-loader>
      <div className="loader-underlay" aria-hidden="true">
        <span className="loader-underlay-kicker">Portfolio — Yogyakarta</span>
        <span className="loader-underlay-name">
          Signal <em>acquired.</em>
        </span>
        <span className="loader-underlay-meta">Robotics / Photography / Design</span>
      </div>

      <div ref={panelRef} className="loader-panel">
        <div className="loader-grain" aria-hidden="true" />
        <div className="loader-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <p className="sr-only" role="status">
          Loading portfolio
        </p>

        <div className="loader-top" aria-hidden="true">
          <span className="loader-top-mark">
            Portfolio
          </span>
          <span className="loader-channel">
            <i className="signal-dot" /> Channel open
          </span>
          <span>Yogyakarta — ID / 2026</span>
        </div>

        <div className="loader-body" aria-hidden="true">
          <p className="loader-word loader-word--small">Loading the field</p>

          <div className="loader-glyphs">
            <span className="loader-glyph">
              <Icon name="camera" size={40} strokeWidth={1.1} />
            </span>
            <span className="loader-glyph">
              <Icon name="chip" size={40} strokeWidth={1.1} />
            </span>
            <span className="loader-glyph">
              <Icon name="pen" size={40} strokeWidth={1.1} />
            </span>
            <span className="loader-glyph loader-glyph--core">
              <Icon name="asterisk" size={44} strokeWidth={1.2} />
            </span>
            <span className="loader-glyph">
              <Icon name="code" size={40} strokeWidth={1.1} />
            </span>
            <span className="loader-glyph">
              <Icon name="orbit" size={40} strokeWidth={1.1} />
            </span>
            <span className="loader-glyph">
              <Icon name="sparkle" size={40} strokeWidth={1.1} />
            </span>
          </div>

          <p className="loader-signature">
            <span className="loader-signature-name">Pradhipta</span>
            <span className="loader-signature-meta">Portfolio — 2026</span>
          </p>

          <div className="loader-readout">
            <span className="loader-status">
              <span className="loader-label">Status</span>
              <span ref={statusRef} className="loader-status-text">
                Calibrating signal
              </span>
            </span>

            <span className="loader-counter">
              <span ref={countRef}>000</span>
              <span className="loader-percent">%</span>
            </span>
          </div>

          <div className="loader-bar" aria-hidden="true">
            <span ref={barRef} />
          </div>
        </div>

        <div className="loader-bottom">
          <span className="loader-coord" aria-hidden="true">
            07°48′S / 110°21′E
          </span>
          <button type="button" data-loader-skip className="loader-skip">
            Skip intro
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}
