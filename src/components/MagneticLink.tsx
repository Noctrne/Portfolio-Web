"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagneticLink({ href, children, className, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--mag-x", `${(nx * 18).toFixed(1)}px`);
    el.style.setProperty("--mag-y", `${(ny * 12).toFixed(1)}px`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mag-x", "0px");
    el.style.setProperty("--mag-y", "0px");
  };

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      data-cursor="Say hello"
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
