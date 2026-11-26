import Link from "next/link";
import { site } from "@/content/site";
import MagneticLink from "./MagneticLink";

export default function ContactSection() {
  return (
    <section className="contact-section theme-signal" id="contact">
      <div className="contact-grid-bg" aria-hidden="true" />
      <span className="contact-mark" aria-hidden="true">
        ↗
      </span>

      <div className="wrap contact-inner">
        <div className="contact-top">
          <p className="mono-label">
            <span className="signal-dot signal-dot--dark" aria-hidden="true" />
            07 / Contact
          </p>
          <p className="mono-label">{site.availability} — {site.year}</p>
        </div>

        <h2 className="contact-title">
          Have a signal
          <br />
          <em>worth chasing?</em>
        </h2>

        <div className="contact-body">
          <div className="contact-primary">
            <p className="contact-lede">
              Engineering, photography, design, or a collaboration that crosses all three — email is
              the best way to reach me. I usually reply within two working days.
            </p>

            <MagneticLink href={`mailto:${site.email}`} className="contact-email magnetic-link">
              <span className="contact-email-label">Write to me</span>
              <span className="contact-email-text">
                {site.email}
                <span className="contact-email-arrow" aria-hidden="true">
                  ↗
                </span>
              </span>
            </MagneticLink>
          </div>

          <aside className="contact-aside">
            <div>
              <h3 className="contact-aside-label">Elsewhere</h3>
              <ul className="contact-socials">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-social"
                      data-cursor="Open link"
                    >
                      {social.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="contact-aside-label">Base</h3>
              <p className="contact-base">
                {site.location}
                <br />
                Open to remote and on-site work.
              </p>
            </div>

            <Link href="/blog" className="contact-journal" data-cursor="Read the notes">
              Reading the field notes
              <span aria-hidden="true">↘</span>
            </Link>
          </aside>
        </div>

        <div className="contact-foot">
          <span>Available for the right problem</span>
          <span>Yogyakarta — {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
}
