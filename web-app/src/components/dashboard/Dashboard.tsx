import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { StatsCards } from './StatsCards';
import { Charts } from './Charts';
import { LeadsTable } from './LeadsTable';
import { DateFilters } from './DateFilters';
import { 
  startOfDay, endOfDay, subDays, startOfMonth, 
  endOfMonth, subMonths, isWithinInterval 
} from 'date-fns';
import { LogOut, Moon, Sun, LayoutGrid, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('7days');
  const [leads, setLeads] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads_contabilidade')
        .select('*')
        .order('inicio_atendimento', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const getFilteredLeads = () => {
    const now = new Date();
    let start: Date;
    let end = endOfDay(now);

    switch (filter) {
      case 'today':
        start = startOfDay(now);
        break;
      case 'yesterday':
        start = startOfDay(subDays(now, 1));
        end = endOfDay(subDays(now, 1));
        break;
      case '7days':
        start = startOfDay(subDays(now, 7));
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        break;
      case 'lastMonth':
        start = startOfMonth(subMonths(now, 1));
        end = endOfMonth(subMonths(now, 1));
        break;
      case 'all':
      default:
        return leads;
    }

    return leads.filter(lead => {
      const date = new Date(lead.inicio_atendimento);
      return isWithinInterval(date, { start, end });
    });
  };

  const filteredLeads = getFilteredLeads();

  // Stats calculation
  const stats = {
    totalLeads: filteredLeads.length,
    agendamentos: filteredLeads.filter(l => l.status === 'agendado').length,
    emConversa: filteredLeads.filter(l => l.status === 'conversando').length,
    foraHorario: filteredLeads.filter(l => l.horario_comercial === false).length,
  };

  // Chart data processing
  const barData = [
    { status: 'Iniciou', count: filteredLeads.filter(l => l.status === 'iniciou_conversa').length },
    { status: 'Conversando', count: filteredLeads.filter(l => l.status === 'conversando').length },
    { status: 'Agendado', count: filteredLeads.filter(l => l.status === 'agendado').length },
    { status: 'Cliente', count: filteredLeads.filter(l => l.status === 'cliente').length },
    { status: 'Perdido', count: filteredLeads.filter(l => l.status === 'perdido').length },
  ];

  const pieData = [
    { name: 'Horário Comercial', value: filteredLeads.filter(l => l.horario_comercial === true).length },
    { name: 'Fora de Horário', value: filteredLeads.filter(l => l.horario_comercial === false).length },
  ];

  // Group by date for line chart
  const groupByDate = () => {
    const groups: Record<string, number> = {};
    filteredLeads.forEach(lead => {
      const date = new Date(lead.inicio_atendimento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      groups[date] = (groups[date] || 0) + 1;
    });
    return Object.entries(groups)
      .map(([date, count]) => ({ date, count }))
      .reverse();
  };

  const lineData = groupByDate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              AV
            </div>
            <h1 className="text-xl font-bold tracking-tight m-0">AVMD Contábil</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/kanban"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              <LayoutGrid size={18} />
              Kanban
            </Link>
            <Link
              to="/servicos"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Serviços Contábeis"
            >
              <FileSpreadsheet size={20} />
            </Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Painel de Leads</h2>
            <p className="text-muted-foreground">Monitore o desempenho comercial em tempo real.</p>
          </div>
          <DateFilters currentFilter={filter} onFilterChange={setFilter} />
        </div>

        <div className="space-y-8">
          <StatsCards stats={stats} loading={loading} />
          
          <Charts 
            lineData={lineData} 
            barData={barData} 
            pieData={pieData} 
            loading={loading} 
          />

          <LeadsTable leads={filteredLeads.slice(0, 10)} loading={loading} />
        </div>
      </main>
    </div>
  );
}
