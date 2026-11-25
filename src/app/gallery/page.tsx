import type { Metadata } from "next";
import GalleryView from "@/components/GalleryView";
import { plateCount } from "@/content/gallery";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photographs by ${site.name} — mornings, small company, cities, and the dark.`,
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <header className="page-hero gallery-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <span className="page-hero-watermark" aria-hidden="true">
          {String(plateCount).padStart(2, "0")}
        </span>

        <div className="wrap">
          <div className="page-hero-top" data-reveal>
            <p className="mono-label">Field notes / {String(plateCount).padStart(2, "0")} frames</p>
            <p className="mono-label">2022 — 2026</p>
            <p className="mono-label">35mm &amp; digital</p>
          </div>

          <div className="gallery-hero-main">
            <h1 className="page-title">Gallery</h1>
            <div className="gallery-hero-aside">
              <p>
                Photographs made away from the workbench: slow mornings, small company, the city at
                a distance, and whatever the dark was doing.
              </p>
              <span className="mono-label">Look closely — click any frame</span>
            </div>
          </div>

          <div className="page-hero-foot" data-reveal data-delay={180}>
            <span>
              <span className="signal-dot" aria-hidden="true" /> Five chapters
            </span>
            <span>Yogyakarta / Wonosobo / Singapore</span>
          </div>
        </div>
      </header>

      <GalleryView />
    </>
  );
}
