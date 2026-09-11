import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:53861/test/?dock=46');
 await page.locator('.soul-cursor.is-visible').waitFor({state:'attached'});
 await page.locator('.bleach-menu summary').click();
 const sample=()=>page.locator('.soul-cursor').evaluate(el=>({state:el.dataset.state,transform:el.style.transform,top:el.matches(':popover-open'),parent:el.parentElement.tagName}));
 const panelBox=await page.locator('.bleach-drawer').boundingBox();
 let before=await sample();assert.equal(before.state,'rest');assert.equal(before.top,true);
 await page.mouse.move(20,30);await page.waitForTimeout(5400);assert.deepEqual(await sample(),before,'idle and pointer movement cannot move docked companion');
 await page.getByRole('button',{name:'Next character',exact:true}).click();await page.waitForTimeout(100);assert.equal(await page.locator('.soul-cursor .bleach-entrance').count(),1,'entrance remains after selection');
 await page.waitForTimeout(1100);assert.deepEqual(await page.locator('.bleach-drawer').boundingBox(),panelBox,'character names do not move the panel');before=await sample();assert.equal(before.state,'rest');
 for(let i=0;i<16;i++){await page.getByRole('button',{name:'Next character',exact:true}).click();await page.waitForTimeout(80);const box=await page.locator('.bleach-drawer').boundingBox();assert.equal(box.x,panelBox.x,'all character names retain horizontal anchor');assert.equal(box.y,panelBox.y,'all character names retain vertical anchor');}
 await page.waitForTimeout(1100);before=await sample();
 await page.mouse.move(700,70);await page.waitForTimeout(400);assert.deepEqual(await sample(),before);
 await page.locator('.bleach-menu summary').click();await page.mouse.move(100,100);await page.waitForTimeout(700);assert.equal((await sample()).top,false);assert.notEqual((await sample()).transform,before.transform,'movement resumes');
 await page.getByRole('link',{name:'Résumé',exact:true}).click();await page.waitForTimeout(100);before=await sample();assert.equal(before.parent,'DIALOG');assert.equal(before.top,true);
 await page.mouse.move(650,400);await page.waitForTimeout(400);assert.deepEqual(await sample(),before);
 await page.getByRole('button',{name:'Close résumé',exact:true}).click();await page.waitForTimeout(100);assert.equal((await sample()).parent,'BODY');
 await page.setViewportSize({width:390,height:740});await page.locator('.bleach-menu summary').click();await page.waitForTimeout(100);
 const fits=await page.locator('.soul-hit').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;});assert.ok(fits,'small-screen companion fits');
 assert.deepEqual(errors,[]);console.log('PASS: stationary panel, selection entrance, movement resumes, native dialog visibility, narrow viewport, no JS errors');
}finally{await browser.close();}
