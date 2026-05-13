-- ================================================================
-- INTEGRATIONS SCHEMA - CRM CERTIFICACAO DIGITAL
-- Execute no Supabase SQL Editor apos auth_schema.sql
-- ================================================================

CREATE TABLE IF NOT EXISTS public.external_integrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider        TEXT NOT NULL UNIQUE CHECK (provider IN ('chatwoot', 'email_smtp', 'n8n', 'gestao_ar', 'safe2pay', 'safeweb', 'supabase')),
  name            TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('ativo', 'pendente', 'erro', 'inativo')),
  base_url        TEXT,
  webhook_url     TEXT,
  api_token       TEXT,
  account_id      TEXT,
  inbox_id        TEXT,
  sender_name     TEXT,
  sender_email    TEXT,
  host            TEXT,
  port            INTEGER,
  username        TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_test_at    TIMESTAMPTZ,
  last_error      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.automation_rules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_key    TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  channel     TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'whatsapp_email', 'webhook')),
  trigger_key TEXT NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT FALSE,
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communication_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  channel     TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email')),
  subject     TEXT,
  body        TEXT NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communication_outbox (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel        TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'webhook')),
  provider       TEXT NOT NULL CHECK (provider IN ('chatwoot', 'email_smtp', 'n8n')),
  to_address     TEXT NOT NULL,
  subject        TEXT,
  body           TEXT NOT NULL,
  payload        JSONB NOT NULL DEFAULT '{}'::jsonb,
  status         TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'sent', 'failed', 'cancelled')),
  error_message  TEXT,
  scheduled_for  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at        TIMESTAMPTZ,
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communication_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source          TEXT NOT NULL DEFAULT 'system',
  event_type      TEXT NOT NULL,
  external_id     TEXT,
  lead_id         UUID,
  conversation_id TEXT,
  contact         TEXT,
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS external_integrations_set_updated_at ON public.external_integrations;
CREATE TRIGGER external_integrations_set_updated_at
  BEFORE UPDATE ON public.external_integrations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS automation_rules_set_updated_at ON public.automation_rules;
CREATE TRIGGER automation_rules_set_updated_at
  BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS communication_templates_set_updated_at ON public.communication_templates;
CREATE TRIGGER communication_templates_set_updated_at
  BEFORE UPDATE ON public.communication_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS communication_outbox_set_updated_at ON public.communication_outbox;
CREATE TRIGGER communication_outbox_set_updated_at
  BEFORE UPDATE ON public.communication_outbox
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.external_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "external_integrations_select_admin" ON public.external_integrations;
DROP POLICY IF EXISTS "external_integrations_write_admin" ON public.external_integrations;
CREATE POLICY "external_integrations_select_admin" ON public.external_integrations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );
CREATE POLICY "external_integrations_write_admin" ON public.external_integrations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

DROP POLICY IF EXISTS "automation_rules_select" ON public.automation_rules;
DROP POLICY IF EXISTS "automation_rules_write_admin" ON public.automation_rules;
CREATE POLICY "automation_rules_select" ON public.automation_rules
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "automation_rules_write_admin" ON public.automation_rules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

DROP POLICY IF EXISTS "communication_templates_select" ON public.communication_templates;
DROP POLICY IF EXISTS "communication_templates_write_admin" ON public.communication_templates;
CREATE POLICY "communication_templates_select" ON public.communication_templates
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "communication_templates_write_admin" ON public.communication_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

DROP POLICY IF EXISTS "communication_outbox_select_admin" ON public.communication_outbox;
DROP POLICY IF EXISTS "communication_outbox_insert_authenticated" ON public.communication_outbox;
DROP POLICY IF EXISTS "communication_outbox_update_admin" ON public.communication_outbox;
CREATE POLICY "communication_outbox_select_admin" ON public.communication_outbox
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );
CREATE POLICY "communication_outbox_insert_authenticated" ON public.communication_outbox
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "communication_outbox_update_admin" ON public.communication_outbox
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

DROP POLICY IF EXISTS "communication_events_select_admin" ON public.communication_events;
DROP POLICY IF EXISTS "communication_events_insert_authenticated" ON public.communication_events;
CREATE POLICY "communication_events_select_admin" ON public.communication_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );
CREATE POLICY "communication_events_insert_authenticated" ON public.communication_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.external_integrations (provider, name, description, status, base_url, webhook_url, account_id, inbox_id, sender_name, sender_email, host, port, username, metadata) VALUES
  ('chatwoot', 'Chatwoot / WhatsApp', 'Envio e recebimento de mensagens WhatsApp via Chatwoot', 'pendente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"docs":"https://www.chatwoot.com/developers/api/"}'),
  ('email_smtp', 'Email SMTP', 'Envio de emails transacionais e campanhas', 'pendente', NULL, NULL, NULL, NULL, 'AR CERTI ID', NULL, 'smtp.gmail.com', 587, NULL, '{}'::jsonb),
  ('n8n', 'N8N Webhooks', 'Webhooks para automacoes externas e processamento assíncrono', 'pendente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}'::jsonb),
  ('gestao_ar', 'CertiID / Gestão AR', 'Plataforma principal de certificacao digital', 'pendente', 'https://gestaoar.com.br/ARCertiID/', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}'::jsonb),
  ('safe2pay', 'Safe2Pay', 'Gateway de pagamentos', 'pendente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}'::jsonb),
  ('safeweb', 'Safeweb', 'Autoridade certificadora', 'pendente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}'::jsonb),
  ('supabase', 'Supabase', 'Banco de dados, autenticacao e realtime', 'ativo', 'https://cvfrhfiaprdtwxxplngk.supabase.co', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{}'::jsonb)
ON CONFLICT (provider) DO NOTHING;

INSERT INTO public.automation_rules (rule_key, label, channel, trigger_key, ativo, metadata) VALUES
  ('ren30', 'Alerta 30 dias antes do vencimento', 'whatsapp_email', 'renovacao_30_dias', FALSE, '{"dias":30}'::jsonb),
  ('ren15', 'Alerta 15 dias antes do vencimento', 'whatsapp', 'renovacao_15_dias', FALSE, '{"dias":15}'::jsonb),
  ('ren7', 'Alerta 7 dias antes do vencimento', 'whatsapp', 'renovacao_7_dias', FALSE, '{"dias":7}'::jsonb),
  ('followup', 'Follow-up após 3 dias sem resposta', 'whatsapp', 'followup_3_dias', FALSE, '{"dias":3}'::jsonb),
  ('conv', 'Confirmação automática de pagamento', 'whatsapp_email', 'pagamento_confirmado', FALSE, '{}'::jsonb),
  ('expiro', 'Notificação de certificado expirado', 'email', 'certificado_expirado', FALSE, '{}'::jsonb)
ON CONFLICT (rule_key) DO NOTHING;

INSERT INTO public.communication_templates (template_key, name, channel, subject, body, ativo) VALUES
  ('renovacao_whatsapp', 'Renovação - WhatsApp', 'whatsapp', NULL, 'Olá {{cliente}}, seu certificado {{tipo_certificado}} vence em {{dias_restantes}} dias. Posso te ajudar com a renovação?', TRUE),
  ('renovacao_email', 'Renovação - Email', 'email', 'Renovação do seu certificado digital', 'Olá {{cliente}}, seu certificado {{tipo_certificado}} vence em {{dias_restantes}} dias. Entre em contato para renovar.', TRUE)
ON CONFLICT (template_key) DO NOTHING;
