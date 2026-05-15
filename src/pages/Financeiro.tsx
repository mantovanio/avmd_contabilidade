import { useState, useEffect, useCallback } from 'react'
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { LancamentoV2, ContaBancaria, NovoLancamento, TipoLancamento, StatusLancamento } from '@/types'

type Tab = 'pagarReceber' | 'contas' | 'centros' | 'split' | 'fiscal'

const TABS: { id: Tab; label: string }[] = [
  { id: 'pagarReceber', label: 'Pagar / Receber'  },
  { id: 'contas',       label: 'Contas Bancárias' },
  { id: 'centros',      label: 'Centro de Custos' },
  { id: 'split',        label: 'Extrato Split'    },
  { id: 'fiscal',       label: 'Fiscal'           },
]

const CATEGORIAS = ['Vendas','Repasses','Comissões','Operacional','SaaS','Outros']

const EMPTY_LANC: NovoLancamento = {
  tipo: 'receber', descricao: '', vencimento: '',
  valor: 0, status: 'pendente', categoria: null,
}

const MOCK_CENTROS = [
  { nome: 'Vendas Balcão',  orcamento: 5000,  realizado: 4820 },
  { nome: 'E-Commerce',     orcamento: 8000,  realizado: 7650 },
  { nome: 'Operacional',    orcamento: 4000,  realizado: 3210 },
  { nome: 'Comissões',      orcamento: 2500,  realizado: 1890 },
  { nome: 'Mídias/Estoque', orcamento: 1500,  realizado:  320 },
]

export default function Financeiro() {
  const [tab, setTab]           = useState<Tab>('pagarReceber')
  const [lancs, setLancs]       = useState<LancamentoV2[]>([])
  const [contas, setContas]     = useState<ContaBancaria[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | TipoLancamento>('todos')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState<NovoLancamento>(EMPTY_LANC)
  const [salvando, setSalvando] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: l, error: e1 }, { data: c, error: e2 }] = await Promise.all([
      supabase.from('lancamentos_financeiros').select('*').order('vencimento', { ascending: true }),
      supabase.from('contas_bancarias').select('*').eq('ativo', true).order('banco'),
    ])
    if (e1 ?? e2) { setError((e1 ?? e2)!.message); setLoading(false); return }
    setLancs(l as LancamentoV2[])
    setContas(c as ContaBancaria[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function salvarLancamento() {
    if (!form.descricao.trim() || !form.vencimento || form.valor <= 0) return
    setSalvando(true)
    const { error: err } = await supabase.from('lancamentos_financeiros').insert([form])
    setSalvando(false)
    if (err) { alert('Erro: ' + err.message); return }
    setShowForm(false); setForm(EMPTY_LANC); fetchData()
  }

  async function atualizarStatusLanc(id: string, status: StatusLancamento) {
    await supabase.from('lancamentos_financeiros').update({ status }).eq('id', id)
    setLancs(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const filtrados   = lancs.filter(l => tipoFiltro === 'todos' || l.tipo === tipoFiltro)
  const aReceber    = lancs.filter(l => l.tipo === 'receber' && l.status === 'pendente').reduce((s, l) => s + l.valor, 0)
  const aPagar      = lancs.filter(l => l.tipo === 'pagar'   && l.status === 'pendente').reduce((s, l) => s + l.valor, 0)
  const recebido    = lancs.filter(l => l.status === 'recebido').reduce((s, l) => s + l.valor, 0)
  const saldoTotal  = contas.reduce((s, c) => s + c.saldo, 0)

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

      <div className="flex-1 overflow-auto p-6 space-y-5">

        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 rounded-lg p-4 text-sm">{error}</div>}

        {/* PAGAR / RECEBER */}
        {tab === 'pagarReceber' && (
          <>
            {/* Saldos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SaldoCard label="A Receber" value={aReceber} icon={<TrendingUp size={18} />} colorCls="text-green-600 dark:text-green-400" bg="bg-green-50 dark:bg-green-900/20" loading={loading} />
              <SaldoCard label="A Pagar"   value={aPagar}   icon={<TrendingDown size={18}/>} colorCls="text-red-600 dark:text-red-400"   bg="bg-red-50 dark:bg-red-900/20"   loading={loading} />
              <SaldoCard label="Recebido (mês)" value={recebido} icon={<DollarSign size={18}/>} colorCls="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" loading={loading} />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {(['todos','receber','pagar'] as const).map(v => (
                  <button key={v} type="button" onClick={() => setTipoFiltro(v)}
                    className={cn('px-3 py-1 rounded-md text-xs font-medium transition-colors',
                      tipoFiltro === v ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500')}>
                    {v === 'todos' ? 'Todos' : v === 'receber' ? 'A Receber' : 'A Pagar'}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setShowForm(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700">
                <PlusCircle size={13} /> Novo Lançamento
              </button>
            </div>

            {/* Formulário */}
            {showForm && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Novo Lançamento</h3>
                  <button type="button" title="Fechar" onClick={() => setShowForm(false)}><X size={16} className="text-gray-400" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Tipo</span>
                    <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value as TipoLancamento }))}
                      className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="receber">A Receber</option>
                      <option value="pagar">A Pagar</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 col-span-2">
                    <span className="text-xs text-gray-500">Descrição *</span>
                    <input type="text" value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Vencimento *</span>
                    <input type="date" value={form.vencimento} onChange={e => setForm(p => ({ ...p, vencimento: e.target.value }))}
                      className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Valor (R$) *</span>
                    <input type="number" min="0" step="0.01" value={form.valor || ''} onChange={e => setForm(p => ({ ...p, valor: parseFloat(e.target.value) || 0 }))}
                      className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Categoria</span>
                    <select value={form.categoria ?? ''} onChange={e => setForm(p => ({ ...p, categoria: e.target.value || null }))}
                      className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">— Selecionar —</option>
                      {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="button" onClick={salvarLancamento} disabled={salvando}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {salvando ? 'Salvando…' : 'Salvar'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancelar</button>
                </div>
              </div>
            )}

            {/* Tabela */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">
                    {['Tipo','Descrição','Vencimento','Categoria','Valor','Status'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 animate-pulse">Carregando…</td></tr>
                  ) : filtrados.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1 text-xs font-semibold',
                          l.tipo === 'receber' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                          {l.tipo === 'receber' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {l.tipo === 'receber' ? 'Receber' : 'Pagar'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{l.descricao}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(l.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-gray-500">{l.categoria ?? '—'}</td>
                      <td className={cn('px-4 py-3 font-semibold',
                        l.tipo === 'receber' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                        {l.tipo === 'pagar' ? '– ' : '+ '}R$ {Number(l.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <select value={l.status}
                          onChange={e => atualizarStatusLanc(l.id, e.target.value as StatusLancamento)}
                          className={cn('px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none', statusCls(l.status))}>
                          {(['pendente','pago','recebido','cancelado'] as StatusLancamento[]).map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CONTAS BANCÁRIAS */}
        {tab === 'contas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">Contas Bancárias</h2>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Saldo total: <span className="text-green-600 dark:text-green-400">R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                <p className="text-gray-400 animate-pulse col-span-3">Carregando…</p>
              ) : contas.map(c => (
                <div key={c.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{c.tipo}</p>
                  <p className="font-bold text-lg mt-1">{c.banco}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.agencia ? `Ag. ${c.agencia}` : ''}{c.conta ? ` — CC ${c.conta}` : ''}
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-3">
                    R$ {Number(c.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CENTRO DE CUSTOS */}
        {tab === 'centros' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Centro de Custos — Mai/2026</h2>
            <div className="space-y-3">
              {MOCK_CENTROS.map(c => {
                const perc = Math.round((c.realizado / c.orcamento) * 100)
                return (
                  <div key={c.nome} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{c.nome}</span>
                      <span className="text-xs text-gray-500">R$ {c.realizado.toLocaleString('pt-BR')} / R$ {c.orcamento.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div className={cn('h-2 rounded-full transition-all', perc >= 90 ? 'bg-red-500' : perc >= 70 ? 'bg-yellow-500' : 'bg-blue-500')}
                        style={{ width: `${perc}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{perc}% do orçamento utilizado</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {(tab === 'split' || tab === 'fiscal') && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <DollarSign size={40} className="mb-3 opacity-30" />
            <p className="font-medium">{TABS.find(t => t.id === tab)?.label}</p>
            <p className="text-sm mt-1">Disponível após integração com Safe2Pay / Fiscal.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SaldoCard({ label, value, icon, colorCls, bg, loading }: {
  label: string; value: number; icon: React.ReactNode; colorCls: string; bg: string; loading: boolean
}) {
  return (
    <div className={cn('rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-center gap-4', bg)}>
      <div className={cn('p-2 rounded-lg bg-white/60 dark:bg-gray-900/40', colorCls)}>{icon}</div>
      <div>
        <p className={cn('text-xl font-bold', colorCls)}>
          {loading ? '…' : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}

function statusCls(s: StatusLancamento) {
  const m: Record<StatusLancamento, string> = {
    recebido: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pago:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pendente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelado:'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return m[s]
}
