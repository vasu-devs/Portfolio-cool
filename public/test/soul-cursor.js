import {mountBleachDetails,characterEntrance,idleDetail,pageAttacksEnabled} from './bleach-details.js?v=likeness-24';
import {createAttackQueue} from './attack-queue.js?v=likeness-24';
import {launchCharacterEffect,preloadCharacterEffect} from './bleach-effects.js?v=likeness-24';
import {roster} from './bleach-roster.js?v=likeness-24';
// A small, optional cursor companion. Only movement or a slash schedules frames.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const host = document.createElement('div');
host.className = 'soul-cursor';

host.innerHTML = '<button class="soul-hit" type="button" aria-label="Trigger your Bleach companion attack"><span class="soul-character" aria-hidden="true"></span></button><span class="soul-reply" role="status"></span>';
const hit=host.querySelector('button'), reply=host.querySelector('.soul-reply');
const sprite = host.querySelector('.soul-character');
const field = document.createElement('div');
field.className = 'getsuga-field';
field.setAttribute('aria-hidden', 'true');
document.body.append(field, host);
const toggle = document.createElement('button');
toggle.className = 'soul-toggle';
toggle.type = 'button';
toggle.title = 'Toggle the Soul Reaper cursor. Click anywhere to swing Zangetsu.';
const controls = document.createElement('div');
controls.className = 'soul-controls';
const select = document.createElement('select');
select.setAttribute('aria-label','Bleach companion character');
for (const [value,{name}] of Object.entries(roster)) {
 const option = document.createElement('option'); option.value=value; option.textContent=name; select.append(option);
}
const chooserLabel=document.createElement('label');
chooserLabel.textContent='Companion';
select.id='bleach-character';
chooserLabel.htmlFor=select.id;
const technique=document.createElement('span');
technique.className='soul-technique';
technique.setAttribute('aria-live','polite');
controls.append(chooserLabel,select,toggle,technique);
mountBleachDetails(controls);
let character='ichigo', characterRequest=0, ready=false;
try { const saved=localStorage.getItem('vasu-bleach-character'); if(Object.hasOwn(roster,saved)) character=saved; } catch {}
async function loadCharacter(id) {
 if(!Object.hasOwn(roster,id))return;
 const request=++characterRequest;
 const image=new Image(); image.src=new URL(roster[id].atlas,import.meta.url).href;
 const run=new Image(); if(roster[id].run) run.src=new URL(`./sprites/${id}-run.webp`,import.meta.url).href;
 try { await image.decode();await preloadCharacterEffect(id);if(roster[id].run) await run.decode(); } catch { if(request===characterRequest) select.value=character; return; }
 if(request!==characterRequest) return;
 clear(); character=id; atlasURL=image.src;runURL=roster[id].run?run.src:image.src; currentCell=-1; cell(0); ready=true; select.value=id;
 try {localStorage.setItem('vasu-bleach-character',id);} catch {}
 label(); if(active()) {seen=true;host.classList.add("is-visible");await characterEntrance(host,id);if(request===characterRequest && active())park();}
}
select.value=character;
select.addEventListener('change',()=>loadCharacter(select.value));
let enabled = true;
try { enabled = localStorage.getItem('vasu-soul-cursor') !== 'off'; } catch {}
let frame = 0, idleTimer = 0, reactionTimer=0;
let speed=0, stride=0, currentCell=-1, parkTimer=0, greetingTimer=0;
let parking=false, greeting=false, hovering=false;
let atlasURL="", runURL="";
let x = 70, y = 140, tx = 70, ty = 140, seen = false, lastTime = 0;
let state = 'rest', facing = 1;
const slashes = new Set();
const supported = () => finePointer.matches && !calm.matches;
const active = () => ready && enabled && supported() && !document.hidden;
const attackQueue=createAttackQueue({
 available:()=>active()&&seen&&!greeting,
 start:({x:targetX})=>{cancelAnimationFrame(frame);frame=0;clearTimeout(idleTimer);clearTimeout(reactionTimer);reactionTimer=0;speed=0;parking=false;facing=targetX<x?-1:1;draw();pose('attack');},
 release:target=>{attackCell(1);fire(target.x,target.y);},
 recover:()=>attackCell(2),
 finish:()=>{if(active()&&seen){rest();armPark();wake();}}
});
function label() {
 toggle.textContent = enabled ? 'on' : 'off';
 toggle.setAttribute('aria-label',enabled?'Turn companion off':'Turn companion on');
 technique.textContent=roster[character].technique;
 technique.title=roster[character].form;
 hit.setAttribute('aria-label',`Attack with ${roster[character].name}`);
 toggle.title = 'Reacts to your pointer, rests in a corner, and attacks when clicked.';
 toggle.setAttribute('aria-pressed', String(enabled)); controls.hidden = !supported();
}
function cell(index, running=false) {
 const key=`${running}:${index}`;
 if(currentCell===key) return;
 currentCell=key;
 const separate=running && roster[character].run;
 const columns=separate?2:3;
 sprite.style.backgroundImage=`url("${separate?runURL:atlasURL}")`;
 sprite.style.backgroundSize=`${columns*100}% ${columns*100}%`;
 sprite.style.backgroundPosition=`${index%columns*100/(columns-1)}% ${Math.floor(index/columns)*100/(columns-1)}%`;
 sprite.style.setProperty('--frame-flip',1);
}
function attackCell(index) { cell(6+Math.min(index,2)); }
function pose(next) {
 state = next; host.dataset.state = next;
 if(next==='run') {stride=0;cell(roster[character].run?0:1,true);return;}
 if(next==='attack'){attackCell(0);return;}
 cell(({rest:0,run:1,sit:3,wave:4,sleep:5,attack:6})[next]);
 if(next==='sleep')idleDetail(host,character);
}
function draw() {
 x = Math.max(26, Math.min(innerWidth-26, x));
 y = Math.max(26, Math.min(innerHeight-26, y));
 host.style.transform = `translate3d(${x}px,${y}px,0)`;
 host.style.setProperty('--facing', facing);
}
function rest() {
 speed=0; clearTimeout(idleTimer);
 if(parking) {
  pose('sit');
  idleTimer=setTimeout(()=>{if(active() && parking && !greeting) pose('sleep');},4500);
 } else pose('rest');
}
function corner() { return {x:x<innerWidth/2?34:innerWidth-34,y:innerHeight-36}; }
function park() {
 clearTimeout(parkTimer);parkTimer=0;clearTimeout(reactionTimer);reactionTimer=0;
 if(!active() || !seen || greeting || state==='attack') {if(active() && seen) parkTimer=setTimeout(park,800);return;}
 parking=true; const home=corner();tx=home.x;ty=home.y;wake();
}
function armPark() {clearTimeout(parkTimer);parkTimer=setTimeout(park,5000);}
function hello() {
 if(!active())return;
 attackQueue.cancel();
 cancelAnimationFrame(frame);frame=0;clearTimeout(idleTimer);clearTimeout(reactionTimer);reactionTimer=0;clearTimeout(parkTimer);clearTimeout(greetingTimer);
 for(const item of slashes){item.animation.cancel();item.node.remove();}slashes.clear();
 speed=0;greeting=true;pose('wave');
 reply.textContent=roster[character].greeting;
 greetingTimer=setTimeout(()=>{greeting=false;reply.textContent='';park();},1600);
}
// Stop to greet the pointer so the small character remains easy to click.
 hit.addEventListener('pointerenter',()=>{hovering=true;cancelAnimationFrame(frame);frame=0;if(state==='run')rest();});
 hit.addEventListener('pointerleave',()=>{hovering=false;if(!greeting)wake();});
 hit.addEventListener('pointerdown',event=>{
 if(event.button!==0)return;
 event.stopPropagation();
 // Lock position for the entire press so a moving sprite cannot escape its click.
 hovering=true;cancelAnimationFrame(frame);frame=0;
});
 hit.addEventListener('click',event=>{event.stopPropagation();requestAttack(x+facing*120,y);});
function wake() {
 if (!host.classList.contains('is-entering') && !frame && state !== 'attack' && !greeting && !hovering && active() && seen) { lastTime = 0; frame = requestAnimationFrame(tick); }
}
function tick(now) {
 frame = 0;
 if (!active() || !seen || state === 'attack' || greeting || hovering) return;
 const dt = lastTime ? Math.min((now-lastTime)/1000,.04) : 1/60; lastTime = now;
 const dx = tx-x, dy = ty-y, distance = Math.hypot(dx,dy);
 const stop=parking?0:56;
 if(distance<=stop+.5){rest();return;}
 clearTimeout(idleTimer); if(state!=='run') pose('run');
 if (Math.abs(dx)>18) facing = dx<0 ? -1 : 1;
 const desired=Math.min(190,Math.sqrt(2*420*Math.max(0,distance-stop)));
 speed += Math.max(-650*dt,Math.min(420*dt,desired-speed));
 const step = Math.min(distance-stop, speed*dt);
 stride+=dt;
 // Stable 8 fps cadence; the body no longer flickers faster as chase speed rises.
 cell(roster[character].drift?0:roster[character].run?Math.floor(stride/.125)%4:1+Math.floor(stride/.125)%2,true);
 x += dx/distance*step; y += dy/distance*step; draw();
 frame = requestAnimationFrame(tick);
}
function clear() {
 attackQueue.cancel();
 cancelAnimationFrame(frame); frame = 0; clearTimeout(idleTimer); clearTimeout(reactionTimer);reactionTimer=0;speed=0;clearTimeout(parkTimer);clearTimeout(greetingTimer);greeting=false;hovering=false;parking=false;reply.textContent='';
 seen = false; host.classList.remove('is-visible'); pose('rest');
 for (const item of slashes) { item.animation.cancel(); item.node.remove(); }
 slashes.clear();
}
document.addEventListener('pointermove', event => {
 if (!active() || event.pointerType !== 'mouse') return;
 armPark();
 if(greeting || event.target.closest('.soul-hit'))return;
 parking=false;
 tx = Math.max(32,Math.min(innerWidth-32,event.clientX)); ty = Math.max(42,Math.min(innerHeight-42,event.clientY));
 if (!seen) { seen = true; draw(); host.classList.add('is-visible'); rest(); }
 if (Math.hypot(tx-x,ty-y)>90 && !frame && !reactionTimer && state!=='attack') {
  reactionTimer=setTimeout(()=>{reactionTimer=0;wake();},state==='sleep'?420:160);
 }
}, {passive:true});
function fire(targetX,targetY) {
 if(launchCharacterEffect({character,field,x:x+facing*18,y,targetX,targetY,slashes}))return;
 const angle = Math.atan2(targetY-y,targetX-x);
 const distance = Math.min(220,Math.max(85,Math.hypot(targetX-x,targetY-y)));
 const dx = Math.cos(angle)*distance, dy = Math.sin(angle)*distance;
 const node = document.createElement('div'); node.className = 'getsuga-slash';
 node.innerHTML = `<svg viewBox="0 0 120 180"><path d="M25 4Q165 88 25 176Q101 89 25 4Z" fill="var(--bright)" stroke="var(--page)" stroke-width="3"/><path d="M28 14Q130 88 28 167" fill="none" stroke="var(--bright)" stroke-width="2"/></svg>`;
 if(character==='ichigo') node.innerHTML='<svg viewBox="0 0 120 180"><path d="M25 4Q165 88 25 176Q101 89 25 4Z" fill="#e3f8ff" stroke="#69ccff" stroke-width="4"/></svg>';
 if(character==='rukia') node.innerHTML='<svg viewBox="0 0 120 180"><path d="M5 90 46 74 64 35 70 77 113 90 68 99 60 143 49 103Z" fill="#ecfcff" stroke="#a5e3f7" stroke-width="3"/></svg>';
 if(character==='renji') node.innerHTML='<svg viewBox="0 0 120 180"><path d="M0 82H100L118 90 100 98H0Z" fill="#414148" stroke="#ddd" stroke-width="2"/><path d="m15 82 12-22v22m10 0 12-22v22m10 0 12-22v22m10 0 12-22v22" fill="#c6c7cc" stroke="#fff" stroke-width="2"/></svg>';
 // The projectile starts at the companion's sword, not the pointer.
 node.style.left = `${x+facing*18}px`; node.style.top = `${y}px`; field.append(node);
 const transform = (progress,scale) => `translate(calc(-50% + ${dx*progress}px),calc(-50% + ${dy*progress}px)) rotate(${angle}rad) scale(${scale})`;
 const frames=character==='renji'
  ? [{transform:transform(0,.15),opacity:0},{transform:transform(.45,1),opacity:1,offset:.5},{transform:transform(0,.15),opacity:0}]
  : [{transform:transform(0,.15),opacity:0},{transform:transform(.15,.65),opacity:.9,offset:.2},{transform:transform(1,1.1),opacity:0}];
 const animation = node.animate(frames,{duration:520,easing:'cubic-bezier(.2,.65,.3,1)'});
 const item = {node,animation}; slashes.add(item);
 const cleanup = () => { node.remove(); slashes.delete(item); };
 animation.finished.then(cleanup,cleanup);
}

document.addEventListener('click', event => {
 if (!pageAttacksEnabled() || event.button!==0 || event.target.closest('input,textarea,select,[contenteditable="true"],.soul-controls,.soul-hit,.bleach-menu,.bleach-story,.secret-dot,.theme-toggle')) return;
 requestAttack(event.clientX,event.clientY);
},{passive:true,capture:true});
function requestAttack(targetX,targetY){
 if(!active())return;
 if(!seen){seen=true;draw();host.classList.add('is-visible');}
 clearTimeout(greetingTimer);greeting=false;reply.textContent='';
 armPark();attackQueue.push({x:targetX,y:targetY});
}
toggle.addEventListener('click', () => {
 enabled=!enabled; clear(); label();if(active()){seen=true;host.classList.add("is-visible");characterEntrance(host,character).then(()=>{if(active())park();});}
 try { localStorage.setItem('vasu-soul-cursor',enabled?'on':'off'); } catch {}
});
// Leaving the browser must never dismiss the companion. Settle synchronously:
 // animation frames may stop as soon as the browser loses focus.
function settleInCorner() {
 if(!ready || !enabled || !supported())return;
 clear();
 seen=true;parking=true;
 const home=corner();x=tx=home.x;y=ty=home.y;
 draw();host.classList.add('is-visible');rest();
}
document.documentElement.addEventListener('pointerleave',settleInCorner);
window.addEventListener('blur',settleInCorner);
window.addEventListener('resize',()=>{
 draw();if(parking)settleInCorner();
},{passive:true});
window.addEventListener('pagehide',settleInCorner);
window.addEventListener('pageshow',()=>{if(ready && enabled && supported())settleInCorner();});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){settleInCorner();clearTimeout(idleTimer);pose('sleep');}
 else if(ready && enabled && supported())settleInCorner();
});
for(const query of [finePointer,calm])query.addEventListener('change',()=>{
 label();if(supported() && enabled)settleInCorner();else clear();
});
label();loadCharacter(character);
