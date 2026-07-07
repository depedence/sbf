import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/dashboard', label: 'Счета' },
  { to: '/transactions', label: 'Транзакции' },
  { to: '/categories', label: 'Категории' },
  { to: '/statistics', label: 'Статистика' },
];

export default function Layout() {
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-full flex flex-col md:flex-row">
      <aside className="md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-border bg-surface flex md:flex-col">
        <div className="px-5 py-4 border-b border-border hidden md:block">
          <p className="text-sm font-semibold text-ink-primary">SellBuyFix</p>
          {email && <p className="text-xs text-ink-muted truncate">{email}</p>}
        </div>
        <nav className="flex md:flex-col flex-1 overflow-x-auto md:overflow-visible">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-5 py-3 text-sm whitespace-nowrap border-l-2 transition-colors ${
                  isActive
                    ? 'border-accent text-ink-primary bg-raised'
                    : 'border-transparent text-ink-secondary hover:text-ink-primary hover:bg-raised'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 md:mt-auto md:border-t border-border flex items-center">
          <button type="button" onClick={handleLogout} className="btn-secondary w-full text-sm">
            Выйти
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
