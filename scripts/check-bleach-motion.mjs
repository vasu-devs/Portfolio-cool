import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const roster=JSON.parse(readFileSync('public/test/bleach-roster.js','utf8').replace(/^export const roster = /,'').replace(/;\s*$/,''));
const source=readFileSync('public/test/soul-cursor.js','utf8');
const cellSource=source.slice(source.indexOf('function cell('),source.indexOf('function attackCell('));
const context=vm.createContext({sprite:{style:{setProperty(){}}},character:'ichigo',currentCell:-1,runURL:'run.webp',atlasURL:'atlas.webp',roster});
vm.runInContext(cellSource,context);
for(const name of ['ichigo','renji']) {
 context.character=name;context.currentCell=-1;
 for(let i=0;i<4;i++) {context.cell(i,true);assert.equal(context.sprite.style.backgroundSize,'200% 200%');assert.equal(context.sprite.style.backgroundPosition,`${i%2*100}% ${Math.floor(i/2)*100}%`);}
 context.cell(0);assert.equal(context.sprite.style.backgroundSize,'300% 300%');
}
for(const [id,entry] of Object.entries(roster)) {
 assert.ok(readFileSync('public/test/'+entry.atlas.slice(2)).length>1000,id+' atlas missing');
 context.character=id;context.currentCell=-1;context.cell(1,true);
 assert.equal(context.sprite.style.backgroundSize,entry.run?'200% 200%':'300% 300%',id+' run layout');
 if(!entry.run)assert.match(context.sprite.style.backgroundImage,/atlas.webp/);
}
const fireSource=source.slice(source.indexOf('function fire('),source.indexOf("// Fire on press:"));
let rendered=[];
const effects=vm.createContext({roster,x:50,y:50,facing:1,slashes:new Set(),
 document:{createElement:()=>({style:{},innerHTML:'',animate(){rendered.push(this.innerHTML);return {finished:Promise.resolve()};},remove(){}})},
 launchCharacterEffect:({character})=>roster[character].spriteEffect,field:{append(){}}
});
vm.runInContext(fireSource,effects);
for(const [id,entry] of Object.entries(roster)){
 effects.character=id;rendered=[];effects.fire(150,80);
 assert.equal(rendered.length,entry.spriteEffect?0:1,id+' effect mode');
 if(id==='rukia'&&!entry.spriteEffect)assert.match(rendered[0],/#a5e3f7/);
 if(id==='renji'&&!entry.spriteEffect)assert.match(rendered[0],/m15 82 12-22v22/);
}
console.log('PASS: all '+Object.keys(roster).length+' assets, run layouts and original/new effect routing');
// Exercise actual return, movement and rest code with a controlled frame clock.
const frames=new Map(),lifecycleHandlers={};let frameId=0;
const lifecycle=vm.createContext({
 ready:true,enabled:true,supported:()=>true,active:()=>!lifecycle.hidden,hidden:false,
 seen:true,parking:false,greeting:false,hovering:false,frame:0,lastTime:0,
 x:330,y:180,tx:400,ty:200,speed:0,stride:0,state:'run',facing:1,idleTimer:0,
 character:'ichigo',roster,innerWidth:1280,innerHeight:720,
 clear(){frames.clear();lifecycle.frame=0;lifecycle.speed=0;lifecycle.hovering=false;lifecycle.state='rest';},
 draw(){},pose(next){lifecycle.state=next;},cell(){},clearTimeout(){},setTimeout(){return 1;},
 requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId;},
 host:{classList:{add(){},contains(){return false;}}},
 document:{documentElement:{addEventListener(t,fn){lifecycleHandlers[t]=fn;}},addEventListener(t,fn){lifecycleHandlers[t]=fn;}},
 window:{addEventListener(t,fn){lifecycleHandlers[t]=fn;}},finePointer:{addEventListener(){}},calm:{addEventListener(){}}
});
vm.runInContext(source.slice(source.indexOf('function rest()'),source.indexOf('function park()')),lifecycle);
vm.runInContext(source.slice(source.indexOf('function wake()'),source.indexOf('function clear()')),lifecycle);
vm.runInContext(source.slice(source.indexOf('function returnToCorner()'),source.indexOf('label();loadCharacter(character,')),lifecycle);
let clock=0;
function step(){clock+=16;const batch=[...frames.values()];frames.clear();for(const fn of batch)fn(clock);}
for(const event of ['pointerleave','blur']){
 lifecycle.x=330;lifecycle.y=180;
 lifecycleHandlers[event]();
 assert.equal(lifecycle.x,330,event+' must preserve x');assert.equal(lifecycle.y,180,event+' must preserve y');
 step();assert.equal(lifecycle.state,'run');assert.ok(lifecycle.y>180 && lifecycle.y<684);
 lifecycle.rest();assert.equal(lifecycle.state,'rest','interruption mid-return cannot sit');
 for(let i=0;i<800 && frames.size;i++)step();
 assert.equal(lifecycle.state,'sit');assert.ok(Math.hypot(lifecycle.x-34,lifecycle.y-684)<=.5);
 assert.equal(frames.size,0,'arrival stops frame loop');
}
lifecycle.x=400;lifecycle.y=200;lifecycle.hidden=true;lifecycleHandlers.visibilitychange();
assert.equal(lifecycle.x,400);assert.equal(lifecycle.y,200);assert.equal(frames.size,0);
lifecycle.hidden=false;lifecycleHandlers.visibilitychange();step();assert.equal(lifecycle.state,'run');
// Re-entry changes the target as the pointer handler does, interrupting the return.
lifecycle.parking=false;lifecycle.tx=700;lifecycle.ty=200;
for(let i=0;i<800 && frames.size;i++)step();
assert.equal(lifecycle.state,'rest');assert.ok(lifecycle.x>600);
console.log('PASS: walk home on leave/blur, sit only on arrival, hidden-tab resume, pointer re-entry');
