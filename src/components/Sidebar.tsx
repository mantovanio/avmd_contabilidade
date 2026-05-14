import {
  LayoutDashboard,
  ShoppingCart,
  MessageSquare,
  RefreshCw,
  DollarSign,
  BarChart2,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AgencyConfig } from '@/lib/agencyConfig'

export type Page =
  | 'dashboard'
  | 'comercial'
  | 'chat'
  | 'renovacoes'
  | 'financeiro'
  | 'relatorios'
  | 'parceiros'
  | 'configuracoes'

interface Props {
  activePage: Page
  onNavigate: (page: Page) => void
  allowedPages?: Page[]
  onLogout?: () => void
  agencyConfig?: AgencyConfig
}

const ALL_ITEMS: { id: Page; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard'       },
  { id: 'comercial',     icon: ShoppingCart,    label: 'Comercial'       },
  { id: 'chat',          icon: MessageSquare,   label: 'Chat ao Vivo'    },
  { id: 'renovacoes',    icon: RefreshCw,       label: 'Renovações'      },
  { id: 'financeiro',    icon: DollarSign,      label: 'Financeiro'      },
  { id: 'relatorios',    icon: BarChart2,       label: 'Relatórios'      },
  { id: 'parceiros',     icon: Users,           label: 'Parceiros'       },
  { id: 'configuracoes', icon: Settings,        label: 'Configurações'   },
]

export default function Sidebar({ activePage, onNavigate, allowedPages, onLogout, agencyConfig }: Props) {
  const items = allowedPages
    ? ALL_ITEMS.filter(i => allowedPages.includes(i.id))
    : ALL_ITEMS

  return (
    <aside className="w-16 flex flex-col items-center py-4 gap-1 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
      {agencyConfig?.logo_url?.trim() ? (
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 dark:border-gray-800 flex items-center justify-center p-1.5 mb-3 overflow-hidden">
          <img src={agencyConfig.logo_url} alt={agencyConfig.nome_agencia} className="w-full h-full object-contain" />
        </div>
      ) : (
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-3"
          style={{ backgroundColor: agencyConfig?.cor_primaria ?? '#2563eb' }}
        >
          ID
        </div>
      )}

      <nav className="flex flex-col items-center gap-1 flex-1">
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            title={label}
            type="button"
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
              activePage === id
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300',
            )}
          >
            <Icon size={18} />
          </button>
        ))}
      </nav>

      <button
        type="button"
        title="Sair"
        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
        onClick={onLogout}
      >
        <LogOut size={18} />
      </button>
    </aside>
  )
}
