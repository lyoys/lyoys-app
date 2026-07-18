import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        LY<span>ØY</span>S
      </Link>
      <Link to="/casting" className="btn secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
        Casting
      </Link>
    </header>
  );
}
