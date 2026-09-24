// Small, opt-in discoveries. No timers or animation run while idle.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const dialog = document.createElement('dialog');
dialog.className = 'paper-note';
dialog.setAttribute('aria-labelledby', 'paper-note-title');
dialog.innerHTML = `<button class="note-close" type="button" aria-label="Close paper note" autofocus>×</button><p class="note-kicker">A note in the margins</p><h2 id="paper-note-title"></h2><p class="note-copy"></p><div class="note-actions"><button type="button" class="note-next">Another note ↗</button><a href="/a-missing-piece">Find the missing piece</a></div><p class="note-foot">Made of paper. Built with code.</p>`;
document.body.append(dialog);
const notes = [
 ['Oh, hey. You found me.', 'The glasses are paper. The person behind them builds AI agents, voice tools, and software that does the work.'],
 ['A little orchestration.', 'One hand, a few moving pieces. The banner is a small nod to the systems I build: tools working together, with a human in the loop.'],
 ['Nothing here is an accident.', 'Sage paper, charcoal ink, cream edges, a little peach. The same materials run from the portrait to the page you get when a link goes missing.'],
 ['For the curious.', 'Close this note, then try ↑ ↑ ↓ ↓ ← → ← → on the page. There’s a tiny paper celebration tucked away.']
];
let note = 0, opener, celebrationTimer;
function renderNote() { dialog.querySelector('h2').textContent = notes[note][0]; dialog.querySelector('.note-copy').textContent = notes[note][1]; }
function openNote(event) { if(document.querySelector('dialog[open]')) return; opener = event.currentTarget; renderNote(); dialog.showModal(); }
dialog.querySelector('.note-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.note-next').addEventListener('click', () => { note = (note + 1) % notes.length; renderNote(); dialog.querySelector('h2').tabIndex = -1; dialog.querySelector('h2').focus(); });
dialog.addEventListener('close', () => opener?.focus({preventScroll:true}));
dialog.addEventListener('click', event => { if(event.target !== dialog) return; const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close(); });
const portrait = document.querySelector('.portrait-frame');
if(portrait) { const button=document.createElement('button');button.type='button';button.className='portrait-surprise';button.setAttribute('aria-label','A note from Vasu');button.setAttribute('aria-haspopup','dialog');button.title='A note from Vasu';portrait.before(button);button.append(portrait);button.addEventListener('click',openNote); }
const footer=document.querySelector('.footer-bottom');
if(footer) { const button=document.createElement('button');button.type='button';button.className='paper-colophon';button.textContent='Behind the paper ↗';button.setAttribute('aria-haspopup','dialog');button.addEventListener('click',openNote);footer.append(button); }
// Return within the current section instead of unexpectedly switching to Home.
const topLink=footer?.querySelector('a[data-page="home"]');
if(topLink) { const button=document.createElement('button');button.type='button';button.className='paper-back-top';button.innerHTML='Back to top <span aria-hidden="true">↑</span>';topLink.replaceWith(button);button.addEventListener('click',()=>{const target=document.querySelector('[data-panel]:not([hidden]) h1,[data-panel]:not([hidden]) h2');if(target){target.tabIndex=-1;target.focus({preventScroll:true})}window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});}); }
const status=document.createElement('p');status.className='sr-only';status.setAttribute('role','status');document.body.append(status);
let sequence=[],lastKey=0;
const secret=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
document.addEventListener('keydown',event=>{
 if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||event.repeat||event.isComposing||document.querySelector('.keyboard-guide input')?.checked===false||document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,button,a,[contenteditable],[tabindex],[role="slider"],[role="grid"]'))return;
 if(performance.now()-lastKey>1800)sequence=[];lastKey=performance.now();sequence.push(event.key);sequence=sequence.slice(-secret.length);
 if(!secret.every((key,i)=>sequence[i]===key))return;
 sequence=[];status.textContent='You found the paper trail. Thanks for exploring.';
 document.querySelector('.paper-celebration')?.remove();clearTimeout(celebrationTimer);
 const flourish=document.createElement('div');flourish.className='paper-celebration';flourish.setAttribute('aria-hidden','true');
 const label=document.createElement('span');label.textContent='You found the paper trail.';flourish.append(label);
 if(!reduced.matches)for(let i=0;i<12;i++){const piece=document.createElement('i');piece.style.setProperty('--x',`${(i-5.5)*24}px`);piece.style.setProperty('--r',`${(i%2?1:-1)*(35+i*17)}deg`);piece.style.setProperty('--delay',`${i*18}ms`);flourish.append(piece)}
 document.body.append(flourish);celebrationTimer=setTimeout(()=>flourish.remove(),2600);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){document.querySelector('.paper-celebration')?.remove();clearTimeout(celebrationTimer);sequence=[]}});
