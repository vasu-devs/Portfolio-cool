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
 const note=document.createElement('small');note.textContent='Original ambient sound';
 panel.append(button,label,note);parent.append(panel);
 let context,master,wind,droneA,droneB,enabled=false,character='ichigo',accentNodes=[];
 try{const value=Number(localStorage.getItem('vasu-ambient-volume'));if(localStorage.getItem('vasu-ambient-volume')!==null&&Number.isFinite(value))slider.value=String(Math.max(0,Math.min(100,value)));character=localStorage.getItem('vasu-bleach-character')||character;}catch{}
 const dark=()=>document.documentElement.dataset.theme!=='light';
 const paused=()=>document.hidden||!!document.querySelector('.film-modal[open]');
 function paint(){button.textContent='Sound · '+(enabled?'on':'off');button.setAttribute('aria-pressed',String(enabled));panel.dataset.state=!enabled?'off':paused()?'paused':'playing';}
 function init(){
  const AudioEngine=window.AudioContext||window.webkitAudioContext;
  if(!AudioEngine)throw new Error('Audio unavailable');
  context=new AudioEngine();master=context.createGain();master.gain.value=0;master.connect(context.destination);
  const buffer=context.createBuffer(1,context.sampleRate*6,context.sampleRate),data=buffer.getChannelData(0);
  let brown=0;for(let i=0;i<data.length;i++){brown=(brown+Math.random()*.04-.02)/1.02;data[i]=brown*3;}
  const noise=context.createBufferSource();noise.buffer=buffer;noise.loop=true;
  wind=context.createBiquadFilter();wind.type='lowpass';wind.Q.value=.4;
  const breeze=context.createGain();breeze.gain.value=.16;noise.connect(wind);wind.connect(breeze);breeze.connect(master);noise.start();
  function tone(freq,level){const o=context.createOscillator(),g=context.createGain();o.type='sine';o.frequency.value=freq;g.gain.value=level;o.connect(g);g.connect(master);o.start();return o;}
  droneA=tone(98,.045);droneB=tone(147,.025);
 }
 function tune(){if(!context)return;const t=context.currentTime;wind.frequency.setTargetAtTime(dark()?360:1100,t,.8);droneA.frequency.setTargetAtTime(dark()?65.41:130.81,t,.8);droneB.frequency.setTargetAtTime(dark()?98:196,t,.8);}
 function clearAccent(){for(const [o,g] of accentNodes){try{o.stop();}catch{}o.disconnect();g.disconnect();}accentNodes=[];}
 function accent(){
  if(!context||!enabled||paused())return;clearAccent();
  const [first,second,brightness]=voices[character]||voices.ichigo;
  for(const [index,freq] of [first,second].entries()){
   const o=context.createOscillator(),g=context.createGain(),t=context.currentTime;
   o.type='sine';o.frequency.value=freq*(dark()?.75:1);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.065*brightness,t+.15+index*.12);g.gain.exponentialRampToValueAtTime(.0001,t+2.6);
   o.connect(g);g.connect(master);o.start();o.stop(t+2.7);accentNodes.push([o,g]);
   o.onended=()=>{o.disconnect();g.disconnect();accentNodes=accentNodes.filter(([node])=>node!==o);};
  }
 }
 let revision=0;
 async function sync(withAccent=false){
  const request=++revision;paint();if(!context)return;
  if(!enabled||paused()){clearAccent();await context.suspend();return;}
  try{await context.resume();if(request!==revision)return;master.gain.setTargetAtTime(Number(slider.value)/100*.35,context.currentTime,.15);tune();if(withAccent)accent();}
  catch{if(request===revision){enabled=false;paint();note.textContent='Tap Sound to retry';}}
 }
 button.addEventListener('click',()=>{try{if(!context)init();enabled=!enabled;void sync(true);}catch{note.textContent='Sound is unavailable in this browser';}});
 slider.addEventListener('input',()=>{try{localStorage.setItem('vasu-ambient-volume',slider.value);}catch{}void sync();});
 document.addEventListener('bleach-character-change',e=>{character=e.detail.id;panel.dataset.character=character;accent();});
 new MutationObserver(()=>{tune();accent();panel.dataset.realm=dark()?'hueco':'seireitei';}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 new MutationObserver(()=>{void sync();}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 document.addEventListener('visibilitychange',()=>{void sync();});
 window.addEventListener('pagehide',()=>{enabled=false;void sync();});
 panel.dataset.character=character;panel.dataset.realm=dark()?'hueco':'seireitei';paint();
 return panel;
}
