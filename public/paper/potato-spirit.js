/* Optional paper potato companion. No network requests, audio or page-click interception. */
(() => {
  if (document.querySelector('.potato-spirit')) return;
  const base = new URL('.', document.currentScript.src);
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet'; sheet.href = new URL('potato-spirit.css', base); document.head.append(sheet);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const host = document.createElement('div');
  host.className = 'potato-spirit';
  host.innerHTML = '<button class="potato-pet" type="button" aria-label="Pet potato spirit. Drag to move."><img draggable="false" alt="" width="100" height="115"><span class="potato-heart" aria-hidden="true">♡</span></button><span class="potato-reply" role="status"></span>';
  const dock = document.createElement('div');
  dock.className = 'potato-dock';
  dock.innerHTML = '<button type="button" class="potato-follow" aria-pressed="false">Follow me</button><button type="button" class="potato-hide" aria-label="Hide potato spirit">×</button><button type="button" class="potato-summon" hidden>Meet Potato</button>';
  document.body.append(host, dock);
  const pet = host.querySelector('button'), art = host.querySelector('img'), reply = host.querySelector('.potato-reply');
  const followButton = dock.querySelector('.potato-follow'), hideButton = dock.querySelector('.potato-hide'), summon = dock.querySelector('.potato-summon');
  art.src = new URL('assets/potato-spirit.png', base);
  let hidden = false, following = false, x = 0, y = 0, tx = 0, ty = 0, frame = 0, drag = null, dragged = false;
  let sleepTimer, replyTimer, effectTimer, petCount = 0;
  const remember = value => { try { localStorage.setItem('vasu-potato-hidden', String(value)); } catch {} };
  try { hidden = localStorage.getItem('vasu-potato-hidden') === 'true'; } catch {}
  const clamp = (value, max) => Math.max(8, Math.min(value, Math.max(8, max)));
  // Match the CSS footprint even before the asynchronously loaded sheet arrives.
  const bounds = () => innerWidth <= 600 ? { w: 80, h: 94 } : { w: 100, h: 115 };
  const bottomGap = () => innerWidth <= 600 ? 145 : 76;
  function paint() { host.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; host.classList.toggle('near-left', x < 180); }
  function limit() { const b = bounds(); x = clamp(x, innerWidth - b.w - 8); y = clamp(y, innerHeight - b.h - bottomGap()); tx = x; ty = y; paint(); }
  function home() { const b = bounds(); x = innerWidth - b.w - 23; y = innerHeight - b.h - bottomGap() - 20; limit(); }
  function say(text) { clearTimeout(replyTimer); reply.textContent = text; replyTimer = setTimeout(() => { reply.textContent = ''; }, 2300); }
  function wake() {
    host.classList.remove('is-sleeping'); clearTimeout(sleepTimer);
    if (!hidden && !document.hidden) sleepTimer = setTimeout(() => { if (!drag && !following) host.classList.add('is-sleeping'); }, 18000);
  }
  function stopFrame() { cancelAnimationFrame(frame); frame = 0; }
  function setFollowing(value) {
    following = value && fine.matches && !reduced.matches && !hidden;
    followButton.setAttribute('aria-pressed', String(following));
    followButton.textContent = following ? 'Park potato' : 'Follow me';
    host.classList.toggle('is-following', following);
    stopFrame(); wake();
  }
  function refresh() {
    host.hidden = hidden; summon.hidden = !hidden;
    hideButton.hidden = hidden; followButton.hidden = hidden || !fine.matches || reduced.matches;
    if (hidden) { setFollowing(false); clearTimeout(sleepTimer); }
    else wake();
  }
  function petIt() {
    wake(); host.classList.remove('is-happy');
    void host.offsetWidth; host.classList.add('is-happy');
    clearTimeout(effectTimer); effectTimer = setTimeout(() => host.classList.remove('is-happy'), 850);
    say(['Tiny potato. Big hello!', 'You found my happy spot.', 'Rooting for you!'][petCount++ % 3]);
  }
  function travel() {
    frame = 0;
    if (!following || hidden || document.hidden || reduced.matches) return;
    x += (tx - x) * .12; y += (ty - y) * .12; paint();
    if (Math.abs(tx - x) + Math.abs(ty - y) > .5) frame = requestAnimationFrame(travel);
  }
  document.addEventListener('pointermove', event => {
    if (!following || event.pointerType === 'touch' || event.target.closest('.potato-dock')) return;
    const b = bounds();
    tx = clamp(event.clientX + 32, innerWidth - b.w - 8);
    ty = clamp(event.clientY + 30, innerHeight - b.h - 76);
    if (!frame) frame = requestAnimationFrame(travel);
  }, { passive: true });
  pet.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    setFollowing(false); dragged = false;
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y };
    pet.setPointerCapture(event.pointerId); host.classList.add('is-held'); wake();
  });
  pet.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 5) dragged = true;
    x = drag.x + dx; y = drag.y + dy; limit();
  });
  function release(event) {
    if (!drag || event.pointerId !== drag.id) return;
    drag = null; host.classList.remove('is-held'); wake();
  }
  pet.addEventListener('pointerup', release);
  pet.addEventListener('pointercancel', release);
  pet.addEventListener('lostpointercapture', release);
  pet.addEventListener('click', event => { if (dragged && event.detail) { dragged = false; return; } petIt(); });
  followButton.addEventListener('click', () => { setFollowing(!following); say(following ? 'Lead the way!' : 'I will hang out here.'); });
  hideButton.addEventListener('click', () => { hidden = true; remember(true); refresh(); summon.focus(); });
  summon.addEventListener('click', () => { hidden = false; remember(false); refresh(); home(); pet.focus(); say('Oh, hello again!'); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && following) { setFollowing(false); home(); } });
  function preferences() { setFollowing(false); refresh(); }
  reduced.addEventListener('change', preferences); fine.addEventListener('change', preferences);
  addEventListener('resize', () => { setFollowing(false); limit(); });
  document.addEventListener('visibilitychange', () => {
    host.classList.toggle('is-paused', document.hidden);
    if (document.hidden) { stopFrame(); clearTimeout(sleepTimer); } else wake();
  });
  // Native dialogs keep their focus and visual space; the companion waits outside.
  function checkDialogs() {
    const open = !!document.querySelector('dialog[open]');
    host.classList.toggle('is-obscured', open); dock.classList.toggle('is-obscured', open);
    host.inert = open; dock.inert = open;
    if (open) setFollowing(false);
  }
  new MutationObserver(checkDialogs).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  art.addEventListener('error', () => { host.remove(); dock.remove(); stopFrame(); clearTimeout(sleepTimer); });
  home(); refresh(); checkDialogs();
})();
