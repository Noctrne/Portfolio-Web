---
title: Field Notes — A Quiet Microsite
category: code
year: 2026
summary: A small, fast publication for a landscape researcher, built to stay out of the way of the writing.
role: Design, development
tools: [Astro, MDX, Cloudflare]
cover: ../../assets/work/field-notes.jpg
coverAlt: Dot grid with a thin arc and a small marker
featured: false
order: 6
links:
  - label: Visit site
    href: https://example.com/field-notes
---

Field Notes publishes one entry every few weeks: a location, a photograph, and a short
observation. The site needed to load instantly in places with poor signal.

## Constraints

- Fully static, pre-rendered at build time
- No client-side JavaScript for reading
- Images served as AVIF with a small JPEG fallback
- Content written in Markdown, never in a CMS

## Result

The heaviest page is 180kb including images. Entries are added by dropping a Markdown file
into the repository, which takes about a minute.
