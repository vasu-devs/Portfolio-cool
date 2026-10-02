const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { createServer } = require('./serve-mobile-check.cjs');

(async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    const results = [];
    // These flags simulate browser permission states in tests only.
    for (const policy of ['no-user-gesture-required', 'document-user-activation-required']) {
      browser = await chromium.launch({ args: ['--autoplay-policy=' + policy, '--disable-features=PreloadMediaEngagementData,MediaEngagementBypassAutoplayPolicies'] });
      const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await page.addInitScript(() => {
        window.audioStarts = 0;
        window.audioContexts = 0;
        window.audioGestures = 0;
        for (const type of ['pointerdown', 'click', 'keydown']) document.addEventListener(type, event => {
          if (event.isTrusted) window.audioGestures++;
        }, true);
        const Native = window.AudioContext;
        window.AudioContext = new Proxy(Native, {
          construct(Type, args) {
            window.audioContexts++;
            const context = new Type(...args);
            const analyse = context.createAnalyser.bind(context);
            context.createAnalyser = (...args) => window.audioOutput = analyse(...args);
            const create = context.createBufferSource.bind(context);
            context.createBufferSource = () => {
              const source = create(), start = source.start.bind(source);
              source.start = (...args) => { window.audioStarts++; return start(...args); };
              return source;
            };
            return context;
          }
        });
      });
      await page.goto(base, { waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => audioStarts), 0, 'Loading the page must remain silent');
      assert.equal(await page.evaluate(() => audioGestures), 0);
      const sound = page.locator('.sound-toggle');
      const hover = page.locator('.social-icon-row a').first();
      if (policy === 'no-user-gesture-required') {
        await hover.hover();
        await page.waitForFunction(() => audioStarts > 0, null, { timeout: 5000 });
        await page.waitForFunction(() => {
          const samples = new Float32Array(audioOutput.fftSize);
          audioOutput.getFloatTimeDomainData(samples);
          return samples.some(value => Math.abs(value) > .001);
        }, null, { polling: 10, timeout: 1000 });
        assert.equal(await page.evaluate(() => audioGestures), 0, 'Hover must work without a click');
        assert.equal(await sound.getAttribute('aria-pressed'), 'true');
        assert.equal(await sound.innerText(), 'Sound on');
      } else {
        await hover.hover();
        assert.equal(await page.evaluate(() => audioStarts), 0, 'Respect the browser audio restriction');
        assert.equal(await sound.getAttribute('aria-pressed'), 'false');
        assert.equal(await sound.innerText(), 'Enable sound');
        await sound.click();
        await page.waitForFunction(() => audioStarts > 0);
        assert.equal(await sound.getAttribute('aria-pressed'), 'true', 'The first click enables rather than mutes');
        await page.mouse.move(1, 1);
        await page.waitForTimeout(160);
        const before = await page.evaluate(() => audioStarts);
        await hover.hover();
        await page.waitForFunction(count => audioStarts > count, before);
      }
      await sound.click();
      assert.equal(await sound.getAttribute('aria-pressed'), 'false');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => audioContexts), 0, 'Saved mute must skip audio initialization');
      await hover.hover();
      assert.equal(await page.evaluate(() => audioStarts), 0, 'Saved mute must remain silent');
      assert.equal(await sound.innerText(), 'Sound off');
      await sound.click();
      await page.waitForFunction(() => audioStarts > 0);
      assert.equal(await sound.getAttribute('aria-pressed'), 'true');
      assert.deepEqual(errors, []);
      results.push({ policy, hover: true, savedMute: true, firstClickEnables: true });
      await browser.close();
      browser = null;
    }
    console.log(JSON.stringify(results));
  } finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
