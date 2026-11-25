import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes and essays by ${site.name} — engineering, photography, teaching, and the work between.`,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <header className="page-hero blog-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <span className="page-hero-watermark" aria-hidden="true">
          00
        </span>

        <div className="wrap">
          <div className="page-hero-top" data-reveal>
            <p className="mono-label">Journal / 00 entries</p>
            <p className="mono-label">Latest first</p>
            <p className="mono-label">Field notes &amp; build logs</p>
          </div>

          <div className="blog-hero-main">
            <h1 className="page-title">
              Journal<em>.</em>
            </h1>
            <p className="blog-hero-aside" data-reveal>
              Notes on building things, looking closely, and teaching what I learn. Longer thoughts,
              kept here instead of in a drawer.
            </p>
          </div>

          <div className="page-hero-foot" data-reveal data-delay={180}>
            <span>
              <span className="signal-dot" aria-hidden="true" /> First transmission in progress
            </span>
            <span>Essays · Field notes · Build logs</span>
          </div>
        </div>
      </header>

      <section className="blog-empty">
        <div className="wrap blog-empty-grid">
          <div className="blog-zero" aria-hidden="true">
            <span>0</span>
            <span>0</span>
          </div>

          <div className="blog-empty-copy">
            <p className="mono-label">Channel open / no signal yet</p>
            <h2>Nothing published yet.</h2>
            <p>
              The first note is still being written — field notes, build logs, and the occasional
              thing learned the hard way. Check back soon, or ask me about a piece directly.
            </p>
            <a
              href={`mailto:${site.email}?subject=Journal%20question`}
              className="text-arrow text-arrow--large"
              data-cursor="Email"
            >
              Ask about a piece
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <ul className="blog-topics">
            <li>
              <span>01</span>
              Field notes
              <small>Places, light, and what the camera noticed.</small>
            </li>
            <li>
              <span>02</span>
              Build logs
              <small>Robots, sensors, and the unglamorous middle.</small>
            </li>
            <li>
              <span>03</span>
              Teaching notes
              <small>Explanations that made something click.</small>
            </li>
          </ul>
        </div>

        <div className="wrap blog-empty-foot">
          <Link href="/work" className="text-arrow" data-cursor="Read work">
            Read the work instead
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/gallery" className="text-arrow" data-cursor="View gallery">
            Or look at the photographs
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
