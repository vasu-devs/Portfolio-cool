import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { openAgent } from '../lib/agent';
import { person } from '../content';
import { asset } from '../lib/asset';

export function Nav() {
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setBusy((e as CustomEvent<boolean>).detail);
    window.addEventListener('agent:busy', on);
    return () => window.removeEventListener('agent:busy', on);
  }, []);
  return (
    <header className="nav">
      <Link to="/" className="nav-mark">Vasu-Devs</Link>
      <nav aria-label="Pages">
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <button className={`nav-ask${busy ? ' is-busy' : ''}`} onClick={() => openAgent()} aria-label="Ask my agent (Command K)">
        <img src={asset('img/mascot.webp')} alt="" width={28} height={27} />
        <span>Ask</span>
        <kbd>⌘K</kbd>
      </button>
      <a className="nav-cta" href={person.call} target="_blank" rel="noreferrer">Book a call</a>
    </header>
  );
}
