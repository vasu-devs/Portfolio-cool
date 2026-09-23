// Recorded, softly mastered foley. See assets/foley/provenance.json.
let enabled=true;try{enabled=localStorage.getItem('vasu-paper-sound')!=='off'}catch{}
let ctx,master,analyser,bank,loading,unlocked=false,lastQuiet=-Infinity,lastAction=-Infinity;
let quietUntil=0,epoch=0;
const voices=new Set(),bags={},previous={},targetTimes=new WeakMap();
const families=['hover','press','open','close'];
const files=Promise.all(families.map(async family=>[family,await Promise.all(Array.from({length:6},async(_,i)=>{
 const response=await fetch(`/paper/assets/foley/${family}-${i}.wav`);if(!response.ok)throw Error('Sound sample unavailable');return response.arrayBuffer();
}))])).catch(()=>null);
const button=document.createElement('button');button.type='button';button.className='sound-toggle';
button.innerHTML='<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path fill="#e6c5a8" d="M4 9h4l5-4v14l-5-4H4Z"/><path class="sound-waves" d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="sound-slash" d="m16 9 5 6m0-6-5 6"/></svg><span>Sound</span>';
document.querySelector('.navigation').append(button);
function sync(){const active=enabled&&ctx?.state==='running'&&!!bank;button.dataset.enabled=String(enabled);button.dataset.audioState=ctx?.state||'inactive';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Mute keyboard sounds':'Enable keyboard sounds');button.querySelector('span').textContent=enabled?'Sound on':'Sound off';button.title=enabled?(active?'Soft key sounds on · click to mute':'Sound on · starts with your first tap or key press'):'Soft key sounds off · click to enable'}sync();
function fade(voice){if(voice.stopping)return;voice.stopping=true;const t=ctx.currentTime;voice.gain.gain.cancelScheduledValues(t);voice.gain.gain.setValueAtTime(voice.gain.gain.value,t);voice.gain.gain.linearRampToValueAtTime(0,t+.012);try{voice.source.stop(t+.015)}catch{}}
function stop(){epoch++;for(const voice of voices)fade(voice)}
async function ready(){if(!enabled||!unlocked||document.hidden)return false;try{
 if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;ctx=new Audio({latencyHint:'interactive'});master=ctx.createGain();master.gain.value=.9;
 const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-10;limiter.knee.value=10;limiter.ratio.value=3;limiter.attack.value=.003;limiter.release.value=.1;
 analyser=ctx.createAnalyser();analyser.fftSize=2048;master.connect(limiter);limiter.connect(analyser);analyser.connect(ctx.destination);ctx.addEventListener('statechange',sync)}
 if(ctx.state==='suspended')await ctx.resume();
 if(!loading)loading=files.then(async data=>data?Object.fromEntries(await Promise.all(data.map(async([family,bytes])=>[family,await Promise.all(bytes.map(b=>ctx.decodeAudioData(b)))]))):null);
 bank=await loading;sync();return enabled&&!document.hidden&&!!bank&&ctx.state==='running';
 }catch(error){button.dataset.audioState='error';button.title='Sound unavailable: '+error.message;return false}}
function choose(family){
 if(!bags[family]?.length){const bag=[0,1,2,3,4,5];for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}if(bag.at(-1)===previous[family])[bag[0],bag[5]]=[bag[5],bag[0]];bags[family]=bag}
 return previous[family]=bags[family].pop();
}
export async function keySound(kind='click',level=2,x=innerWidth/2){
 if(!enabled||!unlocked||document.hidden||document.querySelector('.film-modal[open],.detail-modal[open] iframe'))return;
 const stamp=performance.now(),token=epoch,quiet=kind==='hover'||kind==='graph';
 if(quiet&&(stamp<quietUntil||stamp-lastQuiet<28))return;
 // Hot audio starts in this event, without a timer or an async readiness round trip.
 // Cold hovers are discarded, never replayed after the pointer has moved away.
 if(!bank||ctx?.state!=='running'){
  if(quiet){void ready();return}
  if(!await ready()||token!==epoch)return;
 }
 const now=performance.now();
 if(quiet&&(now<quietUntil||now-lastQuiet<28))return;
 if(!quiet&&now-lastAction<100)return;
 const spacing=now-lastQuiet;
 if(quiet){lastQuiet=now}else{lastAction=now;quietUntil=now+45;for(const v of voices)if(v.quiet)fade(v)}
 const active=[...voices].filter(v=>!v.stopping);if(active.length>=2)fade(active[0]);
 const family=quiet?'hover':kind==='open'?'open':kind==='close'?'close':'press',variant=choose(family);
 const source=ctx.createBufferSource(),gain=ctx.createGain(),pan=ctx.createStereoPanner();source.buffer=bank[family][variant];
 const depth=Math.max(0,Math.min(4,Number(level)||0));
 source.playbackRate.value=kind==='graph'?1.04-depth*.035:family==='hover'?.98:family==='press'?.88:family==='open'?.92:1.02;
 gain.gain.value=kind==='graph'?.60+depth*.095:family==='hover'?.8:family==='press'?1.1:family==='open'?.95:.9;
 // A fast sweep stays responsive; reduce accumulation instead of dropping a second of events.
 if(quiet&&spacing<100)gain.gain.value*=.78;
 pan.pan.value=Math.max(-.08,Math.min(.08,(x/innerWidth-.5)*.16));source.connect(gain);gain.connect(pan);pan.connect(master);
 const voice={source,gain,quiet};voices.add(voice);source.onended=()=>{voices.delete(voice);source.disconnect();gain.disconnect();pan.disconnect()};source.start();
 button.dataset.lastSound=family;button.dataset.lastVariant=String(variant);
}
function activate(event){if(!event.isTrusted||event.ctrlKey||event.metaKey||event.altKey||event.target.closest('.sound-toggle,.sound-test'))return;unlocked=true;if(enabled)void ready()}
document.addEventListener('pointerdown',activate,{capture:true,passive:true});
document.addEventListener('keydown',activate,{capture:true});
button.addEventListener('click',async()=>{unlocked=true;enabled=!enabled;try{localStorage.setItem('vasu-paper-sound',enabled?'on':'off')}catch{}
 sync();if(enabled){lastAction=-Infinity;await keySound('click')}else stop();sync()});
const test=document.createElement('button');test.type='button';test.className='sound-test';test.textContent='Test sound';test.setAttribute('aria-label','Test keyboard sounds');document.querySelector('.footer-bottom').append(test);
const status=document.createElement('span');status.className='sound-test-status';status.setAttribute('role','status');test.after(status);
test.addEventListener('click',async()=>{enabled=true;unlocked=true;try{localStorage.setItem('vasu-paper-sound','on')}catch{}lastAction=-Infinity;await keySound('click');sync();status.textContent=ctx?.state==='running'&&bank?'Playing test…':'Sound could not start — try again';if(!analyser)return;let peak=0;for(const delay of [15,40,80,160])setTimeout(()=>{const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);for(const v of data)peak=Math.max(peak,Math.abs(v));test.dataset.outputPeak=String(peak);if(delay===160)status.textContent=peak>.001?'Test played':'No audio output — try again'},delay)});
const hoverTargets='a[href],button,summary,.skill,.tech';
function hover(target,x){const now=performance.now();if(now-(targetTimes.get(target)??-Infinity)<80)return;targetTimes.set(target,now);void keySound('hover',2,x)}
document.addEventListener('pointerover',event=>{if(event.pointerType!=='mouse'||!matchMedia('(hover:hover)').matches)return;const target=event.target.closest(hoverTargets);if(!target||target.closest('.sound-toggle,.sound-test')||target.disabled||target.contains(event.relatedTarget))return;hover(target,event.clientX)});
document.addEventListener('focusin',event=>{if(event.target.matches(':focus-visible')&&event.target.closest(hoverTargets)&&!event.target.closest('.sound-toggle,.sound-test'))hover(event.target,innerWidth/2)});
// Scrolling does not mute pointer feedback. Only entering an actual target plays sound.
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();if(ctx?.state==='running')void ctx.suspend().catch(()=>{})}else if(enabled&&unlocked)void ready()});
window.addEventListener('pagehide',()=>{stop();if(ctx?.state==='running')void ctx.suspend().catch(()=>{})});
