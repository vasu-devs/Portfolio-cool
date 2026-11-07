// Parity: the TS port must reproduce what JustHireMe's Python gate returned for the same leads (fixture recorded from Python).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fx from './jhm-gate-parity.json' with { type: 'json' };
import { evaluateLead } from './jhmGate.ts';

for (const c of fx.cases) {
  test(`gate parity: ${c.name}`, () => {
    const got = evaluateLead(c.lead, { targetLevel: c.target, now: fx.now });
    assert.deepEqual({ accepted: got.accepted, score: got.score, reason: got.reason }, c.expect);
  });
}
