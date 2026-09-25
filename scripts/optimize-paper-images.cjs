const fs=require('fs'),sharp=require('C:/Users/Vasudev Siddh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
sharp.concurrency(1);
(async()=>{
 const dir='public/paper/assets',report=[];
 async function make(src,name,width,quality){const out=dir+'/'+name;await sharp(src).resize({width,withoutEnlargement:true}).webp({quality,effort:6}).toFile(out);report.push({name,bytes:fs.statSync(out).size});}
 for(const w of [112,224,336])await make(dir+'/avatar.png',`avatar-${w}.webp`,w,88);
 for(const w of [640,1280])await make(dir+'/missing-piece-v1.webp',`missing-piece-${w}.webp`,w,86);
 await make(dir+'/sage-paper.png','sage-paper-v2.webp',1520,82);
 let h=fs.readFileSync('public/paper/index.html','utf8').replace('src="/paper/assets/avatar.webp"','src="/paper/assets/avatar-224.webp" srcset="/paper/assets/avatar-112.webp 112w, /paper/assets/avatar-224.webp 224w, /paper/assets/avatar-336.webp 336w" sizes="112px" decoding="async"');
 fs.writeFileSync('public/paper/index.html',h);
 let n=fs.readFileSync('public/404.html','utf8').replace('src="/paper/assets/missing-piece-v1.webp"','src="/paper/assets/missing-piece-1280.webp" srcset="/paper/assets/missing-piece-640.webp 640w, /paper/assets/missing-piece-1280.webp 1280w" sizes="(max-width: 680px) calc(100vw - 40px), 640px" decoding="async"');fs.writeFileSync('public/404.html',n);
 for(const f of fs.readdirSync('public/paper').filter(f=>/\.(css|html)$/.test(f))){const p='public/paper/'+f;const old=fs.readFileSync(p,'utf8'),next=old.replaceAll('/paper/assets/sage-paper.webp','/paper/assets/sage-paper-v2.webp');if(next!==old)fs.writeFileSync(p,next);}
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
