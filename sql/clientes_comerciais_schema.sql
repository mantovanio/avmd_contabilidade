-- ================================================================
-- CLIENTES COMERCIAIS - CRM CERTIFICACAO DIGITAL
-- Execute no Supabase SQL Editor apos os demais schemas
-- ================================================================

CREATE TABLE IF NOT EXISTS public.clientes_comerciais (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_cliente        TEXT NOT NULL CHECK (tipo_cliente IN ('pessoa_fisica', 'pessoa_juridica')),
  cpf_cnpj            TEXT NOT NULL UNIQUE,
  nome_razao_social   TEXT NOT NULL,
  nome_fantasia       TEXT,
  email               TEXT,
  telefone            TEXT,
  cep                 TEXT,
  logradouro          TEXT,
  numero              TEXT,
  complemento         TEXT,
  bairro              TEXT,
  cidade              TEXT,
  uf                  TEXT,
  inscricao_municipal TEXT,
  inscricao_estadual  TEXT,
  iss_retido          BOOLEAN NOT NULL DEFAULT FALSE,
  observacoes         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clientes_comerciais ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clientes_comerciais_select_authenticated" ON public.clientes_comerciais;
DROP POLICY IF EXISTS "clientes_comerciais_write_admin" ON public.clientes_comerciais;
CREATE POLICY "clientes_comerciais_select_authenticated" ON public.clientes_comerciais
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "clientes_comerciais_write_admin" ON public.clientes_comerciais
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

DROP TRIGGER IF EXISTS clientes_comerciais_set_updated_at ON public.clientes_comerciais;
CREATE TRIGGER clientes_comerciais_set_updated_at
  BEFORE UPDATE ON public.clientes_comerciais
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.vendas
  ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes_comerciais(id) ON DELETE SET NULL;

ALTER TABLE public.vendas
  ADD COLUMN IF NOT EXISTS certificado_id UUID REFERENCES public.certificados(id) ON DELETE SET NULL;

ALTER TABLE public.vendas
  ADD COLUMN IF NOT EXISTS cliente_nome TEXT;

ALTER TABLE public.vendas
  ADD COLUMN IF NOT EXISTS tipo_venda TEXT DEFAULT 'presencial';

UPDATE public.vendas
SET tipo_venda = COALESCE(tipo_venda, 'presencial')
WHERE tipo_venda IS NULL;

UPDATE public.vendas
SET cliente_nome = cliente
WHERE cliente_nome IS NULL;

INSERT INTO public.clientes_comerciais
  (tipo_cliente, cpf_cnpj, nome_razao_social, nome_fantasia, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf, inscricao_municipal, inscricao_estadual, iss_retido, observacoes)
VALUES
  ('pessoa_fisica', '00000000000', 'Cliente Exemplo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, 'Seed inicial')
ON CONFLICT (cpf_cnpj) DO NOTHING;
