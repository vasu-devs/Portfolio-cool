import type { DNode, Diagram } from '../data/diagrams';

const H = 76;
const W = 210;
// Boxes grow to fit their label (mono glyphs are ~13px wide at this size).
const width = (n: DNode) => n.w ?? Math.max(W, n.label.length * 13.2 + 40);

// Wire from a to b: leaves the side facing b and arrives on the side facing a.
function wire(a: DNode, b: DNode) {
  const ax = a.x + width(a) / 2, ay = a.y + H / 2, bx = b.x + width(b) / 2, by = b.y + H / 2;
  if (Math.abs(bx - ax) >= Math.abs(by - ay)) {
    const s = bx > ax ? 1 : -1;
    const x1 = ax + (s * width(a)) / 2, x2 = bx - (s * width(b)) / 2, mx = (x1 + x2) / 2;
    return `M${x1},${ay} C${mx},${ay} ${mx},${by} ${x2},${by}`;
  }
  const s = by > ay ? 1 : -1;
  const y1 = ay + (s * H) / 2, y2 = by - (s * H) / 2, my = (y1 + y2) / 2;
  return `M${ax},${y1} C${ax},${my} ${bx},${my} ${bx},${y2}`;
}

export function Pipeline({ id, d, caption = true }: { id: string; d: Diagram; caption?: boolean }) {
  const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
  return (
    <figure className="pipe">
      <svg viewBox="0 0 1000 540" role="img" aria-label={`${id} architecture: ${d.nodes.map((n) => n.label).join(', ')}`}>
        {d.edges.map(([a, b], i) => (
          <path key={i} id={`${id}-e${i}`} className="pipe-wire" d={wire(byId[a], byId[b])} />
        ))}
        {d.edges.map(([,], i) =>
          [0, 1].map((k) => (
            <circle key={`${i}-${k}`} className="pipe-packet" r="6">
              <animateMotion dur="2.4s" begin={`-${(i * 0.37 + k * 1.2) % 2.4}s`} repeatCount="indefinite">
                <mpath href={`#${id}-e${i}`} />
              </animateMotion>
            </circle>
          )),
        )}
        {d.nodes.map((n) => (
          <g key={n.id} className={`pipe-node pipe-node--${n.kind ?? 'step'}`} transform={`translate(${n.x},${n.y})`}>
            <rect width={width(n)} height={H} rx={n.kind === 'store' ? 38 : 12} />
            <text x={18} y={n.sub ? 32 : 45} className="pipe-label">{n.label}</text>
            {n.sub && <text x={18} y={56} className="pipe-sub">{n.sub}</text>}
          </g>
        ))}
      </svg>
      {caption && <figcaption>{d.caption}</figcaption>}
    </figure>
  );
}
