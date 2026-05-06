import { Link, useLocation } from 'react-router-dom';
import { Dashboard, LayoutGrid, ListChecks } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Dashboard },
  { href: '/kanban', label: 'Kanban', icon: LayoutGrid },
  { href: '/servicos', label: 'Serviços', icon: ListChecks },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="flex h-full flex-col justify-between p-6">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              AV
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">AVMD Contábil</p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Painel</h2>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold">Acelere seu fluxo</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Organize leads e acompanhe o ciclo de atendimento com mais clareza.
          </p>
        </div>
      </div>
    </aside>
  );
}
