const {chromium}=require('C:/Users/Vasudev Siddh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch();try{const p=await b.newPage({viewport:{width:1280,height:1000}});await p.goto('https://siddz.com/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(1500);console.log(await p.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,p,nav')].slice(0,22).map(e=>({text:e.textContent.slice(0,65),font:getComputedStyle(e).fontFamily,size:getComputedStyle(e).fontSize,weight:getComputedStyle(e).fontWeight}))));await p.waitForTimeout(2000);await p.evaluate(()=>window.scrollTo(0,900));await p.waitForTimeout(700);await p.screenshot({path:'reference-work.png'});}finally{await b.close()}})();


