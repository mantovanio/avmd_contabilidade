import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { cn } from '@/lib/utils'

type Tab = 'vendas' | 'renovacoes' | 'parceiros' | 'certificados' | 'financeiro'

const TABS: { id: Tab; label: string }[] = [
  { id: 'vendas',       label: 'Vendas'               },
  { id: 'renovacoes',   label: 'Renovações'           },
  { id: 'parceiros',    label: 'Análise Parceiros'    },
  { id: 'certificados', label: 'Certificados Emitidos'},
  { id: 'financeiro',   label: 'Financeiro'           },
]

const TENDENCIA_MENSAL = [
  { mes: 'Jun/25', total: 187 }, { mes: 'Jul/25', total: 175 },
  { mes: 'Ago/25', total: 136 }, { mes: 'Set/25', total: 154 },
  { mes: 'Out/25', total: 157 }, { mes: 'Nov/25', total: 200 },
  { mes: 'Dez/25', total: 175 }, { mes: 'Jan/26', total: 234 },
  { mes: 'Fev/26', total: 221 }, { mes: 'Mar/26', total: 234 },
  { mes: 'Abr/26', total: 221 }, { mes: 'Mai/26', total: 51  },
]

const POR_CANAL = [
  { canal: 'E-Commerce', emissoes: 234, fill: '#8B5CF6' },
  { canal: 'Balcão',     emissoes: 188, fill: '#3B82F6' },
  { canal: 'Pré-pago',   emissoes: 51,  fill: '#F97316' },
  { canal: 'Vouchers',   emissoes: 0,   fill: '#10B981' },
  { canal: 'Ext.',       emissoes: 0,   fill: '#EF4444' },
]

const POR_TIPO = [
  { name: 'e-CPF A1',  value: 180, fill: '#3B82F6' },
  { name: 'e-CPF A3',  value: 120, fill: '#8B5CF6' },
  { name: 'e-CNPJ A1', value: 95,  fill: '#10B981' },
  { name: 'e-CNPJ A3', value: 60,  fill: '#F59E0B' },
  { name: 'NF-e / SSL',value: 18,  fill: '#EF4444' },
]

const TOP_PARCEIROS = [
  { nome: 'Parceiro Alpha',  emissoes: 87, valor: 'R$ 18.500', variacao: '+12%' },
  { nome: 'Parceiro Beta',   emissoes: 64, valor: 'R$ 13.200', variacao: '+5%'  },
  { nome: 'Parceiro Gamma',  emissoes: 45, valor: 'R$  9.800', variacao: '-3%'  },
  { nome: 'Parceiro Delta',  emissoes: 38, valor: 'R$  7.600', variacao: '+20%' },
  { nome: 'Parceiro Epsilon',emissoes: 22, valor: 'R$  4.200', variacao: '-8%'  },
]

const RECEITA_MENSAL = [
  { mes: 'Jan/26', receita: 42300 }, { mes: 'Fev/26', receita: 39800 },
  { mes: 'Mar/26', receita: 44500 }, { mes: 'Abr/26', receita: 41200 },
  { mes: 'Mai/26', receita: 9200  },
]

export default function Relatorios() {
  const [tab, setTab] = useState<Tab>('vendas')

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-6 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto shrink-0">
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={cn('px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors',
              tab === t.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800')}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* VENDAS */}
        {tab === 'vendas' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Mai/2026',  value: '51',    sub: '⚠ -77% vs Abr', color: 'text-red-500' },
                { label: 'Melhor mês',      value: '234',   sub: 'Jan/2026',       color: 'text-green-600 dark:text-green-400' },
                { label: 'Média mensal',    value: '179',   sub: 'últimos 12 meses',color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Canal top',       value: 'E-Com', sub: '53% das vendas', color: 'text-purple-600 dark:text-purple-400' },
              ].map(c => (
                <div key={c.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                  <p className={cn('text-2xl font-bold', c.color)}>{c.value}</p>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5">{c.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Tendência Mensal de Emissões (12 meses)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={TENDENCIA_MENSAL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Emissões" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Emissões por Canal — Mai/2026</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={POR_CANAL}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="canal" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="emissoes" radius={[4, 4, 0, 0]} name="Emissões">
                      {POR_CANAL.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Mix por Tipo de Certificado</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={POR_TIPO} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(((percent as number) ?? 0) * 100).toFixed(0)}%`}>
                      {POR_TIPO.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* FINANCEIRO */}
        {tab === 'financeiro' && (
          <div className="space-y-5">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Receita Bruta Mensal (R$)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={RECEITA_MENSAL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#10B981" radius={[4, 4, 0, 0]} name="Receita" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* PARCEIROS */}
        {tab === 'parceiros' && (
          <div className="space-y-5">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Top 5 Parceiros — Mai/2026</h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">
                    {['Parceiro','Emissões','Receita','Variação'].map(h => <th key={h} className="px-5 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {TOP_PARCEIROS.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 font-medium">{p.nome}</td>
                      <td className="px-5 py-3">{p.emissoes}</td>
                      <td className="px-5 py-3 text-green-600 dark:text-green-400 font-medium">{p.valor}</td>
                      <td className="px-5 py-3">
                        <span className={cn('text-xs font-semibold', p.variacao.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
                          {p.variacao}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OUTROS TABS — PLACEHOLDER */}
        {(tab === 'renovacoes' || tab === 'certificados') && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="font-medium">{TABS.find(t => t.id === tab)?.label}</p>
            <p className="text-sm mt-1">Relatório disponível após integração com CertiID.</p>
          </div>
        )}
      </div>
    </div>
  )
}
