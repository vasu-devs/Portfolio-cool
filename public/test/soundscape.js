// Original procedural ambience. No soundtrack recordings, samples or melodies.
export const voices = {
 ichigo:[146.83,220,.45], rukia:[293.66,440,.9], renji:[164.81,246.94,.35],
 uryu:[329.63,493.88,.8], orihime:[261.63,392,.95], chad:[82.41,123.47,.3],
 urahara:[196,293.66,.65], yoruichi:[246.94,369.99,.55], byakuya:[349.23,523.25,.85],
 toshiro:[392,587.33,1], kenpachi:[73.42,110,.2], shunsui:[174.61,261.63,.7],
 aizen:[138.59,207.65,.6], yhwach:[65.41,98,.25], grimmjow:[110,164.81,.4],
 'ichigo-tybw':[130.81,196,.5]
};
export function mountSoundscape(parent) {
 const panel=document.createElement('div');panel.className='soundscape-controls';
 const button=document.createElement('button');button.type='button';button.className='soul-toggle';button.setAttribute('aria-label','Background sound');
 const label=document.createElement('label');label.textContent='Volume';
 const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max='100';slider.step='1';slider.value='25';slider.setAttribute('aria-label','Background sound volume');label.append(slider);
 const note=document.createElement('small');note.textContent='Soft music & interaction sounds';
 panel.append(button,label,note);parent.append(panel);
 let context,master,musicTimer,step=0,enabled=false,character='ichigo',accentNodes=[];
 try{const value=Number(localStorage.getItem('vasu-ambient-volume'));if(localStorage.getItem('vasu-ambient-volume')!==null&&Number.isFinite(value))slider.value=String(Math.max(0,Math.min(100,value)));character=localStorage.getItem('vasu-bleach-character')||character;}catch{}
 const dark=()=>document.documentElement.dataset.theme!=='light';
 const paused=()=>document.hidden||!!document.querySelector('.film-modal[open]');
 function paint(){button.textContent='Sound · '+(enabled?'on':'off');button.setAttribute('aria-pressed',String(enabled));panel.dataset.state=!enabled?'off':paused()?'paused':'playing';}
 function init(){
  const AudioEngine=window.AudioContext||window.webkitAudioContext;
  if(!AudioEngine)throw new Error('Audio unavailable');
  context=new AudioEngine();master=context.createGain();master.gain.value=0;master.connect(context.destination);
 }
 // An original, sparse major-pentatonic phrase: soft plucked keys, no bass drone.
 function noteTone(freq,duration=.8,level=.08,delay=0){
  const o=context.createOscillator(),g=context.createGain(),t=context.currentTime+delay;
  o.type='triangle';o.frequency.value=freq;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(level,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g);g.connect(master);o.start(t);o.stop(t+duration+.02);accentNodes.push([o,g]);
  o.onended=()=>{o.disconnect();g.disconnect();accentNodes=accentNodes.filter(([node])=>node!==o);};
 }
 function tune(){
  if(!context||musicTimer||!enabled||paused())return;
  const play=()=>{if(!enabled||paused())return;
   const notes=dark()?[220,277.18,329.63,415.3,329.63,277.18,246.94,329.63]:[261.63,329.63,392,440,392,329.63,293.66,392];
   if(step%4!==3)noteTone(notes[step%notes.length],1.5,.045);
   step++;
  };play();musicTimer=setInterval(play,850);
 }
 function haltMusic(){clearInterval(musicTimer);musicTimer=null;}
 function effect(kind,id){
  if(!context||!enabled||paused())return;
  const v=voices[id]||voices.ichigo;
  if(kind==='click'){noteTone(740,.045,.025);return;}
  // Bright ice/petal accents, percussive strikes and short airy blade sweeps.
  const bright=['rukia','toshiro','byakuya','orihime','uryu'].includes(id);
  const duration=kind==='entrance'?.65:.26;
  const count=kind==='entrance'?3:bright?3:2;
  for(let i=0;i<count;i++)noteTone((140+v[0])*(bright?2:1)*(1+i*.25),duration,.07,i*.055);
  const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),samples=buffer.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/samples.length)*Math.pow(1-i/samples.length,2);
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.buffer=buffer;filter.type='bandpass';filter.frequency.value=bright?2200:900+v[0]*2;filter.Q.value=.5;gain.gain.value=kind==='entrance'?.055:.09;
  source.connect(filter);filter.connect(gain);gain.connect(master);source.start();accentNodes.push([source,gain]);
  source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();accentNodes=accentNodes.filter(([node])=>node!==source);};
 }
 function clearAccent(){for(const [o,g] of accentNodes){try{o.stop();}catch{}o.disconnect();g.disconnect();}accentNodes=[];}
 function accent(){if(context&&enabled&&!paused())noteTone(voices[character]?.[1]||330,.65,.035);}
 let revision=0;
 async function sync(withAccent=false){
  const request=++revision;paint();if(!context)return;
  if(!enabled||paused()){haltMusic();clearAccent();await context.suspend();return;}
  try{await context.resume();if(request!==revision)return;master.gain.setTargetAtTime(Number(slider.value)/100*.35,context.currentTime,.15);tune();if(withAccent)accent();}
  catch{if(request===revision){enabled=false;paint();note.textContent='Tap Sound to retry';}}
 }
 button.addEventListener('click',()=>{try{if(!context)init();enabled=!enabled;void sync(true);}catch{note.textContent='Sound is unavailable in this browser';}});
 slider.addEventListener('input',()=>{try{localStorage.setItem('vasu-ambient-volume',slider.value);}catch{}void sync();});
 document.addEventListener('bleach-character-change',e=>{character=e.detail.id;panel.dataset.character=character;accent();});
 new MutationObserver(()=>{haltMusic();step=0;tune();accent();panel.dataset.realm=dark()?'hueco':'seireitei';}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 new MutationObserver(()=>{void sync();}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 let lastEffect=0;
 document.addEventListener('bleach-audio',e=>{const now=performance.now();if(now-lastEffect<70)return;lastEffect=now;effect(e.detail.kind,e.detail.id);});
 document.addEventListener('click',e=>{if(e.target.closest('button,a,summary')&&!e.target.closest('.bleach-menu,.soul-cursor,.theme-toggle'))effect('click',character);});
 document.addEventListener('visibilitychange',()=>{void sync();});
 window.addEventListener('pagehide',()=>{enabled=false;void sync();});
 panel.dataset.character=character;panel.dataset.realm=dark()?'hueco':'seireitei';paint();
 return panel;
}
