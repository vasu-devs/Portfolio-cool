import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('public/test/soul-cursor.js','utf8');
const pending=new Map();let entrances=0,decodes=0;
const ctx=vm.createContext({
 Image:class {decode(){decodes++;return new Promise((resolve,reject)=>pending.set(this.src,{resolve,reject}));}},
 URL,roster:{ichigo:{atlas:'./ichigo.webp',run:true},rukia:{atlas:'./rukia.webp'},renji:{atlas:'./renji.webp'}},
 character:'ichigo',characterRequest:0,atlasURL:'',runURL:'',currentCell:-1,ready:false,seen:false,
 select:{value:'ichigo',addEventListener(){}},preloadCharacterEffect:()=>new Promise(()=>{}),
 clear(){},host:{querySelector(){return null;},classList:{remove(){},add(){}}},cell(){},
 localStorage:{setItem(){}},label(){},active:()=>true,draw(){},park(){},
 characterEntrance(){entrances++;return new Promise(()=>{});}
});
vm.runInContext(source.slice(source.indexOf('const characterAssets='),source.indexOf('\nselect.value=character;')).replaceAll('import.meta.url',"'https://example.test/test/soul-cursor.js'"),ctx);
function resolveArt(file){pending.get('https://example.test/test/'+file).resolve();}
const first=ctx.loadCharacter('ichigo');
assert.equal(pending.size,2,'atlas and run start concurrently');
resolveArt('ichigo.webp');resolveArt('sprites/ichigo-run.webp');await first;
assert.equal(ctx.character,'ichigo');assert.equal(entrances,1,'selection starts its entrance without waiting for entrance or effect');
const before=decodes;ctx.loadCharacter('ichigo');assert.equal(decodes,before,'cached selection does not decode again');
const slow=ctx.loadCharacter('rukia');const latest=ctx.loadCharacter('renji');
resolveArt('renji.webp');await latest;resolveArt('rukia.webp');await slow;
assert.equal(ctx.character,'renji','late load cannot replace latest choice');
ctx.loadCharacter('ichigo');assert.equal(ctx.character,'ichigo','ready cached selection applies synchronously');
const failed=ctx.loadCharacter('rukia');await failed;
console.log('PASS: parallel sprite loading, cached immediate switch, nonblocking effects and latest selection wins');
