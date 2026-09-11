const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
const found=new Set(read('vasu-bleach-discoveries',[]));
let pageAttacks=read('vasu-page-attacks',true),list,status;
const names={badge:'Substitute Shinigami badge',gate:'Between worlds',blade:'THE BLADE IS ME',dark:'BORN IN THE DARK',idle:'Quiet company'};
export const pageAttacksEnabled=()=>pageAttacks;
function discover(id){if(found.has(id))return;found.add(id);save('vasu-bleach-discoveries',[...found]);render();if(status)status.textContent='Discovered: '+names[id];}
function render(){if(!list)return;list.replaceChildren();for(const [id,name] of Object.entries(names)){const li=document.createElement('li');li.textContent=(found.has(id)?'✓ ':'○ ')+name;list.append(li);}}
function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);return b;}
export function mountBleachDetails(controls){
 const menu=document.createElement('details');menu.className='bleach-menu';
 const summary=document.createElement('summary');summary.setAttribute('aria-label','Companion settings and discoveries');
 summary.title='Choose a companion and adjust its settings';summary.innerHTML='<span class="character-name">Ichigo</span> <span class="menu-chevron" aria-hidden="true">⌄</span>';
 const panel=document.createElement('div');panel.className='bleach-drawer';
 panel.append(controls);
 const label=document.createElement('label');label.className='bleach-setting';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=pageAttacks;checkbox.addEventListener('change',()=>{pageAttacks=checkbox.checked;save('vasu-page-attacks',pageAttacks);});label.append(checkbox,' Attack on page clicks');panel.append(label);
 const hint=document.createElement('p');hint.textContent='Click character to greet · Click page to attack';panel.append(hint);
 const extras=document.createElement('dialog');extras.className='resume-modal character-discoveries';extras.setAttribute('aria-labelledby','discoveries-title');
 const heading=document.createElement('h2');heading.id='discoveries-title';heading.textContent='Discoveries';list=document.createElement('ul');status=document.createElement('p');status.setAttribute('role','status');status.className='bleach-status';extras.append(heading,list,status);document.body.append(extras);
 const discoverButton=button('Discoveries & references',()=>{menu.open=false;extras.showModal();});discoverButton.className='character-discover-link';panel.append(discoverButton);
 extras.append(button('Close',()=>extras.close()));extras.addEventListener('close',()=>summary.focus());
 const story=document.createElement('dialog');story.className='bleach-story';story.innerHTML='<p class="bleach-kicker">A PERSONAL NOTE · TYBW REFERENCE</p><h2>THE BLADE IS ME</h2><p>The things I build are a reflection of what I’m curious about.</p><p>Voice, AI, and small experiments that become useful tools. This corner of the site is another one of those experiments—and a nod to Bleach.</p><small>A personal interpretation of the episode title, not dialogue from the series.</small>';
 story.append(button('Close',()=>story.close()));document.body.append(story);
 const openStory=()=>{discover('blade');if(!story.open)story.showModal();};
 extras.append(button('Explore references',()=>{discover('badge');const explain=document.createElement('p');explain.textContent='The character name opens this card. Changing a companion reveals its entrance. The profile dot opens a personal note. Dark mode and resting companions have their own small details.';explain.className='bleach-explanation';if(!extras.querySelector('.bleach-explanation'))extras.append(explain);}),button('The blade is me',openStory));
 menu.append(summary,panel);document.querySelector('.navigation')?.insertBefore(menu,document.querySelector('.theme-toggle'));menu.addEventListener('toggle',()=>{if(menu.open)discover('badge');});render();
 document.querySelector('.secret-dot')?.addEventListener('click',openStory);
 const toast=document.createElement('span');toast.className='bleach-theme-note';toast.setAttribute('role','status');document.body.append(toast);let toastTimer;
 new MutationObserver(()=>{if(document.documentElement.dataset.theme==='dark'&&found.has('badge')){discover('dark');toast.textContent='BORN IN THE DARK';clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.textContent='',2200);}}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;summary.focus();}});
 document.addEventListener('pointerdown',e=>{if(menu.open&&!menu.contains(e.target)&&!e.target.closest('.soul-cursor'))menu.open=false;});
 return name=>{summary.querySelector('.character-name').textContent=name;summary.setAttribute('aria-label',`${name}: character settings and discoveries`);};
}
export function characterEntrance(host,id){
 host.querySelector('.bleach-entrance')?.remove();
 const gate=document.createElement('span');gate.className='bleach-entrance '+(id==='grimmjow'?'garganta':id==='uryu'||id==='yhwach'?'quincy-step':'senkaimon');gate.setAttribute('aria-hidden','true');gate.innerHTML='<i class="gate-light"></i><i class="gate-lintel"></i><i class="gate-threshold"></i><i class="gate-door gate-left"></i><i class="gate-door gate-right"></i>';host.append(gate);host.classList.add('is-entering');discover('gate');
 return new Promise(resolve=>setTimeout(()=>{const current=host.querySelector('.bleach-entrance')===gate;gate.remove();if(current)host.classList.remove('is-entering');resolve();},1600));
}
export function idleDetail(host,id){
 host.querySelector('.bleach-idle-detail')?.remove();const detail=document.createElement('span');detail.className='bleach-idle-detail';detail.setAttribute('aria-hidden','true');
 if(id==='byakuya'){detail.classList.add('blade-petals');detail.textContent='✧ ﹅ ✧';}
 else detail.textContent=({rukia:'❄',renji:'…',ichigo:'…','ichigo-tybw':'…',orihime:'♡',yoruichi:'⌁',urahara:'…',shunsui:'…',toshiro:'❄',uryu:'✧',chad:'…',aizen:'…',yhwach:'…',grimmjow:'…',kenpachi:'…'})[id]||'…';
 host.append(detail);discover('idle');setTimeout(()=>detail.remove(),2400);
}
