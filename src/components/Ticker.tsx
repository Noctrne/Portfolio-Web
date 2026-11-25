"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Ornament from "./Ornament";

interface Props {
  items?: string[];
  className?: string;
}

const defaultItems = [
  "Autonomy",
  "Photography",
  "Design",
  "Teaching",
  "Systems",
  "Image-making",
];

export default function Ticker({ items = defaultItems, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const track = trackRef.current;
      const root = rootRef.current;
      if (!track || !root) return;

      const tween = gsap.to(track, {
        xPercent: -16.6667,
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 3);
          gsap.to(tween, { timeScale: boost, duration: 0.2, overwrite: true });
          gsap.to(tween, { timeScale: 1, duration: 1, delay: 0.2, ease: "power2.out" });
        },
      });

      const pause = () => tween.pause();
      const play = () => tween.play();
      root.addEventListener("pointerenter", pause);
      root.addEventListener("pointerleave", play);

      return () => {
        st.kill();
        root.removeEventListener("pointerenter", pause);
        root.removeEventListener("pointerleave", play);
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={`ticker ${className ?? ""}`.trim()} aria-hidden="true">
      <div ref={trackRef} className="ticker-track">
        {Array.from({ length: 6 }).map((_, group) => (
          <div className="ticker-group" key={group}>
            {items.map((item) => (
              <span className="ticker-item" key={`${group}-${item}`}>
                <Ornament variant="spark" className="ticker-spark" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
