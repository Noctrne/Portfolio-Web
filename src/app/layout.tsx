import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource-variable/inter";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/motion/Loader";
import RouteTransition from "@/components/RouteTransition";
import SmoothScroll from "@/components/motion/SmoothScroll";
import SiteMotion from "@/components/motion/SiteMotion";
import PerfGovernor from "@/components/motion/PerfGovernor";
import { site } from "@/content/site";

const defaultTitle = `${site.name} — Portfolio`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b09",
  colorScheme: "dark",
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yogyakarta",
    addressCountry: "ID",
  },
  sameAs: site.socials.map((social) => social.href),
};

const motionGate = `(function(){try{
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var save=navigator.connection&&navigator.connection.saveData;
if(reduce||save)return;
document.documentElement.classList.add('motion');
var cores=navigator.hardwareConcurrency||8;
var slow=window.matchMedia&&window.matchMedia('(update: slow)').matches;
if(cores<=4||slow)document.documentElement.classList.add('perf-low');
if(!navigator.webdriver){
document.documentElement.classList.add('loading');
}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />

        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <div className="page-rails" aria-hidden="true" />
        <div className="print-frame" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span className="print-frame-spine">Field report — {site.year}</span>
        </div>

        <Header />

        <main id="main">{children}</main>

        <Footer />

        <Cursor />
        <RouteTransition />
        <Loader />
        <SmoothScroll />
        <SiteMotion />
        <PerfGovernor />
      </body>
    </html>
  );
}
