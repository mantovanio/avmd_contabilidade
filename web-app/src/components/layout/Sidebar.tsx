import { Link, useLocation } from 'react-router-dom';
import { BarChart3, LayoutGrid, ListChecks } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/kanban', label: 'Kanban', icon: LayoutGrid },
  { href: '/servicos', label: 'Serviços', icon: ListChecks },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-full max-w-full shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col justify-between p-6">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              AV
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">AVMD Contábil</p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Aplicações</h2>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Menu Lateral</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Selecione a aplicação que deseja usar no projeto.
            </p>
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
                      ? 'bg-slate-100 text-slate-900 shadow-sm shadow-slate-200 dark:bg-slate-800 dark:text-white dark:shadow-none'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold">Acessos rápidos</p>
          <div className="mt-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
            >
              <span>Ver painel</span>
              <BarChart3 size={16} />
            </Link>
            <Link
              to="/kanban"
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
            >
              <span>Ir ao Kanban</span>
              <LayoutGrid size={16} />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
