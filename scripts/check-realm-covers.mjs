import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:900,height:850},reducedMotion:'reduce',colorScheme:'dark'});
 await page.goto('http://127.0.0.1:53861/test/?covers=48');
 await page.locator('#video-title').scrollIntoViewIfNeeded();
 for(const theme of ['light','dark','light']){
  await page.getByRole('button',{name:`Switch to ${theme} mode`,exact:true}).click();
  const realm=theme==='light'?'seireitei':'hueco';
  const covers=page.locator(`[data-cover-realm="${realm}"]`);
  assert.equal(await covers.count(),6);
  for(const cover of await covers.all()){
   await cover.scrollIntoViewIfNeeded();await cover.evaluate(img=>img.decode());
   assert.equal(await cover.evaluate(img=>getComputedStyle(img).opacity),'1');
   assert.ok(await cover.evaluate(img=>img.naturalWidth>0));
  }
  await page.locator('#video-title').scrollIntoViewIfNeeded();
  if(process.env.COVER_SCREENSHOTS)await page.screenshot({path:`${process.env.COVER_SCREENSHOTS}/${theme}.png`});
 }
 await page.locator('.video-link').last().click();
 await page.locator('.detail-modal[open]').waitFor();
 assert.ok((await page.locator('#detail-title').textContent()).includes('JustHireMe'));
 await page.getByRole('button',{name:'Close details',exact:true}).click();
 await page.locator('.navigation a[data-page=home]').click();
 await page.locator('.video-link').first().click();
 assert.equal(await page.locator('.film-modal[open] iframe').count(),1);
 console.log('PASS: all twelve covers load, correct realm artwork across repeated switches, video modal still opens');
}finally{await browser.close();}
