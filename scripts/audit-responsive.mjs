import puppeteer from 'puppeteer-core';

const executablePath =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.env.BASE_URL ?? 'http://localhost:4321';
const widths = [360, 390, 768, 1024, 1440];
const routes = [
  '/',
  '/work',
  '/work/orca',
  '/gallery',
  '/blog',
  '/blog/what-the-pool-taught-the-software',
  '/about',
  '/contact',
];

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--hide-scrollbars'],
});

const page = await browser.newPage();

for (const width of widths) {
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });

  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle0' });
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 300)));

    const info = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [];

      const isClipped = (el) => {
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          const style = getComputedStyle(parent);
          if (style.overflowX === 'hidden' || style.overflowX === 'clip') return true;
          parent = parent.parentElement;
        }
        return false;
      };

      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) continue;

        // Decorative ornaments are intentionally allowed to bleed past the
        // viewport as long as an ancestor clips them; they never cause scroll.
        if (el.closest('[aria-hidden="true"]') || isClipped(el)) continue;

        if (rect.right > vw + 1 || rect.left < -1) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: typeof el.className === 'string' ? el.className.slice(0, 90) : '',
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          });
        }
      }

      return {
        vw,
        scrollWidth: document.documentElement.scrollWidth,
        hasOverflow: document.documentElement.scrollWidth > vw + 1,
        offenders: offenders.slice(0, 12),
      };
    });

    console.log(`--- ${width}px ${route} ---`);
    console.log(JSON.stringify(info, null, 2));
  }
}

await browser.close();
