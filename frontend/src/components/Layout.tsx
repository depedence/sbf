import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  Tags,
  Wallet,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const NAV_ITEMS = [
  { to: '/', label: 'Обзор', icon: LayoutDashboard, end: true },
  { to: '/accounts', label: 'Счета', icon: Wallet },
  { to: '/categories', label: 'Категории', icon: Tags },
  { to: '/transactions', label: 'Операции', icon: ArrowLeftRight },
  { to: '/statistics', label: 'Статистика', icon: BarChart3 },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'text-ink-primary' : 'text-ink-secondary hover:text-ink-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-accent/15 border border-accent/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <item.icon className="relative h-4 w-4 shrink-0" />
              <span className="relative">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function Layout() {
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-base-950 text-ink-primary">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-56 -left-40 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[120px] animate-float" />
        <div className="absolute -bottom-56 -right-40 h-[30rem] w-[30rem] rounded-full bg-cyan-glow/10 blur-[120px] animate-floatSlow" />
      </div>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-base-700/80 bg-base-900/60 backdrop-blur-sm md:flex">
          <div className="flex items-center gap-2 px-5 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold shadow-glow">
              F
            </div>
            <span className="text-lg font-semibold tracking-tight">Finly</span>
          </div>
          <NavItems />
          <div className="border-t border-base-700/80 p-3">
            <div className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-ink-muted">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-base-700 text-ink-secondary uppercase">
                {email?.[0] ?? '?'}
              </div>
              <span className="truncate">{email}</span>
            </div>
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-expense/10 hover:text-expense"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-base-700/80 bg-base-950/80 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white text-sm font-bold">
                F
              </div>
              <span className="font-semibold">Finly</span>
            </div>
            <button onClick={() => setMobileOpen(true)} aria-label="Открыть меню">
              <Menu className="h-5 w-5" />
            </button>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-base-950/80 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-64 flex-col bg-base-900 border-r border-base-700"
            >
              <div className="flex items-center justify-between px-5 py-5">
                <span className="text-lg font-semibold">Finly</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Закрыть меню">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavItems onNavigate={() => setMobileOpen(false)} />
              <div className="border-t border-base-700 p-3">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary hover:bg-expense/10 hover:text-expense"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
