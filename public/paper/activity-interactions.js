import {keySound} from './key-sound.js';
const graph=document.querySelector('.github-activity>svg');
if(graph){
 const cells=[...graph.querySelectorAll('rect')].filter(e=>e.querySelector('title'));
 const output=document.createElement('div');output.className='graph-readout';output.setAttribute('aria-live','off');output.innerHTML='<span class="graph-readout-dot" aria-hidden="true"></span><span class="graph-readout-text">Explore a day</span><span class="graph-readout-hint">Hover · arrow keys</span>';graph.after(output);
 const help=document.createElement('span');help.id='graph-keyboard-help';help.className='sr-only';help.textContent='Use arrow keys to explore days; left and right move one week. Home and End move to the first and last day.';graph.after(help);graph.setAttribute('role','group');graph.setAttribute('aria-describedby',help.id);
 let current=-1,tabbable=0;
 const fmt=new Intl.DateTimeFormat('en',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
 cells.forEach((cell,i)=>{const title=cell.querySelector('title'),label=title.textContent;cell.dataset.detail=label;cell.dataset.level=cell.getAttribute('fill').match(/heat-(\d)/)?.[1]||'0';cell.setAttribute('tabindex',i===0?'0':'-1');cell.setAttribute('role','img');cell.setAttribute('aria-label',label);title.remove();
  function inspect(keyboard=false){if(current===i)return;cells[current]?.classList.remove('is-active');cells[tabbable].setAttribute('tabindex','-1');cell.setAttribute('tabindex','0');tabbable=i;current=i;cell.classList.add('is-active');const parts=label.match(/(\d{4}-\d{2}-\d{2}):\s*(\d+)/);output.setAttribute('aria-live',keyboard?'polite':'off');output.querySelector('.graph-readout-text').textContent=parts?`${fmt.format(new Date(parts[1]+'T12:00:00Z'))} · ${parts[2]} contributions`:label;output.style.setProperty('--day-color',`var(--heat-${cell.dataset.level})`);const r=cell.getBoundingClientRect();void keySound('graph',Number(cell.dataset.level),r.x+r.width/2)}
  cell.addEventListener('pointerenter',()=>inspect());cell.addEventListener('pointerdown',()=>{if(current===i)current=-1;inspect()});cell.addEventListener('focus',()=>inspect(true));
  cell.addEventListener('keydown',event=>{const moves={ArrowRight:7,ArrowLeft:-7,ArrowDown:1,ArrowUp:-1};let next;if(event.key in moves)next=Math.max(0,Math.min(cells.length-1,i+moves[event.key]));else if(event.key==='Home')next=0;else if(event.key==='End')next=cells.length-1;else return;event.preventDefault();event.stopPropagation();cells[next].focus({preventScroll:true})});
 });
 graph.addEventListener('pointerleave',()=>{cells[current]?.classList.remove('is-active');current=-1});
}
