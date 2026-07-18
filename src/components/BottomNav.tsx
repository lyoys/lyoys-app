import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Início', icon: '⌂' },
  { to: '/servicos', label: 'Serviços', icon: '✦' },
  { to: '/casting', label: 'Casting', icon: '🎭' },
  { to: '/perfil', label: 'Perfil', icon: '☺' },
  { to: '/sobre', label: 'Sobre', icon: 'ℹ' },
  { to: '/contato', label: 'Contato', icon: '✉' }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
