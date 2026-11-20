/**
 * Satu sumber kebenaran untuk identitas situs.
 * Ganti nilai di sini sebelum deploy — nama, email, sosial, dan domain.
 */
export const site = {
  name: 'Abyasa Pradhipta',
  firstName: 'Abyasa',
  role: 'Robotics engineer & software developer',
  location: 'Yogyakarta, Indonesia',
  availability: 'Open to engineering roles',
  email: 'dhiipt32@gmail.com',
  description:
    'Portfolio of Abyasa Pradhipta — autonomous systems, computer vision, embedded software, and visual work.',
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
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const capabilities = [
  {
    title: 'Autonomy & Software',
    items: ['C++ & Python', 'ROS2', 'Computer vision', 'Linux'],
  },
  {
    title: 'Hardware & Embedded',
    items: ['Microcontrollers', 'Sensors & SBC', 'IoT systems', 'Fusion 360 / Inventor'],
  },
  {
    title: 'Communication & Craft',
    items: ['Photography & video', 'Editorial design', 'Teaching & mentoring', 'Technical writing'],
  },
];

export const experience = [
  {
    period: '2025 — 2026',
    title: 'Captain, ORCA V3 Sub-team',
    org: 'Gadjah Mada Robotic Team UGM',
    note: 'Led the autonomous underwater vehicle programme to a Top 8 world ranking at SAUVC 2026.',
  },
  {
    period: '2026',
    title: 'Research Intern, Autonomous Underwater Vehicle',
    org: 'Elins Embedded System & Robotics Lab × CV Aksaka',
    note: 'Researched AUV systems in an industry collaboration.',
  },
  {
    period: '2026 — present',
    title: 'Senior Programmer, Robotics Division',
    org: 'Elins Research Club UGM',
    note: 'Lead software development and mentor programmers within the division.',
  },
  {
    period: '2024 — 2026',
    title: 'Programmer, ORCA Sub-team',
    org: 'Gadjah Mada Robotic Team UGM',
    note: 'Developed competition software for the ORCA autonomous underwater vehicle.',
  },
  {
    period: '2025',
    title: 'Subcoordinator, Line Follower Competition',
    org: 'Elins Progressive Innovation and Robotics Event UGM',
    note: 'Co-coordinated the competition and its event execution.',
  },
  {
    period: '2023 — 2024',
    title: 'Master Trainer',
    org: 'Yayasan Sagasitas Indonesia',
    note: 'Taught cloud computing and robotics to high-school students nationwide.',
  },
];

export const education = [
  {
    period: '2024 — present',
    title: 'Universitas Gadjah Mada',
    note: 'B.Eng. Electronics & Instrumentation — GPA 3.88',
  },
  {
    period: '2021 — 2024',
    title: 'SMA Negeri 6 Yogyakarta',
    note: 'Science major — 1st place for best student',
  },
];

export const recognition = [
  'Top 8 worldwide — SAUVC 2026, Singapore Autonomous Underwater Vehicle Challenge',
  'National finalist — Kihajar STEM 2022',
  'Top 10 city level — National Science Olympiad (Informatics) 2023',
  'Participant — Intel AI Global Impact Festival 2023',
];
