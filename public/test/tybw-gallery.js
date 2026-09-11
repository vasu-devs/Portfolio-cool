import {createAttackQueue} from './attack-queue.js?v=likeness-24';
import {launchCharacterEffect,preloadCharacterEffect} from './bleach-effects.js?v=likeness-24';
import {roster} from './bleach-roster.js?v=likeness-24';
const cast=document.querySelector('#cast'),status=document.querySelector('#status');
const timers=new Set(),resets=[];
function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;}
function save(key,value){try{localStorage.setItem(key,value);return true;}catch{status.textContent='Your browser could not save this choice.';return false;}}
for(const [id,entry] of Object.entries(roster)){
 const card=document.createElement('article');card.className='card';
 const stage=document.createElement('div');stage.className='stage';
 const actor=document.createElement('div');actor.className='actor';actor.style.backgroundImage=`url("${entry.atlas}")`;actor.setAttribute('role','img');actor.setAttribute('aria-label',entry.name+' standing');stage.append(actor);
 const h=document.createElement('h3');h.textContent=entry.name;
 const form=document.createElement('small');form.textContent=entry.form;
 const technique=document.createElement('p');technique.textContent=entry.technique;
 const actions=document.createElement('div');actions.className='actions';
 const attack=document.createElement('button');attack.type='button';attack.textContent=id==='orihime'?'Shield':'Attack';attack.setAttribute('aria-label','Preview '+entry.name+' ability');
 const rest=document.createElement('button');rest.type='button';rest.textContent='Rest';rest.setAttribute('aria-label','Preview '+entry.name+' resting');
 const use=document.createElement('button');use.type='button';use.textContent='Choose';use.setAttribute('aria-label','Choose '+entry.name);
 let busy=false,resting=false;const slashes=new Set();
 const effectField=document.createElement('div');effectField.className='preview-effects';stage.append(effectField);
 function frame(i){actor.style.backgroundPosition=`${i%3*50}% ${Math.floor(i/3)*50}%`;}
 const queue=createAttackQueue({available:()=>!document.hidden,
 start:()=>{busy=true;resting=false;frame(6);actor.setAttribute('aria-label',entry.name+' using '+entry.technique);},
 release:()=>{frame(7);launchCharacterEffect({character:id,field:effectField,x:20,y:75,targetX:stage.clientWidth-25,targetY:75,slashes});},
 recover:()=>frame(8),finish:()=>{frame(0);busy=false;actor.setAttribute('aria-label',entry.name+' standing');}
 });
 preloadCharacterEffect(id);
 attack.addEventListener('click',async()=>{await preloadCharacterEffect(id);queue.push({});});
 rest.addEventListener('click',()=>{if(busy)return;resting=!resting;frame(resting?5:0);actor.setAttribute('aria-label',entry.name+(resting?' sleeping':' standing'));});
 use.addEventListener('click',()=>{if(save('vasu-bleach-character',id)&&save('vasu-soul-cursor','on'))location.href='./#home';});
 resets.push(()=>{queue.cancel();for(const item of slashes){item.animation.cancel();item.node.remove();}slashes.clear();busy=false;resting=false;attack.disabled=false;frame(0);actor.setAttribute('aria-label',entry.name+' standing');});
 actions.append(attack,rest,use);card.append(stage,h,form,technique,actions);cast.append(card);
}
for(const button of document.querySelectorAll('[data-avatar]'))button.addEventListener('click',()=>{if(save('vasu-tybw-avatar',button.dataset.avatar))location.href='./#home';});
document.querySelector('#original-avatars').addEventListener('click',()=>{if(save('vasu-tybw-avatar','original'))location.href='./#home';});
window.addEventListener('pagehide',()=>{for(const timer of timers)clearTimeout(timer);timers.clear();for(const reset of resets)reset();});
