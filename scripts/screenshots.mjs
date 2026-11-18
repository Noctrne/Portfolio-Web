import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const executablePath =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.env.BASE_URL ?? 'http://localhost:4321';
const outDir = join(tmpdir(), 'portfolio-shots');
await mkdir(outDir, { recursive: true });

const shots = [
  { name: 'home-desktop', path: '/', width: 1440 },
  { name: 'home-mobile', path: '/', width: 390 },
  { name: 'work-desktop', path: '/work', width: 1440 },
  { name: 'work-mobile', path: '/work', width: 390 },
  { name: 'detail-desktop', path: '/work/stillness', width: 1440 },
  { name: 'detail-mobile', path: '/work/stillness', width: 390 },
  { name: 'about-desktop', path: '/about', width: 1440 },
  { name: 'contact-desktop', path: '/contact', width: 1440 },
];

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--hide-scrollbars'],
});

const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewport({ width: shot.width, height: 1000, deviceScaleFactor: 1 });
  await page.goto(base + shot.path, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  });
  await new Promise((resolve) => setTimeout(resolve, 900));

  const file = join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
}

await browser.close();
