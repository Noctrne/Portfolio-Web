"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const words: Array<string | { text: string; emphasis: true }> = [
  "I",
  "care",
  "about",
  "the",
  "quiet",
  "room,",
  "the",
  "weak",
  "signal,",
  "the",
  { text: "hundredth", emphasis: true },
  { text: "run.", emphasis: true },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const section = sectionRef.current;
      const pin = pinRef.current;
      const note = noteRef.current;
      if (!section || !pin || !note) return;

      const wordEls = gsap.utils.toArray<HTMLElement>("[data-manifesto-word]", pin);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(wordEls, { opacity: 0.13 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=175%",
            pin,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(wordEls, { opacity: 1, stagger: 0.09, ease: "none", duration: 0.6 }, 0)
          .fromTo(
            ".manifesto-orb",
            { scale: 0.72, rotate: -16 },
            { scale: 1.08, rotate: 32, ease: "none", duration: 2.5 },
            0,
          )
          .fromTo(note, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 }, 1.25)
          .fromTo(
            ".manifesto-rule",
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.8 },
            0.9,
          );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          wordEls,
          { opacity: 0.13 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top 72%",
              end: "bottom 42%",
              scrub: 0.5,
            },
          },
        );

        gsap.fromTo(
          note,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            scrollTrigger: { trigger: note, start: "top 88%", once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="manifesto theme-bone" id="approach">
      <div ref={pinRef} className="manifesto-pin">
        <div className="manifesto-grid" aria-hidden="true" />
        <div className="manifesto-orb" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="wrap manifesto-wrap">
          <header className="manifesto-head">
            <p className="mono-label">02 / Approach</p>
            <p className="manifesto-head-note">
              The instinct is the same whether I&apos;m tuning a control loop or framing a
              photograph.
            </p>
            <span className="manifesto-index" aria-hidden="true">
              A
            </span>
          </header>

          <p className="manifesto-copy">
            <span className="sr-only">
              I care about the quiet room, the weak signal, the hundredth run.
            </span>
            {words.map((word, index) => {
              const text = typeof word === "string" ? word : word.text;
              const emphasis = typeof word === "string" ? false : word.emphasis;
              return (
                <span
                  key={`${text}-${index}`}
                  className={emphasis ? "manifesto-word is-emphasis" : "manifesto-word"}
                  data-manifesto-word
                  aria-hidden="true"
                >
                  {emphasis ? <em>{text}</em> : text}{" "}
                </span>
              );
            })}
          </p>

          <div className="manifesto-rule" aria-hidden="true" />

          <footer className="manifesto-foot">
            <p ref={noteRef} className="manifesto-note">
              Understand the constraint. Remove what isn&apos;t needed. Make the rest dependable —
              then explain it clearly enough that someone else can carry it.
            </p>

            <ul className="manifesto-tags">
              <li>Autonomy</li>
              <li>Perception</li>
              <li>Image-making</li>
              <li>Teaching</li>
            </ul>
          </footer>
        </div>
      </div>
    </section>
  );
}
