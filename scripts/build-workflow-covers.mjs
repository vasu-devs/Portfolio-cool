import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// Source: src/data/main-portfolio-studies.json. These explain workflows;
// they are not fabricated screenshots, results, or product performance claims.
const projects = {
  justhireme: ['JustHireMe', 'From job leads to a tailored application', 'JOB INTELLIGENCE'],
  odeon: ['Odeon', 'Test the conversation. Improve the prompt.', 'VOICE AGENT EVALUATION'],
  vaani: ['Vaani', 'Two voice personas. Live risk checks.', 'VOICE AGENT COMMAND CENTER'],
  branchgpt: ['BranchGPT', 'Explore a tangent without losing the thread.', 'FORK / EXPLORE / MERGE'],
};
for (const realm of ['seireitei','hueco']) {
  const light=realm==='seireitei';
  const c={bg:light?'#f1f4f3':'#111416',ink:light?'#182b32':'#edf2f1',muted:light?'#526770':'#a5b5ba',line:light?'#bdcdcc':'#39494e',card:light?'#fcfdfc':'#1b2428',accent:light?'#286f72':'#8bcac4',soft:light?'#d9e9e5':'#213c3a'};
  const text=(x,y,str,size=24,color=c.ink,weight=400)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${str}</text>`;
  const line=(x1,y1,x2,y2,color=c.line)=>`<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${color}" stroke-width="3"/>`;
  const box=(x,y,w,h,title,sub='',accent=false)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${accent?c.soft:c.card}" stroke="${accent?c.accent:c.line}" stroke-width="2"/>${text(x+22,y+41,title,27,c.ink,600)}${sub?text(x+22,y+77,sub,21,c.muted):''}`;
  for(const [name,[title,subtitle,label]] of Object.entries(projects)) {
    let art='';
    if(name==='justhireme') {
      art=text(64,260,'LEADS',18,c.muted,600)+text(815,260,'APPLICATION',18,c.accent,600);
      art+=box(64,292,225,104,'Discover','Source adapters');
      art+=line(289,344,350,344)+box(350,292,230,104,'Filter','Quality gate');
      art+=line(580,344,645,344)+box(645,292,190,104,'Rank','Explain fit',true);
      art+=line(835,344,900,344)+box(900,292,236,104,'Draft','Review materials',true);
      art+=text(64,481,'Career profile',26,c.ink,600)+text(64,517,'Graph + semantic search',22,c.muted);
      art+=`<path d="M420 488H740V410" fill="none" stroke="${c.accent}" stroke-width="3" stroke-dasharray="6 7"/>`;
      art+=text(64,606,'Local storage · Optional AI providers',21,c.muted);
    } else if(name==='odeon') {
      art=box(64,276,320,108,'Simulate','Adversarial personas');
      art+=line(384,330,440,330)+box(440,276,290,108,'Score','Every criterion matters',true);
      art+=line(730,330,794,330)+box(794,276,342,108,'Rewrite','Prompt changes',true);
      art+=`<path d="M965 400V514H222V400" fill="none" stroke="${c.accent}" stroke-width="4"/>`;
      art+=`<rect x="459" y="489" width="260" height="50" fill="${c.bg}"/>`+text(483,523,'Run the next test',25,c.accent,600);
      art+=text(64,608,'Empathy · Negotiation · Repetition',24,c.muted);
    } else if(name==='vaani') {
      art=box(64,276,278,108,'Rachel','Empathetic persona')+box(64,416,278,108,'Orion','Direct persona');
      art+=`<path d="M342 330H390V468H342M390 400H454" fill="none" stroke="${c.line}" stroke-width="3"/>`;
      art+=box(454,342,270,120,'Live call','Listen + respond',true);
      art+=line(724,400,790,400)+box(790,276,346,108,'Transcript','Conversation stream');
      art+=box(790,416,346,108,'Risk checks','Intent + guardrails',true);
      art+=`<path d="M757 400V330H790M757 400V470H790" fill="none" stroke="${c.line}" stroke-width="3"/>`;
      art+=text(64,608,'Voice transport · Agent reasoning · Call outcomes',23,c.muted);
    } else {
      art=box(64,340,253,108,'Main thread','Shared context');
      art+=`<path d="M317 394H373V292H431M373 394V498H431" fill="none" stroke="${c.accent}" stroke-width="3"/>`;
      art+=box(431,240,286,104,'Explore option A','Separate history')+box(431,446,286,104,'Explore option B','Separate history');
      art+=`<path d="M717 292H770V394H823M717 498H770V394" fill="none" stroke="${c.accent}" stroke-width="3"/>`;
      art+=box(823,340,313,108,'Merge insights','Summary, not history',true);
      art+=text(64,608,'Fork any message · Keep each branch intact',23,c.muted);
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><title>${title}: ${subtitle}</title><rect width="1200" height="675" fill="${c.bg}"/><g font-family="Arial, Helvetica, sans-serif">${text(64,59,label,17,c.accent,600)}${text(64,130,title,60,c.ink,600)}${text(64,181,subtitle,28,c.muted)}<path d="M64 215H1136" stroke="${c.line}"/>${art}</g></svg>`;
    writeFileSync(fileURLToPath(new URL(`../public/test/covers/${name}-workflow-${realm}-v9.svg`,import.meta.url)),svg);
  }
}
console.log('Built eight theme-aware workflow covers from project documentation.');
