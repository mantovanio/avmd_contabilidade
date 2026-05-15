-- ================================================================
-- MIGRATION V2 OFICIAL — CertiID
-- Aplicar no Supabase Dashboard > SQL Editor
-- Este arquivo é idempotente e pode ser re-executado com segurança.
-- ================================================================

BEGIN;

-- ----------------------------------------------------------------
-- FUNÇÃO UTILITÁRIA updated_at (mantida se já existir)
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ================================================================
-- BLOCO 1: TABELAS MESTRES (sem dependências de outras v2)
-- ================================================================

-- 1. Cadastro base de faturamento
CREATE TABLE IF NOT EXISTS public.cadastros_base (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_cliente        TEXT        NOT NULL CHECK (tipo_cliente IN ('pessoa_fisica', 'pessoa_juridica')),
  tipo_cadastro       TEXT        NOT NULL DEFAULT 'cliente'
                                  CHECK (tipo_cadastro IN ('cliente', 'fornecedor', 'cliente_fornecedor')),
  cpf_cnpj            TEXT        NOT NULL UNIQUE,
  nome                TEXT        NOT NULL,
  nome_fantasia       TEXT,
  email               TEXT,
  telefone            TEXT,
  cidade              TEXT,
  logradouro          TEXT,
  numero              TEXT,
  complemento         TEXT,
  bairro              TEXT,
  uf                  CHAR(2),
  cep                 TEXT,
  inscricao_municipal TEXT,
  inscricao_estadual  TEXT,
  iss_retido          BOOLEAN     NOT NULL DEFAULT FALSE,
  status              TEXT        NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  metadata            JSONB       NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS cadastros_base_set_updated_at ON public.cadastros_base;
CREATE TRIGGER cadastros_base_set_updated_at
  BEFORE UPDATE ON public.cadastros_base
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Empresas vinculadas ao cadastro base
CREATE TABLE IF NOT EXISTS public.empresas_cliente (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cadastro_base_id UUID        NOT NULL REFERENCES public.cadastros_base(id) ON DELETE CASCADE,
  cnpj             TEXT        UNIQUE,
  razao_social     TEXT        NOT NULL,
  nome_fantasia    TEXT,
  email            TEXT,
  telefone         TEXT,
  cidade           TEXT,
  status           TEXT        NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  metadata         JSONB       NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS empresas_cliente_set_updated_at ON public.empresas_cliente;
CREATE TRIGGER empresas_cliente_set_updated_at
  BEFORE UPDATE ON public.empresas_cliente
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Titulares do certificado
CREATE TABLE IF NOT EXISTS public.titulares_certificado (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            TEXT        NOT NULL,
  cpf             TEXT        NOT NULL UNIQUE,
  data_nascimento DATE,
  email           TEXT,
  telefone        TEXT,
  metadata        JSONB       NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS titulares_certificado_set_updated_at ON public.titulares_certificado;
CREATE TRIGGER titulares_certificado_set_updated_at
  BEFORE UPDATE ON public.titulares_certificado
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Pontos de atendimento
CREATE TABLE IF NOT EXISTS public.pontos_atendimento (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo     TEXT        UNIQUE,
  nome       TEXT        NOT NULL,
  endereco   TEXT,
  cidade     TEXT,
  uf         CHAR(2),
  status     TEXT        NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  metadata   JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS pontos_atendimento_set_updated_at ON public.pontos_atendimento;
CREATE TRIGGER pontos_atendimento_set_updated_at
  BEFORE UPDATE ON public.pontos_atendimento
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Relação N:N ponto de atendimento x agente de registro
CREATE TABLE IF NOT EXISTS public.ponto_atendimento_agentes (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ponto_atendimento_id UUID        NOT NULL REFERENCES public.pontos_atendimento(id) ON DELETE CASCADE,
  agente_id            UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  principal            BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (ponto_atendimento_id, agente_id)
);

-- 11. Bancos
CREATE TABLE IF NOT EXISTS public.bancos (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo     TEXT        NOT NULL UNIQUE,
  nome       TEXT        NOT NULL,
  ispb       TEXT,
  ativo      BOOLEAN     NOT NULL DEFAULT TRUE,
  origem     TEXT        NOT NULL DEFAULT 'seed',
  metadata   JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS bancos_set_updated_at ON public.bancos;
CREATE TRIGGER bancos_set_updated_at
  BEFORE UPDATE ON public.bancos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 12. Contas bancárias
CREATE TABLE IF NOT EXISTS public.contas_bancarias_v2 (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  banco_id                 UUID         NOT NULL REFERENCES public.bancos(id) ON DELETE RESTRICT,
  tipo_conta               TEXT         NOT NULL CHECK (tipo_conta IN ('corrente', 'poupanca', 'pagamento', 'outro')),
  agencia                  TEXT,
  conta                    TEXT,
  digito                   TEXT,
  titular_cadastro_base_id UUID         REFERENCES public.cadastros_base(id) ON DELETE SET NULL,
  cnpj_cpf_titular         TEXT,
  nome_titular             TEXT,
  data_abertura            DATE,
  saldo_inicial            NUMERIC(12,2) NOT NULL DEFAULT 0,
  ativa                    BOOLEAN      NOT NULL DEFAULT TRUE,
  gateway                  TEXT,
  metadata                 JSONB        NOT NULL DEFAULT '{}',
  created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS contas_bancarias_v2_set_updated_at ON public.contas_bancarias_v2;
CREATE TRIGGER contas_bancarias_v2_set_updated_at
  BEFORE UPDATE ON public.contas_bancarias_v2
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 12.1 Formas de pagamento (mestre)
CREATE TABLE IF NOT EXISTS public.formas_pagamento_v2 (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT        NOT NULL UNIQUE,
  codigo     TEXT        UNIQUE,
  tipo       TEXT,
  gateway    TEXT,
  ativo      BOOLEAN     NOT NULL DEFAULT TRUE,
  metadata   JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS formas_pagamento_v2_set_updated_at ON public.formas_pagamento_v2;
CREATE TRIGGER formas_pagamento_v2_set_updated_at
  BEFORE UPDATE ON public.formas_pagamento_v2
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 12.2 Disponibilidade de formas de pagamento por tipo de parceiro/canal
CREATE TABLE IF NOT EXISTS public.formas_pagamento_disponibilidade (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  forma_pagamento_id UUID        NOT NULL REFERENCES public.formas_pagamento_v2(id) ON DELETE CASCADE,
  tipo_parceiro      TEXT        NOT NULL
                                 CHECK (tipo_parceiro IN ('ar', 'pa_controle_total', 'pa_emissor', 'contador', 'vendedor', 'gestor', 'ecommerce')),
  permitido          BOOLEAN     NOT NULL DEFAULT TRUE,
  ordem              INTEGER     NOT NULL DEFAULT 0,
  metadata           JSONB       NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (forma_pagamento_id, tipo_parceiro)
);
DROP TRIGGER IF EXISTS formas_pagamento_disponibilidade_set_updated_at ON public.formas_pagamento_disponibilidade;
CREATE TRIGGER formas_pagamento_disponibilidade_set_updated_at
  BEFORE UPDATE ON public.formas_pagamento_disponibilidade
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 13. Plano de contas
CREATE TABLE IF NOT EXISTS public.planos_contas (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_conta       TEXT        NOT NULL CHECK (tipo_conta IN ('receita', 'despesa', 'ativo', 'passivo', 'patrimonio')),
  agrupador        TEXT,
  conta_lancamento TEXT        NOT NULL,
  codigo_reduzido  TEXT,
  ativa            BOOLEAN     NOT NULL DEFAULT TRUE,
  metadata         JSONB       NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS planos_contas_set_updated_at ON public.planos_contas;
CREATE TRIGGER planos_contas_set_updated_at
  BEFORE UPDATE ON public.planos_contas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 14. Centros de custos
CREATE TABLE IF NOT EXISTS public.centros_custos (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT        NOT NULL UNIQUE,
  codigo     TEXT,
  ativo      BOOLEAN     NOT NULL DEFAULT TRUE,
  metadata   JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS centros_custos_set_updated_at ON public.centros_custos;
CREATE TRIGGER centros_custos_set_updated_at
  BEFORE UPDATE ON public.centros_custos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 16.1 Regras de comissão
CREATE TABLE IF NOT EXISTS public.regras_comissao (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  escopo         TEXT         NOT NULL,
  perfil_destino TEXT         NOT NULL,
  tipo_calculo   TEXT         NOT NULL CHECK (tipo_calculo IN ('fixa', 'percentual')),
  valor          NUMERIC(10,2) NOT NULL,
  vigencia_inicio DATE,
  vigencia_fim   DATE,
  ativo          BOOLEAN      NOT NULL DEFAULT TRUE,
  metadata       JSONB        NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS regras_comissao_set_updated_at ON public.regras_comissao;
CREATE TRIGGER regras_comissao_set_updated_at
  BEFORE UPDATE ON public.regras_comissao
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 17. Configuração de NFS-e
CREATE TABLE IF NOT EXISTS public.nfse_configuracoes (
  id                          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  cadastro_base_emitente_id   UUID         REFERENCES public.cadastros_base(id) ON DELETE SET NULL,
  cnpj_emitente               TEXT         NOT NULL,
  inscricao_municipal         TEXT,
  inscricao_estadual          TEXT,
  cnae                        TEXT,
  ambiente                    TEXT         NOT NULL DEFAULT 'homologacao' CHECK (ambiente IN ('homologacao', 'producao')),
  natureza_operacao           TEXT,
  simples_nacional            BOOLEAN      NOT NULL DEFAULT FALSE,
  regime_especial             TEXT,
  exigibilidade_iss           TEXT,
  incentivo_fiscal            BOOLEAN      NOT NULL DEFAULT FALSE,
  tipo_rps                    TEXT,
  serie_rps                   TEXT,
  numero_rps_atual            INTEGER      NOT NULL DEFAULT 1,
  codigo_servico_municipio    TEXT,
  codigo_tributacao_municipio TEXT,
  codigo_cfps                 TEXT,
  codigo_cst                  TEXT,
  aliquota_iss                NUMERIC(8,4),
  aliquota_pis                NUMERIC(8,4),
  aliquota_cofins             NUMERIC(8,4),
  aliquota_inss               NUMERIC(8,4),
  aliquota_ir                 NUMERIC(8,4),
  aliquota_csll               NUMERIC(8,4),
  -- Credenciais: nunca expor no frontend — acessar apenas via service role
  usuario_prefeitura          TEXT,
  senha_prefeitura            TEXT,
  chave_autenticacao          TEXT,
  robo_ligado                 BOOLEAN      NOT NULL DEFAULT FALSE,
  payload_reforma_tributaria  JSONB        NOT NULL DEFAULT '{}',
  updated_by                  UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS nfse_configuracoes_set_updated_at ON public.nfse_configuracoes;
CREATE TRIGGER nfse_configuracoes_set_updated_at
  BEFORE UPDATE ON public.nfse_configuracoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- BLOCO 2: TABELA OPERACIONAL CENTRAL
-- ================================================================

-- 6. Vendas de certificados (tabela operacional central)
CREATE TABLE IF NOT EXISTS public.vendas_certificados (
  id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  cadastro_base_id      UUID         NOT NULL REFERENCES public.cadastros_base(id) ON DELETE RESTRICT,
  empresa_id            UUID         REFERENCES public.empresas_cliente(id) ON DELETE SET NULL,
  titular_id            UUID         NOT NULL REFERENCES public.titulares_certificado(id) ON DELETE RESTRICT,
  certificado_id        UUID,  -- FK para certificados adicionada após confirmar existência da tabela
  tipo_produto          TEXT         NOT NULL,
  tipo_venda            TEXT,
  tipo_emissao          TEXT,
  tabela_preco          TEXT,
  forma_pagamento_id    UUID         REFERENCES public.formas_pagamento_v2(id) ON DELETE SET NULL,
  valor_venda           NUMERIC(10,2),
  valor_custo           NUMERIC(10,2),
  -- Snapshot de faturamento no momento da venda (usado para NFS-e)
  documento_faturamento TEXT,
  nome_faturamento      TEXT,
  email_faturamento     TEXT,
  telefone_faturamento  TEXT,
  logradouro            TEXT,
  numero                TEXT,
  complemento           TEXT,
  bairro                TEXT,
  cidade                TEXT,
  uf                    CHAR(2),
  cep                   TEXT,
  inscricao_municipal   TEXT,
  inscricao_estadual    TEXT,
  iss_retido            BOOLEAN      NOT NULL DEFAULT FALSE,
  -- Responsáveis
  vendedor_id           UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  agente_registro_id    UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  contador_id           UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  ponto_atendimento_id  UUID         NOT NULL REFERENCES public.pontos_atendimento(id) ON DELETE RESTRICT,
  -- Pedido e protocolo chegam em momentos diferentes
  pedido_numero         TEXT,
  pedido_status         TEXT         NOT NULL DEFAULT 'nao_gerado'
                                     CHECK (pedido_status IN ('nao_gerado', 'pendente', 'gerado', 'erro', 'cancelado')),
  protocolo_numero      TEXT,
  protocolo_status      TEXT         NOT NULL DEFAULT 'nao_gerado'
                                     CHECK (protocolo_status IN ('nao_gerado', 'pendente', 'gerado', 'erro', 'cancelado')),
  certificadora         TEXT,
  api_payload_pedido    JSONB        NOT NULL DEFAULT '{}',
  api_payload_protocolo JSONB        NOT NULL DEFAULT '{}',
  -- Comissão snapshot (calculada no momento da venda)
  comissao_vendedor_tipo  TEXT       CHECK (comissao_vendedor_tipo IN ('fixa', 'percentual')),
  comissao_vendedor_valor NUMERIC(10,2),
  comissao_agente_tipo    TEXT       CHECK (comissao_agente_tipo IN ('fixa', 'percentual')),
  comissao_agente_valor   NUMERIC(10,2),
  status_venda          TEXT         NOT NULL DEFAULT 'rascunho'
                                     CHECK (status_venda IN ('rascunho', 'vendido', 'agendado', 'em_validacao', 'emitido', 'cancelado')),
  observacoes           TEXT,
  metadata              JSONB        NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS vendas_certificados_set_updated_at ON public.vendas_certificados;
CREATE TRIGGER vendas_certificados_set_updated_at
  BEFORE UPDATE ON public.vendas_certificados
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- BLOCO 3: TABELAS FILHAS DE VENDAS
-- ================================================================

-- 7. Agendamentos de validação
CREATE TABLE IF NOT EXISTS public.agendamentos_validacao (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  venda_certificado_id UUID        NOT NULL REFERENCES public.vendas_certificados(id) ON DELETE CASCADE,
  cadastro_base_id     UUID        NOT NULL REFERENCES public.cadastros_base(id) ON DELETE RESTRICT,
  empresa_id           UUID        REFERENCES public.empresas_cliente(id) ON DELETE SET NULL,
  titular_id           UUID        NOT NULL REFERENCES public.titulares_certificado(id) ON DELETE RESTRICT,
  contador_id          UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  agente_registro_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  ponto_atendimento_id UUID        NOT NULL REFERENCES public.pontos_atendimento(id) ON DELETE RESTRICT,
  data_agendada        TIMESTAMPTZ,
  tipo_atendimento     TEXT        CHECK (tipo_atendimento IN ('presencial', 'videoconferencia', 'auto_atendimento')),
  status_agendamento   TEXT        NOT NULL DEFAULT 'pendente'
                                   CHECK (status_agendamento IN ('pendente', 'confirmado', 'realizado', 'cancelado')),
  observacoes          TEXT,
  metadata             JSONB       NOT NULL DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS agendamentos_validacao_set_updated_at ON public.agendamentos_validacao;
CREATE TRIGGER agendamentos_validacao_set_updated_at
  BEFORE UPDATE ON public.agendamentos_validacao
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. Produtos emitidos (certificado efetivamente emitido)
CREATE TABLE IF NOT EXISTS public.produtos_emitidos (
  id                         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  venda_certificado_id       UUID        NOT NULL REFERENCES public.vendas_certificados(id) ON DELETE CASCADE,
  cadastro_base_id           UUID        NOT NULL REFERENCES public.cadastros_base(id) ON DELETE RESTRICT,
  empresa_id                 UUID        REFERENCES public.empresas_cliente(id) ON DELETE SET NULL,
  titular_id                 UUID        NOT NULL REFERENCES public.titulares_certificado(id) ON DELETE RESTRICT,
  certificado_id             UUID,  -- FK para certificados adicionada após confirmar existência da tabela
  pedido_numero              TEXT,
  protocolo_numero           TEXT,
  numero_serie               TEXT,
  descricao_produto          TEXT,
  descricao_produto_midia    TEXT,
  validade                   TEXT,
  data_emissao               DATE,
  data_validade              DATE,
  status_certificado         TEXT        NOT NULL DEFAULT 'ativo'
                                         CHECK (status_certificado IN ('ativo', 'expirado', 'revogado', 'cancelado')),
  data_revogacao             TIMESTAMPTZ,
  revogado_por               TEXT,
  codigo_revogacao           TEXT,
  descricao_revogacao        TEXT,
  aci_data                   TIMESTAMPTZ,
  aci_data_limite            TIMESTAMPTZ,
  inicio_videoconferencia    TIMESTAMPTZ,
  inicio_gravacao            TIMESTAMPTZ,
  fim_gravacao               TIMESTAMPTZ,
  latitude_emissao           NUMERIC(10,7),
  longitude_emissao          NUMERIC(10,7),
  latitude_local             NUMERIC(10,7),
  longitude_local            NUMERIC(10,7),
  nome_equipamento           TEXT,
  dna_equipamento            TEXT,
  verificacao                TEXT,
  endereco_validacao_externa TEXT,
  tipo_emissao_realizada     TEXT,
  tipo_emissao_solicitada    TEXT,
  periodo_uso                TEXT,
  modelo                     TEXT,
  grupo                      TEXT,
  metadata                   JSONB       NOT NULL DEFAULT '{}',
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS produtos_emitidos_set_updated_at ON public.produtos_emitidos;
CREATE TRIGGER produtos_emitidos_set_updated_at
  BEFORE UPDATE ON public.produtos_emitidos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. Documentos financeiros e sensíveis
CREATE TABLE IF NOT EXISTS public.documentos_financeiros (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- FK para lancamentos_financeiros adicionada sem constraint (tabela legada sem schema local)
  lancamento_financeiro_id UUID,
  cadastro_base_id         UUID        REFERENCES public.cadastros_base(id) ON DELETE SET NULL,
  empresa_id               UUID        REFERENCES public.empresas_cliente(id) ON DELETE SET NULL,
  titular_id               UUID        REFERENCES public.titulares_certificado(id) ON DELETE SET NULL,
  venda_certificado_id     UUID        REFERENCES public.vendas_certificados(id) ON DELETE SET NULL,
  produto_emitido_id       UUID        REFERENCES public.produtos_emitidos(id) ON DELETE SET NULL,
  tipo_documento           TEXT        NOT NULL
                                       CHECK (tipo_documento IN (
                                         'nota_fiscal', 'comprovante_pagamento', 'contrato',
                                         'documento_pessoal', 'documento_empresa', 'outro'
                                       )),
  bucket                   TEXT        NOT NULL,
  storage_path             TEXT        NOT NULL UNIQUE,
  nome_original            TEXT        NOT NULL,
  mime_type                TEXT,
  tamanho_bytes            BIGINT,
  hash_arquivo             TEXT,
  sensivel                 BOOLEAN     NOT NULL DEFAULT FALSE,
  metadata                 JSONB       NOT NULL DEFAULT '{}',
  created_by               UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at               TIMESTAMPTZ
);

-- 16.2 Lançamentos de comissão
CREATE TABLE IF NOT EXISTS public.comissoes_lancamentos (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  venda_certificado_id UUID         REFERENCES public.vendas_certificados(id) ON DELETE SET NULL,
  produto_emitido_id   UUID         REFERENCES public.produtos_emitidos(id) ON DELETE SET NULL,
  usuario_id           UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  papel                TEXT         NOT NULL CHECK (papel IN ('vendedor', 'parceiro', 'agente_registro')),
  base_valor           NUMERIC(10,2) NOT NULL DEFAULT 0,
  percentual           NUMERIC(8,4),
  valor_comissao       NUMERIC(10,2) NOT NULL DEFAULT 0,
  competencia          DATE         NOT NULL,
  status               TEXT         NOT NULL DEFAULT 'pendente'
                                    CHECK (status IN ('pendente', 'aprovada', 'paga', 'cancelada')),
  origem               TEXT,
  metadata             JSONB        NOT NULL DEFAULT '{}',
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS comissoes_lancamentos_set_updated_at ON public.comissoes_lancamentos;
CREATE TRIGGER comissoes_lancamentos_set_updated_at
  BEFORE UPDATE ON public.comissoes_lancamentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 18. NFS-e emitidas
CREATE TABLE IF NOT EXISTS public.nfse_emitidas (
  id                       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  -- FK sem constraint (tabela lancamentos_financeiros é legada)
  lancamento_financeiro_id UUID,
  cadastro_base_tomador_id UUID         REFERENCES public.cadastros_base(id) ON DELETE SET NULL,
  venda_certificado_id     UUID         REFERENCES public.vendas_certificados(id) ON DELETE SET NULL,
  numero_nf                TEXT,
  codigo_verificacao       TEXT,
  status_nf                TEXT         NOT NULL DEFAULT 'pendente'
                                        CHECK (status_nf IN ('pendente', 'emitida', 'erro', 'cancelada')),
  data_emissao             TIMESTAMPTZ,
  valor_servico            NUMERIC(10,2),
  valor_iss                NUMERIC(10,2),
  xml_url                  TEXT,
  pdf_url                  TEXT,
  payload_envio            JSONB        NOT NULL DEFAULT '{}',
  payload_retorno          JSONB        NOT NULL DEFAULT '{}',
  metadata                 JSONB        NOT NULL DEFAULT '{}',
  created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS nfse_emitidas_set_updated_at ON public.nfse_emitidas;
CREATE TRIGGER nfse_emitidas_set_updated_at
  BEFORE UPDATE ON public.nfse_emitidas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- BLOCO 4: FECHAMENTO E PAGAMENTO DE AGENTES
-- ================================================================

-- 16.3 Lotes de fechamento mensal
CREATE TABLE IF NOT EXISTS public.fechamentos_agentes_lotes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  competencia       DATE        NOT NULL UNIQUE,
  status_fechamento TEXT        NOT NULL DEFAULT 'aberto'
                                CHECK (status_fechamento IN ('aberto', 'fechado', 'processando_pagamento', 'concluido', 'cancelado')),
  observacoes       TEXT,
  gerado_por        UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS fechamentos_agentes_lotes_set_updated_at ON public.fechamentos_agentes_lotes;
CREATE TRIGGER fechamentos_agentes_lotes_set_updated_at
  BEFORE UPDATE ON public.fechamentos_agentes_lotes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Itens do fechamento (um registro por agente por competência)
CREATE TABLE IF NOT EXISTS public.fechamentos_agentes_itens (
  id                        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_fechamento_id        UUID         NOT NULL REFERENCES public.fechamentos_agentes_lotes(id) ON DELETE CASCADE,
  agente_id                 UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  cpf_agente                TEXT,
  nome_agente               TEXT         NOT NULL,
  valor_bruto               NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_fgts                NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_inss                NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_ir                  NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_outras_retencoes    NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_liquido             NUMERIC(10,2) NOT NULL DEFAULT 0,
  status_pagamento          TEXT         NOT NULL DEFAULT 'pendente'
                                         CHECK (status_pagamento IN ('pendente', 'selecionado', 'enviado', 'pago', 'erro', 'cancelado')),
  data_pagamento            TIMESTAMPTZ,
  conta_bancaria_destino_id UUID         REFERENCES public.contas_bancarias_v2(id) ON DELETE SET NULL,
  metadata                  JSONB        NOT NULL DEFAULT '{}',
  created_at                TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (lote_fechamento_id, agente_id)
);
DROP TRIGGER IF EXISTS fechamentos_agentes_itens_set_updated_at ON public.fechamentos_agentes_itens;
CREATE TRIGGER fechamentos_agentes_itens_set_updated_at
  BEFORE UPDATE ON public.fechamentos_agentes_itens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Vínculo entre item de fechamento e lançamentos de comissão que o compõem
CREATE TABLE IF NOT EXISTS public.fechamentos_agentes_item_comissoes (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  fechamento_item_id     UUID        NOT NULL REFERENCES public.fechamentos_agentes_itens(id) ON DELETE CASCADE,
  comissao_lancamento_id UUID        NOT NULL REFERENCES public.comissoes_lancamentos(id) ON DELETE CASCADE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (fechamento_item_id, comissao_lancamento_id)
);

-- 16.4 Ordens de pagamento externas
CREATE TABLE IF NOT EXISTS public.ordens_pagamento (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  fechamento_item_id   UUID         NOT NULL REFERENCES public.fechamentos_agentes_itens(id) ON DELETE CASCADE,
  provider             TEXT         NOT NULL,
  conta_origem_id      UUID         REFERENCES public.contas_bancarias_v2(id) ON DELETE SET NULL,
  conta_destino_id     UUID         REFERENCES public.contas_bancarias_v2(id) ON DELETE SET NULL,
  favorecido_nome      TEXT         NOT NULL,
  favorecido_documento TEXT,
  favorecido_chave_pix TEXT,
  favorecido_banco     TEXT,
  favorecido_agencia   TEXT,
  favorecido_conta     TEXT,
  valor_pagamento      NUMERIC(10,2) NOT NULL,
  status_integracao    TEXT         NOT NULL DEFAULT 'pendente'
                                    CHECK (status_integracao IN ('pendente', 'enviado', 'processando', 'pago', 'erro', 'cancelado')),
  external_payment_id  TEXT,
  payload_envio        JSONB        NOT NULL DEFAULT '{}',
  payload_retorno      JSONB        NOT NULL DEFAULT '{}',
  erro_integracao      TEXT,
  solicitado_por       UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  processado_em        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS ordens_pagamento_set_updated_at ON public.ordens_pagamento;
CREATE TRIGGER ordens_pagamento_set_updated_at
  BEFORE UPDATE ON public.ordens_pagamento
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- BLOCO 5: ALTER TABLE EM TABELAS LEGADAS
-- ================================================================

-- 9. Extensão da tabela renovacoes (referências v2 + exclusão lógica)
ALTER TABLE public.renovacoes
  ADD COLUMN IF NOT EXISTS venda_certificado_id UUID REFERENCES public.vendas_certificados(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS produto_emitido_id   UUID REFERENCES public.produtos_emitidos(id)   ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cadastro_base_id     UUID REFERENCES public.cadastros_base(id)       ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS empresa_id           UUID REFERENCES public.empresas_cliente(id)     ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS titular_id           UUID REFERENCES public.titulares_certificado(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vendedor_fk_id       UUID REFERENCES public.profiles(id)             ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS agente_registro_fk_id UUID REFERENCES public.profiles(id)            ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS contador_fk_id       UUID REFERENCES public.profiles(id)             ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS snapshot_json        JSONB        NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS deleted_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS motivo_exclusao      TEXT;

-- 15. Extensão do financeiro operacional legado
ALTER TABLE public.lancamentos_financeiros
  ADD COLUMN IF NOT EXISTS conta_bancaria_v2_id UUID REFERENCES public.contas_bancarias_v2(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plano_conta_id       UUID REFERENCES public.planos_contas(id)        ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS centro_custo_id      UUID REFERENCES public.centros_custos(id)       ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cadastro_base_id     UUID REFERENCES public.cadastros_base(id)       ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS venda_certificado_id UUID REFERENCES public.vendas_certificados(id)  ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS produto_emitido_id   UUID REFERENCES public.produtos_emitidos(id)    ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS documento_fiscal_id  UUID;

-- ================================================================
-- BLOCO 6: ÍNDICES DE PERFORMANCE
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_empresas_cliente_cadastro_base_id
  ON public.empresas_cliente(cadastro_base_id);

CREATE INDEX IF NOT EXISTS idx_vendas_certificados_cadastro_base_id
  ON public.vendas_certificados(cadastro_base_id);
CREATE INDEX IF NOT EXISTS idx_vendas_certificados_vendedor_id
  ON public.vendas_certificados(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_vendas_certificados_agente_registro_id
  ON public.vendas_certificados(agente_registro_id);
CREATE INDEX IF NOT EXISTS idx_vendas_certificados_status_venda
  ON public.vendas_certificados(status_venda);
CREATE INDEX IF NOT EXISTS idx_vendas_certificados_created_at
  ON public.vendas_certificados(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agendamentos_venda_certificado_id
  ON public.agendamentos_validacao(venda_certificado_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_agente_registro_id
  ON public.agendamentos_validacao(agente_registro_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_agendada
  ON public.agendamentos_validacao(data_agendada);

CREATE INDEX IF NOT EXISTS idx_produtos_emitidos_venda_certificado_id
  ON public.produtos_emitidos(venda_certificado_id);
CREATE INDEX IF NOT EXISTS idx_produtos_emitidos_titular_id
  ON public.produtos_emitidos(titular_id);
CREATE INDEX IF NOT EXISTS idx_produtos_emitidos_status_certificado
  ON public.produtos_emitidos(status_certificado);

CREATE INDEX IF NOT EXISTS idx_comissoes_lancamentos_usuario_id
  ON public.comissoes_lancamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_comissoes_lancamentos_competencia
  ON public.comissoes_lancamentos(competencia DESC);
CREATE INDEX IF NOT EXISTS idx_comissoes_lancamentos_status
  ON public.comissoes_lancamentos(status);

CREATE INDEX IF NOT EXISTS idx_fechamentos_itens_lote_id
  ON public.fechamentos_agentes_itens(lote_fechamento_id);
CREATE INDEX IF NOT EXISTS idx_fechamentos_itens_agente_id
  ON public.fechamentos_agentes_itens(agente_id);

CREATE INDEX IF NOT EXISTS idx_documentos_financeiros_venda_id
  ON public.documentos_financeiros(venda_certificado_id);
CREATE INDEX IF NOT EXISTS idx_documentos_financeiros_sensivel
  ON public.documentos_financeiros(sensivel) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_renovacoes_venda_certificado_id
  ON public.renovacoes(venda_certificado_id) WHERE deleted_at IS NULL;

-- ================================================================
-- BLOCO 7: ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE public.cadastros_base                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_cliente                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.titulares_certificado            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pontos_atendimento               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ponto_atendimento_agentes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas_certificados              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos_validacao           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_emitidos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_financeiros           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bancos                           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_bancarias_v2              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formas_pagamento_v2              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formas_pagamento_disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_contas                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centros_custos                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_comissao                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comissoes_lancamentos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechamentos_agentes_lotes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechamentos_agentes_itens        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechamentos_agentes_item_comissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_pagamento                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfse_configuracoes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfse_emitidas                    ENABLE ROW LEVEL SECURITY;

-- Helper: verifica se o usuário logado tem um dos perfis aceitos e está ativo
-- Usado nos WITH CHECK para não repetir a subquery em cada política.

-- Cadastros base, empresas, titulares: leitura autenticada / escrita operacional
DROP POLICY IF EXISTS "cadastros_base_select"       ON public.cadastros_base;
DROP POLICY IF EXISTS "cadastros_base_write"        ON public.cadastros_base;
CREATE POLICY "cadastros_base_select" ON public.cadastros_base
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "cadastros_base_write" ON public.cadastros_base
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  );

DROP POLICY IF EXISTS "empresas_cliente_select"     ON public.empresas_cliente;
DROP POLICY IF EXISTS "empresas_cliente_write"      ON public.empresas_cliente;
CREATE POLICY "empresas_cliente_select" ON public.empresas_cliente
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "empresas_cliente_write" ON public.empresas_cliente
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  );

DROP POLICY IF EXISTS "titulares_certificado_select" ON public.titulares_certificado;
DROP POLICY IF EXISTS "titulares_certificado_write"  ON public.titulares_certificado;
CREATE POLICY "titulares_certificado_select" ON public.titulares_certificado
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "titulares_certificado_write" ON public.titulares_certificado
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  );

-- Pontos de atendimento: leitura autenticada / escrita admin
DROP POLICY IF EXISTS "pontos_atendimento_select"   ON public.pontos_atendimento;
DROP POLICY IF EXISTS "pontos_atendimento_write"    ON public.pontos_atendimento;
CREATE POLICY "pontos_atendimento_select" ON public.pontos_atendimento
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "pontos_atendimento_write" ON public.pontos_atendimento
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

DROP POLICY IF EXISTS "ponto_atendimento_agentes_select" ON public.ponto_atendimento_agentes;
DROP POLICY IF EXISTS "ponto_atendimento_agentes_write"  ON public.ponto_atendimento_agentes;
CREATE POLICY "ponto_atendimento_agentes_select" ON public.ponto_atendimento_agentes
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ponto_atendimento_agentes_write" ON public.ponto_atendimento_agentes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

-- Vendas: leitura autenticada / escrita operacional
DROP POLICY IF EXISTS "vendas_certificados_select"  ON public.vendas_certificados;
DROP POLICY IF EXISTS "vendas_certificados_write"   ON public.vendas_certificados;
CREATE POLICY "vendas_certificados_select" ON public.vendas_certificados
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "vendas_certificados_write" ON public.vendas_certificados
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','vendedor','agente_registro') AND status = 'ativo')
  );

-- Agendamentos: leitura autenticada / escrita admin e agente
DROP POLICY IF EXISTS "agendamentos_validacao_select" ON public.agendamentos_validacao;
DROP POLICY IF EXISTS "agendamentos_validacao_write"  ON public.agendamentos_validacao;
CREATE POLICY "agendamentos_validacao_select" ON public.agendamentos_validacao
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "agendamentos_validacao_write" ON public.agendamentos_validacao
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','agente_registro') AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','agente_registro') AND status = 'ativo')
  );

-- Produtos emitidos: leitura autenticada / escrita admin e agente
DROP POLICY IF EXISTS "produtos_emitidos_select"    ON public.produtos_emitidos;
DROP POLICY IF EXISTS "produtos_emitidos_write"     ON public.produtos_emitidos;
CREATE POLICY "produtos_emitidos_select" ON public.produtos_emitidos
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "produtos_emitidos_write" ON public.produtos_emitidos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','agente_registro') AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND perfil IN ('admin','agente_registro') AND status = 'ativo')
  );

-- Documentos financeiros: apenas admin (dados sensíveis)
DROP POLICY IF EXISTS "documentos_financeiros_select" ON public.documentos_financeiros;
DROP POLICY IF EXISTS "documentos_financeiros_write"  ON public.documentos_financeiros;
CREATE POLICY "documentos_financeiros_select" ON public.documentos_financeiros
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );
CREATE POLICY "documentos_financeiros_write" ON public.documentos_financeiros
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

-- Tabelas financeiras mestres: leitura autenticada / escrita admin
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'bancos', 'contas_bancarias_v2', 'formas_pagamento_v2',
    'formas_pagamento_disponibilidade', 'planos_contas', 'centros_custos',
    'regras_comissao', 'comissoes_lancamentos',
    'fechamentos_agentes_lotes', 'fechamentos_agentes_itens',
    'fechamentos_agentes_item_comissoes', 'ordens_pagamento',
    'nfse_configuracoes', 'nfse_emitidas'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_select" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s_write"  ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY "%s_select" ON public.%I FOR SELECT USING (auth.role() = ''authenticated'')',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "%s_write" ON public.%I FOR ALL
       USING      (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = ''admin'' AND status = ''ativo''))
       WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = ''admin'' AND status = ''ativo''))',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ================================================================
-- BLOCO 8: VIEWS DE RELATÓRIOS OPERACIONAIS
-- ================================================================

-- Certificados emitidos (ativos e revogados)
CREATE OR REPLACE VIEW public.v_certificados_emitidos AS
SELECT
  pe.id,
  pe.status_certificado,
  pe.data_emissao,
  pe.data_validade,
  pe.numero_serie,
  pe.protocolo_numero,
  pe.pedido_numero,
  cb.nome                      AS cliente_nome,
  cb.cpf_cnpj                  AS cliente_cpf_cnpj,
  tc.nome                      AS titular_nome,
  tc.cpf                       AS titular_cpf,
  ec.razao_social              AS empresa_razao_social,
  ec.cnpj                      AS empresa_cnpj,
  vc.vendedor_id,
  pv.nome                      AS vendedor_nome,
  vc.agente_registro_id,
  pa.nome                      AS agente_nome,
  pto.nome                     AS ponto_atendimento,
  pe.created_at
FROM public.produtos_emitidos pe
JOIN public.vendas_certificados vc  ON vc.id  = pe.venda_certificado_id
JOIN public.cadastros_base cb       ON cb.id  = pe.cadastro_base_id
JOIN public.titulares_certificado tc ON tc.id = pe.titular_id
LEFT JOIN public.empresas_cliente ec ON ec.id = pe.empresa_id
LEFT JOIN public.profiles pv         ON pv.id = vc.vendedor_id
LEFT JOIN public.profiles pa         ON pa.id = vc.agente_registro_id
LEFT JOIN public.pontos_atendimento pto ON pto.id = vc.ponto_atendimento_id;

-- Extrato de comissões por usuário (usado no painel individual)
CREATE OR REPLACE VIEW public.v_extrato_comissoes AS
SELECT
  cl.id,
  cl.usuario_id,
  p.nome                       AS usuario_nome,
  cl.papel,
  cl.competencia,
  cl.base_valor,
  cl.percentual,
  cl.valor_comissao,
  cl.status,
  vc.tipo_produto,
  vc.status_venda,
  cb.nome                      AS cliente_nome,
  cl.created_at
FROM public.comissoes_lancamentos cl
JOIN public.profiles p               ON p.id  = cl.usuario_id
LEFT JOIN public.vendas_certificados vc ON vc.id = cl.venda_certificado_id
LEFT JOIN public.cadastros_base cb    ON cb.id = vc.cadastro_base_id;

-- Extrato de pagamentos mensais de agentes
CREATE OR REPLACE VIEW public.v_extrato_pagamentos_agentes AS
SELECT
  fai.id,
  fal.competencia,
  fal.status_fechamento,
  fai.agente_id,
  fai.nome_agente,
  fai.cpf_agente,
  fai.valor_bruto,
  fai.valor_liquido,
  fai.status_pagamento,
  fai.data_pagamento,
  op.status_integracao         AS status_ordem_pagamento,
  op.external_payment_id
FROM public.fechamentos_agentes_itens fai
JOIN public.fechamentos_agentes_lotes fal ON fal.id = fai.lote_fechamento_id
LEFT JOIN public.ordens_pagamento op      ON op.fechamento_item_id = fai.id;

-- Clientes e fornecedores
CREATE OR REPLACE VIEW public.v_clientes_fornecedores AS
SELECT
  cb.id,
  cb.tipo_cadastro,
  cb.tipo_cliente,
  cb.cpf_cnpj,
  cb.nome,
  cb.nome_fantasia,
  cb.email,
  cb.telefone,
  cb.cidade,
  cb.uf,
  cb.status,
  COUNT(DISTINCT ec.id)        AS qtd_empresas,
  COUNT(DISTINCT vc.id)        AS qtd_vendas,
  cb.created_at
FROM public.cadastros_base cb
LEFT JOIN public.empresas_cliente ec    ON ec.cadastro_base_id = cb.id
LEFT JOIN public.vendas_certificados vc ON vc.cadastro_base_id = cb.id
GROUP BY cb.id;

-- ================================================================
-- FIM DA MIGRATION V2
-- ================================================================

COMMIT;
