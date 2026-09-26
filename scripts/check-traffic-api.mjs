import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import handler from '../api/traffic.js';
process.env.UPSTASH_REDIS_REST_URL='https://redis.test';process.env.UPSTASH_REDIS_REST_TOKEN='test';
let command;
globalThis.fetch=async(url,init)=>{command=JSON.parse(init.body)[0];return {ok:true,json:async()=>[{result:[101,42,3,7]}]}};
async function request(body,ua='test browser'){let result;const req=Readable.from([Buffer.from(JSON.stringify(body))]);req.method='POST';req.headers={'user-agent':ua};const res={setHeader(){},end(v){result=JSON.parse(v)}};await handler(req,res);return result}
const id='11111111-1111-4111-8111-111111111111';
let r=await request({visitorId:id,viewId:id,trackView:true,trackUnique:true,heartbeat:true});assert.equal(r.activeNow,3);assert.equal(r.visitorNumber,7);assert.equal(command[0],'EVAL');assert.deepEqual(command.slice(-5),[id,'1','1',command.at(-2),'1']);assert(command[1].includes("'NX'"));assert(command[1].includes("'HGET'"));assert(command[1].includes('90000'));
await request({visitorId:id,trackView:true,trackUnique:true,heartbeat:true},'Twitterbot');assert.equal(command.at(-5),'');assert.equal(command.at(-4),'0');assert.equal(command.at(-1),'0');
await request({visitorId:'invalid',trackView:false});assert.equal(command.at(-5),'');
console.log('API response, atomic Redis command, bot exclusion and invalid identity checks passed.');
