// Fixed-size page thumb; wheel, touch and keyboard scrolling remain native.
const thumb=document.createElement('div');thumb.className='page-scroll-dot';thumb.setAttribute('aria-hidden','true');document.body.append(thumb);
let drag=null,frame=0;
const metrics=()=>({max:Math.max(0,document.documentElement.scrollHeight-innerHeight),travel:Math.max(1,innerHeight-30)});
function paint(){frame=0;const {max,travel}=metrics();const hide=!max||!!document.querySelector('dialog[open]');if(thumb.hidden!==hide)thumb.hidden=hide;if(!thumb.hidden)thumb.style.transform=`translateY(${8+Math.min(1,Math.max(0,scrollY/max))*travel}px)`;}
function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
thumb.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={y:e.clientY,scroll:scrollY};thumb.setPointerCapture(e.pointerId);e.preventDefault();});
thumb.addEventListener('pointermove',e=>{if(!drag)return;const {max,travel}=metrics();scrollTo({top:drag.scroll+(e.clientY-drag.y)/travel*max,behavior:'instant'});});
const release=()=>{drag=null;};thumb.addEventListener('pointerup',release);thumb.addEventListener('pointercancel',release);thumb.addEventListener('lostpointercapture',release);
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);new ResizeObserver(schedule).observe(document.body);
new MutationObserver(schedule).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open','hidden']});
document.documentElement.classList.add('tiny-page-scroll');paint();
