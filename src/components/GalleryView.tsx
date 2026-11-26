"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  chapterCount,
  chapters,
  gallerySequence,
  plateNumbers,
  plateCount,
  plates,
  type Plate,
  type PlateKey,
} from "@/content/gallery";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Icon from "./Icon";

const pad = (value: number) => String(value).padStart(2, "0");

type PlateVariant = "hero" | "thumb" | "lead" | "stack";

const sizesFor = (variant: PlateVariant) =>
  variant === "hero"
    ? "100vw"
    : variant === "lead"
      ? "(min-width: 1024px) 56vw, 100vw"
      : variant === "stack"
        ? "(min-width: 1024px) 32vw, 100vw"
        : "(min-width: 768px) 33vw, 100vw";

const wholeSizes = sizesFor;

function PlateFrame({
  plateKey,
  variant,
  number,
  delay = 0,
  eager = false,
  onOpen,
}: {
  plateKey: PlateKey;
  variant: PlateVariant;
  number: string;
  delay?: number;
  eager?: boolean;
  onOpen: (index: number, trigger: HTMLButtonElement) => void;
}) {
  const plate: Plate = plates[plateKey];
  const figureRef = useRef<HTMLElement>(null);
  const openIndex = gallerySequence.indexOf(plateKey);

  const words = plate.title.split(" ");
  const splitAt = Math.ceil(words.length / 2);
  const lines =
    words.length > 1 ? [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")] : [plate.title];

  const reset = () => {
    const figure = figureRef.current;
    if (!figure) return;
    figure.classList.remove("is-hover");
    for (const prop of ["--rx", "--ry", "--px", "--py"]) {
      figure.style.removeProperty(prop);
    }
  };

  const onPointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    figureRef.current?.classList.add("is-hover");
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const figure = figureRef.current;
    if (!figure) return;
    const rect = figure.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5));
    const ny = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5));
    figure.style.setProperty("--rx", `${(-ny * 4).toFixed(2)}deg`);
    figure.style.setProperty("--ry", `${(nx * 5).toFixed(2)}deg`);
    figure.style.setProperty("--px", `${(-nx * 15).toFixed(2)}px`);
    figure.style.setProperty("--py", `${(-ny * 11).toFixed(2)}px`);
  };

  return (
    <figure
      ref={figureRef}
      className={`plate plate--${variant}`}
      data-reveal
      data-delay={delay}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <button
        type="button"
        className="plate-button"
        onClick={(event) => onOpen(openIndex, event.currentTarget)}
        data-cursor="View"
      >
        <span className="sr-only">Open photograph: </span>
        <span
          className="plate-frame"
          data-gallery-hero={variant === "hero" ? "" : undefined}
        >
          <Image
            src={plate.src}
            alt={plate.alt}
            fill
            sizes={wholeSizes(variant)}
            loading={eager ? "eager" : "lazy"}
            preload={eager}
            className="plate-img object-cover"
          />

          {(variant === "hero" || variant === "lead") && (
            <span className="plate-caption">
              <span className="plate-caption-title">
                {lines.map((line, index) => (
                  <span className="plate-caption-line" key={line}>
                    {index > 0 ? " " : null}
                    {line}
                  </span>
                ))}
              </span>{" "}
              <span className="plate-caption-meta">{plate.caption}</span>
            </span>
          )}
        </span>
      </button>

      {variant !== "hero" && (
        <figcaption className="plate-foot">
          <span className="plate-foot-number">{number}</span>
          <span className="plate-foot-title">{plate.title}</span>
          <span className="plate-foot-year">{plate.year}</span>
        </figcaption>
      )}
    </figure>
  );
}

export default function GalleryView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const currentKey = openIndex === null ? null : gallerySequence[openIndex];
  const current = currentKey ? plates[currentKey] : null;
  const currentNumber = currentKey ? plateNumbers.get(currentKey) : undefined;

  const open = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpenIndex(index);
  };

  const close = () => {
    dialogRef.current?.close();
  };

  const step = (delta: number) => {
    setOpenIndex((index) => {
      if (index === null) return index;
      return (index + delta + gallerySequence.length) % gallerySequence.length;
    });
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openIndex === null) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("lightbox-open");
      window.dispatchEvent(new CustomEvent("ap:menu", { detail: { open: true } }));
      closeRef.current?.focus();
    }
  }, [openIndex]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("lightbox-open");
      window.dispatchEvent(new CustomEvent("ap:menu", { detail: { open: false } }));
    };
  }, []);

  const handleClose = () => {
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("lightbox-open");
    window.dispatchEvent(new CustomEvent("ap:menu", { detail: { open: false } }));
    triggerRef.current?.focus();
    setOpenIndex(null);
  };

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-gallery-row]", root).forEach((row, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          gsap.fromTo(
            row,
            { xPercent: -1.8 * direction },
            {
              xPercent: 1.8 * direction,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-gallery-hero]", root).forEach((frame) => {
          gsap.fromTo(
            frame,
            { scale: 1.045 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const total = pad(plateCount);

  return (
    <div ref={rootRef} className="gallery-page">
      <nav className="gallery-index wrap" aria-label="Gallery chapters">
        {chapters.map((chapter) => (
          <a
            key={chapter.number}
            href={`#chapter-${chapter.number}`}
            className="gallery-index-link"
            data-cursor={`Go to ${chapter.label}`}
          >
            <span>{chapter.number}</span>
            <span>{chapter.label}</span>
            <span>{pad(chapterCount(chapter))}</span>
          </a>
        ))}
      </nav>

      {chapters.map((chapter) => (
        <section
          key={chapter.number}
          id={`chapter-${chapter.number}`}
          className={`gallery-chapter gallery-chapter--${chapter.layout}`}
        >
          <div className="chapter-head" data-parallax data-speed="-0.02" data-max="14">
            <p className="chapter-label">
              <span className="chapter-number">{chapter.number}</span>
              {chapter.label}
            </p>
            <p className="chapter-count">{pad(chapterCount(chapter))} frames</p>
          </div>

          {chapter.layout === "hero-rows" && chapter.hero && (
            <>
              <PlateFrame
                plateKey={chapter.hero}
                variant="hero"
                number={plateNumbers.get(chapter.hero) ?? "01"}
                eager={chapter.number === "01"}
                onOpen={open}
              />

              {(chapter.rows ?? []).map((row, rowIndex) => (
                <div
                  className={`gallery-row ${row.length === 2 ? "gallery-row--two" : "gallery-row--three"}`}
                  data-gallery-row
                  key={`${chapter.number}-row-${rowIndex}`}
                >
                  {row.map((key, index) => (
                    <PlateFrame
                      key={key}
                      plateKey={key}
                      variant="thumb"
                      number={plateNumbers.get(key) ?? pad(index + 1)}
                      delay={Math.min(index, 3) * 60}
                      onOpen={open}
                    />
                  ))}
                </div>
              ))}
            </>
          )}

          {chapter.layout === "split" && chapter.lead && (
            <div className="gallery-split">
              <PlateFrame
                plateKey={chapter.lead}
                variant="lead"
                number={plateNumbers.get(chapter.lead) ?? "01"}
                onOpen={open}
              />

              <div className="gallery-stack">
                {(chapter.stack ?? []).map((key, index) => (
                  <PlateFrame
                    key={key}
                    plateKey={key}
                    variant="stack"
                    number={plateNumbers.get(key) ?? pad(index + 2)}
                    delay={Math.min(index, 3) * 60}
                    onOpen={open}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      <section className="wrap gallery-end">
        <p className="max-w-[54ch] text-xs leading-relaxed text-muted">
          All photographs © Abyasa Pradhipta, {new Date().getFullYear()}. Please ask before
          reproducing.
        </p>

        <a href="mailto:dhiipt32@gmail.com" className="text-arrow">
          Request a print
          <span aria-hidden="true">
            <Icon name="arrow-right" size={14} />
          </span>
        </a>
      </section>

      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        aria-labelledby="gallery-lightbox-title"
        onClose={handleClose}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        <div className="gallery-lightbox-frame">
          <div className="gallery-lightbox-top">
            <p className="gallery-lightbox-counter" data-lb-counter aria-live="polite">
              {currentNumber ?? "01"} / {total}
            </p>
            <button
              ref={closeRef}
              type="button"
              className="gallery-lightbox-close"
              onClick={close}
              aria-label="Close viewer"
              data-cursor="Close"
            >
              <span>Close</span>
              <Icon name="close" size={14} />
            </button>
          </div>

          <div className="gallery-lightbox-body">
            <div className="gallery-lightbox-media" data-lb-media>
              {current && (
                <img key={currentKey} src={current.src} alt={current.alt} loading="eager" />
              )}
            </div>

            <aside className="gallery-lightbox-meta">
              <p className="eyebrow" data-lb-medium>
                Photography
              </p>
              <h2 id="gallery-lightbox-title" className="gallery-lightbox-title mt-3">
                {current?.title ?? ""}
              </h2>
              <p className="gallery-lightbox-year mt-2">{current?.year ?? ""}</p>
              <p className="gallery-lightbox-desc mt-5">{current?.description ?? ""}</p>

              <div className="gallery-lightbox-nav">
                <button type="button" onClick={() => step(-1)} disabled={plateCount <= 1}>
                  ← Previous
                </button>
                <button type="button" onClick={() => step(1)} disabled={plateCount <= 1}>
                  Next →
                </button>
              </div>
            </aside>
          </div>
        </div>
      </dialog>
    </div>
  );
}
