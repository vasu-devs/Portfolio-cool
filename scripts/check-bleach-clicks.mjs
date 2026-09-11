import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createAttackQueue} from '../public/test/attack-queue.js';
const source=readFileSync('public/test/soul-cursor.js','utf8');
const handlers={},shots=[],cancelled=[];let now=0,nextId=0,timers=new Map();
const setTimer=(fn,ms)=>{const id=++nextId;timers.set(id,{fn,at:now+ms});return id;};
function advance(ms){const end=now+ms;for(;;){const first=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!first||first[1].at>end)break;timers.delete(first[0]);now=first[1].at;first[1].fn();}now=end;}
const scope=vm.createContext({createAttackQueue:options=>createAttackQueue({...options,setTimer,clearTimer:id=>timers.delete(id)}),pageAttacksEnabled:()=>true,active:()=>true,seen:true,greeting:false,frame:42,state:'run',idleTimer:0,reactionTimer:0,speed:190,parking:false,facing:1,x:50,y:80,tx:1000,ty:600,innerWidth:1280,innerHeight:720,
 cancelAnimationFrame:id=>cancelled.push(id),clearTimeout(){},setTimeout:setTimer,draw(){},pose(next){scope.state=next;},attackCell(){},fire(x,y){shots.push({x,y});},rest(){scope.state='rest';},armPark(){},wake(){},host:{classList:{add(){}}},greetingTimer:0,reply:{textContent:''},document:{addEventListener(type,fn,options){handlers[type]=fn;assert.equal(options.capture,true);}}});
vm.runInContext(source.slice(source.indexOf('const attackQueue='),source.indexOf('function label()')),scope);
vm.runInContext(source.slice(source.indexOf('function pageAttack('),source.indexOf("toggle.addEventListener('click'")),scope);
const event={button:0,detail:1,clientX:400,clientY:300,target:{closest:()=>false}};
handlers.pointerdown(event);
assert.equal(scope.state,'attack');assert.equal(scope.frame,0);assert.ok(cancelled.includes(42));assert.equal(scope.speed,0);
// Movement/drag may produce no click at all; the press must still release an attack.
advance(80);assert.equal(shots.length,1);
handlers.click(event);advance(300);assert.equal(shots.length,1,'mouse click must not duplicate pointerdown');
scope.state='run';scope.frame=43;
for(let i=0;i<4;i++){handlers.pointerdown({...event,clientX:500+i});scope.tx+=30;scope.ty+=20;advance(25);}
advance(1500);assert.deepEqual(shots.slice(1).map(s=>s.x),[500,501,502,503]);
handlers.click({...event,detail:0});advance(300);assert.equal(shots.length,6,'keyboard activation works');
scope.pageAttacksEnabled=()=>false;handlers.pointerdown(event);advance(300);assert.equal(shots.length,6);
scope.pageAttacksEnabled=()=>true;handlers.pointerdown({...event,button:2});handlers.pointerdown({...event,target:{closest:()=>true}});advance(300);assert.equal(shots.length,6);
const hitHandlers={};const direct=[];
vm.runInContext(source.slice(source.indexOf("hit.addEventListener('pointerdown'"),source.indexOf('function wake()')),vm.createContext({hit:{addEventListener(type,fn){hitHandlers[type]=fn;}},hovering:false,frame:7,cancelAnimationFrame(){},x:50,y:80,facing:1,requestAttack:(x,y)=>direct.push({x,y})}));
hitHandlers.pointerdown({button:0,stopPropagation(){}});assert.equal(direct.length,1);
hitHandlers.click({detail:1,stopPropagation(){}});assert.equal(direct.length,1);
hitHandlers.click({detail:0,stopPropagation(){}});assert.equal(direct.length,2);
console.log('PASS: running interruption, press without click, repeated moving presses, no duplicate mouse attacks, keyboard and direct companion input');
