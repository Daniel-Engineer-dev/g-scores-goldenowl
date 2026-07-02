import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Search Scores' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
];

interface Props {
  mobileOpen: boolean;
  onNavigate: () => void;
}

export default function Sidebar({ mobileOpen, onNavigate }: Props) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
      <h2 className="sidebar-title">Menu</h2>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
