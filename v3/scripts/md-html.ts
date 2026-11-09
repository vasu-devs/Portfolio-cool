// Just enough Markdown to HTML for the pages the build prerenders from src/lib/markdown.ts (which only writes
// headings, paragraphs, quotes, "- " and "1. " lists, rules, **bold**, [links](url) and bare URLs).
// shortcut: not a general Markdown parser; use a real one (e.g. marked) if markdown.ts ever writes more than this.
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s: string) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
  .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2">$2</a>');

export function mdToHtml(md: string) {
  return md.trim().split(/\n{2,}/).map((block) => {
    const h = block.match(/^(#{1,6}) (.*)$/);
    if (h) return `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`;
    if (block === '---') return '<hr>';
    if (block.startsWith('> ')) return `<blockquote><p>${inline(block.slice(2))}</p></blockquote>`;
    const lines = block.split('\n');
    if (lines.every((l) => l.startsWith('- '))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    if (lines.every((l) => /^\d+\. /.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
    return `<p>${inline(lines.join(' '))}</p>`;
  }).join('\n');
}
