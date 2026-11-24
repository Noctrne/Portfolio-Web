import type { ImageMetadata } from 'astro';

import morningStill from '../assets/gallery/morning-still.jpg';
import stillWater from '../assets/gallery/still-water.jpg';
import fieldNotes from '../assets/gallery/field-notes.jpg';
import trailhead from '../assets/gallery/trailhead.jpg';
import theLongPath from '../assets/gallery/the-long-path.jpg';
import fallen from '../assets/gallery/fallen.jpg';
import tableForOne from '../assets/gallery/table-for-one.jpg';
import yellowFacade from '../assets/gallery/yellow-facade.jpg';
import crossing from '../assets/gallery/crossing.jpg';
import steeple from '../assets/gallery/steeple.jpg';
import koi from '../assets/gallery/koi.jpg';
import terraces from '../assets/gallery/terraces.jpg';
import mossAndMortar from '../assets/gallery/moss-and-mortar.jpg';
import thePier from '../assets/gallery/the-pier.jpg';
import sunday from '../assets/gallery/sunday.jpg';
import weather from '../assets/gallery/weather.jpg';
import selfInLeaves from '../assets/gallery/self-in-leaves.jpg';
import understory from '../assets/gallery/understory.jpg';
import curve from '../assets/gallery/curve.jpg';
import facade from '../assets/gallery/facade.jpg';
import junction from '../assets/gallery/junction.jpg';
import newTown from '../assets/gallery/new-town.jpg';
import afterDark from '../assets/gallery/after-dark.jpg';
import lampField from '../assets/gallery/lamp-field.jpg';
import reserved from '../assets/gallery/reserved.jpg';
import ripple from '../assets/gallery/ripple.jpg';
import avenue from '../assets/gallery/avenue.jpg';

export interface Plate {
  src: ImageMetadata;
  title: string;
  caption: string;
  year: string;
  alt: string;
  description: string;
}

export const plates = {
  'morning-still': {
    src: morningStill,
    title: 'Morning, still',
    caption: 'Field notes 001',
    year: '2025',
    alt: 'A narrow road winding between tall trees and tea terraces in morning mist',
    description: 'A road between tea terraces, before the mist lifted.',
  },
  'still-water': {
    src: stillWater,
    title: 'Still water',
    caption: 'Field notes 002',
    year: '2025',
    alt: 'A calm lake with a bare tree and soft reflections',
    description: 'The lake held the sky without a ripple.',
  },
  'field-notes': {
    src: fieldNotes,
    title: 'Field',
    caption: 'Field notes 003',
    year: '2025',
    alt: 'A green field edged by trees under a pale sky',
    description: 'A field left alone long enough to look wild.',
  },
  trailhead: {
    src: trailhead,
    title: 'Trailhead',
    caption: 'Field notes 004',
    year: '2025',
    alt: 'A sandy trail entering a shaded forest',
    description: 'The path into the trees, early.',
  },
  'the-long-path': {
    src: theLongPath,
    title: 'The long path',
    caption: 'Field notes 005',
    year: '2025',
    alt: 'A grass path behind a low wooden fence',
    description: 'A path that keeps its distance from the road.',
  },
  fallen: {
    src: fallen,
    title: 'Fallen',
    caption: 'Quiet company 001',
    year: '2025',
    alt: 'A single yellow leaf resting on wet asphalt',
    description: 'One leaf on wet asphalt, after rain.',
  },
  'table-for-one': {
    src: tableForOne,
    title: 'Table for one',
    caption: 'Quiet company 002',
    year: '2025',
    alt: 'An orange cat resting on a wooden table in a small shop',
    description: 'A shop cat with no interest in the customer.',
  },
  'yellow-facade': {
    src: yellowFacade,
    title: 'Yellow facade',
    caption: 'City studies 001',
    year: '2025',
    alt: 'A yellow building with a pink-lit window and blue signage',
    description: 'A corner of colour holding its own weather.',
  },
  crossing: {
    src: crossing,
    title: 'Crossing',
    caption: 'City studies 002',
    year: '2025',
    alt: 'A street crossing painted red and white, with shops and traffic',
    description: 'The brief pause where everyone negotiates the road.',
  },
  steeple: {
    src: steeple,
    title: 'Steeple',
    caption: 'Field notes 006',
    year: '2025',
    alt: 'A church steeple seen through dark trees',
    description: 'A steeple held between branches.',
  },
  koi: {
    src: koi,
    title: 'Koi',
    caption: 'Quiet company 003',
    year: '2025',
    alt: 'Koi moving in a green pond beneath a wooden bridge',
    description: 'Slow company under the footbridge.',
  },
  terraces: {
    src: terraces,
    title: 'Terraces',
    caption: 'Field notes 007',
    year: '2026',
    alt: 'Stepped green terraces folding across a hillside',
    description: 'A hillside worked into steps.',
  },
  'moss-and-mortar': {
    src: mossAndMortar,
    title: 'Moss & mortar',
    caption: 'Quiet company 004',
    year: '2026',
    alt: 'A weathered stone wall above a brick pavement',
    description: 'Two kinds of patience, side by side.',
  },
  'the-pier': {
    src: thePier,
    title: 'The pier',
    caption: 'Field notes 008',
    year: '2026',
    alt: 'A long concrete pier and a lamp post under a grey sky',
    description: 'A pier waiting out the weather.',
  },
  sunday: {
    src: sunday,
    title: 'Sunday',
    caption: 'Field notes 009',
    year: '2026',
    alt: 'Two people walking through a green park in the afternoon',
    description: 'Two figures at the pace of a Sunday.',
  },
  weather: {
    src: weather,
    title: 'Weather',
    caption: 'Field notes 010',
    year: '2026',
    alt: 'A bare tree and railing against an overcast sky',
    description: 'Grey sky, one tree, nothing else asked for.',
  },
  'self-in-leaves': {
    src: selfInLeaves,
    title: 'Self, in leaves',
    caption: 'Portraits 001',
    year: '2022',
    alt: 'A photographer holding a camera among broad green leaves',
    description: 'A self-portrait made from inside the foliage.',
  },
  understory: {
    src: understory,
    title: 'Understory',
    caption: 'Portraits 002',
    year: '2022',
    alt: 'A hand resting among dark fern fronds',
    description: 'A hand among ferns, almost hidden.',
  },
  curve: {
    src: curve,
    title: 'Curve',
    caption: 'City studies 003',
    year: '2026',
    alt: 'A tall curved apartment tower against a blue sky',
    description: 'A tower leaning into its own reflection.',
  },
  facade: {
    src: facade,
    title: 'Facade',
    caption: 'City studies 004',
    year: '2026',
    alt: 'A white apartment building with repeating curved balconies',
    description: 'Repetition, until the balconies look like waves.',
  },
  junction: {
    src: junction,
    title: 'Junction',
    caption: 'City studies 005',
    year: '2026',
    alt: 'A green street sign in front of a tall residential tower',
    description: 'A green sign doing its best against the height.',
  },
  'new-town': {
    src: newTown,
    title: 'New town',
    caption: 'City studies 006',
    year: '2026',
    alt: 'A modern striped office building beside an empty road and mountains',
    description: 'A new building with the mountains still behind it.',
  },
  'after-dark': {
    src: afterDark,
    title: 'After dark',
    caption: 'Night studies 001',
    year: '2026',
    alt: 'A small figure with a light standing in a dark field',
    description: 'A single light in the middle of a field.',
  },
  'lamp-field': {
    src: lampField,
    title: 'Lamp, field',
    caption: 'Night studies 002',
    year: '2026',
    alt: 'A distant lamp glowing over a dark field at night',
    description: 'The lamp makes the darkness visible.',
  },
  reserved: {
    src: reserved,
    title: 'Reserved',
    caption: 'Field notes 011',
    year: '2026',
    alt: 'A small park sign among green shrubs',
    description: 'A small sign keeping its patch of green.',
  },
  ripple: {
    src: ripple,
    title: 'Ripple',
    caption: 'Night studies 003',
    year: '2026',
    alt: 'Golden ripples of light across dark water',
    description: 'Light broken into ripples on black water.',
  },
  avenue: {
    src: avenue,
    title: 'Avenue',
    caption: 'Night studies 004',
    year: '2026',
    alt: 'A tree-lined path receding into green shade',
    description: 'A path that keeps going, even in the dark.',
  },
} satisfies Record<string, Plate>;

export type PlateKey = keyof typeof plates;

export interface Chapter {
  number: string;
  label: string;
  layout: 'hero-rows' | 'split';
  hero?: PlateKey;
  row?: PlateKey[];
  rows?: PlateKey[][];
  lead?: PlateKey;
  stack?: PlateKey[];
}

export const chapters: Chapter[] = [
  {
    number: '01',
    label: 'Field notes',
    layout: 'hero-rows',
    hero: 'morning-still',
    rows: [
      ['field-notes', 'the-long-path', 'terraces'],
      ['still-water', 'trailhead', 'sunday'],
    ],
  },
  {
    number: '02',
    label: 'Quiet company',
    layout: 'hero-rows',
    hero: 'table-for-one',
    rows: [['fallen', 'koi', 'moss-and-mortar']],
  },
  {
    number: '03',
    label: 'Portraits',
    layout: 'split',
    lead: 'self-in-leaves',
    stack: ['understory', 'steeple', 'the-pier', 'weather'],
  },
  {
    number: '04',
    label: 'City studies',
    layout: 'hero-rows',
    hero: 'crossing',
    rows: [
      ['curve', 'facade', 'junction'],
      ['new-town', 'yellow-facade', 'reserved'],
    ],
  },
  {
    number: '05',
    label: 'Night studies',
    layout: 'split',
    lead: 'after-dark',
    stack: ['lamp-field', 'ripple', 'avenue'],
  },
];

export const featuredPlates: PlateKey[] = ['morning-still', 'self-in-leaves', 'new-town'];

export const plateCount = Object.keys(plates).length;
