import Image from "next/image";
import Link from "next/link";
import { plates, type PlateKey } from "@/content/gallery";

const sequence: PlateKey[] = [
  "morning-still",
  "self-in-leaves",
  "new-town",
  "table-for-one",
  "after-dark",
  "terraces",
];

function Frame({
  plateKey,
  clone = false,
  index,
}: {
  plateKey: PlateKey;
  clone?: boolean;
  index: number;
}) {
  const plate = plates[plateKey];

  return (
    <Link
      href="/gallery"
      className={`photo-frame photo-frame--${index % 3}`}
      data-cursor="View gallery"
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
    >
      <span className="photo-frame-media">
        <Image
          src={plate.src}
          alt={clone ? "" : plate.alt}
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 48vw, 78vw"
          loading="lazy"
          className="photo-img"
        />
      </span>
      <span className="photo-frame-caption">
        <span>{plate.title}</span>
        <span>{plate.year}</span>
      </span>
    </Link>
  );
}

export default function PhotoField() {
  return (
    <section className="photo-field theme-bone section" id="field-notes">
      <div className="wrap photo-field-head">
        <div>
          <p className="mono-label">05 / Field notes</p>
          <h2 className="photo-field-title">
            What the lab
            <br />
            <em>doesn&apos;t see.</em>
          </h2>
        </div>
        <div className="photo-field-aside">
          <p>
            Photographs made away from the workbench: slow mornings, small company, the city at a
            distance, and whatever the dark was doing.
          </p>
          <Link href="/gallery" className="text-arrow" data-cursor="All frames">
            All 27 frames
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="photo-marquee" aria-label="Selected photographs">
        <div className="photo-track" data-fx-pause>
          {sequence.map((key, index) => (
            <Frame key={key} plateKey={key} index={index} />
          ))}
        </div>
        <div className="photo-track" data-fx-pause aria-hidden="true">
          {sequence.map((key, index) => (
            <Frame key={`${key}-clone`} plateKey={key} index={index} clone />
          ))}
        </div>
      </div>

      <div className="wrap photo-field-foot">
        <span>Yogyakarta / Wonosobo / Singapore</span>
        <span>35mm &amp; digital — 2022–2026</span>
      </div>
    </section>
  );
}
