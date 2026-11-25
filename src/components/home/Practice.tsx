import Link from "next/link";
import { capabilities, experience } from "@/content/site";

interface Props {
  variant?: "home" | "about";
}

const descriptions = [
  "Perception, control, and the software that holds a robot together when the pool gets loud.",
  "Sensors, boards, and integration work that survives real current, real vibration, and real deadlines.",
  "Models, images, and explanations that make technical work legible to the people who need it.",
];

export default function Practice({ variant = "home" }: Props) {
  return (
    <section className="practice section" id="practice">
      <div className="practice-cross" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="wrap practice-layout">
        <header className="practice-head">
          <p className="mono-label">
            <span className="signal-dot" aria-hidden="true" />
            {variant === "home" ? "04 / Practice" : "02 / Capabilities"}
          </p>
          <h2 className="practice-title">
            Three disciplines,
            <br />
            <em>one instinct.</em>
          </h2>
          <p className="practice-lede">
            The tools change between a robot and a photograph. The work doesn&apos;t: understand the
            constraint, then make the result feel inevitable.
          </p>
        </header>

        <div className="practice-main">
          <div className="discipline-list">
            {capabilities.map((group, index) => (
              <details className="discipline" key={group.title} open={index === 0}>
                <summary>
                  <span className="discipline-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{group.title}</h3>
                  <span className="discipline-toggle" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </summary>
                <div className="discipline-body">
                  <p>{descriptions[index]}</p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>

          {variant === "home" ? (
            <aside className="practice-record">
              <p className="mono-label">Currently / recent</p>
              <ul>
                {experience.slice(0, 3).map((item, index) => (
                  <li key={`${item.period}-${item.title}`}>
                    <span className="practice-record-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="practice-record-year">{item.period}</span>
                    <span className="practice-record-title">{item.title}</span>
                    <span className="practice-record-org">{item.org}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="text-arrow" data-cursor="Read more">
                Full field record
                <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          ) : (
            <aside className="practice-record practice-record--note">
              <p className="mono-label">Working principle</p>
              <p className="practice-pull">
                “A system is finished when someone else can understand it — not just when it runs.”
              </p>
              <p className="practice-note">
                I work across mechanical, electrical, and software boundaries. The best result is
                usually the one with fewer moving parts and a clearer explanation.
              </p>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
