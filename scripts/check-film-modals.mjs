import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('public/test/index.html','utf8');
const videos=JSON.parse(readFileSync('src/data/videos.json','utf8'));
for(const v of videos.filter(v=>['Vaani','Odeon','BranchGPT'].includes(v.name))){
 const id=new URL(v.url).searchParams.get('v');
 const block=html.match(new RegExp(`<template id="film-${id}">([\\s\\S]*?)</template>`))?.[1];
 assert.ok(block,`${v.name}: description template`);
 assert.ok(block.includes('<h2>')&&block.includes('film-summary')&&block.includes('case-sections'),`${v.name}: heading, summary and details`);
 assert.ok(block.includes('<section>'),`${v.name}: substantive project description`);
}
const js=readFileSync('public/test/plain.js','utf8');
assert.ok(js.includes('filmDialog.contains(link)'), 'External fallback is not intercepted');
assert.ok(js.includes("filmDialog.querySelector('.film-player').replaceChildren();"),'Closing unloads playback');
assert.ok(!js.includes('?autoplay=1'),'Playback requires user input');
console.log('PASS: all three film descriptions, external fallback and player cleanup');

assert.equal((html.match(/class="archive-open"/g)||[]).length,(html.match(/class="archive-item"/g)||[]).length,'Every visible archive title opens its case study');
assert.equal((html.match(/class="project-cover"/g)||[]).length,10,'Three walkthroughs and two work cards each have two realm artworks');
assert.ok(!html.includes('class="video-play"'),'No generic play badges');
console.log('PASS: curated archive title actions and paired realm covers');

assert.ok(!/avatars\/(spellkeeper|cloud|fox|soul-cat)\.webp/.test(html), "No legacy animal avatars in initial HTML");
assert.ok(html.includes('data-portrait-mode="theme"'), "Themed portraits render before JavaScript");
