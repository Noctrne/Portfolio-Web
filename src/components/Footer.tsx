import Link from "next/link";
import { nav, site } from "@/content/site";
import Seal from "./Seal";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid" aria-hidden="true" />

      <div className="wrap footer-top">
        <div className="footer-cta">
          <p className="mono-label">End of transmission / {site.year}</p>
          <Link href="/contact" className="footer-talk" data-cursor="Get in touch">
            Start a conversation
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <p className="mono-label">Sitemap</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-elsewhere">
          <p className="mono-label">Elsewhere</p>
          <ul>
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Open link"
                >
                  {social.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-seal-wrap">
          <Seal id="footer-seal" className="footer-seal" />
          <p>
            Designed &amp; built in
            <br />
            Yogyakarta, Indonesia.
          </p>
        </div>
      </div>

      <div className="wrap">
        <p className="footer-wordmark" aria-label={site.name}>
          Abyasa <em>Pradhipta</em>
        </p>
      </div>

      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </span>
        <a href={`mailto:${site.email}`} className="footer-email">
          {site.email}
        </a>
        <a href="#main" className="footer-top-link" data-cursor="Back to top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
