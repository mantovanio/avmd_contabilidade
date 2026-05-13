import { useState, useEffect } from 'react'
import { PlusCircle, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Parceiro, NovoParceiro } from '@/types'

const SEG_CONFIG: Record<Parceiro['segmento'], { label: string; cls: string }> = {
  alto:    { label: 'Alto Valor',  cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'   },
  medio:   { label: 'Médio Valor', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'       },
  baixo:   { label: 'Baixo Valor', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'},
  inativo: { label: 'Inativo',     cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'          },
}

const EMPTY: NovoParceiro = {
  nome: '', responsavel: null, telefone: null, email: null,
  cidade: null, estado: null, segmento: 'baixo', status: 'ativo',
  emissoes_mes: 0, receita_mes: 0, desde: null,
}

export default function Parceiros() {
  const [lista, setLista]       = useState<Parceiro[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [busca, setBusca]       = useState('')
  const [filtroSeg, setFiltroSeg] = useState<Parceiro['segmento'] | 'todos'>('todos')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState<NovoParceiro>(EMPTY)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { fetchParceiros() }, [])

  async function fetchParceiros() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('parceiros')
      .select('*')
      .order('emissoes_mes', { ascending: false })
    if (err) { setError(err.message); setLoading(false); return }
    setLista(data as Parceiro[])
    setLoading(false)
  }

  async function salvar() {
    if (!form.nome.trim()) return
    setSalvando(true)
    const { error: err } = await supabase.from('parceiros').insert([form])
    setSalvando(false)
    if (err) { alert('Erro: ' + err.message); return }
    setShowForm(false)
    setForm(EMPTY)
    fetchParceiros()
  }

  async function toggleStatus(p: Parceiro) {
    const novoStatus = p.status === 'ativo' ? 'inativo' : 'ativo'
    const novoSeg    = novoStatus === 'inativo' ? 'inativo' : p.segmento === 'inativo' ? 'baixo' : p.segmento
    await supabase.from('parceiros').update({ status: novoStatus, segmento: novoSeg }).eq('id', p.id)
    fetchParceiros()
  }

  const filtrado = lista.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.cidade ?? '').toLowerCase().includes(busca.toLowerCase())
    const matchSeg = filtroSeg === 'todos' || p.segmento === filtroSeg
    return matchBusca && matchSeg
  })

  const ativos   = lista.filter(p => p.status === 'ativo').length
  const inativos = lista.filter(p => p.status === 'inativo').length
  const receitaTotal = lista.reduce((s, p) => s + (p.receita_mes ?? 0), 0)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Parceiros Ativos',  value: loading ? '…' : String(ativos),   color: 'bg-green-500' },
            { label: 'Inativos',          value: loading ? '…' : String(inativos), color: 'bg-gray-400'  },
            { label: 'Receita Mai/2026',  value: loading ? '…' : `R$ ${receitaTotal.toLocaleString('pt-BR')}`, color: 'bg-blue-500' },
            { label: 'Ticket Médio',      value: 'R$ 180',                          color: 'bg-purple-500'},
          ].map(k => (
            <div key={k.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-center gap-3">
              <div className={cn('w-2 h-8 rounded-full shrink-0', k.color)} />
              <div>
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar por nome ou cidade…" value={busca} onChange={e => setBusca(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['todos','alto','medio','baixo','inativo'] as const).map(s => (
              <button key={s} type="button" onClick={() => setFiltroSeg(s)}
                className={cn('px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors',
                  filtroSeg === s ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>
                {s === 'todos' ? 'Todos' : s === 'alto' ? 'Alto' : s === 'medio' ? 'Médio' : s === 'baixo' ? 'Baixo' : 'Inativo'}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle size={13} /> Novo Parceiro
          </button>
        </div>

        {/* Formulário novo parceiro */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Novo Parceiro</h3>
              <button type="button" title="Fechar" onClick={() => setShowForm(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Nome *',       key: 'nome',        type: 'text' },
                { label: 'Responsável',  key: 'responsavel', type: 'text' },
                { label: 'Telefone',     key: 'telefone',    type: 'text' },
                { label: 'Email',        key: 'email',       type: 'email'},
                { label: 'Cidade',       key: 'cidade',      type: 'text' },
                { label: 'Estado (UF)',  key: 'estado',      type: 'text' },
              ].map(f => (
                <label key={f.key} className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{f.label}</span>
                  <input type={f.type} value={(form as Record<string, unknown>)[f.key] as string ?? ''}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value || null }))}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              ))}
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Segmento</span>
                <select value={form.segmento} onChange={e => setForm(p => ({ ...p, segmento: e.target.value as Parceiro['segmento'] }))}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="alto">Alto Valor</option>
                  <option value="medio">Médio Valor</option>
                  <option value="baixo">Baixo Valor</option>
                </select>
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={salvar} disabled={salvando}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {salvando ? 'Salvando…' : 'Salvar'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancelar</button>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">
                {['Parceiro','Responsável','Cidade','Emissões/Mês','Receita/Mês','Segmento','Status','Desde','Ação'].map(h => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-gray-400 animate-pulse">Carregando…</td></tr>
              ) : filtrado.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-gray-400">Nenhum parceiro encontrado.</td></tr>
              ) : filtrado.map(p => {
                const seg = SEG_CONFIG[p.segmento]
                return (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.nome}</p>
                      <p className="text-xs text-gray-400">{p.email ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{p.responsavel ?? '—'}</p>
                      <p className="text-xs text-gray-400">{p.telefone ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.cidade}{p.estado ? ` - ${p.estado}` : ''}</td>
                    <td className="px-4 py-3 font-semibold">{p.emissoes_mes}</td>
                    <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                      {p.receita_mes > 0 ? `R$ ${Number(p.receita_mes).toLocaleString('pt-BR')}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', seg.cls)}>{seg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium',
                        p.status === 'ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400')}>
                        {p.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.desde ?? '—'}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => toggleStatus(p)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        {p.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
