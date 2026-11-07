import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="nf">
      <h1>404</h1>
      <p>This page doesn't exist. The work does.</p>
      <Link className="btn btn--solid" to="/projects">See the work</Link>
    </section>
  );
}
