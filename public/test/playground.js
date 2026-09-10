const projectChoices = [
  {name:'JustHireMe', description:'A local-first desktop workbench for job discovery, matching, and application drafts.', subtitle:'Your next chapter.', color:'#dceaff'},
  {name:'Svara', description:'On-device dictation that puts your words into the application you’re already using.', subtitle:'Say it. Keep going.', color:'#ece0ff'},
  {name:'Dreamer', description:'A workspace where research agents investigate ideas and you decide which proposals to keep.', subtitle:'An idea starts here.', color:'#ffe8d4'}
];
const stage = document.getElementById('desk-stage');
const host = document.getElementById('scene-host');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.getElementById('motion-toggle');
let selectedProject = 0, paused = false, desk = null, messageTimer;
let dreaming = false, outfit = 0, collecting = false;
const foundStars = new Set();
const outfits = ['Blueberry', 'Matcha', 'Strawberry'];
function message(text) {
  clearTimeout(messageTimer);
  const bubble = document.getElementById('buddy-message');
  bubble.textContent = text; bubble.classList.add('visible');
  messageTimer = setTimeout(() => { bubble.classList.remove('visible'); bubble.textContent = ''; }, 3500);
}
function catchStar(index) {
  if (!collecting || foundStars.has(index)) return;
  foundStars.add(index); desk?.collect(index);
  document.getElementById('star-progress').textContent = foundStars.size + ' / 5 stars';
  if (foundStars.size === 5) {
    collecting = false;
    if (document.activeElement === document.getElementById('catch-star')) document.getElementById('play-stars').focus({preventScroll:true});
    document.getElementById('catch-star').hidden = true;
    document.getElementById('play-stars').textContent = 'Play again ↻';
    message('Five stars. One very happy Pip. ✦'); desk?.celebrate();
  } else message(['Ooh, shiny!','For me? You shouldn’t have.','My tiny constellation.','One more. I believe in you.'][foundStars.size-1]);
}
document.getElementById('daydream').addEventListener('click', () => {
  dreaming = !dreaming; document.body.classList.toggle('daydream', dreaming);
  document.getElementById('daydream').setAttribute('aria-pressed', String(dreaming));
  document.getElementById('daydream').textContent = dreaming ? '☀ Back to daylight' : '☾ After hours';
  desk?.dream(dreaming); message(dreaming ? 'The best ideas arrive after hours.' : 'A little sunshine. A fresh start.');
});
document.getElementById('dress-pip').addEventListener('click', () => {
  outfit = (outfit + 1) % outfits.length; desk?.outfit(outfit);
  document.getElementById('dress-pip').textContent = 'Pip: ' + outfits[outfit] + ' ↻';
  message(outfits[outfit] + ' Pip reporting for duty.');
});
document.getElementById('play-stars').addEventListener('click', () => {
  foundStars.clear(); collecting = true;
  document.getElementById('star-progress').textContent = '0 / 5 stars';
  document.getElementById('catch-star').hidden = false;
  document.getElementById('play-stars').textContent = 'Restart ↻';
  desk?.startGame(); message('Catch five stars for Pip. Tap the golden ones!');
});
document.getElementById('catch-star').addEventListener('click', () => catchStar([0,1,2,3,4].find(i => !foundStars.has(i))));
function pickProject(index) {
  selectedProject = index;
  document.querySelectorAll('[data-pick]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.pick) === index)));
  document.getElementById('picked-description').textContent = projectChoices[index].description;
  const link = document.getElementById('picked-link');
  link.href = '#project-' + index;
  link.dataset.openProject = 'project-' + index;
  link.replaceChildren(document.createTextNode('Inside ' + projectChoices[index].name + ' '));
  const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); link.append(arrow);
  desk?.select(index);
}
document.querySelectorAll('[data-pick]').forEach(button => button.addEventListener('click', () => pickProject(Number(button.dataset.pick))));
function sayHi() {
  message(['Hello, internet person. ✦','I supervise. Vasu does the coding.','Have you tried collecting the stars?','Tiny desk. Big ideas.'][Math.floor(Math.random()*4)]);
  desk?.hello();
}
document.getElementById('hello-buddy').addEventListener('click', sayHi);
function syncMotion() {
  const off = paused || reduced.matches;
  document.body.classList.toggle('motion-paused', off);
  document.documentElement.style.scrollBehavior = off ? 'auto' : '';
  motionButton.disabled = reduced.matches;
  motionButton.setAttribute('aria-pressed', String(off));
  motionButton.setAttribute('aria-label', reduced.matches ? 'Animations off: reduced-motion preference' : off ? 'Enable animations' : 'Pause animations');
  motionButton.firstElementChild.textContent = off ? '▷' : 'Ⅱ';
  desk?.motion(off);
}
motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
reduced.addEventListener('change', syncMotion);
syncMotion();
document.getElementById('turn-left').addEventListener('click', () => desk?.turn(-.2));
document.getElementById('turn-right').addEventListener('click', () => desk?.turn(.2));
document.getElementById('reset-view').addEventListener('click', () => desk?.reset());

const projects = [...document.querySelectorAll('.project')];
function filterProjects(category) {
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  projects.forEach(project => { project.hidden = category !== 'All' && project.dataset.category !== category; });
  document.getElementById('project-count').textContent = projects.filter(project => !project.hidden).length + ' projects';
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
function openProject(id) {
  const project = document.getElementById(id);
  if (!project?.classList.contains('project')) return;
  filterProjects('All'); project.open = true;
}
document.querySelectorAll('[data-open-project]').forEach(link => link.addEventListener('click', () => openProject(link.dataset.openProject)));
window.addEventListener('hashchange', () => openProject(location.hash.slice(1)));
openProject(location.hash.slice(1));

function fallback() {
  host.replaceChildren();
  stage.classList.remove('scene-ready'); stage.classList.add('scene-unavailable');
  document.getElementById('desk-hint').textContent = 'Pick a project above to explore.';
}

async function createDesk() {
  const T = await import('./vendor/three.module.min.js');
  const renderer = new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0xf7f9fc, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  host.append(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-4,4,3,-3,.1,50);
  camera.position.set(6,5.6,10); camera.lookAt(0,.9,0);
  const world = new T.Group(); scene.add(world); world.rotation.y = .1;
  const hemi = new T.HemisphereLight(0xffffff,0xbdcbe0,1.8); scene.add(hemi);
  const key = new T.DirectionalLight(0xffffff,2.6); key.position.set(-3,7,5); key.castShadow=true;
  key.shadow.mapSize.set(1024,1024); key.shadow.camera.left=-5; key.shadow.camera.right=5; key.shadow.camera.top=5; key.shadow.camera.bottom=-5; key.shadow.normalBias=.035; key.shadow.bias=-.0002;
  scene.add(key);
  const fill = new T.DirectionalLight(0xcadfff,.8); fill.position.set(5,3,-4); scene.add(fill);
  const ground = new T.Mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({opacity:.14,color:0x687d9b}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-.22; ground.receiveShadow=true; scene.add(ground);
  const mats = {};
  function material(color, metalness=0) { const key=color+':'+metalness; return mats[key] ||= new T.MeshStandardMaterial({color,roughness:.42,metalness}); }
  function mesh(geometry,color,parent,x=0,y=0,z=0,metal=0) {
    const object=new T.Mesh(geometry,material(color,metal)); object.position.set(x,y,z); object.castShadow=true; object.receiveShadow=true; parent.add(object); return object;
  }
  function rounded(w,h,d,r=.08) {
    r=Math.min(r,w/4,h/4,d/3);
    const s=new T.Shape(), x=-w/2, y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
    const g=new T.ExtrudeGeometry(s,{depth:d-r,bevelEnabled:true,bevelThickness:r/2,bevelSize:r/2,bevelSegments:3,steps:1,curveSegments:5});g.center();return g;
  }
  function box(w,h,d,color,parent,x,y,z,r=.08) { return mesh(rounded(w,h,d,r),color,parent,x,y,z); }
  function ball(radius,color,parent,x,y,z,sx=1,sy=1,sz=1) { const o=mesh(new T.SphereGeometry(radius,24,16),color,parent,x,y,z);o.scale.set(sx,sy,sz);return o; }
  function cyl(rt,rb,h,color,parent,x,y,z) { return mesh(new T.CylinderGeometry(rt,rb,h,32),color,parent,x,y,z); }
  const platform=box(5.65,.24,3.25,0xf5f1ea,world,0,0,0,.07);
  // Computer and keyboard: an original miniature, not a product screenshot.
  const computer=new T.Group();world.add(computer);computer.userData.pick=0;computer.position.set(-.15,0,-.4);
  const base=cyl(.56,.59,.11,0xd4dfed,computer,0,.23,.13);base.scale.z=.6;
  box(.22,.65,.2,0xcad6e5,computer,0,.56,-.04,.05);
  box(2.6,1.79,.28,0xfafbff,computer,0,1.62,0,.09);
  box(2.37,1.39,.04,0x9ab3d0,computer,0,1.73,.164,.015);
  const screenCanvas=document.createElement('canvas');screenCanvas.width=800;screenCanvas.height=470;
  const ctx=screenCanvas.getContext('2d');
  const screenTexture=new T.CanvasTexture(screenCanvas);screenTexture.colorSpace=T.SRGBColorSpace;
  const screen=new T.Mesh(new T.PlaneGeometry(2.27,1.3),new T.MeshBasicMaterial({map:screenTexture}));screen.position.set(0,1.74,.19);computer.add(screen);
  const webcam=ball(.023,0x6b7d97,computer,0,2.405,.158,1,1,.3);
  const power=ball(.023,0x95c4b1,computer,.98,.86,.16,1,1,.3);
  function paintScreen(index) {
    const p=projectChoices[index];ctx.fillStyle=p.color;ctx.fillRect(0,0,800,470);
    ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.roundRect(35,30,730,409,25);ctx.fill();
    ['#ffb5b5','#f6d88e','#aeddbf'].forEach((color,i)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(65+i*25,57,7,0,Math.PI*2);ctx.fill();});
    ctx.fillStyle='#8994aa';ctx.font='18px Arial';ctx.textAlign='right';ctx.fillText('vasu’s workspace',726,63);
    ctx.textAlign='left';ctx.fillStyle='#283c59';ctx.font='bold 60px Arial';ctx.fillText(p.name,76,159);
    ctx.fillStyle='#8290a8';ctx.font='25px Arial';ctx.fillText(p.subtitle,79,202);
    const labels=index===0?['Discover','Understand','Prepare']:index===1?['Speak','Transcribe','Keep going']:['Research','Question','Review'];
    const colors=['#e3edff','#eee5fa','#ffeddb'];
    labels.forEach((label,i)=>{ctx.fillStyle=colors[i];ctx.beginPath();ctx.roundRect(76+i*218,255,199,107,17);ctx.fill();ctx.fillStyle='#70839f';ctx.font='bold 22px Arial';ctx.fillText(label,93+i*218,318);});
    ctx.fillStyle='#a4afbf';ctx.font='17px Arial';ctx.fillText('An independent project by Vasudev Siddh',78,402);
    screenTexture.needsUpdate=true;
  }
  paintScreen(selectedProject);
  const keyboard=box(1.8,.1,.68,0xe6edf6,world,-.1,.22,.96,.03);keyboard.rotation.y=.04;
  for(let row=0;row<4;row++)for(let col=0;col<11;col++){const k=box(.115,.038,.093,(row===0&&col===0)?0xc5d9f7:0xffffff,world,-.82+col*.14,.292,.73+row*.145,.01);k.castShadow=false;}
  box(.58,.04,.09,0xd5e3fa,world,-.03,.292,1.32,.015);
  const mouse=ball(.17,0xfafbff,world,1.08,.26,1.03,.7,.4,1.2);
  // A peach notebook selects Dreamer.
  const notebook=new T.Group();world.add(notebook);notebook.position.set(-1.98,.27,.72);notebook.rotation.y=-.25;notebook.userData.pick=2;
  box(.75,.11,.91,0xf5ba9d,notebook,0,0,0,.03);box(.66,.055,.79,0xfff5e7,notebook,.016,.066,0,.02);box(.76,.035,.92,0xffcead,notebook,0,.115,0,.015);
  const bookStripe=box(.085,.045,.9,0xe49c84,notebook,-.27,.14,0,.01);
  const pencil=cyl(.025,.025,.72,0xf4d291,notebook,.07,.2,0);pencil.rotation.z=Math.PI/2;pencil.rotation.x=.1;
  // A lavender microphone selects Svara.
  const microphone=new T.Group();world.add(microphone);microphone.position.set(1.93,.16,-.08);microphone.rotation.y=-.18;microphone.userData.pick=1;
  const micBase=cyl(.28,.31,.08,0xc8bce3,microphone,0,.02,0);micBase.scale.z=.8;
  cyl(.04,.04,.55,0xab9bc8,microphone,0,.31,0);
  const mic=mesh(new T.CapsuleGeometry(.19,.42,8,20),0xd7c7ef,microphone,0,.84,0);
  for(let i=0;i<5;i++)box(.23,.018,.012,0xad98cc,microphone,0,.71+i*.07,.178,.003);
  const ring=mesh(new T.TorusGeometry(.285,.035,8,28,Math.PI),0xb8a7d6,microphone,0,.71,0);ring.rotation.z=Math.PI;
  // A mug, succulent, and small floating objects add personality without covering text.
  const mug=cyl(.17,.145,.32,0xffffff,world,1.35,.36,-.86);
  const coffee=cyl(.142,.142,.012,0xc4a385,world,1.35,.523,-.86);
  const handle=mesh(new T.TorusGeometry(.115,.035,8,20),0xf6f8fb,world,1.54,.37,-.86);handle.rotation.y=Math.PI/2;
  const plant=new T.Group();world.add(plant);plant.position.set(-2.03,.13,-.66);
  cyl(.21,.15,.31,0xeee2d0,plant,0,.16,0);cyl(.177,.177,.013,0xb2a58d,plant,0,.318,0);
  for(let i=0;i<5;i++){const leaf=ball(.13,[0xa8c8a7,0x91b69f,0xb9d5ae][i%3],plant,Math.sin(i*1.25)*.1,.48+Math.cos(i)*.04,Math.cos(i*1.25)*.1,.55,1.6,.5);leaf.rotation.z=Math.sin(i*1.25)*.6;leaf.rotation.x=Math.cos(i*1.25)*.5;}
  const tile=new T.Group();world.add(tile);tile.position.set(-2,1.77,-.7);tile.rotation.set(.04,.2,-.15);tile.userData.pick=0;
  box(.57,.56,.17,0xa9caf4,tile,0,0,0,.05);
  const bracketL=box(.045,.23,.025,0xf9fcff,tile,-.14,0,.12,.01);bracketL.rotation.z=-.4;
  const bracketR=box(.045,.23,.025,0xf9fcff,tile,.14,0,.12,.01);bracketR.rotation.z=.4;
  const slash=box(.03,.25,.025,0xf9fcff,tile,0,0,.12,.01);slash.rotation.z=-.3;
  const starShape=new T.Shape();for(let i=0;i<10;i++){const radius=i%2===0?.27:.13;const a=i*Math.PI/5+Math.PI/2;const x=Math.cos(a)*radius,y=Math.sin(a)*radius;i===0?starShape.moveTo(x,y):starShape.lineTo(x,y);}starShape.closePath();
  const starGeo=new T.ExtrudeGeometry(starShape,{depth:.07,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1});starGeo.center();
  const star=mesh(starGeo,0xf5dba0,world,1.83,2.15,-.63);star.rotation.set(.1,-.25,-.12);star.userData.hello=true;
  const gameStars = [[-2.65,1.05,.9],[-1.4,2.65,-.6],[.2,2.85,0],[2.5,1.85,.4],[.1,.7,1.6]].map((position,i) => {
    const object = mesh(starGeo,0xffcc55,world,...position); object.scale.setScalar(.63); object.rotation.y=.4; object.userData.star=i; object.userData.baseY=position[1]; object.visible=false; return object;
  });
  const confetti = Array.from({length:28},(_,i) => {
    const object=mesh(new T.BoxGeometry(.055,.13,.025),[0x7cadff,0xffbbd4,0xffd570,0x93d9bd][i%4],world,0,0,0);
    object.visible=false; object.castShadow=false; return object;
  });
  // Pip: a tiny original clay-like desk companion.
  const pip=new T.Group();world.add(pip);pip.position.set(1.6,.5,1.12);pip.rotation.y=.08;pip.userData.hello=true;
  const body=ball(.32,0xa4c7f5,pip,0,0,0,1,1.1,.84);
  const eyes=[];
  [-1,1].forEach(side=>{
    const eye=ball(.039,0x344c6c,pip,side*.108,.065,.257,.8,1.25,.38);eyes.push(eye);
    ball(.011,0xffffff,pip,side*.108-.008,.08,.274,.65,.65,.4);
    ball(.042,0xeebcce,pip,side*.211,-.015,.215,1,.47,.25);
    const foot=ball(.095,0x93b7e6,pip,side*.16,-.28,.035,1,.5,1.2);
  });
  const smile=mesh(new T.TorusGeometry(.049,.008,6,16,Math.PI),0x536f94,pip,0,-.055,.272);smile.rotation.z=Math.PI;
  const armL=ball(.085,0xb3d0f6,pip,-.31,-.065,0,.55,1.3,.7);
  const armR=ball(.085,0xb3d0f6,pip,.31,-.065,0,.55,1.3,.7);
  const antenna=cyl(.012,.012,.19,0x9fb9dc,pip,0,.39,0);ball(.055,0xf6d4a7,pip,0,.51,0);
  // Give Pip its own materials so changing its outfit leaves the desk unchanged.
  const pipColors = new Map();
  pip.traverse(object => { if(object.isMesh && [0xa4c7f5,0x93b7e6,0xb3d0f6].includes(object.material.color.getHex())) { object.material=object.material.clone(); pipColors.set(object,object.material.color.clone()); }});
  const raycaster=new T.Raycaster(),pointer=new T.Vector2();
  let targetYaw=.1, drag=null, inView=true, stopped=paused||reduced.matches, frame=0, time=0, previous=0, hopUntil=0, disposed=false, partyUntil=0;
  const canvas=renderer.domElement;
  function hitAt(event){const bounds=canvas.getBoundingClientRect();pointer.set((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(world.children,true).find(hit=>{let o=hit.object;while(o&&o!==world){if(!o.visible)return false;if(o.userData.pick!==undefined||o.userData.hello||o.userData.star!==undefined)return true;o=o.parent;}return false;});}
  canvas.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY,yaw:targetYaw,moved:false};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(drag){const dx=event.clientX-drag.x;const dy=event.clientY-drag.y;if(Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)){drag.moved=true;targetYaw=T.MathUtils.clamp(drag.yaw+dx*.004,-.85,.55);if(stopped)world.rotation.y=targetYaw;requestDraw();}}else canvas.style.cursor=hitAt(event)?'pointer':'grab';});
  canvas.addEventListener('pointerup',event=>{const start=drag;drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(!start||start.moved||Math.hypot(event.clientX-start.x,event.clientY-start.y)>8)return;const hit=hitAt(event);if(!hit)return;let object=hit.object;while(object&&object!==world){if(object.userData.star!==undefined){catchStar(object.userData.star);break;}if(object.userData.pick!==undefined){pickProject(object.userData.pick);break;}if(object.userData.hello){sayHi();break;}object=object.parent;}});
  canvas.addEventListener('pointercancel',()=>{drag=null;});
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h;const halfWidth=aspect<1.2?3.7:4.1;camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfWidth/aspect;camera.bottom=-halfWidth/aspect;camera.updateProjectionMatrix();requestDraw();}
  function draw(now){frame=0;if(disposed||!inView||document.hidden)return;const delta=previous?Math.min((now-previous)/1000,.05):0;previous=now;if(!stopped)time+=delta;
    if(!stopped){world.rotation.y+=(targetYaw-world.rotation.y)*.12;tile.position.y=1.77+Math.sin(time*1.3)*.055;tile.rotation.z=-.15+Math.sin(time*.8)*.035;star.position.y=2.15+Math.sin(time*1.1+1)*.065;star.rotation.z=-.12+Math.sin(time*.7)*.08;pip.position.y=.5+Math.sin(time*1.4)*.012;const blink=time%4.7<.12?.1:1;eyes.forEach(eye=>eye.scale.y=1.25*blink);if(now<hopUntil){pip.position.y+=Math.abs(Math.sin((hopUntil-now)*.007))*.22;armR.rotation.z=-.7+Math.sin(now*.025)*.45;}else armR.rotation.z=0;}
    gameStars.forEach((object,i) => { if(!stopped){object.position.y=object.userData.baseY+Math.sin(time*2+i)*.09;object.rotation.y=.4+Math.sin(time*.8+i)*.28;object.rotation.z=Math.sin(time+i)*.15;} });
    const party = !stopped && now < partyUntil;
    confetti.forEach((object,i) => { object.visible=party;if(party){const progress=1-(partyUntil-now)/2600;object.position.set(1.6+Math.sin(i*2.4)*progress*2.4,.8+Math.sin(progress*Math.PI)*2.8-i%3*.12,1.1+Math.cos(i*2.4)*progress*1.4);object.rotation.set(time*2+i,time*3,i);} });
    if(party){pip.rotation.z=Math.sin(time*12)*.14;armL.rotation.z=.8;armR.rotation.z=-.8;}else {pip.rotation.z=0;armL.rotation.z=0;}
    renderer.render(scene,camera);if(!stopped)frame=requestAnimationFrame(draw);
  }
  function requestDraw(){if(!frame&&!disposed&&inView&&!document.hidden)frame=requestAnimationFrame(draw);}
  function syncVisibility(){if(!inView||document.hidden){cancelAnimationFrame(frame);frame=0;previous=0;}else requestDraw();}
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncVisibility();});observer.observe(host);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  document.addEventListener('visibilitychange',syncVisibility);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;disposed=true;fallback();});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;previous=0;});
  window.addEventListener('pageshow',syncVisibility);
  stage.classList.add('scene-ready');resize();
  return {
    select(index){paintScreen(index);requestDraw();},
    hello(){hopUntil=performance.now()+1200;requestDraw();},
    dream(on){hemi.intensity=on?.8:1.8;key.intensity=on?1.7:2.6;fill.color.set(on?0xc7b6ff:0xcadfff);fill.intensity=on?2:.8;ground.material.opacity=on?.07:.14;requestDraw();},
    outfit(index){pipColors.forEach((original,object)=>object.material.color.copy(index===0?original:new T.Color(index===1?0xa1dbb4:0xf5abc7)));hopUntil=performance.now()+1200;requestDraw();},
    startGame(){gameStars.forEach(object=>object.visible=true);star.visible=false;requestDraw();},
    collect(index){gameStars[index].visible=false;hopUntil=performance.now()+700;if(foundStars.size===5)star.visible=true;requestDraw();},
    celebrate(){partyUntil=performance.now()+2600;hopUntil=partyUntil;requestDraw();},
    turn(amount){targetYaw=T.MathUtils.clamp(targetYaw+amount,-.85,.55);if(stopped)world.rotation.y=targetYaw;requestDraw();},
    reset(){targetYaw=.1;if(stopped)world.rotation.y=targetYaw;requestDraw();},
    motion(off){stopped=off;previous=0;if(off){world.rotation.y=targetYaw;eyes.forEach(eye=>eye.scale.y=1.25);pip.position.y=.5;armR.rotation.z=0;}requestDraw();}
  };
}
createDesk().then(instance=>{desk=instance;desk.dream(dreaming);desk.outfit(outfit);if(collecting){desk.startGame();foundStars.forEach(i=>desk.collect(i));}syncMotion();}).catch(()=>fallback());
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
