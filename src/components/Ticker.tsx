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

      // Fold the scroll velocity into the marquee, but only a few times a
      // second: this runs on every scroll frame otherwise.
      let lastBoost = 0;
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const now = performance.now();
          if (now - lastBoost < 140) return;
          lastBoost = now;
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 3);
          gsap.to(tween, {
            timeScale: boost,
            duration: 0.25,
            overwrite: true,
            onComplete: () => {
              gsap.to(tween, { timeScale: 1, duration: 1.1, ease: "power2.out" });
            },
          });
        },
      });

      // Run only while the strip is on screen, and stop under the pointer.
      let offscreen = false;
      let hovering = false;
      const sync = () => {
        if (offscreen || hovering) tween.pause();
        else tween.play();
      };
      const onEnter = () => {
        hovering = true;
        sync();
      };
      const onLeave = () => {
        hovering = false;
        sync();
      };
      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointerleave", onLeave);

      const io =
        "IntersectionObserver" in window
          ? new IntersectionObserver(
              (entries) => {
                offscreen = !entries[0]?.isIntersecting;
                sync();
              },
              { rootMargin: "160px 0px" },
            )
          : undefined;
      io?.observe(root);

      return () => {
        io?.disconnect();
        st.kill();
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointerleave", onLeave);
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
