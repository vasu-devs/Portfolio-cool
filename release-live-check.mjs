import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
for(const url of ['https://www.siddhvasudev.com/','https://vasu-devs.si/','https://www.vasu-devs.si/resume.html','https://www.siddhvasudev.com/test/','https://www.siddhvasudev.com/old/','https://www.siddhvasudev.com/paper/','https://www.siddhvasudev.com/resume.html','https://www.siddhvasudev.com/sitemap.xml']){
 const r=await fetch(url,{redirect:'manual'});console.log(r.status,url,r.headers.get('location')||'');
 if(url==='https://www.siddhvasudev.com/'){
  const body=Buffer.from(await r.arrayBuffer());
  console.log('Live HTML matches checked build:',createHash('sha256').update(body).digest('hex')===createHash('sha256').update(readFileSync('dist/index.html')).digest('hex'));
 }
 if(url.endsWith('/resume.html'))console.log('PDF link:',(await r.text()).includes('href="/resume.pdf"'));
}
