import puppeteer from 'puppeteer-core';

const executablePath =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.env.BASE_URL ?? 'http://localhost:4321';

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--hide-scrollbars'],
});

const page = await browser.newPage();
const errors = [];

page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(error.message));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Work filters ---
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`${base}/work`, { waitUntil: 'networkidle0' });
await wait(400);

const countVisible = (selector) =>
  page.$$eval(selector, (items) => items.filter((item) => !item.hidden).length);

const work = {
  initial: await countVisible('[data-work]'),
};

await page.click('[data-filter="autonomy"]');
await wait(200);
work.autonomy = await countVisible('[data-work]');
work.autonomyPressed = await page.$eval(
  '[data-filter="autonomy"]',
  (el) => el.getAttribute('aria-pressed'),
);

await page.click('[data-filter="all"]');
await wait(200);
work.all = await countVisible('[data-work]');

// --- Gallery filters and lightbox ---
await page.goto(`${base}/gallery`, { waitUntil: 'networkidle0' });
await wait(600);

const gallery = {
  initial: await countVisible('[data-gallery-card]'),
};

await page.click('[data-gallery-filter="illustration"]');
await wait(250);
gallery.illustration = await countVisible('[data-gallery-card]');
gallery.countLabel = await page.$eval('[data-gallery-count]', (el) => el.textContent);
gallery.illustrationPressed = await page.$eval(
  '[data-gallery-filter="illustration"]',
  (el) => el.getAttribute('aria-pressed'),
);

await page.click('[data-gallery-filter="all"]');
await wait(200);
await page.click('[data-gallery-item]');
await wait(500);

gallery.lightbox = {
  open: await page.$eval('[data-gallery-lightbox]', (el) => el.hasAttribute('open')),
  title: await page.$eval('[data-lb-title]', (el) => el.textContent),
  counter: await page.$eval('[data-lb-counter]', (el) => el.textContent),
  hasImage: await page.$eval('[data-lb-media]', (el) => !!el.querySelector('img')),
  bodyLocked: await page.evaluate(() => document.body.classList.contains('no-scroll')),
};

await page.keyboard.press('ArrowRight');
await wait(250);
gallery.nextTitle = await page.$eval('[data-lb-title]', (el) => el.textContent);

await page.keyboard.press('Escape');
await wait(300);
gallery.closed = {
  open: await page.$eval('[data-gallery-lightbox]', (el) => el.hasAttribute('open')),
  bodyUnlocked: await page.evaluate(() => !document.body.classList.contains('no-scroll')),
};

await page.click('[data-gallery-filter="video"]');
await wait(250);
await page.evaluate(() => {
  document
    .querySelector('[data-gallery-card][data-medium="video"] [data-gallery-item]')
    ?.click();
});
await wait(900);
gallery.video = {
  hasVideo: await page.$eval('[data-lb-media]', (el) => !!el.querySelector('video')),
  title: await page.$eval('[data-lb-title]', (el) => el.textContent),
  readyState: await page.$eval('[data-lb-media] video', (el) => el.readyState),
};
await page.keyboard.press('Escape');
await wait(200);

// --- Blog index and article ---
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`${base}/blog`, { waitUntil: 'networkidle0' });
await wait(400);

const blog = {
  entries: await page.$$eval('a[href^="/blog/"]', (links) => links.length),
  titles: await page.$$eval('a[href^="/blog/"] h2, a[href^="/blog/"] .font-display', (items) =>
    items.map((item) => item.textContent?.trim()),
  ),
};

await page.goto(`${base}/blog/what-the-pool-taught-the-software`, { waitUntil: 'networkidle0' });
await wait(400);
blog.article = {
  title: await page.$eval('h1', (el) => el.textContent?.trim()),
  paragraphs: await page.$$eval('.blog-prose p', (items) => items.length),
  hasNextNote: await page.$eval('.next-link', (el) => !!el.getAttribute('href')),
};

// --- Mobile menu + client router ---
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
await wait(500);

const panelState = () => ({
  ariaHidden: document.querySelector('#mobile-menu')?.getAttribute('aria-hidden'),
  inert: document.querySelector('#mobile-menu')?.inert,
  openClass: document.querySelector('#mobile-menu')?.classList.contains('is-open'),
});

const menu = {
  start: await page.evaluate(panelState),
};

await page.click('[data-menu-toggle]');
await wait(150);
menu.open = await page.evaluate(panelState);
menu.expanded = await page.$eval('[data-menu-toggle]', (el) => el.getAttribute('aria-expanded'));
menu.bodyLocked = await page.evaluate(() => document.body.classList.contains('no-scroll'));

await page.keyboard.press('Escape');
await wait(150);
menu.closed = await page.evaluate(panelState);
menu.bodyUnlocked = await page.evaluate(() => !document.body.classList.contains('no-scroll'));

await page.click('[data-menu-toggle]');
await wait(120);
await page.click('#mobile-menu a[href="/work"]');
await wait(900);

const navigation = {
  url: page.url(),
  menuClosed: await page.evaluate(panelState),
  visibleReveals: await page.$$eval(
    '[data-reveal]',
    (items) => items.filter((item) => item.classList.contains('is-visible')).length,
  ),
  totalReveals: await page.$$eval('[data-reveal]', (items) => items.length),
};

// --- Footer check ---
await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
const footerText = await page.$eval('footer', (el) => el.innerText.replace(/\s+/g, ' ').trim());

console.log(JSON.stringify({ work, gallery, blog, menu, navigation, footerText, errors }, null, 2));

await browser.close();
