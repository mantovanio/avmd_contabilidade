import { useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Check,
  CreditCard,
  Edit3,
  Loader2,
  PlusCircle,
  ShoppingBag,
  Tag,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type {
  ClienteComercial,
  Agendamento,
  CanalVenda,
  Certificado,
  FaixaComissao,
  FormaPagamento,
  NovaFaixaComissao,
  NovaFormaPagamento,
  NovoAgendamento,
  NovoCertificado,
  NovoPrecoCertificado,
  NovoClienteComercial,
  NovaVenda,
  PrecoCertificado,
  StatusAgendamento,
  StatusVenda,
  Venda,
  TipoVenda,
} from '@/types'

type Tab = 'vendas' | 'agenda' | 'certificados' | 'precos' | 'comissoes' | 'pagamento'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'vendas',       label: 'Lançar Vendas',    icon: TrendingUp   },
  { id: 'agenda',       label: 'Agenda',           icon: Calendar     },
  { id: 'certificados', label: 'Certificados',     icon: ShoppingBag  },
  { id: 'precos',       label: 'Tabela de Preços', icon: Tag          },
  { id: 'comissoes',    label: 'Faixas Comissão',  icon: TrendingUp   },
  { id: 'pagamento',    label: 'Forma Pagamento',  icon: CreditCard   },
]

const FALLBACK_CERTS = ['e-CPF A1', 'e-CPF A3', 'e-CNPJ A1', 'e-CNPJ A3', 'NF-e A1', 'SSL']

const CANAL_LABEL: Record<CanalVenda, string> = {
  balcao:       'Balcão',
  ecommerce:    'E-Commerce',
  prepago:      'Pré-pago',
  voucher:      'Voucher',
  link_externo: 'Link Externo',
}

const TIPO_VENDA_LABEL: Record<TipoVenda, string> = {
  presencial: 'Presencial',
  videoconferencia: 'Videoconferência',
  online: 'Online',
  'faca-se': 'Face a face',
  outro: 'Outro',
}

const EMPTY_VENDA: NovaVenda = {
  cliente_id: null, certificado_id: null, cliente: '', cliente_nome: null, tipo_certificado: 'e-CPF A1', tipo_venda: 'presencial', canal: 'balcao',
  forma_pagamento: 'PIX', valor: 0, status: 'confirmado',
  parceiro_id: null, data_venda: new Date().toISOString().split('T')[0], observacoes: null,
}

const EMPTY_CLIENTE: NovoClienteComercial = {
  tipo_cliente: 'pessoa_fisica',
  cpf_cnpj: '',
  nome_razao_social: '',
  nome_fantasia: null,
  email: null,
  telefone: null,
  cep: null,
  logradouro: null,
  numero: null,
  complemento: null,
  bairro: null,
  cidade: null,
  uf: null,
  inscricao_municipal: null,
  inscricao_estadual: null,
  iss_retido: false,
  observacoes: null,
}

const EMPTY_AGENDA: NovoAgendamento = {
  cliente: '', telefone: null, servico: 'e-CPF A1',
  data_hora: '', status: 'aguardando', observacoes: null,
}

const EMPTY_CERTIFICADO: NovoCertificado = {
  tipo: '',
  estoque: 0,
  validade: '1 ano',
  ativo: true,
}

const EMPTY_PRECO: NovoPrecoCertificado = {
  certificado_id: '',
  canal: 'balcao',
  valor: 0,
  ativo: true,
}

const EMPTY_COMISSAO: NovaFaixaComissao = {
  faixa: '',
  min_emissoes: 1,
  max_emissoes: null,
  percentual: 0,
  valor_exemplo: null,
  ordem: 1,
  ativo: true,
}

const EMPTY_PAGAMENTO: NovaFormaPagamento = {
  nome: '',
  ordem: 1,
  ativo: true,
}

export default function Comercial() {
  const [tab, setTab] = useState<Tab>('vendas')

  const [vendas, setVendas]         = useState<Venda[]>([])
  const [clientes, setClientes]     = useState<ClienteComercial[]>([])
  const [loadingV, setLoadingV]     = useState(true)
  const [showFormV, setShowFormV]   = useState(false)
  const [formV, setFormV]           = useState<NovaVenda>(EMPTY_VENDA)
  const [showClienteForm, setShowClienteForm] = useState(false)
  const [clienteSearch, setClienteSearch] = useState('')
  const [formCliente, setFormCliente] = useState<NovoClienteComercial>(EMPTY_CLIENTE)
  const [salvandoV, setSalvandoV]   = useState(false)
  const [salvandoCliente, setSalvandoCliente] = useState(false)

  const [agenda, setAgenda]         = useState<Agendamento[]>([])
  const [loadingA, setLoadingA]     = useState(true)
  const [showFormA, setShowFormA]   = useState(false)
  const [formA, setFormA]           = useState<NovoAgendamento>(EMPTY_AGENDA)
  const [salvandoA, setSalvandoA]   = useState(false)

  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [precos, setPrecos]             = useState<PrecoCertificado[]>([])
  const [comissoes, setComissoes]       = useState<FaixaComissao[]>([])
  const [pagamentos, setPagamentos]     = useState<FormaPagamento[]>([])
  const [loadingCatalogo, setLoadingCatalogo] = useState(true)
  const [catalogoErro, setCatalogoErro]       = useState<string | null>(null)
  const [salvandoCatalogo, setSalvandoCatalogo] = useState(false)

  const [showFormCert, setShowFormCert] = useState(false)
  const [editingCertId, setEditingCertId] = useState<string | null>(null)
  const [formCert, setFormCert] = useState<NovoCertificado>(EMPTY_CERTIFICADO)

  const [showFormPreco, setShowFormPreco] = useState(false)
  const [editingPrecoId, setEditingPrecoId] = useState<string | null>(null)
  const [formPreco, setFormPreco] = useState<NovoPrecoCertificado>(EMPTY_PRECO)

  const [showFormComissao, setShowFormComissao] = useState(false)
  const [editingComissaoId, setEditingComissaoId] = useState<string | null>(null)
  const [formComissao, setFormComissao] = useState<NovaFaixaComissao>(EMPTY_COMISSAO)

  const [showFormPagamento, setShowFormPagamento] = useState(false)
  const [editingPagamentoId, setEditingPagamentoId] = useState<string | null>(null)
  const [formPagamento, setFormPagamento] = useState<NovaFormaPagamento>(EMPTY_PAGAMENTO)

  const certificadosAtivos = useMemo(() => certificados.filter(c => c.ativo), [certificados])
  const pagamentosAtivos = useMemo(() => pagamentos.filter(p => p.ativo), [pagamentos])
  const tiposCertificado = certificadosAtivos.length > 0 ? certificadosAtivos.map(c => c.tipo) : FALLBACK_CERTS
  const formasPagamento = pagamentosAtivos.length > 0 ? pagamentosAtivos.map(p => p.nome) : ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto']
  const certificadoById = useMemo(() => new Map(certificados.map(c => [c.id, c])), [certificados])
  const certificadoOptions = useMemo(() => certificadosAtivos.map(certificado => ({
    value: certificado.id,
    label: `${certificado.tipo} · ${certificado.validade}`,
  })), [certificadosAtivos])
  const clientesFiltrados = useMemo(() => {
    const term = clienteSearch.trim().toLowerCase()
    return term
      ? clientes.filter(cliente => [cliente.nome_razao_social, cliente.nome_fantasia, cliente.cpf_cnpj, cliente.email, cliente.telefone].some(value => value?.toLowerCase().includes(term)))
      : clientes
  }, [clientes, clienteSearch])

  const fetchVendas = useCallback(async () => {
    setLoadingV(true)
    const { data } = await supabase
      .from('vendas')
      .select('*')
      .order('data_venda', { ascending: false })
      .limit(50)
    setVendas((data ?? []) as Venda[])
    setLoadingV(false)
  }, [])

  const fetchClientes = useCallback(async () => {
    const { data } = await supabase
      .from('clientes_comerciais')
      .select('*')
      .order('nome_razao_social', { ascending: true })
      .limit(200)
    setClientes((data ?? []) as ClienteComercial[])
  }, [])

  const fetchAgenda = useCallback(async () => {
    setLoadingA(true)
    const hoje = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('agendamentos')
      .select('*')
      .gte('data_hora', hoje)
      .order('data_hora', { ascending: true })
      .limit(50)
    setAgenda((data ?? []) as Agendamento[])
    setLoadingA(false)
  }, [])

  const fetchCatalogo = useCallback(async () => {
    setLoadingCatalogo(true)
    setCatalogoErro(null)

    const [certsRes, precosRes, comissoesRes, pagamentosRes] = await Promise.all([
      supabase.from('certificados').select('*').order('tipo', { ascending: true }),
      supabase.from('precos_certificados').select('*').order('canal', { ascending: true }),
      supabase.from('faixas_comissao').select('*').order('ordem', { ascending: true }),
      supabase.from('formas_pagamento').select('*').order('ordem', { ascending: true }),
    ])

    const error = certsRes.error ?? precosRes.error ?? comissoesRes.error ?? pagamentosRes.error
    if (error) {
      setCatalogoErro(error.message)
      setLoadingCatalogo(false)
      return
    }

    setCertificados((certsRes.data ?? []) as Certificado[])
    setPrecos((precosRes.data ?? []) as PrecoCertificado[])
    setComissoes((comissoesRes.data ?? []) as FaixaComissao[])
    setPagamentos((pagamentosRes.data ?? []) as FormaPagamento[])
    setLoadingCatalogo(false)
  }, [])

  useEffect(() => { void fetchVendas() }, [fetchVendas])
  useEffect(() => { void fetchAgenda() }, [fetchAgenda])
  useEffect(() => { void fetchCatalogo() }, [fetchCatalogo])
  useEffect(() => { void fetchClientes() }, [fetchClientes])

  async function salvarVenda() {
    if (!formV.cliente.trim() || formV.valor <= 0) return
    setSalvandoV(true)
    const vendaPayload = {
      ...formV,
      cliente_id: formV.cliente_id ?? null,
      certificado_id: formV.certificado_id ?? null,
      cliente: formV.cliente.trim(),
      cliente_nome: formV.cliente.trim(),
      tipo_certificado: formV.certificado_id ? (certificadoById.get(formV.certificado_id)?.tipo ?? formV.tipo_certificado) : formV.tipo_certificado,
    }
    const { error } = await supabase.from('vendas').insert([vendaPayload])
    setSalvandoV(false)
    if (error) { alert('Erro: ' + error.message); return }
    setShowFormV(false); setFormV({ ...EMPTY_VENDA, tipo_certificado: tiposCertificado[0] ?? 'e-CPF A1', forma_pagamento: formasPagamento[0] ?? 'PIX', certificado_id: certificadosAtivos[0]?.id ?? null }); void fetchVendas()
  }

  async function salvarCliente() {
    if (!formCliente.cpf_cnpj.trim() || !formCliente.nome_razao_social.trim()) return
    setSalvandoCliente(true)
    const payload = {
      ...formCliente,
      cpf_cnpj: formCliente.cpf_cnpj.trim(),
      nome_razao_social: formCliente.nome_razao_social.trim(),
      nome_fantasia: formCliente.nome_fantasia?.trim() || null,
      email: formCliente.email?.trim() || null,
      telefone: formCliente.telefone?.trim() || null,
    }
    const { error } = await supabase.from('clientes_comerciais').insert([payload])
    setSalvandoCliente(false)
    if (error) { alert('Erro: ' + error.message); return }
    setFormCliente({ ...EMPTY_CLIENTE })
    setShowClienteForm(false)
    await fetchClientes()
  }

  async function salvarAgendamento() {
    if (!formA.cliente.trim() || !formA.data_hora) return
    setSalvandoA(true)
    const { error } = await supabase.from('agendamentos').insert([formA])
    setSalvandoA(false)
    if (error) { alert('Erro: ' + error.message); return }
    setShowFormA(false); setFormA({ ...EMPTY_AGENDA, servico: tiposCertificado[0] ?? 'e-CPF A1' }); void fetchAgenda()
  }

  async function atualizarStatusVenda(id: string, status: StatusVenda) {
    await supabase.from('vendas').update({ status }).eq('id', id)
    setVendas(prev => prev.map(v => v.id === id ? { ...v, status } : v))
  }

  async function atualizarStatusAgenda(id: string, status: StatusAgendamento) {
    await supabase.from('agendamentos').update({ status }).eq('id', id)
    setAgenda(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  function abrirNovoCertificado() {
    setEditingCertId(null)
    setFormCert({ ...EMPTY_CERTIFICADO })
    setShowFormCert(true)
  }

  function editarCertificado(certificado: Certificado) {
    setEditingCertId(certificado.id)
    setFormCert({
      tipo: certificado.tipo,
      estoque: certificado.estoque,
      validade: certificado.validade,
      ativo: certificado.ativo,
    })
    setShowFormCert(true)
  }

  async function salvarCertificado() {
    if (!formCert.tipo.trim() || !formCert.validade.trim()) return
    setSalvandoCatalogo(true)
    const payload = { ...formCert, tipo: formCert.tipo.trim(), validade: formCert.validade.trim() }
    const { error } = editingCertId
      ? await supabase.from('certificados').update(payload).eq('id', editingCertId)
      : await supabase.from('certificados').insert([payload])
    setSalvandoCatalogo(false)
    if (error) { alert('Erro: ' + error.message); return }
    setShowFormCert(false); setEditingCertId(null); setFormCert({ ...EMPTY_CERTIFICADO }); void fetchCatalogo()
  }

  async function toggleCertificado(certificado: Certificado) {
    await supabase.from('certificados').update({ ativo: !certificado.ativo }).eq('id', certificado.id)
    setCertificados(prev => prev.map(c => c.id === certificado.id ? { ...c, ativo: !c.ativo } : c))
  }

  function abrirNovoPreco() {
    setEditingPrecoId(null)
    setFormPreco({ ...EMPTY_PRECO, certificado_id: certificados[0]?.id ?? '' })
    setShowFormPreco(true)
  }

  function editarPreco(preco: PrecoCertificado) {
    setEditingPrecoId(preco.id)
    setFormPreco({
      certificado_id: preco.certificado_id,
      canal: preco.canal,
      valor: preco.valor,
      ativo: preco.ativo,
    })
    setShowFormPreco(true)
  }

  async function salvarPreco() {
    if (!formPreco.certificado_id || formPreco.valor <= 0) return
    setSalvandoCatalogo(true)
    const { error } = editingPrecoId
      ? await supabase.from('precos_certificados').update(formPreco).eq('id', editingPrecoId)
      : await supabase.from('precos_certificados').insert([formPreco])
    setSalvandoCatalogo(false)
    if (error) { alert('Erro: ' + error.message); return }
    setShowFormPreco(false); setEditingPrecoId(null); setFormPreco({ ...EMPTY_PRECO }); void fetchCatalogo()
  }

  async function togglePreco(preco: PrecoCertificado) {
    await supabase.from('precos_certificados').update({ ativo: !preco.ativo }).eq('id', preco.id)
    setPrecos(prev => prev.map(p => p.id === preco.id ? { ...p, ativo: !p.ativo } : p))
  }

  function abrirNovaComissao() {
    setEditingComissaoId(null)
    setFormComissao({ ...EMPTY_COMISSAO, ordem: comissoes.length + 1 })
    setShowFormComissao(true)
  }

  function editarComissao(comissao: FaixaComissao) {
    setEditingComissaoId(comissao.id)
    setFormComissao({
      faixa: comissao.faixa,
      min_emissoes: comissao.min_emissoes,
      max_emissoes: comissao.max_emissoes,
      percentual: comissao.percentual,
      valor_exemplo: comissao.valor_exemplo,
      ordem: comissao.ordem,
      ativo: comissao.ativo,
    })
    setShowFormComissao(true)
  }

  async function salvarComissao() {
    if (!formComissao.faixa.trim() || formComissao.percentual < 0) return
    setSalvandoCatalogo(true)
    const payload = { ...formComissao, faixa: formComissao.faixa.trim() }
    const { error } = editingComissaoId
      ? await supabase.from('faixas_comissao').update(payload).eq('id', editingComissaoId)
      : await supabase.from('faixas_comissao').insert([payload])
    setSalvandoCatalogo(false)
    if (error) { alert('Erro: ' + error.message); return }
    setShowFormComissao(false); setEditingComissaoId(null); setFormComissao({ ...EMPTY_COMISSAO }); void fetchCatalogo()
  }

  async function toggleComissao(comissao: FaixaComissao) {
    await supabase.from('faixas_comissao').update({ ativo: !comissao.ativo }).eq('id', comissao.id)
    setComissoes(prev => prev.map(c => c.id === comissao.id ? { ...c, ativo: !c.ativo } : c))
  }

  function abrirNovoPagamento() {
    setEditingPagamentoId(null)
    setFormPagamento({ ...EMPTY_PAGAMENTO, ordem: pagamentos.length + 1 })
    setShowFormPagamento(true)
  }

  function preencherCliente(cliente: ClienteComercial) {
    setFormV(p => ({
      ...p,
      cliente_id: cliente.id,
      cliente: cliente.nome_razao_social,
    }))
    setFormCliente({
      tipo_cliente: cliente.tipo_cliente,
      cpf_cnpj: cliente.cpf_cnpj,
      nome_razao_social: cliente.nome_razao_social,
      nome_fantasia: cliente.nome_fantasia,
      email: cliente.email,
      telefone: cliente.telefone,
      cep: cliente.cep,
      logradouro: cliente.logradouro,
      numero: cliente.numero,
      complemento: cliente.complemento,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      uf: cliente.uf,
      inscricao_municipal: cliente.inscricao_municipal,
      inscricao_estadual: cliente.inscricao_estadual,
      iss_retido: cliente.iss_retido,
      observacoes: cliente.observacoes,
    })
  }

  function editarPagamento(pagamento: FormaPagamento) {
    setEditingPagamentoId(pagamento.id)
    setFormPagamento({
      nome: pagamento.nome,
      ordem: pagamento.ordem,
      ativo: pagamento.ativo,
    })
    setShowFormPagamento(true)
  }

  async function salvarPagamento() {
    if (!formPagamento.nome.trim()) return
    setSalvandoCatalogo(true)
    const payload = { ...formPagamento, nome: formPagamento.nome.trim() }
    const { error } = editingPagamentoId
      ? await supabase.from('formas_pagamento').update(payload).eq('id', editingPagamentoId)
      : await supabase.from('formas_pagamento').insert([payload])
    setSalvandoCatalogo(false)
    if (error) { alert('Erro: ' + error.message); return }
    setShowFormPagamento(false); setEditingPagamentoId(null); setFormPagamento({ ...EMPTY_PAGAMENTO }); void fetchCatalogo()
  }

  async function togglePagamento(pagamento: FormaPagamento) {
    await supabase.from('formas_pagamento').update({ ativo: !pagamento.ativo }).eq('id', pagamento.id)
    setPagamentos(prev => prev.map(p => p.id === pagamento.id ? { ...p, ativo: !p.ativo } : p))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-6 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            className={cn('flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors',
              tab === id
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300')}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'vendas' && (
          <div className="space-y-5">
            <SectionHeader title="Vendas" actionLabel="Nova Venda" onAction={() => setShowFormV(v => !v)} />

            {showFormV && (
              <Panel title="Registrar Venda" onClose={() => setShowFormV(false)}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Escolha um cliente/empresa existente ou cadastre um novo antes de lançar a venda.</p>
                  <button type="button" onClick={() => setShowClienteForm(v => !v)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                    {showClienteForm ? 'Fechar cadastro' : 'Novo cliente/empresa'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cliente / Empresa</label>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                      <input
                        list="clientes-comerciais"
                        value={formV.cliente}
                        onChange={e => {
                          const value = e.target.value
                          setFormV(p => ({ ...p, cliente: value, cliente_id: null }))
                          const match = clientes.find(cliente => [cliente.nome_razao_social, cliente.nome_fantasia, cliente.cpf_cnpj].some(field => field?.toLowerCase() === value.toLowerCase()))
                          if (match) preencherCliente(match)
                        }}
                        placeholder="Digite ou selecione um cliente"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button type="button" onClick={() => setShowClienteForm(true)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">Novo cadastro</button>
                    </div>
                    <datalist id="clientes-comerciais">
                      {clientesFiltrados.map(cliente => (
                        <option key={cliente.id} value={cliente.nome_razao_social}>
                          {cliente.cpf_cnpj} {cliente.nome_fantasia ? `- ${cliente.nome_fantasia}` : ''}
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <SelectInput label="Tipo Venda" value={formV.tipo_venda} onChange={tipo_venda => setFormV(p => ({ ...p, tipo_venda: tipo_venda as TipoVenda }))} options={Object.entries(TIPO_VENDA_LABEL).map(([value, label]) => ({ value, label }))} />
                  <SelectInput label="Produto / Certificado" value={formV.certificado_id ?? ''} onChange={certificado_id => {
                    const certificado = certificadoById.get(certificado_id)
                    setFormV(p => ({
                      ...p,
                      certificado_id: certificado_id || null,
                      tipo_certificado: certificado?.tipo ?? p.tipo_certificado,
                    }))
                  }} options={certificadoOptions} />
                  <SelectInput label="Tipo de Certificado" value={formV.tipo_certificado} onChange={tipo_certificado => setFormV(p => ({ ...p, tipo_certificado }))} options={tiposCertificado.map(tipo => ({ value: tipo, label: tipo }))} />
                  <SelectInput label="Canal de Venda" value={formV.canal} onChange={canal => setFormV(p => ({ ...p, canal: canal as CanalVenda }))} options={(Object.entries(CANAL_LABEL) as [CanalVenda, string][]).map(([value, label]) => ({ value, label }))} />
                  <SelectInput label="Forma de Pagamento" value={formV.forma_pagamento} onChange={forma_pagamento => setFormV(p => ({ ...p, forma_pagamento }))} options={formasPagamento.map(nome => ({ value: nome, label: nome }))} />
                  <NumberInput label="Valor (R$) *" value={formV.valor} onChange={valor => setFormV(p => ({ ...p, valor }))} />
                  <TextInput label="Data" type="date" value={formV.data_venda} onChange={data_venda => setFormV(p => ({ ...p, data_venda }))} />
                </div>
                {showClienteForm && (
                  <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/40">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200">Cadastro de Pessoa / Empresa</h4>
                      <button type="button" onClick={() => setShowClienteForm(false)} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Fechar</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <SelectInput label="Tipo" value={formCliente.tipo_cliente} onChange={tipo_cliente => setFormCliente(p => ({ ...p, tipo_cliente: tipo_cliente as NovoClienteComercial['tipo_cliente'] }))} options={[{ value: 'pessoa_fisica', label: 'Pessoa Física' }, { value: 'pessoa_juridica', label: 'Pessoa Jurídica' }]} />
                      <TextInput label="CPF / CNPJ *" value={formCliente.cpf_cnpj} onChange={cpf_cnpj => setFormCliente(p => ({ ...p, cpf_cnpj }))} />
                      <TextInput label="Nome / Razão Social *" value={formCliente.nome_razao_social} onChange={nome_razao_social => setFormCliente(p => ({ ...p, nome_razao_social }))} className="md:col-span-2" />
                      <TextInput label="Nome Fantasia" value={formCliente.nome_fantasia ?? ''} onChange={nome_fantasia => setFormCliente(p => ({ ...p, nome_fantasia: nome_fantasia || null }))} className="md:col-span-2" />
                      <TextInput label="E-mail" type="email" value={formCliente.email ?? ''} onChange={email => setFormCliente(p => ({ ...p, email: email || null }))} />
                      <TextInput label="Telefone" value={formCliente.telefone ?? ''} onChange={telefone => setFormCliente(p => ({ ...p, telefone: telefone || null }))} />
                      <TextInput label="CEP" value={formCliente.cep ?? ''} onChange={cep => setFormCliente(p => ({ ...p, cep: cep || null }))} />
                      <TextInput label="Cidade" value={formCliente.cidade ?? ''} onChange={cidade => setFormCliente(p => ({ ...p, cidade: cidade || null }))} />
                      <TextInput label="UF" value={formCliente.uf ?? ''} onChange={uf => setFormCliente(p => ({ ...p, uf: uf || null }))} />
                      <TextInput label="Inscrição Municipal" value={formCliente.inscricao_municipal ?? ''} onChange={inscricao_municipal => setFormCliente(p => ({ ...p, inscricao_municipal: inscricao_municipal || null }))} />
                      <TextInput label="Inscrição Estadual" value={formCliente.inscricao_estadual ?? ''} onChange={inscricao_estadual => setFormCliente(p => ({ ...p, inscricao_estadual: inscricao_estadual || null }))} />
                      <TextInput label="Logradouro" value={formCliente.logradouro ?? ''} onChange={logradouro => setFormCliente(p => ({ ...p, logradouro: logradouro || null }))} className="md:col-span-2" />
                      <TextInput label="Número" value={formCliente.numero ?? ''} onChange={numero => setFormCliente(p => ({ ...p, numero: numero || null }))} />
                      <TextInput label="Complemento" value={formCliente.complemento ?? ''} onChange={complemento => setFormCliente(p => ({ ...p, complemento: complemento || null }))} className="md:col-span-2" />
                      <TextInput label="Bairro" value={formCliente.bairro ?? ''} onChange={bairro => setFormCliente(p => ({ ...p, bairro: bairro || null }))} />
                      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <input type="checkbox" checked={formCliente.iss_retido} onChange={e => setFormCliente(p => ({ ...p, iss_retido: e.target.checked }))} />
                        ISS retido
                      </label>
                      <TextInput label="Observações" value={formCliente.observacoes ?? ''} onChange={observacoes => setFormCliente(p => ({ ...p, observacoes: observacoes || null }))} className="md:col-span-4" />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button type="button" onClick={() => setShowClienteForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm">Cancelar</button>
                      <button type="button" onClick={() => void salvarCliente()} disabled={salvandoCliente} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        {salvandoCliente ? 'Salvando...' : 'Salvar cliente'}
                      </button>
                    </div>
                  </div>
                )}
                <FormActions onSave={salvarVenda} onCancel={() => setShowFormV(false)} saving={salvandoV} />
              </Panel>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">
                    {['Data','Cliente','Tipo','Canal','Valor','Pagamento','Status'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loadingV ? (
                    <LoadingRow colSpan={7} />
                  ) : vendas.length === 0 ? (
                    <EmptyRow colSpan={7} label="Nenhuma venda registrada." />
                  ) : vendas.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{new Date(v.data_venda + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 font-medium">{v.cliente}</td>
                      <td className="px-4 py-3 text-gray-500">{v.tipo_certificado}</td>
                      <td className="px-4 py-3"><CanalBadge canal={v.canal} /></td>
                      <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">{formatCurrency(v.valor)}</td>
                      <td className="px-4 py-3 text-gray-500">{v.forma_pagamento}</td>
                      <td className="px-4 py-3">
                        <select title="Status da venda" value={v.status}
                          onChange={e => atualizarStatusVenda(v.id, e.target.value as StatusVenda)}
                          className={cn('px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none', statusVendaCls(v.status))}>
                          {(['confirmado','pendente','cancelado'] as StatusVenda[]).map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'agenda' && (
          <div className="space-y-5">
            <SectionHeader title={`Agenda - ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}`} actionLabel="Novo Agendamento" onAction={() => setShowFormA(v => !v)} />

            {showFormA && (
              <Panel title="Novo Agendamento" onClose={() => setShowFormA(false)}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <TextInput label="Cliente *" value={formA.cliente} onChange={cliente => setFormA(p => ({ ...p, cliente }))} className="col-span-2" />
                  <TextInput label="Telefone" value={formA.telefone ?? ''} onChange={telefone => setFormA(p => ({ ...p, telefone: telefone || null }))} />
                  <SelectInput label="Serviço" value={formA.servico} onChange={servico => setFormA(p => ({ ...p, servico }))} options={tiposCertificado.map(tipo => ({ value: tipo, label: tipo }))} />
                  <TextInput label="Data e Hora *" type="datetime-local" value={formA.data_hora} onChange={data_hora => setFormA(p => ({ ...p, data_hora }))} />
                </div>
                <FormActions onSave={salvarAgendamento} onCancel={() => setShowFormA(false)} saving={salvandoA} />
              </Panel>
            )}

            {loadingA ? (
              <p className="text-gray-400 animate-pulse text-sm">Carregando...</p>
            ) : agenda.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum agendamento encontrado.</p>
            ) : (
              <div className="space-y-2">
                {agenda.map(a => {
                  const dt = new Date(a.data_hora)
                  return (
                    <div key={a.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
                      <div className="w-20 text-center shrink-0">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 block">{dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs text-gray-400">{dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{a.cliente}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{a.servico}{a.telefone ? ` · ${a.telefone}` : ''}</p>
                      </div>
                      <select title="Status do agendamento" value={a.status}
                        onChange={e => atualizarStatusAgenda(a.id, e.target.value as StatusAgendamento)}
                        className={cn('px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none', statusAgendaCls(a.status))}>
                        {(['confirmado','aguardando','cancelado','realizado'] as StatusAgendamento[]).map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
                      </select>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'certificados' && (
          <CatalogSection title="Estoque de Certificados" actionLabel="Novo Certificado" onAction={abrirNovoCertificado} loading={loadingCatalogo} error={catalogoErro}>
            {showFormCert && (
              <Panel title={editingCertId ? 'Editar Certificado' : 'Novo Certificado'} onClose={() => setShowFormCert(false)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <TextInput label="Tipo *" value={formCert.tipo} onChange={tipo => setFormCert(p => ({ ...p, tipo }))} />
                  <NumberInput label="Estoque" value={formCert.estoque} onChange={estoque => setFormCert(p => ({ ...p, estoque }))} step={1} />
                  <TextInput label="Validade *" value={formCert.validade} onChange={validade => setFormCert(p => ({ ...p, validade }))} />
                  <ActiveSelect value={formCert.ativo} onChange={ativo => setFormCert(p => ({ ...p, ativo }))} />
                </div>
                <FormActions onSave={salvarCertificado} onCancel={() => setShowFormCert(false)} saving={salvandoCatalogo} />
              </Panel>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {certificados.length === 0 ? (
                <EmptyBlock label="Nenhum certificado cadastrado." />
              ) : certificados.map(c => {
                const precoRef = precos.find(p => p.certificado_id === c.id && p.canal === 'balcao' && p.ativo) ?? precos.find(p => p.certificado_id === c.id && p.ativo)
                return (
                  <div key={c.id} className={cn('bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5', !c.ativo && 'opacity-60')}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{c.tipo}</p>
                        <p className="text-3xl font-bold mt-1">{c.estoque}</p>
                        <p className="text-xs text-gray-400 mt-1">em estoque</p>
                      </div>
                      <RowActions active={c.ativo} onEdit={() => editarCertificado(c)} onToggle={() => toggleCertificado(c)} />
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">{precoRef ? formatCurrency(precoRef.valor) : 'Sem preço'}</span>
                      <span className="text-xs text-gray-400">{c.validade}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CatalogSection>
        )}

        {tab === 'precos' && (
          <CatalogSection title="Tabela de Preços por Canal" actionLabel="Novo Preço" onAction={abrirNovoPreco} loading={loadingCatalogo} error={catalogoErro}>
            {showFormPreco && (
              <Panel title={editingPrecoId ? 'Editar Preço' : 'Novo Preço'} onClose={() => setShowFormPreco(false)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <SelectInput label="Certificado *" value={formPreco.certificado_id} onChange={certificado_id => setFormPreco(p => ({ ...p, certificado_id }))} options={certificados.map(c => ({ value: c.id, label: c.tipo }))} />
                  <SelectInput label="Canal" value={formPreco.canal} onChange={canal => setFormPreco(p => ({ ...p, canal: canal as CanalVenda }))} options={(Object.entries(CANAL_LABEL) as [CanalVenda, string][]).map(([value, label]) => ({ value, label }))} />
                  <NumberInput label="Valor (R$) *" value={formPreco.valor} onChange={valor => setFormPreco(p => ({ ...p, valor }))} />
                  <ActiveSelect value={formPreco.ativo} onChange={ativo => setFormPreco(p => ({ ...p, ativo }))} />
                </div>
                <FormActions onSave={salvarPreco} onCancel={() => setShowFormPreco(false)} saving={salvandoCatalogo} />
              </Panel>
            )}

            <DataTable headers={['Produto','Canal','Valor','Status','Ações']}>
              {precos.length === 0 ? (
                <EmptyRow colSpan={5} label="Nenhum preço cadastrado." />
              ) : precos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-3 font-medium">{certificadoById.get(p.certificado_id)?.tipo ?? 'Certificado removido'}</td>
                  <td className="px-5 py-3"><CanalBadge canal={p.canal} /></td>
                  <td className="px-5 py-3 text-green-600 dark:text-green-400 font-semibold">{formatCurrency(p.valor)}</td>
                  <td className="px-5 py-3"><StatusPill active={p.ativo} /></td>
                  <td className="px-5 py-3"><RowActions active={p.ativo} onEdit={() => editarPreco(p)} onToggle={() => togglePreco(p)} /></td>
                </tr>
              ))}
            </DataTable>
          </CatalogSection>
        )}

        {tab === 'comissoes' && (
          <CatalogSection title="Faixas de Comissão" actionLabel="Nova Faixa" onAction={abrirNovaComissao} loading={loadingCatalogo} error={catalogoErro}>
            {showFormComissao && (
              <Panel title={editingComissaoId ? 'Editar Faixa' : 'Nova Faixa'} onClose={() => setShowFormComissao(false)}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <TextInput label="Faixa *" value={formComissao.faixa} onChange={faixa => setFormComissao(p => ({ ...p, faixa }))} className="md:col-span-2" />
                  <NumberInput label="Mín." value={formComissao.min_emissoes} onChange={min_emissoes => setFormComissao(p => ({ ...p, min_emissoes }))} step={1} />
                  <NumberInput label="Máx." value={formComissao.max_emissoes ?? 0} onChange={max => setFormComissao(p => ({ ...p, max_emissoes: max || null }))} step={1} />
                  <NumberInput label="% Comissão" value={formComissao.percentual} onChange={percentual => setFormComissao(p => ({ ...p, percentual }))} />
                  <ActiveSelect value={formComissao.ativo} onChange={ativo => setFormComissao(p => ({ ...p, ativo }))} />
                  <NumberInput label="Valor ex. (R$)" value={formComissao.valor_exemplo ?? 0} onChange={valor => setFormComissao(p => ({ ...p, valor_exemplo: valor || null }))} />
                  <NumberInput label="Ordem" value={formComissao.ordem} onChange={ordem => setFormComissao(p => ({ ...p, ordem }))} step={1} />
                </div>
                <FormActions onSave={salvarComissao} onCancel={() => setShowFormComissao(false)} saving={salvandoCatalogo} />
              </Panel>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {comissoes.length === 0 ? (
                <EmptyBlock label="Nenhuma faixa cadastrada." />
              ) : comissoes.map(c => (
                <div key={c.id} className={cn('bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5', !c.ativo && 'opacity-60')}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.faixa}</p>
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">{Number(c.percentual).toLocaleString('pt-BR')}%</p>
                    </div>
                    <RowActions active={c.ativo} onEdit={() => editarComissao(c)} onToggle={() => toggleComissao(c)} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{c.valor_exemplo ? `${formatCurrency(c.valor_exemplo)}/cert.` : 'Sem valor exemplo'}</p>
                </div>
              ))}
            </div>
          </CatalogSection>
        )}

        {tab === 'pagamento' && (
          <CatalogSection title="Formas de Pagamento Aceitas" actionLabel="Nova Forma" onAction={abrirNovoPagamento} loading={loadingCatalogo} error={catalogoErro}>
            {showFormPagamento && (
              <Panel title={editingPagamentoId ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'} onClose={() => setShowFormPagamento(false)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextInput label="Nome *" value={formPagamento.nome} onChange={nome => setFormPagamento(p => ({ ...p, nome }))} />
                  <NumberInput label="Ordem" value={formPagamento.ordem} onChange={ordem => setFormPagamento(p => ({ ...p, ordem }))} step={1} />
                  <ActiveSelect value={formPagamento.ativo} onChange={ativo => setFormPagamento(p => ({ ...p, ativo }))} />
                </div>
                <FormActions onSave={salvarPagamento} onCancel={() => setShowFormPagamento(false)} saving={salvandoCatalogo} />
              </Panel>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pagamentos.length === 0 ? (
                <EmptyBlock label="Nenhuma forma cadastrada." />
              ) : pagamentos.map(p => (
                <div key={p.id} className={cn('bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3', !p.ativo && 'opacity-60')}>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CreditCard size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium flex-1 min-w-0 truncate">{p.nome}</span>
                  <RowActions active={p.ativo} onEdit={() => editarPagamento(p)} onToggle={() => togglePagamento(p)} />
                </div>
              ))}
            </div>
          </CatalogSection>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
      <button type="button" onClick={onAction}
        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
        <PlusCircle size={14} /> {actionLabel}
      </button>
    </div>
  )
}

function CatalogSection({ title, actionLabel, onAction, loading, error, children }: { title: string; actionLabel: string; onAction: () => void; loading: boolean; error: string | null; children: React.ReactNode }) {
  if (loading) {
    return <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 size={16} className="animate-spin" /> Carregando catálogo...</div>
  }

  if (error) {
    return (
      <div className="space-y-4">
        <SectionHeader title={title} actionLabel={actionLabel} onAction={onAction} />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg p-4 text-sm">
          Erro ao carregar catálogo comercial: {error}. Execute o SQL em <strong>sql/commercial_schema.sql</strong> no Supabase.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <SectionHeader title={title} actionLabel={actionLabel} onAction={onAction} />
      {children}
    </div>
  )
}

function Panel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <button type="button" title="Fechar" onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      {children}
    </div>
  )
}

function FormActions({ onSave, onCancel, saving }: { onSave: () => void; onCancel: () => void; saving: boolean }) {
  return (
    <div className="flex gap-2 mt-4">
      <button type="button" onClick={onSave} disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
      <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancelar</button>
    </div>
  )
}

function TextInput({ label, value, onChange, type = 'text', className }: { label: string; value: string; onChange: (value: string) => void; type?: string; className?: string }) {
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs text-gray-500">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </label>
  )
}

function NumberInput({ label, value, onChange, step = 0.01 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <input type="number" min="0" step={step} value={value || ''} onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </label>
  )
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function ActiveSelect({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">Status</span>
      <select value={value ? 'ativo' : 'inativo'} onChange={e => onChange(e.target.value === 'ativo')}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
    </label>
  )
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">
            {headers.map(header => <th key={header} className="px-5 py-3">{header}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{children}</tbody>
      </table>
    </div>
  )
}

function RowActions({ active, onEdit, onToggle }: { active: boolean; onEdit: () => void; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button type="button" title="Editar" onClick={onEdit}
        className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 flex items-center justify-center transition-colors">
        <Edit3 size={14} />
      </button>
      <button type="button" title={active ? 'Desativar' : 'Ativar'} onClick={onToggle}
        className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
          active ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800')}>
        {active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      </button>
    </div>
  )
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium',
      active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400')}>
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

function LoadingRow({ colSpan }: { colSpan: number }) {
  return <tr><td colSpan={colSpan} className="px-5 py-8 text-center text-gray-400 animate-pulse">Carregando...</td></tr>
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return <tr><td colSpan={colSpan} className="px-5 py-8 text-center text-gray-400">{label}</td></tr>
}

function EmptyBlock({ label }: { label: string }) {
  return <div className="col-span-full text-center py-10 text-gray-400 text-sm">{label}</div>
}

function CanalBadge({ canal }: { canal: CanalVenda }) {
  const colors: Record<CanalVenda, string> = {
    balcao:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ecommerce:    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    prepago:      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    voucher:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    link_externo: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  }
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors[canal])}>{CANAL_LABEL[canal]}</span>
}

function statusVendaCls(s: StatusVenda) {
  const m: Record<StatusVenda, string> = {
    confirmado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pendente:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelado:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return m[s]
}

function statusAgendaCls(s: StatusAgendamento) {
  const m: Record<StatusAgendamento, string> = {
    confirmado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    aguardando: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    realizado:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cancelado:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return m[s]
}

function formatCurrency(value: number) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
