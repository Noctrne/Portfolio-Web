# Portfolio — Astro

Portfolio multi-halaman dengan arah visual *light editorial*: kertas hangat, tipografi
serif, hairline border, dan banyak whitespace. Berisi proyek engineering, pengalaman,
dan galeri karya seni. Konten dikelola lewat Markdown, output sepenuhnya statis.

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
├── content/work/           # satu file .md per proyek engineering
├── content/gallery/        # satu file .md per karya seni
├── data/site.ts            # nama, email, sosial, lokasi
├── layouts/BaseLayout.astro
├── pages/                  # index, work, gallery, about, contact, 404
├── scripts/main.ts         # reveal on scroll, menu, filter, lightbox
└── styles/global.css       # design tokens + komponen dasar
```

## Warna

Palet dibatasi lima warna slate/fog tanpa blok warna besar:

| Warna | Hex | Peran |
| --- | --- | --- |
| Slate | `#2C3E50` | teks utama dan judul |
| Slate light | `#34495E` | teks sekunder, hover, dan label |
| Gray | `#7F8C8D` | aksen dekoratif, garis fokus, dan detail |
| Fog | `#BDC3C7` | border, garis pemisah, dan mat gambar |
| Off-white | `#ECF0F1` | kanvas halaman dan area baca |

Halaman tetap satu warna dasar off-white; hierarki dibangun lewat tipografi,
hairline, whitespace, dan gambar, bukan lewat section berwarna gelap. Token
tersedia di `src/styles/global.css` sebagai `--color-paper`, `--color-ink`,
`--color-line`, dan seterusnya.

## Menambah karya

1. Buat file `src/content/work/nama-proyek.md`.
2. Taruh gambar cover di `src/assets/work/` (rasio 4:5 disarankan).
3. Isi frontmatter:

```yaml
---
title: Nama Proyek
category: autonomy   # autonomy | software | embedded
year: 2026
summary: Satu kalimat ringkas.
role: Captain & senior programmer
tools: [C++, ROS2, Python]
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

## Menambah karya galeri

Galeri memakai content collection terpisah dan tidak memerlukan body Markdown.

1. Taruh gambar di `src/assets/gallery/` (rasio bebas — grid memakai masonry).
2. Buat file `src/content/gallery/nama-karya.md`.
3. Isi frontmatter:

```yaml
---
title: Nama Karya
medium: photography   # photography | illustration | video | bebas
year: 2026
description: Satu kalimat tentang karya ini.
cover: ../../assets/gallery/nama-karya.jpg
coverAlt: Deskripsi gambar untuk aksesibilitas
video: /gallery/nama-karya.mp4   # opsional, untuk medium video
featured: true        # tampil di teaser Home
order: 1              # urutan di galeri
---
```

Filter medium dibuat otomatis dari nilai `medium`, jadi menambah kategori baru
(misalnya `3d` atau `motion`) cukup dengan menulis nilainya di frontmatter.

Untuk video, simpan file di `public/gallery/` lalu isi `video` dengan path publik
(`/gallery/nama-file.mp4`). `cover` tetap dipakai sebagai poster dan thumbnail.
Video contoh `field-record.mp4` dibuat dari poster SVG memakai ffmpeg; ganti dengan
hasil karya sendiri.

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
