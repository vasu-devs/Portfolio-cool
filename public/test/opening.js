const screen = document.querySelector('.portfolio-opening');
const title = screen?.querySelector('strong');
const heading = document.querySelector('.identity h1');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const animations = [];
let timer;
function finish() {
 clearTimeout(timer);
 animations.forEach(animation => animation.cancel());
 screen?.remove();
 heading?.style.removeProperty('visibility');
}
async function start() {
 if (!screen || !title || !heading || reduce.matches || (location.hash && location.hash !== '#home') || scrollY > 80) { finish(); return; }
 timer = setTimeout(finish, 4000);
 try {
  await Promise.race([document.fonts.load('48px "Bleach Display"'), new Promise(resolve => setTimeout(resolve, 350))]);
  if (!screen.isConnected) return;
  const target = heading.getBoundingClientRect();
  if (!target.width || target.bottom < 0) { finish(); return; }
  const style = getComputedStyle(heading);
  Object.assign(title.style, {fontFamily:style.fontFamily,fontSize:style.fontSize,letterSpacing:style.letterSpacing,lineHeight:style.lineHeight,left:target.left+'px',top:target.top+'px'});
  const box = title.getBoundingClientRect();
  const scale = Math.min(innerWidth * .82 / box.width, 3.2);
  const x = (innerWidth - box.width * scale) / 2 - box.left;
  const y = innerHeight * .44 - box.top;
  heading.style.visibility = 'hidden';
  const motion = title.animate([
   {transform:`translate(${x}px,${y+24}px) scale(${scale})`,opacity:0,offset:0},
   {transform:`translate(${x}px,${y}px) scale(${scale})`,opacity:1,offset:.2},
   {transform:`translate(${x}px,${y}px) scale(${scale})`,opacity:1,offset:.43},
   {transform:'translate(0,0) scale(1)',opacity:1,offset:1}
  ],{duration:2100,easing:'cubic-bezier(.65,0,.2,1)',fill:'both'});
  animations.push(motion);
  animations.push(screen.querySelector('.opening-landscape').animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:1100,delay:900,easing:'cubic-bezier(.65,0,.2,1)',fill:'both'}));
  animations.push(screen.querySelector('.opening-caption').animate([{opacity:0,transform:'translateY(10px)'},{opacity:.65,transform:'translateY(0)',offset:.3},{opacity:0,transform:'translateY(-10px)'}],{duration:1100,fill:'both'}));
  await motion.finished;
 } catch {} finally { finish(); }
}
for (const event of ['pointerdown','wheel','keydown','resize','pagehide']) window.addEventListener(event,finish,{once:true,passive:true});
reduce.addEventListener('change',finish,{once:true});
start();
