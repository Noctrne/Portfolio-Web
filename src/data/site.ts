/**
 * Satu sumber kebenaran untuk identitas situs.
 * Ganti nilai di sini sebelum deploy — nama, email, sosial, dan domain.
 */
export const site = {
  name: 'Abyasa Pradhipta',
  firstName: 'Abyasa',
  role: 'Robotics engineer, photographer & designer',
  location: 'Yogyakarta, Indonesia',
  availability: 'Open to new work',
  email: 'dhiipt32@gmail.com',
  description:
    'Personal portfolio of Abyasa Pradhipta — engineering projects, photography, and design.',
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
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const capabilities = [
  {
    title: 'Autonomy & Software',
    items: ['C++ & Python', 'ROS 2', 'Computer vision', 'Linux & Gazebo'],
  },
  {
    title: 'Hardware & Embedded',
    items: ['Microcontrollers', 'Sensors & SBC', 'IoT systems', 'Wiring & integration'],
  },
  {
    title: 'Design & Communication',
    items: ['Fusion 360 / Inventor', '3D printing', 'Photography & video', 'Teaching & mentoring'],
  },
];

export const experience = [
  {
    period: '2026',
    title: 'Captain, ORCA AUV Sub-team',
    org: 'Gadjah Mada Robotic Team UGM',
    note: 'Led the autonomous underwater vehicle programme to a Top 8 world ranking at SAUVC 2026.',
  },
  {
    period: '2026 — 2027',
    title: 'Senior Programmer, Robotics Division',
    org: 'Elins Research Club UGM',
    note: 'Develops software for AUV and autonomous car projects, and mentors newer programmers.',
  },
  {
    period: 'Jul — Dec 2026',
    title: 'Research & Development Intern',
    org: 'Elins Embedded System & Robotics Lab × CV Aksaka',
    note: 'AUV research in an industry collaboration, alongside an autonomous car project with PT Stechoq Robotika Indonesia.',
  },
  {
    period: '2024 — 2025',
    title: 'Programmer, ORCA AUV Sub-team',
    org: 'Gadjah Mada Robotic Team UGM',
    note: 'Built competition software for ORCA — sensor handling, perception, and mission behaviour.',
  },
  {
    period: '2025',
    title: 'Part-time Mentor, IoT Hydroponics',
    org: 'Olimpiade Penelitian Siswa Indonesia (OPSI)',
    note: 'Mentored a high-school team building “Hydro Mixer”, an IoT hydroponics system with solar cells.',
  },
  {
    period: '2026',
    title: 'Subcoordinator & Sole Track Designer',
    org: 'INSPIRE UGM',
    note: 'Designed the competition track and coordinated the event with the organising team.',
  },
  {
    period: '2025 — 2026',
    title: 'Academic & Advocacy Division',
    org: 'HMEI UGM',
    note: 'Senior staff in 2026 and staff in 2025, working on academic programmes for the department.',
  },
];

export const education = [
  {
    period: '2024 — present',
    title: 'Universitas Gadjah Mada',
    note: 'B.Eng. Electronics & Instrumentation — GPA 3.88 / 4.00',
  },
  {
    period: '2021 — 2024',
    title: 'SMA Negeri 6 Yogyakarta',
    note: 'Science major — Best Student of the Graduating Class',
  },
];

export const recognition = [
  'Top 8 worldwide — SAUVC 2026, Singapore Autonomous Underwater Vehicle Challenge',
  'Best Student of the Graduating Class — SMA Negeri 6 Yogyakarta',
  'National finalist — Kihajar STEM 2022',
  'Top 10 city level — National Science Olympiad (Informatics) 2023',
];
