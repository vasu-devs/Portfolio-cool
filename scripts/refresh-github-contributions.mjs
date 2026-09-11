// Refresh the committed public activity snapshot before a release.
import {writeFileSync} from 'node:fs';
const response=await fetch('https://github.com/users/vasu-devs/contributions');
if(!response.ok)throw Error(`GitHub: ${response.status}`);
const html=await response.text();
const days=[...html.matchAll(/<td\b[^>]*data-date="[^>]+>/g)].map(([tag])=>{
 const attrs=Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
 const text=html.match(new RegExp(`for="${attrs.id}"[^>]*>(.*?)</tool-tip>`,'s'))?.[1]||'';
 return {date:attrs['data-date'],level:Number(attrs['data-level']),count:Number((text.match(/([\d,]+) contributions?/)?.[1]||'0').replaceAll(',',''))};
}).sort((a,b)=>a.date.localeCompare(b.date));
if(days.length<350||days.some(d=>!Number.isFinite(d.level)))throw Error('Unexpected GitHub calendar; existing snapshot kept');
writeFileSync('src/data/github-contributions.json',JSON.stringify({updated:new Date().toISOString().slice(0,10),days},null,2)+'\n');
console.log(`Saved ${days.length} days`);
