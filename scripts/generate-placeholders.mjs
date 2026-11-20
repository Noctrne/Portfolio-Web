import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const sourceDir = 'scripts/placeholders';
const workDir = 'src/assets/work';
const galleryDir = 'src/assets/gallery';

await mkdir(workDir, { recursive: true });
await mkdir(galleryDir, { recursive: true });
await mkdir('public', { recursive: true });

const files = await readdir(sourceDir);
const svgs = files.filter((file) => file.endsWith('.svg'));

const targets = {
  portrait: { output: 'src/assets/portrait.jpg', width: 1200, height: 1500 },
  og: { output: 'public/og.jpg', width: 1200, height: 630 },
  'gallery-morning': { output: 'src/assets/gallery/morning-window.jpg', width: 1200, height: 1500 },
  'gallery-tide': { output: 'src/assets/gallery/tide-study.jpg', width: 1200, height: 800 },
  'gallery-dunes': { output: 'src/assets/gallery/dune-lines.jpg', width: 1200, height: 1200 },
  'gallery-harbour': { output: 'src/assets/gallery/harbour.jpg', width: 1200, height: 800 },
  'gallery-botanical': { output: 'src/assets/gallery/botanical.jpg', width: 1000, height: 1500 },
  'gallery-figure': { output: 'src/assets/gallery/figure.jpg', width: 1200, height: 1500 },
  'gallery-geometry': { output: 'src/assets/gallery/geometry.jpg', width: 1200, height: 1200 },
  'gallery-field-record': { output: 'src/assets/gallery/field-record.jpg', width: 1600, height: 900 },
};

await Promise.all(
  svgs.map(async (file) => {
    const name = file.replace('.svg', '');
    const target = targets[name] ?? {
      output: join(workDir, `${name}.jpg`),
      width: 1200,
      height: 1500,
    };

    await sharp(join(sourceDir, file), { density: 96 })
      .resize(target.width, target.height, { fit: 'cover' })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(target.output);

    console.log(`rendered ${target.output}`);
  }),
);
