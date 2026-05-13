-- ================================================================
-- CHAT KANBAN SCHEMA - CRM CERTIFICACAO DIGITAL
-- Execute no Supabase SQL Editor depois do auth_schema.sql
-- ================================================================

ALTER TABLE public.leads_contabilidade
  ALTER COLUMN status TYPE TEXT USING status::text;

CREATE TABLE IF NOT EXISTS public.chat_kanban_columns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status_key  TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#3B82F6',
  bg          TEXT NOT NULL DEFAULT 'bg-blue-50 dark:bg-blue-900/10',
  border      TEXT NOT NULL DEFAULT 'border-blue-200 dark:border-blue-800',
  ordem       INTEGER NOT NULL DEFAULT 0,
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.set_updated_at_chat_kanban_columns()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS chat_kanban_columns_set_updated_at ON public.chat_kanban_columns;
CREATE TRIGGER chat_kanban_columns_set_updated_at
  BEFORE UPDATE ON public.chat_kanban_columns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_chat_kanban_columns();

ALTER TABLE public.chat_kanban_columns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_kanban_columns_select" ON public.chat_kanban_columns;
DROP POLICY IF EXISTS "chat_kanban_columns_write_admin" ON public.chat_kanban_columns;
CREATE POLICY "chat_kanban_columns_select" ON public.chat_kanban_columns
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "chat_kanban_columns_write_admin" ON public.chat_kanban_columns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND perfil = 'admin' AND status = 'ativo')
  );

INSERT INTO public.chat_kanban_columns (status_key, label, color, bg, border, ordem, ativo) VALUES
  ('iniciou_conversa', 'Iniciou Conversa', '#F59E0B', 'bg-yellow-50 dark:bg-yellow-900/10', 'border-yellow-200 dark:border-yellow-800', 1, TRUE),
  ('conversando', 'Conversando', '#3B82F6', 'bg-blue-50 dark:bg-blue-900/10', 'border-blue-200 dark:border-blue-800', 2, TRUE),
  ('agendado', 'Agendado', '#10B981', 'bg-green-50 dark:bg-green-900/10', 'border-green-200 dark:border-green-800', 3, TRUE),
  ('cliente', 'Cliente', '#8B5CF6', 'bg-purple-50 dark:bg-purple-900/10', 'border-purple-200 dark:border-purple-800', 4, TRUE),
  ('follow_up', 'Follow Up', '#F97316', 'bg-orange-50 dark:bg-orange-900/10', 'border-orange-200 dark:border-orange-800', 5, TRUE),
  ('cancelou_agendamento', 'Cancelou Agendamento', '#EF4444', 'bg-red-50 dark:bg-red-900/10', 'border-red-200 dark:border-red-800', 6, TRUE),
  ('perdido', 'Perdido', '#6B7280', 'bg-gray-50 dark:bg-gray-800/30', 'border-gray-200 dark:border-gray-700', 7, TRUE)
ON CONFLICT (status_key) DO NOTHING;
