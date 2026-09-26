// Keep the useful section-local back-to-top behavior; hidden Easter eggs removed.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const footer=document.querySelector('.footer-bottom');
// Return within the current section instead of unexpectedly switching to Home.
const topLink=footer?.querySelector('a[data-page="home"]');
if(topLink) { const button=document.createElement('button');button.type='button';button.className='paper-back-top';button.innerHTML='Back to top <span aria-hidden="true">↑</span>';topLink.replaceWith(button);button.addEventListener('click',()=>{const target=document.querySelector('[data-panel]:not([hidden]) h1,[data-panel]:not([hidden]) h2');if(target){target.tabIndex=-1;target.focus({preventScroll:true})}window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});}); }
