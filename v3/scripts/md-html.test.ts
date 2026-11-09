import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mdToHtml } from './md-html.ts';

test('turns the Markdown the site writes into safe HTML', () => {
  assert.equal(mdToHtml('# A <b> & "c"'), '<h1>A &lt;b&gt; &amp; &quot;c&quot;</h1>');
  assert.equal(mdToHtml('- **1.77×** faster\n- [Svara](https://x.dev/svara): voice'), '<ul><li><strong>1.77×</strong> faster</li><li><a href="https://x.dev/svara">Svara</a>: voice</li></ul>');
  assert.equal(mdToHtml('Code: https://github.com/a/b'), '<p>Code: <a href="https://github.com/a/b">https://github.com/a/b</a></p>');
  assert.equal(mdToHtml('1. A (b)\n2. C + D'), '<ol><li>A (b)</li><li>C + D</li></ol>');
  assert.equal(mdToHtml('> Hi\n\n---\n\none\ntwo'), '<blockquote><p>Hi</p></blockquote>\n<hr>\n<p>one two</p>');
});
