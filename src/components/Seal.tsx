import { cx } from "@/lib/cx";

interface Props {
  id: string;
  text?: string;
  className?: string;
}

export default function Seal({
  id,
  text = "ENGINEER · PHOTOGRAPHER · DESIGNER · 2026 · ",
  className,
}: Props) {
  return (
    <svg
      className={cx("seal", className)}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={id} d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>

      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      <g className="seal-text">
        <text fontFamily="var(--font-sans)" fontSize="7" letterSpacing="1.6" fill="currentColor">
          <textPath href={`#${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </g>

      <g className="seal-center" stroke="currentColor" strokeLinecap="round">
        <path d="M60 47v26M47 60h26" strokeWidth="1.2" opacity="0.8" />
        <circle cx="60" cy="60" r="18" strokeWidth="1" opacity="0.35" />
      </g>
    </svg>
  );
}
