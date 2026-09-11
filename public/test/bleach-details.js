const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
const found=new Set(read('vasu-bleach-discoveries',[]));
let pageAttacks=read('vasu-page-attacks',false),list,status;
const names={badge:'Substitute Shinigami badge',gate:'Between worlds',blade:'THE BLADE IS ME',dark:'BORN IN THE DARK',idle:'Quiet company'};
export const pageAttacksEnabled=()=>pageAttacks;
function discover(id){if(found.has(id))return;found.add(id);save('vasu-bleach-discoveries',[...found]);render();if(status)status.textContent='Discovered: '+names[id];}
function render(){if(!list)return;list.replaceChildren();for(const [id,name] of Object.entries(names)){const li=document.createElement('li');li.textContent=(found.has(id)?'✓ ':'○ ')+name;list.append(li);}}
function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);return b;}
export function mountBleachDetails(controls){
 const menu=document.createElement('details');menu.className='bleach-menu';
 const summary=document.createElement('summary');summary.setAttribute('aria-label','Soul badge — companion settings and discoveries');
 summary.title='Discoveries and settings';summary.textContent='Discoveries & settings';
 const panel=document.createElement('div');panel.className='bleach-drawer';
 const bar=document.createElement('div');bar.className='bleach-inline-controls';bar.append(controls);document.querySelector('.navigation')?.after(bar);
 const label=document.createElement('label');label.className='bleach-setting';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=pageAttacks;checkbox.addEventListener('change',()=>{pageAttacks=checkbox.checked;save('vasu-page-attacks',pageAttacks);});label.append(checkbox,' Attack on page clicks');panel.append(label);
 const hint=document.createElement('p');hint.textContent='Click your companion to attack. It rests when you stop moving.';panel.append(hint);
 const heading=document.createElement('h3');heading.textContent='Discoveries';list=document.createElement('ul');status=document.createElement('p');status.setAttribute('role','status');status.className='bleach-status';panel.append(heading,list,status);
 const story=document.createElement('dialog');story.className='bleach-story';story.innerHTML='<p class="bleach-kicker">A PERSONAL NOTE · TYBW REFERENCE</p><h2>THE BLADE IS ME</h2><p>The things I build are a reflection of what I’m curious about.</p><p>Voice, AI, and small experiments that become useful tools. This corner of the site is another one of those experiments—and a nod to Bleach.</p><small>A personal interpretation of the episode title, not dialogue from the series.</small>';
 story.append(button('Close',()=>story.close()));document.body.append(story);
 const openStory=()=>{discover('blade');if(!story.open)story.showModal();};
 panel.append(button('Explore references',()=>{discover('badge');const explain=document.createElement('p');explain.textContent='The badge opens this menu. Changing a companion reveals its entrance. The profile dot opens a personal note. Dark mode and resting companions have their own small details.';explain.className='bleach-explanation';if(!panel.querySelector('.bleach-explanation'))panel.append(explain);}),button('The blade is me',openStory));
 menu.append(summary,panel);bar.append(menu);menu.addEventListener('toggle',()=>{if(menu.open)discover('badge');});render();
 document.querySelector('.secret-dot')?.addEventListener('click',openStory);
 const toast=document.createElement('span');toast.className='bleach-theme-note';toast.setAttribute('role','status');document.body.append(toast);let toastTimer;
 new MutationObserver(()=>{if(document.documentElement.dataset.theme==='dark'&&found.has('badge')){discover('dark');toast.textContent='BORN IN THE DARK';clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.textContent='',2200);}}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.open=false;summary.focus();}});
 document.addEventListener('pointerdown',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false;});
}
export function characterEntrance(host,id){
 host.querySelector('.bleach-entrance')?.remove();
 const gate=document.createElement('span');gate.className='bleach-entrance '+(id==='grimmjow'?'garganta':id==='uryu'||id==='yhwach'?'quincy-step':'senkaimon');gate.setAttribute('aria-hidden','true');gate.innerHTML='<i class="gate-light"></i><i class="gate-door gate-left"></i><i class="gate-door gate-right"></i>';host.append(gate);host.classList.add('is-entering');discover('gate');
 return new Promise(resolve=>setTimeout(()=>{gate.remove();host.classList.remove('is-entering');resolve();},1000));
}
export function idleDetail(host,id){
 host.querySelector('.bleach-idle-detail')?.remove();const detail=document.createElement('span');detail.className='bleach-idle-detail';detail.setAttribute('aria-hidden','true');
 if(id==='byakuya'){detail.classList.add('blade-petals');detail.textContent='✧ ﹅ ✧';}
 else detail.textContent=({rukia:'❄',renji:'…',ichigo:'…','ichigo-tybw':'…',orihime:'♡',yoruichi:'⌁',urahara:'…',shunsui:'…',toshiro:'❄',uryu:'✧',chad:'…',aizen:'…',yhwach:'…',grimmjow:'…',kenpachi:'…'})[id]||'…';
 host.append(detail);discover('idle');setTimeout(()=>detail.remove(),2400);
}
