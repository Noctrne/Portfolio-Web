"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { workCategories, type Work, type WorkFilter } from "@/content/work";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cx } from "@/lib/cx";

interface Props {
  works: Work[];
}

const pad = (value: number) => String(value).padStart(2, "0");
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function WorkIndex({ works }: Props) {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);

  const count = (value: WorkFilter) =>
    value === "all" ? works.length : works.filter((work) => work.category === value).length;

  const visibleCount =
    filter === "all" ? works.length : works.filter((work) => work.category === filter).length;

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const preview = previewRef.current;
    if (!preview) return;

    xTo.current = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" });
    yTo.current = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = preview.getBoundingClientRect();
      const width = rect.width || 360;
      const height = rect.height || 270;
      const x = clamp(event.clientX + 36, 20, window.innerWidth - width - 20);
      const y = clamp(event.clientY - height / 2, 90, window.innerHeight - height - 20);
      xTo.current?.(x);
      yTo.current?.(y);
    };

    const onLeave = () => setActive(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    listRef.current?.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      listRef.current?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const rows = Array.from(
        listRef.current?.querySelectorAll<HTMLElement>("[data-work-card]") ?? [],
      ).filter((row) => !row.hidden);

      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.055,
          ease: "expo.out",
          overwrite: true,
        },
      );

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: listRef, dependencies: [filter] },
  );

  return (
    <>
      <div className="work-index-bar">
        <div className="index-filters" role="group" aria-label="Filter work by discipline">
          {workCategories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={cx("index-filter", filter === category.value && "is-active")}
              aria-pressed={filter === category.value}
              onClick={() => {
                setFilter(category.value);
                setActive(null);
              }}
            >
              {category.label}
              <span>{pad(count(category.value))}</span>
            </button>
          ))}
        </div>

        <p className="index-live" aria-live="polite">
          {pad(visibleCount)} shown
        </p>
      </div>

      <div ref={listRef} className="work-index-list">
        {works.map((work, index) => (
          <Link
            key={work.slug}
            href={`/work/${work.slug}`}
            className="index-row"
            data-work-card
            data-category={work.category}
            data-cursor="Open case study"
            hidden={filter !== "all" && work.category !== filter}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            <span className="index-row-number">{pad(index + 1)}</span>

            <span className="index-row-main">
              <span className="index-row-kicker">
                {work.category} <span aria-hidden="true">/</span> {work.tools.slice(0, 2).join(" · ")}
              </span>
              <span className="index-row-title">{work.title}</span>
              <span className="index-row-summary">{work.summary}</span>
              <span className="index-row-tools">
                {work.tools.slice(0, 4).map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </span>
              <span className="index-row-mobile-media">
                <Image
                  src={work.cover}
                  alt={work.coverAlt || work.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </span>
            </span>

            <span className="index-row-side">
              <span>{work.year}</span>
              <span className="index-row-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div
        ref={previewRef}
        className={cx("index-preview", active !== null && "is-active")}
        aria-hidden="true"
      >
        {works.map((work, index) => (
          <span
            className={cx("index-preview-image", index === active && "is-active")}
            key={work.slug}
          >
            <Image
              src={work.cover}
              alt=""
              fill
              sizes="24vw"
              loading="lazy"
              className="object-cover"
            />
          </span>
        ))}
        <span className="index-preview-chrome">
          <span>{active !== null ? works[active].category : "Index"}</span>
          <span>{active !== null ? works[active].year : "2026"}</span>
        </span>
      </div>
    </>
  );
}
