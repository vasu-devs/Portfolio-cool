import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch();
try{const page=await browser.newPage({viewport:{width:1280,height:800}});
await page.goto('http://127.0.0.1:53861/test/?effects=67');await page.locator('.soul-cursor.is-visible').waitFor({state:'attached'});
const entries=await page.locator('#bleach-character option').evaluateAll(es=>es.map(e=>({id:e.value,name:e.textContent})));
for(const {id,name} of entries){
 await page.locator('#bleach-character').evaluate((e,id)=>{e.value=id;e.dispatchEvent(new Event('change'));},id);
 await page.waitForFunction(name=>document.querySelector('.soul-hit').getAttribute('aria-label')==='Greet '+name,name);
 await page.mouse.click(1000,300);
 await page.locator(`.soul-effect[data-effect="${id}"]`).waitFor({state:'attached',timeout:3000});
 assert.equal(await page.locator('.getsuga-slash').count(),0,`${id} must use its own atlas`);
 await page.waitForTimeout(700);
}
console.log('PASS: all 16 characters render their own attack atlas, no generic slash');
}finally{await browser.close();}
