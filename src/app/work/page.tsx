import type { Metadata } from "next";
import WorkIndex from "@/components/WorkIndex";
import { works } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected engineering projects across autonomy, computer vision, and embedded systems.",
  alternates: { canonical: "/work" },
};

const sorted = [...works].sort((a, b) => a.order - b.order);

export default function WorkPage() {
  return (
    <>
      <header className="page-hero work-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <span className="page-hero-watermark" aria-hidden="true">
          {String(sorted.length).padStart(2, "0")}
        </span>

        <div className="wrap">
          <div className="page-hero-top" data-reveal>
            <p className="mono-label">Index / Selected work</p>
            <p className="mono-label">2022 — 2026</p>
            <p className="mono-label">Yogyakarta, ID</p>
          </div>

          <div className="work-hero-main">
            <h1 className="page-title">Work</h1>
            <p className="work-hero-aside" data-reveal data-delay={120}>
              Six projects across autonomous systems, computer vision, embedded software, and
              mechanical design — documented from first constraint to final test.
            </p>
          </div>

          <div className="page-hero-foot" data-reveal data-delay={180}>
            <span>
              <span className="signal-dot" aria-hidden="true" /> {sorted.length} field records
            </span>
            <span>Filter below — or read straight through</span>
          </div>
        </div>
      </header>

      <section className="wrap work-index-section">
        <WorkIndex works={sorted} />
      </section>
    </>
  );
}
