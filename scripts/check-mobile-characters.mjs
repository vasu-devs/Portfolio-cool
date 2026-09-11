import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch();
try {
 for(const theme of ['light','dark']) {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await page.addInitScript(t=>localStorage.setItem('vasu-theme',t),theme);
  await page.goto('http://127.0.0.1:53861/test/');
  await page.locator('.bleach-menu>summary').tap();
  await page.locator('[data-character="rukia"]').tap();
  await page.waitForFunction(()=>localStorage.getItem('vasu-bleach-character')==='rukia');
  const bounds=await page.locator('.bleach-drawer').evaluate(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,overflow:e.scrollWidth>e.clientWidth}));
  assert.ok(bounds.left>=0&&bounds.right<=390&&!bounds.overflow);
  await page.locator('.character-next').tap();
  await page.waitForFunction(()=>localStorage.getItem('vasu-bleach-character')!=='rukia');
  const selected=await page.evaluate(()=>localStorage.getItem('vasu-bleach-character'));
  await page.reload();
  await page.waitForFunction(id=>document.querySelector(`[data-character="${id}"]`)?.getAttribute('aria-pressed')==='true',selected);
  await page.close();
 }
 console.log('PASS: touch selection, next character, persistence and no horizontal overflow in both themes');
} finally {await browser.close();}
