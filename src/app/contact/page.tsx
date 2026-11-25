import type { Metadata } from "next";
import MagneticLink from "@/components/MagneticLink";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — engineering, photography, design, and collaborations.`,
  alternates: { canonical: "/contact" },
};

const prompts = [
  "What you're making, and where it currently stands",
  "Timeline and how you'd like to work together",
  "Scope — engineering, visuals, or both",
  "Links to your team or existing work",
];

export default function ContactPage() {
  return (
    <>
      <header className="page-hero contact-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <span className="page-hero-watermark" aria-hidden="true">
          @
        </span>

        <div className="wrap">
          <div className="page-hero-top" data-reveal>
            <p className="mono-label">Contact / Open channel</p>
            <p className="mono-label">{site.location}</p>
            <p className="mono-label">UTC +7</p>
          </div>

          <h1 className="contact-page-title">
            Say <em>hello.</em>
          </h1>

          <div className="contact-hero-row">
            <p className="contact-hero-intro" data-reveal>
              For engineering work, photography, design, or a collaboration that crosses
              disciplines. Email is the best way to reach me — I usually reply within two working
              days.
            </p>
            <p className="contact-hero-note" data-reveal data-delay={100}>
              <span className="signal-dot" aria-hidden="true" />
              {site.availability}
            </p>
          </div>

          <MagneticLink
            href={`mailto:${site.email}`}
            className="contact-page-email magnetic-link"
          >
            <span className="contact-page-email-label">Start here</span>
            <span className="contact-page-email-text">
              {site.email}
              <span aria-hidden="true">↗</span>
            </span>
          </MagneticLink>

          <div className="page-hero-foot" data-reveal data-delay={180}>
            <span>One address, all disciplines</span>
            <span>Scroll for the useful details</span>
          </div>
        </div>
      </header>

      <section className="contact-page-body">
        <div className="wrap contact-page-grid">
          <div className="contact-info-block">
            <p className="mono-label">Elsewhere</p>
            <ul className="contact-page-socials">
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

          <div className="contact-info-block contact-info-block--prompts">
            <p className="mono-label">Helpful to include</p>
            <ol>
              {prompts.map((prompt, index) => (
                <li key={prompt}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="contact-info-block contact-info-block--base">
            <p className="mono-label">Base</p>
            <p className="contact-page-base">
              {site.location}
              <br />
              Open to remote and on-site work.
            </p>
            <p className="contact-page-response">
              Currently {site.availability.toLowerCase()}.
              <br />
              Usually replies within two working days.
            </p>
          </div>
        </div>

        <div className="wrap contact-page-close">
          <p>
            Prefer a quick note? Start with the problem, not the pitch.
          </p>
          <a href={`mailto:${site.email}`} className="text-arrow text-arrow--large" data-cursor="Email">
            {site.email}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
