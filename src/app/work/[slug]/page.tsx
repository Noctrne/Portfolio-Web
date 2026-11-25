import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReadingProgress from "@/components/ReadingProgress";
import { nextWork, workBySlug, works } from "@/content/work";

type Props = {
  params: Promise<{ slug: string }>;
};

const categoryLabel: Record<string, string> = {
  autonomy: "Autonomy",
  software: "Software",
  embedded: "Embedded",
  design: "Design",
};

const pad = (value: number) => String(value).padStart(2, "0");

export const dynamicParams = false;

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = workBySlug.get(slug);
  if (!work) return { title: "Work not found" };

  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: `/work/${work.slug}` },
    openGraph: {
      type: "article",
      title: work.title,
      description: work.summary,
      url: `/work/${work.slug}`,
      images: [{ url: work.cover, alt: work.coverAlt || work.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: work.title,
      description: work.summary,
      images: [work.cover],
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = workBySlug.get(slug);
  if (!work) notFound();

  const next = nextWork(work.slug);
  const index = works.findIndex((item) => item.slug === work.slug);

  return (
    <article className="case-study">
      <ReadingProgress />

      <header className="case-hero">
        <div className="case-hero-grid" aria-hidden="true" />
        <div className="wrap">
          <div className="case-top" data-reveal>
            <Link href="/work" className="case-back" data-cursor="Back to index">
              <span aria-hidden="true">←</span> All work
            </Link>
            <span className="mono-label">
              Record {pad(index + 1)} / {pad(works.length)}
            </span>
            <span className="mono-label">
              {categoryLabel[work.category]} — {work.year}
            </span>
          </div>

          <h1 className="case-title">{work.title}</h1>

          <div className="case-intro">
            <p className="case-summary">{work.summary}</p>
            {work.role && (
              <p className="case-role">
                <span className="mono-label">Role</span>
                {work.role}
              </p>
            )}
          </div>

          <figure className="case-cover" data-reveal="media">
            <div className="case-cover-media">
              <Image
                src={work.cover}
                alt={work.coverAlt || work.title}
                fill
                preload
                loading="eager"
                sizes="(min-width: 1200px) 84vw, 100vw"
                className="object-cover"
                data-parallax-media
                data-speed="0.07"
              />
            </div>
            <figcaption>
              <span>{work.category} / {work.year}</span>
              <span>{work.title}</span>
              <span>Image — {siteFrame(index)}</span>
            </figcaption>
          </figure>
        </div>
      </header>

      <section className="wrap case-content">
        <aside className="case-sidebar">
          <div className="case-sidebar-inner">
            <p className="mono-label">Project data</p>
            <dl className="case-details">
              <div>
                <dt>Year</dt>
                <dd>{work.year}</dd>
              </div>
              <div>
                <dt>Discipline</dt>
                <dd>{categoryLabel[work.category]}</dd>
              </div>
              {work.role && (
                <div>
                  <dt>Role</dt>
                  <dd>{work.role}</dd>
                </div>
              )}
              <div>
                <dt>Tools</dt>
                <dd>{work.tools.join(" · ")}</dd>
              </div>
            </dl>

            {work.links.length > 0 && (
              <div className="case-links">
                <p className="mono-label">Links</p>
                <ul>
                  {work.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="Open link"
                      >
                        {link.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="case-stamp" aria-hidden="true">
              <span>AP</span>
              <span>/</span>
              <span>{pad(index + 1)}</span>
            </div>
          </div>
        </aside>

        <div className="case-notes">
          <div className="case-notes-head" data-reveal>
            <p className="mono-label">Field record</p>
            <p className="mono-label">{work.year}</p>
          </div>

          {work.sections.map((section, sectionIndex) => (
            <section className="case-section" key={`${work.slug}-${sectionIndex}`}>
              <div className="case-section-head">
                <span className="case-section-index">{pad(sectionIndex + 1)}</span>
                <h2 className="case-section-title">{section.heading ?? "Overview"}</h2>
              </div>
              <div className="case-section-body">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${sectionIndex}-${paragraphIndex}`}
                    className={sectionIndex === 0 && paragraphIndex === 0 ? "is-lede" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <Link
        href={`/work/${next.slug}`}
        className="next-case"
        data-cursor="Next record"
        data-transition-label={next.title}
      >
        <div className="next-case-media" aria-hidden="true">
          <Image
            src={next.cover}
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            className="next-case-img"
          />
        </div>
        <div className="next-case-shade" aria-hidden="true" />
        <div className="wrap next-case-inner">
          <p className="mono-label">Next record / {pad(works.findIndex((item) => item.slug === next.slug) + 1)}</p>
          <h2 className="next-case-title">{next.title}</h2>
          <span className="next-case-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </Link>
    </article>
  );
}

function siteFrame(index: number) {
  return `FIG. ${String(index + 1).padStart(2, "0")}`;
}
