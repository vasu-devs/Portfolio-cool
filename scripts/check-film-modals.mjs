import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('public/test/index.html','utf8');
const videos=JSON.parse(readFileSync('src/data/videos.json','utf8'));
for(const v of videos){
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
console.log('PASS: all five film descriptions, external fallback and player cleanup');

assert.equal((html.match(/class="archive-open"/g)||[]).length,39,'Every archive title opens its case study');
assert.equal((html.match(/class="project-cover"/g)||[]).length,5,'Each demo card has project artwork');
assert.ok(!html.includes('class="video-play"'),'No generic play badges');
console.log('PASS: all 39 archive title actions and five project cover cards');
