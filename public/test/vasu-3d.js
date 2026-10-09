import * as T from './vendor/three.module.min.js';
const stage=document.querySelector('#stage'),status=document.querySelector('#status');
const scene=new T.Scene();scene.background=new T.Color('#dedbd5');
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;stage.prepend(renderer.domElement);
const camera=new T.PerspectiveCamera(32,1,.01,60);scene.add(new T.HemisphereLight(0xffffff,0x827566,2.2));
const key=new T.DirectionalLight(0xfff3df,3.0);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);const rim=new T.DirectionalLight(0xd7e9ff,1.6);rim.position.set(4,3,-2);scene.add(rim);
const mat=(c,r=.8)=>new T.MeshStandardMaterial({color:c,roughness:r});
const skin=mat('#bd8667'),earSkin=mat('#a97059'),hair=mat('#27201e'),hairLight=mat('#332724'),beard=mat('#322623'),lip=mat('#8f534b'),white=mat('#f2e9dc'),iris=mat('#32291f'),pupil=mat('#17191c'),cloth=mat('#344c65'),pants=mat('#77755e'),shoe=mat('#e2d7bc');
const frame=new T.MeshStandardMaterial({color:'#c8d0cd',roughness:.25,metalness:.25});
const avatar=new T.Group();avatar.name='Vasudev_stylized_avatar';scene.add(avatar);
function ell(parent,m,x,y,z,sx,sy,sz){const o=new T.Mesh(new T.SphereGeometry(1,40,28),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function tube(parent,points,m,r=.012,closed=false){const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed);const mesh=new T.Mesh(new T.TubeGeometry(path,48,r,8,closed),m);parent.add(mesh);return mesh;}
function rod(parent,a,b,r1,r2,m){const A=new T.Vector3(...a),B=new T.Vector3(...b);const o=new T.Mesh(new T.CylinderGeometry(r2,r1,A.distanceTo(B),32),m);o.position.copy(A).add(B).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),B.sub(A).normalize());o.castShadow=true;parent.add(o);return o;}
const body=new T.Group();avatar.add(body);
const shirt=new T.Mesh(new T.LatheGeometry([[0,.62],[.40,.62],[.46,.66],[.49,.85],[.49,1.08],[.45,1.30],[.35,1.45],[.22,1.53],[0,1.53]].map(([x,y])=>new T.Vector2(x,y)),64),cloth);shirt.scale.z=.67;shirt.castShadow=true;body.add(shirt);
rod(body,[-.235,.14,0],[-.235,.77,0],.16,.205,pants);rod(body,[.235,.14,0],[.235,.77,0],.16,.205,pants);
ell(body,shoe,-.235,.105,.07,.19,.105,.28);ell(body,shoe,.235,.105,.07,.19,.105,.28);
ell(avatar,skin,0,1.59,0,.235,.25,.205);
const arms=[];for(const s of [-1,1]){const g=new T.Group();g.position.set(s*.46,1.38,0);g.rotation.z=s*.13;body.add(g);ell(g,cloth,0,-.045,0,.188,.13,.19);rod(g,[s*.02,-.30,0],[0,-.02,0],.17,.19,cloth);rod(g,[s*.01,-.25,0],[s*.01,-.57,.035],.12,.13,skin);ell(g,skin,s*.01,-.65,.055,.13,.15,.105);ell(g,skin,-s*.08,-.62,.12,.06,.09,.055);arms.push(g);}
const head=new T.Group();head.position.set(0,2.01,.01);avatar.add(head);
ell(head,skin,0,0,0,.465,.47,.358);
for(const s of [-1,1]){ell(head,skin,s*.462,-.025,0,.085,.13,.07);ell(head,earSkin,s*.49,-.027,.046,.035,.078,.019);}
// Smooth fitted hair and beard surfaces, built as parametric patches.
function patch(parent,m,thetaStart,thetaEnd,phiStart,phiEnd,rx,ry,rz,offsetY=0){const v=[],idx=[],N=48,M=28;for(let j=0;j<=M;j++){let t=thetaStart+(thetaEnd-thetaStart)*j/M;for(let i=0;i<=N;i++){const p=phiStart+(phiEnd-phiStart)*i/N;const angle=m===beard?t+.29*Math.cos(p*1.5)*(1-j/M):t;v.push(rx*Math.sin(angle)*Math.sin(p),ry*Math.cos(angle)+offsetY,rz*Math.sin(angle)*Math.cos(p));}}for(let j=0;j<M;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+N+1;idx.push(a,b,a+1,b,b+1,a+1);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(idx);geo.computeVertexNormals();const material=m.clone();material.side=T.DoubleSide;const mesh=new T.Mesh(geo,material);mesh.castShadow=true;parent.add(mesh);return mesh;}
patch(head,hair,0,1.3,-Math.PI,Math.PI,.479,.50,.373,.015);
// Back and side hair extend down to the ears.
patch(head,hair,1.1,1.91,1.22,Math.PI*2-1.22,.471,.475,.367);
// Tapered swept locks share the cap's silhouette rather than forming round curls.
for(let i=0;i<9;i++){const x=-.25+i*.060;const o=ell(head,hair,x,.388-i*.013,.175+i*.009,.125,.085,.135);o.rotation.z=-.40;}
patch(head,beard,1.87,3.12,-1.66,1.66,.472,.477,.369);
// Small soul patch and separated moustache retain a short-beard silhouette.
ell(head,beard,0,-.267,.31,.045,.04,.012);tube(head,[[-.074,.18,.34],[0,.17,.352],[.074,.18,.34]],hair,.014);
for(const s of [-1,1]){const o=ell(head,beard,s*.083,-.142,.353,.105,.028,.022);o.rotation.z=-s*.17;}
ell(head,skin,0,-.014,.344,.073,.107,.053);ell(head,skin,0,-.069,.388,.081,.051,.046);
for(const s of [-1,1])ell(head,skin,s*.064,-.081,.375,.048,.04,.043);
const eyes=[];for(const s of [-1,1]){const g=new T.Group();g.position.set(s*.182,.075,.324);g.rotation.y=s*.11;head.add(g);ell(g,white,0,0,0,.105,.029,.021);ell(g,iris,0,-.002,.021,.033,.026,.012);ell(g,pupil,0,-.001,.029,.017,.022,.008);ell(g,white,-.009,.012,.036,.009,.009,.003);tube(g,[[-.104,.004,.012],[-.053,.025,.022],[.036,.028,.023],[.103,.012,.015]],beard,.011);eyes.push(g);tube(head,[[s*.071,.176,.337],[s*.15,.196,.331],[s*.245,.179,.308],[s*.30,.153,.28]],hair,.024);}
const mouth=new T.Group();head.add(mouth);function setSmile(v){while(mouth.children.length){const c=mouth.children[0];mouth.remove(c);c.geometry.dispose();}tube(mouth,[[-.117,-.207+v*.023,.326],[-.06,-.222,.348],[0,-.227,.356],[.06,-.222,.348],[.117,-.207+v*.023,.326]],lip,.009);}
setSmile(.8);
function rimPoints(cx){const w=.302,h=.218,r=.042,cy=.059,z=.396,pts=[];for(const [x,y,start] of [[cx+w/2-r,cy+h/2-r,0],[cx-w/2+r,cy+h/2-r,90],[cx-w/2+r,cy-h/2+r,180],[cx+w/2-r,cy-h/2+r,270]])for(let k=0;k<=8;k++){const a=(start+k*90/8)*Math.PI/180;pts.push([x+r*Math.cos(a),y+r*Math.sin(a),z]);}return pts;}
// Rounded rectangle spectacle rims, bridge, hinges and temples are separate geometry.
for(const s of [-1,1]){tube(head,rimPoints(s*.18),frame,.008,true);tube(head,[[s*.332,.10,.392],[s*.414,.08,.23],[s*.445,.04,.005]],frame,.011);}
tube(head,[[-.03,.092,.4],[0,.106,.42],[.03,.092,.4]],frame,.011);
const robe=new T.Group();body.add(robe);robe.visible=false;const robeMesh=rod(robe,[0,.48,0],[0,1.30,0],.49,.43,cloth);robeMesh.scale.z=.67;
const obi=new T.Mesh(new T.CylinderGeometry(.485,.485,.09,48),white);obi.position.set(0,.89,0);obi.scale.z=.68;robe.add(obi);
tube(robe,[[-.20,1.55,.155],[-.06,1.30,.30],[.19,1.06,.314]],white,.026);tube(robe,[[.19,1.55,.155],[.08,1.39,.29],[-.16,1.17,.32]],white,.026);
const sword=new T.Group();robe.add(sword);rod(sword,[.49,.34,-.04],[.57,1.11,-.04],.026,.026,hair);rod(sword,[.57,1.11,-.04],[.59,1.31,-.04],.036,.036,white);ell(sword,mat('#a18b58'),.57,1.1,-.04,.09,.013,.055);
const pedestal=new T.Mesh(new T.CylinderGeometry(.9,.94,.08,80),mat('#bfc2bc'));pedestal.position.y=-.04;pedestal.receiveShadow=true;scene.add(pedestal);const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.12}));ground.rotation.x=-Math.PI/2;ground.position.y=-.086;ground.receiveShadow=true;scene.add(ground);
let yaw=.12,pitch=.02,distance=3.6,targetY=1.85,auto=false,drag=null,waveStart=-100;
function positionCamera(){camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,targetY+Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);camera.lookAt(0,targetY,0);}
const resize=()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);
renderer.domElement.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-drag[0])*.008;pitch=T.MathUtils.clamp(pitch+(e.clientY-drag[1])*.005,-.3,.65);drag=[e.clientX,e.clientY];});for(const ev of ['pointerup','pointercancel'])renderer.domElement.addEventListener(ev,()=>drag=null);renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();distance=T.MathUtils.clamp(distance+e.deltaY*.004,2,8);},{passive:false});
document.querySelector('#outfit').onchange=e=>{const on=e.target.value==='reaper';robe.visible=on;cloth.color.set(on?'#222833':'#344c65');pants.color.set(on?'#222833':'#77755e');};document.querySelector('#build').oninput=e=>body.scale.x=Number(e.target.value);body.scale.x=1.06;
document.querySelector('#face').oninput=e=>head.scale.x=Number(e.target.value);head.scale.x=1.04;document.querySelector('#smile').oninput=e=>setSmile(Number(e.target.value));
document.querySelector('#front').onclick=()=>{yaw=0;pitch=.04;distance=5.7;targetY=1.33;};document.querySelector('#portrait').onclick=()=>{yaw=.08;pitch=.01;distance=2.8;targetY=2.02;};document.querySelector('#turn').onclick=e=>{auto=!auto;e.target.setAttribute('aria-pressed',String(auto));e.target.textContent=auto?'Stop rotating':'Auto rotate';};document.querySelector('#wave').onclick=()=>waveStart=performance.now()/1000;
document.querySelector('#save').onclick=()=>{const data=avatar.toJSON();const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='vasudev-stylized-three-object.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let previous=0;
renderer.setAnimationLoop(ms=>{const t=ms/1000,dt=Math.min(t-previous,.05);previous=t;if(auto)yaw+=dt*.3;const w=t-waveStart;arms[0].rotation.z=w>=0&&w<2.5?-.13-1.9*Math.sin(Math.min(w/.35,1)*Math.PI/2)+.13*Math.sin(w*14):-.13;if(!reduced){const phase=t%5.2,blink=phase>4.96&&phase<5.12?.15:1;eyes.forEach(e=>e.scale.y=blink);}head.rotation.z=reduced?0:.018*Math.sin(t*1.3);positionCamera();renderer.render(scene,camera);});
status.textContent='Ready · 3D geometry built locally';
