"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OrbitField = dynamic(() => import("./OrbitField"), {
  ssr: false,
  loading: () => null,
});

/**
 * The WebGL scene is a large desktop-only flourish. Gate the dynamic import
 * behind a media query so phones never download Three.js — and so reduced
 * motion never pays for a canvas it will not animate.
 */
export default function OrbitFieldLazy() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return enabled ? <OrbitField /> : null;
}
