import Image from "next/image";
import Link from "next/link";
import { plates } from "@/content/gallery";
import { site } from "@/content/site";

export default function AboutBand() {
  const portrait = plates["self-in-leaves"];

  return (
    <section className="about-band section" id="about">
      <div className="wrap about-band-grid">
        <figure className="about-band-media" data-reveal="media">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            sizes="(min-width: 1024px) 44vw, 100vw"
            loading="lazy"
            className="about-band-img"
            data-parallax-media
            data-speed="0.06"
          />
          <span className="about-band-coordinate" aria-hidden="true">
            07°48′S / 110°21′E
          </span>
          <figcaption>
            <span>Self-portrait</span>
            <span>Wonosobo, 2025</span>
          </figcaption>
        </figure>

        <div className="about-band-copy">
          <p className="mono-label">
            <span className="signal-dot" aria-hidden="true" />
            06 / About
          </p>
          <h2 className="about-band-title">
            The person
            <br />
            <em>behind the signal.</em>
          </h2>
          <p className="about-band-lede">
            I&apos;m {site.firstName} — an Electronics &amp; Instrumentation student at Universitas
            Gadjah Mada. Most of my engineering work is on autonomous systems; outside the lab I
            photograph, design, and teach.
          </p>
          <p className="about-band-body">
            Those habits keep the technical work clearer and more human. A vehicle that finds its
            way back, a sensor reading you can trust, a page that loads before you notice — the
            standard is the same.
          </p>

          <dl className="about-band-facts">
            <div>
              <dt>Based in</dt>
              <dd>{site.location}</dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd>{site.availability}</dd>
            </div>
            <div>
              <dt>Studying</dt>
              <dd>Electronics &amp; Instrumentation, UGM</dd>
            </div>
          </dl>

          <Link href="/about" className="text-arrow text-arrow--large" data-cursor="Read more">
            More about me
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="about-band-marquee" aria-hidden="true">
        <span>
          Engineer <i>·</i> Photographer <i>·</i> Designer <i>·</i> Teacher <i>·</i> Engineer{" "}
          <i>·</i> Photographer <i>·</i> Designer <i>·</i>
        </span>
      </div>
    </section>
  );
}
