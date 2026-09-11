import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.goto('http://127.0.0.1:53861/test/?overlays=66');await page.locator('.soul-cursor.is-visible').waitFor({state:'attached'});
 const sample=()=>page.locator('.soul-hit').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
 await page.mouse.move(700,350);await page.waitForTimeout(2400);
 const before=await sample();
 await page.evaluate(({x,y})=>{const d=document.createElement('dialog');d.id='occlusion-test';Object.assign(d.style,{position:'fixed',left:(x-100)+'px',top:(y-90)+'px',width:'200px',height:'180px',padding:'0',margin:'0'});document.body.append(d);d.showModal();},before);
 const initial=await sample();assert.ok(Math.hypot(initial.x-before.x,initial.y-before.y)<15,'no teleport on open');
 await page.waitForTimeout(1100);
 const after=await sample();assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>50,'walked to edge');
 assert.ok(await page.locator('.soul-cursor').evaluate(e=>e.matches(':popover-open')),'visible above native backdrop');
 const clear=await page.evaluate(()=>{const a=document.querySelector('.soul-hit').getBoundingClientRect(),b=document.querySelector('#occlusion-test').getBoundingClientRect();return a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom;});assert.ok(clear,'sprite outside covering modal');
 await page.evaluate(()=>document.querySelector('#occlusion-test').close());await page.waitForTimeout(50);
 // A non-overlapping panel must not relocate the character.
 const stationary=await sample();await page.evaluate(()=>{const d=document.querySelector('#occlusion-test');d.style.left='900px';d.style.top='200px';d.showModal();});await page.waitForTimeout(300);
 const kept=await sample();assert.ok(Math.hypot(kept.x-stationary.x,kept.y-stationary.y)<15,'clear position retained');
 console.log('PASS: no teleport, walks out of occlusion, stays above backdrop, clear position retained');
}finally{await browser.close();}
