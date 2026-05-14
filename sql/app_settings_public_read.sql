-- Permite que a tela de login leia as configuracoes visuais sem autenticacao
-- Execute no Supabase SQL Editor

DROP POLICY IF EXISTS "app_settings_select" ON public.app_settings;

CREATE POLICY "app_settings_select" ON public.app_settings
  FOR SELECT USING (true);
