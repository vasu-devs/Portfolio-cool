import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projects, groups} from './test-portfolio-content.mjs';
const html=readFileSync('public/test/index.html','utf8');
assert.ok(!html.includes('@@'));
assert.equal(new Set(projects.map(p=>p.slug)).size,projects.length,'unique slugs');
for(const p of projects){
 assert.ok(html.includes(`id="project-${p.slug}"`),`${p.name} rendered`);
 if(p.url)assert.ok(p.url.startsWith('https://github.com/vasu-devs/'),`${p.name} source on my GitHub`);
}
for(const key of Object.keys(groups))assert.ok(html.includes(`data-group="${key}" aria-labelledby="group-${key}"`),`${key} group rendered`);
const work=projects.filter(p=>p.group==='work'),play=projects.filter(p=>p.group==='play');
assert.ok(work.length>=6&&play.length>=6,'both serious and hobby groups are populated');
assert.ok(!html.includes('id="work-search"')&&!html.includes('id="work-track"'));
assert.equal((html.match(/class="selected-item"/g)||[]).length,3,'three selected projects on Home');
assert.ok(html.includes('id="contact" data-panel="contact"'),'contact page rendered');
assert.ok(html.includes('class="message-form"')&&html.includes('data-cal-link="vasu-devs"'),'message form and call embed present');
const hero=html.slice(html.indexOf('class="hero-contacts"'),html.indexOf('<p class="secret-message"'));
for(const link of JSON.parse(readFileSync('src/data/socials.json','utf8')))assert.ok(hero.includes(link.url),`hero includes ${link.label}`);
console.log(`PASS: ${projects.length} projects across ${Object.keys(groups).length} groups, hero contacts, three selected projects, contact page`);
