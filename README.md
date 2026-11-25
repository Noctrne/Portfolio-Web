# Personal portfolio — Next.js

Portfolio multi-halaman dengan arah visual **Signal / Field**: field hampir hitam,
tipografi serif bone yang besar, sinyal oranye, aksen acid-lime, dan label teknis
monospace. Situs menggabungkan proyek engineering, pengalaman, galeri foto, dan
catatan pribadi dalam satu tempat.

Versi ini adalah penulisan ulang dari Astro ke **Next.js App Router**, dengan sistem
gerak yang menyusun seluruh halaman: hero kinetik, manifesto yang di-pin, rail karya
horizontal, preview karya yang mengikuti kursor, menu indeks layar penuh, transisi
antar-route, dan satu objek 3D di halaman About.

## Stack

- **Next.js 16.4** — App Router, static prerender, `next/image`
- **React 19** + **TypeScript**
- **Tailwind CSS 4** — utility untuk layout; token dan komponen dasar di `globals.css`
- **GSAP 3.15** — `ScrollTrigger`, `SplitText`, `useGSAP`
- **Lenis 1.3** — smooth scroll yang disinkronkan ke ticker GSAP
- **Three.js 0.187** — orbital wireframe di header About
- **Fontsource** — Newsreader (display), Inter (teks), IBM Plex Mono (label teknis)

## Menjalankan

Node.js **22+** diperlukan.

```powershell
npm install
npm run dev
```

Dev server: <http://localhost:3000>

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build |
| `npm run typecheck` | Type-check TypeScript |
| `npm run check` | Type-check lalu build |

## Struktur

```text
src/
├── app/
│   ├── layout.tsx               # metadata, font, header/footer, motion mount
│   ├── template.tsx             # fade masuk antar halaman
│   ├── globals.css              # design tokens + seluruh komponen visual
│   ├── page.tsx                 # Home
│   ├── work/page.tsx            # index karya + filter
│   ├── work/[slug]/page.tsx     # studi kasus, reading progress, next project
│   ├── gallery/page.tsx         # galeri + lightbox
│   ├── about/page.tsx           # bio, timeline, orbit 3D
│   ├── contact/page.tsx
│   ├── blog/page.tsx            # empty state
│   ├── not-found.tsx
│   ├── sitemap.ts / robots.ts
├── components/                  # Header, Footer, WorkIndex, GalleryView, Cursor, dll.
│   ├── home/                    # Hero, Manifesto, WorkRail, Practice, PhotoField, AboutBand
│   ├── motion/                  # SmoothScroll, SiteMotion, Loader
│   └── three/                   # OrbitField + lazy wrapper
├── content/
│   ├── site.ts                  # identitas, nav, capabilities, experience
│   ├── work.ts                  # 6 proyek + isi studi kasus
│   └── gallery.ts               # 27 foto, chapter, urutan
└── lib/
    ├── gsap.ts                  # registrasi plugin terpusat
    └── cx.ts
public/images/                   # portrait, work, gallery
```

## Sistem gerak

- **Loader** tampil pada setiap pemuatan penuh (bukan navigasi antar-route):
  counter, status berurutan, deret ikon kamera/chip/pena/kode/orbit, tanda tangan
  kecil “Pradhipta”, lalu tirai oranye “Signal acquired.” Scroll dikunci selama
  intro; ada tombol Skip.
- **Lenis** menggerakkan scroll dan menyuplai `ScrollTrigger.update`; saat menu
  atau loader aktif, scroll dihentikan.
- **SiteMotion** menangani reveal blok, split heading per baris dengan mask, dan
  parallax berbasis CSS variable supaya tidak menabrak animasi CSS lain.
- **Manifesto** di Home di-pin dan di-scrub di desktop; di mobile menjadi alur biasa.
- **WorkRail** memakai pin ScrollTrigger dan menggeser `scrollLeft` asli, sehingga
  rail tetap bisa di-scroll dengan keyboard dan trackpad di layar sentuh.
- **WorkIndex** memfilter baris karya dan menampilkan preview gambar yang mengikuti
  kursor pada perangkat dengan pointer presisi.
- **GalleryView** memberi tilt halus pada plat, pergeseran baris, dan lightbox
  `<dialog>` dengan navigasi keyboard.
- **RouteTransition** menjalankan tirai oranye saat berpindah halaman internal;
  **Cursor** dan **MagneticLink** menambah umpan balik pointer di desktop.
- **ReadingProgress** mengisi bar tipis mengikuti posisi baca di halaman studi kasus.
- **OrbitField** berhenti saat keluar viewport dan tidak dirender untuk reduced motion.

Gerak hanya aktif jika `prefers-reduced-motion` tidak diminta dan `saveData` mati.
Tanpa JavaScript, semua konten tetap terlihat karena kelas `.motion` tidak pernah
ditambahkan. Tema gelap adalah default; `.theme-bone` dan `.theme-signal` dipakai
untuk section yang membalik palet tanpa mengubah token global. Loader juga
dilewati untuk `prefers-reduced-motion`, `saveData`, dan browser otomatis.

## Mengubah konten

### Identitas situs

Edit `src/content/site.ts` — nama, peran, lokasi, email, sosial, dan URL domain.
Metadata umum ada di `src/app/layout.tsx`; sitemap dan robots dibuat dari
`src/app/sitemap.ts` dan `src/app/robots.ts`.

### Menambah karya

1. Tambahkan objek ke array `works` di `src/content/work.ts`.
2. Taruh cover di `public/images/work/` (JPG/WebP, sisi terpanjang ~1600 px).
3. Isi field wajib: `slug`, `title`, `category`, `year`, `summary`, `tools`,
   `cover`, `coverAlt`, `featured`, `order`, `links`, dan `sections`.
4. `sections` berisi `{ heading?, paragraphs: string[] }`; heading boleh kosong.
5. `featured: true` menandai karya unggulan; `order` menentukan urutan rail Home
   dan index karya. Rail menampilkan seluruh karya yang ada di array.

Halaman `/work/[slug]` dan entri sitemap dibuat otomatis dari array tersebut.

### Menambah foto galeri

1. Tambahkan entri ke objek `plates` di `src/content/gallery.ts` dengan `src`,
   `title`, `caption`, `year`, `alt`, dan `description`.
2. Masukkan key-nya ke `chapters` — layout `hero-rows` memakai `hero` + `rows`,
   layout `split` memakai `lead` + `stack`.
3. Nomor urut, jumlah frame, dan urutan lightbox dihitung otomatis dari chapter.

Gambar disimpan di `public/images/gallery/`. Marquee foto di Home memakai
`featuredPlates`; urutan chapter dan lightbox mengikuti array `chapters`.

### Blog

Halaman `/blog` saat ini adalah empty state. Saat tulisan siap, tambahkan modul
konten (mis. `src/content/blog.ts`), lalu render daftar dan detailnya di
`src/app/blog/`. Jangan mengisi halaman dengan tautan palsu.

## Gambar

Semua gambar publik berada di `public/images/`. `next/image` mengurus ukuran
responsif, format AVIF/WebP, dan lazy loading. Selalu isi `alt` yang deskriptif;
teks dekoratif dan ornamen diberi `aria-hidden`.

## Deploy

Build dengan `npm run build`, lalu deploy ke Vercel (framework terdeteksi otomatis
sebagai Next.js). Domain produksi diatur di `src/content/site.ts` dan dapat
ditimpa lewat environment Vercel bila perlu.

## Catatan

- Jangan commit, push, atau deploy tanpa persetujuan eksplisit.
- Dev indicator kecil di pojok hanya muncul saat `npm run dev`.
- Palet, tipografi, dan komponen visual berada di `src/app/globals.css`.
- Warna inti: `--color-paper` (field), `--color-ink` (bone), `--color-signal`
  (oranye), `--color-acid` (lime). Gunakan token ini, bukan nilai hex lepas.
