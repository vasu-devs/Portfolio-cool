const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { createServer } = require('./serve-mobile-check.cjs');

(async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const base = 'http://127.0.0.1:' + server.address().port;
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    fs.mkdirSync('.cache/recovery-qa', { recursive: true });
    const results = [];
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 1506, height: 436 }]) {
      await page.setViewportSize(viewport);
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.keyboard.press('End');
      await page.screenshot({ path: `.cache/recovery-qa/footer-${process.argv[2] || 'fixed'}-${viewport.width}.png` });
      const metrics = await page.evaluate(() => {
        const footer = document.querySelector('.site-footer').getBoundingClientRect();
        const dock = document.querySelector('.navigation').getBoundingClientRect();
        return {
          scrollY,
          overflow: document.documentElement.scrollWidth > innerWidth,
          footerClearance: dock.top - footer.bottom,
          bodyBottom: document.body.getBoundingClientRect().bottom,
          viewportHeight: innerHeight,
          background: getComputedStyle(document.body, '::after').backgroundImage,
          backgroundBottom: getComputedStyle(document.body, '::after').bottom
        };
      });
      assert(metrics.scrollY > 0, 'The document must scroll normally instead of clipping a nested scroll box');
      assert(!metrics.overflow, 'The document must not overflow horizontally');
      assert(Math.abs(metrics.bodyBottom - metrics.viewportHeight) <= 1, 'Paper must extend to the viewport bottom');
      assert(metrics.background.includes('sage-paper'), 'Footer texture must belong to the whole document');
      assert.equal(metrics.backgroundBottom, '0px');
      assert(metrics.footerClearance >= 23 && metrics.footerClearance <= 25, 'Use one 24px clearance above the dock');
      await page.locator('.paper-back-top').click();
      await page.waitForFunction(() => scrollY === 0);
      await page.keyboard.press('j');
      await page.waitForFunction(() => scrollY > 0);
      await page.keyboard.press('Home');
      await page.waitForFunction(() => scrollY === 0);
      await page.keyboard.press(']');
      await page.waitForFunction(() => scrollY > 0);
      await page.keyboard.press('[');
      await page.waitForFunction(() => scrollY === 0);
      results.push({ viewport, metrics });
    }
    console.log(JSON.stringify({ results }));
  } finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
