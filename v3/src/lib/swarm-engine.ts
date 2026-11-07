// Swarm engine: reads the live page into layers (boxes, media, text), blanks it, then a crowd of named cursors
// rebuilds it on the real DOM. Boxes are dragged out as selections, media fades in inside a frame, text is typed.
// Nothing is copied or re-rendered: boxes are hidden with an inline clip-path, media with opacity, and untyped
// text with a CSS highlight (colour: transparent), so the layout never moves and everything is restored exactly.
// Scrolling is never held: what is on screen is built first, and anything scrolled past unbuilt snaps into place.
// Entrance animations (rows rising in) are finished up front: being built is their entrance.
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Kind = 'box' | 'line' | 'media' | 'text'; // line: a border with no fill (a divider, an outline button)
type Task = {
  kind: Kind;
  el: HTMLElement;
  parent: Task | null; // nearest filled box around it: must be built first (a line never holds anything back)
  state: 0 | 1 | 2; // pending, taken, done
  px?: number; py?: number; // how far a box's drag has got (0..1 of its width / height): children under it can start
  saved?: string; // inline clip-path / opacity to put back
  node?: Text;
  full?: Range; // whole text node, for its position
  hidden?: Range; // the part still untyped
};
type Phase = 'idle' | 'move' | 'work' | 'rest' | 'leave';
type Cursor = {
  root: HTMLDivElement; sel: HTMLDivElement; dims: HTMLSpanElement; caret: HTMLDivElement;
  name: string; color: string; fg: string;
  x: number; y: number; fx: number; fy: number;
  i: number; wx: number; wy: number; phase: Phase; t: number; dur: number; wait: number; idle: number; bend: number;
  task: Task | null; tx: number; ty: number;
};

const NAMES = ['Kai', 'Mira', 'Juno', 'Odin', 'Nova', 'Iris', 'Leo', 'Zara', 'Finn', 'Luna', 'Remy', 'Sol', 'Ivy', 'Tao', 'Uma', 'Rex',
  'Wren', 'Ezra', 'Noor', 'Pip', 'Rio', 'Sage', 'Yuki', 'Ash', 'Cleo', 'Dex', 'Echo', 'Milo', 'Nia', 'Otto'];
const COLORS = ['#ff5a1f', '#7c5cff', '#ff4f9a', '#ffc400', '#00c27a', '#2bb8ff', '#ff3b3b', '#c6ff2e', '#ff8a00', '#b05cff', '#00d1c1', '#ff6fd8'];
const ATOMIC = new Set(['img', 'svg', 'video', 'canvas', 'picture', 'iframe']);
const SKIP = new Set(['script', 'style', 'noscript', 'template', 'link', 'meta']);
const HIDE = 'sw-hide';
const ARROW = '<svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 1.5v16.2l4.4-4 3 6.8 3-1.3-3-6.6h6.2z" fill="currentColor" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const seen = { opacityProperty: true, visibilityProperty: true };

function alpha(c: string) {
  if (!c || c === 'transparent') return 0;
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return 1;
  const p = m[1].split(/[\s,/]+/).filter(Boolean);
  return p.length > 3 ? parseFloat(p[3]) * (p[3].endsWith('%') ? 0.01 : 1) : 1;
}

/** What an element paints of its own: a filled frame (its contents wait for it), just a border (built alongside its
 *  contents), or nothing. A fill the colour of the page, or a zero-size background (a link's hover underline),
 *  shows nothing, so it is not a frame. */
function paint(cs: CSSStyleDeclaration, pageBg: string): 'box' | 'line' | null {
  const image = cs.backgroundImage !== 'none' && !/(^|[\s,])0px/.test(cs.backgroundSize);
  if (image || cs.boxShadow !== 'none' || (alpha(cs.backgroundColor) > 0 && cs.backgroundColor !== pageBg)) return 'box';
  const border = ['top', 'right', 'bottom', 'left'].some((s) => parseFloat(cs.getPropertyValue(`border-${s}-width`)) > 0
    && cs.getPropertyValue(`border-${s}-style`) !== 'none' && alpha(cs.getPropertyValue(`border-${s}-color`)) > 0);
  return border ? 'line' : null;
}

const sized = (el: Element) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };

/** Every layer on the page, parents before children (document order). */
function collect(root: Element): Task[] {
  const tasks: Task[] = [];
  const pageBg = getComputedStyle(document.documentElement).backgroundColor;
  const walk = (el: Element, parent: Task | null) => {
    if (SKIP.has(el.localName) || el.hasAttribute('data-swarm-skip')) return; // e.g. the route curtain
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    if (cs.position === 'fixed' && !el.checkVisibility(seen)) return; // closed overlays (curtain, palette)
    const h = el as HTMLElement;
    // A dense grid of empty cells (the heatmap) is one layer, not hundreds.
    const grid = el.childElementCount >= 24 && [...el.children].every((c) => !c.childElementCount);
    if (ATOMIC.has(el.localName) || grid) {
      if (sized(el)) tasks.push({ kind: 'media', el: h, parent, state: 0 });
      return;
    }
    let me = parent;
    const kind = !['html', 'body', 'main'].includes(el.localName) && sized(el) ? paint(cs, pageBg) : null;
    if (kind === 'box') {
      me = { kind: 'box', el: h, parent, state: 0 };
      tasks.push(me);
    } else if (kind === 'line') tasks.push({ kind: 'line', el: h, parent, state: 0 });
    for (const n of el.childNodes) {
      if (n.nodeType === 1) walk(n as Element, me);
      else if (n.nodeType === 3 && (n as Text).data.trim().length <= 2 && parseFloat(cs.fontSize) >= 48) {
        // A giant display letter (the VASU-DEVS wordmarks, some outlined) is dragged out like a frame, not typed.
        if (me?.el !== h && sized(h)) tasks.push({ kind: 'box', el: h, parent: me, state: 0 });
      } else if (n.nodeType === 3 && (n as Text).data.trim()) {
        const full = new Range();
        full.selectNodeContents(n);
        if (full.getBoundingClientRect().width > 0) tasks.push({ kind: 'text', el: h, parent: me, state: 0, node: n as Text, full });
      }
    }
  };
  walk(root, null);
  return tasks;
}

const rectOf = (t: Task) => (t.full ?? t.el).getBoundingClientRect();

/** Where the caret sits after `n` characters of a text node. */
function caretAt(node: Text, n: number) {
  const r = new Range();
  if (n > 0) {
    r.setStart(node, n - 1); r.setEnd(node, n);
    const rs = r.getClientRects();
    const b = rs[rs.length - 1];
    if (b && b.height) return { x: b.right, y: b.top, h: b.height };
  }
  r.setStart(node, 0); r.setEnd(node, Math.min(1, node.length));
  const b = r.getBoundingClientRect();
  return { x: b.left, y: b.top, h: b.height };
}

const fgFor = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#0d0d12' : '#fff';
};

/** One run over the page now on screen. `stop` tears it down at once (a route change); `done` says how it ended. */
export type SwarmRun = { done: Promise<'done' | 'skipped'>; stop: () => void };

/** `waitMs`: the page is blanked at once but the cursors start later (after the route curtain has lifted). */
export function runSwarm(waitMs = 0): SwarmRun {
  let stop = () => {};
  const done = new Promise<'done' | 'skipped'>((resolve) => {
    document.documentElement.classList.remove('swarming');
    // Scroll-in entrances (the experience rows) end in place: being built is their entrance. Pins and scrubs stay.
    for (const st of ScrollTrigger.getAll()) {
      if (!st.pin && !st.vars.scrub && st.animation) { st.animation.progress(1); st.kill(); }
    }
    const tasks = collect(document.body);
    const highlight = new Highlight();
    for (const t of tasks) {
      const s = t.el.style;
      if (t.kind === 'box') { t.saved = s.clipPath; s.clipPath = 'inset(0 100% 100% 0)'; }
      else if (t.kind === 'line') { t.saved = s.borderColor; s.borderColor = 'transparent'; }
      else if (t.kind === 'media') { t.saved = s.opacity; s.opacity = '0'; }
      else { t.hidden = t.full!.cloneRange(); highlight.add(t.hidden); }
    }
    CSS.highlights.set(HIDE, highlight);

    let done = 0;
    const finishTask = (t: Task) => {
      if (t.state === 2) return;
      t.state = 2;
      done++;
      if (t.kind === 'box') t.el.style.clipPath = t.saved ?? '';
      else if (t.kind === 'line') t.el.style.borderColor = t.saved ?? '';
      else if (t.kind === 'media') t.el.style.opacity = t.saved ?? '';
      else highlight.delete(t.hidden!);
    };

    // ---- overlay
    const root = document.createElement('div');
    root.className = 'sw';
    root.setAttribute('aria-hidden', 'true');
    const hud = document.createElement('div');
    hud.className = 'sw-hud';
    hud.innerHTML = '<span class="sw-faces"></span><span><b class="sw-n">0</b> agents</span><span><b class="sw-d">0</b>/<span class="sw-t">0</span> layers</span><i class="sw-bar"><i></i></i><span class="sw-hint">scroll to keep building</span><button type="button">Skip</button>';
    root.append(hud);
    document.body.append(root);
    const [faces, nEl, dEl, tEl, bar] = ['.sw-faces', '.sw-n', '.sw-d', '.sw-t', '.sw-bar i'].map((q) => hud.querySelector<HTMLElement>(q)!);
    tEl.textContent = String(tasks.length);

    const mobile = innerWidth < 700;
    const MAX = mobile ? 16 : 36;
    const MAX_RUSH = mobile ? 24 : 60; // while the visitor scrolls fast, more hands come in
    // Keeping up with the visitor: `rush` jumps with scroll speed and fades over about a second; `pace` divides
    // every move and job's time, so a fast scroller (or a big backlog on screen) is met by faster work.
    let rush = 0;
    let pace = 1;
    let lastY = scrollY;
    const cursors: Cursor[] = [];
    let made = 0;
    // Measured together a few times a second (not per cursor per frame), so scrolling stays smooth.
    let pool: { t: Task; r: DOMRect; edge: boolean }[] = []; // buildable now
    let waiting = 0; // in sight but not startable yet (its frame is still being drawn)
    let stuck = 0; // seconds with nothing left to build on screen while at the bottom of the page
    let ending = false;
    let last = performance.now();
    let surveyT = 0;
    let hudT = 0;
    let raf = 0;
    const active = () => cursors.filter((c) => c.phase !== 'leave');

    /** `from`: rushing in from the edge the visitor is scrolling toward; otherwise a random edge. */
    function spawn(from?: 'top' | 'bottom') {
      const color = COLORS[made % COLORS.length];
      const name = NAMES[made % NAMES.length];
      const fg = fgFor(color);
      const i = made++;
      const c = document.createElement('div');
      c.className = 'sw-cur';
      c.style.cssText = `--c:${color};--fg:${fg};color:${color}`;
      c.innerHTML = `${ARROW}<span class="sw-tag">${name}</span>`;
      const sel = document.createElement('div');
      sel.className = 'sw-sel';
      sel.style.cssText = `--c:${color};--fg:${fg}`;
      sel.innerHTML = '<i></i><i></i><i></i><i></i><span></span>';
      const caret = document.createElement('div');
      caret.className = 'sw-caret';
      caret.style.cssText = `--c:${color}`;
      root.prepend(sel, caret);
      root.append(c);
      // Enter from a random edge.
      const side = from === 'top' ? 2 : from === 'bottom' ? 3 : Math.floor(Math.random() * 4);
      const x = side === 0 ? -30 : side === 1 ? innerWidth + 30 : rand(0, innerWidth);
      const y = side === 2 ? -30 : side === 3 ? innerHeight + 30 : rand(0, innerHeight);
      cursors.push({ root: c, sel, dims: sel.querySelector('span')!, caret, name, color, fg, i, wx: -1e9, wy: -1e9, x, y, fx: x, fy: y,
        phase: 'idle', t: 0, dur: 0, wait: rand(0, 0.15), idle: 0, bend: 0, task: null, tx: x, ty: y });
    }

    const passed = (r: DOMRect) => r.width > 0 && (r.bottom < 0 || r.right < 0); // scrolled past (up, or out left in the rail)

    /** On screen, its frame (if any) dragged out over it, and not hidden by the page itself (a row awaiting its reveal).
     *  Media is checked on its parent: we faded it out ourselves. */
    /** Built where it can be watched: text mostly on screen, a frame a third on screen or covering a quarter of
     *  the view. Nothing is finished out of sight at the edge, and nothing near the edge is left waiting. */
    function inSight(t: Task, r: DOMRect) {
      const w = Math.min(r.right, innerWidth) - Math.max(r.left, 0);
      const h = Math.min(r.bottom, innerHeight - 8) - Math.max(r.top, 0);
      if (w <= 0 || h <= 0) return false;
      const seenArea = w * h;
      const view = innerWidth * innerHeight;
      return t.kind === 'box' || t.kind === 'line'
        ? seenArea >= Math.min(r.width * r.height * 0.35, view * 0.25)
        : seenArea >= Math.min(r.width * r.height * 0.6, view * 0.5);
    }

    /** 'main': well in view, built first. 'edge': visible at all (cut by the screen edge), built once the main work
     *  is taken, so nothing on screen is ever left blank. false: can't start yet. */
    function buildable(t: Task, r: DOMRect): 'main' | 'edge' | false {
      if (!(r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth)) return false;
      const p = t.parent;
      if (p && p.state !== 2) {
        if (p.state !== 1 || p.px === undefined) return false;
        const pr = p.el.getBoundingClientRect();
        if (r.right > pr.left + pr.width * p.px! + 1 || r.bottom > pr.top + pr.height * p.py! + 1) return false;
      }
      const host = t.kind === 'media' ? t.el.parentElement : t.el;
      if (host && !host.checkVisibility(seen)) return false;
      return inSight(t, r) ? 'main' : 'edge';
    }

    /** One pass over the page: what can be built now, and what was scrolled past unbuilt
     *  (that snaps into place, so scrolling back never lands on a blank). */
    function survey() {
      pool = [];
      waiting = 0;
      for (const t of tasks) {
        if (t.state !== 0) continue;
        const r = rectOf(t);
        if (passed(r)) finishTask(t);
        // A frame waiting just off to the right (the sideways project rail) is set out of sight, so the cards are
        // seen sliding in; the cursors fill them as they arrive.
        else if (t.kind === 'box' && r.left >= innerWidth - 4 && r.top < innerHeight && r.bottom > 0) finishTask(t);
        // Racing a fast scroller: a frame bigger than most of the screen snaps in so its contents can start now.
        else if (rush > 0.3 && t.kind === 'box' && r.width * r.height > innerWidth * innerHeight * 0.6 && r.top < innerHeight) finishTask(t);
        else {
          const tier = buildable(t, r);
          if (tier) pool.push({ t, r, edge: tier === 'edge' });
          else if (inSight(t, r)) waiting++;
        }
      }
    }

    /** The nearest layer this cursor can start. */
    function pick(c: Cursor): Task | null {
      let best: Task | null = null;
      let bestD = Infinity;
      for (const { t, r, edge } of pool) {
        if (t.state !== 0) continue;
        // Nearest, leaning top-down; edge pieces only once nothing well in view is left.
        const d = Math.hypot(r.left - c.x, r.top - c.y) + r.top * 0.5 + (edge ? 1e6 : 0);
        if (d < bestD) { best = t; bestD = d; }
      }
      return best;
    }

    /** Where a cursor stands to start a layer. */
    function startPoint(t: Task) {
      const r = rectOf(t);
      if (t.kind === 'box' || t.kind === 'line') return { x: r.left, y: Math.max(r.top, 6) };
      if (t.kind === 'media') return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      const k = caretAt(t.node!, 0);
      return { x: k.x, y: k.y + k.h };
    }

    function workDur(t: Task) {
      const r = rectOf(t);
      if (t.kind === 'box' || t.kind === 'line') return clamp(Math.hypot(r.width, Math.min(r.height, innerHeight)) / 2000, 0.24, 0.55);
      if (t.kind === 'media') return 0.38;
      return clamp(t.node!.length * 0.011, 0.09, 0.7);
    }

    function place(el: HTMLElement, x: number, y: number, w: number, h: number) {
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.width = `${Math.max(0, w)}px`;
      el.style.height = `${Math.max(0, h)}px`;
    }

    const dimsFor = (r: DOMRect, w: number, h: number) => (r.width < 70 || r.height < 24 ? '' : `${Math.round(w)} × ${Math.round(h)}`);

    function work(c: Cursor, p: number) {
      const t = c.task!;
      const r = rectOf(t);
      if (t.kind === 'box' || t.kind === 'line') {
        const top = Math.max(r.top, 6);
        const bottom = Math.max(Math.min(r.bottom, innerHeight - 6), top);
        c.x = r.left + r.width * p;
        c.y = top + (bottom - top) * p;
        t.px = r.width ? clamp((c.x - r.left) / r.width, 0, 1) : 1;
        t.py = r.height ? clamp((c.y - r.top) / r.height, 0, 1) : 1;
        if (t.kind === 'box') t.el.style.clipPath = `inset(0 ${(1 - t.px) * 100}% ${(1 - t.py) * 100}% 0)`;
        place(c.sel, r.left, r.top, c.x - r.left, c.y - r.top);
        c.dims.textContent = dimsFor(r, r.width * p, r.height * p);
      } else if (t.kind === 'media') {
        c.x = r.left + r.width / 2;
        c.y = r.top + r.height / 2;
        t.el.style.opacity = String(p);
        place(c.sel, r.left, r.top, r.width, r.height);
        c.dims.textContent = dimsFor(r, r.width, r.height);
      } else {
        const n = Math.round(t.node!.length * p);
        t.hidden!.setStart(t.node!, n);
        const k = caretAt(t.node!, n);
        if (k.h) {
          place(c.caret, k.x, k.y, 2, k.h);
          c.x = k.x + 1;
          c.y = k.y + k.h;
        }
      }
    }

    function leave(c: Cursor) {
      if (c.task && c.task.state === 1) c.task.state = 0; // hand it back
      c.task = null;
      c.sel.classList.remove('on');
      c.caret.classList.remove('on');
      c.root.classList.remove('tap');
      c.phase = 'leave'; c.t = 0; c.dur = rand(0.4, 0.6);
      c.fx = c.x; c.fy = c.y;
      c.tx = c.x < innerWidth / 2 ? -60 : innerWidth + 60;
      c.ty = c.y + rand(-120, 120);
    }

    function step(c: Cursor, dt: number) {
      c.t += dt;
      switch (c.phase) {
        case 'idle': {
          if ((c.wait -= dt) > 0) break;
          c.wait = 0.08;
          const t = ending ? null : pick(c);
          if (t) {
            t.state = 1;
            c.task = t;
            c.phase = 'move'; c.t = 0; c.idle = 0;
            c.fx = c.x; c.fy = c.y;
            const s = startPoint(t);
            const d = Math.hypot(s.x - c.x, s.y - c.y);
            c.dur = clamp(d / 1900, 0.18, 0.46) / pace;
            c.bend = d > 80 ? rand(-0.18, 0.18) : 0; // hands move in arcs, not rulers
          // Its work is done: it goes. It waits a moment only if something in view is about to free up.
          } else if ((c.idle += 0.08) > (waiting ? 1.2 : 0.3)) leave(c);
          break;
        }
        case 'move': {
          const s = startPoint(c.task!);
          const p = ease(Math.min(1, c.t / c.dur));
          const dx = s.x - c.fx;
          const dy = s.y - c.fy;
          const arc = Math.sin(Math.PI * p) * c.bend;
          c.x = c.fx + dx * p - dy * arc;
          c.y = c.fy + dy * p + dx * arc;
          if (c.t >= c.dur) {
            c.phase = 'work'; c.t = 0; c.dur = workDur(c.task!) / pace;
            c.root.classList.add('tap');
            if (c.task!.kind !== 'text') c.sel.classList.add('on');
            else if (c.task!.node!.length > 2) c.caret.classList.add('on'); // a lone display letter just appears
          }
          break;
        }
        case 'work': {
          if (c.task!.state === 2) { c.task = null; c.phase = 'rest'; c.t = 0; c.dur = 0; break; } // snapped meanwhile
          const p = Math.min(1, c.t / c.dur);
          work(c, c.task!.kind === 'text' ? p : ease(p));
          if (p >= 1) { finishTask(c.task!); c.task = null; c.phase = 'rest'; c.t = 0; c.dur = rand(0.06, 0.16); }
          break;
        }
        case 'rest':
          if (c.t >= c.dur) {
            c.sel.classList.remove('on'); c.caret.classList.remove('on'); c.root.classList.remove('tap');
            c.phase = 'idle'; c.wait = 0; c.tx = c.x; c.ty = c.y;
          }
          break;
        case 'leave': {
          const p = ease(Math.min(1, c.t / c.dur));
          c.x = c.fx + (c.tx - c.fx) * p;
          c.y = c.fy + (c.ty - c.fy) * p;
          if (p >= 1) { c.root.remove(); c.sel.remove(); c.caret.remove(); cursors.splice(cursors.indexOf(c), 1); return; }
          break;
        }
      }
      // Only write when it moved: a still cursor costs nothing per frame.
      if (Math.abs(c.x - c.wx) > 0.1 || Math.abs(c.y - c.wy) > 0.1) {
        c.root.style.transform = `translate(${c.x}px, ${c.y}px)`;
        c.wx = c.x; c.wy = c.y;
      }
    }

    function renderHud() {
      const a = active();
      nEl.textContent = String(a.length);
      dEl.textContent = String(done);
      bar.style.transform = `scaleX(${tasks.length ? done / tasks.length : 1})`;
      hud.classList.toggle('wait', !ending && !pool.length && done < tasks.length && !cursors.some((c) => c.task));
      faces.innerHTML = a.slice(0, 5).map((c) => `<i style="--c:${c.color};--fg:${c.fg}">${c.name[0]}</i>`).join('');
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if ((surveyT -= dt) <= 0) { survey(); surveyT = 0.12; }
      // A cursor comes in only for work nobody has picked up yet, and leaves when there is none.
      const open = pool.filter((e) => e.t.state === 0).length;
      const free = cursors.filter((c) => c.phase === 'idle' || c.phase === 'rest').length;
      const dy = scrollY - lastY;
      const speed = Math.abs(dy) / Math.max(dt, 0.001);
      lastY = scrollY;
      rush = Math.max(rush * Math.exp(-dt / 0.9), Math.min(1, speed / 2500));
      pace = 1 + rush * 1.5 + clamp(open / 40, 0, 0.6);
      if (!ending) {
        const rushing = rush > 0.3;
        let n = rushing || open > 20 ? 3 : 1;
        for (let k = 0; n > 0 && open > free + k && active().length < (rushing ? MAX_RUSH : MAX); k++, n--) {
          if (rushing || Math.random() < 0.5) spawn(rushing ? (dy >= 0 ? 'bottom' : 'top') : undefined);
        }
      }
      for (const c of [...cursors]) step(c, dt);
      if ((hudT -= dt) <= 0) { renderHud(); hudT = 0.1; }
      // Done, or nothing left that can come into view (bottom of the page and idle): wrap up.
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
      stuck = !pool.length && atBottom && !cursors.some((c) => c.task) ? stuck + dt : 0;
      if (!ending && (done >= tasks.length || stuck > 1.2)) wrapUp();
      if (ending && !cursors.length) { cleanup(); return; }
      raf = requestAnimationFrame(frame);
    }

    function wrapUp() {
      ending = true;
      for (const t of tasks) finishTask(t);
      renderHud();
      root.classList.add('out');
      for (const c of cursors) if (c.phase !== 'leave') leave(c);
    }

    let skipped = false;
    let closed = false;
    function cleanup() {
      if (closed) return;
      closed = true;
      cancelAnimationFrame(raf);
      for (const t of tasks) finishTask(t);
      CSS.highlights.delete(HIDE);
      removeEventListener('keydown', onKey, true);
      root.remove();
      resolve(skipped ? 'skipped' : 'done');
    }
    stop = cleanup;

    // Skip or Escape reveals everything at once (and ends the swarm for this visit). Links just work: a route
    // change stops this run and the next page gets its own.
    const skip = () => { skipped = true; if (!ending) wrapUp(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip(); };
    hud.querySelector('button')!.addEventListener('click', skip);
    addEventListener('keydown', onKey, true);

    const begin = setTimeout(() => {
      last = performance.now();
      survey();
      raf = requestAnimationFrame(frame);
    }, waitMs);
    stop = () => { clearTimeout(begin); cleanup(); };
  });
  return { done, stop };
}
