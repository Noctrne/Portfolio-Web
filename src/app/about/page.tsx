import type { Metadata } from "next";
import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import Practice from "@/components/home/Practice";
import OrbitField from "@/components/three/OrbitFieldLazy";
import { education, experience, recognition, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — engineer, photographer, and designer based in ${site.location}.`,
  alternates: { canonical: "/about" },
};

const pad = (value: number) => String(value).padStart(2, "0");

export default function AboutPage() {
  return (
    <>
      <header className="page-hero about-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <div className="about-orbit" aria-hidden="true">
          <OrbitField />
        </div>

        <div className="wrap">
          <div className="page-hero-top" data-reveal>
            <p className="mono-label">Profile / 01</p>
            <p className="mono-label">{site.location}</p>
            <p className="mono-label">B.Eng. — in progress</p>
          </div>

          <h1 className="about-title">
            An engineer by training,
            <br />
            <em>a photographer by habit.</em>
          </h1>

          <div className="page-hero-foot" data-reveal data-delay={180}>
            <span>
              <span className="signal-dot" aria-hidden="true" /> {site.availability}
            </span>
            <span>Scroll for the field record</span>
          </div>
        </div>
      </header>

      <section className="about-profile theme-bone section">
        <div className="wrap about-profile-grid">
          <figure className="about-profile-media" data-reveal="media">
            <Image
              src="/images/portrait.jpg"
              alt={`Portrait of ${site.name}`}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              loading="lazy"
              className="about-profile-img"
              data-parallax-media
              data-speed="0.06"
            />
            <span className="about-profile-tag">Portrait / Wonosobo / 2025</span>
            <figcaption>
              <span>07°48′S — 110°21′E</span>
              <span>Yogyakarta, Indonesia</span>
            </figcaption>
          </figure>

          <div className="about-profile-copy">
            <p className="mono-label">01 / The short version</p>
            <p className="about-profile-lede">
              I&apos;m an Electronics and Instrumentation student at Universitas Gadjah Mada.
              Outside the lab I photograph and design. Most of my engineering work is on autonomous
              systems: perception, control, and the software that holds a robot together.
            </p>

            <div className="about-profile-body">
              <p>
                I captained the ORCA sub-team at Gadjah Mada Robotic Team, where we took an
                autonomous underwater vehicle to the Top 8 worldwide at SAUVC 2026. Before that I
                was a programmer on the same team; now I also work as senior programmer in Elins
                Research Club&apos;s robotics division, where I mentor newer programmers.
              </p>
              <p>
                Alongside engineering I photograph, design, and teach. Those habits keep my
                technical work clearer and more human — a system is finished when someone else can
                understand it, not just when it runs.
              </p>
            </div>

            <dl className="about-facts">
              <div>
                <dt>Based in</dt>
                <dd>{site.location}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Engineering · Photography · Design</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>C++ · Python · ROS 2 · Linux · Fusion 360</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{site.availability}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <Practice variant="about" />

      <section className="field-record section">
        <div className="wrap">
          <header className="field-record-head">
            <div>
              <p className="mono-label">
                <span className="signal-dot" aria-hidden="true" />
                03 / Field record
              </p>
              <h2 className="field-record-title" data-no-split>
                Places the work
                <br />
                <em>has taken me.</em>
              </h2>
            </div>
            <p className="field-record-aside">
              Team rooms, pools, labs, and competition floors. The record is less about titles than
              the things each place taught me to make.
            </p>
          </header>

          <ol className="record-list">
            {experience.map((item, index) => (
              <li className="record-row" key={`${item.period}-${item.title}`} data-reveal>
                <span className="record-index">{pad(index + 1)}</span>
                <span className="record-period">{item.period}</span>
                <div className="record-main">
                  <h3>{item.title}</h3>
                  <p>{item.org}</p>
                </div>
                <p className="record-note">{item.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="credentials theme-bone section">
        <div className="wrap credentials-grid">
          <div className="credentials-head">
            <p className="mono-label">04 / Education</p>
            <h2 className="credentials-title" data-no-split>
              Still
              <br />
              <em>learning.</em>
            </h2>
          </div>

          <div className="credentials-main">
            <ol className="education-list">
              {education.map((item, index) => (
                <li key={item.title} data-reveal>
                  <span className="education-period">{item.period}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.note}</p>
                  </div>
                  <span className="education-index">{pad(index + 1)}</span>
                </li>
              ))}
            </ol>

            <div className="recognition">
              <p className="mono-label">Selected recognition</p>
              <ul>
                {recognition.map((item, index) => (
                  <li key={item} data-reveal data-delay={index * 40}>
                    <span>{pad(index + 1)}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
