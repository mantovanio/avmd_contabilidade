-- ================================================================
-- MIGRATION: Novos campos para tabela renovacoes
-- Execute no Supabase SQL Editor
-- ================================================================

ALTER TABLE public.renovacoes
  ADD COLUMN IF NOT EXISTS pedido          TEXT,
  ADD COLUMN IF NOT EXISTS protocolo       TEXT,
  ADD COLUMN IF NOT EXISTS cpf             TEXT,
  ADD COLUMN IF NOT EXISTS cnpj            TEXT,
  ADD COLUMN IF NOT EXISTS razao_social    TEXT,
  ADD COLUMN IF NOT EXISTS agr             TEXT,
  ADD COLUMN IF NOT EXISTS vendedor        TEXT,
  ADD COLUMN IF NOT EXISTS contador        TEXT,
  ADD COLUMN IF NOT EXISTS renovado        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ultimo_lembrete TIMESTAMPTZ;
