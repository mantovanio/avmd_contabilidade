import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface Lead {
  id: string;
  nome_lead: string;
  status: string;
  inicio_atendimento: string;
  telefone?: string;
  email?: string;
}

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
}

const statusColors: Record<string, string> = {
  'agendado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'conversando': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'iniciou_conversa': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  'cliente': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'perdido': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function LeadsTable({ leads, loading }: LeadsTableProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Últimos Leads</CardTitle>
        <CardDescription>Resumo dos contatos mais recentes recebidos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Início Atendimento</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4"><div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" /></td>
                    <td className="p-4"><div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full" /></td>
                    <td className="p-4"><div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">Nenhum lead encontrado</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 font-medium">
                      <Link to={`/lead/${lead.id}`} className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-colors">
                        {lead.nome_lead || 'Sem Nome'}
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[lead.status] || 'bg-slate-100 text-slate-700'}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {lead.inicio_atendimento ? format(new Date(lead.inicio_atendimento), "dd 'de' MMMM, HH:mm", { locale: ptBR }) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
