/**
 * Satu sumber kebenaran untuk identitas situs.
 * Ganti nilai di sini sebelum deploy — nama, email, sosial, dan domain.
 */
export const site = {
  name: 'Aby Victus',
  firstName: 'Aby',
  role: 'Photographer, designer & developer',
  location: 'Jakarta, Indonesia',
  email: 'hello@abyvictus.com',
  description:
    'Portfolio of Aby Victus — photographic series, design systems, and selected web projects.',
  url: 'https://abyvictus.com',
  year: 2026,
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
    { label: 'Behance', href: 'https://behance.net/' },
  ],
} as const;

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const capabilities = [
  {
    title: 'Photography',
    items: ['Editorial', 'Portrait', 'Still life', 'Sequencing'],
  },
  {
    title: 'Design',
    items: ['Identity', 'Editorial layout', 'Interface', 'Design systems'],
  },
  {
    title: 'Development',
    items: ['Astro', 'TypeScript', 'CSS & motion', 'Performance'],
  },
];
