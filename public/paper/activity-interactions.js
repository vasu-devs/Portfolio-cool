import {keySound} from './key-sound.js';
const graph=document.querySelector('.github-activity>svg');
if(graph){
 const cells=[...graph.querySelectorAll('rect')].filter(e=>e.querySelector('title'));
 const scroller=document.createElement('div');scroller.className='graph-scroll';scroller.setAttribute('role','region');scroller.setAttribute('aria-label','GitHub contribution calendar');graph.before(scroller);scroller.append(graph);
 const output=document.createElement('div');output.className='graph-readout';output.setAttribute('aria-live','off');output.innerHTML='<span class="graph-readout-dot" aria-hidden="true"></span><span class="graph-readout-text">Explore a day</span><span class="graph-readout-hint"></span>';scroller.after(output);
 const buttons=document.createElement('div');buttons.className='graph-day-controls';buttons.innerHTML='<button type="button" aria-label="Previous contribution day">← Previous day</button><button type="button" aria-label="Next contribution day">Next day →</button>';output.after(buttons);
 const [previous,next]=buttons.children;
 const help=document.createElement('span');help.id='graph-keyboard-help';help.className='sr-only';help.textContent='Swipe to explore the calendar, tap a day, or use the previous and next day buttons. With a keyboard, arrow keys explore days; left and right move one week. Home and End move to the first and last day.';buttons.after(help);graph.setAttribute('role','group');graph.setAttribute('aria-describedby',help.id);
 let current=-1,tabbable=0;
 const fmt=new Intl.DateTimeFormat('en',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
 function inspect(i,{announce=false,sound=true,reveal=false}={}){
  if(!cells[i])return;
  const changed=current!==i;cells[current]?.classList.remove('is-active');cells[tabbable].setAttribute('tabindex','-1');const cell=cells[i];cell.setAttribute('tabindex','0');tabbable=current=i;cell.classList.add('is-active');
  const label=cell.dataset.detail,parts=label.match(/(\d{4}-\d{2}-\d{2}):\s*(\d+)/);output.setAttribute('aria-live',announce?'polite':'off');output.querySelector('.graph-readout-text').textContent=parts?`${fmt.format(new Date(parts[1]+'T12:00:00Z'))} · ${parts[2]} contributions`:label;output.style.setProperty('--day-color',`var(--heat-${cell.dataset.level})`);
  previous.disabled=i===0;next.disabled=i===cells.length-1;
  const r=cell.getBoundingClientRect();if(reveal){const box=scroller.getBoundingClientRect();if(r.left<box.left||r.right>box.right)scroller.scrollLeft+=r.left-box.left-scroller.clientWidth/2}
  if(sound&&changed)void keySound('graph',Number(cell.dataset.level),r.x+r.width/2);
 }
 cells.forEach((cell,i)=>{
  const title=cell.querySelector('title'),label=title.textContent;cell.dataset.detail=label;cell.dataset.level=cell.getAttribute('fill').match(/heat-(\d)/)?.[1]||'0';cell.setAttribute('tabindex',i===0?'0':'-1');cell.setAttribute('role','img');cell.setAttribute('aria-label',label);title.remove();
  // Touch inspection commits on a tap, so dragging does not play a stream of sounds.
  cell.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')inspect(i)});
  cell.addEventListener('click',()=>inspect(i,{announce:true}));
  cell.addEventListener('focus',()=>{if(cell.matches(':focus-visible'))inspect(i,{announce:true,reveal:true})});
  cell.addEventListener('keydown',event=>{const moves={ArrowRight:7,ArrowLeft:-7,ArrowDown:1,ArrowUp:-1};let target;if(event.key in moves)target=Math.max(0,Math.min(cells.length-1,i+moves[event.key]));else if(event.key==='Home')target=0;else if(event.key==='End')target=cells.length-1;else return;event.preventDefault();event.stopPropagation();cells[target].focus({preventScroll:true})});
 });
 previous.addEventListener('click',()=>inspect(Math.max(0,(current<0?cells.length-1:current)-1),{announce:true,reveal:true}));
 next.addEventListener('click',()=>inspect(Math.min(cells.length-1,(current<0?cells.length-2:current)+1),{announce:true,reveal:true}));
 graph.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch'){cells[current]?.classList.remove('is-active');current=-1}});
 const phone=matchMedia('(max-width:600px), (max-width:900px) and (max-height:500px)'),touch=matchMedia('(hover:none) and (pointer:coarse)');
 function layout(){output.querySelector('.graph-readout-hint').textContent=phone.matches?'Swipe · tap a day':touch.matches?'Tap a day':'Hover · arrow keys';if(phone.matches)requestAnimationFrame(()=>{scroller.scrollLeft=scroller.scrollWidth;inspect(cells.length-1,{sound:false})})}
 phone.addEventListener('change',layout);layout();
 // Keep the selected day in view after rotation or a direct #projects entry.
 let lastWidth=0;new ResizeObserver(()=>{const width=scroller.clientWidth;if(phone.matches&&width&&width!==lastWidth){lastWidth=width;inspect(current<0?cells.length-1:current,{sound:false,reveal:true})}}).observe(scroller);
}
