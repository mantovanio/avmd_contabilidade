// ── leads_contabilidade ───────────────────────────────────────
export type StatusLead = string

export interface Lead {
  id: string
  nome_lead: string | null
  whatsapp_lead: string | null
  motivo_contato: string | null
  resumo_conversa: string | null
  status: StatusLead
  inicio_atendimento: string | null
  ultima_mensagem: string | null
  id_conta_chatwoot: string | null
  id_conversa_chatwoot: string | null
  id_lead_chatwoot: string | null
  inbox_id_chatwoot: string | null
  follow_up_1: string | null
  follow_up_2: string | null
  follow_up_3: string | null
  data_agendamento: string | null
  id_agendamento: string | null
  agendamento_criado_em: string | null
  anotacoes: string | null
  created_at: string
  minutos_ultima_mensagem_base: number | null
  horario_comercial: boolean | null
}

// ── parceiros ─────────────────────────────────────────────────
export interface Parceiro {
  id: string
  nome: string
  responsavel: string | null
  telefone: string | null
  email: string | null
  cidade: string | null
  estado: string | null
  segmento: 'alto' | 'medio' | 'baixo' | 'inativo'
  status: 'ativo' | 'inativo'
  emissoes_mes: number
  receita_mes: number
  desde: string | null
  created_at: string
}

export type NovoParceiro = Omit<Parceiro, 'id' | 'created_at'>

// ── vendas ────────────────────────────────────────────────────
export type CanalVenda = 'balcao' | 'ecommerce' | 'prepago' | 'voucher' | 'link_externo'
export type TipoVenda = 'presencial' | 'videoconferencia' | 'online' | 'faca-se' | 'outro'
export type StatusVenda = 'confirmado' | 'pendente' | 'cancelado'

export interface Venda {
  id: string
  cliente_id: string | null
  certificado_id: string | null
  cliente: string
  cliente_nome: string | null
  tipo_certificado: string
  tipo_venda: TipoVenda
  canal: CanalVenda
  forma_pagamento: string
  valor: number
  status: StatusVenda
  parceiro_id: string | null
  data_venda: string
  observacoes: string | null
  created_at: string
}

export type NovaVenda = Omit<Venda, 'id' | 'created_at'>

export type TipoCliente = 'pessoa_fisica' | 'pessoa_juridica'

export interface ClienteComercial {
  id: string
  tipo_cliente: TipoCliente
  cpf_cnpj: string
  nome_razao_social: string
  nome_fantasia: string | null
  email: string | null
  telefone: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  uf: string | null
  inscricao_municipal: string | null
  inscricao_estadual: string | null
  iss_retido: boolean
  observacoes: string | null
  created_at: string
  updated_at: string
}

export type NovoClienteComercial = Omit<ClienteComercial, 'id' | 'created_at' | 'updated_at'>

// ── comercial / catálogo ──────────────────────────────────────
export interface Certificado {
  id: string
  tipo: string
  estoque: number
  validade: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export type NovoCertificado = Omit<Certificado, 'id' | 'created_at' | 'updated_at'>

export interface PrecoCertificado {
  id: string
  certificado_id: string
  canal: CanalVenda
  valor: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export type NovoPrecoCertificado = Omit<PrecoCertificado, 'id' | 'created_at' | 'updated_at'>

export interface FaixaComissao {
  id: string
  faixa: string
  min_emissoes: number
  max_emissoes: number | null
  percentual: number
  valor_exemplo: number | null
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export type NovaFaixaComissao = Omit<FaixaComissao, 'id' | 'created_at' | 'updated_at'>

export interface FormaPagamento {
  id: string
  nome: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export type NovaFormaPagamento = Omit<FormaPagamento, 'id' | 'created_at' | 'updated_at'>

// ── agendamentos ──────────────────────────────────────────────
export type StatusAgendamento = 'confirmado' | 'aguardando' | 'cancelado' | 'realizado'

export interface Agendamento {
  id: string
  cliente: string
  telefone: string | null
  servico: string
  data_hora: string
  status: StatusAgendamento
  observacoes: string | null
  created_at: string
}

export type NovoAgendamento = Omit<Agendamento, 'id' | 'created_at'>

// ── renovacoes ────────────────────────────────────────────────
export type StatusRenovacao = 'pendente' | 'contatado' | 'convertido' | 'perdido'
export type PrioridadeRenovacao = 'urgente' | 'media' | 'normal'

export interface Renovacao {
  id: string
  cliente: string
  telefone: string | null
  email: string | null
  tipo_certificado: string
  data_vencimento: string
  dias_restantes: number
  valor: number | null
  prioridade: PrioridadeRenovacao
  status: StatusRenovacao
  observacoes: string | null
  created_at: string
  // campos estendidos (migration: renovacoes_migration.sql)
  pedido: string | null
  protocolo: string | null
  cpf: string | null
  cnpj: string | null
  razao_social: string | null
  agr: string | null
  vendedor: string | null
  contador: string | null
  renovado: boolean
  ultimo_lembrete: string | null
}

// ── links de produtos ─────────────────────────────────────────
export interface LinkProduto {
  id: string
  tipo_certificado: string
  link_renovacao: string | null
  link_nova_emissao: string | null
  descricao: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export type NovoLinkProduto = Omit<LinkProduto, 'id' | 'created_at' | 'updated_at'>

// ── financeiro ────────────────────────────────────────────────
export type TipoLancamento = 'pagar' | 'receber'
export type StatusLancamento = 'pendente' | 'pago' | 'recebido' | 'cancelado'

export interface Lancamento {
  id: string
  tipo: TipoLancamento
  descricao: string
  vencimento: string
  valor: number
  status: StatusLancamento
  categoria: string | null
  created_at: string
}

export type NovoLancamento = Omit<Lancamento, 'id' | 'created_at'>

export interface ContaBancaria {
  id: string
  banco: string
  agencia: string | null
  conta: string | null
  tipo: 'corrente' | 'poupanca' | 'carteira'
  saldo: number
  ativo: boolean
  created_at: string
}

// ── integrações / comunicação ─────────────────────────────────
export type IntegrationProvider =
  | 'chatwoot' | 'email_smtp' | 'n8n' | 'gestao_ar'
  | 'safe2pay' | 'safeweb' | 'supabase'

export type IntegrationStatus = 'ativo' | 'pendente' | 'erro' | 'inativo'
export type CommunicationChannel = 'whatsapp' | 'email' | 'webhook'
export type CommunicationProvider = 'chatwoot' | 'email_smtp' | 'n8n'
export type CommunicationStatus = 'queued' | 'processing' | 'sent' | 'failed' | 'cancelled'
export type AutomationChannel = 'whatsapp' | 'email' | 'whatsapp_email' | 'webhook'

export interface ExternalIntegration {
  id: string
  provider: IntegrationProvider
  name: string
  description: string | null
  status: IntegrationStatus
  base_url: string | null
  webhook_url: string | null
  api_token: string | null
  account_id: string | null
  inbox_id: string | null
  sender_name: string | null
  sender_email: string | null
  host: string | null
  port: number | null
  username: string | null
  metadata: Record<string, unknown>
  last_test_at: string | null
  last_error: string | null
  created_at: string
  updated_at: string
}

export type NovaExternalIntegration = Omit<ExternalIntegration, 'id' | 'created_at' | 'updated_at' | 'last_test_at' | 'last_error'>

export interface AutomationRule {
  id: string
  rule_key: string
  label: string
  channel: AutomationChannel
  trigger_key: string
  ativo: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CommunicationTemplate {
  id: string
  template_key: string
  name: string
  channel: 'whatsapp' | 'email'
  subject: string | null
  body: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface CommunicationOutbox {
  id: string
  channel: CommunicationChannel
  provider: CommunicationProvider
  to_address: string
  subject: string | null
  body: string
  payload: Record<string, unknown>
  status: CommunicationStatus
  error_message: string | null
  scheduled_for: string
  sent_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// ── auth / profiles ───────────────────────────────────────────
export type PerfilAcesso = 'admin' | 'usuario' | 'vendedor' | 'agente_registro'

export interface Profile {
  id: string
  nome: string
  email: string
  perfil: PerfilAcesso
  status: 'ativo' | 'inativo'
  created_at: string
}

// ── date filter ───────────────────────────────────────────────
export type DateFilterOption =
  | 'hoje' | 'ontem' | '7dias' | 'este_mes' | 'mes_passado' | '3meses' | 'personalizado'

export interface DateRange {
  from: Date
  to: Date
}
