// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: ganti dengan domain final sebelum deploy.
export default defineConfig({
  site: 'https://abyvictus.com',
  integrations: [sitemap()],
  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
