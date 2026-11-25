import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-grid" aria-hidden="true" />
      <div className="not-found-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="wrap not-found-inner">
        <div className="not-found-top">
          <p className="mono-label">Error 404</p>
          <p className="mono-label">Signal lost / page not found</p>
        </div>

        <div className="not-found-display" aria-hidden="true">
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </div>

        <div className="not-found-content">
          <h1>This page went quiet.</h1>
          <p>
            It may have moved, or it never existed. Everything else is still where it should be.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="button button--solid" data-cursor="Go home">
              Back home
              <span className="button-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link href="/work" className="button button--ghost" data-cursor="View work">
              See the work
              <span className="button-arrow" aria-hidden="true">
                ↘
              </span>
            </Link>
          </div>
        </div>

        <div className="not-found-foot">
          <span>Abyasa Pradhipta — Portfolio 2026</span>
          <span>Yogyakarta, Indonesia</span>
        </div>
      </div>
    </section>
  );
}
