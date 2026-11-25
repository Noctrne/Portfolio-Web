"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { cx } from "@/lib/cx";

const menuItems = [
  {
    label: "Work",
    href: "/work",
    meta: "06 projects",
    image: "/images/work/cupank-rexink.jpg",
    note: "Autonomous systems, embedded software, and mechanical design.",
  },
  {
    label: "Gallery",
    href: "/gallery",
    meta: "27 frames",
    image: "/images/gallery/after-dark.jpg",
    note: "Field notes, quiet company, city studies, and the dark.",
  },
  {
    label: "Blog",
    href: "/blog",
    meta: "00 entries",
    image: "/images/gallery/still-water.jpg",
    note: "Build logs, field notes, and things learned the hard way.",
  },
  {
    label: "About",
    href: "/about",
    meta: "Profile",
    image: "/images/portrait.jpg",
    note: "An engineer by training, a photographer by habit.",
  },
  {
    label: "Contact",
    href: "/contact",
    meta: "Say hello",
    image: "/images/gallery/lamp-field.jpg",
    note: "For engineering, photography, design, or something in between.",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const wasOpen = useRef(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setCondensed(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
    window.dispatchEvent(new CustomEvent("ap:menu", { detail: { open } }));

    if (open) {
      wasOpen.current = true;
      const first = panelRef.current?.querySelector<HTMLElement>("a, button");
      const timer = window.setTimeout(() => first?.focus(), 180);
      return () => window.clearTimeout(timer);
    }

    if (wasOpen.current) {
      wasOpen.current = false;
      toggleRef.current?.focus();
    }

    return () => {
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !open || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])"),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cx("site-header", condensed && "is-scrolled", open && "is-menu-open")}
        data-site-header
      >
        <div className="site-header-inner">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              AP<span>/</span>26
            </span>
            <span className="brand-name">{site.name}</span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx("site-nav-link", isActive(item.href) && "is-current")}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header-actions">
            <div className="site-status" aria-label="Availability">
              <span className="signal-dot" aria-hidden="true" />
              <span className="site-status-text">{site.availability}</span>
              <span className="site-status-sep" aria-hidden="true">
                /
              </span>
              <span className="site-status-location">{site.location}</span>
            </div>

            <button
              ref={toggleRef}
              type="button"
              className={cx("menu-trigger", open && "is-open")}
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close navigation index" : "Open navigation index"}
            >
              <span className="menu-trigger-label">{open ? "Close" : "Index"}</span>
              <span className="menu-trigger-bars" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
        <span className="header-progress" aria-hidden="true">
          <span ref={progressRef} />
        </span>
      </header>

      <div
        id="site-menu"
        ref={panelRef}
        className={cx("menu-overlay", open && "is-open")}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu-overlay-grid" aria-hidden="true" />
        <div className="menu-panel">
          <div className="menu-primary">
            <div className="menu-kicker">
              <p className="mono-label">Navigation index</p>
              <p className="mono-label">Yogyakarta — {new Date().getFullYear()}</p>
            </div>

            <nav className="menu-nav" aria-label="Primary">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx("menu-item", isActive(item.href) && "is-current")}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <span className="menu-item-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="menu-item-label">{item.label}</span>
                  <span className="menu-item-meta">{item.meta}</span>
                  <span className="menu-item-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ))}
            </nav>

            <div className="menu-foot">
              <a href={`mailto:${site.email}`} className="menu-email" data-cursor="Email">
                {site.email}
              </a>
              <ul className="menu-socials">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer">
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="menu-visual" aria-hidden="true">
            <div className="menu-image-stack">
              {menuItems.map((item, index) => (
                <figure
                  className={cx("menu-image", index === active && "is-active")}
                  key={item.image}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 38vw, 1px"
                    loading="lazy"
                    className="object-cover"
                  />
                </figure>
              ))}
              <span className="menu-image-frame" />
              <span className="menu-image-count">
                {String(active + 1).padStart(2, "0")} / {String(menuItems.length).padStart(2, "0")}
              </span>
            </div>
            <p className="menu-note">{menuItems[active].note}</p>
            <p className="menu-location">
              {site.location}
              <span>UTC +7 / 2026</span>
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
