// Refresh the committed public activity snapshot before a release.
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const from=new Date(today+'T12:00:00Z');from.setUTCFullYear(from.getUTCFullYear()-1);from.setUTCDate(from.getUTCDate()-from.getUTCDay());
const calendarDays=new Map();
for(const url of ['https://github.com/users/vasu-devs/contributions',`https://github.com/users/vasu-devs/contributions?to=${today}`]){
 const response=await fetch(url);
 if(!response.ok)throw Error(`GitHub: ${response.status}`);
 const html=await response.text();
 for(const [tag] of html.matchAll(/<td\b[^>]*data-date="[^>]+>/g)){
  const attrs=Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
  const text=html.match(new RegExp(`for="${attrs.id}"[^>]*>(.*?)</tool-tip>`,'s'))?.[1]||'';
  calendarDays.set(attrs['data-date'],{date:attrs['data-date'],level:Number(attrs['data-level']),count:Number((text.match(/([\d,]+) contributions?/)?.[1]||'0').replaceAll(',',''))});
 }
}
const days=[...calendarDays.values()].filter(d=>d.date>=from.toISOString().slice(0,10)&&d.date<=today).sort((a,b)=>a.date.localeCompare(b.date));
if(days.length<350||days.some(d=>!Number.isFinite(d.level)))throw Error('Unexpected GitHub calendar; existing snapshot kept');
writeFileSync('src/data/github-contributions.json',JSON.stringify({updated:today,days},null,2)+'\n');
console.log(`Saved ${days.length} days`);

execFileSync(process.execPath,['scripts/generate-test-portfolio.mjs'],{stdio:'inherit'});
const graph=readFileSync('public/test/index.html','utf8').match(/<section class="github-activity"[\s\S]*?<\/section>/)?.[0];
if(!graph)throw Error('Generated contribution graph is missing');
for(const file of ['public/paper/index.html','public/bleach/index.html']){const page=readFileSync(file,'utf8');if(!page.includes('class="github-activity"'))throw Error('Contribution graph is missing from '+file);writeFileSync(file,page.replace(/<section class="github-activity"[\s\S]*?<\/section>/,graph));}
