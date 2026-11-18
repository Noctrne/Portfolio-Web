/**
 * Satu sumber kebenaran untuk identitas situs.
 * Ganti nilai di sini sebelum deploy — nama, email, sosial, dan domain.
 */
export const site = {
  name: 'Abyasa Pradhipta',
  firstName: 'Abyasa',
  role: 'Photographer, designer & developer',
  location: 'Yogyakarta, Indonesia',
  email: 'test@gmail.com',
  description:
    'Portfolio of Abyasa Pradhipta — photographic series, design systems, and selected web projects.',
  url: 'https://pradhipta.vercel.app',
  year: 2026,
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/dhiptaby' },
    { label: 'GitHub', href: 'https://github.com/Noctrne' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/abyasa-pradhipta' },
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
