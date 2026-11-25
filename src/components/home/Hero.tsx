"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const root = rootRef.current;
      const media = mediaRef.current;
      if (!root || !media) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        tl.to(".hero-title", { yPercent: -16, autoAlpha: 0.22, ease: "none" }, 0)
          .to(".hero-visual", { yPercent: -20, ease: "none" }, 0)
          .to(".hero-float", { yPercent: -38, ease: "none" }, 0)
          .to(".hero-bottom, .hero-meta", { yPercent: -40, autoAlpha: 0, ease: "none" }, 0);
      });

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!finePointer) return () => mm.revert();

      let frame = 0;

      const onMove = (event: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = root.getBoundingClientRect();
          if (rect.height === 0) return;
          const nx = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5));
          const ny = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5));

          media.style.setProperty("--hero-rx", `${(-ny * 4).toFixed(2)}deg`);
          media.style.setProperty("--hero-ry", `${(nx * 6).toFixed(2)}deg`);
          media.style.setProperty("--hero-tx", `${(nx * 18).toFixed(1)}px`);
          media.style.setProperty("--hero-ty", `${(ny * 14).toFixed(1)}px`);
          media.style.setProperty("--hero-float-x", `${(nx * -34).toFixed(1)}px`);
          media.style.setProperty("--hero-float-y", `${(ny * -24).toFixed(1)}px`);
        });
      };

      const onLeave = () => {
        cancelAnimationFrame(frame);
        media.style.setProperty("--hero-rx", "0deg");
        media.style.setProperty("--hero-ry", "0deg");
        media.style.setProperty("--hero-tx", "0px");
        media.style.setProperty("--hero-ty", "0px");
        media.style.setProperty("--hero-float-x", "0px");
        media.style.setProperty("--hero-float-y", "0px");
      };

      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave);

      return () => {
        mm.revert();
        cancelAnimationFrame(frame);
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-watermark" aria-hidden="true">
        26
      </div>

      <div className="hero-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="wrap hero-inner">
        <div className="hero-meta">
          <span className="hero-meta-item">
            <span className="signal-dot" aria-hidden="true" />
            {site.availability}
          </span>
          <span className="hero-meta-item">{site.location}</span>
          <span className="hero-meta-item">Portfolio — {site.year}</span>
        </div>

        <div className="hero-stage">
          <h1 id="hero-title" className="hero-title" data-no-split>
            <span className="hero-line-mask">
              <span className="hero-line-inner" style={{ "--i": 0 } as CSSProperties}>
                Signal
              </span>
            </span>
            <span className="hero-line-mask hero-line--second">
              <span className="hero-line-inner" style={{ "--i": 1 } as CSSProperties}>
                <span className="hero-amp">&amp;</span> image.
              </span>
            </span>
          </h1>

          <figure className="hero-visual" ref={mediaRef}>
            <div className="hero-visual-frame">
              <div className="hero-media-inner">
                <Image
                  src="/images/portrait.jpg"
                  alt="Abyasa Pradhipta standing on a road between tea terraces in Wonosobo"
                  fill
                  preload
                  loading="eager"
                  sizes="(min-width: 1280px) 28vw, (min-width: 768px) 36vw, 92vw"
                  className="object-cover"
                />
              </div>
              <span className="hero-frame-line hero-frame-line--top" aria-hidden="true" />
              <span className="hero-frame-line hero-frame-line--bottom" aria-hidden="true" />
              <span className="hero-frame-tag">FIG. 01</span>
            </div>
            <figcaption>
              <span>Portrait — Wonosobo</span>
              <span>2025</span>
            </figcaption>
          </figure>

          <figure className="hero-float" aria-hidden="true">
            <div className="hero-float-frame">
              <Image
                src="/images/work/orca.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 16vw, 1px"
                loading="lazy"
                className="object-cover"
              />
              <span className="hero-float-label">ORCA / 2026</span>
            </div>
          </figure>
        </div>

        <div className="hero-bottom">
          <div className="hero-intro-wrap">
            <p className="hero-kicker">
              Robotics engineer <span aria-hidden="true">/</span> Photographer <span aria-hidden="true">/</span> Designer
            </p>
            <p className="hero-intro">
              I&apos;m {site.firstName}. I build autonomous systems, then photograph the places they
              can&apos;t go. A practice in sensing, making, and looking closely.
            </p>
          </div>

          <div className="hero-actions">
            <Link href="/work" className="button button--solid" data-cursor="Explore">
              Selected work
              <span className="button-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link href="/about" className="button button--ghost" data-cursor="Read">
              About me
              <span className="button-arrow" aria-hidden="true">
                ↘
              </span>
            </Link>
          </div>

          <a className="hero-scroll" href="#approach">
            <span className="hero-scroll-line" aria-hidden="true" />
            <span>Scroll to explore</span>
            <span className="hero-scroll-index">01</span>
          </a>
        </div>
      </div>

      <div className="hero-side hero-side--left" aria-hidden="true">
        <span>Robotics / Photography / Design</span>
        <span>Yogyakarta — ID</span>
      </div>
      <div className="hero-side hero-side--right" aria-hidden="true">
        <span>Open field notes — 2026</span>
      </div>
    </section>
  );
}
