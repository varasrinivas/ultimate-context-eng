import { NavLink } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import './layout.css';

const LINKS = [
  { to: '/', label: 'Review queue', icon: '☰', end: true },
  { to: '/requests', label: 'Requests', icon: '⎘', end: false },
  { to: '/members', label: 'Members', icon: '⌘', end: false },
  { to: '/submit', label: 'Submit request', icon: '＋', end: false },
];

export function NavRail() {
  const { theme, toggleTheme } = useSession();
  return (
    <nav className="rail" aria-label="Primary">
      <div className="rail-brand">
        MedFlow
        <span className="sub">prior-auth copilot</span>
      </div>
      {LINKS.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
          <span aria-hidden="true">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
      <div className="spacer" />
      <button type="button" className="theme-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
        <span aria-hidden="true">{theme === 'light' ? '◐' : '◑'}</span>
        {theme === 'light' ? 'Dark theme' : 'Light theme'}
      </button>
    </nav>
  );
}
