import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('dist');
const page=resolve(root,'paper/index.html');
readFileSync(resolve(root,"test/fonts/geist-variable.woff2"));
let html=readFileSync(page,'utf8');
const sheets=[...html.matchAll(/<link rel="stylesheet" href="(\/paper\/[^"?]+)(?:\?[^"]*)?">/g)];
if(!sheets.length)throw new Error('Expected paper stylesheets');
const css=sheets.map(([,url])=>readFileSync(resolve(root,'.'+url),'utf8')).join('\n');
const name='styles-'+createHash('sha256').update(css).digest('hex').slice(0,12)+'.css';
writeFileSync(resolve(root,'paper',name),css);
let first=true;
for(const [tag] of sheets){html=html.replace(tag,first?`<link rel="stylesheet" href="/paper/${name}">`:'');first=false;}
writeFileSync(page,html);
console.log(`Bundled ${sheets.length} paper stylesheets in original cascade order.`);
// Repeated technology SVGs share one external sprite instead of inflating HTML.
const symbols=new Map();
html=html.replace(/<svg\b([^>]*\bclass="[^"]*\bpaper-glyph\b[^"]*"[^>]*)>([\s\S]*?)<\/svg>/g,(whole,attrs,body)=>{
 const normalized=body.replace(/-d\d+/g,'');
 const id='icon-'+createHash('sha256').update(normalized).digest('hex').slice(0,16);
 if(!symbols.has(id)){
  let content=normalized;
  for(const [,ref] of normalized.matchAll(/\bid="([^"]+)"/g)){
   content=content.replaceAll(`id="${ref}"`,`id="${id}-${ref}"`).replaceAll(`url(#${ref})`,`url(#${id}-${ref})`).replaceAll(`href="#${ref}"`,`href="#${id}-${ref}"`);
  }
  const viewBox=attrs.match(/\bviewBox="([^"]+)"/)?.[1]||'0 0 24 24';
  symbols.set(id,`<symbol id="${id}" viewBox="${viewBox}">${content}</symbol>`);
 }
 return `<svg${attrs}><use href="/paper/technology-icons.svg#${id}"></use></svg>`;
});
writeFileSync(resolve(root,'paper/technology-icons.svg'),`<svg xmlns="http://www.w3.org/2000/svg">${[...symbols.values()].join('')}</svg>`);
writeFileSync(page,html);
console.log(`Shared ${symbols.size} technology icons without changing their artwork.`);
