const screen = document.querySelector('.portfolio-opening');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const animations = [];
let timer;
function finish() {
 clearTimeout(timer);
 for (const animation of animations) animation.cancel();
 screen?.remove();
}
async function start() {
 if (!screen || reduced.matches || (location.hash && location.hash !== '#home') || scrollY > 80) { finish(); return; }
 timer = setTimeout(finish, 3500);
 try {
  const easing = 'cubic-bezier(.87,0,.13,1)';
  for (const [selector, direction] of [['.opening-top', 1], ['.opening-bottom', -1]]) {
   const shutter = screen.querySelector(selector);
   animations.push(shutter.querySelector('strong').animate([
    {transform:`translateY(${direction * 105}%)`},
    {transform:'translateY(0)',offset:.32},
    {transform:'translateY(0)',offset:.48},
    {transform:`translateY(${direction * 45}%)`}
   ], {duration:2500,easing:'linear',fill:'both'}));
   animations.push(shutter.animate([
    {transform:'translateY(0)'},
    {transform:`translateY(${direction * -101}%)`}
   ], {duration:1500,delay:1000,easing,fill:'both'}));
  }
  await Promise.all(animations.map(animation => animation.finished));
 } catch {} finally { finish(); }
}
for (const event of ['pointerdown','wheel','keydown','resize','pagehide']) window.addEventListener(event,finish,{once:true,passive:true});
reduced.addEventListener('change',finish,{once:true});
start();
