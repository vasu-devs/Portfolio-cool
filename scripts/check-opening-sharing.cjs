// One browser, loopback only. Also checks the metadata without JavaScript.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('./serve-mobile-check.cjs');
const out=path.resolve(__dirname,'../.cache/opening-qa');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;let browser;
 const errors=[];
 try{
  browser=await chromium.launch();
  async function context(options={}){const c=await browser.newContext(options);await c.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));return c}
  for(const viewport of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}]){
   const c=await context({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900});const p=await c.newPage();
   await p.goto(base,{waitUntil:'domcontentloaded'});await p.locator('#paper-opening').waitFor({state:'attached'});
   assert.equal(await p.locator('#paper-opening').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
   const box=await p.locator('.opening-skip').boundingBox();assert(box.height>=44&&box.x>=0&&box.x+box.width<=viewport.width);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await p.waitForTimeout(450);await p.screenshot({path:path.join(out,`welcome-${viewport.width}.png`)});
   await p.locator('#paper-opening').waitFor({state:'detached',timeout:3000});
   assert(await p.locator('#home .identity h1').isVisible());
   await p.reload();assert.equal(await p.locator('#paper-opening').count(),0,'Session replayed intro');
   await c.close();
  }
  for(const scenario of ['skip','keyboard','scroll','deep-link','reduced','no-js','blocked-css']){
   const c=await context({viewport:{width:390,height:844},reducedMotion:scenario==='reduced'?'reduce':'no-preference',javaScriptEnabled:scenario!=='no-js'});const p=await c.newPage();
   if(scenario==='blocked-css')await p.route('**/paper/opening.css',r=>r.abort());
   await p.goto(base+(scenario==='deep-link'?'#projects':''),{waitUntil:'domcontentloaded'});
   if(['skip','keyboard','scroll'].includes(scenario)){
    await p.locator('#paper-opening').waitFor({state:'attached'});
    if(scenario==='skip')await p.locator('.opening-skip').click();
    if(scenario==='keyboard')await p.keyboard.press('Escape');
    if(scenario==='scroll')await p.mouse.wheel(0,300);
   }
   await p.locator('#paper-opening').waitFor({state:'detached',timeout:500});
   if(scenario==='deep-link')assert(await p.locator('#projects').isVisible());
   else assert(await p.locator('#home .identity h1').isVisible());
   if(scenario==='no-js'){
    const meta=await p.locator('meta[property],meta[name^="twitter:"]').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.getAttribute('property')||e.name,e.content])));
    assert.equal(meta['twitter:card'],'summary_large_image');assert.equal(meta['og:title'],'Vasu-Devs — AI Engineer');
    assert.equal(meta['og:image'],meta['twitter:image']);assert(meta['og:image'].startsWith('https://www.siddhvasudev.com/'));
    const res=await p.request.get(base+new URL(meta['og:image']).pathname);assert.equal(res.status(),200);assert(res.headers()['content-type'].includes('image/png'));
    const bytes=await res.body();assert(bytes.length<5*1024*1024);assert.equal(bytes.readUInt32BE(16),+meta['og:image:width']);assert.equal(bytes.readUInt32BE(20),+meta['og:image:height']);
    assert(meta['og:description'].includes('AI agents'));assert(meta['og:image:alt'].includes('portrait'));
    assert.equal(await p.locator('meta[property="og:image"]').count(),1);
   }
   await c.close();
  }
  const c=await context({reducedMotion:'reduce'}),p=await c.newPage();
  await p.addInitScript(()=>{window.audioStarts=0;const Native=window.AudioContext;window.AudioContext=new Proxy(Native,{construct(T,args){const ctx=new T(...args),make=ctx.createBufferSource.bind(ctx);ctx.createBufferSource=()=>{const source=make(),start=source.start.bind(source);source.start=(...a)=>{window.audioStarts++;return start(...a)};return source};return ctx}})});
  await p.goto(base);const sound=p.locator('.sound-toggle');
  assert.equal(await sound.getAttribute('aria-pressed'),'true');assert.equal(await sound.getAttribute('data-audio-state'),'inactive');assert.equal(await p.evaluate(()=>audioStarts),0);
  // A first click on the on-state control mutes immediately, even before audio unlock.
  await sound.click();assert.equal(await sound.getAttribute('aria-pressed'),'false');await p.reload();assert.equal(await sound.getAttribute('aria-pressed'),'false');
  await sound.click();await p.waitForFunction(()=>audioStarts>0);assert.equal(await sound.getAttribute('data-audio-state'),'running');assert.equal(await sound.getAttribute('aria-pressed'),'true');
  await sound.click();const count=await p.evaluate(()=>audioStarts);await p.locator('.navigation [data-page=projects]').click();assert.equal(await p.evaluate(()=>audioStarts),count,'Muted navigation played sound');
  await c.close();
  const fresh=await context({reducedMotion:'reduce'}),first=await fresh.newPage();await first.goto(base);await first.locator('.navigation [data-page=projects]').click();await first.waitForFunction(()=>document.querySelector('.sound-toggle').dataset.lastSound);assert.equal(await first.locator('.sound-toggle').getAttribute('data-audio-state'),'running');await fresh.close();
  assert.deepEqual(errors,[]);const result={openingViewports:[1280,390,844],autoDismiss:true,sessionOnce:true,skip:true,keyboardAndScrollDismiss:true,reducedMotion:true,deepLink:true,noJavaScript:true,blockedStylesFailOpen:true,staticSocialMetadata:true,imageDimensions:[1730,909],soundDefaultOn:true,firstGestureStartsAudio:true,mutePersists:true,errors};fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
