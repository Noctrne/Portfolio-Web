import { cx } from "@/lib/cx";

export type OrnamentVariant =
  | "arcs"
  | "orbit"
  | "corners"
  | "wave"
  | "ticks"
  | "scribble"
  | "spark"
  | "cross"
  | "field"
  | "contour"
  | "measure"
  | "bloom";

interface Props {
  variant?: OrnamentVariant;
  className?: string;
}

const base = "ornament";
const strokeProps = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

export default function Ornament({ variant = "arcs", className }: Props) {
  const className_ = cx(base, className);

  if (variant === "arcs") {
    return (
      <svg className={className_} viewBox="0 0 420 420" {...strokeProps}>
        <circle cx="210" cy="210" r="200" strokeWidth="1" opacity="0.55" />
        <circle cx="210" cy="210" r="151" strokeWidth="1" opacity="0.32" />
        <circle cx="210" cy="210" r="102" strokeWidth="1" opacity="0.2" />
        <path d="M210 10a200 200 0 0 1 200 200" strokeWidth="1" opacity="0.75" />
        <circle cx="210" cy="10" r="3.5" fill="currentColor" stroke="none" />
        <path d="M10 210h34M376 210h34M210 376v34" strokeWidth="1" opacity="0.45" />
      </svg>
    );
  }

  if (variant === "orbit") {
    return (
      <svg className={className_} viewBox="0 0 120 120" {...strokeProps}>
        <circle cx="60" cy="60" r="54" strokeWidth="1" opacity="0.65" />
        <circle cx="60" cy="60" r="33" strokeWidth="1" opacity="0.35" />
        <circle cx="60" cy="60" r="4.5" fill="currentColor" stroke="none" />
        <path d="M60 0v13M60 107v13M0 60h13M107 60h13" strokeWidth="1" opacity="0.6" />
      </svg>
    );
  }

  if (variant === "corners") {
    return (
      <svg className={className_} viewBox="0 0 100 100" preserveAspectRatio="none" {...strokeProps}>
        <path
          d="M0 12V0h12M88 0h12v12M100 88v12H88M12 100H0V88"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  if (variant === "wave") {
    return (
      <svg className={className_} viewBox="0 0 240 24" preserveAspectRatio="none" {...strokeProps}>
        <path d="M2 17C50 2 92 2 140 11s58 7 98-4" pathLength="1" strokeWidth="1.4" />
      </svg>
    );
  }

  if (variant === "ticks") {
    return (
      <svg className={className_} viewBox="0 0 240 16" preserveAspectRatio="none" {...strokeProps}>
        <path d="M0 15.5h240" strokeWidth="1" opacity="0.6" />
        {Array.from({ length: 13 }).map((_, index) => (
          <path
            key={index}
            d={`M${index * 20} 15.5V${index % 3 === 0 ? 2 : 9}`}
            strokeWidth="1"
            opacity="0.6"
          />
        ))}
      </svg>
    );
  }

  if (variant === "scribble") {
    return (
      <svg className={className_} viewBox="0 0 90 70" {...strokeProps}>
        <path d="M4 62C16 30 42 10 80 12" pathLength="1" strokeWidth="1.3" />
        <path d="m68 5 12 7-9 11" pathLength="1" strokeWidth="1.3" />
      </svg>
    );
  }

  if (variant === "spark") {
    return (
      <svg className={className_} viewBox="0 0 24 24" {...strokeProps}>
        <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" strokeWidth="1" />
      </svg>
    );
  }

  if (variant === "cross") {
    return (
      <svg className={className_} viewBox="0 0 16 16" {...strokeProps}>
        <path d="M8 2v12M2 8h12" strokeWidth="1" />
      </svg>
    );
  }

  if (variant === "field") {
    return (
      <svg className={className_} viewBox="0 0 240 160" {...strokeProps}>
        {Array.from({ length: 24 }).map((_, index) => {
          const x = 20 + (index % 6) * 40;
          const y = 20 + Math.floor(index / 6) * 40;
          return (
            <path
              key={index}
              d={`M${x} ${y - 3}v6M${x - 3} ${y}h6`}
              strokeWidth="1"
              opacity="0.55"
            />
          );
        })}
      </svg>
    );
  }

  if (variant === "contour") {
    const lines = [
      "M-30 324c96-42 151-24 228-55s146-82 250-52 129 49 218 13",
      "M-30 296c91-35 144-22 221-50s147-80 250-51 126 45 211 14",
      "M-30 268c88-31 144-19 218-45s148-78 251-50 122 41 208 14",
      "M-30 240c84-27 141-16 215-40s149-76 251-48 119 37 206 12",
      "M-30 212c80-23 138-13 211-35s150-74 251-46 117 33 204 10",
      "M-30 184c77-19 135-10 208-30s151-71 252-44 114 29 201 8",
    ];
    const opacities = ["0.46", "0.34", "0.28", "0.22", "0.18", "0.14"];
    return (
      <svg className={className_} viewBox="0 0 640 360" {...strokeProps}>
        {lines.map((d, index) => (
          <path key={d} d={d} strokeWidth="1" opacity={opacities[index]} />
        ))}
      </svg>
    );
  }

  if (variant === "measure") {
    return (
      <svg className={className_} viewBox="0 0 480 32" {...strokeProps}>
        <path d="M4 16h472" strokeWidth="1" opacity="0.65" />
        <path d="M4 7v18M476 7v18" strokeWidth="1" opacity="0.7" />
        {Array.from({ length: 17 }).map((_, index) => {
          const x = 4 + index * 29.5;
          return (
            <path
              key={index}
              d={`M${x} 16V${index % 4 === 0 ? 5 : 10}`}
              strokeWidth="1"
              opacity={index % 4 === 0 ? "0.55" : "0.35"}
            />
          );
        })}
      </svg>
    );
  }

  if (variant === "bloom") {
    return (
      <svg className={className_} viewBox="0 0 200 200" {...strokeProps}>
        {Array.from({ length: 28 }).map((_, index) => {
          const angle = (index * (360 / 28) * Math.PI) / 180;
          const inner = 38;
          const outer = index % 4 === 0 ? 94 : index % 2 === 0 ? 76 : 62;
          const x1 = 100 + Math.cos(angle) * inner;
          const y1 = 100 + Math.sin(angle) * inner;
          const x2 = 100 + Math.cos(angle) * outer;
          const y2 = 100 + Math.sin(angle) * outer;
          return (
            <path
              key={index}
              d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`}
              strokeWidth="1"
              opacity={index % 4 === 0 ? "0.55" : "0.3"}
            />
          );
        })}
        <circle cx="100" cy="100" r="24" strokeWidth="1" opacity="0.25" />
        <circle cx="100" cy="100" r="4" fill="currentColor" stroke="none" opacity="0.55" />
      </svg>
    );
  }

  return null;
}
