import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

const columns = [
  { key: 'iniciou_conversa', title: 'Iniciou Conversa' },
  { key: 'conversando', title: 'Conversando' },
  { key: 'agendado', title: 'Agendado' },
  { key: 'cliente', title: 'Cliente' },
];

const kanbanItems = [
  { id: '1', title: 'Reunião inicial', cliente: 'Cliente A', status: 'iniciou_conversa', due: 'Hoje' },
  { id: '2', title: 'Proposta enviada', cliente: 'Cliente B', status: 'conversando', due: 'Amanhã' },
  { id: '3', title: 'Agendamento confirmado', cliente: 'Cliente C', status: 'agendado', due: 'Em 2 dias' },
  { id: '4', title: 'Contrato assinado', cliente: 'Cliente D', status: 'cliente', due: 'Finalizado' },
];

export function KanbanBoard() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
              Quadro Kanban
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Fluxo de atendimento</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Acompanhe o progresso dos leads em cada etapa do funil comercial.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            Voltar ao Painel
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((column) => (
            <div
              key={column.key}
              className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{column.title}</h2>
              <div className="space-y-4">
                {kanbanItems.filter((item) => item.status === column.key).map((item) => (
                  <Card key={item.id} className="bg-slate-50 p-4 dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.cliente}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.due}
                      </span>
                    </div>
                  </Card>
                ))}
                {kanbanItems.filter((item) => item.status === column.key).length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum cartão nesta etapa.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
