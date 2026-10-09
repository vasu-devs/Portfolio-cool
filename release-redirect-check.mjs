import {writeFileSync} from 'node:fs';
const results=[];
for(const url of ['https://vasu-devs.si/','https://vasu-devs.si/resume.html','https://www.vasu-devs.si/','https://www.vasu-devs.si/resume.html','https://www.siddhvasudev.com/test/','https://www.siddhvasudev.com/old/']){
 const r=await fetch(url,{redirect:'manual'});results.push({url,status:r.status,location:r.headers.get('location')});
}
console.log(JSON.stringify(results,null,2));writeFileSync('release-redirect-results.json',JSON.stringify(results,null,2));
