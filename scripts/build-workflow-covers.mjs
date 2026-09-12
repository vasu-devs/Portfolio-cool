import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// Editorial architecture covers. Technical labels are grounded in
// src/data/main-portfolio-studies.json; diagrams are explanatory, not screenshots.
const projects={
 justhireme:{name:'JustHireMe',lines:['Find the fit.','Keep control.'],stack:'Tauri / FastAPI / Kuzu / LanceDB',note:'Job discovery + explainable matching'},
 odeon:{name:'Odeon',lines:['Test. Learn.','Run it again.'],stack:'FastAPI / Groq / WebSockets',note:'A feedback loop for voice agents'},
 vaani:{name:'Vaani',lines:['A conversation,','in real time.'],stack:'LiveKit / Deepgram / Groq',note:'Voice agents + live risk checks'},
 branchgpt:{name:'BranchGPT',lines:['Follow an idea.','Keep the thread.'],stack:'Next.js / AI SDK / Neon Postgres',note:'Fork, explore, summarize, merge'}
};
for(const realm of ['seireitei','hueco']){
 const light=realm==='seireitei';
 const c={bg:light?'#f4f6f5':'#08090a',top:light?'#deebf4':'#151719',ink:light?'#172d45':'#f4f5f6',muted:light?'#566a79':'#b4b7bb',line:light?'#a6bece':'#46494e',accent:light?'#456f8d':'#d8dce1',card:light?'#ffffff':'#191b1e',soft:light?'#e2edf3':'#272a2e'};
 const t=(x,y,s,size=26,color=c.ink,weight=400,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
 const path=(d,color=c.line,w=3,dash='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
 const dot=(x,y,r=9,fill=c.accent)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const ring=(x,y,r=18)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c.bg}" stroke="${c.accent}" stroke-width="4"/>`;
 for(const [key,p] of Object.entries(projects)){
  let art='';
  if(key==='justhireme'){
   for(let i=0;i<5;i++){const y=170+i*62;art+=path(`M500 ${y}C610 ${y} 580 295 706 295`,c.line,2)+dot(500,y,6);}
   art+=t(484,117,'Job leads',27,c.muted);
   art+=`<circle cx="750" cy="295" r="78" fill="${c.soft}"/>`;
   for(const [x,y] of [[711,267],[784,258],[722,325],[791,324]])art+=path(`M750 295L${x} ${y}`,c.accent,3)+dot(x,y,7);
   art+=dot(750,295,13)+t(750,413,'Profile + fit',30,c.ink,600,'middle');
   art+=path('M828 295H910',c.accent,4);
   art+=`<rect x="920" y="199" width="180" height="204" rx="10" fill="${c.card}" stroke="${c.line}" stroke-width="2"/>`;
   art+=path('M953 239H1037M953 276H1066M953 313H1066M953 350H1012',c.accent,5);
   art+=t(1010,453,'Tailored draft',26,c.ink,600,'middle');
   art+=t(750,502,'Kuzu + LanceDB',25,c.muted,'400','middle');
  }else if(key==='odeon'){
   art+=path('M774 146C998 119 1127 391 920 475C711 559 534 302 689 195',c.accent,5);
   art+=path('M784 169C956 161 1067 365 900 446C744 513 590 328 700 220',c.line,1);
   art+=ring(759,153,22)+ring(1025,321,22)+ring(792,488,22);
   art+=t(706,110,'Simulate',31,c.ink,600)+t(1060,318,'Score',31,c.ink,600);
   art+=t(792,554,'Revise prompt',31,c.ink,600,'middle');
   art+=t(809,300,'Prompt',44,c.ink,600,'middle')+t(809,342,'feedback',29,c.muted,400,'middle')+t(809,382,'Groq + FastAPI',22,c.muted,400,'middle');
   art+=t(536,452,'Run again',25,c.muted);
  }else if(key==='vaani'){
   art+=`<rect x="494" y="156" width="644" height="350" rx="38" fill="none" stroke="${c.line}" stroke-width="2"/>`;
   art+=t(815,126,'LiveKit · realtime transport',26,c.muted,400,'middle');
   const waves=(cx,cy,scale)=>Array.from({length:15},(_,i)=>{const h=12+Math.abs(Math.sin(i*.77))*scale*Math.sin((i+1)/16*Math.PI);return path(`M${cx+i*9} ${cy-h}V${cy+h}`,c.accent,4)}).join('');
   art+=waves(531,285,46)+waves(966,285,36);
   art+=path('M681 285H730M887 285H937',c.accent,3);
   art+=`<circle cx="810" cy="285" r="68" fill="${c.soft}"/>`+t(810,295,'LLM',35,c.ink,600,'middle');
   art+=t(594,390,'Listen',32,c.ink,600,'middle')+t(810,390,'Respond',32,c.ink,600,'middle')+t(1028,390,'Speak',32,c.ink,600,'middle');
   art+=t(594,433,'Deepgram',24,c.muted,400,'middle')+t(810,433,'Groq',24,c.muted,400,'middle')+t(1028,433,'Deepgram',24,c.muted,400,'middle');
   art+=t(815,553,'Risk checks alongside the call',26,c.muted,400,'middle');
  }else{
   art+=path('M505 325H1080',c.line,4);
   art+=path('M617 325C697 325 650 175 749 175H873C952 175 933 325 1038 325',c.accent,5);
   art+=path('M617 325C697 325 650 464 749 464H875',c.line,4);
   for(const [x,y] of [[505,325],[617,325],[749,175],[873,175],[749,464],[875,464],[1038,325]])art+=ring(x,y,13);
   art+=dot(1038,325,8);
   art+=t(515,278,'Main',28,c.muted)+t(748,123,'Explore',31,c.ink,600);
   art+=t(660,412,'Fork',27,c.muted)+t(959,390,'Merge',31,c.ink,600);
   art+=t(818,548,'Neon stores the conversation graph',24,c.muted,400,'middle');
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><title>${p.name} architecture: ${p.note}</title><defs><linearGradient id="wash" x2="0" y2="1"><stop stop-color="${c.top}"/><stop offset=".72" stop-color="${c.bg}"/></linearGradient><radialGradient id="sheen" cx=".7" cy=".25" r=".7"><stop stop-color="${light?'#ffffff':'#d8dce1'}" stop-opacity="${light?'.7':'.035'}"/><stop offset="1" stop-color="${c.bg}" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="675" fill="${c.bg}"/><rect width="1200" height="675" fill="url(#wash)" opacity=".7"/><rect width="1200" height="675" fill="url(#sheen)"/><g font-family="Arial,Helvetica,sans-serif">${t(58,87,p.name,55,c.ink,600)}${t(58,235,p.lines[0],35,c.ink)}${t(58,281,p.lines[1],35,c.ink)}${path('M58 330H126',c.accent,4)}${t(58,389,'Architecture',23,c.muted)}${art}${path('M58 602H1142',c.line,1)}${t(58,645,p.stack,25,c.muted)}</g></svg>`;
  writeFileSync(fileURLToPath(new URL(`../public/test/covers/${key}-architecture-${realm}-v12.svg`,import.meta.url)),svg);
 }
}
console.log('Built eight editorial architecture covers.');
