-- ================================================================
-- COMMERCIAL SCHEMA - CRM CERTIFICACAO DIGITAL
-- Execute no Supabase SQL Editor apos auth_schema.sql
-- ================================================================

CREATE TABLE IF NOT EXISTS public.certificados (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo       TEXT NOT NULL UNIQUE,
  estoque    INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  validade   TEXT NOT NULL,
  ativo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.precos_certificados (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificado_id UUID NOT NULL REFERENCES public.certificados(id) ON DELETE CASCADE,
  canal          TEXT NOT NULL CHECK (canal IN ('balcao', 'ecommerce', 'prepago', 'voucher', 'link_externo')),
  valor          NUMERIC(10,2) NOT NULL CHECK (valor > 0),
  ativo          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (certificado_id, canal)
);

CREATE TABLE IF NOT EXISTS public.faixas_comissao (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faixa         TEXT NOT NULL UNIQUE,
  min_emissoes  INTEGER NOT NULL DEFAULT 0 CHECK (min_emissoes >= 0),
  max_emissoes  INTEGER CHECK (max_emissoes IS NULL OR max_emissoes >= min_emissoes),
  percentual    NUMERIC(5,2) NOT NULL CHECK (percentual >= 0),
  valor_exemplo NUMERIC(10,2),
  ordem         INTEGER NOT NULL DEFAULT 0,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.formas_pagamento (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT NOT NULL UNIQUE,
  ordem      INTEGER NOT NULL DEFAULT 0,
  ativo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS certificados_set_updated_at ON public.certificados;
CREATE TRIGGER certificados_set_updated_at
  BEFORE UPDATE ON public.certificados
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS precos_certificados_set_updated_at ON public.precos_certificados;
CREATE TRIGGER precos_certificados_set_updated_at
  BEFORE UPDATE ON public.precos_certificados
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS faixas_comissao_set_updated_at ON public.faixas_comissao;
CREATE TRIGGER faixas_comissao_set_updated_at
  BEFORE UPDATE ON public.faixas_comissao
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS formas_pagamento_set_updated_at ON public.formas_pagamento;
CREATE TRIGGER formas_pagamento_set_updated_at
  BEFORE UPDATE ON public.formas_pagamento
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precos_certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faixas_comissao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formas_pagamento ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "certificados_select" ON public.certificados;
DROP POLICY IF EXISTS "certificados_write" ON public.certificados;
CREATE POLICY "certificados_select" ON public.certificados
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "certificados_write" ON public.certificados
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  );

DROP POLICY IF EXISTS "precos_certificados_select" ON public.precos_certificados;
DROP POLICY IF EXISTS "precos_certificados_write" ON public.precos_certificados;
CREATE POLICY "precos_certificados_select" ON public.precos_certificados
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "precos_certificados_write" ON public.precos_certificados
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  );

DROP POLICY IF EXISTS "faixas_comissao_select" ON public.faixas_comissao;
DROP POLICY IF EXISTS "faixas_comissao_write" ON public.faixas_comissao;
CREATE POLICY "faixas_comissao_select" ON public.faixas_comissao
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "faixas_comissao_write" ON public.faixas_comissao
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  );

DROP POLICY IF EXISTS "formas_pagamento_select" ON public.formas_pagamento;
DROP POLICY IF EXISTS "formas_pagamento_write" ON public.formas_pagamento;
CREATE POLICY "formas_pagamento_select" ON public.formas_pagamento
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "formas_pagamento_write" ON public.formas_pagamento
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND perfil IN ('admin', 'agente_registro', 'vendedor')
        AND status = 'ativo'
    )
  );

INSERT INTO public.certificados (tipo, estoque, validade, ativo) VALUES
  ('e-CPF A1', 142, '1 ano', TRUE),
  ('e-CPF A3', 87, '3 anos', TRUE),
  ('e-CNPJ A1', 63, '1 ano', TRUE),
  ('e-CNPJ A3', 45, '3 anos', TRUE),
  ('NF-e A1', 28, '1 ano', TRUE),
  ('SSL', 12, '1 ano', TRUE)
ON CONFLICT (tipo) DO UPDATE SET
  estoque = EXCLUDED.estoque,
  validade = EXCLUDED.validade,
  ativo = EXCLUDED.ativo;

INSERT INTO public.precos_certificados (certificado_id, canal, valor, ativo)
SELECT c.id, p.canal, p.valor, TRUE
FROM public.certificados c
JOIN (
  VALUES
    ('e-CPF A1', 'balcao', 149.90), ('e-CPF A1', 'ecommerce', 139.90), ('e-CPF A1', 'prepago', 129.90),
    ('e-CPF A3', 'balcao', 219.90), ('e-CPF A3', 'ecommerce', 199.90), ('e-CPF A3', 'prepago', 189.90),
    ('e-CNPJ A1', 'balcao', 299.90), ('e-CNPJ A1', 'ecommerce', 279.90), ('e-CNPJ A1', 'prepago', 259.90),
    ('e-CNPJ A3', 'balcao', 389.90), ('e-CNPJ A3', 'ecommerce', 359.90), ('e-CNPJ A3', 'prepago', 339.90),
    ('NF-e A1', 'balcao', 249.90), ('NF-e A1', 'ecommerce', 229.90), ('NF-e A1', 'prepago', 209.90)
) AS p(tipo, canal, valor) ON p.tipo = c.tipo
ON CONFLICT (certificado_id, canal) DO UPDATE SET
  valor = EXCLUDED.valor,
  ativo = EXCLUDED.ativo;

INSERT INTO public.faixas_comissao (faixa, min_emissoes, max_emissoes, percentual, valor_exemplo, ordem, ativo) VALUES
  ('1 - 50 emissoes', 1, 50, 8, 11.99, 1, TRUE),
  ('51 - 100 emissoes', 51, 100, 10, 14.99, 2, TRUE),
  ('101 - 200 emissoes', 101, 200, 12, 17.99, 3, TRUE),
  ('201+ emissoes', 201, NULL, 15, 22.49, 4, TRUE)
ON CONFLICT (faixa) DO UPDATE SET
  min_emissoes = EXCLUDED.min_emissoes,
  max_emissoes = EXCLUDED.max_emissoes,
  percentual = EXCLUDED.percentual,
  valor_exemplo = EXCLUDED.valor_exemplo,
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo;

INSERT INTO public.formas_pagamento (nome, ordem, ativo) VALUES
  ('Dinheiro', 1, TRUE),
  ('Cartao de Credito', 2, TRUE),
  ('Cartao de Debito', 3, TRUE),
  ('PIX', 4, TRUE),
  ('Transferencia', 5, TRUE),
  ('Boleto', 6, TRUE),
  ('Pre-pago', 7, TRUE),
  ('Voucher', 8, TRUE),
  ('Link Externo', 9, TRUE)
ON CONFLICT (nome) DO UPDATE SET
  ordem = EXCLUDED.ordem,
  ativo = EXCLUDED.ativo;
