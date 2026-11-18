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

const countVisible = () =>
  page.$$eval('[data-work]', (items) => items.filter((item) => !item.hidden).length);

const filtered = {
  initial: await countVisible(),
};

await page.click('[data-filter="design"]');
await wait(150);
filtered.design = await countVisible();
filtered.designPressed = await page.$eval(
  '[data-filter="design"]',
  (el) => el.getAttribute('aria-pressed'),
);

await page.click('[data-filter="all"]');
await wait(150);
filtered.all = await countVisible();

// --- Mobile menu ---
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
await wait(500);

const menu = {
  startHidden: await page.$eval('#mobile-menu', (el) => el.hidden),
};

await page.click('[data-menu-toggle]');
await wait(120);
menu.openHidden = await page.$eval('#mobile-menu', (el) => el.hidden);
menu.expanded = await page.$eval('[data-menu-toggle]', (el) => el.getAttribute('aria-expanded'));
menu.bodyLocked = await page.evaluate(() => document.body.classList.contains('no-scroll'));

await page.keyboard.press('Escape');
await wait(120);
menu.closedAfterEscape = await page.$eval('#mobile-menu', (el) => el.hidden);
menu.bodyUnlocked = await page.evaluate(() => !document.body.classList.contains('no-scroll'));

// --- ClientRouter navigation + reveal ---
await page.click('[data-menu-toggle]');
await wait(120);
await page.click('#mobile-menu a[href="/work"]');
await wait(900);

const navigation = {
  url: page.url(),
  visibleReveals: await page.$$eval(
    '[data-reveal]',
    (items) => items.filter((item) => item.classList.contains('is-visible')).length,
  ),
  totalReveals: await page.$$eval('[data-reveal]', (items) => items.length),
  menuClosedAfterNav: await page.$eval('#mobile-menu', (el) => el.hidden),
};

// --- Overflow across routes and breakpoints ---
const overflow = [];
const routes = ['/', '/work', '/work/stillness', '/about', '/contact'];

for (const width of [360, 390, 768, 1024, 1440]) {
  await page.setViewport({ width, height: 900 });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle0' });
    const result = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));

    if (result.scroll > result.viewport + 1) {
      overflow.push({ width, route, ...result });
    }
  }
}

// --- Footer check ---
await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
const footerText = await page.$eval('footer', (el) => el.innerText.replace(/\s+/g, ' ').trim());

console.log(
  JSON.stringify(
    { filtered, menu, navigation, overflow, footerText, errors },
    null,
    2,
  ),
);

await browser.close();
