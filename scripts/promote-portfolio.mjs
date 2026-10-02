import {readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
const output=resolve('dist'),source=resolve(output,'test');
const page=readFileSync(resolve(source,'index.html'),'utf8');
if(!page.includes('theme-favicon'))throw Error('The portfolio was not generated.');
const assets=resolve(output,'portfolio-assets');mkdirSync(assets,{recursive:true});
for(const entry of readdirSync(source,{withFileTypes:true})){
 if(entry.name==='covers'){
  cpSync(resolve(source,'covers/paper-ui'),resolve(assets,'covers/paper-ui'),{recursive:true});
 }else if(entry.isDirectory())cpSync(resolve(source,entry.name),resolve(assets,entry.name),{recursive:true});
 else if(/\.(css|js)$/.test(entry.name))writeFileSync(resolve(assets,entry.name),readFileSync(resolve(source,entry.name),'utf8').replaceAll('/test/','/portfolio-assets/'));
}
writeFileSync(resolve(output,'index.html'),page.replaceAll('/test/','/portfolio-assets/').replace('<meta name="robots" content="noindex,follow">','<meta name="robots" content="index,follow"><link rel="canonical" href="https://www.siddhvasudev.com/">'));
// Only build-owned paths beneath dist are removed; source files stay intact.
for(const name of ['test','old','assets','covers','Pic'])rmSync(resolve(output,name),{recursive:true,force:true});
writeFileSync(resolve(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.siddhvasudev.com/</loc></url></urlset>');
console.log('Published portfolio at /; duplicate pages excluded.');
