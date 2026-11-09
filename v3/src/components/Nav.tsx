import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { openAgent } from '../lib/agent';
import { person } from '../content';
import { asset } from '../lib/asset';
import { setSound, soundOn } from '../lib/sound';
import { lenis } from '../lib/smooth';

export function Nav() {
  const [busy, setBusy] = useState(false);
  const [sound, setSoundState] = useState(soundOn);
  const { pathname } = useLocation();
  useEffect(() => {
    const on = (e: Event) => setBusy((e as CustomEvent<boolean>).detail);
    window.addEventListener('agent:busy', on);
    return () => window.removeEventListener('agent:busy', on);
  }, []);
  return (
    <header className="nav">
      {/* Already home: the route doesn't change, so glide back up to the hero instead. */}
      <Link to="/" className="nav-mark" onClick={() => { if (pathname === '/') lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }); }}>Vasu-Devs</Link>
      <nav aria-label="Pages">
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <button className={`nav-ask${busy ? ' is-busy' : ''}`} onClick={() => openAgent()} aria-label="Ask my agent (Command K)">
        <img src={asset('img/mascot.webp')} alt="" width={28} height={27} />
        <span>Ask</span>
        <kbd>⌘K</kbd>
      </button>
      <button className={`nav-sound${sound ? '' : ' is-off'}`} onClick={() => { setSound(!sound); setSoundState(!sound); }} aria-pressed={sound} aria-label={sound ? 'Mute sounds' : 'Turn sounds on'}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />{sound
          ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          : <path d="M16 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}</svg>
      </button>
      <a className="nav-cta" href={person.call} target="_blank" rel="noreferrer">Book a call</a>
    </header>
  );
}
