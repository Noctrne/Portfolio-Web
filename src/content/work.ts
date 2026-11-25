export type WorkCategory = "autonomy" | "software" | "embedded" | "design";

export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkSection {
  heading?: string;
  paragraphs: string[];
}

export interface Work {
  slug: string;
  title: string;
  category: WorkCategory;
  year: number;
  summary: string;
  role?: string;
  tools: string[];
  cover: string;
  coverAlt: string;
  featured: boolean;
  order: number;
  links: WorkLink[];
  sections: WorkSection[];
}

export const works: Work[] = [
  {
    slug: "orca",
    title: "ORCA — Autonomous Underwater Vehicle",
    category: "autonomy",
    year: 2026,
    summary:
      "Competition software for the Gadjah Mada Robotic Team's autonomous underwater vehicle, which placed Top 8 worldwide at SAUVC 2026.",
    role: "Captain & senior programmer",
    tools: ["C++", "ROS 2", "Python", "Computer Vision", "Gazebo"],
    cover: "/images/work/orca.jpg",
    coverAlt: "The red ORCA autonomous underwater vehicle held above a pool during a test",
    featured: true,
    order: 1,
    links: [],
    sections: [
      {
        paragraphs: [
          "ORCA is the Gadjah Mada Robotic Team's autonomous underwater vehicle, built for the Singapore Autonomous Underwater Vehicle Challenge. I joined the sub-team as a programmer in 2024 and captained it through the 2026 cycle.",
        ],
      },
      {
        heading: "Role",
        paragraphs: [
          "As captain I coordinated development across mechanical, electrical, and software work, and kept the competition plan moving from technical review to pool time. On the software side I worked on sensor handling, perception, and the mission behaviour that lets the vehicle complete its run without a pilot.",
        ],
      },
      {
        heading: "Result",
        paragraphs: [
          "ORCA finished in the Top 8 worldwide at SAUVC 2026. Leading the team two seasons after joining taught me how much of engineering is coordination — making the vehicle understandable to the people building it, not only functional in the water.",
        ],
      },
    ],
  },
  {
    slug: "rov-guard",
    title: "ROV-Guard — DCSE Capstone Project",
    category: "autonomy",
    year: 2026,
    summary:
      "A supervised ROV platform with fail-safe behaviour, built as a DIKE UGM capstone and exhibited at MIPA EXPO 2026.",
    role: "Project Leader",
    tools: ["ROS 2", "Jetson Nano", "Pixhawk", "Python", "C++"],
    cover: "/images/work/rov-guard.jpg",
    coverAlt:
      "ROV-Guard system architecture diagram showing the surface unit, onboard computer, and flight controller",
    featured: true,
    order: 2,
    links: [],
    sections: [
      {
        paragraphs: [
          "ROV-Guard is my capstone project in the Department of Electronics and Instrumentation at Universitas Gadjah Mada, developed with a team and funded through DIKE UGM's Alokasi Dana Masyarakat.",
        ],
      },
      {
        heading: "System",
        paragraphs: [
          "The vehicle is built on an ORCA-class ROV platform. A Pixhawk flight controller handles depth and attitude, while a Jetson Nano companion computer runs a ROS 2 supervision layer. The supervision node watches heartbeat and sensor state, and takes over when a mission needs to fail safe rather than continue.",
        ],
      },
      {
        heading: "What I did",
        paragraphs: [
          "As project leader I set the system architecture, coordinated integration across the mechanical, electrical, and software work, and led pool testing. The project was exhibited at MIPA EXPO 2026.",
        ],
      },
    ],
  },
  {
    slug: "cupank-rexink",
    title: "Cupank Rexink — ERC UGM",
    category: "autonomy",
    year: 2026,
    summary:
      "AUV development at Elins Research Club — simulation, flight-controller firmware, and software guidance for a new team.",
    role: "Programmer",
    tools: ["ROS 2", "Gazebo", "Python", "ArduPilot", "C++"],
    cover: "/images/work/cupank-rexink.jpg",
    coverAlt:
      "A typographic cover reading Cupank Rexink, autonomous underwater vehicle software, ERC UGM 2026",
    featured: true,
    order: 3,
    links: [
      { label: "ROV simulation", href: "https://github.com/Noctrne/ROV-Simulation" },
      { label: "ArduPilot firmware", href: "https://github.com/Noctrne/ardupilot" },
      { label: "Project organisation", href: "https://github.com/Project-ROV-ADB-DIKE" },
    ],
    sections: [
      {
        paragraphs: [
          "Cupank Rexink is an autonomous underwater vehicle developed by the robotics division of Elins Research Club UGM. I joined as a programmer; because of my experience in the GMRT sub-team, I also ended up advising the team on software structure and pool testing.",
        ],
      },
      {
        heading: "Work",
        paragraphs: [
          "I built the Gazebo simulation environment used to test behaviour before pool time, and worked on a custom firmware build for the flight controller. Keeping the simulation close to the real vehicle meant the team could rehearse missions without waiting for a slot in the pool.",
        ],
      },
      {
        heading: "Links",
        paragraphs: [
          "The simulation, firmware, and the wider project repositories are public. They document the vehicle model, pool course, and the ROS 2 packages used on the vehicle.",
        ],
      },
    ],
  },
  {
    slug: "autonomous-car",
    title: "Autonomous Car — ERC UGM",
    category: "software",
    year: 2026,
    summary:
      "Software for a scaled autonomous vehicle in the robotics division of Elins Research Club UGM.",
    role: "Programmer",
    tools: ["Python", "ROS 2", "Computer Vision", "Linux"],
    cover: "/images/work/autonomous-car.jpg",
    coverAlt:
      "A typographic cover reading Autonomous Car, scaled vehicle perception and control, ERC UGM 2026",
    featured: false,
    order: 4,
    links: [{ label: "2025 platform", href: "https://github.com/autonomous-driving-2025" }],
    sections: [
      {
        paragraphs: [
          "The autonomous car is a scaled vehicle used by Elins Research Club as a testbed for perception, planning, and control. I worked on the software side: turning sensor data into a model of the track, and translating that model into steering and speed decisions.",
        ],
      },
      {
        heading: "Focus",
        paragraphs: [
          "The vehicle is deliberately small and the track is controlled, which makes it a useful place to test ideas before they move to larger autonomous systems. Most of the work is in the unglamorous part — reading sensors honestly, handling the cases where the track disappears, and keeping the whole stack predictable.",
        ],
      },
      {
        heading: "Context",
        paragraphs: [
          "The 2025 platform is documented in the autonomous-driving-2025 GitHub organisation, alongside the dashboard and supporting ROS 2 packages.",
        ],
      },
    ],
  },
  {
    slug: "mini-3d-scanner",
    title: "Mini 3D Scanner — Personal Project",
    category: "embedded",
    year: 2026,
    summary:
      "A low-cost turntable 3D scanner built from scratch — CAD, stepper control, IR sensing, and a Python reconstruction pipeline.",
    role: "Design, firmware & software",
    tools: ["Fusion 360", "C++", "Python", "Stepper motors", "IR sensors"],
    cover: "/images/work/mini-3d-scanner.jpg",
    coverAlt:
      "A grey 3D render of the Mini 3D Scanner assembly with turntable and vertical lift",
    featured: true,
    order: 5,
    links: [
      { label: "Mini-3D-Scanner repository", href: "https://github.com/Noctrne/Mini-3D-Scanner" },
    ],
    sections: [
      {
        paragraphs: [
          "A low-cost turntable 3D scanner. A distance sensor measures the object's radius while a stepper rotates the turntable; a second stepper raises the sensor between layers. The captured data becomes a point cloud and an STL mesh.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "The Arduino firmware takes 200 distance readings per revolution, prints a layer delimiter, and lifts the sensor by one millimetre. The host records that serial stream, then a Python script converts each reading into a radius, maps (radius, theta, z) to Cartesian coordinates, smooths the surface, closes it, and exports the mesh.",
        ],
      },
      {
        heading: "Design",
        paragraphs: [
          "The stepper housings, lift, spin plate, and limiters were modelled in Fusion 360 and printed. The Mark 2 design files, firmware, and reconstruction script live in the repository.",
        ],
      },
    ],
  },
  {
    slug: "engineering-3d-design",
    title: "Engineering 3D Design",
    category: "design",
    year: 2026,
    summary:
      "Mechanical design work in Fusion 360 — a robotics arm and the Mini 3D Scanner assembly, modelled part by part and prepared for printing.",
    role: "CAD & mechanical design",
    tools: ["Fusion 360", "AutoCAD", "3D printing"],
    cover: "/images/work/engineering-3d-design.jpg",
    coverAlt: "A grey 3D render of a printed robotic arm on its base plate",
    featured: false,
    order: 6,
    links: [],
    sections: [
      {
        paragraphs: [
          "A collection of mechanical design work in Fusion 360, kept here as a record of the parts that support the software projects.",
        ],
      },
      {
        heading: "Robotics arm",
        paragraphs: [
          "An arm study modelled around printed parts: a weighted base, two linkages, and a gripper at the end. The exercise was less about the arm itself and more about understanding how load paths move through a printed structure — where material belongs, and where it only looks strong.",
        ],
      },
      {
        heading: "Mini 3D Scanner",
        paragraphs: [
          "The scanner's stepper housings, lifting mechanism, spin plate, and limiters were designed alongside the electronics, so the printed parts fit the motors and sensor rather than the other way around.",
        ],
      },
    ],
  },
];

export const workBySlug = new Map(works.map((work) => [work.slug, work]));

export const workCategories = [
  { value: "all", label: "All" },
  { value: "autonomy", label: "Autonomy" },
  { value: "software", label: "Software" },
  { value: "embedded", label: "Embedded" },
  { value: "design", label: "Design" },
] as const;

export type WorkFilter = (typeof workCategories)[number]["value"];

export const featuredWorks = works.filter((work) => work.featured).slice(0, 4);

export const nextWork = (slug: string) => {
  const index = works.findIndex((work) => work.slug === slug);
  return works[(index + 1) % works.length];
};
