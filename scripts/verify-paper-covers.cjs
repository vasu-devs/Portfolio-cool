const {createServer}=require('node:http');
const {readFileSync,existsSync,statSync,writeFileSync}=require('node:fs');
const {resolve,extname}=require('node:path');
const {chromium}=require('playwright');
const root=resolve('dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server=createServer((req,res)=>{
 const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 const file=path===root?resolve(root,'index.html'):path;
 if(!file.startsWith(root)||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(readFileSync(file));
});
(async()=>{
 let browser;
 try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url=process.env.LIVE_URL||`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  const errors=[],failures=[],results=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))errors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400&&!r.url().includes('/_vercel/'))failures.push(`${r.status()} ${r.url()}`)});
  for(const width of [1440,390])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:1000});
   await page.goto(url,{waitUntil:'networkidle'});
   await page.evaluate(t=>localStorage.setItem('vasu-paper-theme',t),theme);
   await page.reload({waitUntil:'networkidle'});
   if(await page.locator('.soul-cursor,.bleach-menu').count())throw Error('Bleach controls on main page');
   const background=await page.evaluate(()=>({theme:document.documentElement.dataset.theme,color:getComputedStyle(document.body).backgroundColor,before:getComputedStyle(document.body,'::before').display}));
   if(background.theme!==theme||background.before!=='none'||background.color!==(theme==='light'?'rgb(244, 241, 232)':'rgb(32, 39, 31)'))throw Error(JSON.stringify(background));
   await page.screenshot({path:`paper-home-${theme}-${width}.png`});
   for(const card of await page.locator('.selected-item').all())await card.scrollIntoViewIfNeeded();
   await page.locator('.selected').screenshot({path:`paper-selected-${theme}-${width}.png`});
   await page.goto(url+'/#projects',{waitUntil:'networkidle'});
   const cards=page.locator('#projects .proj');
   if(await cards.count()!==24)throw Error('Expected all 24 project cards');
   for(const card of await cards.all()){
    await card.scrollIntoViewIfNeeded();
    const image=card.locator('.project-cover--paper');
    await image.evaluate(i=>i.decode());
    const state=await image.evaluate(i=>({src:i.getAttribute('src'),loaded:i.naturalWidth>0,opacity:getComputedStyle(i).opacity,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height}));
    if(!state.loaded||state.opacity!=='1'||state.width<30||state.height<20||!state.src.includes('/covers/paper-ui/'))throw Error(JSON.stringify(state));
   }
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)throw Error(`Horizontal overflow: ${theme} ${width}`);
   await page.locator('#project-svara .proj-open').first().click();
   const modalCover=page.locator('dialog[open] .project-cover--paper');
   await modalCover.evaluate(i=>i.decode());
   if(await modalCover.evaluate(i=>getComputedStyle(i).opacity)!=='1')throw Error('Detail cover invisible');
   await page.locator('dialog[open]').screenshot({path:`paper-detail-${theme}-${width}.png`});
   await page.locator('dialog[open] [aria-label="Close details"]').click();
   results.push({width,theme,projectCovers:24,modalCover:'visible',horizontalOverflow:false});
  }
  const report={url,results,errors,failures};
  console.log(JSON.stringify(report,null,2));
  writeFileSync('paper-cover-browser-results.json',JSON.stringify(report,null,2));
  if(errors.length||failures.length)process.exitCode=1;
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
