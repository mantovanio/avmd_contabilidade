-- ================================================================
-- MIGRATION: Links de Produtos para Renovação
-- Execute no Supabase SQL Editor
-- ================================================================

CREATE TABLE IF NOT EXISTS public.links_produtos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_certificado  TEXT NOT NULL UNIQUE,
  link_renovacao    TEXT,
  link_nova_emissao TEXT,
  descricao         TEXT,
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS links_produtos_set_updated_at ON public.links_produtos;
CREATE TRIGGER links_produtos_set_updated_at
  BEFORE UPDATE ON public.links_produtos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS público (mesmo padrão das outras tabelas do projeto)
ALTER TABLE public.links_produtos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "links_produtos_select" ON public.links_produtos;
DROP POLICY IF EXISTS "links_produtos_write"  ON public.links_produtos;

CREATE POLICY "links_produtos_select" ON public.links_produtos
  FOR SELECT USING (true);

CREATE POLICY "links_produtos_write" ON public.links_produtos
  FOR ALL USING (true) WITH CHECK (true);

-- Seed com os tipos de certificado mais comuns
INSERT INTO public.links_produtos (tipo_certificado, link_renovacao, link_nova_emissao) VALUES
  ('e-CPF A1',  NULL, NULL),
  ('e-CPF A3',  NULL, NULL),
  ('e-CNPJ A1', NULL, NULL),
  ('e-CNPJ A3', NULL, NULL),
  ('NF-e A1',   NULL, NULL),
  ('SSL',       NULL, NULL)
ON CONFLICT (tipo_certificado) DO NOTHING;

-- ================================================================
-- Habilitar Realtime na tabela communication_events
-- (necessário para o auto-Kanban ao receber resposta do cliente)
-- ================================================================
ALTER publication supabase_realtime ADD TABLE public.communication_events;
