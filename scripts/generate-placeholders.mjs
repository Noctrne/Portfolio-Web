import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const sourceDir = 'scripts/placeholders';
const workDir = 'src/assets/work';

await mkdir(workDir, { recursive: true });
await mkdir('public', { recursive: true });

const files = await readdir(sourceDir);
const svgs = files.filter((file) => file.endsWith('.svg'));

const targets = {
  portrait: { output: 'src/assets/portrait.jpg', width: 1200, height: 1500 },
  og: { output: 'public/og.jpg', width: 1200, height: 630 },
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
