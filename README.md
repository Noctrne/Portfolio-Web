# Portfolio — Astro

Portfolio satu halaman dengan arah visual *light editorial*: kertas hangat, tipografi
serif, hairline border, dan banyak whitespace. Konten dikelola lewat Markdown, output
sepenuhnya statis.

## Stack

- **Astro 7** — static site, hampir tanpa JavaScript
- **Tailwind CSS 4** — token warna, tipografi, spacing, breakpoint
- **Content Collections + Markdown** — `src/content/work/*.md`
- **astro:assets (sharp)** — resize & konversi gambar ke WebP saat build
- **View Transitions** — transisi antar halaman
- **Font self-host** — Newsreader (display) + Inter (teks)

## Menjalankan

Node.js **22+** diperlukan. Di mesin ini Node dipasang portable di
`%LOCALAPPDATA%\nodejs` dan belum masuk PATH permanen, jadi buka terminal dengan:

```powershell
$env:PATH = "$env:LOCALAPPDATA\nodejs;$env:PATH"
npm install
npm run dev
```

Dev server: <http://localhost:4321>

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Preview hasil build |
| `npm run check` | Type-check Astro |
| `npm run placeholders` | Regenerate gambar placeholder |
| `npm run check:ui` | Tes filter, menu, navigasi (butuh dev server) |
| `npm run check:responsive` | Cek overflow 360–1440px (butuh dev server) |
| `npm run shots` | Screenshot semua halaman (butuh dev server) |

## Struktur

```text
src/
├── assets/                 # gambar sumber (dioptimasi saat build)
├── components/             # Header, Footer, WorkCard, ContactSection
├── content/work/           # satu file .md per karya
├── data/site.ts            # nama, email, sosial, lokasi
├── layouts/BaseLayout.astro
├── pages/                  # index, work, about, contact, 404
├── scripts/main.ts         # reveal on scroll, menu, filter
└── styles/global.css       # design tokens + komponen dasar
```

## Menambah karya

1. Buat file `src/content/work/nama-proyek.md`.
2. Taruh gambar cover di `src/assets/work/` (rasio 4:5 disarankan).
3. Isi frontmatter:

```yaml
---
title: Nama Proyek
category: photography   # photography | design | code
year: 2026
summary: Satu kalimat ringkas.
role: Photography, sequencing
tools: [Digital, 35mm]
cover: ../../assets/work/nama-proyek.jpg
coverAlt: Deskripsi gambar untuk aksesibilitas
featured: true          # tampil di Home
order: 1                # urutan di index
links:
  - label: Live site
    href: https://example.com
---
```

Body Markdown di bawah frontmatter otomatis menjadi halaman studi kasus di
`/work/nama-proyek`.

## Mengganti identitas

| Yang diubah | Lokasi |
| --- | --- |
| Nama, email, sosial, lokasi | `src/data/site.ts` |
| Domain (`site`) | `astro.config.mjs` |
| Sitemap URL | `public/robots.txt` |
| Favicon | `public/favicon.svg` |
| OG image | `scripts/placeholders/og.svg` → `npm run placeholders` |
| Semua gambar placeholder | `scripts/placeholders/*.svg` |

Gambar di `src/assets` saat ini adalah **placeholder abstrak**. Ganti dengan foto asli
sebelum publikasi.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Di Vercel: **Add New → Project → Import** repo.
3. Framework terdeteksi otomatis sebagai Astro. Build `npm run build`, output `dist`.
4. Tambahkan domain di **Settings → Domains**.

Karena output statis, situs ini juga bisa di-deploy ke GitHub Pages. Untuk GitHub Pages,
set `base` di `astro.config.mjs` (mis. `/nama-repo`) dan gunakan workflow Actions.

## Catatan

- Toolbar mengambang di bagian bawah hanya muncul saat `npm run dev`.
- Animasi memakai `prefers-reduced-motion`; semua konten tetap terlihat tanpa JavaScript.
- `npm audit` menandai ReDoS pada `picomatch`, dependensi build-time dari Astro. Tidak
  ikut terkirim ke browser pada output statis; perbaikannya menunggu update Astro.
