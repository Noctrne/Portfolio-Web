## Development

Run the dev server as a background command:

```
npm run dev
```

It serves <http://localhost:3000>. Stop it from the background shell session when
you are done. Before handing work back, run:

```
npm run typecheck
npm run build
```

Content lives in typed modules under `src/content/` — there is no CMS and no
Markdown pipeline. Work case studies are objects in `src/content/work.ts`; gallery
chapters and plates are in `src/content/gallery.ts`; identity, navigation, and
experience are in `src/content/site.ts`.

## Visual system

The site is dark-first ("Signal / Field"): near-black field, bone type, signal
orange, acid-lime accents, and IBM Plex Mono labels. Tokens live in
`src/app/globals.css` — `--color-paper`, `--color-ink`, `--color-signal`,
`--color-acid`, `--color-muted`. Use tokens instead of raw hex values.
`.theme-bone` and `.theme-signal` invert the palette per section; on bone,
`--color-signal` is deliberately darkened so text still meets contrast.

Home is composed in `src/app/page.tsx` from `src/components/home/`: `Hero`,
`Manifesto`, `WorkRail`, `Practice`, `PhotoField`, `AboutBand`. Site chrome and
shared views are `Header`, `Footer`, `WorkIndex`, `GalleryView`, `ContactSection`,
`Cursor`, `MagneticLink`, and `RouteTransition`.

## Motion

Motion is a first-class part of the site. When changing components, keep the
`data-reveal`, `data-parallax`, and `data-split` hooks working, and check the
result in a browser at desktop and mobile widths. Preserve the
`prefers-reduced-motion` path and the no-JavaScript fallback.

- The intro loader runs on hard page loads only (not route changes), locks
  scroll, and must keep its Skip button, reduced-motion bypass, and `inert`
  cleanup working.
- Desktop work rail: GSAP pin + `scrollLeft`; below 1024px it is a native
  horizontal scroller.
- Mobile rail and photo marquee rely on `scroll-snap`. Keep
  `scroll-padding-left` equal to the container's left padding so snap points do
  not crop the gutter.
- Controls use `aria-label`/`aria-labelledby` only when the accessible name
  contains the visible text; otherwise use `sr-only` text inside the control.

Do not commit, push, or deploy without explicit approval from the user.

## Documentation

Read the local Next.js guides in `node_modules/next/dist/docs/` before changing
routing, layouts, metadata, images, or server/client component boundaries.

- [App Router and layouts](https://nextjs.org/docs/app/building-your-application/routing)
- [Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering)
- [Images](https://nextjs.org/docs/app/api-reference/components/image)
- [Metadata and sitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Lenis](https://github.com/darkroomengineering/lenis)
- [Tailwind CSS 4](https://tailwindcss.com/docs)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
