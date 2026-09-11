import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('public/test/plain.js','utf8');
let handler,update,finish,skips=0;
const root={dataset:{theme:'light'}},icon={},label={};
const button={setAttribute(){},querySelector:s=>s==='.sun-icon'?icon:label,addEventListener(t,fn){handler=fn;}};
const media={matches:false,addEventListener(){}};
const doc={documentElement:root,querySelector:s=>s==='.theme-toggle'?button:{setAttribute(){}},
 startViewTransition(fn){update=fn;return {ready:Promise.resolve(),finished:new Promise(r=>finish=r),skipTransition(){skips++;}};}};
vm.runInNewContext(source.slice(source.indexOf('const dot ='),source.indexOf('const avatar =')),{document:doc,localStorage:{setItem(){}},matchMedia:()=>media,window:{addEventListener(){}}});
handler();handler();update();assert.equal(root.dataset.theme,'light','rapid second click wins before snapshot update');finish();await Promise.resolve();
handler();update();assert.equal(root.dataset.theme,'dark');finish();await Promise.resolve();
assert.ok(icon.innerHTML.includes('<svg'));assert.equal(label.textContent,'');assert.equal(skips,1);
media.matches=true;handler();assert.equal(root.dataset.theme,'light');
media.matches=false;doc.startViewTransition=undefined;handler();assert.equal(root.dataset.theme,'dark');
console.log('PASS: rapid toggles, SVG icons, reduced motion and unsupported-browser fallback');
