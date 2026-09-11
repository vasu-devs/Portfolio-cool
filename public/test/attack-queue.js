// Finish each swing before consuming buffered input. Bound spam without restarting windup.
export function createAttackQueue({start,release,recover,finish,available,setTimer=setTimeout,clearTimer=clearTimeout}) {
 let timer=0,running=false,pending=[],generation=0;
 function later(fn,ms,token){timer=setTimer(()=>{timer=0;if(token===generation)fn();},ms);}
 function run(target){
  if(!available()){cancel();finish();return;}
  running=true;const token=generation;start(target);
  later(()=>{if(!available()){cancel();finish();return;}release(target);
   later(()=>{recover();later(()=>{if(pending.length)run(pending.shift());else{running=false;finish();}},100,token);},110,token);
  },80,token);
 }
 function push(target){
  if(!available())return;
  if(!running){run(target);return;}
  if(pending.length<3)pending.push(target);else pending[pending.length-1]=target;
 }
 function cancel(){generation++;clearTimer(timer);timer=0;pending=[];running=false;}
 return {push,cancel};
}
