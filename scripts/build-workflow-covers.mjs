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
  const c={bg:light?'#f4f6f5':'#0c0d0f',ink:light?'#172d45':'#f0f1f2',muted:light?'#536776':'#b4bac2',line:light?'#b8cbd9':'#41464e',card:light?'#ffffff':'#171a1e',accent:light?'#426e8e':'#d1d6de',soft:light?'#e1edf5':'#25292f'};
  const text=(x,y,str,size=24,color=c.ink,weight=400)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${str}</text>`;
  const line=(x1,y1,x2,y2,color=c.line)=>`<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${color}" stroke-width="3"/>`;
  const box=(x,y,w,h,title,sub='',accent=false)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${accent?c.soft:c.card}" stroke="${accent?c.accent:c.line}" stroke-width="2"/>${text(x+22,y+41,title,27,c.ink,600)}${sub?text(x+22,y+77,sub,21,c.muted):''}`;
  for(const [name,[title,subtitle,label]] of Object.entries(projects)) {
    let art='';
    if(name==='justhireme') {
      art=box(64,265,300,110,'Desktop workbench','React + Tauri');
      art+=line(364,320,440,320)+box(440,265,300,110,'Local API','Python · FastAPI',true);
      art+=line(740,320,816,320)+box(816,265,320,110,'Fit ranking','Graph + vectors',true);
      art+=box(440,444,300,110,'Career data','SQLite · local storage');
      art+=line(590,375,590,444);
      art+=box(816,444,320,110,'Retrieval','Kuzu + LanceDB');
      art+=line(976,375,976,444);
      art+=text(64,479,'Leads · quality gate',24,c.muted)+text(64,516,'Reviewable drafts',24,c.muted);
      art+=text(64,615,'On-device embeddings · Optional external AI providers',23,c.muted);
    } else if(name==='odeon') {
      art=box(64,265,300,110,'Simulation UI','React + TypeScript');
      art+=line(364,320,440,320)+box(440,265,300,110,'Live orchestration','FastAPI · WebSockets',true);
      art+=line(740,320,816,320)+box(816,265,320,110,'Agent reasoning','Groq + LangChain',true);
      art+=box(64,444,300,110,'Run history','SQLite · replay');
      art+=`<path d="M590 375V410H214V444" fill="none" stroke="${c.line}" stroke-width="3"/>`;
      art+=box(440,444,300,110,'Score scenarios','Empathy · negotiation')+line(590,375,590,444);
      art+=box(816,444,320,110,'Rewrite prompt','Optimizer agent',true);
      art+=line(740,499,816,499)+line(976,444,976,375);
      art+=text(64,615,'Simulate · evaluate · revise · run again',23,c.muted);
    } else if(name==='vaani') {
      art=box(64,265,300,110,'Command center','React + Vite');
      art+=line(364,320,440,320)+box(440,265,300,110,'Call orchestration','Python · FastAPI',true);
      art+=line(740,320,816,320)+box(816,265,320,110,'Realtime transport','LiveKit · WebRTC / SIP',true);
      art+=box(64,444,300,110,'Speech to text','Deepgram Nova-2');
      art+=line(364,499,440,499)+box(440,444,300,110,'Agent response','Groq · Llama',true);
      art+=line(740,499,816,499)+box(816,444,320,110,'Text to speech','Deepgram TTS');
      art+=`<path d="M976 375V409H214V444" fill="none" stroke="${c.line}" stroke-width="3"/>`;
      art+=text(64,615,'Rachel / Orion personas · Sherlock risk checks',23,c.muted);
    } else {
      art=box(64,265,300,110,'Conversation UI','Next.js · tree navigation');
      art+=line(364,320,440,320)+box(440,265,300,110,'Inference layer','Vercel AI SDK',true);
      art+=line(740,320,816,320)+box(816,265,320,110,'Model provider','Groq · Llama 3.3',true);
      art+=box(64,444,300,110,'Conversation DAG','Neon Postgres · Drizzle');
      art+=line(214,375,214,444);
      art+=box(440,444,300,110,'Fork a message','Keep branch history');
      art+=line(364,499,440,499)+line(740,499,816,499);
      art+=box(816,444,320,110,'Merge insights','Summarized context',true);
      art+=line(976,375,976,444);
      art+=text(64,615,'Explore in parallel · Merge only new context',23,c.muted);
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><title>${title}: ${subtitle}</title><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${light?'#e5eef5':'#191c21'}"/><stop offset=".65" stop-color="${c.bg}"/></linearGradient></defs><rect width="1200" height="675" fill="url(#sky)"/><g font-family="Arial, Helvetica, sans-serif">${text(64,59,label,17,c.accent,600)}${text(64,130,title,60,c.ink,600)}${text(64,181,subtitle,28,c.muted)}<path d="M64 215H1136" stroke="${c.line}"/>${art}</g></svg>`;
    writeFileSync(fileURLToPath(new URL(`../public/test/covers/${name}-architecture-${realm}-v10.svg`,import.meta.url)),svg);
  }
}
console.log('Built eight theme-aware architecture covers from project documentation.');
