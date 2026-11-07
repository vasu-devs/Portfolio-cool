// Run: npm test  (node's built-in runner with type stripping)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relevant, validate } from './agent.ts';

const user = (content: string) => ({ role: 'user', content });

test('accepts a normal conversation and trims and caps text', () => {
  const out = validate({ messages: [user('  hi  '), { role: 'assistant', content: 'hello' }, user('x'.repeat(5000))] });
  assert.equal(out?.length, 3);
  assert.equal(out?.[0].content, 'hi');
  assert.equal((out?.[2].content as string).length, 1200);
});

test('rejects bad shapes', () => {
  assert.equal(validate(null), null);
  assert.equal(validate({ messages: [] }), null);
  assert.equal(validate({ messages: [{ role: 'system', content: 'x' }] }), null);
  assert.equal(validate({ messages: [user('a'), { role: 'assistant', content: 'b' }] }), null, 'must end with the visitor');
  assert.equal(validate({ messages: [{ role: 'assistant', content: 'b' }, user('a')] }), null, 'must start with the visitor');
  assert.equal(validate({ messages: [user('   ')] }), null);
  assert.equal(validate({ messages: [user({ text: 'x' } as unknown as string)] }), null);
  assert.equal(validate({ messages: Array.from({ length: 13 }, () => user('a')) }), null);
});

import { fallbackAnswer, matchAnswer } from './fallback.ts';

test('keyless fallback routes common questions to a useful answer', () => {
  assert.match(fallbackAnswer('im the owner of withlayer.ai how can he help me?'), /Voice AI, AI agents/);
  assert.match(fallbackAnswer('How fast are your voice agents?'), /54 ms/);
  assert.match(fallbackAnswer('Walk me through the fintech platform'), /18 days/);
  assert.match(fallbackAnswer('what is justhireme'), /\[\[go:\/projects\/justhireme\]\]/);
  assert.match(fallbackAnswer('asdf qwerty'), /cal\.com\/vasu-devs/);
  assert.equal(matchAnswer('asdf qwerty'), null);
});

test('relevant: a question pulls in the projects it is about, and nothing for off-topic ones', () => {
  assert.match(relevant('What did he do on the H200 GPU kernels?')[0].title, /GPU Kernels/);
  assert.match(relevant('tell me about the 3d room scanning app')[0].title, /Echo/);
  assert.ok(relevant('Is he good for a voice AI agent project?').every((p) => /voice/i.test(`${p.title} ${p.summary} ${p.skills}`)));
  assert.equal(relevant('what is his salary').length, 0);
});
