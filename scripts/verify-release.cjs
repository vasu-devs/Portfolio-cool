const {createServer}=require('node:http');
const {readFileSync,existsSync,statSync,writeFileSync}=require('node:fs');
const {resolve,extname}=require('node:path');
const {chromium}=require('C:/Users/Vasudev Siddh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=resolve('dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.pdf':'application/pdf'};
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
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const failures=[];page.on('response',r=>{if(r.status()>=400&&!r.url().includes('/_vercel/'))failures.push(`${r.status()} ${r.url()}`)});
  const results=[];
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:1000});
   await page.goto(url,{waitUntil:'networkidle'});
   await page.evaluate(()=>localStorage.setItem('vasu-theme','light'));
   await page.reload({waitUntil:'networkidle'});
   await page.screenshot({path:`release-hero-${width}.png`});
   const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,headings:[...document.querySelectorAll('#home h2')].map(h=>h.textContent),selected:[...document.querySelectorAll('.selected-item h3')].map(h=>h.textContent)}));
   for(const name of ['Odeon','Svara']){
    const card=page.locator('.selected-item').filter({has:page.locator('h3',{hasText:name})});
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const cover=await card.locator('img[data-cover-realm="seireitei"]').evaluate(img=>({loaded:img.complete&&img.naturalWidth>0,box:img.getBoundingClientRect().toJSON(),opacity:getComputedStyle(img).opacity}));
    if(!cover.loaded||cover.box.height<20||cover.opacity!=='1')throw Error(`${name} cover failed: ${JSON.stringify(cover)}`);
   }
   await page.locator('.experience').scrollIntoViewIfNeeded();
   await page.screenshot({path:`release-experience-${width}.png`});
   await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
   await page.waitForTimeout(300);
   const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.getBoundingClientRect().height&&(!i.complete||!i.naturalWidth)).map(i=>i.src));
   if(layout.scrollWidth>width||broken.length)throw Error(JSON.stringify({layout,broken}));
   results.push({width,...layout,broken});
  }
  if(!process.env.LIVE_URL){
   await page.setViewportSize({width:1200,height:630});
   await page.setContent(`<html><style>body{margin:0;background:#e4e8d9;color:#29362b;font:24px Arial;padding:70px;box-sizing:border-box;width:1200px;height:630px}h1{font-size:74px;letter-spacing:-3px;margin:25px 0}p{max-width:880px;line-height:1.5}.handle{font-size:22px}.rule{height:2px;background:#29362b;margin:36px 0}.proof{font-size:22px}</style><body><div class="handle">vasu-devs · siddhvasudev.com</div><h1>Vasudev Siddh</h1><p>AI engineer building real-time voice agents and LLM systems that hold up in production.</p><div class="rule"></div><p class="proof">Creator of JustHireMe · 2,249★ open source</p></body></html>`);
   await page.screenshot({path:'public/og-image.png'});
  }
  console.log(JSON.stringify({url,results,errors,failures},null,2));
  writeFileSync('release-browser-results.json',JSON.stringify({url,results,errors,failures},null,2));
  if(errors.length||failures.length)process.exitCode=1;
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
