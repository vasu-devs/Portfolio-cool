// Run after npm run build. Set PLAYWRIGHT_MODULE when Playwright is installed outside this repo.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'../dist');
const rewrites=require('../vercel.json').rewrites;
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.wav':'audio/wav','.json':'application/json','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
 let url=new URL(req.url,'http://localhost').pathname;
 if(url.startsWith('/api/')){res.writeHead(503,{'Content-Type':'application/json'}).end('{"error":"Backend unavailable in build verification"}');return}
 if(url.startsWith('/_vercel/')){res.writeHead(200,{'Content-Type':'text/javascript'}).end('');return}
 url=rewrites.find(r=>r.source===url)?.destination||(url==='/'?'/index.html':url);
 const file=path.resolve(root,'.'+decodeURIComponent(url));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
try{
 const paper=fs.readFileSync(path.join(root,'index.html'),'utf8'),bleach=fs.readFileSync(path.join(root,'bleach/index.html'),'utf8');
 assert(paper.includes('/paper/paper-v4.css'));assert(!paper.includes('/test/hollow-theme.css'));assert(bleach.includes('/test/hollow-theme.css'));assert(!bleach.includes('/paper/'));
 for(const route of ['/','/bleach','/bleach/','/old','/old/']){const response=await fetch(base+route);assert.equal(response.status,200,route);const html=await response.text();assert(html.includes(route.startsWith('/bleach')?'/test/hollow-theme.css':route.startsWith('/old')?'id="root"':'/paper/paper-v4.css'),route)}
 // Check local HTML asset references, including hidden project imagery, before browser lazy loading.
 const assets=new Set();for(const html of [paper,bleach])for(const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"#?]+)(?:\?[^"#]*)?"/g)){if(/\.[a-z\d]+$/i.test(match[1])&&!match[1].startsWith('/_vercel/'))assets.add(match[1])}
 for(const asset of assets)assert(fs.existsSync(path.join(root,asset)),`Missing asset ${asset}`);
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});const errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base)&&!r.url().includes('/api/'))missing.push(r.status()+' '+r.url())});
 await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.paper-avatar').count(),1);assert.equal(await page.locator('.theme-toggle,.paper-hello-hand,#inquiry-form').count(),0);
 assert((await page.locator('.intro').innerText()).includes('AI Engineering intern at withlayer.ai'));
 assert(await page.locator('.intro a').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).textDecorationLine.includes('underline'))));
 await page.locator('.intro a[href="#project-justhireme"]').click();assert.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape');
 await page.locator('.navigation [data-page=projects]').click();
 await page.evaluate(async()=>{for(const img of document.querySelectorAll('.paper-cover img')){img.loading='eager';await img.decode()}});
 const projects=await page.locator('.proj').evaluateAll(nodes=>nodes.map(n=>({id:n.id,src:n.querySelector('.paper-cover img').getAttribute('src')})));
 assert.equal(projects.length,24);assert.equal(new Set(projects.map(p=>p.src)).size,24);
 for(const project of projects){await page.locator('#'+project.id+' .proj-open').first().click();const media=await page.locator('dialog[open] .detail-cover img,dialog[open] .detail-cover iframe').evaluate(e=>({tag:e.tagName,src:e.getAttribute('src')}));assert(media.tag==='IFRAME'||media.src===project.src);await page.keyboard.press('Escape')}
 for(const width of [1280,390,320]){await page.setViewportSize({width,height:900});for(const section of ['home','projects','contact']){await page.locator(`.navigation [data-page=${section}]`).click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${section} ${width}`)}}
 await page.locator('.navigation [data-page=home]').click();await page.setViewportSize({width:1280,height:900});
 await page.locator('a[href="/resume.html"]').first().click();assert.equal(await page.locator('.resume-modal[open]').count(),1);await page.keyboard.press('Escape');
 await page.locator('[data-open-contact]').click();assert.equal(await page.locator('.contact-dialog[open]').count(),1);await page.keyboard.press('Escape');
 if(await page.locator('.sound-toggle').getAttribute('aria-pressed')!=='true')await page.locator('.sound-toggle').click();await page.waitForFunction(()=>document.querySelector('.sound-toggle').getAttribute('aria-pressed')==='true');
 await page.locator('.sound-toggle').click();assert.equal(await page.locator('.sound-toggle').getAttribute('aria-pressed'),'false');
 await page.screenshot({path:path.join(__dirname,'../production-paper-verified.png')});
 await page.goto(base+'/bleach');await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('.theme-toggle').count(),1);
 const before=await page.locator('html').getAttribute('data-theme');await page.locator('.theme-toggle').click();assert.notEqual(await page.locator('html').getAttribute('data-theme'),before);
 await page.locator('.navigation [data-page=projects]').click();await page.locator('#projects').waitFor({state:'visible'});assert(new URL(page.url()).pathname==='/bleach');
 await page.locator('button.proj-open').first().click();assert.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape');
 await page.locator('.navigation [data-page=home]').click();await page.screenshot({path:path.join(__dirname,'../production-bleach-verified.png')});
 await page.goto(base+'/old');await page.waitForFunction(()=>document.querySelector('#root').children.length>0);
 assert.deepEqual(missing,[]);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({routes:5,localAssetReferences:assets.size,customProjectThumbnails:24,projectDialogs:24,mobileWidths:[390,320],soundDecodes:true,bleachThemeToggle:true,bleachNavigation:true,legacyReact:true,missing,errors}));
}finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r))}})().catch(e=>{console.error(e);process.exitCode=1});
