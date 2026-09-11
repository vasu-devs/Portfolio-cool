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
const fireSource=source.slice(source.indexOf('function fire('),source.indexOf("document.addEventListener('click'"));
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
const settleSource=source.slice(source.indexOf('function settleInCorner('),source.indexOf("document.documentElement.addEventListener('pointerleave'"));
const visible=new Set();
const lifecycle=vm.createContext({
 ready:true,enabled:true,supported:()=>true,seen:false,parking:false,
 clear(){visible.clear();},corner:()=>({x:34,y:706}),draw(){},rest(){},
 host:{classList:{add:name=>visible.add(name)}}
});
vm.runInContext(settleSource,lifecycle);
lifecycle.settleInCorner();
assert.equal(lifecycle.seen,true);
assert.equal(lifecycle.parking,true);
assert.equal(lifecycle.x,34);assert.equal(lifecycle.y,706);
assert.ok(visible.has('is-visible'));
lifecycle.settleInCorner();
assert.ok(visible.has('is-visible'));
console.log('PASS: leaving the page settles visibly without animation frames');
