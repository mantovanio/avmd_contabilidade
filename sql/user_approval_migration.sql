-- ================================================================
-- USER APPROVAL MIGRATION — CertiID
-- Execute no Supabase SQL Editor para exigir liberacao do admin
-- no primeiro acesso de novos cadastros publicos.
-- ================================================================

-- Novos perfis passam a nascer inativos por padrao.
ALTER TABLE public.profiles ALTER COLUMN status SET DEFAULT 'inativo';

-- Somente administradores podem alterar perfil/status.
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

-- Ignora qualquer perfil enviado no cadastro publico e cria o usuario
-- como "usuario" aguardando liberacao.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, perfil, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    'usuario',
    'inativo'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
