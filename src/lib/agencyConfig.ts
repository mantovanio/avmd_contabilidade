import { supabase } from '@/lib/supabase'

export type AgencyConfig = {
  nome_agencia: string
  responsavel: string
  telefone: string
  cidade: string
  logo_url: string
  login_titulo: string
  login_subtitulo: string
  cor_primaria: string
  fundo_inicio: string
  fundo_fim: string
}

export const DEFAULT_AGENCY_CONFIG: AgencyConfig = {
  nome_agencia: 'AR CERTI ID',
  responsavel: 'Alexandre Aparecido Mantovan',
  telefone: '+55 11 9508-9218',
  cidade: 'São Paulo - SP',
  logo_url: '',
  login_titulo: 'AR CERTI ID',
  login_subtitulo: 'Agência de Certificação Digital',
  cor_primaria: '#2563eb',
  fundo_inicio: '#172554',
  fundo_fim: '#1e3a8a',
}

export async function fetchAgencyConfig() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'agency')
    .maybeSingle()

  if (error) return { data: DEFAULT_AGENCY_CONFIG, error }

  const value = data?.value
  if (!value || typeof value !== 'object') {
    return { data: DEFAULT_AGENCY_CONFIG, error: null }
  }

  return {
    data: { ...DEFAULT_AGENCY_CONFIG, ...(value as Partial<AgencyConfig>) },
    error: null,
  }
}
