export const effectSpecs={
 ichigo:[160,460,100],rukia:[160,520,65],renji:[150,440,35],
 uryu:[150,360,180],orihime:[140,640,0,'local'],chad:[140,380,24],urahara:[160,430,100],yoruichi:[112,400,0,'local'],byakuya:[170,540,70],toshiro:[185,540,100],kenpachi:[155,360,0,'local'],shunsui:[135,480,0,'target'],aizen:[155,680,0,'target'],yhwach:[150,380,0,'local'],grimmjow:[180,480,85],'ichigo-tybw':[170,460,100]
};
export const effectCharacters=Object.keys(effectSpecs);
const loaded=new Map();
export function preloadCharacterEffect(id){
 if(!effectSpecs[id])return Promise.resolve();
 if(!loaded.has(id)){const image=new Image();image.src=`./sprites/effects/${id}.webp?v=18`;loaded.set(id,image.decode().catch(()=>{loaded.delete(id);}));}
 return loaded.get(id);
}
export function launchCharacterEffect({character,field,x,y,targetX,targetY,slashes}){
 const spec=effectSpecs[character];if(!spec)return false;
 const [baseSize,duration,reach,mode]=spec,dx=targetX-x,dy=targetY-y,distance=Math.hypot(dx,dy),ux=distance?dx/distance:1,uy=distance?dy/distance:0;
 const width=field.clientWidth||innerWidth,height=field.clientHeight||innerHeight;
 const size=Math.min(Math.round(baseSize*.6),width-8,height-8);
 const clamp=(v,max)=>Math.max(size/2,Math.min(max-size/2,v));
 const cx=clamp(mode==='target'?targetX:x+ux*(character==='yoruichi'?0:35),width),cy=clamp(mode==='target'?targetY:y,height);
 const travel=Math.min(reach,distance),ex=clamp(cx+ux*travel,width)-cx,ey=clamp(cy+uy*travel,height)-cy,angle=mode?0:Math.atan2(dy,dx);
 const node=document.createElement('div');node.className='soul-effect';node.dataset.effect=character;
 Object.assign(node.style,{position:'absolute',width:size+'px',height:size+'px',left:cx-size/2+'px',top:cy-size/2+'px',transformOrigin:'50% 50%',pointerEvents:'none',backgroundImage:`url("./sprites/effects/${character}.webp?v=18")`,backgroundSize:'200% 200%',backgroundRepeat:'no-repeat'});
 field.append(node);
 // Step each cell interval, not the entire effect timeline (which freezes frame zero).
 const frames=node.animate(['0% 0%','100% 0%','0% 100%','100% 100%','100% 100%'].map((backgroundPosition,i)=>({backgroundPosition,offset:i/4,easing:'steps(1,end)'})),{duration,easing:'linear',fill:'forwards'});
 const motion=node.animate([{transform:`translate(0px,0px) rotate(${angle}rad)`,opacity:1},{transform:`translate(${ex}px,${ey}px) rotate(${angle}rad)`,opacity:1,offset:.78},{transform:`translate(${ex}px,${ey}px) rotate(${angle}rad)`,opacity:0}],{duration,easing:'linear',fill:'forwards'});
 const animation={cancel(){frames.cancel();motion.cancel();}},item={node,animation};slashes.add(item);
 const cleanup=()=>{node.remove();slashes.delete(item);};motion.finished.then(cleanup,cleanup);
 while(slashes.size>6){const oldest=slashes.values().next().value;oldest.animation.cancel();oldest.node.remove();slashes.delete(oldest);}
 return true;
}
