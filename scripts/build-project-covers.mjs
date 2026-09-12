import {writeFileSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {projects, COVER_VERSION} from './test-portfolio-content.mjs';

// Product covers: a schematic of what each project actually looks like or does,
// drawn in the two realm palettes. No scenery, no characters; one faint realm mark.
const W = 1200, H = 675;

const palettes = {
  seireitei: {bg:'#f5f4ef', top:'#ffffff', ink:'#172d45', muted:'#5b6871', line:'#cfd3cc', panel:'#ffffff', edge:'#d4d8d0', accent:'#356a91', soft:'#dde7ee', warm:'#c9b58a', code:'#eef1ef', mark:'#c9b58a', shadow:'#172d45'},
  hueco:     {bg:'#0f1012', top:'#1b1d20', ink:'#f1f1ee', muted:'#a6aaaf', line:'#2c2f33', panel:'#17191c', edge:'#33363b', accent:'#e2e1d7', soft:'#26282b', warm:'#8b96a1', code:'#121417', mark:'#e2e1d7', shadow:'#000000'}
};

function kit(c){
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
  const t=(x,y,s,size=20,color=c.ink,weight=400,anchor='start',family='Arial,Helvetica,sans-serif')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}" font-family="${family}">${esc(s)}</text>`;
  const mono=(x,y,s,size=15,color=c.muted,anchor='start')=>t(x,y,s,size,color,400,anchor,"'JetBrains Mono',Consolas,monospace");
  const rect=(x,y,w,h,fill=c.panel,r=10,stroke=c.edge,sw=1.5)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const path=(d,stroke=c.line,w=2,extra='')=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const dot=(x,y,r=6,fill=c.accent)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const bar=(x,y,w,h=8,fill=c.line,r=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
  // A window frame with traffic dots and a title strip.
  const window=(x,y,w,h,title='')=>rect(x,y,w,h,c.panel,14)+path(`M${x} ${y+40}H${x+w}`,c.edge,1.5)+dot(x+22,y+20,5,c.line)+dot(x+42,y+20,5,c.line)+dot(x+62,y+20,5,c.line)+(title?mono(x+w/2,y+25,title,13,c.muted,'middle'):'');
  const phone=(x,y,w,h)=>rect(x,y,w,h,c.panel,36,c.edge,2)+bar(x+w/2-36,y+16,72,8,c.line)+bar(x+w/2-50,y+h-18,100,5,c.line,3);
  // Text lines standing in for prose.
  const lines=(x,y,widths,gap=18,h=8,fill=c.line)=>widths.map((w,i)=>bar(x,y+i*gap,w,h,fill)).join('');
  return {t,mono,rect,path,dot,bar,window,phone,lines,esc};
}

const drawings = {
  justhireme(k,c){
    let s=k.window(330,110,760,470,'JustHireMe');
    // left: lead list; right: fit explanation
    for(let i=0;i<5;i++){const y=180+i*68;s+=k.rect(360,y,300,52,i===1?c.soft:c.panel,8,i===1?c.accent:c.edge);s+=k.bar(378,y+14,120,8,c.ink);s+=k.bar(378,y+31,180,6,c.line);s+=k.mono(640,y+32,`${[92,87,74,61,55][i]}%`,14,i===1?c.accent:c.muted,'end');}
    s+=k.rect(690,180,370,340,c.panel,10);
    s+=k.t(712,214,'Why this fits',20,c.ink,700);
    s+=k.lines(712,236,[300,260,320,180],20,7);
    // graph
    s+=k.path('M760 420L830 380L900 420L830 470Z',c.accent,2.5);
    for(const [x,y] of [[760,420],[830,380],[900,420],[830,470]])s+=k.dot(x,y,7,c.accent);
    s+=k.dot(830,425,9,c.ink);
    s+=k.mono(940,425,'graph + vectors',13,c.muted,'middle');
    s+=k.rect(712,490,160,24,c.accent,6,c.accent)+k.t(792,507,'Draft resume',13,c.bg,700,'middle');
    return s;
  },
  svara(k,c){
    let s=k.window(330,110,760,470,'editor');
    s+=k.lines(370,175,[380,520,300,440,210],28,9);
    s+=k.bar(370,315,470,9,c.line);
    s+=k.bar(842,306,3,26,c.accent,1); // caret
    s+=k.rect(600,380,450,150,c.panel,14,c.accent,2);
    s+=k.dot(640,455,18,c.accent)+k.dot(640,455,7,c.bg);
    for(let i=0;i<26;i++){const h=8+Math.abs(Math.sin(i*1.3+.4))*46*Math.sin((i+1)/27*Math.PI);s+=k.path(`M${690+i*13} ${455-h}V${455+h}`,c.accent,4);}
    s+=k.mono(660,410,'listening · on-device',13,c.muted);
    return s;
  },
  odeon(k,c){
    let s='';
    // loop
    s+=k.path('M710 170A190 190 0 1 1 540 380',c.accent,5);
    s+=k.path('M540 380L520 350M540 380L570 366',c.accent,5);
    for(const [x,y,l] of [[710,170,'Simulate'],[900,360,'Score'],[600,540,'Revise']]){s+=k.dot(x,y,22,c.soft)+k.path(`M${x-22} ${y}a22 22 0 1 0 44 0a22 22 0 1 0 -44 0`,c.accent,4);s+=k.t(x+(l==='Score'?40:0),y+(l==='Revise'?55:-36),l,22,c.ink,700,l==='Score'?'start':'middle');}
    // transcript card
    s+=k.rect(380,240,290,220,c.panel,12);
    s+=k.mono(400,270,'caller · adversarial',12,c.muted);
    s+=k.lines(400,290,[220,180,240],20,7);
    s+=k.rect(400,370,180,26,c.soft,6,c.edge)+k.mono(410,387,'metric: empathy 0.62',12,c.ink);
    s+=k.rect(400,404,180,26,c.soft,6,c.edge)+k.mono(410,421,'metric: accuracy 0.91',12,c.ink);
    return s;
  },
  dreamer(k,c){
    let s=k.window(330,110,760,470,'idea · draft v7');
    s+=k.bar(370,175,280,14,c.ink,4);
    s+=k.lines(370,215,[560,600,520,580,300],26,8);
    // proposal callout
    s+=k.rect(700,330,350,190,c.panel,12,c.accent,2);
    s+=k.mono(720,358,'proposal · research agent',12,c.muted);
    s+=k.lines(720,378,[290,260,300],20,7,c.accent);
    s+=k.rect(720,470,90,26,c.accent,6,c.accent)+k.t(765,488,'Accept',13,c.bg,700,'middle');
    s+=k.rect(822,470,90,26,c.panel,6,c.edge)+k.t(867,488,'Reject',13,c.ink,700,'middle');
    s+=k.path('M660 300L700 360',c.accent,2,'stroke-dasharray="4 6"');
    s+=k.bar(370,300,290,9,c.accent);
    return s;
  },
  'deep-researcher'(k,c){
    let s=k.window(330,110,760,470,'report');
    s+=k.bar(370,175,300,14,c.ink,4);
    s+=k.lines(370,215,[600,560,620],26,8);
    s+=k.bar(370,293,420,8,c.accent);s+=k.mono(800,300,'[12]',13,c.accent);
    s+=k.lines(370,320,[580,540],26,8);
    // ledger
    s+=k.rect(660,380,400,170,c.panel,12,c.accent,2);
    s+=k.mono(680,408,'claim ledger',12,c.muted);
    s+=k.mono(680,436,'quote  ✓ found in source',13,c.ink);
    s+=k.mono(680,462,'claim  ✓ supported in context',13,c.ink);
    s+=k.mono(680,488,'hash   3f9a…c21',13,c.muted);
    s+=k.mono(680,520,'gate failed → stop and keep evidence',12,c.muted);
    s+=k.path('M792 297L760 380',c.accent,2,'stroke-dasharray="4 6"');
    return s;
  },
  waldo(k,c){
    let s='';
    // pdf page
    s+=k.rect(360,120,380,470,c.panel,10);
    s+=k.lines(390,160,[300,280,310],18,7);
    // table
    for(let r=0;r<4;r++)for(let q=0;q<3;q++)s+=k.rect(390+q*100,240+r*30,96,26,r===0?c.soft:c.panel,3,c.edge);
    // chart
    for(let i=0;i<6;i++)s+=k.bar(400+i*50,470-[60,110,80,140,95,120][i],28,[60,110,80,140,95,120][i],i===3?c.accent:c.line,3);
    s+=k.path('M390 480H720',c.edge,1.5);
    // chat
    s+=k.rect(790,250,290,90,c.soft,14,c.edge)+k.t(810,290,'What was Q3 revenue?',16,c.ink,700);
    s+=k.rect(790,360,290,150,c.panel,14,c.accent,2)+k.lines(810,385,[240,200,220],20,7);
    s+=k.mono(810,490,'from table 2, page 4',12,c.accent);
    s+=k.path('M650 260C720 260 760 300 790 300',c.accent,2,'stroke-dasharray="4 6"');
    return s;
  },
  socratis(k,c){
    let s=k.window(330,110,760,470,'interview · 18:42');
    // code
    s+=k.rect(360,160,440,400,c.code,8,c.edge);
    const rows=[[20,180],[40,120],[40,260],[60,140],[40,90],[20,60],[20,200],[40,170]];
    rows.forEach(([ind,w],i)=>{s+=k.bar(380+ind,190+i*40,w,9,i===4?c.accent:c.line);});
    s+=k.mono(390,205,'1',11,c.muted);
    // voice panel
    s+=k.rect(820,160,240,400,c.panel,10);
    s+=k.dot(940,240,34,c.soft)+k.dot(940,240,12,c.accent);
    for(let i=0;i<9;i++){const h=6+Math.abs(Math.sin(i*1.7))*22;s+=k.path(`M${895+i*12} ${310-h}V${310+h}`,c.accent,3);}
    s+=k.mono(940,360,'speaks only on a stall',12,c.muted,'middle');
    s+=k.rect(840,400,200,120,c.soft,10,c.edge)+k.lines(856,420,[160,130,150,90],18,6);
    return s;
  },
  forge(k,c){
    let s='';
    const steps=['understand','brainstorm','architect','plan','tdd','debug','review','verify','ship'];
    steps.forEach((st,i)=>{const x=360+i*88,y=300+(i%2?40:-40);s+=k.rect(x-40,y-18,80,36,i===4?c.accent:c.panel,8,i===4?c.accent:c.edge);s+=k.mono(x,y+5,st,12,i===4?c.bg:c.ink,'middle');if(i<steps.length-1)s+=k.path(`M${x+40} ${y}L${x+48} ${y+(i%2?-40:40)}`,c.line,2);});
    s+=k.mono(720,190,'one hand-off chain · each rule falsifiable',13,c.muted,'middle');
    // memory + graph
    s+=k.rect(360,420,330,130,c.panel,12)+k.mono(380,448,'memory  jsonl → lessons',12,c.muted)+k.lines(380,470,[250,200,230],18,6);
    s+=k.rect(730,420,330,130,c.panel,12)+k.mono(750,448,'code graph  live',12,c.muted);
    for(const [x,y] of [[800,500],[860,480],[920,515],[980,485],[1030,520]])s+=k.dot(x,y,6,c.accent);
    s+=k.path('M800 500L860 480L920 515L980 485L1030 520M860 480L920 515',c.line,2);
    return s;
  },
  'justhireme-ios'(k,c){
    let s=k.phone(560,80,290,540);
    s+=k.mono(705,140,'JustHireMe',13,c.muted,'middle');
    for(let i=0;i<4;i++){const y=170+i*90;s+=k.rect(590,y,230,72,i===0?c.soft:c.panel,10,i===0?c.accent:c.edge);s+=k.bar(606,y+18,110,8,c.ink);s+=k.bar(606,y+36,160,6,c.line);s+=k.mono(804,y+30,['88%','81%','70%','64%'][i],13,c.accent,'end');}
    s+=k.rect(590,540,230,40,c.accent,10,c.accent)+k.t(705,566,'Track application',14,c.bg,700,'middle');
    s+=k.mono(880,300,'own cloud API',13,c.muted)+k.mono(880,324,'keychain sessions',13,c.muted)+k.mono(880,348,'StoreKit + server ack',13,c.muted);
    s+=k.path('M850 310H870M850 334H870M850 358H870',c.accent,2);
    return s;
  },
  vaani(k,c){
    let s=k.rect(360,150,720,380,c.panel,16);
    s+=k.mono(390,190,'call · 00:42 · live transcript',12,c.muted);
    s+=k.rect(390,215,330,50,c.soft,12,c.edge)+k.lines(406,236,[260,200],14,6);
    s+=k.rect(690,285,360,50,c.soft,12,c.edge)+k.lines(706,306,[300,180],14,6);
    s+=k.rect(390,355,300,50,c.soft,12,c.edge)+k.lines(406,376,[240,160],14,6);
    for(let i=0;i<30;i++){const h=4+Math.abs(Math.sin(i*1.1))*20;s+=k.path(`M${400+i*11} ${480-h}V${480+h}`,c.accent,3);}
    s+=k.rect(760,440,300,70,c.panel,10,c.accent,2)+k.mono(780,468,'persona: Rachel · patient',12,c.ink)+k.mono(780,492,'risk: none flagged',12,c.muted);
    return s;
  },
  branchgpt(k,c){
    let s='';
    s+=k.path('M400 340H1040',c.line,4);
    s+=k.path('M540 340C620 340 580 210 680 210H820C900 210 880 340 960 340',c.accent,5);
    s+=k.path('M540 340C620 340 580 470 680 470H800',c.line,4);
    for(const [x,y] of [[400,340],[540,340],[680,210],[820,210],[680,470],[800,470],[960,340],[1040,340]])s+=k.dot(x,y,10,c.panel)+k.path(`M${x-10} ${y}a10 10 0 1 0 20 0a10 10 0 1 0 -20 0`,c.accent,3);
    s+=k.mono(700,180,'branch',13,c.muted)+k.mono(1000,310,'merge',13,c.muted)+k.mono(700,510,'fork kept',13,c.muted);
    return s;
  },
  mapmyrepo(k,c){
    let s='';
    const nodes=[[720,330,26],[560,240,14],[620,450,16],[860,230,18],[900,420,14],[480,340,12],[980,320,12],[780,520,10]];
    for(const [x,y] of nodes.slice(1))s+=k.path(`M720 330L${x} ${y}`,c.line,2);
    s+=k.path('M560 240L480 340M860 230L980 320M900 420L780 520',c.line,1.5);
    for(const [x,y,r] of nodes)s+=k.dot(x,y,r,c.panel)+k.path(`M${x-r} ${y}a${r} ${r} 0 1 0 ${r*2} 0a${r} ${r} 0 1 0 -${r*2} 0`,c.accent,2.5);
    s+=k.mono(720,335,'src/',13,c.ink,'middle');
    s+=k.rect(960,440,150,90,c.panel,10)+k.mono(975,465,'summary',11,c.muted)+k.lines(975,478,[110,90,100],14,5);
    return s;
  },
  leetbot(k,c){
    let s=k.window(330,110,760,470,'problem 146 · LRU cache');
    s+=k.lines(370,175,[400,360,420,300],22,8);
    s+=k.rect(760,180,300,330,c.panel,12,c.accent,2);
    s+=k.mono(780,208,'hint · tutor · plan',12,c.muted);
    for(const [x,y,l] of [[860,270,'get'],[960,270,'put'],[910,360,'evict']])s+=k.rect(x-40,y-16,80,32,c.soft,8,c.edge)+k.mono(x,y+5,l,12,c.ink,'middle');
    s+=k.path('M860 286L900 344M960 286L920 344',c.accent,2);
    s+=k.lines(780,420,[240,200,220],18,6);
    return s;
  },
  sss(k,c){
    let s='';
    for(let i=0;i<9;i++){const x=380+(i%3)*150,y=140+Math.floor(i/3)*150;s+=k.rect(x,y,130,130,c.panel,10);s+=k.lines(x+18,y+22,[90,60,80],18,6);}
    s+=k.rect(560,290,130,130,c.soft,10,c.accent,2);
    s+=k.path('M700 355H840',c.accent,2,'stroke-dasharray="4 6"');
    s+=k.rect(850,270,230,170,c.panel,12)+k.mono(870,300,'category: learning',12,c.ink)+k.mono(870,326,'links: 3 found',12,c.ink)+k.mono(870,352,'note.md written',12,c.muted)+k.mono(870,400,'local vision model',11,c.muted);
    return s;
  },
  'ori-no-michi'(k,c){
    let s='';
    // paper crane-ish folded square in isometric
    s+=`<polygon points="560,420 720,260 880,420 720,520" fill="${c.soft}" stroke="${c.accent}" stroke-width="2.5"/>`;
    s+=`<polygon points="560,420 720,260 720,520" fill="${c.panel}" stroke="${c.accent}" stroke-width="2.5"/>`;
    s+=`<polygon points="720,260 640,180 800,260" fill="${c.panel}" stroke="${c.accent}" stroke-width="2.5"/>`;
    s+=k.path('M720 260L720 520',c.accent,2,'stroke-dasharray="6 8"');
    s+=k.path('M800 260L720 340',c.accent,2,'stroke-dasharray="6 8"');
    s+=k.path('M880 300A160 160 0 0 1 900 420',c.muted,2,'stroke-dasharray="2 8"');
    s+=k.mono(880,280,'valley fold',12,c.muted);
    s+=k.rect(560,560,320,30,c.panel,15)+k.path('M580 575H860',c.edge,2)+k.dot(700,575,8,c.accent)+k.mono(880,580,'step 4 / 12',12,c.muted);
    return s;
  },
  learnai(k,c){
    let s=k.window(330,110,760,470,'handbook · embeddings');
    s+=k.lines(370,175,[220,320,280],22,8);
    s+=k.rect(360,260,320,290,c.panel,12);
    for(const [x,y,f] of [[420,330,1],[470,360,1],[440,400,1],[560,320,0],[600,360,0],[580,410,0],[520,500,2],[470,480,2]])s+=k.dot(x,y,8,f===1?c.accent:f===2?c.warm:c.line);
    s+=k.mono(380,540,'drag a word to see its neighbours',11,c.muted);
    s+=k.rect(700,260,360,130,c.soft,12,c.edge)+k.mono(720,290,'quiz',12,c.muted)+k.lines(720,306,[280,220],18,7);
    s+=k.rect(720,350,26,20,c.accent,4,c.accent)+k.bar(756,357,150,7,c.line);
    s+=k.rect(700,410,360,140,c.panel,12)+k.dot(740,480,22,c.accent)+k.path('M733 470L750 480L733 490Z',c.bg,3)+k.path('M780 480H1030',c.edge,3)+k.dot(880,480,6,c.accent)+k.mono(780,515,'lesson 07 · 12:40',11,c.muted);
    return s;
  },
  estimateio(k,c){
    let s=k.path('M360 500H1080',c.line,3);
    s+=k.rect(420,340,120,160,c.soft,8,c.edge); // bus
    s+=k.dot(450,505,12,c.ink)+k.dot(510,505,12,c.ink);
    s+=k.path('M600 500C650 400 780 380 900 470C940 500 980 480 1000 500',c.accent,4); // whale
    s+=k.path('M600 500C640 470 700 440 760 440',c.accent,3,'stroke-dasharray="6 8"');
    s+=k.mono(480,320,'bus · 12 m',13,c.muted,'middle')+k.mono(800,360,'your guess',13,c.accent,'middle');
    s+=k.rect(800,200,260,70,c.panel,12)+k.mono(820,228,'error  +38%',13,c.ink)+k.mono(820,254,'same score either way',12,c.muted);
    s+=k.path('M360 560H1080',c.edge,1.5);for(let i=0;i<=8;i++)s+=k.path(`M${360+i*90} 552V568`,c.edge,1.5)+k.mono(360+i*90,590,['mm','cm','m','10m','100m','km','10km','100km','Mm'][i],10,c.muted,'middle');
    return s;
  },
  reiatsu(k,c){
    let s=k.rect(330,110,760,470,c.panel,16);
    s+=`<rect x="330" y="110" width="760" height="470" rx="16" fill="url(#hazeGrad)"/>`;
    for(let i=0;i<6;i++){const x=380+i*120;s+=k.rect(x,150,64,56,c.soft,10,c.edge)+k.mono(x+32,232,'icon',10,c.muted,'middle');}
    s+=k.path('M360 420C520 380 640 460 820 400C940 360 1030 400 1080 380',c.accent,2,'stroke-opacity=".5"');
    s+=k.path('M360 470C520 430 640 510 820 450C940 410 1030 450 1080 430',c.accent,2,'stroke-opacity=".3"');
    s+=k.rect(820,480,240,80,c.panel,12)+k.mono(840,508,'scene · drift 0.4',12,c.ink)+k.mono(840,534,'refraction · on',12,c.muted);
    return s;
  },
  asciirealtime(k,c){
    let s=k.window(330,110,760,470,'webcam');
    const chars='@%#*+=-:. ';
    for(let r=0;r<14;r++){let row='';for(let q=0;q<48;q++){const d=Math.hypot(q-24,(r-7)*2);row+=chars[Math.min(9,Math.floor(d/2.2))];}s+=k.mono(370,190+r*26,row,15,c.accent);}
    s+=k.rect(890,470,180,80,c.panel,10)+k.mono(905,498,'palette: blocks',11,c.ink)+k.mono(905,522,'bg: segmented',11,c.muted);
    return s;
  },
  pixelforge(k,c){
    let s=k.window(330,110,760,470,'PixelForge');
    s+=k.rect(360,165,340,380,c.code,8,c.edge);
    for(let r=0;r<12;r++)for(let q=0;q<10;q++){const v=Math.sin(r*.6)*Math.cos(q*.7);s+=k.rect(372+q*32,178+r*30,28,26,v>.3?c.accent:v>-.2?c.soft:c.code,2,'none',0);}
    s+=k.rect(730,165,330,380,c.panel,8);
    for(let r=0;r<12;r++)s+=k.mono(750,198+r*30,'#%*+=-:.  .:-=+*%#'.slice(0,20),15,r%3===0?c.accent:c.line);
    s+=k.rect(890,500,150,30,c.accent,6,c.accent)+k.t(965,520,'Export 4K PNG',12,c.bg,700,'middle');
    return s;
  },
  gitart(k,c){
    let s='';
    const word=[
      '0111000101000100111',
      '1000001101001000100',
      '1011101001010000100',
      '1000101001100000100',
      '0111101000100000100'];
    // grid 7 rows x 40 weeks
    for(let r=0;r<7;r++)for(let q=0;q<40;q++){const on=r>=1&&r<=5&&q>=10&&q<29&&word[r-1][q-10]==='1';s+=k.rect(360+q*18,240+r*18,14,14,on?c.accent:c.soft,3,'none',0);}
    s+=k.mono(720,215,'paint the grid',13,c.muted,'middle');
    s+=k.rect(560,400,320,40,c.panel,10)+k.mono(720,425,'download repo.zip',13,c.ink,'middle');
    s+=k.mono(720,480,'isomorphic-git · memfs · no server',12,c.muted,'middle');
    return s;
  },
  habiturtle(k,c){
    let s=k.window(330,110,760,470,'habiTurtle');
    for(let i=0;i<4;i++){const y=180+i*70;s+=k.rect(360,y,380,52,c.panel,10);s+=k.rect(378,y+14,24,24,i<3?c.accent:c.panel,6,i<3?c.accent:c.edge);s+=k.bar(420,y+22,160,8,c.ink);s+=k.mono(720,y+32,`🔥 ${[12,7,3,0][i]}`,13,c.muted,'end');}
    // turtle
    s+=`<ellipse cx="920" cy="400" rx="90" ry="60" fill="${c.soft}" stroke="${c.accent}" stroke-width="3"/>`;
    s+=k.path('M860 400a60 60 0 0 1 120 0M890 360l30 20l30-20M890 440l30-20l30 20',c.accent,2);
    s+=k.dot(1020,390,26,c.soft)+k.path('M994 390a26 26 0 1 0 52 0a26 26 0 1 0 -52 0',c.accent,3)+k.dot(1028,384,3,c.ink);
    for(const [x,y] of [[860,450],[970,450],[860,350],[970,350]])s+=k.dot(x,y,12,c.soft)+k.path(`M${x-12} ${y}a12 12 0 1 0 24 0a12 12 0 1 0 -24 0`,c.accent,2);
    s+=k.mono(920,500,'streak 12 · happy',12,c.muted,'middle');
    return s;
  },
  'maze-pathfinder'(k,c){
    let s='';
    const cell=22,ox=440,oy=140;
    for(let r=0;r<18;r++)for(let q=0;q<24;q++){const wall=(r*7+q*3)%5===0;s+=k.rect(ox+q*cell,oy+r*cell,cell-2,cell-2,wall?c.line:c.panel,2,'none',0);}
    const trail=[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2],[4,2],[5,2],[5,3],[6,3],[7,3],[7,4],[8,4],[9,4],[10,4],[10,5],[11,5],[12,5],[12,6],[13,6],[14,6],[14,7],[15,7],[16,7],[17,7],[17,8],[18,8],[19,8],[19,9],[20,9],[21,9],[21,10],[22,10],[23,10]];
    for(const [q,r] of trail)s+=k.rect(ox+q*cell,oy+r*cell,cell-2,cell-2,c.accent,2,'none',0);
    for(let i=0;i<40;i++)s+=k.rect(ox+((i*7)%24)*cell,oy+(8+(i*3)%10)*cell,cell-2,cell-2,c.soft,2,'none',0);
    s+=k.mono(720,590,'BFS · DFS · Dijkstra · A*',13,c.muted,'middle');
    return s;
  },
  holeemall(k,c){
    let s=k.rect(330,110,760,470,c.code,16,c.edge,2);
    s+=k.dot(640,360,58,c.ink)+k.dot(640,360,44,c.bg)+k.dot(640,360,36,c.ink);
    for(const [x,y,r] of [[430,200,10],[520,470,14],[820,240,8],[900,430,18],[980,300,12],[760,520,9],[400,380,7]])s+=k.dot(x,y,r,c.accent);
    s+=k.mono(1060,150,'00:27',18,c.ink,'end')+k.mono(360,150,'score 14',14,c.muted);
    return s;
  }
};

function realmMark(realm,c){
  if(realm==='hueco') return `<path d="M1090 560a54 54 0 1 1 26 -100a44 44 0 1 0 -6 96z" fill="${c.mark}" opacity=".10"/>`;
  return `<circle cx="1096" cy="540" r="52" fill="none" stroke="${c.mark}" stroke-width="3" opacity=".22"/>`;
}

const outDir=fileURLToPath(new URL('../public/test/covers/',import.meta.url));
mkdirSync(outDir,{recursive:true});
let built=0;
for(const realm of ['seireitei','hueco']){
  const c=palettes[realm];const k=kit(c);
  for(const p of projects){
    const draw=drawings[p.slug];if(!draw)throw new Error(`No cover drawing for ${p.slug}`);
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><title>${k.esc(p.name)}: ${k.esc(p.hook)}</title><defs><linearGradient id="wash" x2="0" y2="1"><stop stop-color="${c.top}"/><stop offset=".8" stop-color="${c.bg}"/></linearGradient><linearGradient id="hazeGrad" x2="1" y2="1"><stop stop-color="${c.soft}" stop-opacity=".9"/><stop offset="1" stop-color="${c.panel}" stop-opacity="0"/></linearGradient><filter id="soft" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="${c.shadow}" flood-opacity="${realm==='hueco'?'.45':'.10'}"/></filter></defs><rect width="${W}" height="${H}" fill="${c.bg}"/><rect width="${W}" height="${H}" fill="url(#wash)"/>${realmMark(realm,c)}<g filter="url(#soft)">${draw(k,c)}</g><g>${k.mono(58,80,p.name.toUpperCase(),15,c.muted)}${k.t(58,124,p.kind.split(' · ').pop(),24,c.ink,700)}</g></svg>`;
    writeFileSync(`${outDir}${p.slug}-product-${realm}-${COVER_VERSION}.svg`,svg);built++;
  }
}
console.log(`Built ${built} product covers (${COVER_VERSION}).`);
