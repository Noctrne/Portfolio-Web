"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { works } from "@/content/work";

const pad = (value: number) => String(value).padStart(2, "0");

export default function WorkRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const ordered = [...works].sort((a, b) => a.order - b.order);

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const progress = progressRef.current;
      if (!section || !viewport || !progress) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const getDistance = () =>
          Math.max(1, Math.round(viewport.scrollWidth - viewport.clientWidth));

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            viewport.scrollLeft = self.progress * getDistance();
            progress.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          },
        });

        return () => {
          st.kill();
          viewport.scrollLeft = 0;
          progress.style.transform = "scaleX(0)";
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="work-rail" id="selected">
      <div className="wrap work-rail-head">
        <div>
          <p className="mono-label">
            <span className="signal-dot" aria-hidden="true" />
            03 / Selected work
          </p>
          <h2 className="work-rail-title">
            Systems,
            <br />
            <em>documented.</em>
          </h2>
        </div>

        <div className="work-rail-aside">
          <p>
            Six projects across autonomy, embedded systems, and mechanical design — each one
            recorded from the first constraint to the final test.
          </p>
          <Link href="/work" className="text-arrow" data-cursor="View all">
            Full index
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="work-rail-viewport"
        tabIndex={0}
        role="region"
        aria-label="Selected work, horizontal gallery"
      >
        <div className="work-rail-track">
          {ordered.map((work, index) => (
            <Link
              href={`/work/${work.slug}`}
              className="rail-card"
              key={work.slug}
              data-cursor="Open case study"
            >
              <div className="rail-media">
                <Image
                  src={work.cover}
                  alt={work.coverAlt || work.title}
                  fill
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 54vw, 82vw"
                  loading="lazy"
                  className="rail-img"
                />
                <span className="rail-media-shade" aria-hidden="true" />
                <span className="rail-index">{pad(index + 1)}</span>
                <span className="rail-view">
                  View case study <span aria-hidden="true">↗</span>
                </span>
              </div>

              <div className="rail-card-meta">
                <span className="mono-label">{work.category}</span>
                <span className="mono-label">{work.year}</span>
              </div>
              <h3 className="rail-card-title">{work.title}</h3>
              <p className="rail-card-summary">{work.summary}</p>
            </Link>
          ))}

          <Link href="/work" className="rail-end-card" data-cursor="All work">
            <span className="rail-end-kicker">The full field record</span>
            <span className="rail-end-title">
              All
              <br />
              <em>work.</em>
            </span>
            <span className="rail-end-circle" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </div>

      <div className="wrap work-rail-foot">
        <span className="work-rail-hint">
          <span className="work-rail-hint-line" aria-hidden="true" />
          Scroll to travel the index
        </span>
        <span className="work-rail-count">
          <span className="work-rail-progress">
            <span ref={progressRef} />
          </span>
          <span>{pad(ordered.length)} projects</span>
        </span>
      </div>
    </section>
  );
}
