-- ================================================================
-- AUTH SCHEMA — CRM CERTIFICAÇÃO DIGITAL
-- Execute no Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================================

-- 1. Tabela de perfis vinculada ao auth.users do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  perfil     TEXT NOT NULL DEFAULT 'usuario'
             CHECK (perfil IN ('admin', 'usuario', 'vendedor', 'agente_registro')),
  status     TEXT NOT NULL DEFAULT 'inativo'
             CHECK (status IN ('ativo', 'inativo')),
  tipo_vinculo TEXT DEFAULT 'usuario_comum'
             CHECK (tipo_vinculo IN ('agente_registro', 'parceiro', 'vendedor', 'contador', 'usuario_comum')),
  parceiro_id UUID NULL,
  vinculo_nome TEXT NULL,
  documento TEXT NULL,
  telefone TEXT NULL,
  cidade TEXT NULL,
  observacoes TEXT NULL,
  permissoes JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ler todos os perfis
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas administradores editam perfil/status de usuários
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin'
    )
  );

ALTER TABLE public.profiles ALTER COLUMN status SET DEFAULT 'inativo';

-- Configuracoes gerais do sistema
CREATE TABLE IF NOT EXISTS public.app_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_settings_select" ON public.app_settings;
CREATE POLICY "app_settings_select" ON public.app_settings
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "app_settings_insert" ON public.app_settings;
CREATE POLICY "app_settings_insert" ON public.app_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo'
    )
  );

DROP POLICY IF EXISTS "app_settings_update" ON public.app_settings;
CREATE POLICY "app_settings_update" ON public.app_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo'
    )
  );

-- 3. Trigger: cria perfil automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, perfil, status, tipo_vinculo, permissoes)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    'usuario',
    'inativo',
    'usuario_comum',
    '["dashboard", "relatorios"]'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- 4. PROMOVER PRIMEIRO ADMIN
-- Rode APÓS criar sua conta pelo app, substituindo o email:
-- ================================================================
-- UPDATE public.profiles
-- SET perfil = 'admin'
-- WHERE email = 'mantovanvp@gmail.com';

-- ================================================================
-- 5. (OPCIONAL) Restringir tabelas principais a usuários autenticados
-- Por ora as tabelas usam RLS permissivo (USING true).
-- Após todos os usuários migrarem, aplique:
-- ================================================================
-- ALTER POLICY "Allow all" ON parceiros USING (auth.role() = 'authenticated');
-- ALTER POLICY "Allow all" ON vendas USING (auth.role() = 'authenticated');
-- ALTER POLICY "Allow all" ON agendamentos USING (auth.role() = 'authenticated');
-- ALTER POLICY "Allow all" ON renovacoes USING (auth.role() = 'authenticated');
-- ALTER POLICY "Allow all" ON lancamentos_financeiros USING (auth.role() = 'authenticated');
-- ALTER POLICY "Allow all" ON contas_bancarias USING (auth.role() = 'authenticated');
-- ALTER POLICY "Allow all" ON leads_contabilidade USING (auth.role() = 'authenticated');
