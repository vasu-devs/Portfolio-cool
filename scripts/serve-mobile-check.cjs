// Temporary loopback server for built mobile checks; no production APIs are called.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../dist');
function createServer(){return http.createServer((req,res)=>{
 let p=new URL(req.url,'http://localhost').pathname;
 if(p.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'}).end('{"totalViews":12345,"uniqueVisitors":4567,"activeNow":2}');return}
 if(p.startsWith('/_vercel/')){res.writeHead(200,{'content-type':'text/javascript'}).end('');return}
 if(p==='/')p='/index.html';const file=path.resolve(root,'.'+decodeURIComponent(p));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
 res.writeHead(200,{'content-type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf','.wav':'audio/wav'})[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
})}
module.exports={createServer};
