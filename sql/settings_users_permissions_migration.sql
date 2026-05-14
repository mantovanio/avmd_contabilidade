-- ================================================================
-- SETTINGS + USER PERMISSIONS MIGRATION — CertiID
-- Execute no Supabase SQL Editor
-- ================================================================

-- 1. Campos administrativos extras no perfil do usuario
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tipo_vinculo TEXT DEFAULT 'usuario_comum',
  ADD COLUMN IF NOT EXISTS parceiro_id UUID NULL,
  ADD COLUMN IF NOT EXISTS vinculo_nome TEXT NULL,
  ADD COLUMN IF NOT EXISTS documento TEXT NULL,
  ADD COLUMN IF NOT EXISTS telefone TEXT NULL,
  ADD COLUMN IF NOT EXISTS cidade TEXT NULL,
  ADD COLUMN IF NOT EXISTS observacoes TEXT NULL,
  ADD COLUMN IF NOT EXISTS permissoes JSONB DEFAULT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_tipo_vinculo_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_tipo_vinculo_check
      CHECK (tipo_vinculo IN ('agente_registro', 'parceiro', 'vendedor', 'contador', 'usuario_comum'));
  END IF;
END $$;

UPDATE public.profiles
SET
  tipo_vinculo = COALESCE(
    tipo_vinculo,
    CASE
      WHEN perfil = 'agente_registro' THEN 'agente_registro'
      WHEN perfil = 'vendedor' THEN 'vendedor'
      ELSE 'usuario_comum'
    END
  ),
  permissoes = COALESCE(
    permissoes,
    CASE perfil
      WHEN 'admin' THEN '["dashboard","comercial","chat","renovacoes","financeiro","relatorios","parceiros","configuracoes"]'::jsonb
      WHEN 'agente_registro' THEN '["dashboard","comercial","chat","renovacoes"]'::jsonb
      WHEN 'vendedor' THEN '["dashboard","comercial","parceiros","relatorios"]'::jsonb
      ELSE '["dashboard","relatorios"]'::jsonb
    END
  );

-- 2. Tabela de configuracoes gerais da plataforma
CREATE TABLE IF NOT EXISTS public.app_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_settings_select" ON public.app_settings;
CREATE POLICY "app_settings_select" ON public.app_settings
  FOR SELECT USING (true);

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

-- 3. Registro inicial das informacoes da agencia
INSERT INTO public.app_settings (key, value)
VALUES (
  'agency',
  '{
    "nome_agencia": "AR CERTI ID",
    "responsavel": "Alexandre Aparecido Mantovan",
    "telefone": "+55 11 9508-9218",
    "cidade": "São Paulo - SP"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4. Trigger de novos usuarios com permissoes iniciais
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

-- 5. Recarrega o schema cache usado pela API REST do Supabase/PostgREST
NOTIFY pgrst, 'reload schema';
