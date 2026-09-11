import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.route('**/sprites/effects/**',r=>r.abort());
 await page.goto('http://127.0.0.1:53861/test/?attacks=63');
 await page.locator('.soul-cursor.is-visible').waitFor({state:'attached'});
 await page.evaluate(()=>{window.splashes=0;new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1&&n.matches('.getsuga-slash,.soul-effect'))window.splashes++;}).observe(document.querySelector('.getsuga-field'),{childList:true});});
 for(let i=0;i<8;i++){await page.mouse.move(1000,150+i*30);await page.waitForTimeout(180);await page.mouse.down();await page.mouse.up();await page.waitForTimeout(320);}
 assert.equal(await page.evaluate(()=>window.splashes),8,'every moving click produces visible fallback even with effect requests failing');
 await page.locator('.bleach-menu summary').click();
 await page.mouse.click(1000,420);await page.waitForTimeout(150);
 assert.equal(await page.evaluate(()=>window.splashes),9,'first outside selector click attacks');
 console.log('PASS: 8 moving attacks with failed effect loads and first selector dismissal attack');
}finally{await browser.close();}
