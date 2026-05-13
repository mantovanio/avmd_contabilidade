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
  status     TEXT NOT NULL DEFAULT 'ativo'
             CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ler todos os perfis
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Usuário edita o próprio perfil; admin edita qualquer um
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin'
    )
  );

-- 3. Trigger: cria perfil automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, perfil)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'perfil', 'usuario')
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
