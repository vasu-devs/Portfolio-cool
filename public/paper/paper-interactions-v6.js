import {keySound} from './key-sound.js';
import './activity-interactions.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),finePointer=matchMedia('(hover: hover) and (pointer: fine)'),toggle=document.querySelector('.sound-toggle');
const sound=kind=>keySound(kind==='paper'?'open':kind==='close'?'close':'click');
const controls='a[href],button,summary';
document.addEventListener('click',event=>{const target=event.target.closest(controls);if(!target||target===toggle||target.closest('.sound-toggle,.sound-test')||target.disabled||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
 const opens=target.matches('.proj-open,[data-open-contact],[data-open]')||target.closest('details.role')||target.matches('a[href^="#project-"],a[href="/resume.html"],.keyboard-help');
 const closing=target.closest('dialog')&&/close/i.test(target.getAttribute('aria-label')||target.textContent);
 if(!opens&&!closing&&!target.closest('.navigation,.graph-day-controls'))void sound('tap');
 if(!reduced.matches&&target.matches('button,.social-icon-row a,.contact-utilities a,.icon-action'))target.animate([{scale:'1'},{scale:'.95'},{scale:'1'}],{duration:190,easing:'ease-out'});
},true);
// Keyboard activation and native dialog closes get the same feedback as pointer use.

const observer=new MutationObserver(records=>{for(const record of records){const el=record.target;if(el.matches('dialog')){if(el.open){void sound('paper');if(!reduced.matches)el.animate([{opacity:0,transform:'translateY(9px) rotate(-.35deg) scale(.99)'},{opacity:1,transform:'none'}],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)'})}else void sound('close')}
 else if(el.matches('[data-panel]')&&!el.hidden){void sound('paper');if(!reduced.matches)el.animate([{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'})}}});
document.querySelectorAll('dialog,[data-panel]').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['open','hidden']}));
// Project paper lifts by at most two degrees; only the artwork moves, so links stay stable.
for(const card of document.querySelectorAll('.selected-item,.proj')){const art=card.querySelector('.paper-cover');if(!art)continue;let frame=0;const reset=()=>{cancelAnimationFrame(frame);art.style.removeProperty('transform');art.classList.remove('is-tilting')};card.addEventListener('pointermove',event=>{if(reduced.matches||!finePointer.matches||event.pointerType==='touch')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;art.classList.add('is-tilting');art.style.transform=`perspective(700px) rotateX(${-y*3}deg) rotateY(${x*4}deg) translateY(-2px)`})});card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);reduced.addEventListener('change',reset)}
reduced.addEventListener('change',()=>{if(reduced.matches)document.getAnimations().forEach(a=>a.cancel())});
