import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=path=>import('data:text/javascript;base64,'+Buffer.from(readFileSync(path)).toString('base64'));
const {createAttackQueue}=await load('public/test/attack-queue.js');
let now=0,nextId=0,timers=new Map(),events=[];
const options={available:()=>true,start:t=>events.push(['start',t,now]),release:t=>events.push(['release',t,now]),recover:()=>{},finish:()=>events.push(['finish',null,now]),setTimer:(fn,ms)=>{const id=++nextId;timers.set(id,{fn,at:now+ms});return id;},clearTimer:id=>timers.delete(id)};
function advance(ms){const end=now+ms;for(;;){const first=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!first||first[1].at>end)break;timers.delete(first[0]);now=first[1].at;first[1].fn();}now=end;}
const queue=createAttackQueue(options);
queue.push('a');advance(20);queue.push('b');advance(20);queue.push('c');advance(1000);
assert.deepEqual(events.filter(e=>e[0]==='release').map(e=>e[1]),['a','b','c']);assert.equal(timers.size,0);
events=[];queue.push('first');for(let i=0;i<100;i++)queue.push(i);advance(2000);
assert.deepEqual(events.filter(e=>e[0]==='release').map(e=>e[1]),['first',0,1,99]);assert.equal(timers.size,0);
events=[];queue.push('cancelled');queue.push('also cancelled');queue.cancel();advance(1000);assert.equal(events.filter(e=>e[0]==='release').length,0);
queue.push('after switch');advance(400);assert.deepEqual(events.filter(e=>e[0]==='release').map(e=>e[1]),['after switch']);
const {effectCharacters,launchCharacterEffect}=await load('public/test/bleach-effects.js');
const roster=JSON.parse(readFileSync('public/test/bleach-roster.js','utf8').replace(/^export const roster = /,'').replace(/;\s*$/,''));
assert.deepEqual(effectCharacters.sort(),Object.keys(roster).filter(id=>roster[id].spriteEffect).sort());
let rendered=[];globalThis.innerWidth=1280;globalThis.innerHeight=720;
globalThis.document={createElement:()=>({style:{},dataset:{},innerHTML:'',animate(frames,options){rendered.push({art:this.style.backgroundImage,frames,options});return {finished:Promise.resolve(),cancel(){}};},remove(){}})};
const slashes=new Set();
for(const character of effectCharacters){assert.equal(launchCharacterEffect({character,field:{append(){}},x:100,y:300,targetX:450,targetY:320,slashes}),true);assert.ok(slashes.size<=12);}
assert.equal(new Set(rendered.map(r=>r.art)).size,16);assert.ok(rendered.every(r=>r.options.duration>=360 && r.options.duration<=680));
for(const effect of rendered.filter(r=>r.frames[0].backgroundPosition)){
 assert.equal(effect.options.easing,'linear','Overall time must advance continuously');
 assert.deepEqual(effect.frames.slice(0,4).map(f=>f.backgroundPosition),['0% 0%','100% 0%','0% 100%','100% 100%']);
 assert.ok(effect.frames.every(f=>f.easing==='steps(1,end)'),'Each cell interval holds its own frame');
}
await Promise.resolve();assert.equal(slashes.size,0);
console.log('PASS: rapid clicks, bounded spam, cancellation, recovery and all 16 distinct drawn effects');
