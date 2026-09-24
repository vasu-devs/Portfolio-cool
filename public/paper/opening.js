// A short welcome, not a loading gate. Content is usable while this plays.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const navigation=performance.getEntriesByType('navigation')[0];
 if(reduced.matches||document.hidden||(location.hash&&location.hash!=='#home')||navigation?.type==='back_forward')return;
 try{if(sessionStorage.getItem('vasu-paper-welcome-v2'))return;sessionStorage.setItem('vasu-paper-welcome-v2','seen')}catch{}
 const scene=document.createElement('div');scene.id='paper-opening';
 scene.innerHTML='<div class="opening-shutter opening-shutter-top" aria-hidden="true"><div class="opening-word-mask"><span class="opening-word">VASU</span></div></div><div class="opening-shutter opening-shutter-bottom" aria-hidden="true"><div class="opening-word-mask"><span class="opening-word">DEVS</span></div></div><button type="button" class="opening-skip" aria-label="Skip opening animation">Skip intro <span aria-hidden="true">↗</span></button>';
 document.body.prepend(scene);
 // Failed or blocked CSS must never leave an unstyled scene in the document.
 if(getComputedStyle(scene).position!=='fixed'){scene.remove();return}
 let finished=false;
 const finish=()=>{
  if(finished)return;finished=true;clearTimeout(timer);
  const hadFocus=scene.contains(document.activeElement);scene.remove();
  for(const type of ['pointerdown','keydown','wheel','touchmove'])document.removeEventListener(type,interact,true);
  document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',finish);reduced.removeEventListener('change',finish);
  if(hadFocus){const target=document.querySelector('#main');if(target){const old=target.getAttribute('tabindex');target.tabIndex=-1;target.focus({preventScroll:true});if(old===null)target.removeAttribute('tabindex');else target.setAttribute('tabindex',old)}}
 };
 // Keep the actual skip button alive through its native click/keyboard activation.
 const interact=event=>{if(event.target.closest?.('.opening-skip')&&event.type!=='wheel')return;finish()};
 const hidden=()=>{if(document.hidden)finish()};
 const timer=setTimeout(finish,2750);
 scene.querySelector('button').addEventListener('click',finish);
 scene.addEventListener('animationend',event=>{if(event.animationName==='paper-shutter-down')finish()});
 for(const type of ['pointerdown','keydown','wheel','touchmove'])document.addEventListener(type,interact,{capture:true,passive:true});
 document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',finish);reduced.addEventListener('change',finish);
})();
