// A short welcome, not a loading gate. Content is usable while this plays.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const navigation=performance.getEntriesByType('navigation')[0];
 if(reduced.matches||document.hidden||(location.hash&&location.hash!=='#home')||navigation?.type==='back_forward')return;
 try{if(sessionStorage.getItem('vasu-paper-welcome-v3'))return;sessionStorage.setItem('vasu-paper-welcome-v3','seen')}catch{}
 const scene=document.createElement('div');scene.id='paper-opening';
 scene.innerHTML='<div class="opening-shutter opening-shutter-top" aria-hidden="true"><div class="opening-word-mask"><span class="opening-word">VASU</span></div></div><div class="opening-shutter opening-shutter-bottom" aria-hidden="true"><div class="opening-word-mask"><span class="opening-word">DEVS</span></div></div><button type="button" class="opening-skip" aria-label="Skip opening animation">Skip intro <span aria-hidden="true">↗</span></button>';
 scene.insertAdjacentHTML('afterbegin','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><filter id="opening-paper-grain" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".58" numOctaves="2" seed="8" result="grain"/><feColorMatrix in="grain" type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".28" intercept=".72"/><feFuncG type="linear" slope=".28" intercept=".72"/><feFuncB type="linear" slope=".28" intercept=".72"/></feComponentTransfer><feBlend in2="SourceGraphic" mode="multiply"/><feComposite in2="SourceAlpha" operator="in" result="paper"/><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="12" result="edge"/><feDisplacementMap in="paper" in2="edge" scale="1.1" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>');
 // Each glyph is its own little paper piece; the word keeps its original motion.
 for(const word of scene.querySelectorAll('.opening-word')){const letters=word.textContent;word.textContent='';for(const letter of letters){const piece=document.createElement('span');piece.className='opening-letter';piece.textContent=letter;word.append(piece)}}
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
