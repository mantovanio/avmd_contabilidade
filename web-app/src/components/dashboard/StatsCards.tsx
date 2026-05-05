import React from 'react';
import { Users, Calendar, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface StatsCardsProps {
  stats: {
    totalLeads: number;
    agendamentos: number;
    emConversa: number;
    foraHorario: number;
  };
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total de Leads",
      value: stats.totalLeads,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Agendamentos",
      value: stats.agendamentos,
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Em Conversa",
      value: stats.emConversa,
      icon: MessageSquare,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Fora de Horário",
      value: stats.foraHorario,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`${card.bg} p-2 rounded-lg`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                card.value
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
