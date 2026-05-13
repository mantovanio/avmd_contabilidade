import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvfrhfiaprdtwxxplngk.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZnJoZmlhcHJkdHd4eHBsbmdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYzODc4NywiZXhwIjoyMDkwMjE0Nzg3fQ.4vem_8CmJ9adeLm05Y9bY9Ef20cna7RXThagNgX_gj4'

// Cliente com service_role — bypassa RLS e permite gerenciar usuários (admin only)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
